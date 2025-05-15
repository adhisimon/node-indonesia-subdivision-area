# node-indonesia-subdivision-area

**WORK IN PROGRESS**

- [node-indonesia-subdivision-area](#node-indonesia-subdivision-area)
  - [Cara Install](#cara-install)
  - [Contoh Pemakaian](#contoh-pemakaian)
  - [API](#api)
    - [Tipe Data](#tipe-data)
      - [Obyek GenericRow](#obyek-genericrow)
    - [Methods](#methods)
      - [Method getById(tableName, id)](#method-getbyidtablename-id)
      - [Method getAll(tableName, parentId)](#method-getalltablename-parentid)
      - [Method getByNamePattern(tableName, parentId)](#method-getbynamepatterntablename-parentid)
  - [Histori Perubahan](#histori-perubahan)
  - [Lisensi](#lisensi)

Pustaka node.js untuk list daerah-daerah administratif Indonesia.

Sumber data:
- [indonesia-38-provinsi](https://github.com/alifbint/indonesia-38-provinsi). Big thanks bro!!!

Data meliputi nama dan kode:
* provinsi
* kabupaten/kota
* kecamatan
* kelurahan

## Cara Install
```
npm i indonesia-subdivision-area
```

## Contoh Pemakaian

## API

### Tipe Data
#### Obyek GenericRow
Properti:
* @property {string} id
* @property {string?} parent_id (null untuk tabel "provinces")
* @property {string} name

### Methods

#### Method getById(tableName, id)
* tableName: string "provinces"|"cities"|"districts"|"subdistricts"
* id: string

Mengembalikan sebuah obyek GenericRow.

#### Method getAll(tableName, parentId)
* tableName: string "provinces"|"cities"|"districts"|"subdistricts"
* parentId: string (opsional)

Mengembalikan sebuah array dari obyek GenericRow.

#### Method getByNamePattern(tableName, parentId)
* tableName: string "provinces"|"cities"|"districts"|"subdistricts"
* parentId: string (opsional)

Mengembalikan sebuah array dari obyek GenericRow.

## Histori Perubahan
Lihat file [CHANGELOG.md](CHANGELOG.md).

## Lisensi
Pustaka ini dilisensikan dalam Lisensi MIT. Lihat file [LICENSE](LICENSE).
