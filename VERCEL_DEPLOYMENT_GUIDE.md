# Vercel Deployment Guide

Complete guide to deploy your Dictate to Trello app on Vercel with all required API configurations.

## 🚀 Quick Deploy to Vercel

### Option 1: Deploy via Vercel CLI
```bash
npm install -g vercel
vercel login
vercel --prod
```

### Option 2: Deploy via GitHub
1. Push your code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Configure environment variables (see below)
5. Deploy!

## 🔑 Required API Keys & Environment Variables

Add these to your Vercel Environment Variables:

### 1. **OpenAI API** (REQUIRED)
```
OPENAI_API_KEY=sk-your-openai-api-key-here
```

**How to get:**
1. Visit [OpenAI API Keys](https://platform.openai.com/api-keys)
2. Create account if needed
3. Click "Create new secret key"
4. Copy the key (starts with `sk-`)
5. **Cost**: ~$0.006 per minute of audio

### 2. **Google Gemini API** (REQUIRED)
```
GEMINI_API_KEY=your-gemini-api-key-here
```

**How to get:**
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the generated key
5. **Cost**: Very low, token-based pricing

### 3. **Trello API** (REQUIRED)
```
TRELLO_API_KEY=your-trello-api-key-here
TRELLO_TOKEN=your-trello-token-here
```

**How to get:**
1. Visit [Trello API Key](https://trello.com/app-key)
2. Copy your "API Key"
3. Click "Token" link to generate token
4. Authorize the application
5. Copy the generated token
6. **Cost**: Free for standard usage

### 4. **Database** (OPTIONAL)
```
DATABASE_URL=postgresql://username:password@host:port/database
```

**Recommended: Neon.tech (Free PostgreSQL)**
1. Visit [Neon.tech](https://neon.tech)
2. Create free account
3. Create new project
4. Copy connection string
5. **Cost**: Free tier available

**Note:** If you don't provide DATABASE_URL, the app uses mock storage (works for testing)

### 5. **Session Security** (REQUIRED)
```
SESSION_SECRET=your-super-secure-random-string-here
```

**How to generate:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 6. **Node Environment** (AUTOMATIC)
```
NODE_ENV=production
```
*Vercel sets this automatically*

### 7. **Optional: Trello Board Configuration**
```
TRELLO_BOARD_URL=https://trello.com/b/your-board-id
```

## 📋 Complete Environment Variables List

Copy this template to your Vercel Environment Variables:

```env
# REQUIRED: AI Services
OPENAI_API_KEY=sk-your-openai-api-key-here
GEMINI_API_KEY=your-gemini-api-key-here

# REQUIRED: Trello Integration  
TRELLO_API_KEY=your-trello-api-key-here
TRELLO_TOKEN=your-trello-token-here

# REQUIRED: Security
SESSION_SECRET=your-super-secure-random-string-here

# OPTIONAL: Database (uses mock storage if not provided)
DATABASE_URL=postgresql://username:password@host:port/database

# OPTIONAL: Specific Trello Board
TRELLO_BOARD_URL=https://trello.com/b/your-board-id

# AUTOMATIC: Environment
NODE_ENV=production
```

## 🔧 Vercel Configuration Steps

### 1. **Environment Variables in Vercel Dashboard**
1. Go to your project in Vercel Dashboard
2. Click "Settings" tab
3. Click "Environment Variables"
4. Add each variable:
   - **Name**: Variable name (e.g., `OPENAI_API_KEY`)
   - **Value**: Your API key
   - **Environment**: Select "Production" (and optionally Preview/Development)

### 2. **Domain Configuration**
- Vercel provides `your-app.vercel.app` domain automatically
- You can add custom domain in Settings > Domains

### 3. **Function Configuration**
The app is configured for Vercel's serverless functions:
- API routes run as serverless functions
- 30-second timeout limit (configured in `vercel.json`)
- Automatic scaling

## 🧪 Testing Your Deployment

### 1. **Check Deployment Status**
- Visit your Vercel dashboard
- Check deployment logs for any errors
- Verify all environment variables are set

### 2. **Test API Endpoints**
```bash
# Replace with your Vercel URL
curl https://your-app.vercel.app/api/auth/user

# Should return {"message":"Unauthorized"} (expected)
```

### 3. **Test Full Application**
1. Visit your Vercel URL
2. Click "Get Started"
3. Try recording a test message
4. Check if Trello cards are created

## 🔍 Troubleshooting

### Common Issues:

**❌ "OPENAI_API_KEY not found"**
- Verify API key is set in Vercel environment variables
- Check API key is valid and has credits
- Ensure no extra spaces in the key

**❌ "Gemini API error"**
- Verify Gemini API key is correct
- Check if Gemini API is enabled in Google Cloud
- Ensure API key has proper permissions

**❌ "Trello authentication failed"**
- Verify both API key AND token are set
- Check token hasn't expired
- Ensure account has access to target board

**❌ "Database connection failed"**
- Check DATABASE_URL format
- Verify database is accessible from Vercel
- App will fallback to mock storage (works for testing)

**❌ "Function timeout"**
- Audio files too large (limit: 25MB)
- Check Vercel function logs
- Verify all API services are responding

### Debug Steps:
1. Check Vercel function logs in dashboard
2. Verify all environment variables are set
3. Test individual API endpoints
4. Check browser developer console for errors

## 💰 Cost Breakdown

| Service | Cost | Usage |
|---------|------|-------|
| **Vercel** | Free | Hosting & Functions |
| **OpenAI Whisper** | $0.006/min | Audio transcription |
| **Google Gemini** | ~$0.015/task | Task processing |
| **Trello** | Free | API calls |
| **Neon DB** | Free | PostgreSQL database |

**Example**: 10 minutes of audio with 20 tasks = ~$0.36/month

## 🎉 Success!

Once deployed, you'll have:
- ✅ **Live web app** on Vercel
- ✅ **Automatic scaling** serverless functions  
- ✅ **Real-time voice processing** 
- ✅ **Direct Trello integration**
- ✅ **Production-ready** architecture

Your voice-powered task management system is now live on the web! 🌐🎤📋
