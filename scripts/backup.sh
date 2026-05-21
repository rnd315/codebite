#!/usr/bin/env bash
# Backs up the entire CodeByte project (including the SQLite DB) to a dated zip archive.
# Excludes: node_modules, .venv, __pycache__, *.pyc, and any previous backup zips.
# Usage: bash scripts/backup.sh [output_dir]
#   output_dir defaults to the project root.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
PROJECT_NAME="Codebite"

TIMESTAMP="$(date +%Y-%m-%d_%H-%M-%S)"
OUTPUT_DIR="${1:-$PROJECT_ROOT/archive}"
mkdir -p "$OUTPUT_DIR"
ARCHIVE="$OUTPUT_DIR/${PROJECT_NAME}-${TIMESTAMP}.zip"

echo "Backing up $PROJECT_ROOT → $ARCHIVE"

cd "$PROJECT_ROOT"

zip -r "$ARCHIVE" . \
  --exclude "*/node_modules/*" \
  --exclude "*/.venv/*" \
  --exclude "*/__pycache__/*" \
  --exclude "*.pyc" \
  --exclude "*.pyo" \
  --exclude "${PROJECT_NAME}-*.zip" \
  --exclude "./archive/*"

SIZE=$(du -sh "$ARCHIVE" | cut -f1)
echo "Done. Archive: $ARCHIVE ($SIZE)"
