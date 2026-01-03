WaitLess – Queue Management System

WaitLess is a full-stack queue management system built to reduce waiting time and improve customer experience in shops, hospitals, and service centers.
It replaces physical queues with a token-based, real-time digital system that works across multiple counters and staff members.

🤔 Why I Built WaitLess

In many service-based businesses, customers still stand in long queues without knowing:

How long they need to wait

Which counter is active

Whether the queue is moving fairly

Shop owners also struggle to:

Manage multiple counters

Assign staff efficiently

Handle frustrated customers during peak hours

I built WaitLess to solve these problems using modern web technologies like React, Node.js, Socket.IO, and PostgreSQL, providing a smooth and real-time queue experience for everyone involved.

🎯 What WaitLess Does

Customers receive a digital token instead of standing in line

Live queue updates without refreshing the page

Supports multiple counters per shop

Staff can manage tokens from their assigned counters

Customers can join queues easily using QR codes

Owners get full control over shops, staff, and counters

🧩 Problems This Project Solves

Eliminates physical waiting lines

Prevents unfair token handling

Reduces confusion at service counters

Improves customer satisfaction

Helps shop owners manage peak-time traffic

👥 User Roles
Owner

Create and manage shops

Add counters and staff

Monitor live queues

View token history and analytics

Staff

Login to assigned counters

Call and serve tokens

Update token status in real time

Customer

Join queue using QR code

Receive token instantly

Track live queue position

View current token status

🚀 Key Features
Core Functionality

Token-based queue system

Real-time updates using Socket.IO

Multi-counter support

Staff assignment per counter

QR code based customer access

Token history tracking

Payment status support (ready for integration)

UI & UX

Fully responsive design (mobile-first)

Clean and minimal interface

Skeleton loaders and loading states

Toast notifications for feedback

Smooth transitions and animations

🏗️ Project Structure
Frontend (React + Vite)
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

Backend (Express.js + Prisma)
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

🗄️ Database Design
Core Models

Owner – Shop owner accounts

Shop – Shop details and queue state

Staff – Staff members assigned to shops

Counter – Individual service counters

Token – Customer tokens with status tracking

Optimized with proper indexing for performance and scalability.

⚠️ Challenges Faced

Implementing real-time updates using Socket.IO

Handling multiple counters without token conflicts

Managing role-based authentication (Owner vs Staff)

Keeping the UI fully responsive across devices

Maintaining clean communication between frontend and backend

🔐 Security Features

JWT-based authentication

Password hashing using bcrypt

Role-based route protection

Input validation and sanitization

Helmet security headers

Rate limiting on APIs

Secure CORS configuration

🚀 Getting Started
Frontend Setup
cd client
npm install
npm run dev


Runs on: http://localhost:5173

Backend Setup
cd server
npm install
npm run dev


Runs on: http://localhost:5000

Database Setup
cd server
npm run prisma:generate
npm run prisma:migrate
npm run prisma:studio

📡 API Overview
Authentication

POST /api/auth/owner/register

POST /api/auth/owner/login

POST /api/auth/staff/register

POST /api/auth/staff/login

Shop

POST /api/shop

GET /api/shop/:id

PUT /api/shop/:id

Queue

POST /api/queue/token

GET /api/queue/:shopId/status

PUT /api/queue/token/:tokenId

Counter

POST /api/counter

GET /api/counter/:shopId

PUT /api/counter/:id

Staff

POST /api/staff

GET /api/staff/:shopId

PUT /api/staff/:id

🚧 Future Improvements

WhatsApp / SMS notifications

Estimated waiting time calculation

Advanced analytics dashboard

Auto token assignment using AI

Multi-shop owner support

Payment gateway automation

🛠️ Tech Stack
Frontend

React

React Router

Tailwind CSS

Vite

Socket.IO Client

Axios

Framer Motion

Backend

Node.js

Express.js

Prisma ORM

PostgreSQL

Socket.IO

JWT Authentication

👨‍💻 Author

Avinash Ponneboina
Full-Stack Developer
Tech Stack: React, Node.js, Express, PostgreSQL

⭐ Final Note

This project was built to solve a real-world problem, not just as a demo.
Contributions, feedback, and suggestions are always welcome
