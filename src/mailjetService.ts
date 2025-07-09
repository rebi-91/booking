import mailjet from 'node-mailjet'

// Initialize Mailjet client with Vite env vars
const mailjetClient = mailjet.apiConnect(
  import.meta.env.VITE_MAILJET_API_KEY,
  import.meta.env.VITE_MAILJET_SECRET_KEY
)

interface EmailParams {
  to: string
  name: string
  title: string
  service: string
  date: string
  time: string
  address: string
}

export async function sendBookingConfirmation({
  to,
  name,
  title,
  service,
  date,
  time,
  address
}: EmailParams): Promise<void> {
  // Validate environment variables
  if (!import.meta.env.VITE_MAILJET_API_KEY || !import.meta.env.VITE_MAILJET_SECRET_KEY) {
    throw new Error('Mailjet credentials are not configured')
  }

  try {
    const response = await mailjetClient
      .post('send', { version: 'v3.1' })
      .request({
        Messages: [
          {
            From: {
              Email: "Coleshillpharmacy@gmail.com",
              Name: "Coleshill Pharmacy"
            },
            To: [
              {
                Email: to,
                Name: `${title} ${name}`
              }
            ],
            Subject: `Booking Confirmation for ${service}`,
            HTMLPart: `
              <h1>Booking Confirmation</h1>
              <p>Dear ${title} ${name},</p>
              <p>Your booking for <strong>${service}</strong> has been confirmed.</p>
              <p><strong>Date:</strong> ${date}</p>
              <p><strong>Time:</strong> ${time}</p>
              <p><strong>Location:</strong> ${address}</p>
              <p>If you need to cancel or reschedule, please contact us at coleshillpharmacy@gmail.com</p>
              <p>Best regards,<br/>Coleshill Pharmacy</p>
            `
          }
        ]
      })

    console.log('Email sent successfully:', response.body)
  } catch (err) {
    console.error('Mailjet error:', err)
    throw new Error('Failed to send confirmation email')
  }
}