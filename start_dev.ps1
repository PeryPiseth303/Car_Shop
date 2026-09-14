# Aurelia Motors - Safe Dev Server Launcher
# This script launches frontend and backend in isolated windows to prevent hangs,
# accidental Ctrl+C interrupts, and memory crashes.

Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "  Aurelia Motors - Safe Dev Environment      " -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

# 1. Check PostgreSQL
Write-Host "[1/3] Checking PostgreSQL connection on port 5432..." -ForegroundColor Yellow
$pgTest = Test-NetConnection -ComputerName 127.0.0.1 -Port 5432 -InformationLevel Quiet
if (-not $pgTest) {
    Write-Host "[WARNING] PostgreSQL is not reachable on localhost:5432!" -ForegroundColor Red
    Write-Host "Please ensure PostgreSQL service is running." -ForegroundColor Red
} else {
    Write-Host "[OK] PostgreSQL is active." -ForegroundColor Green
}

# 2. Clean up any stale processes on ports 3000 and 8000
Write-Host "[2/3] Checking for stale processes on ports 3000 and 8000..." -ForegroundColor Yellow
foreach ($port in @(3000, 8000)) {
    $conn = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($conn) {
        $pids = $conn.OwningProcess | Select-Object -Unique
        foreach ($procId in $pids) {
            if ($procId -gt 0) {
                Write-Host "  Closing stale process ID $procId on port $port..." -ForegroundColor DarkYellow
                Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
            }
        }
    }
}
Write-Host "[OK] Ports 3000 and 8000 are clear." -ForegroundColor Green

# 3. Launch Backend in a separate window
$backendDir = Join-Path $PSScriptRoot "backend"
$pyExe = "C:\Users\seth\AppData\Local\Python\bin\python.exe"
if (-not (Test-Path $pyExe)) { $pyExe = "python" }
Write-Host "[3/3] Starting Backend (FastAPI) on http://localhost:8000 using $pyExe..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "& '$pyExe' run.py" -WorkingDirectory $backendDir

# 4. Launch Frontend in a separate window with increased Node memory limit
$frontendDir = Join-Path $PSScriptRoot "frontend"
$npmCmd = "C:\Program Files\nodejs\npm.cmd"
if (-not (Test-Path $npmCmd)) { $npmCmd = "npm" }
Write-Host "Starting Frontend (Next.js) on http://localhost:3000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "`$env:NODE_OPTIONS='--max-old-space-size=4096'; & '$npmCmd' run dev" -WorkingDirectory $frontendDir

Write-Host ""
Write-Host "=============================================" -ForegroundColor Green
Write-Host " Servers launched in separate windows!" -ForegroundColor Green
Write-Host " Frontend: http://localhost:3000" -ForegroundColor Green
Write-Host " Backend:  http://localhost:8000 (Docs: /docs)" -ForegroundColor Green
Write-Host " To stop all servers, run: .\stop_dev.ps1" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Green
