# Fix 404 Error for sped-invoice-pdf Function

## The Problem
You're getting a 404 error, which means the Edge Function `sped-invoice-pdf` is not found or not deployed.

## Quick Fix Steps

### Step 1: Verify Function Exists
1. Go to Supabase Dashboard: https://supabase.com/dashboard/project/yzwdmqapoguzcpclpbwo
2. Click **"Edge Functions"** in the left sidebar
3. Check if `sped-invoice-pdf` is listed there

### Step 2: If Function Doesn't Exist
You need to deploy it. You have two options:

#### Option A: Deploy via Dashboard (Easiest)
1. In Edge Functions page, click **"Create a new function"**
2. Name it exactly: `sped-invoice-pdf` (must match exactly, case-sensitive)
3. Copy the code from `supabase/functions/sped-invoice-pdf/index.ts`
4. Paste it into the editor
5. Click **"Deploy"**

#### Option B: Deploy via CLI
```bash
supabase functions deploy sped-invoice-pdf --project-ref yzwdmqapoguzcpclpbwo
```

### Step 3: Verify Function is Working
After deployment, test it:

1. Go to Edge Functions → `sped-invoice-pdf` → **"Invoke"** tab
2. Use this test payload:
```json
{
  "monthStart": "2025-11-01",
  "schoolSystem": "Catholic",
  "schoolName": "Test School"
}
```
3. Click **"Invoke"**
4. You should see a response with a `pdf` field (base64 string)

### Step 4: Check Function Logs
If it still doesn't work:
1. Go to Edge Functions → `sped-invoice-pdf` → **"Logs"** tab
2. Try downloading a PDF again
3. Check the logs for any errors

## Common Issues

### Issue: Function name mismatch
- Make sure the function name is exactly `sped-invoice-pdf` (lowercase, with hyphens)
- Check in your code: `supabase.functions.invoke('sped-invoice-pdf', ...)`

### Issue: Function not deployed
- The function must be deployed to be accessible
- Check the Edge Functions list in dashboard

### Issue: Import errors
- Make sure you used the updated code with `esm.sh` import (not `cdn.skypack.dev`)
- The import should be: `import { PDFDocument, rgb, StandardFonts } from 'https://esm.sh/pdf-lib@1.17.1';`

## Test the Function Directly

You can test if the function is accessible by running this in your browser console:

```javascript
async function testInvoiceFunction() {
  const response = await fetch('https://yzwdmqapoguzcpclpbwo.supabase.co/functions/v1/sped-invoice-pdf', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6d2RtcWFwb2d1emNwY2xwYndvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyNzE3MjQsImV4cCI6MjA3MTg0NzcyNH0.19M99UVERejHdnmG7eiHvONYnQoe22EF6JqA39fjYzw'
    },
    body: JSON.stringify({
      monthStart: "2025-11-01",
      schoolSystem: "Catholic",
      schoolName: "Test School"
    })
  });
  
  console.log('Status:', response.status);
  const data = await response.json();
  console.log('Response:', data);
}

testInvoiceFunction();
```

If you get a 404, the function is not deployed.
If you get a 200, the function is working!

