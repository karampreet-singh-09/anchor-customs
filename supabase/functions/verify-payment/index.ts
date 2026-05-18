import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { HmacSha256 } from "https://deno.land/std@0.160.0/hash/sha256.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = await req.json()

    // 1. Verify the signature securely on the backend
    const secret = Deno.env.get('RAZORPAY_KEY_SECRET')
    if (!secret) throw new Error("RAZORPAY_KEY_SECRET not set in Supabase")

    const data = razorpay_order_id + "|" + razorpay_payment_id
    const generated_signature = new HmacSha256(secret).update(data).toString()

    if (generated_signature !== razorpay_signature) {
      console.error("Signature mismatch! Potential fraud detected.")
      throw new Error("Invalid payment signature")
    }

    console.log("✓ Signature Verified for Order:", order_id);

    // 2. Connect to Supabase with Service Role (Admin)
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 3. Update order status to 'paid'
    const { data: order, error } = await supabase
      .from('orders')
      .update({ 
        status: 'paid',
        payment_id: razorpay_payment_id,
        updated_at: new Date().toISOString()
      })
      .eq('id', order_id)
      .select('customer_details, items')
      .single()

    if (error) throw error

    // 4. Send WhatsApp Confirmation Message
    try {
      if (order && order.customer_details && order.customer_details.whatsapp) {
        const phone = order.customer_details.whatsapp;
        const name = order.customer_details.name || 'Customer';
        
        // Example integration for Interakt WhatsApp API
        // Ensure you add INTERAKT_API_KEY to your Supabase Edge Function Secrets
        const interaktKey = Deno.env.get('INTERAKT_API_KEY');
        
        if (interaktKey) {
          const whatsappPayload = {
            countryCode: "+91",
            phoneNumber: phone.replace('+91', '').trim(),
            callbackData: "order_confirmation",
            type: "Template",
            template: {
              name: "order_confirmation", // Replace with your approved template name
              languageCode: "en",
              bodyValues: [
                name,
                order_id
              ]
            }
          };

          const waResponse = await fetch('https://api.interakt.ai/v1/public/message/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Basic ${interaktKey}`
            },
            body: JSON.stringify(whatsappPayload)
          });
          
          if (!waResponse.ok) {
            console.error("WhatsApp API Error:", await waResponse.text());
          } else {
            console.log("✓ WhatsApp confirmation sent to", phone);
          }
        } else {
          console.log("⚠️ INTERAKT_API_KEY not set. Skipping WhatsApp message.");
        }
      }
    } catch (waError) {
      console.error("Failed to send WhatsApp message:", waError.message);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error("Verification Error:", error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
