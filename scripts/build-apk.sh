#!/bin/sh
set -eu

repo_root=$(cd "$(dirname "$0")/.." && pwd)
android_dir="$repo_root/android"
apk_output_dir="$android_dir/app/build/outputs/apk/release"
build_dir="$repo_root/build"

mkdir -p "$build_dir"

(
  cd "$android_dir"
  ./gradlew assembleRelease
)

if [ ! -d "$apk_output_dir" ]; then
  echo "APK output folder not found at $apk_output_dir" >&2
  exit 1
fi

found_apk=0
timestamp=$(date +%Y%m%d-%H%M%S)
for apk in "$apk_output_dir"/*.apk; do
  if [ ! -f "$apk" ]; then
    continue
  fi

  found_apk=1
  filename=$(basename "$apk")
  base_name=${filename%.apk}
  cp "$apk" "$build_dir/${base_name}-latest.apk"
  cp "$apk" "$build_dir/${base_name}-${timestamp}.apk"
done

if [ "$found_apk" -eq 0 ]; then
  echo "No APK files were found in $apk_output_dir" >&2
  exit 1
fi

echo "APK build copied to $build_dir"
