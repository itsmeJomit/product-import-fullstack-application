# Laravel + React Product CSV Import Application

A full-stack web application built with Laravel (backend) and React (frontend) for user registration, login, product CSV import, and product listing with pagination, search, and role-based UI rendering.

---

## Features

### Laravel Backend

- User registration and login using Laravel Passport
- API authentication via `auth:api` guard
- Product CSV import (with validation and transactional error reporting)
- Paginated product listing
- Search functionality on product list
- Sample data file is provided at /backend/samples

### React Frontend

- Login and Register pages with validation
- Protected Dashboard route with product listing
- CSV import feature
- Search input to filter products
- Logout with token clearing
- Header adapts based on authentication status and current page
- Material UI styling

---

## Technologies Used

- Laravel 10
- Laravel Passport
- React 18 (Create React App)
- Axios for HTTP requests
- React Router for navigation
- Material UI for UI components

---

## Setup Instructions

### Backend (Laravel)

```bash
# Clone the repo
cd backend

# Install dependencies
composer install

# Copy .env and configure
cp .env.example .env
php artisan key:generate

# Configure your database in .env
DB_DATABASE=your_db_name
DB_USERNAME=your_username
DB_PASSWORD=your_password

# Run migrations and seeders
php artisan migrate

# Install Passport
php artisan passport:install

# Serve the backend
php artisan serve
```

### Frontend (React)

```bash
# Create and move into React app
cd frontend

# Copy .env and configure
cp .env.example .env.local

# Install required packages
npm install

# Start frontend server
npm start
```

### Environment

Ensure the frontend API requests point to your backend in the .env.local

```
REACT_APP_API_BASE_URL="http://localhost:8000/api"
```

---

## CSV File Format

Your CSV file for importing products should have the following headers:

```
name,price,sku,description
```

Sample data:

```
Laptop,1200,SKU001,High performance laptop
Phone,800,SKU002,Latest smartphone
```

---

## API Endpoints

| Method | Endpoint             | Description             |
| ------ | -------------------- | ----------------------- |
| POST   | /api/register        | Register a new user     |
| POST   | /api/login           | Login a user            |
| GET    | /api/products        | Get paginated products  |
| POST   | /api/import-products | Import products via CSV |

---

## Additional Notes

- CSV import supports batch insertion for performance.
- Product search is handled via a `search` query param.

---

## Author

Developed by Jomit.
