# Setting up Atlassian MCP for Cursor

This guide shows you how to integrate the Atlassian MCP with Cursor IDE for direct Trello integration.

## Prerequisites

1. **Cursor IDE** installed
2. **Atlassian/Trello account** with API access
3. **Node.js 18+** for running MCP servers

## Option 1: Using Pre-built Atlassian MCP Server

### 1. Install the Atlassian MCP Server
```bash
npm install -g mcp-atlassian
# or using uvx
uvx mcp-atlassian
```

### 2. Get Your Trello API Credentials
1. Go to [Trello API Key](https://trello.com/app-key)
2. Copy your API Key
3. Click "Generate Token" to get your token

### 3. Configure Cursor IDE

1. Open **Cursor Settings**
2. Navigate to **Features > MCP Servers**  
3. Click **"Add New MCP Server"**
4. Use this configuration:

```yaml
name: atlassian-trello
type: command
command: uvx mcp-atlassian --jira-url=https://your-company.atlassian.net --jira-username=your.email@company.com --jira-token=your_api_token
```

**For Trello specifically:**
```yaml
name: trello-mcp
type: command  
command: uvx mcp-atlassian --confluence-url=https://trello.com/api --confluence-username=your.email@company.com --confluence-token=your_trello_token
```

### 4. Test the Integration

In Cursor's Composer, try commands like:
- "Create a Trello card for 'Review quarterly budget'"
- "List my Trello boards"
- "Add a task to my To Do list"

## Option 2: Using This Project's Built-in Trello Integration

This project already has direct Trello API integration built-in! 

### 1. Configure Your Environment
```bash
# In your .env file
TRELLO_API_KEY="your-trello-api-key"
TRELLO_TOKEN="your-trello-token"
TRELLO_BOARD_URL="https://trello.com/b/your-board-id" # Optional
```

### 2. Start the Application
```bash
npm run dev
```

### 3. Use the Voice Interface
1. Open http://localhost:5000
2. Click "Get Started" 
3. Record your tasks: *"Create a card for reviewing the budget, add a task for the team meeting, and remind me to follow up with clients"*
4. Watch as cards are automatically created in your Trello board!

## Comparing the Approaches

| Feature | Atlassian MCP | Built-in Integration |
|---------|---------------|---------------------|
| Setup Complexity | Medium | Easy |
| Voice Input | No | ✅ Yes |
| AI Processing | No | ✅ Yes (Whisper + Gemini) |
| Cursor Integration | ✅ Yes | No |
| Direct API | ✅ Yes | ✅ Yes |
| Natural Language | Limited | ✅ Advanced |

## Recommendation

- **For Cursor IDE integration**: Use the Atlassian MCP server
- **For voice-powered task management**: Use this project's built-in integration
- **For the best experience**: Use both! This project for voice input, MCP for text-based commands in Cursor

## Troubleshooting

### Common MCP Issues
1. **Server not starting**: Check Node.js version (requires 18+)
2. **Authentication errors**: Verify API tokens and permissions
3. **Connection timeout**: Check network and firewall settings

### Trello API Issues  
1. **Invalid token**: Regenerate your Trello token
2. **Board access**: Ensure your token has access to the target board
3. **Rate limiting**: Built-in delays handle this automatically

## Next Steps

1. Set up your preferred integration method
2. Configure your API credentials
3. Test with simple commands
4. Explore advanced features like board management and task automation

---

🎉 **You now have powerful Trello integration options available!**
