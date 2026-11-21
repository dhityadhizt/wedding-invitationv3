# Panduan Setup Live Photo Sharing (Google Drive & Spreadsheet)

## 1. Struktur Folder & File Baru
- `Code.gs`: Script backend Google Apps Script untuk menerima unggahan foto PNG ke folder Google Drive (`10VPVOU3KRLyrHAyxUUFLO67C68ICidWm`), mencatat log foto ke Spreadsheet, dan tetap menangani Ucapan & Doa (RSVP).
- `src/services/galleryService.js`: Service JavaScript untuk mengambil dan mengunggah foto PNG secara real-time.
- `src/js/galeri.js` & `src/css/galeri.css`: UI Live Camera (switch kamera depan/belakang, capture PNG lossless, preview, dan auto-sync ke carousel galeri).

## 2. Langkah Penerapan di Google Spreadsheet & Apps Script
1. Buka **Google Spreadsheet** yang terhubung dengan undangan Anda (atau buat Spreadsheet baru di Google Drive).
2. Buat 2 tab sheet di bagian bawah:
   - Tab 1: beri nama **`Ucapan`** (kolom A1:F1 -> `id`, `name`, `status`, `message`, `date`, `color`)
   - Tab 2: beri nama **`LiveGaleri`** (kolom A1:F1 -> `ID`, `Waktu`, `Nama Tamu`, `Nama File`, `Image URL`, `Drive Link`)
3. Klik menu **Ekstensi (Extensions) > Apps Script**.
4. Hapus seluruh kode bawaan di editor Apps Script, lalu salin-tempel seluruh isi file **`Code.gs`** dari dalam folder ZIP ini.
5. Pastikan baris `const FOLDER_ID = '10VPVOU3KRLyrHAyxUUFLO67C68ICidWm';` sudah sesuai dengan folder Google Drive Anda.
6. Klik ikon **Simpan (Save)** (`Ctrl + S`).

## 3. Langkah Deploy Web App & Izin Akses Drive
1. Klik tombol biru **Terapkan (Deploy) > Deployment baru (New deployment)**.
2. Pada bagian *Pilih jenis (Select type)*, klik ikon roda gigi dan pilih **Aplikasi web (Web app)**.
3. Isi konfigurasi berikut:
   - **Deskripsi**: `Wedding Live Gallery & RSVP v1`
   - **Jalankan sebagai (Execute as)**: **Saya (Me)** *(wajib, agar foto tamu masuk ke akun Drive Anda)*
   - **Yang memiliki akses (Who has access)**: **Siapa saja (Anyone)** *(wajib, agar tamu tidak perlu login Google saat mengunggah foto)*
4. Klik **Terapkan (Deploy)**.
5. Jika muncul popup **Otorisasi akses (Authorize access)**, pilih akun Google Anda -> klik **Lanjutan (Advanced)** -> klik **Buka ... (tidak aman)** -> klik **Izinkan (Allow)**.
6. Salin **URL Aplikasi Web** yang muncul (`https://script.google.com/macros/s/...../exec`).

## 4. Menghubungkan URL ke Website Undangan
1. Buka file `src/assets/data/data.js`.
2. Ganti nilai properti `api` dengan URL Web App baru yang barusan Anda salin:
   ```javascript
   api: 'https://script.google.com/macros/s/URL_BARU_ANDA/exec',
   ```
3. Upload seluruh isi folder proyek ke repository GitHub Pages Anda.
