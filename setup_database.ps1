# PowerShell Script untuk Setup Database
# Jalankan script ini untuk setup database secara otomatis

Write-Host "=== Library Management System - Database Setup ===" -ForegroundColor Cyan
Write-Host ""

# Cari lokasi psql.exe
$psqlPaths = @(
    "C:\Program Files\PostgreSQL\15\bin\psql.exe",
    "C:\Program Files\PostgreSQL\14\bin\psql.exe",
    "C:\Program Files\PostgreSQL\13\bin\psql.exe",
    "C:\Program Files (x86)\PostgreSQL\15\bin\psql.exe",
    "C:\Program Files (x86)\PostgreSQL\14\bin\psql.exe"
)

$psqlPath = $null
foreach ($path in $psqlPaths) {
    if (Test-Path $path) {
        $psqlPath = $path
        Write-Host "Found PostgreSQL at: $psqlPath" -ForegroundColor Green
        break
    }
}

if (-not $psqlPath) {
    Write-Host "ERROR: PostgreSQL not found!" -ForegroundColor Red
    Write-Host "Please install PostgreSQL or update the paths in this script." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Alternative: Use pgAdmin to run schema.sql and sample_data.sql manually" -ForegroundColor Yellow
    exit 1
}

# Konfigurasi
$dbUser = "postgres"
$dbName = "library_db"
$dbPassword = "your_password"  # Sesuaikan dengan password PostgreSQL Masing-masing

# Get current directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$schemaFile = Join-Path $scriptDir "schema.sql"
$sampleDataFile = Join-Path $scriptDir "sample_data.sql"

Write-Host ""
Write-Host "Database User: $dbUser" -ForegroundColor Cyan
Write-Host "Database Name: $dbName" -ForegroundColor Cyan
Write-Host "Schema File: $schemaFile" -ForegroundColor Cyan
Write-Host "Sample Data File: $sampleDataFile" -ForegroundColor Cyan
Write-Host ""

# Set environment variable for password
$env:PGPASSWORD = $dbPassword

# Step 1: Create database (if not exists)
Write-Host "Step 1: Creating database (if not exists)..." -ForegroundColor Yellow
& $psqlPath -U $dbUser -c "SELECT 1 FROM pg_database WHERE datname = '$dbName'" | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Creating database: $dbName" -ForegroundColor Yellow
    & $psqlPath -U $dbUser -c "CREATE DATABASE $dbName"
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Database created successfully!" -ForegroundColor Green
    } else {
        Write-Host "Failed to create database. It might already exist." -ForegroundColor Yellow
    }
} else {
    Write-Host "Database already exists." -ForegroundColor Green
}

# Step 2: Import schema
Write-Host ""
Write-Host "Step 2: Importing schema..." -ForegroundColor Yellow
if (Test-Path $schemaFile) {
    & $psqlPath -U $dbUser -d $dbName -f $schemaFile
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Schema imported successfully!" -ForegroundColor Green
    } else {
        Write-Host "Failed to import schema!" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "ERROR: schema.sql not found at $schemaFile" -ForegroundColor Red
    exit 1
}

# Step 3: Import sample data
Write-Host ""
Write-Host "Step 3: Importing sample data..." -ForegroundColor Yellow
if (Test-Path $sampleDataFile) {
    & $psqlPath -U $dbUser -d $dbName -f $sampleDataFile
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Sample data imported successfully!" -ForegroundColor Green
    } else {
        Write-Host "Failed to import sample data!" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "ERROR: sample_data.sql not found at $sampleDataFile" -ForegroundColor Red
    exit 1
}

# Step 4: Verify
Write-Host ""
Write-Host "Step 4: Verifying database..." -ForegroundColor Yellow
$bookCount = & $psqlPath -U $dbUser -d $dbName -t -c "SELECT COUNT(*) FROM books;"
$memberCount = & $psqlPath -U $dbUser -d $dbName -t -c "SELECT COUNT(*) FROM members;"

Write-Host ""
Write-Host "=== Setup Complete ===" -ForegroundColor Green
Write-Host "Books: $($bookCount.Trim())" -ForegroundColor Cyan
Write-Host "Members: $($memberCount.Trim())" -ForegroundColor Cyan
Write-Host ""
Write-Host "Database is ready to use!" -ForegroundColor Green

# Clear password from environment
Remove-Item Env:\PGPASSWORD

