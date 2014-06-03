#!/usr/bin/env bash
# scripts/deploy-pages.sh — publishes web/ to the gh-pages branch.
#
# Workflow:
#   1. Ensure the working tree is clean on master.
#   2. Build the live dataset (best-effort; falls back to sample on failure).
#   3. Copy web/ into a worktree on a temporary branch.
#   4. Force-push it to origin/gh-pages.
set -euo pipefail

REPO_ROOT=$(git rev-parse --show-toplevel)
cd "$REPO_ROOT"

if [ -n "$(git status --porcelain)" ]; then
  echo "deploy-pages: working tree is dirty; commit or stash first" >&2
  exit 1
fi

echo "deploy-pages: building live dataset (continuing on failure)"
node scripts/build-headlines-dataset.js || true

DEPLOY_DIR=$(mktemp -d -t geo-news-pages.XXXXXX)
trap 'rm -rf "$DEPLOY_DIR"' EXIT

cp -R web/* "$DEPLOY_DIR/"
touch "$DEPLOY_DIR/.nojekyll"

cd "$DEPLOY_DIR"
git init -q
git checkout -q -b gh-pages
git add .
git -c user.name='geo-news deploy' -c user.email='deploy@example.invalid' \
    commit -q -m 'deploy: publish geo-news UI'
git remote add origin "$(cd "$REPO_ROOT" && git remote get-url origin)"
git push -f -q origin gh-pages

echo "deploy-pages: pushed gh-pages"
