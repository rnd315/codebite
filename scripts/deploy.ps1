# =============================================================================
# CodeBite -- Production Deploy Script
# =============================================================================
# Deploys to 207.154.208.44 via SSH (port 2299).
# Uses Windows built-in bsdtar + scp + OpenSSH (no WSL or rsync required).
#
# FIRST-TIME SETUP:
#   1. Configure SSH key auth (no password prompts):
#      ssh-keygen -t ed25519 -C "deploy"
#      ssh-copy-id -p 2299 claude-agent@207.154.208.44
#   2. Copy .env to the server:
#      scp -P 2299 .env claude-agent@207.154.208.44:/var/www/codebite.crystalmind.ro/app/.env
#   3. Run this script -- venv creation and first start are handled automatically.
#
# WHAT THIS SCRIPT DOES:
#   1. Test SSH connectivity
#   2. Build the React frontend (Vite)
#   3. tar frontend/dist/ and deploy to /var/www/codebite.crystalmind.ro/dist/
#   4. tar backend/       and deploy to /var/www/codebite.crystalmind.ro/app/
#   5. Update Nginx vhost if needed (SPA root + /api/ proxy)
#   6. Remote: venv, pip install, alembic migrate, restart service
# =============================================================================

$REMOTE_USER     = "claude-agent"
$REMOTE_HOST     = "64.226.108.13"
$REMOTE_PORT     = 22
$REMOTE_PATH     = "/var/www/codebite.crystalmind.ro"
$BACKEND_SERVICE = "codebite"
$SSH_KEY         = "$env:USERPROFILE\.ssh\id_ed25519"
$TAR             = "C:\Windows\System32\tar.exe"

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

function Write-Step($msg) { Write-Host "`n[>>] $msg" -ForegroundColor Cyan }
function Write-Ok($msg)   { Write-Host "[OK] $msg"  -ForegroundColor Green }
function Write-Warn($msg) { Write-Host "[!!] $msg"  -ForegroundColor Yellow }
function Write-Fail($msg) { Write-Host "[XX] $msg"  -ForegroundColor Red; exit 1 }

# SSH args array: -p PORT [-i KEY]
function Get-SshArgs {
    $a = @("-p", "$REMOTE_PORT")
    if ($SSH_KEY -and (Test-Path $SSH_KEY)) { $a += @("-i", $SSH_KEY) }
    return $a
}


# Run a command on the remote server over SSH
function Invoke-SSH($cmd) {
    $a = (Get-SshArgs) + @("${REMOTE_USER}@${REMOTE_HOST}", $cmd)
    & ssh @a
}

# Deploy a local directory to a remote path via tar + scp + ssh.
# cleanDest=$true wipes the remote destination before extracting.
# preserve = files inside $remoteDst to back up and restore when cleanDest=$true
#            (e.g. ".env", "codebite.db" -- keeps production data across clean deploys)
function Invoke-Deploy($localDir, $remoteDst, [string[]]$excludes, [bool]$cleanDest, [string[]]$preserve = @()) {
    $stamp      = [System.IO.Path]::GetRandomFileName() -replace '\..*',''
    $tmpArchive = "$env:TEMP\codebite_$stamp.tar.gz"
    $remoteArc  = "/tmp/codebite_$stamp.tar.gz"

    try {
        # 1. Create archive locally
        Write-Host "  archiving $localDir..."
        $tarArgs = @("-czf", $tmpArchive)
        foreach ($ex in $excludes) { $tarArgs += "--exclude=$ex" }
        $tarArgs += @("-C", $localDir, ".")
        & $TAR @tarArgs
        if ($LASTEXITCODE -ne 0) { Write-Fail "tar failed for $localDir" }

        # 2. Upload to /tmp/ on server via ssh stdin redirect (scp SFTP may be blocked)
        Write-Host "  uploading..."
        $sshConn = "ssh -p $REMOTE_PORT"
        if ($SSH_KEY -and (Test-Path $SSH_KEY)) { $sshConn += " -i `"$SSH_KEY`"" }
        cmd /c "$sshConn ${REMOTE_USER}@${REMOTE_HOST} `"cat > $remoteArc`" < `"$tmpArchive`""
        if ($LASTEXITCODE -ne 0) { Write-Fail "File upload failed" }

        # 3. Extract with sudo on server
        Write-Host "  extracting to $remoteDst..."
        if ($cleanDest) {
            if ($preserve.Count -gt 0) {
                # Back up preserved files, wipe dir, extract fresh, restore
                $backups  = ($preserve | ForEach-Object {
                    "[ -f $remoteDst/$_ ] && sudo cp $remoteDst/$_ /tmp/cb_keep_$_ || true"
                }) -join " && "
                $restores = ($preserve | ForEach-Object {
                    "[ -f /tmp/cb_keep_$_ ] && sudo mv /tmp/cb_keep_$_ $remoteDst/$_ || true"
                }) -join " && "
                $extractCmd = "$backups && sudo rm -rf $remoteDst && sudo mkdir -p $remoteDst && sudo tar --warning=no-unknown-keyword -xzf $remoteArc -C $remoteDst && rm $remoteArc && $restores"
            } else {
                $extractCmd = "sudo rm -rf $remoteDst && sudo mkdir -p $remoteDst && sudo tar --warning=no-unknown-keyword -xzf $remoteArc -C $remoteDst && rm $remoteArc"
            }
        } else {
            $extractCmd = "sudo mkdir -p $remoteDst && sudo tar --warning=no-unknown-keyword -xzf $remoteArc -C $remoteDst && rm $remoteArc"
        }
        Invoke-SSH $extractCmd
        if ($LASTEXITCODE -ne 0) { Write-Fail "Remote extract failed for $remoteDst" }
    } finally {
        if (Test-Path $tmpArchive) { Remove-Item $tmpArchive -Force }
    }
}

# ---------------------------------------------------------------------------
# STEP 1 -- SSH connectivity check
# ---------------------------------------------------------------------------
Write-Step "Testing SSH connection to ${REMOTE_HOST}:${REMOTE_PORT}..."
$pingResult = Invoke-SSH "echo __ok__" 2>&1
if ($pingResult -notmatch "__ok__") {
    Write-Fail @"
Cannot reach ${REMOTE_USER}@${REMOTE_HOST} on port $REMOTE_PORT.
Set up key auth:
  ssh-keygen -t ed25519 -C "deploy"
  ssh-copy-id -p $REMOTE_PORT ${REMOTE_USER}@${REMOTE_HOST}
"@
}
Write-Ok "SSH connection successful"

# ---------------------------------------------------------------------------
# STEP 2 -- Build frontend
# ---------------------------------------------------------------------------
Write-Step "Building frontend..."
$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location "$projectRoot\frontend"
& node .\node_modules\vite\bin\vite.js build
if ($LASTEXITCODE -ne 0) { Write-Fail "Frontend build failed. Fix the errors above and re-run." }
Set-Location $projectRoot
Write-Ok "Frontend built -> frontend\dist\"

# ---------------------------------------------------------------------------
# STEP 3 -- Deploy frontend dist -> Nginx document root (clean deploy)
# ---------------------------------------------------------------------------
Write-Step "Deploying frontend..."
Invoke-Deploy "$projectRoot\frontend\dist" "$REMOTE_PATH/dist" @() $true
Write-Ok "Frontend deployed -> $REMOTE_PATH/dist/"

# ---------------------------------------------------------------------------
# STEP 4 -- Deploy backend -> app/ (skip .env, db, venv, caches)
# ---------------------------------------------------------------------------
Write-Step "Deploying backend..."
$backendExcludes = @(".env", "codebite.db", "venv", ".venv", "__pycache__", "*.pyc", "*.pyo", ".pytest_cache")
$backendPreserve = @(".env", "codebite.db")
Invoke-Deploy "$projectRoot\backend" "$REMOTE_PATH/app" $backendExcludes $true $backendPreserve
Write-Ok "Backend deployed -> $REMOTE_PATH/app/"

# ---------------------------------------------------------------------------
# STEP 5 -- Update Nginx vhost (once -- adds SPA root + /api/ proxy)
# ---------------------------------------------------------------------------
Write-Step "Checking Nginx vhost..."
$nginxCheck = Invoke-SSH "sudo grep -q 'location /api/' /etc/nginx/sites-available/codebite.crystalmind.ro && echo UP_TO_DATE || echo NEEDS_UPDATE"

if ($nginxCheck -match "NEEDS_UPDATE") {
    Write-Step "Updating Nginx vhost (SPA + /api/ proxy)..."

    # Single-quoted heredoc -- $host/$uri/$remote_addr are Nginx vars, NOT PowerShell vars
    $nginxConfig = @'
server {
    server_name codebite.crystalmind.ro;

    root /var/www/codebite.crystalmind.ro/dist;
    index index.html;

    access_log /var/log/nginx/codebite.crystalmind.ro.access.log;
    error_log  /var/log/nginx/codebite.crystalmind.ro.error.log;

    location /api/ {
        proxy_pass http://127.0.0.1:8000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }

    listen [::]:443 ssl;
    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/codebite.crystalmind.ro/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/codebite.crystalmind.ro/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}
server {
    if ($host = codebite.crystalmind.ro) {
        return 301 https://$host$request_uri;
    }

    listen 80;
    listen [::]:80;
    server_name codebite.crystalmind.ro;
    return 404;
}
'@

    $encoded  = [System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($nginxConfig))
    $nginxCmd = "echo '$encoded' | base64 -d | sudo tee /etc/nginx/sites-available/codebite.crystalmind.ro > /dev/null && sudo ln -sf /etc/nginx/sites-available/codebite.crystalmind.ro /etc/nginx/sites-enabled/codebite.crystalmind.ro && sudo nginx -t && sudo systemctl reload nginx && echo NGINX_OK"
    $nginxOut = Invoke-SSH $nginxCmd
    Write-Host $nginxOut
    if ($nginxOut -match "NGINX_OK") { Write-Ok "Nginx vhost updated and reloaded" }
    else { Write-Warn "Nginx update may have failed - check manually" }
} else {
    Write-Ok "Nginx vhost already configured"
}

# ---------------------------------------------------------------------------
# STEP 6 -- Remote: fix ownership, venv, pip, alembic, restart service
# ---------------------------------------------------------------------------
Write-Step "Running remote post-deploy steps..."

$remoteCmd = @"
set -e
echo '-- fix ownership'
sudo chown -R www-data:www-data $REMOTE_PATH/dist $REMOTE_PATH/app
sudo chmod -R u+rwX $REMOTE_PATH/dist $REMOTE_PATH/app
cd $REMOTE_PATH/app
echo '-- venv'
if [ ! -d venv ]; then
  sudo -u www-data python3 -m venv venv
  echo '   venv created'
fi
echo '-- pip install'
sudo -u www-data venv/bin/pip install -r requirements.txt -q
echo '-- alembic migrate'
sudo -u www-data venv/bin/alembic upgrade head
echo '-- service'
if sudo systemctl is-active --quiet $BACKEND_SERVICE; then
  sudo systemctl restart $BACKEND_SERVICE
else
  sudo systemctl start $BACKEND_SERVICE
fi
sleep 1
if sudo systemctl is-active --quiet $BACKEND_SERVICE; then
  echo SERVICE_OK
else
  echo SERVICE_FAILED
  sudo journalctl -u $BACKEND_SERVICE -n 20 --no-pager
fi
"@

$remoteOutput = Invoke-SSH $remoteCmd
Write-Host $remoteOutput

if ($remoteOutput -match "SERVICE_FAILED") {
    Write-Warn "Backend service failed to start. Check logs above."
} elseif ($remoteOutput -match "SERVICE_OK") {
    Write-Ok "Backend service is running"
} else {
    Write-Warn "Could not confirm service status - check: ssh -p $REMOTE_PORT ${REMOTE_USER}@${REMOTE_HOST}"
}

# ---------------------------------------------------------------------------
# Done
# ---------------------------------------------------------------------------
Write-Host ""
Write-Ok "Deploy complete -> https://codebite.crystalmind.ro"
Write-Host ""
