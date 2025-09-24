// Simple webhook handler for provincial membership payments
// This can be deployed as a Supabase Edge Function or Vercel function

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const event = req.body;
    
    // Handle successful checkout
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      
      // Extract customer info
      const customerEmail = session.customer_details?.email;
      const customerName = session.customer_details?.name;
      
      if (customerEmail) {
        // Update member status in your database
        // This would connect to your Supabase and update the all_members table
        console.log(`Provincial membership payment completed for: ${customerEmail}`);
        
        // You can add database update logic here
        // await updateMemberStatus(customerEmail, currentYear);
      }
    }
    
    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({ error: 'Webhook error' });
  }
}
