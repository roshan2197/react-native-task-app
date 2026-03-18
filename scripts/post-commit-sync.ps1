param()

$repoRoot = Split-Path -Parent $PSScriptRoot

Push-Location $repoRoot
try {
  & powershell -ExecutionPolicy Bypass -File (Join-Path $repoRoot 'scripts\build-apk.ps1')
  if ($LASTEXITCODE -ne 0) {
    throw "Post-commit APK build failed."
  }

  git rev-parse --abbrev-ref --symbolic-full-name "@{u}" *> $null
  if ($LASTEXITCODE -eq 0) {
    git push
    if ($LASTEXITCODE -ne 0) {
      throw "Automatic git push failed."
    }
    Write-Host "Commit built and pushed successfully."
  } else {
    Write-Host "Build completed, but no upstream branch is configured. Skipping automatic push."
  }
}
finally {
  Pop-Location
}
