# How to Test the sped-invoice-pdf Function Correctly

## ✅ Good News!
The function IS working! The 404 you saw is from the function's logic (no bookings found), not a deployment error.

## The Problem with Your Test
You tested with:
- `monthStart: "2023-11-01"` (year 2023)
- `schoolName: "Test School"` (doesn't exist)

But your actual bookings are probably in **2025** with real school names.

## How to Get Real Test Data

### Step 1: Find Real School Names
1. Go to your Finance page: `/admin/finance`
2. Select **November 2025** (or any month that shows invoices)
3. Click "Load Invoices"
4. You'll see real school names listed

### Step 2: Use Real Data in Test
Go back to Supabase Dashboard → Edge Functions → `sped-invoice-pdf` → Test tab

Use a payload with **real data** from your invoices:

```json
{
  "monthStart": "2025-11-01",
  "schoolSystem": "Catholic",
  "schoolName": "ACTUAL_SCHOOL_NAME_HERE"
}
```

Replace `ACTUAL_SCHOOL_NAME_HERE` with a real school name from your invoice list.

### Step 3: Test Again
Click "Invoke" and you should get:
- **Status: 200** ✅
- **Response:** JSON with a `pdf` field (base64 string)

## Example with Real Data
If you see "Holy Cross" in your November invoices, use:

```json
{
  "monthStart": "2025-11-01",
  "schoolSystem": "Catholic",
  "schoolName": "Holy Cross"
}
```

## If You Still Get 404
1. Check the school name matches **exactly** (case-sensitive)
2. Check the month has bookings with status `'confirmed'` or `'completed'`
3. Check the `school_system` matches exactly: "Catholic" or "Saskatoon Public"

## Once Test Works
If the test returns a 200 with PDF data, then the function is working perfectly! The issue might be in how the frontend calls it. Try downloading from the Finance page again and check the console logs.

