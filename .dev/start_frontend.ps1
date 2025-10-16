$frontend = 'C:\Users\devan_ktf7aau\Old Files(Computer)\B.Tech-AI-3rd yr\Projects\CaseFlow\Frontend'
Set-Location -LiteralPath $frontend
Write-Host "Starting frontend (npm start) in background from: $frontend"
$proc = Start-Process -FilePath npm -ArgumentList 'start' -WorkingDirectory $frontend -PassThru
Write-Host "Started frontend PID=$($proc.Id)"
Start-Sleep -Seconds 3
try { netstat -ano | Select-String ":4200" | ForEach-Object { Write-Host $_ } } catch {}
