<#
  Build the JSP-2025 catalog used by EspaceScientifiquePage.
  Copies all PDFs from Communication\COMMUNICATION REMEHBS\ into
  frontend\public\programme-jsp-2025\ with URL-safe slug names,
  then emits a JSON manifest at frontend\src\data\programme-jsp-2025.manifest.json
#>

[Console]::OutputEncoding = [Text.UTF8Encoding]::new()
$ErrorActionPreference = 'Stop'
$root        = Resolve-Path "$PSScriptRoot\.."
$srcRoot     = Join-Path $root "Communication\COMMUNICATION REMEHBS"
$dstRoot     = Join-Path $root "frontend\public\programme-jsp-2025"
$manifestOut = Join-Path $root "frontend\src\data\programme-jsp-2025.manifest.json"

New-Item -ItemType Directory -Force -Path $dstRoot | Out-Null
New-Item -ItemType Directory -Force -Path (Split-Path $manifestOut) | Out-Null

function Slugify([string]$s) {
  $t = $s.Normalize([Text.NormalizationForm]::FormD)
  $sb = New-Object Text.StringBuilder
  foreach ($ch in $t.ToCharArray()) {
    $cat = [Globalization.CharUnicodeInfo]::GetUnicodeCategory($ch)
    if ($cat -ne [Globalization.UnicodeCategory]::NonSpacingMark) { [void]$sb.Append($ch) }
  }
  $r = $sb.ToString().ToLowerInvariant()
  $r = $r -replace '[^a-z0-9]+', '-'
  $r = $r.Trim('-')
  if ([string]::IsNullOrEmpty($r)) { $r = 'doc' }
  return $r
}

function ToLongPath([string]$p) {
  if ($p.StartsWith('\\?\')) { return $p }
  if ($p.StartsWith('\\'))   { return '\\?\UNC\' + $p.Substring(2) }
  return '\\?\' + $p
}

function Copy-Pdf([string]$src, [string]$dstSubdir, [string]$slugBase) {
  $dstDir = Join-Path $dstRoot $dstSubdir
  if (-not (Test-Path -LiteralPath $dstDir)) {
    New-Item -ItemType Directory -Force -Path $dstDir | Out-Null
  }
  $slug = Slugify $slugBase
  $dstName = "$slug.pdf"
  $dst = Join-Path $dstDir $dstName
  $srcLong = ToLongPath $src
  $dstLong = ToLongPath $dst
  $size = [IO.FileInfo]::new($srcLong).Length
  [IO.File]::Copy($srcLong, $dstLong, $true)
  return @{
    slug         = $slug
    publicPath   = "/programme-jsp-2025/$dstSubdir/$dstName"
    originalName = [IO.Path]::GetFileName($src)
    sizeBytes    = $size
  }
}

# Build labels from byte sequences to avoid PowerShell source-encoding issues
$utf8 = [Text.Encoding]::UTF8
$editionLabel = "8" + [char]0x00E8 + "mes Journ" + [char]0x00E9 + "es Scientifiques de P" + [char]0x00E9 + "rinatalit" + [char]0x00E9
$abbreviation = "8" + [char]0x00E8 + "mes JSP"
$organizer    = "REMEHBS - R" + [char]0x00E9 + "seau M" + [char]0x00E8 + "re Enfant des Hauts-Bassins"

$catalog = [ordered]@{
  edition      = $editionLabel
  abbreviation = $abbreviation
  year         = 2025
  city         = "Bobo-Dioulasso"
  country      = "Burkina Faso"
  organizer    = $organizer
  conferences  = @()
  panels       = @()
  symposiums   = @()
  rooms        = @()
}

# Conferences / Symposium / Panels
$confSrc = Join-Path $srcRoot ("Conf" + [char]0x00E9 + "rence Symposium panel PDF")
foreach ($f in (Get-ChildItem -LiteralPath $confSrc -File -Filter *.pdf | Sort-Object Name)) {
  $base = [IO.Path]::GetFileNameWithoutExtension($f.Name)
  $copy = Copy-Pdf $f.FullName "conferences" $base
  $kind = "conference"
  if     ($base -match '^(?i)PANEL')    { $kind = "panel" }
  elseif ($base -match '(?i)Symposium') { $kind = "symposium" }
  $entry = [ordered]@{
    kind      = $kind
    code      = $base.Split('_')[0].Trim()
    rawTitle  = $base
    file      = $copy.publicPath
    fileName  = $copy.originalName
    sizeBytes = $copy.sizeBytes
  }
  switch ($kind) {
    "panel"     { $catalog.panels      += $entry }
    "symposium" { $catalog.symposiums  += $entry }
    default     { $catalog.conferences += $entry }
  }
}

# Salles 1, 2, 3 with sessions
$rooms = @(
  @{ name = "Salle 1"; src = "Salle 1 pdf"; slug = "salle-1" },
  @{ name = "Salle 2"; src = "Salle 2 pdf"; slug = "salle-2" },
  @{ name = "Salle 3"; src = "Salle 3 pdf"; slug = "salle-3" }
)

foreach ($room in $rooms) {
  $roomEntry = [ordered]@{
    name     = $room.name
    slug     = $room.slug
    sessions = @()
  }
  $roomDir = Join-Path $srcRoot $room.src
  $sessionDirs = Get-ChildItem -LiteralPath $roomDir -Directory | Sort-Object {
    if ($_.Name -match 'Session\s*(\d+)') { [int]$Matches[1] } else { 999 }
  }
  foreach ($sd in $sessionDirs) {
    $sessionNum = if ($sd.Name -match 'Session\s*(\d+)') { [int]$Matches[1] } else { 0 }
    $sessionEntry = [ordered]@{
      name           = $sd.Name
      number         = $sessionNum
      slug           = (Slugify $sd.Name)
      communications = @()
    }
    foreach ($f in (Get-ChildItem -LiteralPath $sd.FullName -File -Filter *.pdf | Sort-Object Name)) {
      $base = [IO.Path]::GetFileNameWithoutExtension($f.Name)
      $subdir = "$($room.slug)/$($sessionEntry.slug)"
      $copy = Copy-Pdf $f.FullName $subdir $base
      $code = ""
      $cleaned = ($base -replace '\s+', ' ').Trim()
      if ($cleaned -match '^(?<code>C\s*O\s*\d+)\s*[-:]?\s*(?<rest>.*)$') {
        $code = ($Matches.code -replace '\s+', '').ToUpperInvariant()
        $rest = $Matches.rest.Trim()
      } else {
        $rest = $cleaned
      }
      $entry = [ordered]@{
        code      = $code
        rawTitle  = $base
        title     = if ([string]::IsNullOrWhiteSpace($rest)) { $code } else { $rest }
        file      = $copy.publicPath
        fileName  = $copy.originalName
        sizeBytes = $copy.sizeBytes
      }
      $sessionEntry.communications += $entry
    }
    $roomEntry.sessions += $sessionEntry
  }
  $catalog.rooms += $roomEntry
}

$json = $catalog | ConvertTo-Json -Depth 8
[IO.File]::WriteAllText($manifestOut, $json, [Text.UTF8Encoding]::new($false))

Write-Host ("Manifest written to {0}" -f $manifestOut)
Write-Host ("Conferences: {0}  Panels: {1}  Symposiums: {2}" -f $catalog.conferences.Count, $catalog.panels.Count, $catalog.symposiums.Count)
$totalCom = ($catalog.rooms | ForEach-Object { $_.sessions | ForEach-Object { $_.communications.Count } } | Measure-Object -Sum).Sum
Write-Host ("Rooms: {0}  Oral communications: {1}" -f $catalog.rooms.Count, $totalCom)
