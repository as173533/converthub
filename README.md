# ConvertHub Pro

ConvertHub Pro is a Laravel 13 SaaS file conversion platform with React + Vite inside Laravel, Sanctum token authentication, Redis queue jobs, Docker services, local private storage, dashboard analytics, history, and admin operations.

## Stack

- Laravel 13, PHP 8.3
- React + Vite + Tailwind CSS
- Laravel Sanctum
- MySQL, Redis cache and queues
- Docker: PHP-FPM, Nginx, MySQL, Redis, Node, queue worker
- The PHP image installs PDF/image tools by default. LibreOffice is optional because it makes first builds very large.

## Structure

```text
app/
  Http/Controllers/Api     API controllers
  Http/Requests            Validation requests
  Jobs                     Redis queue jobs
  Models                   Eloquent models
  Policies                 User access policies
  Services                 Storage and conversion logic
database/migrations        users, conversion_jobs, conversion_files, tool_usages, queues
resources/js               React application
resources/css              Tailwind entry
routes/api.php             Sanctum-protected API
docker/                    PHP and Nginx images
storage/app/private        Uploads and conversions
```

## Setup With Docker

```bash
cp .env.example .env
docker compose up -d --build
docker compose exec app composer install
docker compose exec app php artisan key:generate
docker compose exec app php artisan migrate --seed
```

Open:

- App: `http://localhost:8000`
- Vite dev server: `http://localhost:5173`

The seeded admin account is:

- Email: `admin@converthub.test`
- Password: `password`

## Local Development Without Docker

```bash
composer install
npm install
php artisan key:generate
php artisan migrate --seed
npm run dev
php artisan queue:work redis --queue=conversions,default
php artisan serve
```

## Queue Rule

Upload endpoints only validate files, store originals under `storage/app/private/uploads`, create a `conversion_jobs` record, and dispatch `ProcessConversionJob` to Redis. Heavy conversion work belongs in `app/Jobs/ProcessConversionJob.php` and `app/Services/ConversionService.php`.

## Conversion Coverage

Implemented service adapters:

- Image to PDF
- JPG to PNG
- PNG to JPG
- WEBP to JPG/PNG
- Compress image
- Queue-backed placeholders for PDF compression, merge, split, rotate, PDF to image, and PDF editor operations

The PDF placeholders are intentionally isolated in `ConversionService::runTool()` so production tools such as Ghostscript, qpdf, Poppler, FPDI, or LibreOffice can replace the copy adapter without changing controllers, jobs, or frontend contracts.

To include LibreOffice in the PHP image for DOCX/PDF office conversion adapters later, build with:

```bash
docker compose build --build-arg INSTALL_OFFICE=true app queue
```

## Useful Commands

```bash
docker compose exec app php artisan test
docker compose exec app php artisan queue:work redis --queue=conversions,default
docker compose exec app php artisan route:list
npm run build
```
