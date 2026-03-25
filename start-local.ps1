# start-local.ps1
# Usage: .\start-local.ps1

$backendPort = 5000
$frontendPort = 5173

Write-Host "=== JalSetu local dev startup script ==="

function Get-FreePort([int]$startPort, [int]$maxPort) {
    for ($port = $startPort; $port -le $maxPort; $port++) {
        $test = Test-NetConnection -ComputerName 'localhost' -Port $port -WarningAction SilentlyContinue
        if (-not $test.TcpTestSucceeded) { return $port }
    }
    throw "No available ports found between $startPort and $maxPort"
}

$backendPort = Get-FreePort -startPort 5000 -maxPort 5100
$backendUrl = "http://localhost:$backendPort"

Write-Host "Selected backend port: $backendPort"

# kill any existing process on chosen backend port
$existing = Get-NetTCPConnection -LocalPort $backendPort -State Listen -ErrorAction SilentlyContinue
if ($existing) {
    $processIds = $existing | Select-Object -ExpandProperty OwningProcess -Unique
    foreach ($processId in $processIds) {
        Write-Host "Killing process $processId on port $backendPort..."
        Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
    }
    Start-Sleep -Seconds 1
}

# set env for frontend
Set-Content -Path ".\frontend\.env.local" -Value "VITE_API_URL=$backendUrl"

# start backend
Write-Host "Starting backend on port $backendPort..."
Push-Location .\backend
Start-Process -NoNewWindow -FilePath powershell -ArgumentList '-NoExit', '-Command', "$env:PORT=$backendPort; npm run dev"
Pop-Location

# start frontend
Write-Host "Starting frontend on port $frontendPort..."
Push-Location .\frontend
Start-Process -NoNewWindow -FilePath powershell -ArgumentList '-NoExit', '-Command', 'npm run dev'
Pop-Location

Write-Host "All startup commands issued. Backend at $backendUrl, frontend at http://localhost:$frontendPort"