// Test script to verify Edge Function is working
// Run this in your browser console on the SPED page

async function testEdgeFunction() {
  console.log('Testing Edge Function...');
  
  try {
    // Test the getSlots action
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

// Run the test
testEdgeFunction();
