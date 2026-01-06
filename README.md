# Daily LeetCode AI Solver

This project automatically solves the daily LeetCode problem using AI and commits the solution to this repository.

## How it works

1. **GitHub Actions Workflow**: Runs daily at midnight UTC
2. **Fetches Daily Problem**: Gets the LeetCode daily challenge
3. **AI Solution**: Uses OpenAI to generate a solution
4. **Auto-Commit**: Saves and commits the solution to the `solutions/` directory

## Setup

### Prerequisites
- GitHub repository
- OpenAI API key (or other AI service)

### Configuration

1. Add your OpenAI API key as a GitHub Secret:
   - Go to your repository Settings → Secrets and variables → Actions
   - Add a new secret named `OPENAI_API_KEY` with your API key
   - ⚠️ **Important**: Make sure you have billing set up on your OpenAI account

2. The workflow will run automatically every day at midnight UTC
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
