# RetroVault

PWA katalog koleksi game klasik dengan Next.js App Router, TypeScript, Tailwind CSS, PostgreSQL langsung melalui `pg`, serta Cloudinary untuk foto.

## Menjalankan aplikasi

1. Buat project Supabase, buka **SQL Editor**, lalu jalankan isi `sql/schema.sql` terlebih dahulu dan `sql/seed.sql` sesudahnya.
2. Salin `.env.example` ke `.env.local`, lalu isi `DATABASE_URL` dan kredensial Cloudinary.
3. Jalankan `npm install`, kemudian `npm run dev` dan buka `http://localhost:3000`.

API mengakses PostgreSQL lewat parameterized query (`pg`). `DATABASE_URL` dan kredensial Cloudinary hanya digunakan server. Untuk memulai katalog, tambahkan pabrikan dengan `POST /api/manufacturers` berisi `{ "name": "Sony", "country": "Jepang", "founded_year": 1946 }`, lalu tambahkan konsol lewat `POST /api/consoles` (multipart form dengan `manufacturer_id`, `name`, `release_year`, dan opsional `image`).

## API utama

- `GET/POST /api/manufacturers`, `GET/PUT/DELETE /api/manufacturers/:id`
- `GET/POST /api/consoles`, `GET/PUT/DELETE /api/consoles/:id`
- `GET/POST /api/games`, `GET/PUT/DELETE /api/games/:id`
- `GET/POST /api/games/:id/transactions`, `PUT/DELETE /api/games/:id/transactions/:transactionId`
- `GET/POST /api/games/:id/reviews`, `PUT/DELETE /api/games/:id/reviews/:reviewId`
- `GET /api/dashboard`

Form game di `/games` mengirim `FormData`; file diunggah di server ke Cloudinary. Ubah placeholder identitas pembuat pada halaman `/profile`. Service worker melakukan cache dasar untuk halaman dan melewati API.
