#!/usr/bin/env bash
set -e

rm -rf dist
git add .
MSG="${1:-Deploy update}"
git commit -m "$MSG" || echo "No changes to commit"
git push origin master

