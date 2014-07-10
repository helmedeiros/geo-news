#!/usr/bin/env bash
# scripts/verify-live.sh — checks the deployed Pages URL actually renders
# headlines, so a broken JS bundle doesn't sit live unnoticed.
#
# Uses headless Chrome / Chromium when available (executes the JS). Falls
# back to a static curl + grep for index.html structure so the script still
# fails loudly even on machines without a browser.
set -euo pipefail

URL="${1:-https://helmedeiros.github.io/geo-news/}"
MAX_TRIES=18
SLEEP_S=7

find_chrome() {
  if [ "${CHROME_BIN:-}" != "" ] && [ -x "${CHROME_BIN}" ]; then
    echo "${CHROME_BIN}"
    return
  fi
  local candidates=(
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
    "/Applications/Chromium.app/Contents/MacOS/Chromium"
    "$(command -v google-chrome 2>/dev/null || true)"
    "$(command -v chromium 2>/dev/null || true)"
    "$(command -v chromium-browser 2>/dev/null || true)"
  )
  for c in "${candidates[@]}"; do
    if [ -n "$c" ] && [ -x "$c" ]; then echo "$c"; return; fi
  done
}

check_with_chrome() {
  local chrome="$1"
  local html
  html=$("$chrome" --headless --disable-gpu --no-sandbox \
                   --virtual-time-budget=12000 --dump-dom "$URL" 2>/dev/null)
  if echo "$html" | grep -q 'class="headline"'; then
    echo "verify-live: chrome rendered headlines at $URL"
    return 0
  fi
  return 1
}

check_with_curl() {
  local html
  html=$(curl -sL --max-time 10 "$URL")
  if echo "$html" | grep -q 'id="map"' && echo "$html" | grep -q 'js/app.js'; then
    echo "verify-live: static structure present at $URL (no JS run)"
    return 0
  fi
  return 1
}

chrome=$(find_chrome || true)

for attempt in $(seq 1 "$MAX_TRIES"); do
  if [ -n "$chrome" ]; then
    if check_with_chrome "$chrome"; then exit 0; fi
  else
    if check_with_curl; then exit 0; fi
  fi
  echo "verify-live: attempt $attempt/$MAX_TRIES — retrying in ${SLEEP_S}s"
  sleep "$SLEEP_S"
done

echo "verify-live: $URL never rendered headlines" >&2
exit 1
