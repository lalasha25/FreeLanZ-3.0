# FreelanZ Backend API

Backend API untuk platform FreelanZ — menghubungkan freelancer dan client dalam satu ekosistem terintegrasi.

---

## Tech Stack
- **Framework:** NestJS 11
- **Database ORM:** Prisma 7
- **Database:** MySQL / MariaDB
- **Autentikasi:** JWT + Passport & bcrypt
- **Penyimpanan:** Multer (File Upload)

---

## Instalasi & Menjalankan Aplikasi

### 1. Install Dependencies
```bash
npm install
```

### 2. Sinkronisasi Database
```bash
npx prisma generate
npx prisma migrate dev
```

### 3. Jalankan Server
```bash
# Mode Development
npm run start:dev

# Mode Production
npm run build
npm run start:prod
```
> Server akan berjalan di: **`http://localhost:5000/api`**

---

## API Endpoints

### Autentikasi (`/api/auth`)
* `POST /auth/register/client` - Register Client
* `POST /auth/register/freelancer` - Register Freelancer
* `POST /auth/login` - Login
* `GET /auth/profile` - Profile User (Auth)
* `PUT /auth/profile` - Update Profile (Auth)
* `PUT /auth/change-password` - Ganti Password (Auth)

### Portfolio (`/api/portfolio`)
* `POST /portfolio` - Tambah Portofolio (Auth: Freelancer)
* `GET /portfolio` - List Semua Portofolio
* `GET /portfolio/me` - Portofolio Saya (Auth: Freelancer)
* `GET /portfolio/freelancer/:freelancerId` - Portofolio milik Freelancer tertentu
* `GET /portfolio/:id` - Detail Portofolio
* `PUT /portfolio/:id` - Edit Portofolio (Auth: Freelancer)
* `DELETE /portfolio/:id` - Hapus Portofolio (Auth: Freelancer)

### Project Request (`/api/request`)
* `POST /request` - Buat Request Project (Auth: Client)
* `GET /request` - Lihat Semua Request (Auth)
* `GET /request/client` - Request Saya sebagai Client (Auth: Client)
* `GET /request/freelancer` - Request Saya sebagai Freelancer (Auth: Freelancer)
* `PATCH /request/:id/status` - Update Status Request (Auth: Freelancer)

### Chat (`/api/chat`)
* `POST /chat` - Kirim Pesan Chat (Auth)
* `GET /chat` - List Chat Room/Pesan (Auth)
* `GET /chat/:requestId` - Detail Chat per Request (Auth)

### Upload (`/api/upload`)
* `POST /upload/id-photo` - Upload Foto KTP (Auth, max 5MB)
* `POST /upload/cv` - Upload CV (Auth, max 5MB)
* `POST /upload/portfolio` - Upload Gambar Portofolio (Auth, max 5MB)

### User (`/api/user`)
* `GET /user/freelancers` - List Semua Freelancer
* `GET /user/clients` - List Semua Client
* `GET /user/:id` - Detail User (Auth)

---

## Contoh Request Body (JSON)

### Register Client (`POST /auth/register/client`)
```json
{
  "name": "Budi Client",
  "email": "budi@client.com",
  "password": "password123",
  "phone": "08123456789"
}
```

### Register Freelancer (`POST /auth/register/freelancer`)
```json
{
  "name": "Joko Freelancer",
  "email": "joko@freelancer.com",
  "password": "password123",
  "phone": "08987654321",
  "bio": "Fullstack Web Developer",
  "skills": "React, NestJS, Node.js"
}
```

### Login (`POST /auth/login`)
```json
{
  "email": "budi@client.com",
  "password": "password123"
}
```

### Tambah Portofolio (`POST /portfolio`)
```json
{
  "title": "E-Commerce App",
  "description": "Membangun sistem e-commerce berskala besar.",
  "imageUrl": "https://example.com/image.png",
  "projectUrl": "https://github.com/example/ecommerce"
}
```

### Buat Request Project (`POST /request`)
```json
{
  "title": "Pembuatan Web Company Profile",
  "description": "Membutuhkan web responsif dengan performa tinggi.",
  "budget": 5000000,
  "freelancerId": 2
}
```

### Update Status Request (`PATCH /request/:id/status`)
```json
{
  "status": "ACCEPTED"
}
```
> **Pilihan Status:** `PENDING`, `ACCEPTED`, `REJECTED`, `IN_PROGRESS`, `COMPLETED`

### Kirim Pesan Chat (`POST /chat`)
```json
{
  "requestId": 1,
  "message": "Halo, apakah project ini bisa selesai dalam 2 minggu?"
}
```

---

## Kontributor
- **Elisha Natasha**
- Team FreelanZ