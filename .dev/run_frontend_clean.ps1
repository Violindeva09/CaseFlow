$frontend = 'C:\Users\devan_ktf7aau\Old Files(Computer)\B.Tech-AI-3rd yr\Projects\CaseFlow\Frontend'
Write-Host "Cleaning Angular cache and starting frontend from: $frontend"
if (Test-Path -LiteralPath $frontend) {
  $cache = Join-Path $frontend '.angular'
  if (Test-Path -LiteralPath $cache) {
    Write-Host "Removing cache: $cache"
    Remove-Item -LiteralPath $cache -Recurse -Force -ErrorAction Stop
    Write-Host "Removed .angular cache"
  } else {
    Write-Host ".angular cache not found"
  }
  Set-Location -LiteralPath $frontend
  Write-Host "Running npm start (this will block until you stop the server). Output below:"
  npm start
} else {
  Write-Error "Frontend path not found: $frontend"
}
