# Testing Guide - Library Management System API

Panduan lengkap untuk testing API menggunakan berbagai tools.

## Tools untuk Testing API

### 1. Swagger UI (Recommended) ⭐

**Cara menggunakan:**
1. Jalankan aplikasi:
   ```powershell
   npm run dev
   ```
2. Buka browser dan akses:
   ```
   http://localhost:3000/api-docs
   ```
3. Swagger UI akan menampilkan semua endpoints dengan dokumentasi lengkap
4. Klik "Try it out" pada endpoint yang ingin ditest
5. Isi parameter/request body
6. Klik "Execute"
7. Lihat response di bawah

**Keuntungan:**
- ✅ Dokumentasi interaktif
- ✅ Bisa test langsung dari browser
- ✅ Auto-generated dari code
- ✅ Menampilkan semua request/response examples

---

### 2. Postman

**Setup:**
1. Download dan install [Postman](https://www.postman.com/downloads/)
2. Buka Postman

**Import Collection:**
1. Klik **Import** di Postman
2. Pilih **Link** tab
3. Masukkan URL: `http://localhost:3000/api-docs` (akan otomatis generate collection)
4. Atau buat collection manual

**Manual Testing:**

**GET /api/books**
```
Method: GET
URL: http://localhost:3000/api/books?page=1&limit=10
```

**POST /api/members**
```
Method: POST
URL: http://localhost:3000/api/members
Headers: Content-Type: application/json
Body (raw JSON):
{
  "name": "John Doe",
  "email": "john.doe@email.com",
  "phone": "081234567890",
  "address": "123 Main St, City"
}
```

**POST /api/borrowings**
```
Method: POST
URL: http://localhost:3000/api/borrowings
Headers: Content-Type: application/json
Body (raw JSON):
{
  "book_id": "uuid-dari-books",
  "member_id": "uuid-dari-members"
}
```

**PUT /api/borrowings/:id/return**
```
Method: PUT
URL: http://localhost:3000/api/borrowings/{borrowing-id}/return
```

**GET /api/members/:id/borrowings**
```
Method: GET
URL: http://localhost:3000/api/members/{member-id}/borrowings?status=BORROWED
```

---

### 3. Insomnia

**Setup:**
1. Download dan install [Insomnia](https://insomnia.rest/download)
2. Buka Insomnia

**Cara menggunakan:**
1. Buat new request
2. Pilih method (GET, POST, PUT)
3. Masukkan URL
4. Untuk POST/PUT, pilih Body → JSON
5. Paste request body
6. Klik Send

**Keuntungan:**
- ✅ UI yang clean dan modern
- ✅ Environment variables support
- ✅ Request history
- ✅ Free dan open source

---

### 4. cURL (Command Line)

**Windows PowerShell:**

**GET /api/books**
```powershell
curl http://localhost:3000/api/books
```

**GET /api/books dengan filter**
```powershell
curl "http://localhost:3000/api/books?title=gatsby&page=1&limit=10"
```

**POST /api/members**
```powershell
curl -X POST http://localhost:3000/api/members `
  -H "Content-Type: application/json" `
  -d '{\"name\":\"John Doe\",\"email\":\"john.doe@email.com\",\"phone\":\"081234567890\",\"address\":\"123 Main St\"}'
```

**POST /api/borrowings**
```powershell
curl -X POST http://localhost:3000/api/borrowings `
  -H "Content-Type: application/json" `
  -d '{\"book_id\":\"uuid\",\"member_id\":\"uuid\"}'
```

**PUT /api/borrowings/:id/return**
```powershell
curl -X PUT http://localhost:3000/api/borrowings/{id}/return
```

**GET /api/members/:id/borrowings**
```powershell
curl http://localhost:3000/api/members/{id}/borrowings?status=BORROWED
```

---

### 5. HTTPie (Command Line Tool)

**Install:**
```powershell
pip install httpie
```

**Usage:**

**GET /api/books**
```bash
http GET localhost:3000/api/books
```

**POST /api/members**
```bash
http POST localhost:3000/api/members name="John Doe" email="john@email.com" phone="081234567890" address="123 Main St"
```

**POST /api/borrowings**
```bash
http POST localhost:3000/api/borrowings book_id="uuid" member_id="uuid"
```

---

## Testing Workflow

### Step 1: Health Check
```bash
GET http://localhost:3000/health
```
**Expected:** `{"status":"OK","message":"Server is running",...}`

### Step 2: Get Books
```bash
GET http://localhost:3000/api/books?page=1&limit=10
```
**Expected:** List of books dengan pagination

### Step 3: Register Member
```bash
POST http://localhost:3000/api/members
Body: {
  "name": "Test User",
  "email": "test@email.com",
  "phone": "081234567890",
  "address": "Test Address"
}
```
**Expected:** Member created dengan ID

### Step 4: Get Member ID
- Copy `id` dari response Step 3
- Atau query database untuk mendapatkan member ID

### Step 5: Get Book ID
```bash
GET http://localhost:3000/api/books
```
- Copy `id` dari salah satu book yang stock > 0

### Step 6: Create Borrowing
```bash
POST http://localhost:3000/api/borrowings
Body: {
  "book_id": "book-id-dari-step-5",
  "member_id": "member-id-dari-step-4"
}
```
**Expected:** Borrowing created, book stock decreased

### Step 7: Get Member Borrowings
```bash
GET http://localhost:3000/api/members/{member-id}/borrowings
```
**Expected:** List borrowings untuk member tersebut

### Step 8: Return Book
```bash
PUT http://localhost:3000/api/borrowings/{borrowing-id}/return
```
**Expected:** Borrowing status changed to RETURNED, book stock increased

---

## Test Cases

### Test Case 1: Book Out of Stock
1. Find book dengan stock = 0
2. Try to borrow that book
3. **Expected:** Error 400 "Book is out of stock"

### Test Case 2: Member Borrowing Limit
1. Borrow 3 books (max limit)
2. Try to borrow 4th book
3. **Expected:** Error 400 "Member cannot borrow more than 3 books"

### Test Case 3: Return Already Returned Book
1. Return a book
2. Try to return the same book again
3. **Expected:** Error 400 "Book has already been returned"

### Test Case 4: Invalid UUID
1. Try to create borrowing dengan invalid UUID
2. **Expected:** Error 400 "Validation failed"

### Test Case 5: Filter Books
1. Get books dengan filter title="gatsby"
2. **Expected:** Only books dengan title containing "gatsby"

---

## Environment Variables untuk Testing

**Postman/Insomnia:**
- Base URL: `http://localhost:3000`
- Port: `3000`

**Create Environment:**
- Variable: `base_url`
- Value: `http://localhost:3000`

Kemudian gunakan: `{{base_url}}/api/books`

---

## Tips Testing

1. **Gunakan Swagger UI** untuk quick testing dan melihat dokumentasi
2. **Gunakan Postman/Insomnia** untuk advanced testing dan collection management
3. **Gunakan cURL** untuk automation dan scripting
4. **Check response status codes:**
   - 200: Success
   - 201: Created
   - 400: Bad Request (validation error)
   - 404: Not Found
   - 500: Server Error

5. **Save successful requests** sebagai examples untuk dokumentasi
6. **Test error cases** juga, tidak hanya success cases
7. **Verify database changes** setelah testing (stock updated, borrowing created, etc.)

---

## Quick Test Script

Buat file `test-api.ps1`:

```powershell
# Health Check
Write-Host "Testing Health Check..." -ForegroundColor Yellow
curl http://localhost:3000/health

# Get Books
Write-Host "`nTesting Get Books..." -ForegroundColor Yellow
curl http://localhost:3000/api/books?page=1&limit=5

# Create Member
Write-Host "`nTesting Create Member..." -ForegroundColor Yellow
curl -X POST http://localhost:3000/api/members `
  -H "Content-Type: application/json" `
  -d '{\"name\":\"Test User\",\"email\":\"test@email.com\",\"phone\":\"081234567890\",\"address\":\"Test Address\"}'
```

Jalankan:
```powershell
.\test-api.ps1
```

---

## Recommended Tools

1. **Swagger UI** - Untuk quick testing dan dokumentasi ⭐
2. **Postman** - Untuk collection management dan team collaboration
3. **Insomnia** - Alternative untuk Postman, lebih lightweight
4. **cURL** - Untuk automation dan scripting

---

## Troubleshooting

### Error: "Cannot connect to server"
- Pastikan server sudah running: `npm run dev`
- Check port di `.env` file
- Check firewall settings

### Error: "Database connection failed"
- Pastikan PostgreSQL running
- Check credentials di `.env` file
- Verify database `library_db` exists

### Error: "Validation failed"
- Check request body format (must be JSON)
- Verify all required fields are present
- Check data types (UUID, email format, etc.)

---

Selamat testing! 🚀

