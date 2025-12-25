# How to Check Your WaitLess Project

## ✅ Quick Verification Commands

### 1. Check Git Status (Is everything saved?)
```bash
git status
```
**Expected:** `nothing to commit, working tree clean`

### 2. Check Git Commits (View saved history)
```bash
git log --oneline
```
**Expected:** Should show 2 commits:
- Complete WaitLess project
- Fix: Add backend files directly

### 3. Check if Backend Server is Running
```bash
# Test if port 5000 is accessible
Test-NetConnection -ComputerName localhost -Port 5000
```

Or visit in browser: `http://localhost:5000`
**Expected:** `{"message":"WaitLess API is running"}`

### 4. Check Frontend Files
```bash
Get-ChildItem src -Recurse -File | Select-Object Name
```
**Expected:** Should show 22 files including:
- Components (Button, Input, Layout, QRPlaceholder)
- Pages (Landing, Login, Register, Setup, etc.)

### 5. Check Backend Files
```bash
Get-ChildItem backend -Recurse -File -Exclude node_modules | Select-Object Name
```
**Expected:** Should show:
- server.js
- routes/ (auth.js, shop.js, queue.js)
- middleware/auth.js
- prisma/schema.prisma

### 6. Test API Endpoints

#### Test Register Endpoint:
```powershell
$body = @{
    name = "Test User"
    email = "test@example.com"
    password = "test123"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/register" `
    -Method POST `
    -Body $body `
    -ContentType "application/json"
```

#### Test Login Endpoint:
```powershell
$body = @{
    email = "test@example.com"
    password = "test123"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/login" `
    -Method POST `
    -Body $body `
    -ContentType "application/json"
```

## 🚀 Start Services

### Start Backend Server:
```bash
cd backend
node server.js
```

### Start Frontend (in another terminal):
```bash
npm run dev
```

## 📊 Project Structure Check

```
waitless/
├── src/                    # Frontend React app
│   ├── components/         # Reusable components
│   ├── pages/             # Page components
│   └── ...
├── backend/               # Backend API
│   ├── routes/            # API routes
│   ├── middleware/        # Auth middleware
│   ├── prisma/            # Database schema
│   └── server.js          # Main server file
└── ...
```

## ✅ Everything is Saved If:

1. ✅ `git status` shows "working tree clean"
2. ✅ `git log` shows your commits
3. ✅ All files exist in their directories
4. ✅ Backend server runs without errors
5. ✅ API endpoints respond correctly

