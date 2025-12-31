# PBJT Backend Library

Backend untuk aplikasi **Perpustakaan Desktop**, dibangun menggunakan **Elysia.js**, **TypeScript**, dan **PostgreSQL**.  
Backend ini mengelola data **Buku**, **Member**, **Peminjaman**, serta **Admin Authorization**.

## 🚀 Tech Stack

- **Runtime**: Bun
- **Framework**: Elysia.js
- **Language**: TypeScript
- **Database**: PostgreSQL 18
- **Authentication**: JWT
- **Password Hashing**: bcrypt

## 📂 Project Structure

```bash
src/
├── modules/
│ ├── book/
│ │ ├── book.model.ts
│ │ ├── book.repository.ts
│ │ ├── book.service.ts
│ │ └── book.route.ts
│ │
│ ├── member/
│ │ ├── member.model.ts
│ │ ├── member.repository.ts
│ │ ├── member.service.ts
│ │ └── member.route.ts
│ │
│ │── loan/
│ │ ├── loan.model.ts
│ │ ├── loan.repository.ts
│ │ ├── loan.service.ts
│ │ └── loan.route.ts
│ │
│ ├── admin/
│ │ ├── admin.model.ts
│ │ ├── admin.repository.ts
│ │ ├── auth.service.ts
│ │ └── admin.route.ts
│ │
└── app.ts
```

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository
```bash
git clone <repository-url>
cd library-backend
```

### 2️⃣ Install Dependencies
```bash
bun install
```

## ▶️ Run Server
```bash
bun run dev
```

## 📌 API Endpoints

### 📚 Books
```md
| Method | Endpoint        | Description          |
|--------|-----------------|----------------------|
| GET    | `/books`        | Ambil semua buku     |
| GET    | `/books/:id`    | Ambil buku (id)      |
| POST   | `/books`        | Tambah buku          |
| PUT    | `/books/:id`    | Update buku (id)     |
| DELETE | `/books/:id`    | Hapus buku (id)      |
```

### 👤 Members
```md
| Method | Endpoint        | Description           |
|--------|-----------------|-----------------------|
| GET    | `/members`      | Ambil semua member    |
| GET    | `/members/:id`  | Ambil member (id)     |
| POST   | `/members`      | Tambah member         |
| PUT    | `/members/:id`  | Update member (id)    |
| DELETE | `/members/:id`  | Hapus member (id)     |
```

### 🔄 Loans
```md
| Method | Endpoint        | Description           |
|--------|-----------------|-----------------------|
| GET    | `/loans`        | Ambil semua data      |
| GET    | `/loans/:id`    | Ambil data (id)       |
| POST   | `/loans`        | Tambah pinjaman       |
| PUT    | `/loans/:id`    | Update pinjaman (id)  |
| DELETE | `/loans/:id`    | Hapus pinjaman (id)   |
```

### 🔐 Admin
```md
| Method | Endpoint           | Description        |
|--------|--------------------|--------------------|
| POST   | `/admins/register` | Tambah admin baru  |
| POST   | `/admins/login`    | Login admin        |
```

## 🧪 Testing (cURL)
```bash
curl -X POST http://localhost:3000/members \
-H "Content-Type: application/json" \
-d '{
  "id": "MB001",
  "name": "Your Name",
  "studyProgram": "Study Program",
  "semester": 1
}'
```

## 👤 Author
Ariyan Andryan Aryja - Politeknik Baja Tegal - Teknik Informatika