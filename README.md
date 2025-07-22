# Dictate to Trello - Voice-Powered Task Management

Transform your spoken thoughts into organized Trello cards instantly using AI-powered voice recognition and intelligent task processing.

## 🌟 Features

### ✨ **NEW: Direct Trello API Integration**
- **No more email workarounds** - Direct API integration with Trello
- **Real-time card creation** in your Trello boards
- **Intelligent list detection** - automatically finds "To Do", "Backlog", or uses your first list
- **Board and list management** via intuitive API endpoints

### 🎤 Voice Processing
- **High-quality audio recording** with real-time feedback
- **OpenAI Whisper transcription** for accurate speech-to-text
- **Google Gemini AI processing** for intelligent task extraction
- **Multi-language support** (99+ languages)

### 🤖 AI-Powered Task Intelligence
- **Automatic task breakdown** from natural speech
- **Context-aware processing** that understands task relationships
- **Smart categorization** and priority detection
- **Natural language understanding** for complex instructions

### 📊 Usage Analytics
- **Real-time cost tracking** for API usage
- **Daily and monthly statistics** 
- **Performance metrics** and usage history
- **Transparent pricing** display

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or newer
- npm or yarn
- Trello account and API credentials

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd dictate-to-trello
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
Copy the example environment file and configure your API keys:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Development Configuration
NODE_ENV=development
PORT=5000

# Database (optional for development - uses mock storage)
DATABASE_URL="postgresql://user:password@localhost:5432/trello_dictate_dev"

# Required: OpenAI API Key
OPENAI_API_KEY="your-openai-api-key-here"

# Required: Google Gemini API Key  
GEMINI_API_KEY="your-gemini-api-key-here"

# Required: Trello API Credentials
TRELLO_API_KEY="your-trello-api-key"
TRELLO_TOKEN="your-trello-token"

# Optional: Specific board configuration
TRELLO_BOARD_URL="https://trello.com/b/your-board-id"

# Session Security
SESSION_SECRET="your-secure-session-secret"
```

### 🔑 Getting API Keys

#### OpenAI API Key
1. Visit [OpenAI API Keys](https://platform.openai.com/api-keys)
2. Create a new API key
3. Copy and paste into your `.env` file

#### Google Gemini API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy and paste into your `.env` file

#### Trello API Credentials
1. Visit [Trello API Key](https://trello.com/app-key)
2. Copy your API Key
3. Click "Generate Token" to get your token
4. Add both to your `.env` file

### 🏃‍♂️ Running the Application

**Development Mode:**
```bash
npm run dev
```

**Deploy to Vercel:**
```bash
npm install -g vercel
vercel --prod
```

Or use the [One-Click Deploy Guide](QUICK_DEPLOY.md)

The application will be available at `http://localhost:5000` (dev) or your Vercel URL (production)

## 🎯 How to Use

### 1. **Access the Interface**
- Open `http://localhost:5000` in your browser
- Click "Get Started" or "Start Dictating"

### 2. **Authentication** 
- In development mode, authentication is automatically handled
- Click login to create a mock development user

### 3. **Record Your Tasks**
- Click the microphone button to start recording
- Speak naturally: *"I need to finish the quarterly report by Friday, schedule a team meeting for next week, and follow up with the client about their feedback"*
- Click the stop button when finished

### 4. **AI Processing**
The system will:
- **Transcribe** your audio using OpenAI Whisper
- **Process** the transcription with Google Gemini AI
- **Extract** individual actionable tasks
- **Create** Trello cards automatically

### 5. **View Results**
- See your processed tasks in the interface
- View task history and usage statistics
- Check your Trello board for the new cards

## 💰 Pricing & Costs

### OpenAI Whisper
- **$0.006 per minute** of audio transcription

### Google Gemini AI
- **Token-based pricing** (very cost-effective)
- Approximately **1.5 cents per task** processed

### Trello API
- **Free** for standard API usage

**Example:** Processing a 2-minute recording with 3 tasks = ~$0.016 total cost

---

**🎉 Your interface is now UP AND RUNNING with direct Trello API integration!**
**✅ No more email workarounds - direct card creation in your Trello boards**
**🚀 Ready for voice-powered task management at http://localhost:5000**
