# FreeLanZ - Platform Marketplace Freelancer

FreeLanZ adalah platform digital yang menghubungkan **Client** (pemberi kerja) dengan **Freelancer** (pekerja lepas). Platform ini dirancang menggunakan pendekatan **Modular Architecture** di sisi Backend dengan NestJS dan arsitektur berbasis komponen di sisi Frontend dengan ReactJS + Vite. 

Proyek ini dibuat untuk memenuhi tugas mata kuliah **Software Architecture**.

---

## 🏗️ Arsitektur Sistem & Struktur Folder

Proyek ini terbagi menjadi dua bagian utama:
1. **BackendFLZ**: RESTful API dibangun dengan **NestJS**, menggunakan **Prisma ORM** untuk interaksi dengan database **MySQL**.
2. **FrontendFLZ/FreeLanz**: Single Page Application (SPA) dibangun dengan **ReactJS 19**, menggunakan **Vite** sebagai bundler dan **Axios** untuk komunikasi HTTP ke backend.

### Struktur Folder
```text
FreeLanz 3.0/
├── BackendFLZ/                 # Folder Backend (NestJS)
│   ├── prisma/                 # Prisma schema dan migrasi database
│   ├── src/                    # Source code Backend
│   │   ├── auth/               # Modul autentikasi (JWT, Passport)
│   │   ├── chat/               # Modul chat real-time/messaging
│   │   ├── common/             # Guards, decorators, middleware global
│   │   ├── portfolio/          # Modul manajemen portofolio freelancer
│   │   ├── prisma/             # Prisma Service untuk koneksi DB
│   │   ├── request/            # Modul transaksi / request proyek
│   │   ├── upload/             # Modul untuk upload file (CV, Avatar, dll)
│   │   └── user/               # Modul profil dan list user
│   ├── package.json
│   └── tsconfig.json
│
├── FrontendFLZ/                # Folder Frontend (ReactJS + Vite)
│   └── FreeLanz/
│       ├── public/             # Static assets
│       ├── src/
│       │   ├── Client/         # Layar & logika untuk Client (Landing, Explore, Chat, Project, dll)
│       │   ├── Freelancer/     # Layar & logika untuk Freelancer (Dashboard, Feed, Order, dll)
│       │   ├── App.jsx         # Routing state-based dan entry point aplikasi
│       │   ├── api.js          # Konfigurasi Axios Interceptor (auto Bearer token)
│       │   └── index.css       # Global styling
│       └── package.json
│
└── README.md                   # Dokumentasi Utama
```

---

## 💻 Backend (BE) Documentation

Backend dikembangkan menggunakan **NestJS** dengan pola desain Modular yang solid. Setiap domain fungsional memiliki modulnya sendiri (`Module`, `Controller`, dan `Service`) guna mematuhi prinsip *Separation of Concerns* (SoC) dan *Single Responsibility Principle* (SRP).

### 🛠️ Tech Stack & Library Backend
- **Core Framework**: NestJS (v11)
- **Database ORM**: Prisma Client (v7)
- **Database Server**: MySQL / MariaDB
- **Security & Auth**: Passport JWT (`@nestjs/passport`, `@nestjs/jwt`, `bcrypt`)
- **Validation**: `class-validator` & `class-transformer` (validasi payload request secara ketat)
- **API Documentation**: Swagger (`@nestjs/swagger`)

### 🔑 Fitur Utama Backend
1. **Autentikasi (JWT Auth)**: Register Client & Freelancer dengan password hashing (bcrypt), serta validasi route menggunakan `JwtAuthGuard` dan `RolesGuard`.
2. **Manajemen Portofolio**: Freelancer dapat membuat, memperbarui, menampilkan, dan menghapus item portofolio mereka.
3. **Manajemen Request Proyek**:
   - Client dapat mengirimkan *Project Request* kepada Freelancer spesifik.
   - Mengelola status transisi proyek: `PENDING` ➔ `ACCEPTED`/`REJECTED` ➔ `IN_PROGRESS` ➔ `COMPLETED`.
4. **Chat System**: Layanan pertukaran pesan antar pengguna yang terikat langsung pada ID Project Request tertentu.
5. **Static & File Upload Service**: Upload foto profil, foto ID/KTP, dan CV PDF freelancer. File disimpan secara lokal dan disajikan secara statis via `/uploads`.

### 🗄️ Rancangan Database (Prisma Schema)
Rancangan database relasional menggunakan model-model berikut:

- **User**: Menyimpan data user (nama, email, password, role `CLIENT` / `FREELANCER`, bio, telp, url CV, url Avatar, dll).
- **Portfolio**: Menyimpan portofolio milik freelancer (`freelancerId` merujuk ke `User.id`).
- **ProjectRequest**: Transaksi penawaran kerja dari client (`clientId`) ke freelancer (`freelancerId`) beserta rincian budget, deskripsi, dan status (`RequestStatus`).
- **ChatMessage**: Menyimpan riwayat obrolan yang terelasi ke `ProjectRequest` tertentu dan pengirimnya (`senderId`).

---

## 🎨 Frontend (FE) Documentation

Frontend dikembangkan menggunakan **ReactJS** yang interaktif dan dinamis dengan fokus pada pengalaman pengguna yang premium.

### 🛠️ Tech Stack & Library Frontend
- **Framework**: React 19
- **Bundler**: Vite 8
- **HTTP Client**: Axios (dengan interceptor untuk menyisipkan header `Authorization: Bearer <token>` secara otomatis dari `localStorage`).
- **Styling**: Vanilla CSS dengan desain modern dan responsif.
- **Routing**: State-based routing dinamis di `App.jsx` untuk performa navigasi instan tanpa overhead browser router reload.

### 🌟 Fitur Utama Frontend
1. **Landing Page**: Dashboard perkenalan dengan visual yang memikat.
2. **Role Selection & Registration**: Form pendaftaran terpisah antara Client (data standar) dan Freelancer (multi-step form untuk upload CV, keahlian, dan foto identitas).
3. **Explore Page (Client)**: Halaman penelusuran freelancer dengan opsi pencarian dan filter keahlian.
4. **Project Dashboard (Client & Freelancer)**: 
   - Client dapat melacak status request yang dikirimkan.
   - Freelancer memiliki dashboard khusus untuk melihat total penghasilan, statistik pekerjaan, dan mengonfirmasi atau menolak request yang masuk.
5. **Real-time Chat Interface**: UI chatting yang interaktif untuk membahas detail pekerjaan dan melakukan negosiasi kesepakatan harga/budget.
6. **Project Rating & Evaluation**: Fitur untuk memberikan bintang dan ulasan setelah proyek selesai (`COMPLETED`).

---

## 🚀 Panduan Setup & Menjalankan Aplikasi

Ikuti langkah-langkah berikut untuk menjalankan aplikasi di komputer lokal Anda:

### 1. Prasyarat (Prerequisites)
Pastikan Anda sudah menginstal:
- [Node.js](https://nodejs.org/) (versi 18 ke atas disarankan)
- Database **MySQL** (misal lewat XAMPP, Docker, atau MySQL Installer)

### 2. Setup Database & Backend
1. Buka terminal baru dan masuk ke direktori `BackendFLZ`:
   ```bash
   cd BackendFLZ
   ```
2. Instal semua dependensi Node.js:
   ```bash
   npm install
   ```
3. Buat file `.env` di dalam folder `BackendFLZ` dan sesuaikan URL database Anda:
   ```env
   DATABASE_URL="mysql://root:password_mysql_kamu@localhost:3306/freelanz_db"
   JWT_SECRET="rahasia_super_aman_12345"
   PORT=5000
   ```
4. Jalankan migrasi Prisma untuk membuat tabel database otomatis:
   ```bash
   npx prisma migrate dev --name init
   ```
5. Jalankan backend dalam mode development:
   ```bash
   npm run start:dev
   ```
6. Backend akan berjalan di `http://localhost:5000/api`. Anda dapat melihat dokumentasi interaktif API (Swagger) di: **`http://localhost:5000/api/docs`**

### 3. Setup Frontend
1. Buka terminal baru (split terminal) dan masuk ke direktori `FrontendFLZ/FreeLanz`:
   ```bash
   cd FrontendFLZ/FreeLanz
   ```
2. Instal dependensi frontend:
   ```bash
   npm install
   ```
3. Jalankan server local frontend:
   ```bash
   npm run dev
   ```
4. Frontend akan berjalan di URL default Vite (biasanya `http://localhost:5173`). Buka URL tersebut di browser Anda.

---

## 📄 Panduan Step-by-Step Commit & Push ke GitHub

Karena repositori Git Anda sekarang sudah bersih (hanya mendeteksi **109 file** project Anda saja, tanpa terganggu folder kuliah lain atau `node_modules` karena sudah disaring `.gitignore`), berikut adalah langkah-langkah untuk melakukan commit pertama kali dan mengirimkannya ke GitHub:

### Langkah 1: Tambahkan Semua File ke Git Staging Area
Jalankan perintah ini di root folder proyek (`FreeLanz 3.0`):
```bash
git add .
```

### Langkah 2: Buat Commit Pertama Anda
Buat catatan commit untuk menandai status awal kode program Anda:
```bash
git commit -m "Initial commit: Setup Frontend and Backend FreeLanZ 3.0"
```

### Langkah 3: Buat Repositori Baru di GitHub
1. Buka browser dan pergi ke [GitHub](https://github.com/).
2. Login dan klik tombol **New** (atau **Create repository**).
3. Isi **Repository name** (contoh: `FreeLanz-3.0`).
4. Pilih **Public** atau **Private** sesuai kebutuhan Anda.
5. **PENTING**: Jangan centang "Add a README file", "Add .gitignore", atau "Choose a license" karena kita sudah memilikinya secara lokal.
6. Klik **Create repository**.

### Langkah 4: Hubungkan Repo Lokal dengan GitHub & Push
Setelah repositori GitHub dibuat, Anda akan diberikan beberapa baris perintah. Jalankan perintah di bawah ini pada terminal proyek Anda:

1. Ubah branch utama menjadi `main` (standar GitHub):
   ```bash
   git branch -M main
   ```
2. Hubungkan url GitHub Anda ke remote repository lokal (Ganti `<URL_REPOSiTORI_GITHUB_KAMU>` dengan URL yang Anda dapat dari langkah 3, contoh: `https://github.com/username/FreeLanz-3.0.git`):
   ```bash
   git remote add origin <URL_REPOSITORI_GITHUB_KAMU>
   ```
3. Unggah seluruh file ke GitHub:
   ```bash
   git push -u origin main
   ```

Setelah proses upload selesai, silakan refresh halaman GitHub Anda. Semua file backend, frontend, dan file `README.md` ini akan tampil dengan rapi di sana! 🚀
