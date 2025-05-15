import fs from 'node:fs';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { parse } from 'csv-parse';
import winston from 'winston';

const MILLISECONDS_DELAY_BETWEEN_PROGRESS_REPORT = 10 * 1000;

const logger = winston.createLogger({
  level: 'debug',
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.metadata(),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
        winston.format.colorize(),
        winston.format.printf(
          (info) => [
            info.timestamp,
            info.label,
            info.level,
            info.message,
            Object.keys(info.metadata).length ? JSON.stringify(info.metadata) : ''
          ].filter((item) => item).join(' ').trim()
        )
      )
    })
  ]
});

sqlite3.verbose();

let totalDataCount = 0;
const startTime = new Date();

const importProvinces = async () => {
  const functionStartTime = new Date();

  const parser = fs
    .createReadStream('provinsi.csv')
    .pipe(parse({ columns: true }));

  let i = 0;
  for await (const record of parser) {
    const query = 'INSERT INTO provinces (id, name) VALUES (?, ?)';
    const values = [
      record.id,
      record.name
    ];

    await db.run(query, values);
    i += 1;
  }

  logger.verbose('Provinces imported', {
    count: i,
    functionElapsedInSeconds: Math.round((new Date() - functionStartTime) / 1000)
  });

  totalDataCount += i;
};

const importCities = async () => {
  const functionStartTime = new Date();

  const parser = fs
    .createReadStream('kabupaten_kota.csv')
    .pipe(parse({ columns: true }));

  let i = 0;
  for await (const record of parser) {
    const query = 'INSERT INTO cities (id, parent_id, name) VALUES (?, ?, ?)';

    const [parentId] = record.id.split(/\./);

    const values = [
      record.id,
      parentId,
      record.name
    ];

    await db.run(query, values);
    i += 1;
    totalDataCount += i;
  }

  logger.verbose('Cities imported', {
    count: i,
    functionElapsedInSeconds: Math.round((new Date() - functionStartTime) / 1000)
  });
};

const importDistricts = async () => {
  const parser = fs
    .createReadStream('kecamatan.csv')
    .pipe(parse({ columns: true }));

  const functionStartTime = new Date();
  let i = 0;
  let lastProgress = i;
  let progressStartTime = functionStartTime;

  const progressTimer = setInterval(() => {
    logger.verbose('Still importing districts', {
      inserted: i,
      insertPerSeconds: Math.round((1000 * (i - lastProgress)) / (new Date() - progressStartTime))
    });

    lastProgress = i;
    progressStartTime = new Date();
  }, MILLISECONDS_DELAY_BETWEEN_PROGRESS_REPORT);

  for await (const record of parser) {
    const query = 'INSERT INTO districts (id, parent_id, name) VALUES (?, ?, ?)';

    const [provinceId, cityId] = record.id.split(/\./);
    const parentId = [provinceId, cityId].join('.');

    const values = [
      record.id,
      parentId,
      record.name
    ];

    try {
      await db.run(query, values);
      i += 1;
    } catch (e) {
      logger.error('EXCEPTION ON importDistricts', {
        eCode: e.code,
        eMessage: e.message || e.toString(),
        record,
        parentId
      });

      process.exit(1);
    }
  }

  clearInterval(progressTimer);

  logger.verbose('Districts imported', {
    count: i,
    functionElapsedInSeconds: Math.round((new Date() - functionStartTime) / 1000)
  });

  totalDataCount += i;
};

const importSubdistricts = async () => {
  const parser = fs
    .createReadStream('kelurahan.csv')
    .pipe(parse({ columns: true }));

  const functionStartTime = new Date();
  let i = 0;
  let lastProgress = i;
  let progressStartTime = functionStartTime;

  const progressTimer = setInterval(() => {
    logger.verbose('Still importing subdistricts', {
      inserted: i,
      insertPerSeconds: Math.round((1000 * (i - lastProgress)) / (new Date() - progressStartTime))
    });

    lastProgress = i;
    progressStartTime = new Date();
  }, MILLISECONDS_DELAY_BETWEEN_PROGRESS_REPORT);

  for await (const record of parser) {
    const query = 'INSERT INTO subdistricts (id, parent_id, name) VALUES (?, ?, ?)';

    const [provinceId, cityId, districtId] = record.id.split(/\./);
    const parentId = [provinceId, cityId, districtId].join('.');

    const values = [
      record.id,
      parentId,
      record.name
    ];

    try {
      await db.run(query, values);
      i += 1;
    } catch (e) {
      logger.warn('EXCEPTION ON importSubdistricts', {
        record,
        parentId,
        eCode: e.code,
        eMessage: e.message || e.toString()
      });

      // process.exit(1);
    }
  }

  clearInterval(progressTimer);

  logger.verbose('Subdistricts imported', {
    count: i,
    functionElapsedInSeconds: Math.round((new Date() - functionStartTime) / 1000)
  });

  totalDataCount += i;
};

logger.info('Opening database...');
const db = await open({
  filename: 'data.sqlite3',
  driver: sqlite3.Database
});

await db.run('PRAGMA journal_mode="off"');
logger.verbose('Checking PRAGMA journal_mode', {
  val: await db.get('PRAGMA journal_mode')
});

logger.info('Creating schemas...');
await db.migrate({});

// logger.verbose('Checking PRAGMA foreign keys', {
//   val: await db.get('PRAGMA foreign_keys')
// });

// logger.info('Disabling foreign key check');
// await db.run('PRAGMA foreign_keys = 0');

// logger.verbose('Checking PRAGMA foreign keys', {
//   val: await db.get('PRAGMA foreign_keys')
// });

logger.info('Importing provinces...');
await importProvinces();

logger.info('Importing cities...');
await importCities();

logger.info('Importing districts...');
await importDistricts();

logger.info('Importing subdistricts...');
await importSubdistricts();

logger.info('Import finished', {
  totalDataCount,
  elapsedSeconds: Math.round((new Date() - startTime) / 1000)
});

// logger.info('Enabling foreign key check');
// await db.run('PRAGMA foreign_keys = 1');

logger.verbose('Closing database...');
await db.close();

logger.info('Done');
