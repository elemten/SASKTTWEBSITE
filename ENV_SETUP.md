# Environment Variables Setup

## Quick Start

1. **Create `.env.local` file** (copy from template below):
   ```bash
   cp .env.example .env.local
   # Or create manually
   ```

2. **Fill in your values** in `.env.local`

3. **Source the file** before running commands:
   ```bash
   source .env.local
   ```

## Required Environment Variables

### Frontend Application

```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Admin Authentication (IMPORTANT: Use strong passwords!)
VITE_ADMIN_EMAIL=info@ttsask.ca
VITE_ADMIN_PASSWORD=your_secure_password_here
```

### Strix Security Testing

```bash
# LLM Provider (choose one)
STRIX_LLM=openai/gpt-5
# Or: STRIX_LLM=anthropic/claude-sonnet-4-5

# API Key for your chosen provider
LLM_API_KEY=your_llm_api_key_here

# Optional: For local LLM
# LLM_API_BASE=http://localhost:11434/v1

# Optional: For enhanced search
# PERPLEXITY_API_KEY=your_perplexity_api_key_here
```

### Supabase Edge Functions (Server-Side Only)

**⚠️ These should be set in Supabase Dashboard, NOT in .env.local**

Set these in: **Supabase Dashboard > Settings > Edge Functions > Environment Variables**

```bash
GOOGLE_CALENDAR_ID=your_google_calendar_id_here
GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account_email_here
GOOGLE_IMPERSONATED_USER_EMAIL=calendar_owner@yourdomain.com
GOOGLE_PRIVATE_KEY=your_private_key_here
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here
SUPABASE_URL=your_supabase_project_url_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

`GOOGLE_IMPERSONATED_USER_EMAIL` is optional. Use it only when the Google service account has domain-wide delegation and the impersonated mailbox has writer access to `GOOGLE_CALENDAR_ID`. Otherwise leave it unset and share the calendar directly with the service account email.

## Getting API Keys

### OpenAI (for Strix)
1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Copy and add to `LLM_API_KEY`

### Anthropic (alternative for Strix)
1. Go to https://console.anthropic.com/
2. Create a new API key
3. Set `STRIX_LLM=anthropic/claude-sonnet-4-5`

### Supabase Keys
1. Go to your Supabase project dashboard
2. Settings > API
3. Copy Project URL → `VITE_SUPABASE_URL`
4. Copy anon/public key → `VITE_SUPABASE_ANON_KEY`
5. Copy service_role key → Set in Supabase Dashboard (not .env.local)

## Security Notes

- ✅ `.env.local` is already in `.gitignore` - it won't be committed
- ✅ Never commit actual secrets to git
- ✅ Rotate passwords and API keys regularly
- ✅ Use different keys for development and production
- ⚠️ The old hardcoded password `ttsask2025` should be changed immediately

## GitHub Actions Secrets

For CI/CD, add these secrets in GitHub:
- `STRIX_LLM` (optional, defaults to openai/gpt-5)
- `LLM_API_KEY` (required)
- `VITE_SUPABASE_URL` (for building)
- `VITE_SUPABASE_ANON_KEY` (for building)

Go to: **Repository > Settings > Secrets and variables > Actions**

