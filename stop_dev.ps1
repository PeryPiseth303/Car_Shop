# Aurelia Motors - Safe Dev Server Stopper
# Stops servers running on ports 3000 and 8000 safely without orphaned processes.

Write-Host "Stopping Aurelia Motors dev servers..." -ForegroundColor Cyan

foreach ($port in @(3000, 8000)) {
    $conn = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($conn) {
        $pids = $conn.OwningProcess | Select-Object -Unique
        foreach ($procId in $pids) {
            if ($procId -gt 0) {
                Write-Host "Stopping process $procId on port $port..." -ForegroundColor Yellow
                Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
            }
        }
    } else {
        Write-Host "Port $port is already free." -ForegroundColor Green
    }
}

Write-Host "All servers stopped cleanly." -ForegroundColor Green
