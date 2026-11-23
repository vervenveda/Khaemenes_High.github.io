#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
cd "$ROOT"
CHROME=""
for c in google-chrome-stable google-chrome chromium chromium-browser; do
  if command -v "$c" >/dev/null 2>&1; then CHROME="$c"; break; fi
done
if [ -z "$CHROME" ]; then
  echo "HOLD: no Chrome/Chromium executable available on runner" >&2
  exit 1
fi
python3 -m http.server 8765 --bind 127.0.0.1 >/tmp/khae-science-http.log 2>&1 &
SERVER_PID=$!
trap 'kill "$SERVER_PID" 2>/dev/null || true' EXIT
sleep 2
routes=(
"courses/science/integrated-science-9/units/unit-02/lessons/day-01.html"
"courses/science/biology-10/weeks/week-04/lessons/day-02.html"
"courses/science/chemistry-11/weeks/week-14/lessons/day-03.html"
"courses/science/physics-engineering-12/weeks/week-30/lessons/day-04.html"
)
sizes=("1440,1000" "1024,768" "768,1024" "255,900")
for route in "${routes[@]}"; do
  for size in "${sizes[@]}"; do
    out="/tmp/science-$(echo "$route-$size" | tr '/,' '--').html"
    "$CHROME" --headless --disable-gpu --no-sandbox --hide-scrollbars --window-size="$size" --virtual-time-budget=2500 --dump-dom "http://127.0.0.1:8765/$route" >"$out"
    test -s "$out"
    grep -qi "<html" "$out"
  done
done
"$CHROME" --headless --disable-gpu --no-sandbox --virtual-time-budget=2500 --print-to-pdf=/tmp/khae-science-print.pdf "http://127.0.0.1:8765/courses/science/physics-engineering-12/weeks/week-30/lessons/day-04.html" >/tmp/khae-science-print.log 2>&1
test -s /tmp/khae-science-print.pdf
echo "Science Chrome smoke matrix: PASS (4 routes × 4 viewports + print smoke)"
