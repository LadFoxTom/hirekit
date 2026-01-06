# Job Search Setup Guide

## Current Status

The job search functionality has been fully implemented with smart LLM-powered reasoning, but **it requires Adzuna API credentials to work**. Without valid API keys, the system will not return any job results.

## What Was Fixed

### 1. ✅ Attachment Button on Split Screen
- Added `z-index:10` to ensure the attachment button is clickable in split-screen mode
- Ensured file input ref is properly available in both view modes
- Button now works correctly when the editor panel is visible

### 2. ✅ Comprehensive Logging for Job Search
- Added detailed logging to trace the entire job search flow
- Logs include:
  - Query parameters sent to Adzuna API
  - Country code detection
  - API response status and result counts
  - Error details when API calls fail
  - LLM reasoning process

### 3. ✅ Updated Environment Configuration
- Added Adzuna API credentials to `env.example`
- Included setup instructions and API documentation link

## Why Job Search Returns No Results

The job search agent is not returning results because **Adzuna API credentials are not configured**. The system needs:

1. **ADZUNA_APP_ID** - Your Adzuna application ID
2. **ADZUNA_API_KEY** - Your Adzuna API key

## How to Fix Job Search

### Step 1: Get Adzuna API Credentials

1. Go to [https://developer.adzuna.com/](https://developer.adzuna.com/)
2. Sign up for a free developer account
3. Create a new application
4. You'll receive:
   - An **App ID** (format: `12345678`)
   - An **API Key** (format: `abc123def456...`)

### Step 2: Configure Environment Variables

#### For Local Development:
Add these to your `.env` file:
```bash
ADZUNA_APP_ID="your_app_id_here"
ADZUNA_API_KEY="your_api_key_here"
```

#### For Vercel Production:
1. Go to your Vercel project settings
2. Navigate to **Environment Variables**
3. Add:
   - `ADZUNA_APP_ID` with your app ID
   - `ADZUNA_API_KEY` with your API key
4. Redeploy the application

### Step 3: Verify Setup

After adding the credentials, check the server logs when making a job search request. You should see:

```
[Smart Job Search] Using LLM to analyze request...
[Smart Job Search] LLM Analysis: {...}
[Adzuna] Searching: { url: '...', query: '...', location: '...', countryCode: 'nl' }
[Adzuna] API Response: { count: 150, results: 20, query: '...', location: '...' }
```

If you see errors like:
```
[Adzuna] Missing API credentials
```
Then the environment variables are not properly set.

## Alternative: Enable Test Mode (For Development Only)

If you want to test the UI without real API credentials, you can modify the code to enable mock jobs:

In `src/app/api/cv-chat-agent/stream/route.ts` (line ~556), change:
```typescript
const jobs = await searchAdzuna(query, location || '', false); // false = no mocks
```
to:
```typescript
const jobs = await searchAdzuna(query, location || '', true); // true = enable mocks
```

**⚠️ Warning:** This is only for testing. Mock jobs are not real and should not be used in production.

## Current Implementation Features

The job search agent has the following capabilities:

### 🤖 Smart LLM Reasoning
- Uses OpenAI GPT-4 to understand natural language queries
- Extracts job titles, locations, and skills from user messages
- Generates multiple search query variations (primary + alternatives)
- Provides reasoning for why it chose specific search terms

### 🔍 Multi-Strategy Search
1. **Primary search**: Uses the most specific query
2. **Alternative searches**: Tries broader queries if primary fails
3. **Keyword fallback**: Tries main keywords only
4. **Location-agnostic search**: Removes location constraint if no results
5. **Intelligent ranking**: Ranks jobs by CV match when CV data is available

### 💡 Context-Aware Behavior
- Uses CV data (skills, experience, location) when available
- Allows manual parameter specification without CV
- Provides helpful suggestions when no results are found
- Never claims it cannot search for jobs (fixed in latest update)

### 🎯 Job Matching
- Calculates match scores based on CV data
- Identifies matching keywords between CV and job description
- Provides match reasoning for each job
- Ranks jobs by compatibility

## Testing Checklist

Once Adzuna API credentials are configured:

- [ ] Test: "Find software developer jobs in Amsterdam"
- [ ] Test: "Search for jobs in Breda" (should ask for more details)
- [ ] Test: "Find jobs matching my skills" (with CV uploaded)
- [ ] Test: "Find jobs matching my skills" (without CV)
- [ ] Test: "Try searching in nearby cities" (follow-up after no results)
- [ ] Verify: Attachment button works in split-screen mode
- [ ] Verify: Jobs are displayed in JobSwiper component
- [ ] Verify: Match scores are calculated when CV is available

## Debugging

If job search still doesn't work after adding credentials:

1. **Check environment variables are loaded:**
   ```bash
   # In Vercel logs or local terminal
   console.log('ADZUNA_APP_ID:', process.env.ADZUNA_APP_ID ? 'SET' : 'NOT SET');
   ```

2. **Check API response in logs:**
   Look for `[Adzuna] API Response:` in the logs

3. **Verify country code detection:**
   The system auto-detects country from location:
   - "Amsterdam" → "nl" (Netherlands)
   - "London" → "gb" (Great Britain)
   - "Berlin" → "de" (Germany)
   - Default → "us" (United States)

4. **Test API directly:**
   ```bash
   curl "https://api.adzuna.com/v1/api/jobs/nl/search/1?app_id=YOUR_APP_ID&app_key=YOUR_API_KEY&what=developer&where=amsterdam"
   ```

## Files Modified

- `src/app/api/cv-chat-agent/stream/route.ts` - Streaming chat agent with job search
- `src/app/api/cv-chat-agent/route.ts` - Non-streaming chat agent with job search
- `src/app/page.tsx` - Fixed attachment button z-index for split screen
- `env.example` - Added Adzuna API credentials template

## Next Steps

1. **Immediate:** Add Adzuna API credentials to Vercel environment variables
2. **Test:** Verify job search works with real queries
3. **Monitor:** Check logs for any API errors or rate limiting issues
4. **Optional:** Consider adding other job search APIs (Indeed, LinkedIn) as fallbacks
5. **Optional:** Implement job result caching to reduce API calls

## Support

If you continue to experience issues:
1. Check Vercel deployment logs for any errors
2. Verify environment variables are set correctly
3. Test the Adzuna API directly with curl to ensure credentials work
4. Check if you've hit any API rate limits (Adzuna free tier has limits)

