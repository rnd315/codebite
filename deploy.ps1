# =============================================================================
# CodeBite - Deploy Script  (dev -> prod)
# =============================================================================
# Syncs local dev to production server over SSH + SCP.
# Usage: .\deploy.ps1
#
# FIRST-TIME SETUP:
#   1. Copy .env to the server manually:
#      scp -i ~/.ssh/id_ed25519 backend\.env claude-agent@64.226.108.13:/var/www/codebite.crystalmind.ro/backend/.env
#   2. On the server, create the venv and install deps once:
#      cd /var/www/codebite.crystalmind.ro/backend
#      python3 -m venv .venv
#      .venv/bin/pip install -r requirements.txt
#   3. Set up the systemd service (see README or ask for a template).
#   4. Ensure SSH key auth is configured (no password prompts).
# =============================================================================

$REMOTE_USER = "claude-agent"
$REMOTE_HOST = "64.226.108.13"
$REMOTE_PATH = "/var/www/codebite.crystalmind.ro"
$SSH_KEY     = "$env:USERPROFILE\.ssh\id_ed25519"

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

function Write-Step($msg) { Write-Host "`n[>>] $msg" -ForegroundColor Cyan }
function Write-Ok($msg)   { Write-Host "[OK] $msg"  -ForegroundColor Green }
function Write-Warn($msg) { Write-Host "[!!] $msg"  -ForegroundColor Yellow }
function Write-Fail($msg) { Write-Host "[XX] $msg"  -ForegroundColor Red; exit 1 }

function Get-SSHArgs {
    $p = @("-o", "StrictHostKeyChecking=no")
    if ($SSH_KEY -and (Test-Path $SSH_KEY)) { $p += @("-i", $SSH_KEY) }
    return $p
}

function Invoke-SSH($cmd) {
    & ssh @(Get-SSHArgs) "${REMOTE_USER}@${REMOTE_HOST}" $cmd
}

function Invoke-SCP($src, $dst) {
    & scp @(Get-SSHArgs) -r $src "${REMOTE_USER}@${REMOTE_HOST}:${dst}"
}

# ---------------------------------------------------------------------------
# STEP 1 - SSH connectivity check
# ---------------------------------------------------------------------------
Write-Step "Testing SSH connection to $REMOTE_HOST..."

$pingResult = Invoke-SSH "echo __ok__"
if ($LASTEXITCODE -ne 0 -or $pingResult -notmatch "__ok__") {
    Write-Fail "Cannot reach ${REMOTE_USER}@${REMOTE_HOST} via SSH. Check your key at $SSH_KEY."
}
Write-Ok "SSH connection successful"

# ---------------------------------------------------------------------------
# STEP 2 - Build frontend
# ---------------------------------------------------------------------------
Write-Step "Building frontend..."

$projectRoot = $PSScriptRoot
Set-Location "$projectRoot\frontend"

& node .\node_modules\vite\bin\vite.js build
if ($LASTEXITCODE -ne 0) { Write-Fail "Frontend build failed. Fix the errors above and re-run." }

Set-Location $projectRoot
Write-Ok "Frontend built -> frontend\dist\"

# ---------------------------------------------------------------------------
# STEP 3 - Sync frontend dist to Nginx web root
# ---------------------------------------------------------------------------
Write-Step "Syncing frontend to server..."

# Stage dist locally in a temp folder named after the web root, then SCP that folder.
# This avoids Windows SCP glob issues and lands files exactly at $REMOTE_PATH.
$tmpLocal = "$env:TEMP\codebite_deploy"
if (Test-Path $tmpLocal) { Remove-Item -Recurse -Force $tmpLocal }
New-Item -ItemType Directory -Path "$tmpLocal\webroot" | Out-Null
Copy-Item -Recurse "$projectRoot\frontend\dist\*" "$tmpLocal\webroot\"

Invoke-SCP "$tmpLocal\webroot" "/tmp/codebite_frontend"
if ($LASTEXITCODE -ne 0) { Write-Fail "Frontend SCP failed." }
# /tmp/codebite_frontend/ now contains the dist contents directly (assets/, locales/, index.html)
Invoke-SSH "sudo rm -rf ${REMOTE_PATH}/assets ${REMOTE_PATH}/locales ${REMOTE_PATH}/index.html && sudo cp -a /tmp/codebite_frontend/. $REMOTE_PATH/ && rm -rf /tmp/codebite_frontend"
if ($LASTEXITCODE -ne 0) { Write-Fail "Frontend deploy failed." }
Write-Ok "Frontend synced -> $REMOTE_PATH/"

# ---------------------------------------------------------------------------
# STEP 4 - Sync backend (excluding .venv, db, __pycache__, .env)
# ---------------------------------------------------------------------------
Write-Step "Syncing backend to server (staging clean copy)..."

# Build a local clean copy of backend - each exclusion must be a separate robocopy arg.
$stageBackend = "$tmpLocal\backend"
if (Test-Path $stageBackend) { Remove-Item -Recurse -Force $stageBackend }

# Each /XD and /XF item must be a separate argument (not a joined string)
& robocopy "$projectRoot\backend" $stageBackend /E `
    /XD ".venv" "__pycache__" ".pytest_cache" `
    /XF "*.pyc" "*.pyo" "codebite.db" ".env" `
    /NFL /NDL /NJH /NJS | Out-Null
# Robocopy exits 1 when files were copied (success); 0 = nothing to copy. Both are fine.
if ($LASTEXITCODE -ge 8) { Write-Fail "Local backend staging failed (robocopy exit $LASTEXITCODE)." }

# Clean up any leftover temp from a previous failed deploy
Invoke-SSH "sudo rm -rf /tmp/codebite_backend"

Invoke-SCP $stageBackend "/tmp/codebite_backend"
if ($LASTEXITCODE -ne 0) { Write-Fail "Backend SCP failed." }

Invoke-SSH "sudo mkdir -p ${REMOTE_PATH}/backend && sudo cp -a /tmp/codebite_backend/. ${REMOTE_PATH}/backend/ && sudo rm -rf /tmp/codebite_backend"
if ($LASTEXITCODE -ne 0) { Write-Fail "Backend deploy failed." }

# Clean up local staging
Remove-Item -Recurse -Force $tmpLocal

Write-Ok "Backend synced -> $REMOTE_PATH/backend/"

# ---------------------------------------------------------------------------
# STEP 5 - Remote: install deps + migrate + restart service
# ---------------------------------------------------------------------------
Write-Step "Running remote post-deploy steps..."

$remoteCmd = @'
set -e
cd /var/www/codebite.crystalmind.ro/backend
echo '-- pip install'
.venv/bin/pip install -r requirements.txt -q
echo '-- alembic migrate'
.venv/bin/alembic upgrade head
echo '-- restart service'
sudo systemctl restart codebite
sleep 1
if sudo systemctl is-active --quiet codebite; then
  echo 'SERVICE_OK'
else
  echo 'SERVICE_FAILED'
  sudo journalctl -u codebite -n 20 --no-pager
fi
'@

$remoteOutput = Invoke-SSH $remoteCmd
Write-Host $remoteOutput

if ($remoteOutput -match "SERVICE_FAILED") {
    Write-Warn "Backend service failed to start. Check logs above."
} elseif ($remoteOutput -match "SERVICE_OK") {
    Write-Ok "Backend service is running"
} else {
    Write-Warn "Could not confirm service status - check manually: ssh ${REMOTE_USER}@${REMOTE_HOST}"
}

# ---------------------------------------------------------------------------
# Done
# ---------------------------------------------------------------------------
Write-Host ""
Write-Ok "Deploy complete -> http://$REMOTE_HOST"
Write-Host ""
