# Backend Setup Instructions

## Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Create .env File

Create a `.env` file in the `backend` directory with the following content:

```env
DATABASE_URL="postgresql://<username>:<password>@localhost:5432/waitless"
JWT_SECRET="supersecretkey123"
PORT=5000
```

**Important:** Replace `<username>` and `<password>` with your PostgreSQL credentials.

### 3. Set Up Database

Make sure PostgreSQL is running, then:

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations to create database tables
npx prisma migrate dev --name init
```

### 4. Start the Server

```bash
# Development mode (auto-reload on changes)
npm run dev

# Or production mode
npm start
```

The server will start on `http://localhost:5000`

## Testing the API

You can test the endpoints using:

- **Postman**
- **curl**
- **Thunder Client** (VS Code extension)
- **Frontend application**

## Example API Calls

### Register Owner
```bash
curl -X POST http://localhost:5000/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

### Create Shop (requires auth token)
```bash
curl -X POST http://localhost:5000/api/shop/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"name":"My Shop","address":"123 Main St","category":"Restaurant"}'
```

