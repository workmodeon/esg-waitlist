module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.RESEND_API_KEY) {
    return res.status(500).json({ error: 'Missing RESEND_API_KEY on server' });
  }

  const { companyName, personName, email, demoDate } = req.body || {};

  if (!companyName || !personName || !email || !demoDate) {
    return res.status(400).json({ error: 'Missing required form fields' });
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Zissions <suhasani@zissions.com>',
        to: [email],
        subject: 'You’re on the Zissions ESG Waitlist 🌱',
        html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937; padding: 20px;">
          
          <p>Hi ${personName},</p>

          <p>
            Thank you for registering at <strong>Zissions</strong> for our ESG automation waitlist!
            We have noted your availability for a demo on 
            <strong>${demoDate}</strong>.
          </p>

          <p>
            We will contact you soon.
          </p>

          <br/>

          <p>Best regards,<br/>
          <strong>The ESG Team</strong></p>

        </div>
      `,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return res.status(500).json({ error: result?.message || 'Resend failed to send email' });
    }

    return res.status(200).json({ success: true, id: result?.id || null });
  } catch (error) {
    const message = error?.message || 'Unexpected server error while sending email';
    console.error('sendEmail error:', message, error);
    return res.status(500).json({ error: message });
  }
};
