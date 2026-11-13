# RetroVault

RetroVault adalah Progressive Web App untuk mengelola inventaris game konsol klasik. Aplikasi menyediakan dashboard nilai koleksi, katalog game dan konsol, riwayat transaksi, ulasan, serta foto produk yang disimpan di Cloudinary.

## Identitas Proyek

- **Nama:** RetroVault
- **Dibuat oleh:** Ahmad Dika Styansah
- **NIM:** 21120124130052
- **Kelompok:** 23
- **Tahun:** 2026

## Teknologi

- Next.js 14 App Router dan React 18
- TypeScript dan Tailwind CSS
- PostgreSQL Supabase, diakses langsung dengan `pg` dan query berparameter
- Cloudinary untuk penyimpanan gambar
- PWA: Web App Manifest, service worker, splash screen, dan alur instalasi

## Persyaratan

- Node.js 18.17 atau lebih baru
- npm
- Project Supabase dengan akses PostgreSQL
- Akun Cloudinary untuk unggahan gambar

## Menjalankan secara lokal

1. Clone repository dan masuk ke folder proyek.
2. Di **Supabase Dashboard → SQL Editor**, jalankan `sql/schema.sql` terlebih dahulu, kemudian `sql/seed.sql` untuk memasukkan data contoh.
3. Salin `.env.example` menjadi `.env.local` dan isi variabel environment.
4. Pasang dependency dan jalankan server pengembangan:

   ```bash
   npm install
   npm run dev
   ```

5. Buka `http://localhost:3000`.

## Environment variables

| Nama | Kegunaan |
|---|---|
| `DATABASE_URL` | Connection string PostgreSQL Supabase. Untuk Vercel gunakan Session pooler, termasuk username, port, dan password database. |
| `CLOUDINARY_URL` | URL koneksi Cloudinary untuk upload dan penghapusan gambar. Alternatifnya isi `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, dan `CLOUDINARY_API_SECRET`. |
| `SUPABASE_URL` | URL project Supabase, tersedia untuk integrasi Supabase lain. |
| `SUPABASE_PUBLISHABLE_KEY` | Publishable key. Aplikasi ini saat ini memakai koneksi PostgreSQL `pg`, bukan Supabase browser client. |
| `NEXT_PUBLIC_APP_URL` | Alamat aplikasi, misalnya `http://localhost:3000` atau domain deployment. |

Jangan commit `.env.local` atau kredensial rahasia. File tersebut sudah dikecualikan melalui `.gitignore`. Jangan menaruh password database atau Cloudinary API secret di variabel `NEXT_PUBLIC_*`.

## Database

`sql/schema.sql` membuat lima tabel dan indeks relasi:

1. `manufacturers` — pabrikan konsol.
2. `consoles` — konsol dan relasi ke pabrikan.
3. `games` — game dan relasi ke konsol.
4. `transactions` — status koleksi, wishlist, terjual, dan harga.
5. `game_reviews` — rating, status tamat, dan catatan.

`sql/seed.sql` menambahkan contoh Sony, Nintendo, Sega, konsol, game, transaksi, serta ulasan. Data game dan konsol demo memakai ilustrasi SVG lokal di `public/covers`, bukan URL layanan gambar pihak ketiga. Seed dapat dijalankan ulang tanpa menambahkan duplikat dan akan mengisi ulang URL cover demo. Jika seed lama sudah dijalankan, jalankan kembali `sql/seed.sql` setelah deploy versi repository yang menyertakan folder covers agar gambar tampil di website.

## Halaman aplikasi

- `/` — dashboard jumlah game, konsol, nilai aset, dan wishlist.
- `/games` — katalog dan form tambah game dengan unggah gambar.
- `/games/[id]` — detail game, transaksi, dan ulasan.
- `/consoles` — katalog konsol beserta pabrikan.
- `/consoles/[id]` — detail konsol dan game terkait.
- `/profile` — profil pembuat proyek.

Navigasi kapsul menyesuaikan desktop dan mobile. Di desktop, navigasi berada di bagian atas dan mengecil saat halaman digulir. Di mobile, navigasi menjadi dock di bagian bawah.

## REST API

Route Handlers Next.js menyediakan API berikut. Endpoint create game serta create/update game dan konsol menerima `multipart/form-data` untuk file gambar.

| Method | Endpoint | Fungsi |
|---|---|---|
| `GET`, `POST` | `/api/manufacturers` | Daftar dan tambah pabrikan |
| `GET`, `PUT`, `DELETE` | `/api/manufacturers/:id` | Baca, ubah, hapus pabrikan |
| `GET`, `POST` | `/api/consoles` | Daftar dan tambah konsol |
| `GET`, `PUT`, `DELETE` | `/api/consoles/:id` | Detail konsol beserta game, ubah, hapus |
| `GET`, `POST` | `/api/games` | Daftar dan tambah game |
| `GET`, `PUT`, `DELETE` | `/api/games/:id` | Detail game beserta transaksi/ulasan, ubah, hapus |
| `GET`, `POST` | `/api/games/:id/transactions` | Daftar dan tambah transaksi |
| `PUT`, `DELETE` | `/api/games/:id/transactions/:transactionId` | Ubah dan hapus transaksi |
| `GET`, `POST` | `/api/games/:id/reviews` | Daftar dan tambah ulasan |
| `PUT`, `DELETE` | `/api/games/:id/reviews/:reviewId` | Ubah dan hapus ulasan |
| `GET` | `/api/dashboard` | Statistik dashboard |

Contoh body tambah pabrikan:

```json
{ "name": "Sony", "country": "Jepang", "founded_year": 1946 }
```

Untuk membuat konsol, kirim `manufacturer_id`, `name`, `release_year`, dan opsional `image` sebagai form-data. Form game di `/games` mengirim file ke server; server mengunggah file ke Cloudinary dan menyimpan URL serta public ID ke PostgreSQL.

## PWA dan instalasi

Manifest ada di `/manifest.json`; ikon berada di `public/icons`. Service worker mendaftarkan cache dasar halaman dan melewati endpoint API. Browser yang mendukung instalasi menampilkan pilihan Install/Nanti dan prompt sistem setelah pengguna memilih Install. Di iOS, gunakan Safari → Bagikan → Tambah ke Layar Utama. Splash tampil saat aplikasi dimuat. Jika aplikasi sudah berjalan dalam standalone mode, dialog instalasi tidak ditampilkan.

Untuk mencoba install secara lokal, gunakan `localhost`; browser produksi memerlukan HTTPS. Vercel menyediakan HTTPS otomatis.

## Deploy ke Vercel

1. Push repository ke GitHub dan impor di Vercel.
2. Tambahkan environment variables di Project Settings. Minimal `DATABASE_URL` dan `CLOUDINARY_URL` harus valid.
3. Ambil connection string dari Supabase **Project Settings → Database → Connection string**. Untuk fungsi serverless Vercel gunakan **Session pooler**. Gunakan hostname persis dari Supabase, jangan menebaknya atau memakai publishable key sebagai password.
4. Deploy atau redeploy sesudah environment variables diperbarui.

Vercel mendeteksi Next.js secara otomatis; `vercel.json` khusus umumnya tidak diperlukan.

## Perintah npm

```bash
npm run dev     # server pengembangan
npm run build   # build produksi
npm run start   # jalankan build produksi
```
