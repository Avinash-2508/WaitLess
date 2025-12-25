# WaitLess Backend API

Backend API for WaitLess queue management system built with Node.js, Express, PostgreSQL, and Prisma.

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and update with your database credentials:

```env
DATABASE_URL="postgresql://<username>:<password>@localhost:5432/waitless"
JWT_SECRET="supersecretkey123"
PORT=5000
```

### 3. Set Up Database

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init
```

### 4. Start Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication

- `POST /api/register` - Register a new shop owner
- `POST /api/login` - Login shop owner

### Shop Management

- `POST /api/shop/create` - Create shop (requires auth)
- `GET /api/shop/:shopId` - Get shop details
- `GET /api/shop/owner/my-shop` - Get owner's shop (requires auth)

### Queue Management

- `GET /api/queue/:shopId` - Get current queue status
- `POST /api/queue/:shopId/join` - Customer joins queue (no auth)
- `POST /api/queue/:shopId/next` - Owner calls next customer (requires auth)

## Authentication

Protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Database Schema

- **Owner**: Shop owners with authentication
- **Shop**: Shop details and current token tracking

