#!/bin/sh
set -eu

repo_root=$(cd "$(dirname "$0")/.." && pwd)
os_name=$(uname -s)

case "$os_name" in
  Darwin)
    sh "$repo_root/scripts/build-apk.sh"
    sh "$repo_root/scripts/build-ios.sh"
    ;;
  MINGW*|MSYS*|CYGWIN*)
    powershell.exe -ExecutionPolicy Bypass -File "$repo_root/scripts/post-commit-sync.ps1"
    exit $?
    ;;
  *)
    sh "$repo_root/scripts/build-apk.sh"
    ;;
esac

if git rev-parse --abbrev-ref --symbolic-full-name "@{u}" >/dev/null 2>&1; then
  git push
  echo "Commit built and pushed successfully."
else
  echo "Build completed, but no upstream branch is configured. Skipping automatic push."
fi
