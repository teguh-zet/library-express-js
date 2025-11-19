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

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- express-validator untuk validation

## Project Structure

```
.
├── config/
│   └── database.js          # Database configuration
├── controllers/
│   ├── bookController.js    # Book endpoints controller
│   ├── memberController.js  # Member endpoints controller
│   └── borrowingController.js # Borrowing endpoints controller
├── services/
│   ├── bookService.js      # Book business logic
│   ├── memberService.js    # Member business logic
│   └── borrowingService.js # Borrowing business logic
├── routes/
│   ├── books.js            # Book routes
│   ├── members.js          # Member routes
│   └── borrowings.js       # Borrowing routes
├── middleware/
│   └── validation.js       # Validation middleware
├── schema.sql              # Database schema
├── sample_data.sql         # Sample data
├── server.js               # Main server file
└── package.json
```

## Instalasi

### Prerequisites

- Node.js (v14 atau lebih baru)
- PostgreSQL (v12 atau lebih baru)

### Setup

1. Clone repository ini
```bash
git clone <repository-url>
cd project-sgt
```

2. Install dependencies:
```bash
npm install
```

3. Setup PostgreSQL database:
   
   **📖 Lihat panduan lengkap di [SETUP_GUIDE.md](./SETUP_GUIDE.md)**
   
   **Quick setup:**
   ```bash
   # Buat database
   psql -U postgres -c "CREATE DATABASE library_db;"
   
   # Import schema
   psql -U postgres -d library_db -f schema.sql
   
   # Import sample data
   psql -U postgres -d library_db -f sample_data.sql
   ```

4. Setup environment variables:
   
   Buat file `.env` di root directory dengan isi:
   ```env
   PORT=3000
   NODE_ENV=development
   
   # PostgreSQL Database
   DB_HOST=localhost
   DB_USER=postgres
   DB_PASSWORD=teazet
   DB_NAME=library_db
   DB_PORT=5432
   ```
   
   **⚠️ PENTING:** Sesuaikan `DB_PASSWORD` dengan password PostgreSQL Anda!
   
   **📖 Untuk penjelasan detail, lihat [SETUP_GUIDE.md](./SETUP_GUIDE.md)**

7. Jalankan aplikasi:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

Server akan berjalan di `http://localhost:3000`

## Konfigurasi Environment Variables

Buat file `.env` dengan konfigurasi berikut:

```
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=library_db
DB_PORT=5432
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

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "book_id": "uuid",
      "member_id": "uuid",
      "borrow_date": "2024-11-21",
      "return_date": null,
      "status": "BORROWED",
      "book": {
        "id": "uuid",
        "title": "The Great Gatsby",
        "author": "F. Scott Fitzgerald",
        "published_year": 1925,
        "isbn": "9780743273565"
      }
    }
  ],
  "pagination": {
    "total": 5,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
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

**Response:**
```json
{
  "success": true,
  "message": "Book borrowed successfully",
  "data": {
    "id": "uuid",
    "book_id": "uuid",
    "member_id": "uuid",
    "borrow_date": "2024-12-01",
    "return_date": null,
    "status": "BORROWED",
    "book": {
      "id": "uuid",
      "title": "The Great Gatsby",
      "author": "F. Scott Fitzgerald",
      "isbn": "9780743273565"
    }
  }
}
```

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

**Response:**
```json
{
  "success": true,
  "message": "Book returned successfully",
  "data": {
    "id": "uuid",
    "book_id": "uuid",
    "member_id": "uuid",
    "borrow_date": "2024-11-21",
    "return_date": "2024-12-01",
    "status": "RETURNED",
    "book": {
      "id": "uuid",
      "title": "The Great Gatsby",
      "author": "F. Scott Fitzgerald",
      "isbn": "9780743273565"
    }
  }
}
```

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

### Testing Guide
Lihat **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** untuk panduan lengkap testing dengan berbagai tools.

### Complete Examples
Lihat **[ENDPOINT_TESTING_EXAMPLES.md](./ENDPOINT_TESTING_EXAMPLES.md)** untuk semua parameter dan request body lengkap.

### Unit Tests
Jalankan test dengan:
```bash
npm test
```

## Catatan

- Pastikan PostgreSQL sudah running sebelum menjalankan aplikasi
- Import schema.sql terlebih dahulu sebelum menjalankan aplikasi
- Sample data dapat diimport menggunakan sample_data.sql
- Semua business logic diimplementasikan di service layer
- Database transactions digunakan untuk operasi borrowing dan return
