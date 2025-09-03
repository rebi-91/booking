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
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

Deno.serve(async (req) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin":  "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Authorization, Content-Type, apikey, x-client-info",
    "Access-Control-Max-Age":       "86400",
    "Content-Type":                 "application/json",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const MJ_KEY    = Deno.env.get("MAILJET_API_KEY");
    const MJ_SECRET = Deno.env.get("MAILJET_SECRET_KEY");
    if (!MJ_KEY || !MJ_SECRET) throw new Error("Mailjet credentials not set");

    const body = await req.json();
    const { to, name, service, date, time } = body ?? {};
    if (!to || !name || !service || !date || !time) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400, headers: corsHeaders
      });
    }

    const formattedDate = new Date(date).toLocaleDateString("en-GB", {
      weekday: "long", day: "numeric", month: "long", year: "numeric",
    });

    const auth = btoa(`${MJ_KEY}:${MJ_SECRET}`);
    const controller = new AbortController();
    const timeoutId  = setTimeout(() => controller.abort(), 15000);

    // 1) Try sending with BCC
    const bccEmail = "Coleshillpharmacy@hotmail.com";
    const payload = {
      Messages: [{
        From:   { Email: "info@coleshillpharmacy.co.uk", Name: "Coleshill Pharmacy" },
        To:     [{ Email: to, Name: name }],
        Bcc:    [{ Email: bccEmail, Name: "Coleshill Pharmacy" }],
        Subject: `Booking Confirmation: ${service}`,
        TextPart: `Hello ${name},\n\nYour ${service} is confirmed for ${formattedDate} at ${time}.\n\nThank you!`,
        HTMLPart: `
          <p>Hello ${name},</p>
          <p>Your <strong>${service}</strong> appointment is confirmed for:</p>
          <p><strong>Date:</strong> ${formattedDate}<br/><strong>Time:</strong> ${time}</p>
          <p>Thank you for choosing Coleshill Pharmacy!</p>`,
        "CustomID": `booking-confirmation-${Date.now()}`
      }]
    };

    const resp = await fetch("https://api.mailjet.com/v3.1/send", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Basic ${auth}` },
      body: JSON.stringify(payload),
      signal: controller.signal,
    }).catch((e) => {
      throw new Error("Network/timeout sending Mailjet request: " + (e?.message ?? e));
    });
    clearTimeout(timeoutId);

    const respJson = await resp.json().catch(() => ({}));

    // Log everything to help debug in Supabase function logs
    console.log("📩 Mailjet status:", resp.status);
    console.log("📩 Mailjet response:", JSON.stringify(respJson));

    if (!resp.ok) {
      const msg = respJson?.ErrorMessage || respJson?.message || "Mailjet error";
      throw new Error(msg);
    }

    // 2) Verify BCC existence in Mailjet response; if missing, fallback send directly to pharmacy
    const msg0 = Array.isArray(respJson?.Messages) ? respJson.Messages[0] : undefined;
    const bccAccepted = !!(msg0 && Array.isArray(msg0.Bcc) && msg0.Bcc.length > 0);

    if (!bccAccepted) {
      console.warn("⚠️ BCC not echoed by Mailjet, sending a separate copy to pharmacy.");

      const copyPayload = {
        Messages: [{
          From:   { Email: "info@coleshillpharmacy.co.uk", Name: "Coleshill Pharmacy" },
          To:     [{ Email: bccEmail, Name: "Coleshill Pharmacy" }],
          Subject: `Booking Confirmation (copy): ${service}`,
          TextPart: `Copy of confirmation for ${name} on ${formattedDate} at ${time}.`,
          HTMLPart: `
            <p>Copy of booking confirmation originally sent to <strong>${name}</strong>.</p>
            <p><strong>Service:</strong> ${service}<br/><strong>Date:</strong> ${formattedDate}<br/><strong>Time:</strong> ${time}</p>`,
          "CustomID": `booking-confirmation-copy-${Date.now()}`
        }]
      };

      const resp2 = await fetch("https://api.mailjet.com/v3.1/send", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Basic ${auth}` },
        body: JSON.stringify(copyPayload),
      });

      const resp2Json = await resp2.json().catch(() => ({}));
      console.log("📩 Mailjet fallback status:", resp2.status);
      console.log("📩 Mailjet fallback response:", JSON.stringify(resp2Json));

      if (!resp2.ok) {
        throw new Error(resp2Json?.ErrorMessage || "Fallback send to pharmacy failed");
      }
    }

    return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
  } catch (e) {
    console.error("❌ resend-email error:", e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: corsHeaders
    });
  }
});

// import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// Deno.serve(async (req) => {
//   const corsHeaders = {
//     "Access-Control-Allow-Origin":      "*",
//     "Access-Control-Allow-Methods":     "POST, OPTIONS",
//     "Access-Control-Allow-Headers":     "Authorization, Content-Type, apikey, x-client-info",
//     "Access-Control-Max-Age":           "86400",
//     "Content-Type":                     "application/json",
//   };

//   // 1) Handle CORS preflight
//   if (req.method === "OPTIONS") {
//     return new Response(null, { headers: corsHeaders });
//   }

//   try {
//     // 2) Pull your Mailjet creds
//     const MJ_KEY    = Deno.env.get("MAILJET_API_KEY");
//     const MJ_SECRET = Deno.env.get("MAILJET_SECRET_KEY");
//     if (!MJ_KEY || !MJ_SECRET) {
//       throw new Error("Mailjet credentials not set");
//     }

//     // 3) Parse the JSON payload
//     const body = await req.json();
//     console.log("📨 resend-email payload:", body);

//     const { to, name, service, date, time } = body;
//     if (!to || !name || !service || !date || !time) {
//       return new Response(
//         JSON.stringify({ error: "Missing required fields" }),
//         { status: 400, headers: corsHeaders }
//       );
//     }

//     // 4) Build your email
//     const formattedDate = new Date(date).toLocaleDateString("en-GB", {
//       weekday: "long", day: "numeric", month: "long", year: "numeric"
//     });

//     const auth = btoa(`${MJ_KEY}:${MJ_SECRET}`);
//     const payload = {
//       Messages: [{
//         From:  { Email: "info@coleshillpharmacy.co.uk", Name: "Coleshill Pharmacy" },
//         To:    [{ Email: to, Name: name }],
//         Subject: `Booking Confirmation: ${service}`,
//         TextPart: `Hello ${name},\n\nYour ${service} is confirmed for ${formattedDate} at ${time}.\n\nThank you!`,
//         HTMLPart: `
//           <p>Hello ${name},</p>
//           <p>Your <strong>${service}</strong> appointment is confirmed for:</p>
//           <p><strong>Date:</strong> ${formattedDate}<br/>
//              <strong>Time:</strong> ${time}</p>
//           <p>Thank you for choosing Coleshill Pharmacy!</p>`
//       }]
//     };

//     // 5) Send it
//     const controller = new AbortController();
//     const timeoutId  = setTimeout(() => controller.abort(), 10_000);

//     const resp = await fetch("https://api.mailjet.com/v3.1/send", {
//       method:  "POST",
//       headers: {
//         "Content-Type":  "application/json",
//         "Authorization": `Basic ${auth}`
//       },
//       body:    JSON.stringify(payload),
//       signal:  controller.signal
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
//       headers: corsHeaders
//     });
//   }
// });
