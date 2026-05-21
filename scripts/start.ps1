# CodeBite dev startup script (Windows PowerShell)
# Usage: .\scripts\start.ps1
# Opens two terminal windows: one for the backend, one for the frontend.

$root = Split-Path -Parent $PSScriptRoot
$backend = "$root\backend"
$frontend = "$root\frontend"

Write-Host "=== CodeBite Dev Server ===" -ForegroundColor Cyan

# Backend — open a new PowerShell window running uvicorn
Write-Host "[backend]  Starting FastAPI on http://localhost:8000" -ForegroundColor Green
Start-Process "powershell.exe" `
    -ArgumentList "-NoExit", "-Command", "cd '$backend'; .\.venv\Scripts\uvicorn.exe main:app --reload --port 8000"

# Frontend — open a new PowerShell window running Vite directly (npm is blocked)
Write-Host "[frontend] Starting Vite on http://localhost:5173" -ForegroundColor Green
Start-Process "powershell.exe" `
    -ArgumentList "-NoExit", "-Command", "cd '$frontend'; node .\node_modules\vite\bin\vite.js"

Write-Host ""
Write-Host "  Backend:  http://localhost:8000" -ForegroundColor Yellow
Write-Host "  Frontend: http://localhost:5173" -ForegroundColor Yellow
Write-Host "  API docs: http://localhost:8000/docs" -ForegroundColor Yellow
Write-Host ""
Write-Host "Two terminal windows have opened. Close them to stop the servers." -ForegroundColor Gray
