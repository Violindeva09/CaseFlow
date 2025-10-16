$backend = 'C:\Users\devan_ktf7aau\Old Files(Computer)\B.Tech-AI-3rd yr\Projects\CaseFlow\Backend'
Set-Location -LiteralPath $backend
Write-Host "Starting backend (node server.js) in background from: $backend"
$proc = Start-Process -FilePath node -ArgumentList 'server.js' -WorkingDirectory $backend -PassThru
Write-Host "Started backend PID=$($proc.Id)"
# Wait a bit for server to initialize
Start-Sleep -Seconds 2
# Print netstat line for port 4000 if present
try { netstat -ano | Select-String ":4000" | ForEach-Object { Write-Host $_ } } catch {}
