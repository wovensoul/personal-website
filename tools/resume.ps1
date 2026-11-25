<#
  Moves the resume between Overleaf and this repo, and builds it locally.

    tools/resume.ps1 pull <zip or folder>   replace resume/ with an Overleaf "Download > Source" zip (or an unzipped folder)
    tools/resume.ps1 export [name]          zip resume/ for Overleaf's "New Project > Upload Project"
                                            (default name: jeffrey-chen-resume-MM-YY, saved to Downloads)
    tools/resume.ps1 build                  compile resume/main.tex to site/resume.pdf with Tectonic

  Deploys build the PDF themselves, so build is only for previewing locally.
#>
param(
  [Parameter(Mandatory)][ValidateSet('pull', 'export', 'build')][string]$Command,
  [string]$Arg
)
$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$resume = Join-Path $root 'resume'

switch ($Command) {
  'pull' {
    if (-not $Arg) { throw 'Give the path to the Overleaf zip or folder.' }
    $src = Resolve-Path $Arg
    $tmp = $null
    if ((Get-Item $src).Extension -eq '.zip') {
      $tmp = Join-Path ([IO.Path]::GetTempPath()) ([guid]::NewGuid())
      Expand-Archive $src $tmp
      $src = $tmp
    }
    # Overleaf zips sometimes wrap everything in one folder; use what's inside it.
    $items = Get-ChildItem $src -Force
    if ($items.Count -eq 1 -and $items[0].PSIsContainer) { $src = $items[0].FullName }
    if (-not (Test-Path (Join-Path $src 'main.tex'))) { throw "No main.tex in $src." }
    if (Test-Path $resume) { Get-ChildItem $resume -Force | Remove-Item -Recurse -Force }
    else { New-Item -ItemType Directory $resume | Out-Null }
    Copy-Item (Join-Path $src '*') $resume -Recurse -Force
    if ($tmp) { Remove-Item $tmp -Recurse -Force }
    Write-Host "resume/ now matches $Arg. Review with 'git diff', then commit and push."
  }
  'export' {
    $name = if ($Arg) { $Arg } else { 'jeffrey-chen-resume-' + (Get-Date -Format 'MM-yy') }
    $zip = Join-Path ([Environment]::GetFolderPath('UserProfile')) "Downloads\$name.zip"
    Get-ChildItem $resume -Force | Where-Object { $_.Extension -notin '.pdf', '.aux', '.log', '.out', '.fls', '.fdb_latexmk', '.synctex' } |
      Compress-Archive -DestinationPath $zip -Force
    Write-Host "Saved $zip. In Overleaf: New Project > Upload Project, then pick it."
  }
  'build' {
    $tectonic = (Get-Command tectonic -ErrorAction SilentlyContinue).Source
    if (-not $tectonic) { $tectonic = Join-Path ([IO.Path]::GetTempPath()) 'tectonic\tectonic.exe' }
    if (-not (Test-Path $tectonic)) {
      throw 'Tectonic not found. Download it from https://tectonic-typesetting.github.io and put it on PATH.'
    }
    $out = Join-Path ([IO.Path]::GetTempPath()) 'resume-build'
    New-Item -ItemType Directory $out -Force | Out-Null
    & $tectonic (Join-Path $resume 'main.tex') --outdir $out
    if ($LASTEXITCODE) { throw 'Build failed.' }
    Copy-Item (Join-Path $out 'main.pdf') (Join-Path $root 'site\resume.pdf') -Force
    Write-Host 'Built site/resume.pdf.'
  }
}
