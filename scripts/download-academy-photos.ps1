$ErrorActionPreference = 'Continue'

$root = Split-Path -Parent $PSScriptRoot
$sourceFile = Join-Path $root 'src\pages\Interactive2D\academyPhotos.ts'
$outputDir = Join-Path $root 'public\academy-photos'

New-Item -ItemType Directory -Force -Path $outputDir | Out-Null

$source = [System.IO.File]::ReadAllText($sourceFile)
$matches = [regex]::Matches($source, "photo\('([^']+)'")
$files = $matches | ForEach-Object { $_.Groups[1].Value } | Sort-Object -Unique

$downloaded = 0
$skipped = 0

foreach ($file in $files) {
  $safeName = [regex]::Replace($file, '[<>:"/\\|?*]', '_')
  $target = Join-Path $outputDir $safeName

  if (Test-Path -LiteralPath $target) {
    $skipped++
    continue
  }

  $encodedName = [uri]::EscapeDataString($file)
  $proxyUrl = "https://images.weserv.nl/?url=commons.wikimedia.org/wiki/Special:FilePath/$encodedName&w=1600&q=85"
  $temporary = "$target.download"

  curl.exe -L --fail --silent --show-error --max-time 45 -A 'Mozilla/5.0' -o $temporary $proxyUrl 2>$null
  $valid = $LASTEXITCODE -eq 0 -and (Test-Path -LiteralPath $temporary)

  if ($valid) {
    $bytes = [System.IO.File]::ReadAllBytes($temporary)
    $isJpeg = $bytes.Length -ge 3 -and $bytes[0] -eq 0xFF -and $bytes[1] -eq 0xD8 -and $bytes[2] -eq 0xFF
    $isPng = $bytes.Length -ge 8 -and $bytes[0] -eq 0x89 -and $bytes[1] -eq 0x50 -and $bytes[2] -eq 0x4E -and $bytes[3] -eq 0x47
    $isWebp = $bytes.Length -ge 12 -and [System.Text.Encoding]::ASCII.GetString($bytes, 0, 4) -eq 'RIFF' -and [System.Text.Encoding]::ASCII.GetString($bytes, 8, 4) -eq 'WEBP'
    $valid = $isJpeg -or $isPng -or $isWebp
  }

  if ($valid) {
    Move-Item -LiteralPath $temporary -Destination $target -Force
    $downloaded++
    Write-Output "OK   $file"
  } else {
    Remove-Item -LiteralPath $temporary -Force -ErrorAction SilentlyContinue
    Write-Output "MISS $file"
  }
}

$primaryPhotos = @{
  'yuelu-verified-main.jpg' = 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Lecture_Hall_of_Yuelu_Academy_20251018.jpg/1920px-Lecture_Hall_of_Yuelu_Academy_20251018.jpg'
  'bailudong-verified-main.jpg' = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/White_Deer_Grotto_Academy_in_Jiujiang%2C_Jiangxi_province.jpg/1920px-White_Deer_Grotto_Academy_in_Jiujiang%2C_Jiangxi_province.jpg'
  'songyang-verified-main.jpg' = 'https://upload.wikimedia.org/wikipedia/commons/a/a3/20250531_Songyang_Academy_02.jpg'
  'shigu-verified-main.jpg' = 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Shigu_Academy59.jpg/1920px-Shigu_Academy59.jpg'
}

foreach ($entry in $primaryPhotos.GetEnumerator()) {
  $target = Join-Path $outputDir $entry.Key
  if (Test-Path -LiteralPath $target) {
    continue
  }

  $proxyUrl = "https://images.weserv.nl/?url=$($entry.Value)&w=1600&q=85"
  $temporary = "$target.download"
  curl.exe -L --fail --silent --show-error --max-time 45 -A 'Mozilla/5.0' -o $temporary $proxyUrl 2>$null
  if ($LASTEXITCODE -eq 0 -and (Test-Path -LiteralPath $temporary)) {
    Move-Item -LiteralPath $temporary -Destination $target -Force
    $downloaded++
    Write-Output "OK   $($entry.Key)"
  } else {
    Remove-Item -LiteralPath $temporary -Force -ErrorAction SilentlyContinue
    Write-Output "MISS $($entry.Key)"
  }
}

"DOWNLOADED=$downloaded SKIPPED=$skipped TOTAL=$($files.Count + $primaryPhotos.Count)"
