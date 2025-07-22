# 🚀 One-Click Deploy to Vercel

## Deploy Now
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/dictate-to-trello)

## Required Environment Variables

After clicking deploy, you'll need to set these environment variables in Vercel:

### 🔑 Essential APIs (Required)

| Variable | Where to Get | Cost |
|----------|-------------|------|
| `OPENAI_API_KEY` | [OpenAI API Keys](https://platform.openai.com/api-keys) | $0.006/min |
| `GEMINI_API_KEY` | [Google AI Studio](https://makersuite.google.com/app/apikey) | Very low |
| `TRELLO_API_KEY` | [Trello API](https://trello.com/app-key) | Free |
| `TRELLO_TOKEN` | [Trello API](https://trello.com/app-key) → "Token" | Free |
| `SESSION_SECRET` | Generate random string | Free |

### 🗄️ Optional Database

| Variable | Where to Get | Cost |
|----------|-------------|------|
| `DATABASE_URL` | [Neon.tech](https://neon.tech) (PostgreSQL) | Free tier |

*Note: App works without database using mock storage*

## 🔧 Quick Setup Steps

### 1. Get OpenAI API Key
```
1. Visit: https://platform.openai.com/api-keys
2. Create account & add payment method
3. Click "Create new secret key"
4. Copy key (starts with sk-)
```

### 2. Get Gemini API Key  
```
1. Visit: https://makersuite.google.com/app/apikey
2. Sign in with Google
3. Click "Create API Key"
4. Copy the generated key
```

### 3. Get Trello Credentials
```
1. Visit: https://trello.com/app-key
2. Copy "API Key"
3. Click "Token" link
4. Authorize & copy token
```

### 4. Generate Session Secret
```bash
# Run this command to generate secure secret:
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 5. Optional: Database
```
1. Visit: https://neon.tech
2. Create free account
3. Create project
4. Copy connection string
```

## 📋 Environment Variables Template

Copy these to Vercel Environment Variables:

```
OPENAI_API_KEY=sk-your-key-here
GEMINI_API_KEY=your-key-here
TRELLO_API_KEY=your-key-here
TRELLO_TOKEN=your-token-here
SESSION_SECRET=your-secure-secret-here
DATABASE_URL=postgresql://user:pass@host:port/db
```

## ✅ Verification

After deployment:
1. Visit your Vercel URL
2. Click "Get Started"
3. Test voice recording
4. Check Trello for new cards

## 💸 Total Cost

**Minimal usage**: ~$2-5/month
- OpenAI: $0.006 per minute of audio
- Gemini: ~$0.015 per task
- Vercel: Free
- Trello: Free
- Database: Free (Neon)

**Example**: 100 minutes of audio + 200 tasks = ~$3.60/month

---

🎉 **Your voice-powered task manager will be live in minutes!**
