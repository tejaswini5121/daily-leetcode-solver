# Quick Reference

## Project Structure
```
tryGitAi/
├── .github/
│   └── workflows/
│       └── daily-leetcode.yml    # GitHub Actions workflow (runs daily)
├── solutions/                     # AI-generated solutions saved here
│   └── .gitkeep
├── src/
│   └── solver.js                 # Main script
├── .env.example                  # Template for local testing
├── .gitignore
├── package.json
├── README.md
├── SETUP.md                      # Detailed setup instructions
└── QUICK_REFERENCE.md           # This file
```

## Essential Commands

```bash
# Install dependencies
npm install

# Run solver locally (requires .env file with OPENAI_API_KEY)
npm run solve

# Initialize git (already done)
git init

# First commit
git add .
git commit -m "Initial commit"

# Add remote and push
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

## GitHub Setup Checklist

- [ ] Create GitHub repository
- [ ] Add `OPENAI_API_KEY` secret (Settings → Secrets and variables → Actions)
- [ ] Push code to GitHub
- [ ] Verify workflow in Actions tab
- [ ] Test manual run
- [ ] Wait for first automated run (midnight UTC)

## Important URLs

- **OpenAI API Keys**: https://platform.openai.com/api-keys
- **GitHub Actions Docs**: https://docs.github.com/en/actions
- **Cron Expression Helper**: https://crontab.guru/

## Workflow Triggers

1. **Automatic**: Every day at midnight UTC
2. **Manual**: Actions tab → Daily LeetCode Solver → Run workflow

## File Naming Convention

Solutions are saved as: `YYYY-MM-DD-problem-title-slug.js`

Example: `2026-01-06-two-sum.js`

## Costs (Approximate)

| Model | Per Solution | Monthly (Daily) |
|-------|-------------|-----------------|
| GPT-4 Turbo | $0.01-0.03 | $0.30-0.90 |
| GPT-3.5 Turbo | $0.001-0.003 | $0.03-0.09 |

## Common Issues

| Issue | Solution |
|-------|----------|
| npm not found | Install Node.js from nodejs.org |
| API key error | Add OPENAI_API_KEY to GitHub Secrets |
| No commit made | Solution for today already exists |
| Rate limit | Wait or upgrade OpenAI plan |

## Next Steps

1. ✅ Project created
2. ⏳ Install Node.js (if needed)
3. ⏳ Run `npm install`
4. ⏳ Get OpenAI API key
5. ⏳ Test locally (optional)
6. ⏳ Create GitHub repo
7. ⏳ Add API key secret
8. ⏳ Push to GitHub
9. ⏳ Test workflow
10. ⏳ Enjoy daily solutions!

---

**Need help?** Check SETUP.md for detailed instructions.
