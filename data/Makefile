all: MD5SUM

MD5SUM: provinsi.csv kabupaten_kota.csv kecamatan.csv kelurahan.csv
	cp -v MD5SUM MD5SUM.old
	md5sum *.csv > MD5SUM

provinsi.csv:
	curl -o provinsi.csv \
		https://raw.githubusercontent.com/alifbint/indonesia-38-provinsi/refs/heads/main/provinsi.csv

kabupaten_kota.csv:
	curl -o kabupaten_kota.csv \
		https://raw.githubusercontent.com/alifbint/indonesia-38-provinsi/refs/heads/main/kabupaten_kota.csv

kecamatan.csv:
	curl -o kecamatan.csv \
		https://raw.githubusercontent.com/alifbint/indonesia-38-provinsi/refs/heads/main/kecamatan.csv

kelurahan.csv:
	curl -o kelurahan.csv \
		https://raw.githubusercontent.com/alifbint/indonesia-38-provinsi/refs/heads/main/kelurahan.csv

clean:
	rm -fv \
		MD5SUM MD5SUM.old \
		provinsi.csv kabupaten_kota.csv kecamatan.csv kelurahan.csv \
		data.sqlite3*
