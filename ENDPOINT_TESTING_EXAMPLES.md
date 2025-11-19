# Endpoint Testing Examples - Complete Guide

Dokumentasi lengkap semua parameter dan request body untuk testing seluruh endpoint.

## Base URL
```
http://localhost:3000
```

---

## 1. Health Check

### GET /health

**Method:** `GET`  
**URL:** `http://localhost:3000/health`  
**Parameters:** Tidak ada  
**Request Body:** Tidak ada  
**Headers:** Tidak diperlukan

**cURL:**
```bash
curl http://localhost:3000/health
```

**Expected Response:**
```json
{
  "status": "OK",
  "message": "Server is running",
  "timestamp": "2024-12-01T00:00:00.000Z"
}
```

---

## 2. Get Books

### GET /api/books

**Method:** `GET`  
**URL:** `http://localhost:3000/api/books`  
**Parameters (Query):**
- `title` (string, optional): Filter by title (case-insensitive)
- `author` (string, optional): Filter by author (case-insensitive)
- `page` (integer, optional, default: 1): Page number
- `limit` (integer, optional, default: 10): Items per page

**Request Body:** Tidak ada  
**Headers:** Tidak diperlukan

**Contoh Request:**

**1. Get all books (default pagination):**
```
GET http://localhost:3000/api/books
```

**2. Get books dengan pagination:**
```
GET http://localhost:3000/api/books?page=1&limit=10
```

**3. Filter by title:**
```
GET http://localhost:3000/api/books?title=gatsby
```

**4. Filter by author:**
```
GET http://localhost:3000/api/books?author=fitzgerald
```

**5. Filter by title dan author dengan pagination:**
```
GET http://localhost:3000/api/books?title=gatsby&author=fitzgerald&page=1&limit=5
```

**cURL Examples:**
```bash
# Get all books
curl http://localhost:3000/api/books

# Get books dengan pagination
curl "http://localhost:3000/api/books?page=1&limit=10"

# Filter by title
curl "http://localhost:3000/api/books?title=gatsby"

# Filter by author
curl "http://localhost:3000/api/books?author=tolkien"

# Combined filters
curl "http://localhost:3000/api/books?title=ring&author=tolkien&page=1&limit=5"
```

**Expected Response:**
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
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

---

## 3. Register Member

### POST /api/members

**Method:** `POST`  
**URL:** `http://localhost:3000/api/members`  
**Parameters:** Tidak ada  
**Request Body (JSON):**
```json
{
  "name": "string (required, 2-255 characters)",
  "email": "string (required, valid email format, unique)",
  "phone": "string (required, valid phone format)",
  "address": "string (required)"
}
```

**Headers:**
```
Content-Type: application/json
```

**Contoh Request Body:**

**Example 1: Valid Request**
```json
{
  "name": "John Doe",
  "email": "john.doe@email.com",
  "phone": "081234567890",
  "address": "123 Main St, City"
}
```

**Example 2: Another Valid Request**
```json
{
  "name": "Jane Smith",
  "email": "jane.smith@email.com",
  "phone": "081234567891",
  "address": "456 Oak Ave, Town"
}
```

**cURL:**
```bash
curl -X POST http://localhost:3000/api/members \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@email.com",
    "phone": "081234567890",
    "address": "123 Main St, City"
  }'
```

**Expected Response (201):**
```json
{
  "success": true,
  "message": "Member registered successfully",
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe",
    "email": "john.doe@email.com",
    "phone": "081234567890",
    "address": "123 Main St, City",
    "created_at": "2024-12-01T00:00:00.000Z",
    "updated_at": "2024-12-01T00:00:00.000Z"
  }
}
```

**Error Cases:**

**1. Missing required field:**
```json
{
  "name": "John Doe",
  "email": "john.doe@email.com"
  // Missing phone and address
}
```
**Expected:** 400 - Validation error

**2. Invalid email format:**
```json
{
  "name": "John Doe",
  "email": "invalid-email",
  "phone": "081234567890",
  "address": "123 Main St"
}
```
**Expected:** 400 - Validation error

**3. Duplicate email:**
```json
{
  "name": "Another User",
  "email": "john.doe@email.com",  // Email sudah digunakan
  "phone": "081234567892",
  "address": "789 Other St"
}
```
**Expected:** 400 - Email already exists

---

## 4. Get Member Borrowings

### GET /api/members/:id/borrowings

**Method:** `GET`  
**URL:** `http://localhost:3000/api/members/{member_id}/borrowings`  
**Path Parameters:**
- `id` (UUID, required): Member ID

**Query Parameters:**
- `status` (string, optional): Filter by status - `BORROWED` atau `RETURNED`
- `page` (integer, optional, default: 1): Page number
- `limit` (integer, optional, default: 10): Items per page

**Request Body:** Tidak ada  
**Headers:** Tidak diperlukan

**Contoh Request:**

**1. Get all borrowings for member:**
```
GET http://localhost:3000/api/members/660e8400-e29b-41d4-a716-446655440000/borrowings
```

**2. Filter by status BORROWED:**
```
GET http://localhost:3000/api/members/660e8400-e29b-41d4-a716-446655440000/borrowings?status=BORROWED
```

**3. Filter by status RETURNED:**
```
GET http://localhost:3000/api/members/660e8400-e29b-41d4-a716-446655440000/borrowings?status=RETURNED
```

**4. With pagination:**
```
GET http://localhost:3000/api/members/660e8400-e29b-41d4-a716-446655440000/borrowings?status=BORROWED&page=1&limit=10
```

**cURL:**
```bash
# Get all borrowings
curl "http://localhost:3000/api/members/660e8400-e29b-41d4-a716-446655440000/borrowings"

# Filter by status
curl "http://localhost:3000/api/members/660e8400-e29b-41d4-a716-446655440000/borrowings?status=BORROWED"

# With pagination
curl "http://localhost:3000/api/members/660e8400-e29b-41d4-a716-446655440000/borrowings?status=BORROWED&page=1&limit=5"
```

**Expected Response (200):**
```json
{
  "data": [
    {
      "id": "770e8400-e29b-41d4-a716-446655440000",
      "book_id": "550e8400-e29b-41d4-a716-446655440000",
      "member_id": "660e8400-e29b-41d4-a716-446655440000",
      "borrow_date": "2024-12-01",
      "return_date": null,
      "status": "BORROWED",
      "created_at": "2024-12-01T00:00:00.000Z",
      "updated_at": "2024-12-01T00:00:00.000Z",
      "book": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
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

**Error Cases:**

**1. Invalid member ID:**
```
GET http://localhost:3000/api/members/invalid-uuid/borrowings
```
**Expected:** 404 - Member not found

**2. Member ID tidak ada di database:**
```
GET http://localhost:3000/api/members/00000000-0000-0000-0000-000000000000/borrowings
```
**Expected:** 404 - Member not found

---

## 5. Create Borrowing

### POST /api/borrowings

**Method:** `POST`  
**URL:** `http://localhost:3000/api/borrowings`  
**Parameters:** Tidak ada  
**Request Body (JSON):**
```json
{
  "book_id": "UUID (required, valid UUID format)",
  "member_id": "UUID (required, valid UUID format)"
}
```

**Headers:**
```
Content-Type: application/json
```

**Contoh Request Body:**

**Example 1: Valid Request**
```json
{
  "book_id": "550e8400-e29b-41d4-a716-446655440000",
  "member_id": "660e8400-e29b-41d4-a716-446655440000"
}
```

**cURL:**
```bash
curl -X POST http://localhost:3000/api/borrowings \
  -H "Content-Type: application/json" \
  -d '{
    "book_id": "550e8400-e29b-41d4-a716-446655440000",
    "member_id": "660e8400-e29b-41d4-a716-446655440000"
  }'
```

**Expected Response (201):**
```json
{
  "success": true,
  "message": "Book borrowed successfully",
  "data": {
    "id": "880e8400-e29b-41d4-a716-446655440000",
    "book_id": "550e8400-e29b-41d4-a716-446655440000",
    "member_id": "660e8400-e29b-41d4-a716-446655440000",
    "borrow_date": "2024-12-01",
    "return_date": null,
    "status": "BORROWED",
    "created_at": "2024-12-01T00:00:00.000Z",
    "updated_at": "2024-12-01T00:00:00.000Z",
    "book": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "The Great Gatsby",
      "author": "F. Scott Fitzgerald",
      "isbn": "9780743273565"
    }
  }
}
```

**Error Cases:**

**1. Missing book_id:**
```json
{
  "member_id": "660e8400-e29b-41d4-a716-446655440000"
}
```
**Expected:** 400 - Validation error: "Book ID is required"

**2. Missing member_id:**
```json
{
  "book_id": "550e8400-e29b-41d4-a716-446655440000"
}
```
**Expected:** 400 - Validation error: "Member ID is required"

**3. Invalid UUID format:**
```json
{
  "book_id": "invalid-uuid",
  "member_id": "660e8400-e29b-41d4-a716-446655440000"
}
```
**Expected:** 400 - Validation error: "Book ID must be a valid UUID"

**4. Book not found:**
```json
{
  "book_id": "00000000-0000-0000-0000-000000000000",
  "member_id": "660e8400-e29b-41d4-a716-446655440000"
}
```
**Expected:** 404 - "Book not found"

**5. Member not found:**
```json
{
  "book_id": "550e8400-e29b-41d4-a716-446655440000",
  "member_id": "00000000-0000-0000-0000-000000000000"
}
```
**Expected:** 404 - "Member not found"

**6. Book out of stock (stock = 0):**
```json
{
  "book_id": "550e8400-e29b-41d4-a716-446655440000",  // Book dengan stock = 0
  "member_id": "660e8400-e29b-41d4-a716-446655440000"
}
```
**Expected:** 400 - "Book is out of stock"

**7. Member has reached borrowing limit (already borrowed 3 books):**
```json
{
  "book_id": "550e8400-e29b-41d4-a716-446655440000",
  "member_id": "660e8400-e29b-41d4-a716-446655440000"  // Member sudah borrow 3 books
}
```
**Expected:** 400 - "Member cannot borrow more than 3 books"

---

## 6. Return Borrowing

### PUT /api/borrowings/:id/return

**Method:** `PUT`  
**URL:** `http://localhost:3000/api/borrowings/{borrowing_id}/return`  
**Path Parameters:**
- `id` (UUID, required): Borrowing ID

**Query Parameters:** Tidak ada  
**Request Body:** Tidak ada  
**Headers:** Tidak diperlukan

**Contoh Request:**

**1. Return a book:**
```
PUT http://localhost:3000/api/borrowings/880e8400-e29b-41d4-a716-446655440000/return
```

**cURL:**
```bash
curl -X PUT http://localhost:3000/api/borrowings/880e8400-e29b-41d4-a716-446655440000/return
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Book returned successfully",
  "data": {
    "id": "880e8400-e29b-41d4-a716-446655440000",
    "book_id": "550e8400-e29b-41d4-a716-446655440000",
    "member_id": "660e8400-e29b-41d4-a716-446655440000",
    "borrow_date": "2024-12-01",
    "return_date": "2024-12-02",
    "status": "RETURNED",
    "created_at": "2024-12-01T00:00:00.000Z",
    "updated_at": "2024-12-02T00:00:00.000Z",
    "book": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "The Great Gatsby",
      "author": "F. Scott Fitzgerald",
      "isbn": "9780743273565"
    }
  }
}
```

**Error Cases:**

**1. Invalid borrowing ID:**
```
PUT http://localhost:3000/api/borrowings/invalid-uuid/return
```
**Expected:** 404 - "Borrowing record not found"

**2. Borrowing ID tidak ada di database:**
```
PUT http://localhost:3000/api/borrowings/00000000-0000-0000-0000-000000000000/return
```
**Expected:** 404 - "Borrowing record not found"

**3. Book already returned:**
```
PUT http://localhost:3000/api/borrowings/880e8400-e29b-41d4-a716-446655440000/return
# Jika sudah pernah di-return sebelumnya
```
**Expected:** 400 - "Book has already been returned"

---

## Complete Testing Workflow

Berikut adalah workflow lengkap untuk testing semua endpoint secara berurutan:

### Step 1: Health Check
```bash
curl http://localhost:3000/health
```

### Step 2: Get Books (untuk mendapatkan book_id)
```bash
curl "http://localhost:3000/api/books?page=1&limit=1"
```
**Simpan:** `book_id` dari response (pilih book dengan `stock > 0`)

### Step 3: Register Member (untuk mendapatkan member_id)
```bash
curl -X POST http://localhost:3000/api/members \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test.user@email.com",
    "phone": "081234567890",
    "address": "123 Test Street"
  }'
```
**Simpan:** `member_id` dari response

### Step 4: Create Borrowing
```bash
curl -X POST http://localhost:3000/api/borrowings \
  -H "Content-Type: application/json" \
  -d '{
    "book_id": "PASTE_BOOK_ID_DARI_STEP_2",
    "member_id": "PASTE_MEMBER_ID_DARI_STEP_3"
  }'
```
**Simpan:** `borrowing_id` dari response

### Step 5: Get Member Borrowings
```bash
curl "http://localhost:3000/api/members/PASTE_MEMBER_ID_DARI_STEP_3/borrowings"
```

### Step 6: Return Borrowing
```bash
curl -X PUT "http://localhost:3000/api/borrowings/PASTE_BORROWING_ID_DARI_STEP_4/return"
```

### Step 7: Verify Return (Get Member Borrowings lagi)
```bash
curl "http://localhost:3000/api/members/PASTE_MEMBER_ID_DARI_STEP_3/borrowings?status=RETURNED"
```

---

## Quick Reference Table

| Endpoint | Method | Path Params | Query Params | Request Body | Required Fields |
|----------|--------|-------------|--------------|--------------|-----------------|
| `/health` | GET | - | - | - | - |
| `/api/books` | GET | - | title, author, page, limit | - | - |
| `/api/members` | POST | - | - | JSON | name, email, phone, address |
| `/api/members/:id/borrowings` | GET | id (UUID) | status, page, limit | - | id |
| `/api/borrowings` | POST | - | - | JSON | book_id, member_id |
| `/api/borrowings/:id/return` | PUT | id (UUID) | - | - | id |

---

## Postman Collection JSON

Berikut adalah Postman Collection yang bisa di-import:

```json
{
  "info": {
    "name": "Library Management API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "url": "http://localhost:3000/health"
      }
    },
    {
      "name": "Get Books",
      "request": {
        "method": "GET",
        "url": "http://localhost:3000/api/books?page=1&limit=10"
      }
    },
    {
      "name": "Register Member",
      "request": {
        "method": "POST",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"name\": \"John Doe\",\n  \"email\": \"john.doe@email.com\",\n  \"phone\": \"081234567890\",\n  \"address\": \"123 Main St, City\"\n}"
        },
        "url": "http://localhost:3000/api/members"
      }
    },
    {
      "name": "Get Member Borrowings",
      "request": {
        "method": "GET",
        "url": "http://localhost:3000/api/members/{{member_id}}/borrowings"
      }
    },
    {
      "name": "Create Borrowing",
      "request": {
        "method": "POST",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"book_id\": \"{{book_id}}\",\n  \"member_id\": \"{{member_id}}\"\n}"
        },
        "url": "http://localhost:3000/api/borrowings"
      }
    },
    {
      "name": "Return Borrowing",
      "request": {
        "method": "PUT",
        "url": "http://localhost:3000/api/borrowings/{{borrowing_id}}/return"
      }
    }
  ],
  "variable": [
    {"key": "base_url", "value": "http://localhost:3000"},
    {"key": "book_id", "value": ""},
    {"key": "member_id", "value": ""},
    {"key": "borrowing_id", "value": ""}
  ]
}
```

**Cara import ke Postman:**
1. Buka Postman
2. Klik **Import**
3. Pilih **Raw text**
4. Paste JSON di atas
5. Klik **Import**

---

## Tips Testing

1. **Gunakan Swagger UI** (`http://localhost:3000/api-docs`) untuk quick testing
2. **Simpan IDs** dari response untuk testing endpoint berikutnya
3. **Test error cases** juga, tidak hanya success cases
4. **Verify database changes** setelah testing (stock updated, dll)
5. **Gunakan Postman/Insomnia** untuk collection management

---

## Catatan Penting

- Semua UUID harus dalam format yang valid
- Book ID dan Member ID harus ada di database
- Book stock harus > 0 untuk bisa di-borrow
- Member tidak bisa borrow lebih dari 3 books
- Borrowing ID harus status BORROWED untuk bisa di-return

---

Selamat testing! 🚀

