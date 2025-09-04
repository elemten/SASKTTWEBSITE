# How to Verify Google Calendar API Integration

## 1. Check Browser Console
When you select a date on the SPED form, look for these logs:

### ✅ **Success Indicators:**
```
Fetching time slots for date: 2025-09-09
Edge function response: {data: {success: true, slots: [...]}, error: null}
Response status: true
Slots received: [{time: "09:00", display: "9:00 AM - 10:30 AM (1.5 hours)", available: true}, ...]
✅ Successfully received slots from API: [...]
```

### ❌ **Error Indicators:**
```
❌ Error fetching time slots: FunctionsFetchError: Failed to send a request to the Edge Function
🔄 Falling back to default slots...
📋 Using default slots: [...]
```

## 2. Test Edge Function Directly
Copy and paste this code in your browser console on the SPED page:

```javascript
async function testEdgeFunction() {
  console.log('Testing Edge Function...');
  
  try {
    const response = await fetch('https://yzwdmqapoguzcpclpbwo.supabase.co/functions/v1/google-calendar-function', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6d2RtcWFwb2d1emNwY2xwYndvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyNzE3MjQsImV4cCI6MjA3MTg0NzcyNH0.19M99UVERejHdnmG7eiHvONYnQoe22EF6JqA39fjYzw'
      },
      body: JSON.stringify({
        action: 'getSlots',
        date: '2025-09-09'
      })
    });
    
    const data = await response.json();
    console.log('Edge Function Response:', data);
    
    if (data.success && data.slots) {
      console.log('✅ Edge Function is working! Available slots:', data.slots);
    } else {
      console.log('❌ Edge Function returned error:', data.error);
    }
    
  } catch (error) {
    console.log('❌ Error calling Edge Function:', error);
  }
}

testEdgeFunction();
```

## 3. Check Supabase Dashboard
1. Go to Supabase Dashboard → Edge Functions → Logs
2. Look for function invocations
3. Check for any error messages

## 4. Verify Deployment
Make sure your Edge Function has the latest code from `supabase/functions/google-calendar/index-updated.ts`

## Current Status
- ✅ CORS headers fixed
- ✅ Function name corrected to 'google-calendar-function'
- ✅ Time slot format fixed
- ⏳ Need to verify Edge Function deployment
