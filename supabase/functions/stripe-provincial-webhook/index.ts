// Supabase Edge Function to handle Stripe webhooks for provincial membership payments
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get Stripe webhook secret from environment
    const stripeWebhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')
    if (!stripeWebhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET not configured')
    }

    // Get the raw body for signature verification
    const body = await req.text()
    const signature = req.headers.get('stripe-signature')

    if (!signature) {
      throw new Error('No Stripe signature found')
    }

    // For now, we'll skip signature verification in development
    // In production, you should verify the webhook signature
    console.log('Received Stripe webhook:', signature)

    // Parse the webhook event
    const event = JSON.parse(body)
    console.log('Webhook event type:', event.type)

    // Handle checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      console.log('Processing completed checkout session:', session.id)

      // Extract member information from client_reference_id
      const memberNumber = session.client_reference_id
      if (!memberNumber) {
        throw new Error('No client_reference_id found in session')
      }

      // Get current membership year (Sept-Aug cycle)
      const now = new Date()
      const currentYear = now.getFullYear()
      const currentMonth = now.getMonth() + 1 // getMonth() returns 0-11
      const membershipYear = currentMonth >= 9 ? currentYear : currentYear - 1

      // Calculate membership period
      const validFrom = `${membershipYear}-09-01`
      const validUntil = `${membershipYear + 1}-08-31`

      // Initialize Supabase client
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      const supabase = createClient(supabaseUrl, supabaseServiceKey)

      // Insert payment record
      const { data: paymentData, error: paymentError } = await supabase
        .from('provincial_payments')
        .insert({
          member_id: memberNumber,
          stripe_payment_intent_id: session.payment_intent,
          stripe_session_id: session.id,
          stripe_customer_id: session.customer,
          amount_paid: session.amount_total / 100, // Convert cents to dollars
          currency: session.currency.toUpperCase(),
          payment_status: 'completed',
          membership_year: membershipYear,
          valid_from: validFrom,
          valid_until: validUntil,
          payment_method: 'card', // Stripe checkout is typically card
          stripe_receipt_url: session.receipt_url,
          paid_at: new Date().toISOString(),
        })

      if (paymentError) {
        console.error('Error inserting payment record:', paymentError)
        throw paymentError
      }

      console.log('Payment record created:', paymentData)

      // Update member status in all_members table
      const { data: memberData, error: memberError } = await supabase
        .from('all_members')
        .update({
          provincial_paid_year: membershipYear,
          is_active_member: true,
          current_membership_status: 'active',
          last_payment_date: new Date().toISOString().split('T')[0], // Date only
          membership_expires_at: validUntil,
          updated_at: new Date().toISOString(),
        })
        .eq('mem_number', memberNumber)

      if (memberError) {
        console.error('Error updating member status:', memberError)
        throw memberError
      }

      console.log('Member status updated:', memberData)

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Payment processed successfully',
          member_id: memberNumber,
          membership_year: membershipYear,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    // For other event types, just acknowledge receipt
    return new Response(
      JSON.stringify({ received: true, event_type: event.type }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})