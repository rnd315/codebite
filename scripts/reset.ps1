# CodeBite demo account reset script (Windows PowerShell)
# Usage: .\scripts\reset.ps1
# Resets the 'demo' user to a brand-new state:
#   - Deletes all lesson progress
#   - Restores tokens to 5, streak to 0, XP to 0
#   - Clears last_active and last_token_loss_at timestamps
# Also reminds you to clear localStorage in the browser.

$root   = Split-Path -Parent $PSScriptRoot
$db     = "$root\backend\codebite.db"
$python = "$root\backend\.venv\Scripts\python.exe"

if (-not (Test-Path $db)) {
    Write-Host "[error] Database not found at: $db" -ForegroundColor Red
    exit 1
}
if (-not (Test-Path $python)) {
    Write-Host "[error] Python venv not found at: $python" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "=== CodeBite Demo Reset ===" -ForegroundColor Cyan
Write-Host ""

# Write a temp Python script (avoids PowerShell string-escaping issues)
$tmp = [System.IO.Path]::GetTempFileName() + ".py"
Set-Content -Path $tmp -Encoding utf8 -Value @"
import sqlite3, sys

conn = sqlite3.connect(r"$db")
cur  = conn.cursor()

cur.execute("SELECT id FROM users WHERE username = 'demo'")
row = cur.fetchone()
if not row:
    print("[error] demo user not found in database.")
    sys.exit(1)

user_id = row[0]

cur.execute("DELETE FROM user_progress WHERE user_id = ?", (user_id,))
deleted = cur.rowcount

cur.execute(
    "UPDATE users SET lives=5, streak=0, xp=0, last_active=NULL, last_token_loss_at=NULL WHERE id=?",
    (user_id,)
)

conn.commit()
conn.close()

print(f"[ok] Deleted {deleted} progress record(s) for demo (id={user_id}).")
print("[ok] Tokens=5  XP=0  Streak=0  Timestamps cleared.")
"@

$result = & $python $tmp 2>&1
Remove-Item $tmp -Force

foreach ($line in $result) {
    if ("$line" -like "*error*") {
        Write-Host $line -ForegroundColor Red
    } else {
        Write-Host $line -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "  Browser step: open DevTools (F12) > Console and run:" -ForegroundColor Yellow
Write-Host "  localStorage.clear()  then refresh"                    -ForegroundColor White
Write-Host ""
Write-Host "The demo account is now a clean slate." -ForegroundColor Cyan
Write-Host ""
