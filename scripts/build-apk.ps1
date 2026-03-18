param(
  [switch]$SkipGradle
)

$repoRoot = Split-Path -Parent $PSScriptRoot
$androidDir = Join-Path $repoRoot 'android'
$gradleWrapper = Join-Path $androidDir 'gradlew.bat'
$apkOutputDir = Join-Path $androidDir 'app\build\outputs\apk\release'
$buildDir = Join-Path $repoRoot 'apks'

if (-not (Test-Path $gradleWrapper)) {
  throw "Could not find Gradle wrapper at $gradleWrapper"
}

if (-not (Test-Path $buildDir)) {
  New-Item -ItemType Directory -Path $buildDir | Out-Null
}

if (-not $SkipGradle) {
  Push-Location $androidDir
  try {
    & $gradleWrapper assembleRelease
    if ($LASTEXITCODE -ne 0) {
      throw "Gradle assembleRelease failed with exit code $LASTEXITCODE"
    }
  }
  finally {
    Pop-Location
  }
}

if (-not (Test-Path $apkOutputDir)) {
  throw "APK output folder not found at $apkOutputDir"
}

$apkFiles = Get-ChildItem -Path $apkOutputDir -Filter *.apk -File
if (-not $apkFiles) {
  throw "No APK files were found in $apkOutputDir"
}

$timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
foreach ($apk in $apkFiles) {
  $baseName = [System.IO.Path]::GetFileNameWithoutExtension($apk.Name)
  $latestTarget = Join-Path $buildDir "$baseName-latest.apk"
  $archiveTarget = Join-Path $buildDir "$baseName-$timestamp.apk"

  Copy-Item -Path $apk.FullName -Destination $latestTarget -Force
  Copy-Item -Path $apk.FullName -Destination $archiveTarget -Force
}

Write-Host "APK build copied to $buildDir"
