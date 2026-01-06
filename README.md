# Daily LeetCode AI Solver

This project automatically solves the daily LeetCode problem using AI and commits the solution to this repository.

## How it works

1. **GitHub Actions Workflow**: Runs daily at midnight UTC
2. **Fetches Daily Problem**: Gets the LeetCode daily challenge
3. **AI Solution**: Uses Google Gemini (FREE!) to generate a solution
4. **Auto-Commit**: Saves and commits the solution to the `solutions/` directory

## Setup

### Prerequisites
- GitHub repository
- Google Gemini API key (FREE - no credit card required!)

### Configuration

1. Get your FREE Google Gemini API key:
   - 📖 See [GET_API_KEY.md](GET_API_KEY.md) for step-by-step instructions
   - No credit card required!

2. Add your Gemini API key as a GitHub Secret:
   - Go to your repository Settings → Secrets and variables → Actions
   - Add a new secret named `GEMINI_API_KEY` with your API key

3. The workflow will run automatically every day at midnight UTC
   - You can also trigger it manually from the Actions tab

📖 **Detailed setup instructions**: See [GITHUB_SETUP.md](GITHUB_SETUP.md)

## Project Structure

```
.
├── .github/
│   └── workflows/
│       └── daily-leetcode.yml    # GitHub Actions workflow
├── solutions/                     # Generated solutions stored here
├── src/
│   └── solver.js                 # Main script to fetch and solve problems
├── package.json
└── README.md
```

## Solutions

All solutions are stored in the `solutions/` directory with the format:
`YYYY-MM-DD-problem-name.js`

## Manual Trigger

You can manually trigger the workflow from the Actions tab in your GitHub repository.
