/**
 * ANCHOR CUSTOMS - ORDER CONFIRMATION EMAIL SERVICE
 * 
 * =============================================================================
 * ENVIRONMENT VARIABLES SETUP:
 * 
 * 1. RESEND_API_KEY: Go to https://resend.com, sign up, get your API Key, and set it in Supabase:
 *    supabase secrets set RESEND_API_KEY=re_your_key_here
 * 
 * 2. SENDER_EMAIL (Optional): The email address to send from (must be verified in Resend).
 *    Default fallback is 'Anchor Customs <onboarding@resend.dev>'.
 *    Set it using:
 *    supabase secrets set SENDER_EMAIL="Anchor Customs <orders@yourdomain.com>"
 * 
 * 3. SUPABASE_URL & SUPABASE_SERVICE_ROLE_KEY: Automatically provided by Supabase Edge Functions runtime,
 *    used here to optionally verify authorization JWTs.
 * =============================================================================
 * 
 * =============================================================================
 * HOW TO TEST LOCALLY:
 * 
 * 1. Install Supabase CLI: https://supabase.com/docs/guides/cli
 * 2. Start local functions server:
 *    supabase functions serve --env-file .env
 * 3. Invoke locally using curl or Postman:
 *    curl -i --location --request POST 'http://localhost:54321/functions/v1/send-order-email' \
 *      --header 'Content-Type: application/json' \
 *      --data-raw '{
 *        "email": "test@example.com",
 *        "customerName": "John Doe",
 *        "orderIds": "ORDER-3422",
 *        "items": [{"id": "ORDER-3422", "name": "Classic Polaroid Magazine", "pages": 12, "price": 499}],
 *        "totalPrice": 499
 *      }'
 * =============================================================================
 * 
 * =============================================================================
 * HOW TO DEPLOY:
 * 
 * Run the following command using Supabase CLI to deploy this function:
 *    supabase functions deploy send-order-email
 * =============================================================================
 * 
 * =============================================================================
 * SCALABILITY & FUTURE INTEGRATIONS:
 * 
 * This endpoint is designed to be easily extensible:
 * - WhatsApp: Already triggered in checkout, but can be consolidated here using MSG91/Interakt APIs.
 * - Invoice PDFs: Can import a PDF generator (e.g. from esm.sh) and attach the PDF array buffer to Resend's payload.
 * - Shipping Updates: Triggered by database webhook on order status update ('shipped', 'delivered'), reusing the same template logic.
 * =============================================================================
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight options request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. Resolve environment variables
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!resendApiKey) {
      throw new Error("Missing RESEND_API_KEY environment variable in Supabase Secrets.")
    }

    // 2. Parse request payload
    const { email, customerName, orderIds, items, totalPrice, estimatedDelivery } = await req.json()

    if (!email || !items || !Array.isArray(items)) {
      throw new Error("Missing required fields: email or items array.")
    }

    // 3. User Authorization Check (Security verification via JWT)
    const authHeader = req.headers.get('Authorization')
    if (authHeader && supabaseUrl && supabaseServiceKey) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey)
      const token = authHeader.replace('Bearer ', '').trim()
      const { data: { user }, error: authError } = await supabase.auth.getUser(token)
      
      if (authError || !user) {
        console.warn("⚠️ JWT verification failed. Request is unauthorized.")
        return new Response(JSON.stringify({ error: "Unauthorized request" }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        })
      }
      
      console.log(`✓ Request authorized for user: ${user.email}`)
    } else {
      console.warn("⚠️ Authorization header or Supabase credentials missing. Proceeding with caution.")
    }

    // 4. Set estimated delivery message fallback
    const deliveryMessage = estimatedDelivery || "Your custom hand-crafted magazine will be printed and shipped. Expected delivery in 5-7 business days."

    // 5. Generate items HTML rows
    const itemsHtml = items.map(item => `
      <tr>
        <td style="padding: 15px 0; border-bottom: 1px solid rgba(175, 145, 112, 0.15);">
          <div style="font-size: 15px; font-weight: 600; color: #2C1A1E;">${item.name}</div>
          <div style="font-size: 13px; color: rgba(44, 26, 30, 0.6); margin-top: 4px;">ID: ${item.id} | Pages: ${item.pages}</div>
        </td>
        <td style="padding: 15px 0; text-align: right; font-size: 15px; font-weight: 600; color: #2C1A1E; border-bottom: 1px solid rgba(175, 145, 112, 0.15);">
          ₹${item.price}
        </td>
      </tr>
    `).join('')

    // 6. Modern Responsive HTML Email Template (Premium Editorial E-commerce Style)
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmed | Anchor Customs</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,700;0,900;1,400&display=swap');
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background-color: #FDF9F4;
      color: #2C1A1E;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    table {
      border-collapse: collapse;
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    img {
      border: 0;
      height: auto;
      line-height: 100%;
      outline: none;
      text-decoration: none;
    }
  </style>
</head>
<body style="background-color: #FDF9F4; font-family: 'Inter', sans-serif; margin: 0; padding: 0;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FDF9F4; padding: 40px 10px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border: 1px solid rgba(175, 145, 112, 0.25); border-radius: 20px; overflow: hidden; box-shadow: 0 15px 35px rgba(44, 26, 30, 0.04);">
          
          <!-- Editorial Header -->
          <tr>
            <td align="center" style="background-color: #1A2238; padding: 50px 40px; text-align: center;">
              <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 32px; font-weight: 900; color: #ffffff; letter-spacing: 0.5px; margin-bottom: 8px;">
                ANCHOR CUSTOMS
              </div>
              <div style="font-size: 11px; font-weight: 600; color: #AF9170; letter-spacing: 2px; text-transform: uppercase;">
                ORDER CONFIRMATION
              </div>
            </td>
          </tr>
          
          <!-- Email Content Body -->
          <tr>
            <td style="padding: 40px 40px 30px 40px;">
              <!-- Greeting -->
              <h1 style="font-family: 'Playfair Display', Georgia, serif; font-size: 24px; font-weight: 700; color: #1A2238; margin-top: 0; margin-bottom: 15px;">
                Thank you for your order, ${customerName}!
              </h1>
              <p style="font-size: 15px; line-height: 1.6; color: rgba(44, 26, 30, 0.8); margin-bottom: 30px;">
                Your request has been received and is currently being processed. Below are the details of your order. You can track its live status at any time from your customer dashboard.
              </p>
              
              <!-- Order Summary Card -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FDF9F4; border: 1px solid rgba(175, 145, 112, 0.22); border-radius: 12px; padding: 24px; margin-bottom: 30px;">
                <tr>
                  <td>
                    <!-- Card Title -->
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-bottom: 1px solid rgba(175, 145, 112, 0.25); padding-bottom: 12px; margin-bottom: 12px;">
                      <tr>
                        <td style="font-size: 12px; font-weight: 700; color: #AF9170; letter-spacing: 1.5px; text-transform: uppercase;">
                          ORDER DETAILS
                        </td>
                        <td align="right" style="font-size: 12px; font-weight: 600; color: rgba(44, 26, 30, 0.65);">
                          ID: ${orderIds}
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Items Table -->
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      ${itemsHtml}
                      
                      <!-- Total -->
                      <tr>
                        <td style="padding-top: 20px; font-size: 15px; font-weight: 700; text-transform: uppercase; color: #1A2238; letter-spacing: 0.5px;">
                          Total Price Paid
                        </td>
                        <td align="right" style="padding-top: 20px; font-size: 20px; font-weight: 900; color: #AF9170;">
                          ₹${totalPrice}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- Delivery Information -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-left: 3px solid #AF9170; padding-left: 18px; margin: 30px 0;">
                <tr>
                  <td>
                    <div style="font-size: 12px; font-weight: 700; color: #AF9170; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 6px;">
                      Estimated Delivery
                    </div>
                    <div style="font-size: 14px; line-height: 1.5; color: #2C1A1E; font-weight: 500;">
                      ${deliveryMessage}
                    </div>
                  </td>
                </tr>
              </table>
              
              <!-- Action Button -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 35px 0 15px 0;">
                <tr>
                  <td align="center">
                    <a href="https://anchorcustoms.in/dashboard" target="_blank" style="display: inline-block; background-color: #AF9170; color: #ffffff; font-size: 13px; font-weight: 700; text-decoration: none; padding: 16px 36px; border-radius: 30px; letter-spacing: 1.5px; text-transform: uppercase; box-shadow: 0 8px 20px rgba(175, 145, 112, 0.25);">
                      View Your Dashboard
                    </a>
                  </td>
                </tr>
              </table>
              
            </td>
          </tr>
          
          <!-- Premium Footer -->
          <tr>
            <td align="center" style="background-color: #FDF9F4; border-top: 1px solid rgba(175, 145, 112, 0.15); padding: 30px 40px; text-align: center;">
              <p style="font-size: 12px; line-height: 1.5; color: rgba(44, 26, 30, 0.55); margin: 0 0 8px 0;">
                If you have any questions or need to make changes to your customization details, please reach out to us at <a href="mailto:support@anchorcustoms.in" style="color: #AF9170; text-decoration: none; font-weight: 600;">support@anchorcustoms.in</a> or reply directly to this email.
              </p>
              <p style="font-size: 11px; color: rgba(44, 26, 30, 0.4); margin: 0;">
                &copy; 2026 Anchor Customs. All rights reserved.
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `

    // 7. Call Resend API to deliver the email
    const fromEmail = Deno.env.get('SENDER_EMAIL') || 'Anchor Customs <onboarding@resend.dev>'
    
    console.log(`Sending email from ${fromEmail} to ${email} via Resend...`)
    
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [email],
        subject: `Order Confirmed: ${orderIds} | Anchor Customs`,
        html: htmlContent,
      }),
    })

    const resendData = await resendResponse.json()

    if (!resendResponse.ok) {
      console.error("Resend API returned error status:", resendResponse.status, resendData)
      throw new Error(`Resend API Error: ${resendData.message || JSON.stringify(resendData)}`)
    }

    console.log("✓ Email sent successfully via Resend. ID:", resendData.id)

    return new Response(JSON.stringify({ success: true, id: resendData.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error("Email Sending Function Error:", error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
