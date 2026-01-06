# 🆓 Getting Your FREE Google Gemini API Key

Google Gemini is **completely FREE** with very high rate limits and **NO credit card required**!

## Step-by-Step Guide

### 1. Go to Google AI Studio

Visit: **[https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)**

### 2. Sign In

- Sign in with your Google account
- If you don't have one, create a free Google account

### 3. Create API Key

1. Click **"Create API Key"** button
2. Choose **"Create API key in new project"** (recommended)
   - Or select an existing Google Cloud project if you have one
3. Your API key will be generated instantly!

### 4. Copy Your API Key

- Click the **copy icon** to copy your API key
- It will look something like: `AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`
- ⚠️ **Keep it safe!** Don't share it publicly

### 5. Use Your API Key

#### For Local Testing:

1. Create a `.env` file in your project:
   ```bash
   Copy-Item .env.example .env
   ```

2. Edit `.env` and paste your API key:
   ```
   GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   ```

#### For GitHub Actions:

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"**
4. Name: `GEMINI_API_KEY`
5. Secret: Paste your API key
6. Click **"Add secret"**

## ✨ Benefits of Google Gemini

✅ **Completely FREE** - No credit card required  
✅ **High Rate Limits** - 15-60 requests per minute  
✅ **No Billing Setup** - Start using immediately  
✅ **Powerful Model** - Gemini 2.0 Flash is very capable  
✅ **Great for Learning** - Perfect for projects like this  

## Rate Limits (Free Tier)

- **Gemini 2.0 Flash**: 15 RPM (requests per minute)
- **Gemini 1.5 Flash**: 15 RPM
- **Gemini 1.5 Pro**: 2 RPM

For our daily LeetCode solver (1 request per day), you'll **never hit the limits**! 🎉

## Troubleshooting

### "API key not valid"
- Make sure you copied the entire key
- Check for extra spaces at the beginning or end
- Regenerate the key if needed

### "User location is not supported"
- Gemini API might not be available in your region yet
- Try using a VPN or use an alternative like Groq (also free)

### "Quota exceeded"
- This shouldn't happen with daily use
- Check if you're making multiple requests
- Wait a minute and try again

## Alternative Free Options

If Gemini doesn't work for you, here are other free alternatives:

1. **Groq Cloud** - [https://console.groq.com](https://console.groq.com)
   - Free Llama 3 & Mistral models
   - Extremely fast
   - OpenAI-compatible API

2. **OpenRouter** - [https://openrouter.ai](https://openrouter.ai)
   - 50+ models
   - Several completely free models
   - No deposit required

3. **GitHub Models** - [https://github.com/marketplace/models](https://github.com/marketplace/models)
   - Free for GitHub users
   - GPT-4o, Llama, and more

---

**Ready?** Get your free API key and start solving LeetCode problems! 🚀
