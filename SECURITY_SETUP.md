# Security Setup Guide

## ⚠️ CRITICAL: Environment Variables Required

Your application requires the following environment variables to be set securely:

### For Supabase Edge Functions (Google Calendar Integration)

Set these in your Supabase dashboard under Settings > Edge Functions > Environment Variables:

```
GOOGLE_CALENDAR_ID=your_google_calendar_id_here
GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account_email_here
GOOGLE_PRIVATE_KEY=your_private_key_here
ADMIN_EMAIL=your_admin_email_here
```

### For Frontend Application

Set these in your deployment platform (Vercel, Netlify, etc.):

```
VITE_SUPABASE_URL=your_supabase_project_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### For Supabase Database Functions

Set these in your Supabase dashboard under Settings > Database > Custom Config:

```
app.google_calendar_id=your_google_calendar_id_here
app.google_service_account_email=your_service_account_email_here
app.google_private_key=your_private_key_here
app.admin_email=your_admin_email_here
```

## Security Notes

1. **NEVER** commit actual secret keys to your repository
2. **ALWAYS** use environment variables for sensitive data
3. **REGULARLY** rotate your API keys and secrets
4. **MONITOR** your Google Cloud Console for unauthorized access
5. **REVOKE** the exposed service account key immediately and create a new one

## Immediate Actions Required

1. Go to Google Cloud Console
2. Navigate to IAM & Admin > Service Accounts
3. Find the service account: `ttsask-calendar-booking@n8nworkflows-469621.iam.gserviceaccount.com`
4. **DELETE** the exposed key immediately
5. Create a new key and update your environment variables
6. Monitor for any unauthorized access

## Files Modified

- `supabase/functions/google-calendar/index.ts` - Now uses environment variables
- `supabase-google-calendar-function.sql` - Now uses database settings
- All hardcoded secrets have been removed
