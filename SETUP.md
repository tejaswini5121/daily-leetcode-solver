# Setup Guide

## Quick Start

Follow these steps to get your Daily LeetCode AI Solver running:

### 1. Install Node.js

If you don't have Node.js installed:
1. Download from [nodejs.org](https://nodejs.org/)
2. Install the LTS version (recommended)
3. Verify installation: `node --version` and `npm --version`

### 2. Install Dependencies

```bash
npm install
```

This will install:
- `axios` - For making HTTP requests to LeetCode
- `openai` - For AI solution generation

### 3. Get an OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign up or log in
3. Create a new API key
4. Copy the key (you won't be able to see it again!)

### 4. Test Locally (Optional)

Before pushing to GitHub, you can test locally:

1. Create a `.env` file (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your OpenAI API key:
   ```
   OPENAI_API_KEY=sk-your-actual-key-here
   ```

3. Run the solver:
   ```bash
   npm run solve
   ```

4. Check the `solutions/` folder for the generated solution!

### 5. Push to GitHub

1. Create a new repository on GitHub
2. Add your OpenAI API key as a GitHub Secret:
   - Go to your repo → Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `OPENAI_API_KEY`
   - Value: Your OpenAI API key
   - Click "Add secret"

3. Push your code:
   ```bash
   git add .
   git commit -m "Initial commit: Daily LeetCode AI Solver"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

### 6. Verify It Works

1. Go to your GitHub repository
2. Click on "Actions" tab
3. Click on "Daily LeetCode Solver" workflow
4. Click "Run workflow" → "Run workflow" to test manually
5. Wait for it to complete
6. Check the `solutions/` folder in your repo for the new solution!

## Workflow Schedule

The workflow runs automatically:
- **Daily at midnight UTC** (12:00 AM UTC)
- You can also trigger it manually from the Actions tab

## Troubleshooting

### "OPENAI_API_KEY environment variable is not set"
- Make sure you added the secret in GitHub (Settings → Secrets and variables → Actions)
- The secret name must be exactly `OPENAI_API_KEY`

### "Error fetching daily problem"
- LeetCode's GraphQL endpoint might be temporarily down
- Try running the workflow again later

### "Rate limit exceeded"
- You've hit OpenAI's rate limit
- Wait a bit and try again
- Consider upgrading your OpenAI plan if this happens frequently

### No commit is made
- This happens if a solution for today already exists
- The workflow only commits if there are new changes

## Customization

### Change the AI Model

Edit `src/solver.js` and change the model:
```javascript
model: "gpt-4-turbo-preview",  // Change to "gpt-3.5-turbo" for cheaper option
```

### Change the Schedule

Edit `.github/workflows/daily-leetcode.yml`:
```yaml
schedule:
  - cron: '0 0 * * *'  # Change this cron expression
```

Cron examples:
- `0 0 * * *` - Daily at midnight UTC
- `0 12 * * *` - Daily at noon UTC
- `0 0 * * 1` - Every Monday at midnight UTC

### Use a Different AI Service

You can replace OpenAI with other services like:
- Anthropic Claude
- Google Gemini
- Local LLMs

Just modify the `generateSolution()` function in `src/solver.js`.

## Cost Estimation

Using GPT-4 Turbo:
- ~$0.01-0.03 per solution
- ~$0.30-0.90 per month (daily)

Using GPT-3.5 Turbo:
- ~$0.001-0.003 per solution
- ~$0.03-0.09 per month (daily)

## License

MIT - Feel free to use and modify as you wish!
