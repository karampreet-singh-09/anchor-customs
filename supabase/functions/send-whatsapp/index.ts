import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { phone, customerName, orderTotal } = await req.json()
    
    const msg91AuthKey = Deno.env.get('MSG91_AUTH_KEY');
    // Ensure you add MSG91_WHATSAPP_NUMBER in your Supabase secrets
    // This is the number provided by MSG91 that you send messages from.
    const msg91WhatsappNumber = Deno.env.get('MSG91_WHATSAPP_NUMBER') || '91XXXXXXXXXX'; 
    
    if (!msg91AuthKey) {
      console.log("MSG91_AUTH_KEY is missing. Skipping actual WhatsApp message.");
      return new Response(JSON.stringify({ success: true, message: "Simulated WhatsApp message (API key missing)" }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    // MSG91 WhatsApp API Payload
    // Adjust the "name" to match your approved WhatsApp template in MSG91
    // The components section maps to the {{1}}, {{2}} variables in your template
    const whatsappPayload = {
      "integrated-number": msg91WhatsappNumber,
      "content_type": "template",
      "payload": {
          "messaging_product": "whatsapp",
          "type": "template",
          "template": {
              "name": "order_confirmation",
              "language": {
                  "code": "en",
                  "policy": "deterministic"
              },
              "to_and_components": [
                  {
                      "to": [
                          phone.replace('+', '').trim() // Ensures format like 919876543210
                      ],
                      "components": {
                          "body_1": {
                              "type": "text",
                              "value": customerName || "Customer"
                          },
                          "body_2": {
                              "type": "text",
                              "value": orderTotal ? orderTotal.toString() : "your recent order"
                          }
                      }
                  }
              ]
          }
      }
    };

    const waResponse = await fetch('https://api.msg91.com/api/v5/whatsapp/whatsapp-outbound-message/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authkey': msg91AuthKey
      },
      body: JSON.stringify(whatsappPayload)
    });

    const waData = await waResponse.json();

    if (!waResponse.ok || waData.hasError) {
      throw new Error(`MSG91 WhatsApp API Error: ${JSON.stringify(waData)}`);
    }

    return new Response(JSON.stringify({ success: true, data: waData }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error("WhatsApp Send Error:", error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
