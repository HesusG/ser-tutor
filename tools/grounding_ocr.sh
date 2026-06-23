#!/usr/bin/env bash
set -euo pipefail
PDF="/home/d3r/Downloads/676273311-10-Ideas-Clave-Educacion-Emocional.pdf"
ROOT="/mnt/data/repos/ser-tutor/refs/grounding"
mkdir -p "$ROOT/pages" "$ROOT/ocr"
echo "[1/2] render..."
pdftoppm -png -r 200 -gray "$PDF" "$ROOT/pages/p"
echo "[2/2] OCR..."
n=0
for img in "$ROOT/pages"/p-*.png; do
  base=$(basename "$img" .png)
  tesseract "$img" "$ROOT/ocr/$base" -l spa >/dev/null 2>&1 || echo "" > "$ROOT/ocr/$base.txt"
  n=$((n+1))
  [ $((n % 20)) -eq 0 ] && echo "  ocr $n ..."
done
echo "DONE: $n paginas OCR -> $ROOT/ocr"
