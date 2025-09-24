import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PaymentRequest {
  member_id: string;
  email: string;
  name: string;
  amount: number;
  membership_year: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { member_id, email, name, amount, membership_year }: PaymentRequest = await req.json();

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get current membership year dates
    const validFrom = `${membership_year}-09-01`;
    const validUntil = `${membership_year + 1}-08-31`;

    // Check if member already has a pending or completed payment for this year
    const { data: existingPayment } = await supabase
      .from('provincial_payments')
      .select('id, payment_status')
      .eq('member_id', member_id)
      .eq('membership_year', membership_year)
      .in('payment_status', ['pending', 'completed'])
      .single();

    if (existingPayment) {
      if (existingPayment.payment_status === 'completed') {
        return new Response(
          JSON.stringify({ error: 'Member already has active provincial membership for this year' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      // If pending, we can continue with creating a new Stripe session
    }

    // Create Stripe checkout session
    const stripeResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('STRIPE_SECRET_KEY')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'payment_method_types[0]': 'card',
        'line_items[0][price_data][currency]': 'cad',
        'line_items[0][price_data][product_data][name]': `Table Tennis Saskatchewan Provincial Membership ${membership_year}-${membership_year + 1}`,
        'line_items[0][price_data][product_data][description]': `Annual provincial membership for ${name} (Member ID: ${member_id})`,
        'line_items[0][price_data][unit_amount]': (amount * 100).toString(), // Convert to cents
        'line_items[0][quantity]': '1',
        'mode': 'payment',
        'success_url': `${req.headers.get('origin')}/training-signup?success=provincial&session_id={CHECKOUT_SESSION_ID}`,
        'cancel_url': `${req.headers.get('origin')}/training-signup?canceled=true`,
        'customer_email': email,
        'metadata[member_id]': member_id,
        'metadata[membership_year]': membership_year.toString(),
        'metadata[payment_type]': 'provincial_membership',
        'payment_intent_data[metadata][member_id]': member_id,
        'payment_intent_data[metadata][membership_year]': membership_year.toString(),
        'payment_intent_data[metadata][payment_type]': 'provincial_membership',
      }),
    });

    if (!stripeResponse.ok) {
      const error = await stripeResponse.text();
      console.error('Stripe error:', error);
      throw new Error(`Stripe error: ${error}`);
    }

    const session = await stripeResponse.json();

    // Create pending payment record in database
    const { error: dbError } = await supabase
      .from('provincial_payments')
      .insert({
        member_id,
        stripe_payment_intent_id: session.payment_intent || `temp_${session.id}`, // Temporary until webhook updates
        stripe_session_id: session.id,
        amount_paid: amount,
        currency: 'CAD',
        payment_status: 'pending',
        membership_year,
        valid_from: validFrom,
        valid_until: validUntil,
        payment_method: 'card',
      });

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error(`Database error: ${dbError.message}`);
    }

    return new Response(
      JSON.stringify({ 
        checkout_url: session.url,
        session_id: session.id 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error creating provincial payment:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to create payment session',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
