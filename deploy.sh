#!/usr/bin/env bash
set -e

npm run build
git add .
MSG="${1:-Deploy update}"
git commit -m "$MSG" || echo "No changes to commit"
git push origin master
