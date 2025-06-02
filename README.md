# AnimeLens Backend - Note TEAM
ini memang saya pisah ya untuk depelopment, karna model belum selesai saya hanya bisa sampe sini, untuk menghubungkan upload image di detect saya letakan disini juga sementara untuk file nya yang sudah terhubung ke back-end, saya bingung untuk back-end jika model belum selesai, saya tidak bisa menguji nya secara front-end dan juga secara back-end, jika semuanya sudah selesai dari model baru nanti saya jadikan 1 repository full antara FrontEnd-BackEnd dan Model ML, jika bingung chat saya di WA ok. Terimakasih.
---
# AnimeLens Backend - Note TEAM Install
Untuk menggabungkan keduanya kalian bisa buat 1 folder baru lalu masukan folder Anime-Lens dan juga Folder Anime-Lens-Backend ya...
# AnimeLens Backend

Backend Express.js untuk proyek AnimeLens yang berfungsi sebagai penyimpanan sementara gambar untuk pemrosesan dan caching.

## Cara Menjalankan

1. Pastikan Node.js sudah terinstall di komputer Anda.
2. Buka terminal dan arahkan ke folder backend:
   ```
   cd Anime-Lens-BackEnd
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Jalankan server dalam mode development (dengan nodemon):
   ```
   npm run dev
   ```
   atau jalankan server biasa:
   ```
   npm start
   ```
5. Server akan berjalan di port 5000 secara default. Anda dapat mengubah port dengan menambahkan file `.env` dan variabel `PORT`.

## API Endpoints

- `POST /upload`  
  Upload satu file gambar dengan form-data key `image`.  
  Response: JSON dengan nama file yang disimpan.

- `GET /uploads/:filename`  
  Mengakses file gambar yang sudah diupload.

- `DELETE /upload/:filename`  
  Menghapus file gambar yang sudah diupload.

## Catatan

- Folder `uploads/` digunakan untuk menyimpan gambar sementara.
- Pastikan frontend mengakses backend sesuai dengan URL dan port yang benar.
