# Helper script to install dependencies using full path to npm
# This is useful when npm is not in PATH yet

Write-Host "🔍 Checking for Node.js installation..." -ForegroundColor Cyan

$nodePath = "C:\Program Files\nodejs\node.exe"
$npmPath = "C:\Program Files\nodejs\npm.cmd"

if (Test-Path $nodePath) {
    Write-Host "✅ Node.js found at: $nodePath" -ForegroundColor Green
    
    # Get version
    $nodeVersion = & $nodePath --version
    Write-Host "   Version: $nodeVersion" -ForegroundColor Gray
    
    if (Test-Path $npmPath) {
        Write-Host "✅ npm found at: $npmPath" -ForegroundColor Green
        
        # Get npm version
        $npmVersion = & $npmPath --version
        Write-Host "   Version: $npmVersion" -ForegroundColor Gray
        
        Write-Host "`n📦 Installing dependencies..." -ForegroundColor Cyan
        & $npmPath install
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "`n✨ Dependencies installed successfully!" -ForegroundColor Green
            Write-Host "`n💡 Tip: Restart your terminal so 'npm' works without full path" -ForegroundColor Yellow
        } else {
            Write-Host "`n❌ Installation failed. Check the error above." -ForegroundColor Red
        }
    } else {
        Write-Host "❌ npm not found at: $npmPath" -ForegroundColor Red
        Write-Host "   Please reinstall Node.js from https://nodejs.org/" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ Node.js not found at: $nodePath" -ForegroundColor Red
    Write-Host "`n📥 Please install Node.js:" -ForegroundColor Yellow
    Write-Host "   1. Go to https://nodejs.org/" -ForegroundColor Gray
    Write-Host "   2. Download the LTS version" -ForegroundColor Gray
    Write-Host "   3. Run the installer" -ForegroundColor Gray
    Write-Host "   4. Make sure 'Add to PATH' is checked" -ForegroundColor Gray
    Write-Host "   5. Restart your terminal after installation" -ForegroundColor Gray
}
