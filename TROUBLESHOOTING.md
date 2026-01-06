# Troubleshooting Guide

## Issue: "npm is not recognized" even though Node.js is installed

### Problem
You've installed Node.js and added it to PATH, but PowerShell still can't find `npm` or `node`.

### Solution

**The PATH changes require a terminal restart!** Follow these steps:

#### Option 1: Restart Terminal (Recommended)
1. **Close ALL PowerShell/Terminal windows**
2. **Open a NEW PowerShell/Terminal window**
3. Navigate back to the project:
   ```powershell
   cd "c:\My PC\Proj\tryGitAi"
   ```
4. Try again:
   ```powershell
   node --version
   npm --version
   npm install
   ```

#### Option 2: Refresh Environment in Current Session
If you don't want to close the terminal, run this command:

```powershell
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
```

Then try:
```powershell
node --version
npm --version
npm install
```

#### Option 3: Use Full Path Temporarily
If the above doesn't work, you can use the full path:

```powershell
& "C:\Program Files\nodejs\npm.cmd" install
```

### Verify Installation

After restarting your terminal, verify Node.js and npm are working:

```powershell
node --version    # Should show: v20.x.x or similar
npm --version     # Should show: 10.x.x or similar
```

### Still Not Working?

If Node.js still isn't recognized after restarting:

1. **Check if Node.js is actually installed:**
   ```powershell
   Test-Path "C:\Program Files\nodejs\node.exe"
   ```
   Should return: `True`

2. **Check PATH manually:**
   ```powershell
   $env:Path -split ';' | Select-String nodejs
   ```
   Should show: `C:\Program Files\nodejs`

3. **If PATH is missing Node.js, add it manually:**
   - Open System Properties → Environment Variables
   - Under "System variables", find "Path"
   - Click "Edit"
   - Add: `C:\Program Files\nodejs`
   - Click OK on all dialogs
   - **Restart your terminal**

4. **Reinstall Node.js:**
   - Download from [nodejs.org](https://nodejs.org/)
   - Run the installer
   - Make sure "Add to PATH" is checked
   - Restart terminal after installation

### Alternative: Use the Helper Script

I've created `install-deps.ps1` that uses the full path to npm. Run:

```powershell
.\install-deps.ps1
```

---

## Other Common Issues

### "Cannot be loaded because running scripts is disabled"

If you see this error when running `.ps1` scripts:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Then try again.

### "OPENAI_API_KEY environment variable is not set"

This is expected for local testing. Either:
- Create a `.env` file with your API key (see `.env.example`)
- Or skip local testing and just push to GitHub

### GitHub Actions workflow not running

1. Check that you added `OPENAI_API_KEY` secret in GitHub
2. Go to Settings → Actions → General
3. Make sure "Allow all actions and reusable workflows" is selected
4. Check the Actions tab for any error messages

---

**Need more help?** Check `SETUP.md` for detailed setup instructions.
