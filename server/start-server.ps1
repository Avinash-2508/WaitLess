# WaitLess Backend Server Startup Script

Write-Host "🚀 Starting WaitLess Backend Server..." -ForegroundColor Cyan

# Check if port 5000 is in use
$portInUse = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue

if ($portInUse) {
    Write-Host "⚠️  Port 5000 is already in use. Stopping existing process..." -ForegroundColor Yellow
    $processId = $portInUse.OwningProcess
    Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
    Write-Host "✅ Port 5000 is now free." -ForegroundColor Green
}

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host "❌ .env file not found!" -ForegroundColor Red
    Write-Host "Please create .env file with:" -ForegroundColor Yellow
    Write-Host "DATABASE_URL=`"postgresql://USER:PASSWORD@localhost:5432/waitless`"" -ForegroundColor White
    Write-Host "JWT_SECRET=`"your-secret-key`"" -ForegroundColor White
    Write-Host "PORT=5000" -ForegroundColor White
    exit 1
}

# Check if Prisma Client is generated
if (-not (Test-Path "node_modules/@prisma/client")) {
    Write-Host "📦 Generating Prisma Client..." -ForegroundColor Yellow
    npx prisma generate
}

# Start the server
Write-Host "`n✅ Starting server on http://localhost:5000`n" -ForegroundColor Green
node server.js
