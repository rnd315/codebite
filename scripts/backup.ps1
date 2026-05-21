# Backs up the entire CodeByte project (including the SQLite DB) to a dated zip archive.
# Excludes: node_modules, .venv, __pycache__, *.pyc, and any previous backup zips.
# Usage: .\scripts\backup.ps1 [-OutputDir <path>]
#   OutputDir defaults to the project root.

param(
    [string]$OutputDir = ""
)

$ProjectRoot = Split-Path -Parent $PSScriptRoot
$ProjectName = "Codebyte"
$Timestamp   = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"

if (-not $OutputDir) { $OutputDir = Join-Path $ProjectRoot "archive" }
if (-not (Test-Path $OutputDir)) { New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null }
$Archive = Join-Path $OutputDir "${ProjectName}-${Timestamp}.zip"

Write-Host "Backing up $ProjectRoot -> $Archive"

$ExcludedSegments = @("node_modules", ".venv", "__pycache__", "archive")

$Files = Get-ChildItem -Path $ProjectRoot -Recurse -File | Where-Object {
    $parts = $_.FullName.Substring($ProjectRoot.Length + 1) -split "\\"

    $skip = $false
    foreach ($seg in $ExcludedSegments) {
        if ($parts -contains $seg) { $skip = $true; break }
    }
    if ($_.Extension -in @(".pyc", ".pyo"))        { $skip = $true }
    if ($_.Name -like "${ProjectName}-*.zip")       { $skip = $true }

    -not $skip
}

# Stage filtered files in a temp folder, preserving relative paths
$TempDir = Join-Path $env:TEMP "codebite_backup_$Timestamp"
if (Test-Path $TempDir) { Remove-Item $TempDir -Recurse -Force }
New-Item -ItemType Directory -Path $TempDir -Force | Out-Null

foreach ($file in $Files) {
    $relative  = $file.FullName.Substring($ProjectRoot.Length + 1)
    $destPath  = Join-Path $TempDir $relative
    $destParent = Split-Path $destPath -Parent
    if (-not (Test-Path $destParent)) {
        New-Item -ItemType Directory -Path $destParent -Force | Out-Null
    }
    Copy-Item -Path $file.FullName -Destination $destPath
}

# Remove today's archive if it already exists
if (Test-Path $Archive) { Remove-Item $Archive -Force }

Compress-Archive -Path "$TempDir\*" -DestinationPath $Archive

# Cleanup temp folder
Remove-Item $TempDir -Recurse -Force

$sizeMB = [math]::Round((Get-Item $Archive).Length / 1MB, 2)
Write-Host "Done. Archive: $Archive ($sizeMB MB)"

# ── Update CHANGELOG.md ────────────────────────────────────────────────────
$ChangelogPath = Join-Path $ProjectRoot "CHANGELOG.md"
$DateStamp     = Get-Date -Format "yyyy-MM-dd"
$TimeStamp     = Get-Date -Format "HH:mm"

$NewEntry = @"

## [$DateStamp]
- Backup creat: ``archive/${ProjectName}-${Timestamp}.zip`` ($sizeMB MB) la $TimeStamp

"@

if (-not (Test-Path $ChangelogPath)) {
    $Header = @"
# CHANGELOG -- CodeBite

Toate sesiunile de lucru sunt inregistrate automat la fiecare backup.

"@
    Set-Content -Path $ChangelogPath -Value ($Header + $NewEntry.TrimStart()) -Encoding utf8
    Write-Host "CHANGELOG.md creat la $ChangelogPath"
} else {
    $Existing = Get-Content $ChangelogPath -Raw -Encoding utf8
    if ($Existing -match [regex]::Escape("## [$DateStamp]")) {
        # Entry for today already exists — append a note to it
        $LineToAppend = "- Backup suplimentar: ``archive/${ProjectName}-${Timestamp}.zip`` ($sizeMB MB) la $TimeStamp"
        $Existing = $Existing -replace "(?m)(## \[$DateStamp\][^\n]*)", "`$1`n$LineToAppend"
        Set-Content -Path $ChangelogPath -Value $Existing -Encoding utf8
        Write-Host "CHANGELOG.md actualizat (entry pentru azi deja exista -- linie adaugata)"
    } else {
        # Prepend new entry after the header block (first blank line after title)
        $Lines       = $Existing -split "`n"
        $InsertAt    = 1
        for ($i = 1; $i -lt $Lines.Count; $i++) {
            if ($Lines[$i] -match "^## \[") { $InsertAt = $i; break }
            if ($i -ge 4)                   { $InsertAt = $i; break }
        }
        $Before = ($Lines[0..($InsertAt - 1)] -join "`n")
        $After  = ($Lines[$InsertAt..($Lines.Count - 1)] -join "`n")
        Set-Content -Path $ChangelogPath -Value ($Before + $NewEntry + $After) -Encoding utf8
        Write-Host "CHANGELOG.md actualizat: entry adaugat pentru $DateStamp"
    }
}

# -- Push to dev branch on GitHub ------------------------------------------
Write-Host ""
Write-Host "Pushing to GitHub (dev)..."

$CurrentBranch = git -C $ProjectRoot rev-parse --abbrev-ref HEAD 2>&1
if ($CurrentBranch -ne "dev") {
    Write-Host "WARNING: current branch is '$CurrentBranch', not 'dev'. Switching to dev..."
    git -C $ProjectRoot checkout dev 2>&1 | Out-Null
}

git -C $ProjectRoot add -A 2>&1 | Out-Null
$Status = git -C $ProjectRoot status --porcelain 2>&1
if ($Status) {
    git -C $ProjectRoot commit -m "chore: backup $Timestamp" 2>&1 | Out-Null
    Write-Host "Committed local changes."
} else {
    Write-Host "No local changes to commit."
}

$PushResult = git -C $ProjectRoot push origin dev 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "Pushed to origin/dev successfully."
} else {
    Write-Host "Push failed: $PushResult"
}
