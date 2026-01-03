# WaitLess - Queue Management System

WaitLess is a full-stack queue management system designed to reduce waiting time and improve customer experience in shops, hospitals, and service centers. It replaces physical queues with a real-time, token-based digital system that supports multiple counters and staff members.

---

## 🤔 Why I Built WaitLess

Many service-based businesses still rely on long physical queues with little visibility into wait times or counter status. Shop owners also struggle to manage multiple counters, staff assignments, and peak-hour traffic. WaitLess uses modern web technologies (React, Node.js, Socket.IO, PostgreSQL) to deliver a smoother, fairer queue experience.

---

## 🎯 What WaitLess Does

- Issues digital tokens to customers
- Shows live queue updates without page refresh
- Supports multiple service counters
- Allows staff to manage assigned counters
- Lets customers join queues via QR codes
- Tracks token history and service status

---

## 🧩 Problems This Project Solves

- Eliminates physical waiting lines
- Prevents unfair token handling
- Reduces confusion at service counters
- Improves customer satisfaction
- Helps businesses manage queues efficiently

---

## 👥 User Roles

### Owner
- Create and manage shops
- Add counters and staff
- Monitor live queues
- View token history and analytics

### Staff
- Log in to assigned counters
- Call and serve tokens
- Update token status in real time

### Customer
- Join queues using QR codes
- Receive digital tokens
- Track live queue position
- View current token status

---

## 🚀 Features

### Core Features
- Token-based queue system
- Real-time updates using Socket.IO
- Multi-counter support
- Staff and counter assignment
- QR code based access
- Token history tracking
- Payment status support (integration-ready)

### UI and UX
- Fully responsive (mobile-first)
- Clean and minimal interface
- Skeleton loaders and loading states
- Toast notifications
- Smooth animations and transitions

---

## 🏗️ Project Structure

### Frontend (React + Vite)
```
client/
├── src/
│   ├── pages/
│   │   ├── Landing.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── StaffLogin.jsx
│   │   ├── StaffRegister.jsx
│   │   ├── Setup.jsx
│   │   ├── OwnerDashboard.jsx
│   │   ├── CustomerQueue.jsx
│   │   ├── CustomerStatus.jsx
│   │   ├── CounterPanel.jsx
│   │   ├── QRPage.jsx
│   │   ├── Profile.jsx
│   │   └── TokenHistory.jsx
│   ├── components/
│   │   ├── Layout.jsx
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── LoaderButton.jsx
│   │   ├── Sidebar.jsx
│   │   ├── QRPlaceholder.jsx
│   │   ├── SkeletonBlock.jsx
│   │   └── ui/
│   ├── utils/
│   │   ├── api.js
│   │   ├── formValidation.js
│   │   └── toastManager.js
│   └── main.jsx
├── vite.config.js
├── tailwind.config.js
└── package.json
```

### Backend (Express.js + Prisma)
```
server/
├── controllers/
│   ├── authController.js
│   ├── shopController.js
│   ├── queueController.js
│   ├── counterController.js
│   └── staffController.js
├── routes/
│   ├── auth.js
│   ├── shop.js
│   ├── queue.js
│   ├── counter.js
│   └── staff.js
├── middleware/
│   └── authMiddleware.js
├── utils/
│   ├── jwtUtils.js
│   ├── response.js
│   └── validators.js
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── server.js
└── package.json
```

---

## 🗄️ Database Design

### Models
- Owner – Shop owner accounts
- Shop – Shop details and queue state
- Staff – Staff members assigned to shops
- Counter – Individual service counters
- Token – Customer tokens with status tracking

---

## ⚠️ Challenges Faced

- Implementing real-time updates using Socket.IO
- Managing multiple counters without token conflicts
- Role-based authentication (Owner vs Staff)
- Responsive UI across devices
- Frontend–backend synchronization

---

## 🔐 Security Features

- JWT-based authentication
- Password hashing using bcrypt
- Role-based API protection
- Input validation and sanitization
- Helmet security headers
- Rate limiting
- Secure CORS configuration

---

## 🚀 Getting Started

### Frontend
```bash
cd client
npm install
npm run dev
# Runs on: http://localhost:5173
```

### Backend
```bash
cd server
npm install
npm run dev
# Runs on: http://localhost:5000
```

### Database
```bash
cd server
npm run prisma:generate
npm run prisma:migrate
npm run prisma:studio
```

---

## 📡 API Overview

### Authentication
- POST /api/auth/owner/register
- POST /api/auth/owner/login
- POST /api/auth/staff/register
- POST /api/auth/staff/login

### Shop
- POST /api/shop
- GET /api/shop/:id
- PUT /api/shop/:id

### Queue
- POST /api/queue/token
- GET /api/queue/:shopId/status
- PUT /api/queue/token/:tokenId

### Counter
- POST /api/counter
- GET /api/counter/:shopId
- PUT /api/counter/:id

### Staff
- POST /api/staff
- GET /api/staff/:shopId
- PUT /api/staff/:id

---

## 🚧 Future Improvements

- WhatsApp / SMS notifications
- Estimated waiting time prediction
- Analytics dashboard
- AI-based token optimization
- Multi-shop owner support
- Payment gateway automation

---

## 🛠️ Tech Stack

### Frontend
- React
- React Router
- Tailwind CSS
- Vite
- Socket.IO Client
- Axios

### Backend
- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- Socket.IO
- JWT authentication

---

## 👨‍💻 Author

Avinash Ponneboina  
Full-Stack Developer  
React • Node.js • Express • PostgreSQL
