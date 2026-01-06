# 🚀 GitHub Setup Instructions

Your code is ready to push! Follow these steps:

## Step 1: Get Your FREE Google Gemini API Key

**This is completely FREE with no credit card required!** 🎉

1. Visit **[https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)**
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Choose **"Create API key in new project"**
5. Copy your API key (looks like: `AIzaSyXXXXXXXXXXXXXXXXXX`)

📖 **Detailed instructions**: See [GET_API_KEY.md](GET_API_KEY.md)

## Step 2: Create GitHub Repository

1. Go to [github.com](https://github.com)
2. Click the **"+"** icon in the top right → **"New repository"**
3. Fill in the details:
   - **Repository name**: `daily-leetcode-solver` (or any name you like)
   - **Description**: "Automated daily LeetCode problem solver using AI"
   - **Visibility**: Public or Private (your choice)
   - ⚠️ **DO NOT** check "Initialize with README" (we already have one)
4. Click **"Create repository"**

## Step 3: Add Gemini API Key as GitHub Secret

This is CRITICAL - without this, the workflow won't work!

1. Go to your new repository on GitHub
2. Click **"Settings"** (top menu)
3. In the left sidebar, click **"Secrets and variables"** → **"Actions"**
4. Click **"New repository secret"**
5. Fill in:
   - **Name**: `GEMINI_API_KEY` (must be exactly this)
   - **Secret**: Your Google Gemini API key (starts with `AIza`)
6. Click **"Add secret"**

✅ **No billing required!** Unlike OpenAI, Gemini is completely free!

## Step 4: Push Your Code

GitHub will show you commands after creating the repo. Use these:

```powershell
# Set the default branch to main
git branch -M main

# Add your GitHub repository as remote (REPLACE with your actual URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push the code
git push -u origin main
```

**Example** (replace with your actual username and repo name):
```powershell
git branch -M main
git remote add origin https://github.com/johndoe/daily-leetcode-solver.git
git push -u origin main
```

## Step 5: Verify the Workflow

1. Go to your repository on GitHub
2. Click the **"Actions"** tab
3. You should see "Daily LeetCode Solver" workflow listed

## Step 6: Test It Manually

Don't wait for midnight! Test it now:

1. In the **Actions** tab, click **"Daily LeetCode Solver"**
2. Click **"Run workflow"** (on the right side)
3. Click the green **"Run workflow"** button
4. Wait for it to complete (should take 1-2 minutes)
5. Check for a new commit in your repository
6. Look in the `solutions/` folder for the generated solution!

## Troubleshooting

### "GEMINI_API_KEY environment variable is not set"
- You forgot to add the secret in Step 3
- Or you named it incorrectly (must be exactly `GEMINI_API_KEY`)

### "API key not valid"
- Make sure you copied the entire key
- Check for extra spaces
- Regenerate the key if needed

### "Error fetching daily problem"
- LeetCode's API might be temporarily down
- Try running the workflow again in a few minutes

### Workflow doesn't run automatically
- Check Settings → Actions → General
- Make sure "Allow all actions and reusable workflows" is enabled
- The workflow runs at midnight UTC (check your timezone)

## What Happens Next?

✅ Every day at **midnight UTC**, the workflow will:
1. Fetch the daily LeetCode problem
2. Send it to Google Gemini for a solution
3. Save the solution to `solutions/YYYY-MM-DD-problem-name.js`
4. Commit and push it to your repository

You'll wake up to a new solution every day! 🎉

## Cost

**$0.00 - Completely FREE!** 💰

Google Gemini's free tier includes:
- 15-60 requests per minute
- No credit card required
- Perfect for daily use

---

**Ready?** Go create that GitHub repository and push your code! 🚀
