# WaitLess - Queue Management System

A comprehensive queue management solution with a React frontend and Express.js backend. WaitLess enables shop owners to manage customer queues efficiently using a token-based system, real-time updates with Socket.IO, and multi-counter support.

## 🎯 Features

### Core Functionality
- **Token-based Queue System** - Customers receive tokens when joining queues
- **Real-time Updates** - Socket.IO integration for live queue status
- **Multi-Counter Support** - Multiple service counters per shop
- **Staff Management** - Assign staff to counters
- **QR Code Integration** - Easy customer access via QR codes
- **Payment Integration** - Support for payment tracking
- **Token History** - Track served tokens and service analytics

### User Roles
- **Owner** - Full shop and queue management
- **Staff** - Counter operations and customer service
- **Customers** - Join queues and track their position

## 🏗️ Project Structure

### Frontend (React + Vite)
```
client/
├── src/
│   ├── pages/
│   │   ├── Landing.jsx              (Home page)
│   │   ├── Login.jsx                (Owner login)
│   │   ├── Register.jsx             (Owner registration)
│   │   ├── StaffLogin.jsx           (Staff authentication)
│   │   ├── StaffRegister.jsx        (Staff registration)
│   │   ├── Setup.jsx                (Shop setup wizard)
│   │   ├── OwnerDashboard.jsx       (Owner queue management)
│   │   ├── CustomerQueue.jsx        (Customer portal)
│   │   ├── CustomerStatus.jsx       (Customer token status)
│   │   ├── CounterPanel.jsx         (Staff counter panel)
│   │   ├── QRPage.jsx               (QR code display)
│   │   ├── Profile.jsx              (User profile management)
│   │   └── TokenHistory.jsx         (Historical token data)
│   ├── components/
│   │   ├── Layout.jsx               (Main layout wrapper)
│   │   ├── Button.jsx               (Reusable button)
│   │   ├── Input.jsx                (Form input)
│   │   ├── LoaderButton.jsx         (Button with loading state)
│   │   ├── Sidebar.jsx              (Navigation sidebar)
│   │   ├── QRPlaceholder.jsx        (QR code generator)
│   │   ├── SkeletonBlock.jsx        (Loading skeleton)
│   │   └── ui/                      (Additional UI components)
│   ├── utils/
│   │   ├── formValidation.js        (Form validation utilities)
│   │   ├── toastManager.js          (Toast notifications)
│   │   └── api.js                   (API client)
│   └── main.jsx                     (Entry point)
├── vite.config.js
├── tailwind.config.js
└── package.json
```

### Backend (Express.js)
```
server/
├── controllers/
│   ├── authController.js            (Authentication logic)
│   ├── counterController.js         (Counter operations)
│   ├── queueController.js           (Queue management)
│   ├── shopController.js            (Shop operations)
│   └── staffController.js           (Staff management)
├── routes/
│   ├── auth.js                      (Auth endpoints)
│   ├── counter.js                   (Counter endpoints)
│   ├── queue.js                     (Queue endpoints)
│   ├── shop.js                      (Shop endpoints)
│   └── staff.js                     (Staff endpoints)
├── middleware/
│   └── authMiddleware.js            (JWT authentication)
├── utils/
│   ├── jwtUtils.js                  (JWT token utilities)
│   ├── response.js                  (Response formatting)
│   └── validators.js                (Input validation)
├── prisma/
│   ├── schema.prisma                (Database schema)
│   └── migrations/                  (Database migrations)
├── server.js                        (Main server file)
└── package.json
```

## 🗄️ Database Schema

### Models
- **Owner** - Shop owner accounts with authentication
- **Shop** - Shop information and queue state
- **Staff** - Staff members assigned to shops
- **Counter** - Individual service counters
- **Token** - Customer tokens with status tracking

Key fields include payment integration, service time tracking, and performance indexes for optimization.

## 🚀 Getting Started

### Frontend Setup
```bash
cd client
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`

### Backend Setup
```bash
cd server
npm install
npm run dev
```
Backend runs on `http://localhost:5000`

### Database Setup
```bash
cd server
npm run prisma:migrate    # Run migrations
npm run prisma:studio     # Open Prisma Studio
```

## 📦 Tech Stack

### Frontend
- **React 19** - UI framework
- **React Router v7** - Client-side routing
- **Tailwind CSS 4** - Styling
- **Vite** - Build tool
- **Socket.IO Client** - Real-time communication
- **Axios** - HTTP client
- **Framer Motion** - Animations
- **React Hot Toast** - Notifications
- **QRCode.react** - QR code generation
- **Lucide React** - Icons

### Backend
- **Express.js** - Web server
- **Prisma** - ORM for database
- **PostgreSQL** - Database
- **Socket.IO** - Real-time bidirectional communication
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Helmet** - Security headers
- **Express Rate Limit** - Rate limiting

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS configuration
- Helmet security headers
- Rate limiting on endpoints
- Input validation and sanitization

## 📡 Real-time Features

- Socket.IO integration for instant queue updates
- Live customer position tracking
- Real-time counter status
- Automatic client reconnection

## 🎨 UI Features

- Responsive design (mobile-first)
- Clean, minimal interface
- Toast notifications for user feedback
- Loading states with skeleton screens
- QR code generation and scanning support

## 🚀 Commands

### Frontend
```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run preview  # Preview build
npm run lint     # ESLint check
```

### Backend
```bash
npm run dev               # Start with nodemon
npm start                 # Production start
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run migrations
npm run prisma:studio    # Open Prisma Studio
```

## 📋 API Endpoints

### Authentication
- `POST /api/auth/owner/register` - Owner registration
- `POST /api/auth/owner/login` - Owner login
- `POST /api/auth/staff/register` - Staff registration
- `POST /api/auth/staff/login` - Staff login

### Shop Management
- `GET /api/shop/:id` - Get shop details
- `POST /api/shop` - Create shop
- `PUT /api/shop/:id` - Update shop

### Queue Management
- `POST /api/queue/token` - Issue token
- `GET /api/queue/:shopId/status` - Get queue status
- `PUT /api/queue/token/:tokenId` - Update token status

### Counter Management
- `GET /api/counter/:shopId` - Get counters
- `POST /api/counter` - Create counter
- `PUT /api/counter/:id` - Update counter

### Staff Management
- `GET /api/staff/:shopId` - Get staff
- `POST /api/staff` - Add staff
- `PUT /api/staff/:id` - Update staff

## 🔄 Environment Variables

### Frontend
```
VITE_API_BASE_URL=http://localhost:5000
```

### Backend
```
DATABASE_URL=postgresql://...
PORT=5000
JWT_SECRET=your_secret_key
```

## 📝 Notes

- Full end-to-end authentication system implemented
- Database optimized with strategic indexes
- Real-time communication via WebSockets
- Multi-counter and multi-staff support
- Payment integration ready
- Token history and analytics tracking

---

Built with ❤️ using React, Express.js, and PostgreSQL
