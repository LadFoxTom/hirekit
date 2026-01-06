# Environment Variables for Agent System

Add these environment variables to your `.env` file to enable the multi-agent AI system:

## Job Board API (Adzuna)

Get your credentials at: https://developer.adzuna.com/

```bash
ADZUNA_APP_ID=your_adzuna_app_id_here
ADZUNA_API_KEY=your_adzuna_api_key_here
```

### About Adzuna
- Free tier: 5,000 API calls per month
- Provides job listings from various sources
- Supports multiple countries (US, UK, etc.)
- No credit card required for free tier

## OpenAI Configuration

The agent system uses OpenAI GPT-4 for intelligent analysis. Ensure you have:

```bash
OPENAI_API_KEY=sk-proj-your_openai_api_key_here
OPENAI_MODEL=gpt-4-turbo-preview
```

## Notes
- The agent system will gracefully degrade if APIs are unavailable
- Rate limiting is implemented to control costs
- All existing environment variables remain unchanged
- Agent features are additive to existing CV builder functionality













