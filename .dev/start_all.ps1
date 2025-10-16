$root = 'C:\Users\devan_ktf7aau\Old Files(Computer)\B.Tech-AI-3rd yr\Projects\CaseFlow'
$backend = Join-Path $root 'Backend'
$frontend = Join-Path $root 'Frontend'

Write-Host "Starting backend from $backend"
$pb = Start-Process -FilePath node -ArgumentList 'server.js' -WorkingDirectory $backend -PassThru
Write-Host "Backend PID=$($pb.Id)"

Start-Sleep -Seconds 2

Write-Host "Starting frontend from $frontend"
$pf = Start-Process -FilePath npm -ArgumentList 'start' -WorkingDirectory $frontend -PassThru
Write-Host "Frontend PID=$($pf.Id)"

Start-Sleep -Seconds 3

Write-Host 'Done. Use Task Manager to view processes or use Get-Process -Id <PID> to inspect.'
