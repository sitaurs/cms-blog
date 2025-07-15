# Blog CMS - Panduan Lengkap Instalasi, Deployment, dan Penggunaan

## Daftar Isi

1. [Pendahuluan](#pendahuluan)
2. [Persyaratan Sistem](#persyaratan-sistem)
3. [Instalasi di VPS Ubuntu](#instalasi-di-vps-ubuntu)
   - [Langkah 1: Install Node.js dan MongoDB](#langkah-1-install-nodejs-dan-mongodb)
   - [Langkah 2: Instalasi Dependencies](#langkah-2-instalasi-dependencies)
   - [Langkah 3: Konfigurasi .env](#langkah-3-konfigurasi-env)
   - [Langkah 4: Menjalankan Backend & Frontend](#langkah-4-menjalankan-backend--frontend)
4. [Konfigurasi](#konfigurasi)
   - [Variabel Lingkungan](#variabel-lingkungan)
5. [Menjalankan Aplikasi](#menjalankan-aplikasi)
   - [Mode Pengembangan](#mode-pengembangan)
   - [Mode Produksi](#mode-produksi)
6. [Deployment](#deployment)
   - [Menggunakan PM2](#menggunakan-pm2)
   - [Konfigurasi Nginx Reverse Proxy](#konfigurasi-nginx-reverse-proxy)
   - [Sertifikat SSL](#sertifikat-ssl)
   - [Deployment dengan Docker](#deployment-dengan-docker)
7. [Fitur dan Penggunaan](#fitur-dan-penggunaan)
   - [Autentikasi Pengguna](#autentikasi-pengguna)
   - [Manajemen Postingan](#manajemen-postingan)
   - [Optimasi SEO](#optimasi-seo)
   - [Editor Teks Kaya](#editor-teks-kaya)
   - [Pencarian Lanjutan](#pencarian-lanjutan)
   - [Komentar dan Moderasi](#komentar-dan-moderasi)
   - [Peran dan Izin Pengguna](#peran-dan-izin-pengguna)
   - [Analitik dan Monitoring](#analitik-dan-monitoring)
   - [Fitur Monetisasi](#fitur-monetisasi)
8. [Dokumentasi API](#dokumentasi-api)
9. [Pemecahan Masalah](#pemecahan-masalah)
10. [Kontribusi](#kontribusi)
11. [Lisensi](#lisensi)
12. [Dukungan](#dukungan)
13. [Roadmap](#roadmap)

---

## Pendahuluan

Blog CMS ini adalah sistem manajemen konten modern yang lengkap, dibangun menggunakan React, TypeScript, Node.js, dan MongoDB. Mendukung fitur SEO canggih, editor teks kaya, autentikasi pengguna, komentar, analitik, dan opsi monetisasi.

---

## Persyaratan Sistem

- Ubuntu 20.04 atau versi lebih baru
- Node.js v18 atau lebih baru
- npm v9 atau lebih baru
- MongoDB 5.0 atau lebih baru
- PM2 (untuk manajemen proses)
- Nginx (untuk reverse proxy)

---

## Instalasi di VPS Ubuntu

### Langkah 1: Install Node.js dan MongoDB

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs mongodb-org
sudo systemctl enable --now mongod
```

### Langkah 2: Instalasi Dependencies

```bash
npm install
cd server && npm install
```

### Langkah 3: Konfigurasi .env

```bash
cp server/.env.example server/.env
# Sunting nilai variabel sesuai kebutuhan
```

### Langkah 4: Menjalankan Backend & Frontend

```bash
# Terminal 1
cd server
npm run dev

# Terminal 2
npm run dev
```

---

## Konfigurasi

### Variabel Lingkungan

Buat file `.env` di direktori `server` (salin dari `.env.example`) dengan variabel berikut:

```
MONGODB_URI=mongodb://localhost:27017/blog-cms
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

Sesuaikan nilai sesuai kebutuhan.

---

## Menjalankan Aplikasi

### Mode Pengembangan

```bash
# Terminal 1
cd server
npm run dev

# Terminal 2
npm run dev
```

Backend tersedia di `http://localhost:5000` dan frontend di `http://localhost:3000`

### Mode Produksi

Build dan jalankan aplikasi:

```bash
cd server
npm run build
pm2 start dist/server.js --name blog-cms-backend
```

---

## Deployment

### Menggunakan PM2

1. Install PM2 secara global:

```bash
sudo npm install -g pm2
```

2. Jalankan aplikasi dengan PM2:

```bash
pm2 start dist/server.js --name blog-cms-backend
pm2 save
pm2 startup
```

### Konfigurasi Nginx Reverse Proxy

Buat file konfigurasi Nginx:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Restart Nginx:

```bash
sudo systemctl restart nginx
```

### Sertifikat SSL

Pasang sertifikat SSL dengan Certbot:

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### Deployment dengan Docker

1. Build Docker images:

```bash
cd server
docker build -t blog-cms-backend .

cd ../src
docker build -t blog-cms-frontend .
```

2. Jalankan dengan Docker Compose:

```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:5.0
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

  backend:
    build: ./server
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/blog-cms
      - JWT_SECRET=your_jwt_secret_key
    depends_on:
      - mongodb

  frontend:
    build: ./src
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  mongodb_data:
```

Jalankan:

```bash
docker-compose up -d
```

---

## Fitur dan Penggunaan

### Autentikasi Pengguna

- Registrasi, login, dan manajemen profil pengguna.
- Endpoint API: `/api/auth/register`, `/api/auth/login`, `/api/auth/profile`

### Manajemen Postingan

- Membuat, mengedit, menghapus, dan menampilkan postingan.
- Endpoint API: `/api/posts`

### Optimasi SEO

- Pengaturan judul SEO, deskripsi, dan kata kunci untuk setiap postingan.

### Editor Teks Kaya

- Editor teks dengan fitur format lengkap untuk membuat konten postingan.

### Pencarian Lanjutan

- Fitur pencarian dengan filter dan analisis SEO.

### Komentar dan Moderasi

- Menambahkan, mengedit, dan menghapus komentar dengan status moderasi.

### Peran dan Izin Pengguna

- Role-based access control: admin, editor, pembaca.

### Analitik dan Monitoring

- Statistik pengunjung dan interaksi pengguna.

### Fitur Monetisasi

- Opsi monetisasi untuk konten dan iklan.

---

## Dokumentasi API

### Autentikasi

- `POST /api/auth/register` - Registrasi pengguna baru
- `POST /api/auth/login` - Login pengguna
- `GET /api/auth/profile` - Mendapatkan profil pengguna
- `PUT /api/auth/profile` - Memperbarui profil pengguna

### Postingan

- `GET /api/posts` - Mendapatkan semua postingan (dengan filter)
- `GET /api/posts/:id` - Mendapatkan postingan tunggal
- `POST /api/posts` - Membuat postingan baru
- `PUT /api/posts/:id` - Memperbarui postingan
- `DELETE /api/posts/:id` - Menghapus postingan
- `GET /api/posts/featured` - Mendapatkan postingan unggulan

### Komentar

- `GET /api/comments` - Mendapatkan komentar
- `POST /api/comments` - Membuat komentar
- `PUT /api/comments/:id/status` - Memperbarui status komentar
- `DELETE /api/comments/:id` - Menghapus komentar

---

## Model Database

### User

```typescript
{
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'editor' | 'reader';
  avatar?: string;
  bio?: string;
  isActive: boolean;
  isEmailVerified: boolean;
}
```

### Post

```typescript
{
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  author: ObjectId;
  category: ObjectId;
  tags: ObjectId[];
  status: 'draft' | 'published' | 'archived';
  publishedAt?: Date;
  views: number;
  likes: number;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  isFeature: boolean;
  allowComments: boolean;
}
```

### Comment

```typescript
{
  content: string;
  author: ObjectId;
  post: ObjectId;
  parentComment?: ObjectId;
  status: 'pending' | 'approved' | 'rejected';
  likes: number;
  replies: ObjectId[];
}
```

---

## Fitur Keamanan

- Autentikasi token JWT
- Hashing password dengan Bcrypt
- Validasi dan sanitasi input
- Pembatasan rate
- Konfigurasi CORS
- Header keamanan Helmet
- Kontrol akses berbasis peran
- Proteksi XSS

---

## Optimasi Performa

- Optimasi dan kompresi gambar
- Lazy loading
- Code splitting
- Strategi caching
- Indexing database
- Pagination
- Optimasi pencarian

---

## Testing

### Backend Testing

```bash
cd server
npm test
```

### Frontend Testing

```bash
cd src
npm test
```

### E2E Testing

```bash
npm run test:e2e
```

---

## Kontribusi

1. Fork repository
2. Buat branch fitur
3. Commit perubahan
4. Push ke branch
5. Buat Pull Request

---

## Lisensi

Proyek ini dilisensikan di bawah MIT License - lihat file LICENSE untuk detail.

---

## Dukungan

Untuk dukungan, email ke support@blogcms.com atau bergabung di channel Slack kami.

---

## Roadmap

- [ ] Dukungan multi-bahasa
- [ ] Analitik lanjutan
- [ ] Integrasi media sosial
- [ ] Sistem plugin
- [ ] Aplikasi mobile
- [ ] API GraphQL
- [ ] Kolaborasi real-time
- [ ] Alat SEO canggih
