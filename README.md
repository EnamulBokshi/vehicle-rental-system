# Vehicle Rental System

A comprehensive vehicle rental management system built with Node.js, Express, TypeScript, and PostgreSQL. This system allows customers to rent vehicles and administrators to manage the entire rental operations.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication)
  - [Users](#users)
  - [Vehicles](#vehicles)
  - [Bookings](#bookings)
- [Project Structure](#project-structure)
- [Usage Examples](#usage-examples)
- [Security Features](#security-features)
- [License](#license)

## ✨ Features

### User Management
- User registration with email validation
- Secure login with JWT authentication
- Role-based access control (Admin & Customer)
- Profile management (view and update)

### Vehicle Management
- Add, update, and delete vehicles (Admin only)
- View all available vehicles
- Track vehicle availability status
- Support for multiple vehicle types (car, bike, van, SUV)

### Booking Management
- Create new bookings with automatic price calculation
- View booking history
- Automatic booking status updates when rental period expires
- Transaction-based booking creation to ensure data consistency
- Admin can view all bookings, customers can view their own bookings

### Security & Validation
- Password hashing with bcrypt
- JWT-based authentication
- Email lowercase enforcement
- Input validation with database constraints
- Protected routes with role-based middleware

## 🛠 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs
- **Development:** tsx (TypeScript executor)

## 📦 Prerequisites

Before running this project, ensure you have the following installed:

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/EnamulBokshi/vehicle-rental-system.git
   cd vehicle-rental-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   CONNECTION_STR=postgresql://username:password@localhost:5432/vehicle_rental_db
   JWT_SECRET=your_super_secret_jwt_key_here
   ```

4. **Initialize the database**
   
   The database tables will be created automatically when you start the application for the first time.

5. **Start the development server**
   ```bash
   npm run dev
   ```

   The server will start on `http://localhost:5000`

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port number | `5000` |
| `CONNECTION_STR` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/dbname` |
| `JWT_SECRET` | Secret key for JWT signing | `your_secret_key` |

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL CHECK (LENGTH(password) >= 6),
    phone VARCHAR(16) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin','customer'))
)
```

### Vehicles Table
```sql
CREATE TABLE vehicles (
    id SERIAL PRIMARY KEY,
    vehicle_name VARCHAR(100) NOT NULL,
    type VARCHAR(10) NOT NULL CHECK(type IN('car','bike','van','SUV')),
    registration_number VARCHAR(20) NOT NULL UNIQUE,
    daily_rent_price INT NOT NULL CHECK (daily_rent_price > 0),
    availability_status VARCHAR(10) NOT NULL DEFAULT 'available' 
        CHECK(availability_status IN ('available','booked'))
)
```

### Bookings Table
```sql
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL,
    vehicle_id INTEGER NOT NULL,
    rent_start_date DATE NOT NULL,
    rent_end_date DATE NOT NULL CHECK (rent_end_date > rent_start_date),
    total_price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES users(id),
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
)
```

## 📡 API Endpoints

### Authentication

#### Sign Up
```http
POST /api/v1/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "securePassword123",
  "phone": "01712345678",
  "role": "customer"
}
```

#### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@example.com",
      "role": "customer"
    }
  }
}
```

### Users

#### Get User Profile
```http
GET /api/v1/users/:userId
Authorization: Bearer <token>
```

#### Update User Profile
```http
PUT /api/v1/users/:userId
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Updated",
  "phone": "01798765432"
}
```

**Note:** Users can only update their own profile. Admins can update any user.

### Vehicles

#### Get All Vehicles
```http
GET /api/v1/vehicles
```

#### Get Single Vehicle
```http
GET /api/v1/vehicles/:id
```

#### Create Vehicle (Admin Only)
```http
POST /api/v1/vehicles
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "vehicle_name": "Toyota Corolla",
  "type": "car",
  "registration_number": "ABC-1234",
  "daily_rent_price": 50,
  "availability_status": "available"
}
```

#### Update Vehicle (Admin Only)
```http
PUT /api/v1/vehicles/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "vehicle_name": "Toyota Corolla 2024",
  "daily_rent_price": 60
}
```

#### Delete Vehicle (Admin Only)
```http
DELETE /api/v1/vehicles/:id
Authorization: Bearer <admin_token>
```

### Bookings

#### Create Booking
```http
POST /api/v1/bookings
Authorization: Bearer <token>
Content-Type: application/json

{
  "customer_id": 1,
  "vehicle_id": 5,
  "rent_start_date": "2024-01-15",
  "rent_end_date": "2024-01-20"
}
```

**Note:** Total price is calculated automatically based on rental days and vehicle's daily rent price.

#### Get Bookings
```http
GET /api/v1/bookings
Authorization: Bearer <token>
```

**Response:**
- **Customers:** See only their own bookings
- **Admins:** See all bookings with customer and vehicle details

```json
{
  "success": true,
  "message": "Bookings retrieved successfully",
  "data": [
    {
      "id": 1,
      "rent_start_date": "2024-01-15",
      "rent_end_date": "2024-01-20",
      "total_price": 250,
      "status": "active",
      "customer": {
        "name": "John Doe",
        "email": "john.doe@example.com"
      },
      "vehicle": {
        "vehicle_name": "Toyota Corolla",
        "registration_number": "ABC-1234"
      }
    }
  ]
}
```

## 📁 Project Structure

```
vehicle-rental-system/
├── src/
│   ├── config/
│   │   ├── db.ts              # Database configuration and initialization
│   │   └── index.ts           # Environment configuration
│   ├── helpers/
│   │   ├── errorMessage.ts    # Error response helper
│   │   └── successMessage.ts  # Success response helper
│   ├── middlewares/
│   │   └── auth.middleware.ts # JWT authentication middleware
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controllers.ts
│   │   │   ├── auth.routes.ts
│   │   │   └── auth.services.ts
│   │   ├── bookings/
│   │   │   ├── booking.controllers.ts
│   │   │   ├── booking.routers.ts
│   │   │   └── booking.services.ts
│   │   ├── users/
│   │   │   ├── user.controller.ts
│   │   │   ├── user.routes.ts
│   │   │   └── user.services.ts
│   │   └── vehicles/
│   │       ├── vehicle.controllers.ts
│   │       ├── vehicle.routes.ts
│   │       └── vehicle.services.ts
│   ├── types/
│   │   ├── commonTypes.ts     # Shared type definitions
│   │   ├── response.type.ts   # API response types
│   │   └── express/
│   │       └── index.d.ts     # Express type extensions
│   ├── app.ts                 # Express app configuration
│   └── server.ts              # Server entry point
├── .env                       # Environment variables (not in repo)
├── package.json
├── tsconfig.json
└── README.md
```

## 💡 Usage Examples

### Creating an Admin User

First, create a user with the admin role:

```bash
curl -X POST http://localhost:5000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "admin123",
    "phone": "01712345678",
    "role": "admin"
  }'
```

### Adding a Vehicle (as Admin)

```bash
curl -X POST http://localhost:5000/api/v1/vehicles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "vehicle_name": "Honda Civic",
    "type": "car",
    "registration_number": "XYZ-9876",
    "daily_rent_price": 45,
    "availability_status": "available"
  }'
```

### Creating a Booking (as Customer)

```bash
curl -X POST http://localhost:5000/api/v1/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_CUSTOMER_TOKEN" \
  -d '{
    "customer_id": 2,
    "vehicle_id": 1,
    "rent_start_date": "2024-12-10",
    "rent_end_date": "2024-12-15"
  }'
```

## 🔒 Security Features

1. **Password Security**
   - Passwords are hashed using bcrypt before storage
   - Minimum password length: 6 characters
   - Passwords are never returned in API responses

2. **JWT Authentication**
   - Secure token-based authentication
   - Tokens include user ID and role
   - Protected routes require valid JWT token

3. **Role-Based Access Control**
   - Admin-only routes for vehicle management
   - Users can only access/modify their own data
   - Proper authorization checks on all protected routes

4. **Input Validation**
   - Email uniqueness enforcement
   - Email lowercase normalization
   - Date validation (end date must be after start date)
   - Price validation (must be positive)
   - Enum constraints for role, vehicle type, and status fields

5. **Transaction Safety**
   - Database transactions for booking creation
   - Automatic rollback on failure
   - Prevents data inconsistency

## 🧪 Testing the API

You can test the API using tools like:
- **Postman** - Import the endpoints and test them
- **cURL** - Use the command-line examples above
- **Thunder Client** - VS Code extension for API testing

### Health Check

Verify the server is running:
```bash
curl http://localhost:5000/health-check
```

Expected response:
```json
{
  "success": true,
  "message": "Cool server is up and running!!"
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

ISC

## 👤 Author

**EnamulBokshi**
- GitHub: [@EnamulBokshi](https://github.com/EnamulBokshi)

## 📞 Support

For support or queries, please open an issue in the GitHub repository.

---

**Happy Coding! 🚗💨**
