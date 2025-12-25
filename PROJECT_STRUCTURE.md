# WaitLess Project Structure

## 📍 Project Location
**Path:** `D:\Web\waitless`

## 📁 Folder Structure

```
waitless/
│
├── 📂 src/                          # Frontend React Application
│   ├── 📂 components/               # Reusable UI Components
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Layout.jsx
│   │   ├── QRPlaceholder.jsx
│   │   └── ...
│   │
│   ├── 📂 pages/                    # Page Components
│   │   ├── Landing.jsx             # Landing page with animation
│   │   ├── Register.jsx            # Shop owner registration
│   │   ├── Login.jsx                # Shop owner login
│   │   ├── Setup.jsx                # Shop setup page
│   │   ├── QRPage.jsx               # QR code display
│   │   ├── OwnerDashboard.jsx       # Owner dashboard
│   │   ├── CustomerQueue.jsx         # Customer join queue
│   │   └── CustomerStatus.jsx       # Customer status tracking
│   │
│   ├── App.jsx                      # Main app component with routes
│   ├── main.jsx                     # React entry point
│   └── index.css                    # Global styles
│
├── 📂 backend/                      # Backend API Server
│   ├── 📂 routes/                   # API Route Handlers
│   │   ├── auth.js                  # Authentication routes
│   │   ├── shop.js                  # Shop management routes
│   │   └── queue.js                 # Queue management routes
│   │
│   ├── 📂 middleware/               # Express Middleware
│   │   └── auth.js                  # JWT authentication middleware
│   │
│   ├── 📂 prisma/                   # Database Schema & Migrations
│   │   ├── schema.prisma           # Database schema
│   │   └── migrations/              # Database migrations
│   │
│   ├── server.js                    # Express server entry point
│   ├── package.json                 # Backend dependencies
│   └── .env                         # Environment variables (DB, JWT)
│
├── 📂 public/                       # Static assets
├── 📂 node_modules/                 # Frontend dependencies
├── package.json                     # Frontend dependencies
├── vite.config.js                   # Vite configuration
├── tailwind.config.js               # Tailwind CSS configuration
└── index.html                       # HTML entry point
```

## 🎯 Key Files

### Frontend
- **`src/App.jsx`** - Main app with all routes
- **`src/pages/Landing.jsx`** - Landing page with animation
- **`src/pages/Login.jsx`** - Login page
- **`src/components/Layout.jsx`** - Layout wrapper with navbar

### Backend
- **`backend/server.js`** - Express server (runs on port 5000)
- **`backend/routes/auth.js`** - Register & Login endpoints
- **`backend/routes/shop.js`** - Shop creation endpoints
- **`backend/routes/queue.js`** - Queue management endpoints
- **`backend/prisma/schema.prisma`** - Database schema

## 🚀 How to Open in VS Code

1. **Method 1: From Terminal**
   ```bash
   cd D:\Web\waitless
   code .
   ```

2. **Method 2: From VS Code**
   - Open VS Code
   - File → Open Folder
   - Navigate to: `D:\Web\waitless`
   - Click "Select Folder"

3. **Method 3: Drag & Drop**
   - Open File Explorer
   - Navigate to `D:\Web\waitless`
   - Drag the folder into VS Code window

## ✅ Your Files Are All There!

All your files are saved in:
- **Frontend:** `D:\Web\waitless\src\`
- **Backend:** `D:\Web\waitless\backend\`

Just open the `waitless` folder in VS Code to see everything!

