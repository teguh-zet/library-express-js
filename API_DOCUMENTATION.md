# API Documentation

## Base URL
```
http://localhost:3000
```

---

## Endpoints

### 1. Get Books

**GET** `/api/books`

List semua buku dengan filter dan pagination.

**Query Parameters:**
- `title` (string, optional): Filter by title (case-insensitive)
- `author` (string, optional): Filter by author (case-insensitive)
- `page` (integer, default: 1): Page number
- `limit` (integer, default: 10): Items per page

**Example:**
```
GET /api/books?title=gatsby&author=fitzgerald&page=1&limit=10
```

**Response (200):**
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

### 2. Register Member

**POST** `/api/members`

Register member baru ke sistem.

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

**Response (201):**
```json
{
  "success": true,
  "message": "Member registered successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe",
    "email": "john.doe@email.com",
    "phone": "081234567890",
    "address": "123 Main St, City",
    "created_at": "2024-12-01T00:00:00.000Z",
    "updated_at": "2024-12-01T00:00:00.000Z"
  }
}
```

**Error (400):**
```json
{
  "success": false,
  "message": "Email already exists"
}
```

**Validation Errors (400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "msg": "Email is required",
      "param": "email",
      "location": "body"
    }
  ]
}
```

---

### 3. Get Member Borrowings

**GET** `/api/members/:id/borrowings`

Get member's borrowing history.

**Path Parameters:**
- `id`: Member ID (UUID)

**Query Parameters:**
- `status` (string, optional): Filter by status (BORROWED/RETURNED)
- `page` (integer, default: 1): Page number
- `limit` (integer, default: 10): Items per page

**Example:**
```
GET /api/members/550e8400-e29b-41d4-a716-446655440000/borrowings?status=BORROWED&page=1&limit=10
```

**Response (200):**
```json
{
  "data": [
    {
      "id": "660e8400-e29b-41d4-a716-446655440000",
      "book_id": "770e8400-e29b-41d4-a716-446655440000",
      "member_id": "550e8400-e29b-41d4-a716-446655440000",
      "borrow_date": "2024-11-21",
      "return_date": null,
      "status": "BORROWED",
      "created_at": "2024-11-21T00:00:00.000Z",
      "updated_at": "2024-11-21T00:00:00.000Z",
      "book": {
        "id": "770e8400-e29b-41d4-a716-446655440000",
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

**Error (404):**
```json
{
  "success": false,
  "message": "Member not found"
}
```

---

### 4. Create Borrowing

**POST** `/api/borrowings`

Create new book borrowing.

**Request Body:**
```json
{
  "book_id": "770e8400-e29b-41d4-a716-446655440000",
  "member_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Business Rules:**
- Book stock must be > 0
- Member cannot borrow more than 3 books
- Book stock will be decreased by 1
- Borrowing date is set to current date

**Response (201):**
```json
{
  "success": true,
  "message": "Book borrowed successfully",
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440000",
    "book_id": "770e8400-e29b-41d4-a716-446655440000",
    "member_id": "550e8400-e29b-41d4-a716-446655440000",
    "borrow_date": "2024-12-01",
    "return_date": null,
    "status": "BORROWED",
    "created_at": "2024-12-01T00:00:00.000Z",
    "updated_at": "2024-12-01T00:00:00.000Z",
    "book": {
      "id": "770e8400-e29b-41d4-a716-446655440000",
      "title": "The Great Gatsby",
      "author": "F. Scott Fitzgerald",
      "isbn": "9780743273565"
    }
  }
}
```

**Error (400):**
```json
{
  "success": false,
  "message": "Book is out of stock",
  "error": "Book is out of stock"
}
```

```json
{
  "success": false,
  "message": "Member cannot borrow more than 3 books",
  "error": "Member cannot borrow more than 3 books"
}
```

**Error (404):**
```json
{
  "success": false,
  "message": "Book not found",
  "error": "Book not found"
}
```

**Validation Errors (400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "msg": "Book ID is required",
      "param": "book_id",
      "location": "body"
    }
  ]
}
```

---

### 5. Return Borrowing

**PUT** `/api/borrowings/:id/return`

Process book return.

**Path Parameters:**
- `id`: Borrowing ID (UUID)

**Business Rules:**
- Borrowing record must exist
- Book stock will be increased by 1
- Return date is set to current date
- Status changed to 'RETURNED'

**Response (200):**
```json
{
  "success": true,
  "message": "Book returned successfully",
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440000",
    "book_id": "770e8400-e29b-41d4-a716-446655440000",
    "member_id": "550e8400-e29b-41d4-a716-446655440000",
    "borrow_date": "2024-11-21",
    "return_date": "2024-12-01",
    "status": "RETURNED",
    "created_at": "2024-11-21T00:00:00.000Z",
    "updated_at": "2024-12-01T00:00:00.000Z",
    "book": {
      "id": "770e8400-e29b-41d4-a716-446655440000",
      "title": "The Great Gatsby",
      "author": "F. Scott Fitzgerald",
      "isbn": "9780743273565"
    }
  }
}
```

**Error (404):**
```json
{
  "success": false,
  "message": "Borrowing record not found",
  "error": "Borrowing record not found"
}
```

**Error (400):**
```json
{
  "success": false,
  "message": "Book has already been returned",
  "error": "Book has already been returned"
}
```

---

### 6. Health Check

**GET** `/health`

Check server status.

**Response (200):**
```json
{
  "status": "OK",
  "message": "Server is running",
  "timestamp": "2024-12-01T00:00:00.000Z"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error message"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found",
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal Server Error",
  "error": "Error details"
}
```

---

## Notes

- Semua UUID harus dalam format yang valid
- Semua dates menggunakan format YYYY-MM-DD
- Pagination default: page=1, limit=10
- Filter pada GET /api/books bersifat case-insensitive
- Business logic diimplementasikan di service layer
- Database transactions digunakan untuk operasi borrowing dan return
