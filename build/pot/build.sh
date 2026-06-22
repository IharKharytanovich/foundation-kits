#!/usr/bin/env bash
# Build the POT pyodide wheel from the pinned sdist and copy it to /out.
# Run via the Dockerfile in this directory (see README.md).
set -euo pipefail

POT_VERSION="${POT_VERSION:-0.9.6.post1}"
OUT="${OUT:-/out}"

source /opt/emsdk/emsdk_env.sh >/dev/null 2>&1
emcc --version | head -1

WORK=/tmp/potsrc
mkdir -p "$WORK" && cd "$WORK"

# Fetch the exact sdist from PyPI.
URL=$(python3 - "$POT_VERSION" <<'PY'
import json, sys, urllib.request
ver = sys.argv[1]
d = json.load(urllib.request.urlopen(f"https://pypi.org/pypi/POT/{ver}/json"))
print(next(u["url"] for u in d["urls"] if u["filename"].endswith(".tar.gz")))
PY
)
echo "sdist: $URL"
curl -sL "$URL" -o pot.tar.gz
tar xzf pot.tar.gz
cd "pot-${POT_VERSION}"

# Cross-compile to a pyodide emscripten wheel (OpenMP auto-disabled by POT).
pyodide build

mkdir -p "$OUT"
cp dist/pot-*-pyemscripten_*_wasm32.whl "$OUT"/
echo "built:"; ls -la "$OUT"/pot-*.whl
sha256sum "$OUT"/pot-*.whl
