# Testing Guide - Library Management System API

Panduan lengkap untuk testing API menggunakan berbagai tools.

## Tools untuk Testing API

### 1. Swagger UI (Recommended) 

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


## Recommended Tools

1. **Swagger UI** - Untuk quick testing dan dokumentasi 
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



