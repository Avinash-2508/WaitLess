# WaitLess Backend API

Complete backend API for WaitLess queue management system.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up database (make sure PostgreSQL is running)
npx prisma migrate dev --name init

# Start server
node server.js
```

Server runs on `http://localhost:5000`

## 📁 Project Structure

```
backend/
├── server.js                 # Express app entry point
├── prisma/
│   └── schema.prisma        # Database schema
├── routes/
│   ├── auth.js              # Auth routes
│   ├── shop.js              # Shop routes
│   └── queue.js             # Queue routes
├── controllers/
│   ├── authController.js    # Auth logic
│   ├── shopController.js    # Shop logic
│   └── queueController.js   # Queue logic
├── middleware/
│   └── authMiddleware.js    # JWT authentication
└── .env                     # Environment variables
```

## 🔌 API Endpoints

### Authentication
- `POST /auth/register` - Register shop owner
- `POST /auth/login` - Login shop owner (returns `{ token, ownerId }`)

### Shop Management
- `POST /shop` - Create shop (requires auth)
- `GET /shop/:id` - Get shop info

### Queue Management
- `GET /queue/:shopId` - Get current token
- `POST /queue/:shopId/join` - Customer joins queue (no auth)
- `POST /queue/:shopId/next` - Owner calls next customer (requires auth)

## 🔐 Authentication

Protected routes require JWT token in header:
```
Authorization: Bearer <token>
```

## 📝 Example Frontend Usage

```javascript
// Login
const response = await axios.post("http://localhost:5000/auth/login", {
  email: "owner@example.com",
  password: "password123"
});
localStorage.setItem("token", response.data.token);

// Create Shop (protected)
await axios.post("http://localhost:5000/shop", {
  name: "My Shop",
  address: "123 Main St",
  category: "Restaurant"
}, {
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
});

// Get Shop Info
const shop = await axios.get("http://localhost:5000/shop/123");

// Join Queue (no auth)
const queue = await axios.post("http://localhost:5000/queue/123/join");
// Returns: { token: 1, shopId: "123", shopName: "My Shop" }
```

## 🗄️ Database

Uses PostgreSQL with Prisma ORM. Schema includes:
- `Owner` model` - Shop owners with authentication
- `Shop` model - Shop details and current token

## ⚙️ Environment Variables

Create `.env` file:
```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/waitless"
JWT_SECRET="super-secret-key"
PORT=5000
```
