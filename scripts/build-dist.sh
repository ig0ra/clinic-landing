#!/usr/bin/env bash
# Збирає dist/ лише з публічних файлів сайту (allowlist).
# Деплоїти тільки dist/: `wrangler pages deploy .` віддавав назовні .dev.vars, CLAUDE.md тощо.
set -euo pipefail
cd "$(dirname "$0")/.."
rm -rf dist && mkdir dist
cp index.html privacy-policy.html consent.html dist/
cp ./*.jpg ./*.png dist/
echo "dist/: $(ls dist | wc -l | tr -d ' ') файлів"
