# Setup Database dengan DBeaver

Panduan lengkap untuk setup database menggunakan DBeaver (GUI tool).

## Prerequisites

- Database `library_db` sudah dibuat (✅ Sudah selesai)
- DBeaver sudah terinstall dan terhubung ke PostgreSQL

---

## Langkah 1: Import Schema (Membuat Tables)

### Cara 1: Menggunakan SQL Script Editor

1. **Buka DBeaver**
2. **Connect ke PostgreSQL server** (jika belum)
3. **Expand database `library_db`** di Database Navigator
4. **Klik kanan pada database `library_db`** → **SQL Editor** → **New SQL Script**
5. **Buka file `schema.sql`** dengan text editor (Notepad, VS Code, dll)
6. **Copy semua isi file `schema.sql`** (Ctrl+A, Ctrl+C)
7. **Paste ke SQL Editor di DBeaver** (Ctrl+V)
8. **Klik Execute SQL Script** (Ctrl+Alt+X) atau tombol **Execute Script** (▶️)

**Expected Output:**
- Akan muncul pesan sukses untuk setiap CREATE TABLE dan CREATE INDEX
- Di bagian bawah akan muncul "Success" atau "Completed"

### Cara 2: Menggunakan File Import

1. **Klik kanan pada database `library_db`** → **Tools** → **Execute Script**
2. **Pilih file `schema.sql`** dari project folder
3. **Klik Start**
4. **Tunggu sampai selesai**

---

## Langkah 2: Verifikasi Schema

Setelah schema diimport, verifikasi bahwa tables sudah terbuat:

1. **Refresh database `library_db`** (klik kanan → Refresh)
2. **Expand `Schemas`** → **`public`** → **`Tables`**
3. **Pastikan ada 3 tables:**
   - ✅ `books`
   - ✅ `members`
   - ✅ `borrowings`

4. **Klik kanan pada table `books`** → **View Data** untuk melihat struktur table

---

## Langkah 3: Import Sample Data

### Cara 1: Menggunakan SQL Script Editor

1. **Klik kanan pada database `library_db`** → **SQL Editor** → **New SQL Script**
2. **Buka file `sample_data.sql`** dengan text editor
3. **Copy semua isi file `sample_data.sql`** (Ctrl+A, Ctrl+C)
4. **Paste ke SQL Editor di DBeaver** (Ctrl+V)
5. **Klik Execute SQL Script** (Ctrl+Alt+X)

**Expected Output:**
- Akan muncul pesan "INSERT 0 20" untuk books
- Akan muncul pesan "INSERT 0 20" untuk members

### Cara 2: Menggunakan File Import

1. **Klik kanan pada database `library_db`** → **Tools** → **Execute Script**
2. **Pilih file `sample_data.sql`** dari project folder
3. **Klik Start**
4. **Tunggu sampai selesai**

---

## Langkah 4: Verifikasi Data

Setelah sample data diimport, verifikasi bahwa data sudah terisi:

1. **Klik kanan pada table `books`** → **View Data**
2. **Pastikan ada 20 rows** di table books
3. **Klik kanan pada table `members`** → **View Data**
4. **Pastikan ada 20 rows** di table members
5. **Klik kanan pada table `borrowings`** → **View Data**
6. **Pastikan table borrowings kosong** (0 rows) - ini normal, akan terisi saat testing

### Query untuk Verifikasi

Jalankan query berikut di SQL Editor:

```sql
-- Cek jumlah books
SELECT COUNT(*) as total_books FROM books;
-- Expected: 20

-- Cek jumlah members
SELECT COUNT(*) as total_members FROM members;
-- Expected: 20

-- Cek jumlah borrowings
SELECT COUNT(*) as total_borrowings FROM borrowings;
-- Expected: 0

-- Cek sample books
SELECT id, title, author, stock, isbn FROM books LIMIT 5;

-- Cek sample members
SELECT id, name, email, phone FROM members LIMIT 5;
```

---

## Troubleshooting

### Error: "relation already exists"
**Solusi:**
- Tables sudah pernah dibuat sebelumnya
- Bisa diabaikan atau drop tables dulu jika ingin fresh start:
  ```sql
  DROP TABLE IF EXISTS borrowings CASCADE;
  DROP TABLE IF EXISTS books CASCADE;
  DROP TABLE IF EXISTS members CASCADE;
  ```
  Lalu import schema.sql lagi

### Error: "duplicate key value violates unique constraint"
**Solusi:**
- Data sudah pernah diimport sebelumnya
- Bisa diabaikan atau truncate tables dulu jika ingin fresh start:
  ```sql
  TRUNCATE TABLE borrowings CASCADE;
  TRUNCATE TABLE books CASCADE;
  TRUNCATE TABLE members CASCADE;
  ```
  Lalu import sample_data.sql lagi

### Error: "syntax error"
**Solusi:**
- Pastikan copy semua isi file tanpa ada yang terpotong
- Pastikan tidak ada karakter aneh yang ter-copy
- Coba copy ulang dari file asli

---

## Checklist Setup

Setelah semua langkah selesai, pastikan:

- [ ] Database `library_db` sudah dibuat
- [ ] Schema.sql sudah diimport (3 tables terbuat)
- [ ] Sample_data.sql sudah diimport (20 books, 20 members)
- [ ] Tables bisa di-view di DBeaver
- [ ] Data bisa di-query dengan benar

---

## Langkah Selanjutnya

Setelah database setup selesai:

1. **Pastikan file `.env` sudah ada** dan konfigurasinya benar
2. **Jalankan aplikasi:**
   ```powershell
   npm run dev
   ```
3. **Test API:**
   - Buka browser: `http://localhost:3000/health`
   - Atau test dengan Postman/curl

---

## Tips DBeaver

- **Shortcut Execute Script:** Ctrl+Alt+X
- **Shortcut Execute Statement:** Ctrl+Enter
- **Refresh Database:** F5 atau klik kanan → Refresh
- **View Table Data:** Klik kanan table → View Data
- **New SQL Editor:** Klik kanan database → SQL Editor → New SQL Script

