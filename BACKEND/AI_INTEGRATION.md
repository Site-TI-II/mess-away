# Claude Sonnet 4.5 Integration Guide

## Overview
MessAway now includes **Claude Sonnet 4.5** AI integration, enabled globally for all clients. This provides intelligent features like task insights, smart suggestions, and automated content generation.

## Quick Start

### 1. Get Anthropic API Key
1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Sign up or log in
3. Navigate to "API Keys"
4. Create a new API key
5. Copy the key (starts with `sk-ant-`)

### 2. Configure Environment
Set the API key as an environment variable:

```bash
export ANTHROPIC_API_KEY='sk-ant-your-api-key-here'
```

Or create a `.env` file (not committed to git):
```bash
cp .env.example .env
# Edit .env and add your API key
```

### 3. Start the Server
```bash
cd BACKEND
mvn clean package
mvn exec:java
```

### 4. Verify Configuration
```bash
curl http://localhost:4567/MessAway/ai/status
```

Expected response:
```json
{
  "configured": true,
  "model": "claude-sonnet-4-20250514",
  "status": "ready"
}
```

## API Endpoints

### 1. Check AI Status
```http
GET /MessAway/ai/status
```

**Response:**
```json
{
  "configured": true,
  "model": "claude-sonnet-4-20250514",
  "status": "ready"
}
```

### 2. Generate AI Response
```http
POST /MessAway/ai/generate
Content-Type: application/json

{
  "prompt": "Give me 3 tips for organizing a kitchen",
  "context": "You are a home organization expert",
  "maxTokens": 500,
  "temperature": 0.7
}
```

**Response:**
```json
{
  "content": "Here are 3 effective kitchen organization tips:\n\n1. **Zone Organization**: Group items by function...",
  "model": "claude-sonnet-4-20250514",
  "tokensUsed": 156,
  "success": true
}
```

**Parameters:**
- `prompt` (required): The user's question or request
- `context` (optional): System message to set AI behavior
- `maxTokens` (optional): Max response length (default: 1024)
- `temperature` (optional): Creativity level 0-1 (default: 1.0)

### 3. Generate Casa Insight
```http
POST /MessAway/ai/casa-insight
Content-Type: application/json

{
  "casaName": "Casa da Daniela",
  "totalTasks": 30,
  "completedTasks": 25
}
```

**Response:**
```json
{
  "content": "Excellent progress! You've completed 83% of your tasks at Casa da Daniela. Keep up the great momentum – you're almost there!",
  "model": "claude-sonnet-4-20250514",
  "tokensUsed": 42,
  "success": true
}
```

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `ANTHROPIC_API_KEY` | ✅ Yes | - | Your Anthropic API key |
| `AI_MODEL` | ❌ No | `claude-sonnet-4-20250514` | Model to use |

## Available Models

| Model ID | Name | Description | Best For |
|----------|------|-------------|----------|
| `claude-sonnet-4-20250514` | Claude Sonnet 4.5 | Latest, fastest, most capable | **Recommended** - All tasks |
| `claude-3-5-sonnet-20241022` | Claude 3.5 Sonnet | Previous generation | Legacy support |
| `claude-3-opus-20240229` | Claude 3 Opus | Most capable v3 | Complex reasoning |

## Testing Examples

### Test 1: Basic Generation
```bash
curl -X POST http://localhost:4567/MessAway/ai/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Suggest 3 daily tasks for a busy family",
    "maxTokens": 200
  }'
```

### Test 2: With Context
```bash
curl -X POST http://localhost:4567/MessAway/ai/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "How can I improve my home organization?",
    "context": "You are a professional home organizer. Be concise and practical.",
    "temperature": 0.7,
    "maxTokens": 300
  }'
```

### Test 3: Casa Insight
```bash
curl -X POST http://localhost:4567/MessAway/ai/casa-insight \
  -H "Content-Type: application/json" \
  -d '{
    "casaName": "My Home",
    "totalTasks": 50,
    "completedTasks": 35
  }'
```

## Integration in Your Code

### Java Backend
```java
import com.messaway.service.AIService;
import com.messaway.model.AIRequest;
import com.messaway.model.AIResponse;

// Create service instance
AIService aiService = new AIService();

// Check if configured
if (!aiService.isConfigured()) {
    System.out.println("AI not configured - set ANTHROPIC_API_KEY");
    return;
}

// Generate response
AIRequest request = new AIRequest("Give me a task suggestion");
request.setMaxTokens(150);
AIResponse response = aiService.generate(request);

if (response.isSuccess()) {
    System.out.println("AI: " + response.getContent());
    System.out.println("Tokens used: " + response.getTokensUsed());
} else {
    System.err.println("Error: " + response.getError());
}
```

### Frontend (React/JavaScript)
```javascript
// Check AI status
const checkAI = async () => {
  const response = await fetch('http://localhost:4567/MessAway/ai/status');
  const status = await response.json();
  console.log('AI Status:', status);
};

// Generate AI response
const generateInsight = async (casaData) => {
  const response = await fetch('http://localhost:4567/MessAway/ai/casa-insight', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      casaName: casaData.nome,
      totalTasks: casaData.totalTasks,
      completedTasks: casaData.completedTasks
    })
  });
  
  const result = await response.json();
  if (result.success) {
    console.log('AI Insight:', result.content);
    return result.content;
  } else {
    console.error('AI Error:', result.error);
    return null;
  }
};
```

## Cost Considerations

### Anthropic Pricing (as of October 2024)
- **Claude Sonnet 4**: ~$3 per million input tokens, ~$15 per million output tokens
- **Claude 3.5 Sonnet**: ~$3 per million input tokens, ~$15 per million output tokens

### Estimated Usage
- **Casa Insight** (example): ~50 input + 50 output tokens = $0.001 per request
- **Monthly cost** for 1000 insights/day: ~$30

### Best Practices to Minimize Costs
1. Set appropriate `maxTokens` limits
2. Cache common responses
3. Use temperature=0 for consistent outputs (can cache)
4. Monitor usage via Anthropic Console

## Error Handling

### Common Errors

**1. API Key Not Set**
```json
{
  "success": false,
  "error": "ANTHROPIC_API_KEY environment variable not set"
}
```
**Solution:** Set the `ANTHROPIC_API_KEY` environment variable

**2. Invalid API Key**
```json
{
  "success": false,
  "error": "authentication_error: invalid x-api-key"
}
```
**Solution:** Verify your API key is correct (starts with `sk-ant-`)

**3. Rate Limit**
```json
{
  "success": false,
  "error": "rate_limit_error: Rate limit exceeded"
}
```
**Solution:** Implement request queuing or upgrade your Anthropic plan

**4. Overloaded**
```json
{
  "success": false,
  "error": "overloaded_error: Temporarily overloaded"
}
```
**Solution:** Retry with exponential backoff

## Security Best Practices

1. **Never commit API keys** - Add `.env` to `.gitignore`
2. **Use environment variables** - Never hardcode keys
3. **Rotate keys regularly** - Generate new keys periodically
4. **Monitor usage** - Check Anthropic Console for unusual activity
5. **Rate limiting** - Implement request throttling for production

## Production Deployment

### Docker
```dockerfile
# In your Dockerfile
ENV ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
```

```bash
# Run container
docker run -e ANTHROPIC_API_KEY='sk-ant-...' your-image
```

### Systemd Service
```ini
# /etc/systemd/system/messaway.service
[Service]
Environment="ANTHROPIC_API_KEY=sk-ant-your-key-here"
ExecStart=/usr/bin/java -jar /path/to/messaway.jar
```

### Kubernetes Secret
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: messaway-secrets
type: Opaque
stringData:
  anthropic-api-key: sk-ant-your-key-here
```

```yaml
# In your deployment
env:
  - name: ANTHROPIC_API_KEY
    valueFrom:
      secretKeyRef:
        name: messaway-secrets
        key: anthropic-api-key
```

## Troubleshooting

### AI service returns "not_configured"
1. Verify environment variable: `echo $ANTHROPIC_API_KEY`
2. Restart the backend server after setting the variable
3. Check server logs for initialization errors

### Slow responses
1. Reduce `maxTokens` to decrease generation time
2. Consider caching for frequently-asked questions
3. Check network connectivity to Anthropic API

### Unexpected outputs
1. Adjust `temperature` (lower = more deterministic)
2. Provide more specific `context` in the system message
3. Refine your `prompt` to be more explicit

## Future Features

Planned AI-powered features:
- 🤖 Smart task prioritization
- 📊 Automated weekly summaries
- 💡 Personalized organization tips
- 🎯 Predictive task suggestions
- 📈 Progress trend analysis

## Support

- **Anthropic Docs**: https://docs.anthropic.com/
- **API Status**: https://status.anthropic.com/
- **MessAway Issues**: https://github.com/Site-TI-II/mess-away/issues

## License

This integration uses the Anthropic Claude API under their [Terms of Service](https://www.anthropic.com/legal/terms).
