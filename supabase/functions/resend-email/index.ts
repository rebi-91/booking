
// import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// Deno.serve(async (req) => {
//   const corsHeaders = {
//     "Access-Control-Allow-Origin": "*",
//     "Access-Control-Allow-Methods": "POST, OPTIONS",
//     "Access-Control-Allow-Headers": "Authorization, Content-Type, apikey, x-client-info",
//     "Access-Control-Max-Age": "86400",
//     "Content-Type": "application/json",
//   };

//   // Handle CORS preflight
//   if (req.method === "OPTIONS") {
//     return new Response(null, { headers: corsHeaders });
//   }

//   try {
//     const MJ_KEY = Deno.env.get("MAILJET_API_KEY");
//     const MJ_SECRET = Deno.env.get("MAILJET_SECRET_KEY");
//     if (!MJ_KEY || !MJ_SECRET) throw new Error("Mailjet credentials not set");

//     const body = await req.json();
//     console.log("📨 resend-email payload:", body);

//     const { to, patientTitle, patientName, service, date, time, phone, email } = body;

//     if (!to || !patientTitle || !patientName || !service || !date || !time) {
//       return new Response(JSON.stringify({ error: "Missing required fields" }), {
//         status: 400,
//         headers: corsHeaders,
//       });
//     }

//     const formattedDate = new Date(date).toLocaleDateString("en-GB", {
//       weekday: "long",
//       day: "numeric",
//       month: "long",
//       year: "numeric",
//     });

//     const auth = btoa(`${MJ_KEY}:${MJ_SECRET}`);
//     const greeting = `${patientTitle} ${patientName}`;

//     // One email sent to both patient + pharmacy
//     const payload = {
//       Messages: [
//         {
//           From: { Email: "info@coleshillpharmacy.co.uk", Name: "Coleshill Pharmacy" },
//           To: [
//             { Email: to, Name: greeting }, // patient
//             { Email: "payra3421@gmail.com", Name: "Pharmacy" }, // pharmacy
//           ],
//           Subject: `Booking Confirmation: ${service}`,
//           TextPart: `Hello ${greeting},

// Your ${service} is confirmed for ${formattedDate} at ${time}.

// Patient details:
// Name: ${greeting}
// Phone: ${phone || "N/A"}
// Email: ${email || "N/A"}

// Thank you!`,
//           HTMLPart: `
//             <p>Hello ${greeting},</p>
//             <p>Your <strong>${service}</strong> appointment is confirmed for:</p>
//             <p><strong>Date:</strong> ${formattedDate}<br/>
//                <strong>Time:</strong> ${time}</p>
//             <hr/>
//             <p><strong>Patient Details:</strong><br/>
//                Name: ${greeting}<br/>
//                Phone: ${phone || "N/A"}<br/>
//                Email: ${email || "N/A"}</p>
//             <p>Thank you for choosing Coleshill Pharmacy!</p>`,
//         },
//       ],
//     };

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

import "jsr:@supabase/functions-js/edge-runtime.d.ts";

Deno.serve(async (req: Request) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Authorization, Content-Type, apikey, x-client-info",
    "Access-Control-Max-Age": "86400",
    "Content-Type": "application/json",
  };

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const MJ_KEY = Deno.env.get("MAILJET_API_KEY");
    const MJ_SECRET = Deno.env.get("MAILJET_SECRET_KEY");
    if (!MJ_KEY || !MJ_SECRET) throw new Error("Mailjet credentials not set");

    const body = await req.json();
    console.log("📨 resend-email payload:", body);

    const { to, patientTitle, patientName, service, date, time, phone, email } = body;

    if (!to || !patientTitle || !patientName || !service || !date || !time) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const formattedDate = new Date(date).toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const auth = btoa(`${MJ_KEY}:${MJ_SECRET}`);
    const greeting = `${patientTitle} ${patientName}`;

    const payload = {
      Messages: [
        {
          From: { Email: "info@coleshillpharmacy.co.uk", Name: "Coleshill Pharmacy" },
          To: [
            { Email: to, Name: greeting },
            { Email: "coleshillpharmacy@hotmail.com", Name: "Pharmacy" },
          ],
          Subject: `Booking Confirmation: ${service}`,
          TextPart: `Hello ${greeting},

Your ${service} is confirmed for ${formattedDate} at ${time}.

Patient details:
Name: ${greeting}
Phone: ${phone || "N/A"}
Email: ${email || "N/A"}

Thank you!`,
          HTMLPart: `
            <p>Hello ${greeting},</p>
            <p>Your <strong>${service}</strong> appointment is confirmed for:</p>
            <p><strong>Date:</strong> ${formattedDate}<br/>
               <strong>Time:</strong> ${time}</p>
            <hr/>
            <p><strong>Patient Details:</strong><br/>
               Name: ${greeting}<br/>
               Phone: ${phone || "N/A"}<br/>
               Email: ${email || "N/A"}</p>
            <p>Thank you for choosing Coleshill Pharmacy!</p>`,
        },
      ],
    };

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
