#!/bin/zsh
set -euo pipefail

cd "${0:A:h}"
PORT=8080
while lsof -nP -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; do
  (( PORT += 1 ))
done

URL="http://localhost:$PORT"
echo "ONScreen website: $URL"
echo "Press Control-C to stop."
open "$URL"
python3 -m http.server "$PORT" --bind 127.0.0.1
