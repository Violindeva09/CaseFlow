$base='http://localhost:4000'
$ts = [int](Get-Date -UFormat %s)
$agentUsername = "agent$ts"
$agent = @{ username = $agentUsername; name = 'Test Agent'; password = 'pass123'; role = 'agent'; skills = 'traffic, sanitation' }
Write-Host "Registering user $agentUsername"
try {
  $reg = Invoke-RestMethod -Uri ($base + '/api/auth/register') -Method Post -ContentType 'application/json' -Body (ConvertTo-Json $agent)
  Write-Host "REGISTER_OK: " (ConvertTo-Json $reg -Compress)
} catch {
  Write-Host "REGISTER_FAILED: " $_.Exception.Message
  if ($_.Exception.Response) { $_.Exception.Response | ConvertTo-Json -Compress | Write-Host }
  exit 1
}

# Login
$creds = @{ username = $agentUsername; password = 'pass123' }
try {
  $login = Invoke-RestMethod -Uri ($base + '/api/auth/login') -Method Post -ContentType 'application/json' -Body (ConvertTo-Json $creds)
  Write-Host "LOGIN_OK: " (ConvertTo-Json $login -Compress)
} catch {
  Write-Host "LOGIN_FAILED: " $_.Exception.Message
  if ($_.Exception.Response) { $_.Exception.Response | ConvertTo-Json -Compress | Write-Host }
  exit 1
}

$token = $login.token

# Create case
$case = @{ title = 'Test case from agent'; description = 'Created during smoke test'; location = 'Testville' }
try {
  $hdr = @{ Authorization = "Bearer $token" }
  $created = Invoke-RestMethod -Uri ($base + '/api/cases') -Method Post -ContentType 'application/json' -Body (ConvertTo-Json $case) -Headers $hdr
  Write-Host "CREATE_OK: " (ConvertTo-Json $created -Compress)
} catch {
  Write-Host "CREATE_FAILED: " $_.Exception.Message
  if ($_.Exception.Response) { $_.Exception.Response | ConvertTo-Json -Compress | Write-Host }
  exit 1
}

Write-Host 'SMOKE TESTS COMPLETED'
