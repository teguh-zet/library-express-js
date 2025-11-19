# Setup Guide - Library Management System

Panduan lengkap untuk setup database PostgreSQL dan konfigurasi environment variables.

## Prerequisites

Pastikan sudah terinstall:
- Node.js (v14 atau lebih baru)
- PostgreSQL (v12 atau lebih baru)
- psql command line tool (biasanya sudah termasuk dengan PostgreSQL)

---

## Tahap 1: Setup PostgreSQL Database

Tahap ini akan membuat struktur database (tables, indexes) dan mengisi data sample.

### Langkah-langkah:

#### 1.1. Pastikan PostgreSQL Service Running

**Windows:**
- Buka Services (Win + R, ketik `services.msc`)
- Cari "postgresql" service
- Pastikan statusnya "Running"
- Jika tidak, klik kanan → Start

**Atau melalui Command Prompt (sebagai Administrator):**
```cmd
net start postgresql-x64-14
```
*(Sesuaikan versi PostgreSQL Anda)*

#### 1.2. Buat Database (jika belum ada)

Buka Command Prompt atau PowerShell, lalu jalankan:

```cmd
psql -U postgres
```

Masukkan password PostgreSQL Anda. Setelah masuk ke psql prompt, jalankan:

```sql
CREATE DATABASE library_db;
\q
```

*(Untuk keluar dari psql, ketik `\q`)*

#### 1.3. Import Schema Database

Jalankan file `schema.sql` untuk membuat tables dan indexes:

**⚠️ Jika error "psql is not recognized":**

**Solusi 1: Gunakan Full Path ke psql**
```powershell
# Cari lokasi instalasi PostgreSQL (biasanya di salah satu lokasi ini):
# C:\Program Files\PostgreSQL\14\bin\psql.exe
# C:\Program Files\PostgreSQL\15\bin\psql.exe
# C:\Program Files (x86)\PostgreSQL\14\bin\psql.exe

# Gunakan full path (sesuaikan versi PostgreSQL Anda):
& "C:\Program Files\PostgreSQL\14\bin\psql.exe" -U postgres -d library_db -f schema.sql
```

**Solusi 2: Tambahkan PostgreSQL ke PATH**
```powershell
# Cek lokasi instalasi PostgreSQL
Get-ChildItem "C:\Program Files\PostgreSQL" -ErrorAction SilentlyContinue

# Tambahkan ke PATH untuk session ini
$env:Path += ";C:\Program Files\PostgreSQL\14\bin"

# Sekarang bisa langsung pakai psql
psql -U postgres -d library_db -f schema.sql
```

**Solusi 3: Gunakan pgAdmin (GUI)**
1. Buka pgAdmin 4
2. Connect ke PostgreSQL server
3. Klik kanan database `library_db` → Query Tool
4. Copy isi file `schema.sql` dan paste di Query Tool
5. Klik Execute (F5)

**Windows (Command Prompt atau PowerShell) - Jika psql sudah di PATH:**
```cmd
psql -U postgres -d library_db -f schema.sql
```

**Penjelasan command:**
- `psql` - PostgreSQL command line tool
- `-U postgres` - User: postgres (default PostgreSQL user)
- `-d library_db` - Database: library_db
- `-f schema.sql` - File SQL yang akan dijalankan

**Apa yang dilakukan schema.sql:**
- Membuat 3 tables: `books`, `members`, `borrowings`
- Membuat foreign key relationships
- Membuat indexes untuk performa query yang lebih baik

**Contoh output sukses:**
```
CREATE TABLE
CREATE TABLE
CREATE TABLE
CREATE INDEX
CREATE INDEX
...
```

#### 1.4. Import Sample Data

Jalankan file `sample_data.sql` untuk mengisi data sample:

**Jika psql tidak dikenali, gunakan full path:**
```powershell
& "C:\Program Files\PostgreSQL\14\bin\psql.exe" -U postgres -d library_db -f sample_data.sql
```

**Atau jika sudah di PATH:**
```cmd
psql -U postgres -d library_db -f sample_data.sql
```

**Atau via pgAdmin:**
1. Buka pgAdmin 4
2. Connect ke PostgreSQL server
3. Klik kanan database `library_db` → Query Tool
4. Copy isi file `sample_data.sql` dan paste di Query Tool
5. Klik Execute (F5)

**Apa yang dilakukan sample_data.sql:**
- Insert 20 sample books
- Insert 20 sample members

**Contoh output sukses:**
```
INSERT 0 20
INSERT 0 20
```

#### 1.5. Verifikasi Database

Untuk memastikan semua sudah terbuat dengan benar:

```cmd
psql -U postgres -d library_db
```

Kemudian jalankan query:

```sql
-- Cek tables
\dt

-- Cek jumlah books
SELECT COUNT(*) FROM books;

-- Cek jumlah members
SELECT COUNT(*) FROM members;

-- Cek struktur table books
\d books

-- Keluar
\q
```

**Expected output:**
- `books` table: 20 rows
- `members` table: 20 rows
- `borrowings` table: 0 rows (kosong, akan terisi saat testing)

---

## Tahap 2: Setup .env File

File `.env` digunakan untuk menyimpan konfigurasi aplikasi seperti database connection, port, dll.

### Langkah-langkah:

#### 2.1. Buat File .env

Buat file baru dengan nama `.env` di root directory project (sama level dengan `package.json`).

**Windows (Command Prompt):**
```cmd
cd "C:\Users\TehhGuhh\Downloads\Lamaran\sgt\project sgt"
type nul > .env
```

**Atau buat manual:**
1. Buka folder project di File Explorer
2. Klik kanan → New → Text Document
3. Rename menjadi `.env` (pastikan extension-nya benar)
4. Jika Windows memperingatkan tentang perubahan extension, klik "Yes"

#### 2.2. Isi File .env

Buka file `.env` dengan text editor (Notepad, VS Code, dll) dan copy-paste konfigurasi berikut:

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

**Penjelasan setiap variable:**
- `PORT=3000` - Port dimana server akan berjalan
- `NODE_ENV=development` - Environment mode (development/production)
- `DB_HOST=localhost` - Database host (localhost karena database di komputer yang sama)
- `DB_USER=postgres` - Username PostgreSQL (default: postgres)
- `DB_PASSWORD=teazet` - Password PostgreSQL Anda (sesuaikan dengan password Anda)
- `DB_NAME=library_db` - Nama database yang sudah dibuat di Tahap 1
- `DB_PORT=5432` - Port PostgreSQL (default: 5432)

**⚠️ PENTING:**
- **Sesuaikan `DB_PASSWORD`** dengan password PostgreSQL Anda
- Jika password berbeda, ubah nilai `DB_PASSWORD=teazet` menjadi password Anda
- File `.env` jangan di-commit ke Git (sudah ada di `.gitignore`)

#### 2.3. Verifikasi File .env

Pastikan file `.env` ada di root directory dan isinya benar:

**Windows (Command Prompt):**
```cmd
type .env
```

**Atau cek di File Explorer:**
- File harus ada di: `C:\Users\TehhGuhh\Downloads\Lamaran\sgt\project sgt\.env`
- Pastikan tidak ada typo dalam nama file

---

## Troubleshooting

### Error: "psql: command not found" atau "psql is not recognized"
**Solusi:**

**1. Gunakan Full Path:**
```powershell
# Cari lokasi instalasi PostgreSQL
Get-ChildItem "C:\Program Files\PostgreSQL" -Recurse -Filter "psql.exe" | Select-Object FullName

# Gunakan full path yang ditemukan (contoh):
& "C:\Program Files\PostgreSQL\14\bin\psql.exe" -U postgres -d library_db -f schema.sql
```

**2. Tambahkan ke PATH (Temporary untuk session ini):**
```powershell
$env:Path += ";C:\Program Files\PostgreSQL\14\bin"
psql -U postgres -d library_db -f schema.sql
```

**3. Tambahkan ke PATH (Permanent):**
- Buka System Properties → Environment Variables
- Edit "Path" di System Variables
- Tambahkan: `C:\Program Files\PostgreSQL\14\bin` (sesuaikan versi)
- Restart PowerShell/Command Prompt

**4. Gunakan pgAdmin (Alternatif):**
- Buka pgAdmin 4
- Connect ke server
- Gunakan Query Tool untuk menjalankan SQL files

### Error: "password authentication failed"
**Solusi:**
- Pastikan password di `.env` sesuai dengan password PostgreSQL
- Coba login manual: `psql -U postgres` untuk verifikasi password

### Error: "database does not exist"
**Solusi:**
- Buat database terlebih dahulu: `CREATE DATABASE library_db;`
- Atau sesuaikan `DB_NAME` di `.env` dengan database yang sudah ada

### Error: "relation already exists"
**Solusi:**
- Schema sudah pernah diimport sebelumnya
- Bisa diabaikan (tables sudah ada)
- Atau drop database dan buat ulang jika ingin fresh start

### File .env tidak terbaca
**Solusi:**
- Pastikan file benar-benar bernama `.env` (bukan `.env.txt`)
- Pastikan file ada di root directory project
- Restart terminal/command prompt setelah membuat file

---

## Quick Setup Commands (Windows)

Jika semua sudah siap, jalankan commands berikut secara berurutan:

```cmd
REM 1. Buat database (jika belum ada)
psql -U postgres -c "CREATE DATABASE library_db;"

REM 2. Import schema
psql -U postgres -d library_db -f schema.sql

REM 3. Import sample data
psql -U postgres -d library_db -f sample_data.sql

REM 4. Buat file .env (copy command ini dan sesuaikan password)
echo PORT=3000 > .env
echo NODE_ENV=development >> .env
echo. >> .env
echo # PostgreSQL Database >> .env
echo DB_HOST=localhost >> .env
echo DB_USER=postgres >> .env
echo DB_PASSWORD=teazet >> .env
echo DB_NAME=library_db >> .env
echo DB_PORT=5432 >> .env
```

**Atau buat file .env secara manual lebih mudah!**

---

## Setelah Setup Selesai

Setelah kedua tahap selesai, jalankan aplikasi:

```cmd
npm install
npm run dev
```

Server akan berjalan di `http://localhost:3000`

Test dengan:
```cmd
curl http://localhost:3000/health
```

Atau buka browser: `http://localhost:3000/health`

