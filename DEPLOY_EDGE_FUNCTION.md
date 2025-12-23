# How to Deploy the SPED Invoice PDF Edge Function

There are two main ways to deploy Supabase Edge Functions:

## Option 1: Using Supabase CLI (Recommended)

### Step 1: Install Supabase CLI

**On macOS (using Homebrew):**
```bash
brew install supabase/tap/supabase
```

**On macOS/Linux (using npm):**
```bash
npm install -g supabase
```

**On Windows (using Scoop):**
```bash
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

**Or download directly:**
Visit https://github.com/supabase/cli/releases and download the binary for your OS.

### Step 2: Login to Supabase

```bash
supabase login
```

This will open your browser to authenticate.

### Step 3: Link Your Project

```bash
supabase link --project-ref your-project-ref
```

You can find your project ref in your Supabase Dashboard URL:
- Dashboard URL: `https://supabase.com/dashboard/project/yzwdmqapoguzcpclpbwo`
- Project ref: `yzwdmqapoguzcpclpbwo`

Or you can link interactively:
```bash
supabase link
```

### Step 4: Deploy the Function

```bash
supabase functions deploy sped-invoice-pdf
```

If you need to deploy to a specific project:
```bash
supabase functions deploy sped-invoice-pdf --project-ref yzwdmqapoguzcpclpbwo
```

### Step 5: Verify Deployment

After deployment, you should see:
```
Deploying function sped-invoice-pdf...
Function deployed successfully!
```

You can verify in your Supabase Dashboard:
1. Go to Edge Functions
2. You should see `sped-invoice-pdf` listed

---

## Option 2: Using Supabase Dashboard (Manual Upload)

### Step 1: Prepare the Function

Make sure your function is in `supabase/functions/sped-invoice-pdf/index.ts`

### Step 2: Create a ZIP file

On macOS/Linux:
```bash
cd supabase/functions/sped-invoice-pdf
zip -r sped-invoice-pdf.zip .
```

On Windows (PowerShell):
```powershell
cd supabase/functions/sped-invoice-pdf
Compress-Archive -Path * -DestinationPath sped-invoice-pdf.zip
```

### Step 3: Upload via Dashboard

1. Go to your Supabase Dashboard
2. Navigate to **Edge Functions**
3. Click **Create a new function**
4. Name it: `sped-invoice-pdf`
5. Upload the ZIP file
6. Click **Deploy**

---

## Option 3: Using Supabase Dashboard (GitHub Integration)

If your project is connected to GitHub:

1. Push your code to GitHub (including the `supabase/functions/sped-invoice-pdf/` folder)
2. Go to Supabase Dashboard → Edge Functions
3. Enable GitHub integration if not already enabled
4. Functions will auto-deploy on push

---

## Troubleshooting

### Function not found after deployment

Make sure the function file is at:
```
supabase/functions/sped-invoice-pdf/index.ts
```

### Authentication errors

Make sure you're logged in:
```bash
supabase login
```

### Project not linked

Link your project:
```bash
supabase link --project-ref your-project-ref
```

### Check function logs

```bash
supabase functions logs sped-invoice-pdf
```

Or view in Dashboard → Edge Functions → sped-invoice-pdf → Logs

---

## Testing the Function

After deployment, you can test it from your Finance page:

1. Navigate to `/admin/finance`
2. Select a month
3. Click "Load Invoices"
4. Click "Download PDF" for any school

Or test directly via curl:
```bash
curl -X POST \
  'https://yzwdmqapoguzcpclpbwo.supabase.co/functions/v1/sped-invoice-pdf' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "monthStart": "2025-01-01",
    "schoolSystem": "Catholic",
    "schoolName": "Test School"
  }'
```

---

## Environment Variables

The function uses these environment variables (set in Supabase Dashboard):
- `SUPABASE_URL` - Automatically available
- `SUPABASE_SERVICE_ROLE_KEY` - Automatically available

No additional configuration needed!

