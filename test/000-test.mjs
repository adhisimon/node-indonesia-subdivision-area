/* global describe it */

import should from 'should';
import { getById, getAll, getByNamePattern } from '../lib/index.mjs';

describe('#getById', () => {
  it('should return correct value', async () => {
    (await getById('provinces', '13')).name
      .should.equal('Sumatera Barat', '#4A4C4BC4');

    (await getById('cities', '11.04')).name
      .should.equal('Aceh Tengah', '#2B2303C7');

    (await getById('cities', '11.04')).parent_id
      .should.equal('11', '#31DCFEEB');

    (await getById('districts', '96.71.08')).name
      .should.equal('Klaurung', '#A845428B');

    (await getById('districts', '96.71.08')).parent_id
      .should.equal('96.71', '#C640E831');

    (await getById('subdistricts', '96.71.10.1001')).name
      .should.equal('Suprau', '#0751A83A');

    (await getById('subdistricts', '96.71.10.1001')).parent_id
      .should.equal('96.71.10', '#506B9D30');
  });

  describe('#getAll', () => {
    it('should return correct value (provinces)', async () => {
      const provinces = await getAll('provinces');
      provinces.length.should.equal(38, 'Jumlah provinsi harus 38 #7035B831');

      provinces.find((item) => item.name === 'Bengkulu').name.should.equal('Bengkulu', '#4D353835');
    });

    it('should return correct value (cities)', async () => {
      (await getAll('cities')).length.should.equal(514, 'Jumlah kab/kota harus 514', '#4706CA30');

      const cities = await getAll('cities', '11');
      const mismatchedParent = cities.find((item) => item.parent_id !== '11');
      should.not.exists(mismatchedParent, 'Parent id sesuai semua #0D5032C7');
    });

    it('should return correct value (districts)', async () => {
      (await getAll('districts')).length.should.equal(7277, 'Jumlah kecamatan harus 7277', '#15975D81');

      const districts = await getAll('districts', '12.12');
      const mismatchedParent = districts.find((item) => item.parent_id !== '12.12');
      should.not.exists(mismatchedParent, 'Parent id sesuai semua #43A104EF');
    });
  });

  describe('#getByNamePattern', () => {
    it('should return correct value', async () => {
      const result = await getByNamePattern('subdistricts', 'Simpang%', '11.01.02');
      should.exists(result?.[0]);
    });
  });
});
