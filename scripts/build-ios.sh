#!/bin/sh
set -eu

repo_root=$(cd "$(dirname "$0")/.." && pwd)
ios_dir="$repo_root/ios"
build_dir="$repo_root/build"
derived_data_dir="$ios_dir/build/derivedData"
product_dir="$derived_data_dir/Build/Products/Release-iphonesimulator"
scheme="MyApp"

if [ "$(uname -s)" != "Darwin" ]; then
  echo "iOS builds require macOS and Xcode. Run this script on a Mac." >&2
  exit 1
fi

if ! command -v xcodebuild >/dev/null 2>&1; then
  echo "xcodebuild was not found. Install Xcode command line tools first." >&2
  exit 1
fi

mkdir -p "$build_dir"

workspace_path=$(find "$ios_dir" -maxdepth 1 -name '*.xcworkspace' | head -n 1 || true)
project_path=$(find "$ios_dir" -maxdepth 1 -name '*.xcodeproj' | head -n 1 || true)

if [ -n "$workspace_path" ]; then
  xcodebuild \
    -workspace "$workspace_path" \
    -scheme "$scheme" \
    -configuration Release \
    -sdk iphonesimulator \
    -derivedDataPath "$derived_data_dir" \
    build
elif [ -n "$project_path" ]; then
  xcodebuild \
    -project "$project_path" \
    -scheme "$scheme" \
    -configuration Release \
    -sdk iphonesimulator \
    -derivedDataPath "$derived_data_dir" \
    build
else
  echo "Could not find an Xcode project or workspace in $ios_dir" >&2
  exit 1
fi

app_path=$(find "$product_dir" -maxdepth 1 -name '*.app' | head -n 1 || true)
if [ -z "$app_path" ]; then
  echo "No .app bundle was found in $product_dir" >&2
  exit 1
fi

timestamp=$(date +%Y%m%d-%H%M%S)
app_name=$(basename "$app_path" .app)
latest_target="$build_dir/${app_name}-simulator-latest.app"
archive_target="$build_dir/${app_name}-simulator-${timestamp}.app"

rm -rf "$latest_target" "$archive_target"
cp -R "$app_path" "$latest_target"
cp -R "$app_path" "$archive_target"

echo "iOS app bundle copied to $build_dir"
