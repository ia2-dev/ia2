#!/bin/bash
set -euo pipefail

DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$DIR/../../.." && pwd)"
EXT_DIR="$ROOT/packages/browser-extension/dist-e2e/safari"
APP="$DIR/.build/IA2NavigatorExtTest.app"
BIN="$APP/Contents/MacOS/host"
PORT="${IA2_AE2E_PORT:-4187}"
TIMEOUT="${IA2_AE2E_TIMEOUT:-60}"

mkdir -p "$APP/Contents/MacOS"
if [ ! -f "$APP/Contents/Info.plist" ]; then
  cp "$DIR/Info.plist" "$APP/Contents/Info.plist"
fi
if [ ! -x "$BIN" ] || [ "$DIR/host.swift" -nt "$BIN" ]; then
  swiftc -swift-version 5 -O -target "$(uname -m)-apple-macos15.4" \
    -o "$BIN" "$DIR/host.swift" -framework WebKit -framework AppKit
  codesign --force --sign - "$APP" >/dev/null 2>&1 || true
fi

node "$ROOT/tests/ae2e/server.mjs" >"$DIR/.build/server.log" 2>&1 &
SERVER_PID=$!
trap 'kill "$SERVER_PID" >/dev/null 2>&1 || true' EXIT
until curl -fsS "http://127.0.0.1:$PORT/health" >/dev/null 2>&1; do sleep 0.2; done

"$BIN" "$EXT_DIR" "http://127.0.0.1:$PORT/contract?autorun" "$TIMEOUT"
echo "[safari-extension] 14 passed"
