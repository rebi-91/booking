// import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// Deno.serve(async (req) => {
//   // CORS handling
//   if (req.method === "OPTIONS") {
//     return new Response(null, {
//       headers: {
//         "Access-Control-Allow-Origin": "*",
//         "Access-Control-Allow-Methods": "POST",
//         "Access-Control-Allow-Headers": "Authorization, Content-Type",
//       }
//     });
//   }

//   try {
//     // Debug environment variables
//     const MAILJET_API_KEY = Deno.env.get("MAILJET_API_KEY");
//     const MAILJET_SECRET_KEY = Deno.env.get("MAILJET_SECRET_KEY");
    
//     if (!MAILJET_API_KEY || !MAILJET_SECRET_KEY) {
//       throw new Error("Mailjet credentials not configured in environment variables");
//     }

//     const { to = "payra3421@gmail.com" } = await req.json();
    
//     // Verify sender email is authenticated in Mailjet
//     const authString = btoa(`${MAILJET_API_KEY}:${MAILJET_SECRET_KEY}`);
//     const mailjetUrl = "https://api.mailjet.com/v3.1/send";

//     const payload = {
//       Messages: [{
//         From: { 
//           Email: "payra3421@gmail.com",
//           Name: "Coleshill Pharmacy"
//         },
//         To: [{
//           Email: to,
//           Name: "Test Recipient"
//         }],
//         Subject: "Test Email Verification",
//         TextPart: "This email verifies your Mailjet setup is working",
//         HTMLPart: "<p>This email verifies your <strong>Mailjet setup</strong> is working</p>"
//       }]
//     };

//     const response = await fetch(mailjetUrl, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": `Basic ${authString}`
//       },
//       body: JSON.stringify(payload)
//     });

//     if (!response.ok) {
//       const errorDetails = await response.json();
//       console.error("Mailjet API Error:", {
//         status: response.status,
//         error: errorDetails,
//         authString: `Basic ${authString.slice(0, 10)}...` // Partial for security
//       });
//       throw new Error(`Mailjet API Error: ${errorDetails.ErrorMessage || response.statusText}`);
//     }

//     return new Response(JSON.stringify({ 
//       success: true,
//       message: `Test email sent to ${to}`
//     }));

//   } catch (error) {
//     console.error("Full Error:", error);
//     return new Response(JSON.stringify({
//       error: error instanceof Error ? error.message : "Operation failed",
//       debug: "Check Supabase function logs for details"
//     }), { 
//       status: 500,
//       headers: { "Content-Type": "application/json" }
//     });
//   }
// });
// supabase/functions/resend-email/index.ts
// import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

Deno.serve(async (req) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Authorization, Content-Type, apikey, x-client-info",
    "Access-Control-Max-Age": "86400",
    "Content-Type": "application/json",
  };

  // 1) Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // 2) Mailjet creds
    const MJ_KEY = Deno.env.get("MAILJET_API_KEY");
    const MJ_SECRET = Deno.env.get("MAILJET_SECRET_KEY");
    if (!MJ_KEY || !MJ_SECRET) throw new Error("Mailjet credentials not set");

    // 3) Parse request payload
    const body = await req.json();
    console.log("📨 resend-email payload:", body);

    const { to, patientTitle, patientName, service, date, time } = body;

    if (!to || !patientTitle || !patientName || !service || !date || !time) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    // 4) Format date
    const formattedDate = new Date(date).toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    // 5) Build Mailjet payload (send to patient + pharmacy)
    const auth = btoa(`${MJ_KEY}:${MJ_SECRET}`);
    const greeting = `${patientTitle} ${patientName}`;

    const payload = {
      Messages: [
        {
          From: { Email: "info@coleshillpharmacy.co.uk", Name: "Coleshill Pharmacy" },
          To: [
            { Email: to, Name: greeting }, // patient
            { Email: "Coleshillpharmacy@hotmail.com", Name: "Pharmacy" }, // pharmacy
          ],
          Subject: `Booking Confirmation: ${service}`,
          TextPart: `Hello ${greeting},\n\nYour ${service} is confirmed for ${formattedDate} at ${time}.\n\nThank you!`,
          HTMLPart: `
            <p>Hello ${greeting},</p>
            <p>Your <strong>${service}</strong> appointment is confirmed for:</p>
            <p><strong>Date:</strong> ${formattedDate}<br/>
               <strong>Time:</strong> ${time}</p>
            <p>Thank you for choosing Coleshill Pharmacy!</p>`,
        },
      ],
    };

    // 6) Send it
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10_000);

    const resp = await fetch("https://api.mailjet.com/v3.1/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!resp.ok) {
      const errJson = await resp.json().catch(() => ({}));
      throw new Error(errJson.ErrorMessage || "Mailjet error");
    }

    return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });

  } catch (e) {
    console.error("❌ resend-email error:", e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});

// import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// Deno.serve(async (req) => {
//   const corsHeaders = {
//     "Access-Control-Allow-Origin": "*",
//     "Access-Control-Allow-Methods": "POST, OPTIONS",
//     "Access-Control-Allow-Headers": "Authorization, Content-Type, apikey, x-client-info",
//     "Access-Control-Max-Age": "86400",
//     "Content-Type": "application/json",
//   };

//   // 1) Handle CORS preflight
//   if (req.method === "OPTIONS") {
//     return new Response(null, { headers: corsHeaders });
//   }

//   try {
//     // 2) Mailjet creds
//     const MJ_KEY = Deno.env.get("MAILJET_API_KEY");
//     const MJ_SECRET = Deno.env.get("MAILJET_SECRET_KEY");
//     if (!MJ_KEY || !MJ_SECRET) throw new Error("Mailjet credentials not set");

//     // 3) Parse request payload
//     const body = await req.json();
//     console.log("📨 resend-email payload:", body);

//     const { to, name, service, date, time } = body;
//     if (!to || !name || !service || !date || !time) {
//       return new Response(JSON.stringify({ error: "Missing required fields" }), {
//         status: 400,
//         headers: corsHeaders,
//       });
//     }

//     // 4) Format date
//     const formattedDate = new Date(date).toLocaleDateString("en-GB", {
//       weekday: "long",
//       day: "numeric",
//       month: "long",
//       year: "numeric",
//     });

//     // 5) Build Mailjet payload (multiple recipients in one email)
//     const auth = btoa(`${MJ_KEY}:${MJ_SECRET}`);
//     const payload = {
//       Messages: [
//         {
//           From: { Email: "info@coleshillpharmacy.co.uk", Name: "Coleshill Pharmacy" },
//           To: [
//             { Email: to, Name: name }, // patient
//             { Email: "Coleshillpharmacy@hotmail.com", Name: "Pharmacy" }, // pharmacy
//           ],
//           Subject: `Booking Confirmation: ${service}`,
//           TextPart: `Hello ${name},\n\nYour ${service} is confirmed for ${formattedDate} at ${time}.\n\nThank you!`,
//           HTMLPart: `
//             <p>Hello ${name},</p>
//             <p>Your <strong>${service}</strong> appointment is confirmed for:</p>
//             <p><strong>Date:</strong> ${formattedDate}<br/>
//                <strong>Time:</strong> ${time}</p>
//             <p>Thank you for choosing Coleshill Pharmacy!</p>`,
//         },
//       ],
//     };

//     // 6) Send it
//     const controller = new AbortController();
//     const timeoutId = setTimeout(() => controller.abort(), 10_000);

//     const resp = await fetch("https://api.mailjet.com/v3.1/send", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Basic ${auth}`,
//       },
//       body: JSON.stringify(payload),
//       signal: controller.signal,
//     });
//     clearTimeout(timeoutId);

//     if (!resp.ok) {
//       const errJson = await resp.json().catch(() => ({}));
//       throw new Error(errJson.ErrorMessage || "Mailjet error");
//     }

//     return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
//   } catch (e) {
//     console.error("❌ resend-email error:", e);
//     return new Response(JSON.stringify({ error: (e as Error).message }), {
//       status: 500,
//       headers: corsHeaders,
//     });
//   }
// });
