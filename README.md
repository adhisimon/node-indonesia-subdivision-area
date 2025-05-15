# node-indonesia-subdivision-area

**WORK IN PROGRESS**

Pustaka node.js untuk list daerah-daerah administratif Indonesia.

Data meliputi nama dan kode:
* provinsi
* kabupaten/kota
* kecamatan
* kelurahan

## Cara Install
```
npm i indonesia-subdivision-area
```

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
