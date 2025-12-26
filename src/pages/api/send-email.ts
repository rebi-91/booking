// import { NextApiRequest, NextApiResponse } from 'next';
// import nodemailer from 'nodemailer';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   // Only allow POST requests
//   if (req.method !== 'POST') {
//     return res.status(405).json({ error: 'Method not allowed' });
//   }

//   try {
//     const { to, subject, patientName, qrCodeUrl, qrValue } = req.body;

//     // Validate required fields
//     if (!to || !subject) {
//       return res.status(400).json({ error: 'Missing required fields: to and subject' });
//     }

//     // For development/testing without Gmail credentials
//     if (process.env.NODE_ENV === 'development') {
//       console.log('Email would be sent in production:');
//       console.log('To:', to);
//       console.log('Subject:', subject);
//       console.log('Patient Name:', patientName);
//       console.log('QR URL:', qrCodeUrl);
      
//       // Simulate email sending delay
//       await new Promise(resolve => setTimeout(resolve, 1000));
      
//       return res.status(200).json({ 
//         success: true, 
//         message: 'Email sent successfully (simulated in development)',
//         preview: {
//           to,
//           subject,
//           patientName,
//           qrCodeUrl
//         }
//       });
//     }

//     // Production: Send actual email
//     // Create transporter
//     const transporter = nodemailer.createTransport({
//       host: 'smtp.gmail.com',
//       port: 587,
//       secure: false,
//       auth: {
//         user: 'payra3421@gmail.com',
//         pass: process.env.GMAIL_APP_PASSWORD || '', // Set in .env.local
//       },
//     });

//     // Email HTML content
//     const htmlContent = `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <meta charset="UTF-8">
//         <title>Your QR Code</title>
//       </head>
//       <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
//         <div style="background: linear-gradient(135deg, #0070f3, #00b894); padding: 20px; border-radius: 10px 10px 0 0; color: white;">
//           <h1 style="margin: 0;">Your QR Code is Ready!</h1>
//         </div>
        
//         <div style="padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 10px 10px;">
//           <p>Hello <strong>${patientName || 'Valued Patient'}</strong>,</p>
          
//           <p>Your personal QR code for pharmacy check-ins has been created successfully.</p>
          
//           <div style="text-align: center; margin: 30px 0; padding: 20px; background: #f8f9fa; border-radius: 10px;">
//             <img src="${qrCodeUrl}" alt="QR Code" style="max-width: 200px; height: auto; border: 2px solid #0070f3; border-radius: 10px; padding: 10px; background: white;">
//             <p style="color: #666; margin-top: 15px; font-size: 14px;">
//               <strong>QR Code Value:</strong> ${qrValue}
//             </p>
//           </div>
          
//           <p><strong>How to use your QR code:</strong></p>
//           <ul style="padding-left: 20px;">
//             <li>Save this email for future reference</li>
//             <li>Show the QR code at the pharmacy for quick check-in</li>
//             <li>You can also print the QR code</li>
//           </ul>
          
//           <div style="margin-top: 30px; padding: 15px; background-color: #e8f5e9; border-radius: 8px; border-left: 4px solid #4caf50;">
//             <p style="margin: 0; color: #2e7d32;">
//               <strong>Note:</strong> This QR code is unique to you. Please keep it secure and use it for your pharmacy visits.
//             </p>
//           </div>
          
//           <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px;">
//             <p>This email was sent from Pharmacy Check-in System.</p>
//             <p>If you didn't request this QR code, please ignore this email.</p>
//           </div>
//         </div>
//       </body>
//       </html>
//     `;

//     // Send email
//     const info = await transporter.sendMail({
//       from: '"Pharmacy Check-in System" <payra3421@gmail.com>',
//       to: to,
//       subject: subject,
//       html: htmlContent,
//       text: `Your QR Code for ${patientName || 'pharmacy check-in'} is ready. QR Code: ${qrCodeUrl} (Code: ${qrValue})`,
//     });

//     console.log('Email sent:', info.messageId);

//     return res.status(200).json({ 
//       success: true, 
//       message: 'Email sent successfully',
//       messageId: info.messageId 
//     });

//   } catch (error: any) {
//     console.error('Error sending email:', error);
//     return res.status(500).json({ 
//       error: 'Failed to send email', 
//       details: error.message 
//     });
//   }
// }