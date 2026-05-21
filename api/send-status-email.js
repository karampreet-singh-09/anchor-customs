export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { email, customerName, orderId, templateName, status } = req.body;

  if (!email || !orderId || !status) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  let statusMessage = '';
  switch (status) {
    case 'received':
      statusMessage = 'We have successfully received your order and it is now being processed.';
      break;
    case 'printing':
      statusMessage = 'Your magazine is currently in the printing phase! It will be ready soon.';
      break;
    case 'shipped':
      statusMessage = 'Great news! Your order has been shipped and is on its way to you.';
      break;
    case 'delivered':
      statusMessage = 'Your order has been delivered! We hope you love your custom magazine. Thank you for choosing Anchor Customs!';
      break;
    default:
      statusMessage = `The status of your order has been updated to: ${status}.`;
  }

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h2 style="color: #1a2238;">Order Status Update</h2>
      <p>Hello ${customerName || 'Customer'},</p>
      <p>Here is an update regarding your order <strong>${orderId}</strong> for <strong>${templateName}</strong>:</p>
      <div style="background-color: #f4f4f4; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0; font-size: 16px; font-weight: bold; color: #d4af37;">${status.toUpperCase()}</p>
        <p style="margin: 10px 0 0 0;">${statusMessage}</p>
      </div>
      <p>If you have any questions, feel free to reply to this email.</p>
      <p>Best regards,<br>Anchor Customs Team</p>
    </div>
  `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'Anchor Customs <onboarding@resend.dev>', // Change to a verified domain in production if needed
        to: [email],
        subject: `Order Update: ${status.toUpperCase()} - Anchor Customs`,
        html: htmlContent
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to send email');
    }

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ error: error.message });
  }
}
