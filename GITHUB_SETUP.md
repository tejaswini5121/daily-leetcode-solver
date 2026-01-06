# 🚀 GitHub Setup Instructions

Your code is ready to push! Follow these steps:

## Step 1: Create GitHub Repository

1. Go to [github.com](https://github.com)
2. Click the **"+"** icon in the top right → **"New repository"**
3. Fill in the details:
   - **Repository name**: `daily-leetcode-solver` (or any name you like)
   - **Description**: "Automated daily LeetCode problem solver using AI"
   - **Visibility**: Public or Private (your choice)
   - ⚠️ **DO NOT** check "Initialize with README" (we already have one)
4. Click **"Create repository"**

## Step 2: Add OpenAI API Key as GitHub Secret

This is CRITICAL - without this, the workflow won't work!

1. Go to your new repository on GitHub
2. Click **"Settings"** (top menu)
3. In the left sidebar, click **"Secrets and variables"** → **"Actions"**
4. Click **"New repository secret"**
5. Fill in:
   - **Name**: `OPENAI_API_KEY` (must be exactly this)
   - **Secret**: Your OpenAI API key (starts with `sk-`)
6. Click **"Add secret"**

⚠️ **Important**: Make sure you have billing set up on your OpenAI account, or the workflow will fail with a quota error (like we saw locally).

## Step 3: Push Your Code

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

## Step 4: Verify the Workflow

1. Go to your repository on GitHub
2. Click the **"Actions"** tab
3. You should see "Daily LeetCode Solver" workflow listed

## Step 5: Test It Manually

Don't wait for midnight! Test it now:

1. In the **Actions** tab, click **"Daily LeetCode Solver"**
2. Click **"Run workflow"** (on the right side)
3. Click the green **"Run workflow"** button
4. Wait for it to complete (should take 1-2 minutes)
5. Check for a new commit in your repository
6. Look in the `solutions/` folder for the generated solution!

## Troubleshooting

### "OPENAI_API_KEY environment variable is not set"
- You forgot to add the secret in Step 2
- Or you named it incorrectly (must be exactly `OPENAI_API_KEY`)

### "429 You exceeded your current quota"
- Your OpenAI account needs billing set up
- Go to [platform.openai.com/settings/organization/billing](https://platform.openai.com/settings/organization/billing)
- Add a payment method
- The cost is very low: ~$0.001-0.01 per solution

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
2. Send it to OpenAI for a solution
3. Save the solution to `solutions/YYYY-MM-DD-problem-name.js`
4. Commit and push it to your repository

You'll wake up to a new solution every day! 🎉

## Cost Estimate

Using `gpt-4o-mini`:
- ~$0.001-0.003 per solution
- ~$0.03-0.09 per month (daily)

Very affordable! 💰

---

**Ready?** Go create that GitHub repository and push your code! 🚀
