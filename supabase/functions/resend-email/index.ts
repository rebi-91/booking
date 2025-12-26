
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

Deno.serve(async (req) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers":
      "Authorization, Content-Type, apikey, x-client-info",
    "Access-Control-Max-Age": "86400",
    "Content-Type": "application/json",
  };

  // 1️⃣ Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // 2️⃣ Mailjet credentials
    const MJ_KEY = Deno.env.get("MAILJET_API_KEY");
    const MJ_SECRET = Deno.env.get("MAILJET_SECRET_KEY");
    if (!MJ_KEY || !MJ_SECRET) {
      throw new Error("Mailjet credentials not set");
    }

    // 3️⃣ Parse request payload
    const body = await req.json();
    console.log("📨 resend-email payload:", body);

    const {
      to,
      patientTitle,
      patientName,
      service,
      date,
      time,
      qrValue,
      qrImage,
    } = body;

    const auth = btoa(`${MJ_KEY}:${MJ_SECRET}`);

    const isQrEmail = !!qrValue && !!qrImage;

    let message;

    // =====================================================
    // 🟢 QR CHECK-IN EMAIL (manual name + email entry)
    // =====================================================
    if (isQrEmail) {
      if (!to || !patientName) {
        return new Response(
          JSON.stringify({ error: "Missing required QR email fields" }),
          { status: 400, headers: corsHeaders }
        );
      }

      message = {
        From: {
          Email: "info@coleshillpharmacy.co.uk",
          Name: "Coleshill Pharmacy",
        },
        To: [
          { Email: to, Name: patientName }, // patient
          {
            Email: "Coleshillpharmacy@hotmail.com",
            Name: "Pharmacy",
          }, // pharmacy copy
        ],
        Subject: "Your Pharmacy QR Code",
        HTMLPart: `
          <p>Hello ${patientName},</p>
          <p>Please present the QR code below when you arrive at the pharmacy:</p>
          <p>
            <img src="${qrImage}" alt="QR Code" />
          </p>
          <p><strong>Reference:</strong> ${qrValue}</p>
          <p>Thank you,<br/>Coleshill Pharmacy</p>
        `,
      };
    }

    // =====================================================
    // 🟢 APPOINTMENT EMAIL (existing behaviour)
    // =====================================================
    else {
      if (!to || !patientTitle || !patientName || !service || !date || !time) {
        return new Response(
          JSON.stringify({ error: "Missing required appointment fields" }),
          { status: 400, headers: corsHeaders }
        );
      }

      const formattedDate = new Date(date).toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      const greeting = `${patientTitle} ${patientName}`;

      message = {
        From: {
          Email: "info@coleshillpharmacy.co.uk",
          Name: "Coleshill Pharmacy",
        },
        To: [
          { Email: to, Name: greeting }, // patient
          {
            Email: "Coleshillpharmacy@hotmail.com",
            Name: "Pharmacy",
          }, // pharmacy copy
        ],
        Subject: `Booking Confirmation: ${service}`,
        TextPart: `Hello ${greeting},

Your ${service} is confirmed for ${formattedDate} at ${time}.

Thank you!
Coleshill Pharmacy`,
        HTMLPart: `
          <p>Hello ${greeting},</p>
          <p>Your <strong>${service}</strong> appointment is confirmed for:</p>
          <p>
            <strong>Date:</strong> ${formattedDate}<br/>
            <strong>Time:</strong> ${time}
          </p>
          <p>Thank you for choosing Coleshill Pharmacy!</p>
        `,
      };
    }

    // 4️⃣ Send email via Mailjet
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10_000);

    const resp = await fetch("https://api.mailjet.com/v3.1/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({ Messages: [message] }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!resp.ok) {
      const errJson = await resp.json().catch(() => ({}));
      throw new Error(errJson.ErrorMessage || "Mailjet error");
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: corsHeaders,
    });
  } catch (e) {
    console.error("❌ resend-email error:", e);
    return new Response(
      JSON.stringify({ error: (e as Error).message }),
      { status: 500, headers: corsHeaders }
    );
  }
});
