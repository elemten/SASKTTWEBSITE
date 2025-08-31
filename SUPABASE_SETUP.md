# Supabase Authentication Setup

## Environment Variables

Create a `.env.local` file in the root of your project with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Admin Email Allowlist
NEXT_PUBLIC_ADMIN_EMAILS=admin@tts.ca,another@domain.tld
```

## Getting Supabase Credentials

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Go to Project Settings → API
3. Copy the Project URL and anon/public key
4. For the service role key, go to Project Settings → API → Service Role Key

## Email Allowlist

The `NEXT_PUBLIC_ADMIN_EMAILS` variable contains a comma-separated list of email addresses that are allowed to access the admin panel. Only users with these email addresses will be granted access after authentication.

## Supabase Configuration

### Authentication Providers

The app supports:
- Email/Password authentication
- Magic link authentication
- OAuth with GitHub and Google

### Database Setup

No database tables are required for basic authentication functionality. The app uses Supabase's built-in authentication system.

## Testing Authentication

1. Start the development server: `npm run dev`
2. Visit `/admin` - should redirect to `/auth/sign-in`
3. Try signing in with an email from the allowlist
4. After successful authentication, you should be redirected to the admin panel
5. Test the sign out functionality from the admin header

## Security Notes

- The service role key should never be exposed in client-side code
- Only use the anon key for client-side operations
- Regularly rotate your keys in production
- Consider implementing additional security measures for production use
