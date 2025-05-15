import { resolve as resolvePath } from 'node:path';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const db = await open({
  filename: resolvePath(import.meta.dirname, '../data/data.sqlite3'),
  driver: sqlite3.Database
});

/**
 * @typedef GenericRow
 * @type {Object}
 * @property {string} id
 * @property {string?} parent_id
 * @property {string} name
 */

/**
 *
 * @param {"provinces"|"cities"|"districts"|"subdistricts"} tableName
 * @param {string} id
 * @returns {Promise<GenericRow>}
 */
const getById = async (tableName, id) => {
  const query = `SELECT * FROM ${tableName}  WHERE id = ?`;
  const values = [
    id
  ];

  const result = await db.get(query, values);
  return result;
};

/**
 *
 * @param {"provinces"|"cities"|"districts"|"subdistricts"} tableName
 * @param {string?} parentId
 * @returns {Promise<GenericRow[]>}
 */
const getAll = async (tableName, parentId) => {
  const values = [];
  const conditions = ['1'];

  if (parentId) {
    conditions.push('parent_id = ?');
    values.push(parentId);
  }

  const query = `SELECT * FROM ${tableName} WHERE ${conditions.join(' AND ')}`;

  const result = await db.all(query, values);
  return result;
};

/**
 *
 * @param {"provinces"|"cities"|"districts"|"subdistricts"} tableName
 * @param {string} areaName - potongan nama area, gunakan % untuk wildcard seperti di sintaks SQL
 * @param {string?} parentId - parent id (opsional)
 * @returns {Promise<GenericRow[]>}
 */
const getByNamePattern = async (tableName, areaName, parentId) => {
  const values = [areaName];
  const conditions = ['name LIKE ?'];

  if (parentId) {
    conditions.push('parent_id = ?');
    values.push(parentId);
  }

  const query = `SELECT * FROM ${tableName} WHERE ${conditions.join(' AND ')}`;
  const result = await db.all(query, values);
  return result;
};

export {
  getById,
  getAll,
  getByNamePattern
};
