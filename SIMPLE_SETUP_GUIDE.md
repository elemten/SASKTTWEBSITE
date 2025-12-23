# Simple Setup Guide - SPED Invoicing

## What You Need to Do (2 Simple Steps)

You need to add 2 things to your Supabase project:

1. **A Database Function** (to group bookings by school)
2. **An Edge Function** (to create PDF invoices)

---

## Step 1: Add the Database Function

### What it does:
Groups all SPED bookings by school so you can see which schools need invoices.

### How to do it:

1. **Go to your Supabase Dashboard:**
   - Open: https://supabase.com/dashboard/project/yzwdmqapoguzcpclpbwo
   - (Or go to supabase.com → Your Project)

2. **Click on "SQL Editor"** (in the left sidebar)

3. **Click "New Query"** (top right)

4. **Copy and paste this entire code:**

```sql
CREATE OR REPLACE FUNCTION get_sped_invoice_headers(month_start date)
RETURNS TABLE (
  school_system text,
  school_name text,
  booking_count bigint,
  total_cost numeric
) 
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(cb.school_system, 'Other')::text as school_system,
    cb.school_name::text,
    COUNT(*)::bigint as booking_count,
    SUM(cb.total_cost)::numeric as total_cost
  FROM confirmed_bookings cb
  WHERE 
    DATE_TRUNC('month', cb.booking_date) = DATE_TRUNC('month', month_start)
    AND cb.status IN ('confirmed', 'completed')
  GROUP BY cb.school_system, cb.school_name
  ORDER BY cb.school_system, cb.school_name;
END;
$$;
```

5. **Click "Run"** (or press Cmd+Enter)

6. **You should see:** "Success. No rows returned"

✅ **Done!** The function is now in your database.

---

## Step 2: Add the Edge Function (PDF Generator)

### What it does:
Creates PDF invoices when you click "Download PDF" on the Finance page.

### How to do it:

#### Option A: Using Terminal (Easiest)

1. **Open Terminal** (on your Mac)

2. **Go to your project folder:**
   ```bash
   cd /Users/huzai/Desktop/Website/sask-ping-shine-main
   ```

3. **Login to Supabase:**
   ```bash
   supabase login
   ```
   - This will open your browser
   - Click "Authorize" in the browser
   - Come back to terminal

4. **Link your project:**
   ```bash
   supabase link --project-ref yzwdmqapoguzcpclpbwo
   ```

5. **Deploy the function:**
   ```bash
   supabase functions deploy sped-invoice-pdf
   ```

6. **Wait for it to finish** - you'll see "Function deployed successfully!"

✅ **Done!** The PDF generator is now live.

---

#### Option B: Using Supabase Dashboard (If Terminal doesn't work)

1. **Go to Supabase Dashboard:**
   - https://supabase.com/dashboard/project/yzwdmqapoguzcpclpbwo

2. **Click "Edge Functions"** (in left sidebar)

3. **Click "Create a new function"**

4. **Name it:** `sped-invoice-pdf`

5. **Copy the code from:** `supabase/functions/sped-invoice-pdf/index.ts`

6. **Paste it into the editor**

7. **Click "Deploy"**

✅ **Done!**

---

## Testing It

1. **Go to your website:** `/admin/finance`
2. **Select a month** from the dropdown
3. **Click "Load Invoices"**
4. **You should see schools listed**
5. **Click "Download PDF"** on any school
6. **A PDF should download!**

---

## Troubleshooting

### "Function not found" error?
- Make sure you ran Step 1 (the SQL function)
- Wait a few seconds and try again

### "No bookings found"?
- That's normal if there are no bookings for that month
- Try a different month

### PDF doesn't download?
- Check the browser console for errors (F12)
- Make sure Step 2 (Edge Function) was deployed successfully

---

## Need Help?

If something doesn't work:
1. Check the browser console (F12 → Console tab)
2. Check Supabase Dashboard → Edge Functions → Logs
3. Make sure both steps above are completed

