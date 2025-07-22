# ✅ Vercel Deployment Checklist

## Pre-Deployment Setup

### 🔑 Get All Required API Keys

- [ ] **OpenAI API Key**
  - [ ] Visit [OpenAI API Keys](https://platform.openai.com/api-keys)
  - [ ] Create account & add payment method
  - [ ] Generate new secret key
  - [ ] Save key (starts with `sk-`)

- [ ] **Google Gemini API Key**
  - [ ] Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
  - [ ] Sign in with Google account
  - [ ] Create API key
  - [ ] Save the generated key

- [ ] **Trello API Credentials**
  - [ ] Visit [Trello API Key](https://trello.com/app-key)
  - [ ] Copy API Key
  - [ ] Click "Token" to generate token
  - [ ] Authorize application
  - [ ] Save both API key and token

- [ ] **Session Secret**
  - [ ] Generate secure random string:
  ```bash
  node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
  ```
  - [ ] Save the generated string

- [ ] **Database (Optional)**
  - [ ] Visit [Neon.tech](https://neon.tech) for free PostgreSQL
  - [ ] Create account and project
  - [ ] Copy connection string
  - [ ] Or skip (app works with mock storage)

## 🚀 Deployment Options

### Option A: Vercel CLI (Recommended)
- [ ] Install Vercel CLI: `npm install -g vercel`
- [ ] Login: `vercel login`
- [ ] Deploy: `vercel --prod`
- [ ] Configure environment variables when prompted

### Option B: GitHub Integration
- [ ] Push code to GitHub repository
- [ ] Visit [Vercel.com](https://vercel.com)
- [ ] Connect GitHub account
- [ ] Import repository
- [ ] Configure environment variables in dashboard
- [ ] Deploy

### Option C: Drag & Drop
- [ ] Build project locally: `npm run build`
- [ ] Zip the entire project folder
- [ ] Visit [Vercel.com](https://vercel.com)
- [ ] Drag & drop zip file
- [ ] Configure environment variables

## ⚙️ Environment Variables Setup

In Vercel Dashboard → Project → Settings → Environment Variables:

### Required Variables
- [ ] `OPENAI_API_KEY` = `sk-your-openai-key-here`
- [ ] `GEMINI_API_KEY` = `your-gemini-key-here`
- [ ] `TRELLO_API_KEY` = `your-trello-api-key-here`
- [ ] `TRELLO_TOKEN` = `your-trello-token-here`
- [ ] `SESSION_SECRET` = `your-secure-random-string`

### Optional Variables
- [ ] `DATABASE_URL` = `postgresql://user:pass@host:port/db`
- [ ] `TRELLO_BOARD_URL` = `https://trello.com/b/your-board-id`

### Automatic Variables (Vercel sets these)
- [ ] `NODE_ENV` = `production` (automatic)
- [ ] `VERCEL_URL` = `your-app.vercel.app` (automatic)

## 🧪 Testing & Verification

### After Deployment
- [ ] Visit your Vercel URL
- [ ] Check deployment logs for errors
- [ ] Test homepage loads correctly
- [ ] Click "Get Started" button

### API Testing
- [ ] Test login flow (should auto-create user)
- [ ] Test microphone permissions
- [ ] Record a short test message
- [ ] Verify tasks are processed
- [ ] Check if Trello cards are created

### Common Test Commands
```bash
# Test API health
curl https://your-app.vercel.app/api/auth/user

# Should return: {"message":"Unauthorized"} (expected)
```

## 🔧 Troubleshooting

### Deployment Issues
- [ ] **Build Failed**: Check build logs in Vercel dashboard
- [ ] **Environment Variables**: Verify all required keys are set
- [ ] **API Limits**: Check if APIs have sufficient quotas

### Runtime Issues
- [ ] **Function Timeout**: Audio files might be too large (max 25MB)
- [ ] **API Errors**: Verify API keys are valid and have credits
- [ ] **Trello Issues**: Check API key and token permissions

### Debug Steps
1. [ ] Check Vercel function logs
2. [ ] Test each API endpoint individually
3. [ ] Verify browser console for errors
4. [ ] Check API usage dashboards

## 📊 Post-Deployment Monitoring

### Set Up Monitoring
- [ ] **OpenAI Usage**: Monitor at [OpenAI Usage](https://platform.openai.com/usage)
- [ ] **Vercel Analytics**: Enable in Vercel dashboard
- [ ] **Error Tracking**: Check Vercel function logs regularly

### Usage Tracking
- [ ] Set billing alerts on OpenAI account
- [ ] Monitor monthly costs
- [ ] Track application usage in dashboard

## 🎉 Success Criteria

Your deployment is successful when:
- [ ] ✅ Website loads at your Vercel URL
- [ ] ✅ Login works (creates test user)
- [ ] ✅ Microphone recording functions
- [ ] ✅ Voice transcription works (OpenAI)
- [ ] ✅ Task processing works (Gemini)
- [ ] ✅ Trello cards are created automatically
- [ ] ✅ No errors in Vercel function logs

## 🚀 You're Live!

Once all checkboxes are complete:
- 🌐 Your app is live on the web
- 🎤 Voice-powered task management is working
- 📋 Direct Trello integration is active
- 🤖 AI processing is functional
- 💳 Costs are minimal (~$3-8/month)

**Share your live app**: `https://your-app.vercel.app`

---

🎉 **Congratulations! Your voice-powered task manager is now live on Vercel!**
