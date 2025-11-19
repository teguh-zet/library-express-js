# Library Management System API

Backend API untuk technical test posisi Junior Backend Developer di Summit Global Teknologi.

## Fitur

- Book Management dengan filter dan pagination
- Member Registration
- Book Borrowing dengan business logic validation
- Book Return dengan transaction handling
- Member Borrowing History
- PostgreSQL database dengan proper indexing
- Service layer untuk business logic
- Input validation dan error handling
- Swagger API Documentation

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- express-validator untuk validation
- Swagger UI untuk dokumentasi API

## Persyaratan Sistem

Sebelum memulai, pastikan Anda telah menginstall:

### a. Node.js
- **Versi minimum:** Node.js v14.0.0 atau lebih baru
- **Cara cek versi:**
  ```bash
  node --version
  ```
- **Download:** [https://nodejs.org/](https://nodejs.org/)

### b. Express.js
- **Versi:** Express.js ^4.18.2 (akan terinstall otomatis saat `npm install`)
- Dependencies akan terinstall melalui `package.json`

### c. PostgreSQL
- **Versi minimum:** PostgreSQL v12.0 atau lebih baru
- **Cara cek versi:**
  ```bash
  psql --version
  ```
- **Download:** [https://www.postgresql.org/download/](https://www.postgresql.org/download/)

### d. npm (Node Package Manager)
- Biasanya sudah termasuk saat install Node.js
- **Cara cek versi:**
  ```bash
  npm --version
  ```

## Instalasi dan Setup

### Langkah 1: Clone Repository

```bash
git clone <repository-url>
cd "project sgt"
```

### Langkah 2: Install Dependencies

Jalankan perintah berikut untuk menginstall semua dependencies yang diperlukan:

```bash
npm install
```

Perintah ini akan menginstall semua package yang terdaftar di `package.json`, termasuk:
- `express` (^4.18.2)
- `pg` (^8.11.3) - PostgreSQL client
- `express-validator` (^7.0.1) - Input validation
- `dotenv` (^16.3.1) - Environment variables
- `cors` (^2.8.5) - Cross-Origin Resource Sharing
- `swagger-ui-express` (^5.0.0) - Swagger UI
- `swagger-jsdoc` (^6.2.8) - Swagger documentation generator
- `nodemon` (^3.0.2) - Development tool (dev dependency)
- `jest` (^29.7.0) - Testing framework (dev dependency)

**Catatan:** Pastikan koneksi internet aktif saat menjalankan `npm install`.

### Langkah 3: Setup Database PostgreSQL

#### 3.1. Buat Database

```bash
psql -U postgres -c "CREATE DATABASE library_db;"
```

**Alternatif menggunakan PowerShell (Windows):**
```powershell
# Jalankan script setup otomatis
.\setup_database.ps1
```

#### 3.2. Import Schema Database

```bash
psql -U postgres -d library_db -f schema.sql
```

#### 3.3. Import Sample Data (Opsional)

```bash
psql -U postgres -d library_db -f sample_data.sql
```

**Catatan:** 
- Ganti `postgres` dengan username PostgreSQL Anda jika berbeda
- Pastikan PostgreSQL service sudah running sebelum menjalankan perintah di atas

### Langkah 4: Konfigurasi Environment Variables

Buat file `.env` di root directory project dengan isi berikut:

```env
PORT=3000
NODE_ENV=development

# PostgreSQL Database Configuration
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=your_password_here
DB_NAME=library_db
DB_PORT=5432
```

**⚠️ PENTING:**
- Ganti `your_password_here` dengan password PostgreSQL Anda
- Pastikan semua nilai sesuai dengan konfigurasi PostgreSQL Anda
- File `.env` sudah terdaftar di `.gitignore` untuk keamanan

### Langkah 5: Verifikasi Setup

Pastikan:
- ✅ Node.js terinstall (v14+)
- ✅ PostgreSQL terinstall dan running (v12+)
- ✅ Database `library_db` sudah dibuat
- ✅ Schema dan sample data sudah diimport
- ✅ File `.env` sudah dibuat dengan konfigurasi yang benar
- ✅ Dependencies sudah terinstall (`node_modules` folder ada)

## Menjalankan Proyek

### Development Mode (Recommended)

Jalankan aplikasi dalam mode development dengan auto-reload:

```bash
npm run dev
```

**Fitur:**
- Server akan otomatis restart saat ada perubahan file
- Menggunakan `nodemon` untuk monitoring perubahan
- Cocok untuk development dan testing

### Production Mode

Jalankan aplikasi dalam mode production:

```bash
npm start
```

**Fitur:**
- Menggunakan `node` langsung tanpa auto-reload
- Cocok untuk production environment

### Verifikasi Server Berjalan

Setelah menjalankan perintah di atas, Anda akan melihat output seperti:

```
Database connected successfully
Server running on port 3000
```

Server akan berjalan di: **http://localhost:3000**

### Test Koneksi

Buka browser atau gunakan curl untuk test endpoint health check:

```bash
curl http://localhost:3000/health
```

Atau buka di browser: `http://localhost:3000/health`

Response yang diharapkan:
```json
{
  "status": "OK",
  "message": "Server is running",
  "timestamp": "2024-12-01T00:00:00.000Z"
}
```

## Akses Dokumentasi API

Setelah server running, akses Swagger UI untuk dokumentasi interaktif:

**URL:** http://localhost:3000/api-docs

Swagger UI menyediakan:
- Dokumentasi lengkap semua endpoints
- Try it out - test API langsung dari browser
- Request/Response examples
- Schema definitions

## Project Structure

```
.
├── config/
│   ├── database.js          # Database configuration & connection
│   └── swagger.js           # Swagger documentation configuration
├── controllers/
│   ├── bookController.js    # Book endpoints controller
│   ├── memberController.js  # Member endpoints controller
│   └── borrowingController.js # Borrowing endpoints controller
├── services/
│   ├── bookService.js       # Book business logic
│   ├── memberService.js     # Member business logic
│   └── borrowingService.js  # Borrowing business logic (with transactions)
├── routes/
│   ├── books.js             # Book routes
│   ├── members.js           # Member routes
│   └── borrowings.js        # Borrowing routes
├── middleware/
│   └── validation.js       # Validation middleware
├── utils/
│   ├── logger.js            # Logging utility
│   └── response.js          # Response helper functions
├── schema.sql               # Database schema
├── sample_data.sql          # Sample data untuk testing
├── setup_database.ps1       # PowerShell script untuk setup database (Windows)
├── server.js                # Main server file
├── package.json             # Dependencies & scripts
└── .env                     # Environment variables (buat sendiri)
```

## API Endpoints

### Books

#### GET /api/books
List semua buku dengan filter dan pagination.

**Query Parameters:**
- `title` (string, optional): Filter by title (case-insensitive)
- `author` (string, optional): Filter by author (case-insensitive)
- `page` (integer, default: 1): Page number
- `limit` (integer, default: 10): Items per page

**Example:**
```bash
GET /api/books?title=gatsby&page=1&limit=10
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "The Great Gatsby",
      "author": "F. Scott Fitzgerald",
      "published_year": 1925,
      "stock": 5,
      "isbn": "9780743273565",
      "available": true
    }
  ],
  "pagination": {
    "total": 20,
    "page": 1,
    "limit": 10,
    "totalPages": 2
  }
}
```

### Members

#### POST /api/members
Register member baru.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@email.com",
  "phone": "081234567890",
  "address": "123 Main St, City"
}
```

**Validations:**
- Email must be unique and valid format
- Phone must be valid format
- All fields are required

**Response:**
```json
{
  "success": true,
  "message": "Member registered successfully",
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john.doe@email.com",
    "phone": "081234567890",
    "address": "123 Main St, City",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

#### GET /api/members/:id/borrowings
Get member's borrowing history.

**Query Parameters:**
- `status` (string, optional): Filter by status (BORROWED/RETURNED)
- `page` (integer, default: 1): Page number
- `limit` (integer, default: 10): Items per page

**Example:**
```bash
GET /api/members/{member_id}/borrowings?status=BORROWED&page=1&limit=10
```

### Borrowings

#### POST /api/borrowings
Create new book borrowing.

**Request Body:**
```json
{
  "book_id": "uuid",
  "member_id": "uuid"
}
```

**Business Rules:**
- Book stock must be > 0
- Member cannot borrow more than 3 books
- Book stock will be decreased by 1
- Borrowing date is set to current date

**Error Responses:**
- `400`: Book is out of stock
- `400`: Member cannot borrow more than 3 books
- `404`: Book not found / Member not found

#### PUT /api/borrowings/:id/return
Process book return.

**Path Parameters:**
- `id`: Borrowing ID

**Business Rules:**
- Borrowing record must exist
- Book stock will be increased by 1
- Return date is set to current date
- Status changed to 'RETURNED'

**Error Responses:**
- `404`: Borrowing record not found
- `400`: Book has already been returned

### Health Check

#### GET /health
Check server status.

**Response:**
```json
{
  "status": "OK",
  "message": "Server is running",
  "timestamp": "2024-12-01T00:00:00.000Z"
}
```

## Business Logic

### Borrowing Process

1. Verify book availability (stock > 0)
2. Check member's current borrowing count (≤ 3)
3. Use database transaction for:
   - Decreasing book stock
   - Creating borrowing record

### Return Process

1. Verify borrowing record exists
2. Use database transaction for:
   - Increasing book stock
   - Updating borrowing status and return date

## Database Schema

### Books Table
- `id` (UUID, Primary Key)
- `title` (VARCHAR(255), NOT NULL)
- `author` (VARCHAR(255), NOT NULL)
- `published_year` (INTEGER, NOT NULL)
- `stock` (INTEGER, NOT NULL, DEFAULT 0)
- `isbn` (VARCHAR(13), UNIQUE, NOT NULL)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Members Table
- `id` (UUID, Primary Key)
- `name` (VARCHAR(255), NOT NULL)
- `email` (VARCHAR(255), UNIQUE, NOT NULL)
- `phone` (VARCHAR(15), NOT NULL)
- `address` (TEXT, NOT NULL)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Borrowings Table
- `id` (UUID, Primary Key)
- `book_id` (UUID, Foreign Key to Books)
- `member_id` (UUID, Foreign Key to Members)
- `borrow_date` (DATE, NOT NULL)
- `return_date` (DATE)
- `status` (VARCHAR(10), DEFAULT 'BORROWED')
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## Error Handling

Semua error responses mengikuti format:

```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error message"
}
```

## Troubleshooting

### Database Connection Error
- Pastikan PostgreSQL service sudah running
- Cek konfigurasi di file `.env` (host, port, user, password)
- Pastikan database `library_db` sudah dibuat

### Port Already in Use
- Ganti `PORT` di file `.env` dengan port lain (contoh: 3001)
- Atau hentikan aplikasi yang menggunakan port 3000

### Module Not Found
- Pastikan sudah menjalankan `npm install`
- Hapus folder `node_modules` dan `package-lock.json`, lalu jalankan `npm install` lagi

### Dependencies Installation Failed
- Pastikan koneksi internet aktif
- Coba clear npm cache: `npm cache clean --force`
- Coba install ulang: `npm install`

## Catatan Penting

- Pastikan PostgreSQL sudah running sebelum menjalankan aplikasi
- Import `schema.sql` terlebih dahulu sebelum menjalankan aplikasi
- Sample data dapat diimport menggunakan `sample_data.sql` untuk testing
- Semua business logic diimplementasikan di service layer
- Database transactions digunakan untuk operasi borrowing dan return
- File `.env` jangan di-commit ke repository (sudah ada di `.gitignore`)

## Testing

### Swagger UI (Recommended)
Setelah server running, buka browser:
```
http://localhost:3000/api-docs
```

Swagger UI menyediakan:
- Dokumentasi interaktif semua endpoints
- Try it out langsung dari browser
- Request/Response examples

### Unit Tests
Jalankan test dengan:
```bash
npm test
```
