$ErrorActionPreference = 'Stop'
$appRoot = Split-Path -Parent $PSScriptRoot
$outputFolder = Join-Path $appRoot 'dist'
$compiler = Join-Path $env:WINDIR 'Microsoft.NET\Framework64\v4.0.30319\csc.exe'
if (-not (Test-Path -LiteralPath $compiler)) {
    $compiler = Join-Path $env:WINDIR 'Microsoft.NET\Framework\v4.0.30319\csc.exe'
}
if (-not (Test-Path -LiteralPath $compiler)) { throw 'The Windows .NET Framework C# compiler was not found.' }
New-Item -ItemType Directory -Force -Path $outputFolder | Out-Null
$exePath = Join-Path $outputFolder 'JKCrop247.exe'
$sourcePath = Join-Path $PSScriptRoot 'Launcher.cs'
$arguments = @(
    '/nologo', '/target:winexe', '/optimize+', "/out:$exePath",
    "/resource:$(Join-Path $appRoot 'index.html'),index.html",
    "/resource:$(Join-Path $appRoot 'styles.css'),styles.css",
    "/resource:$(Join-Path $appRoot 'app.js'),app.js",
    $sourcePath
)
& $compiler @arguments
if ($LASTEXITCODE -ne 0) { throw 'The JKCrop 24/7 executable could not be built.' }
Write-Output "Created $exePath"
