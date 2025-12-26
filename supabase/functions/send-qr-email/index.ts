import "jsr:@supabase/functions-js/edge-runtime.d.ts";

Deno.serve(async (req) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  };

  // 🔁 Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers });
  }

  try {
    // 📥 Parse request body
    const body = await req.json();
    console.log("📨 Incoming body:", JSON.stringify(body, null, 2));

    const { to, patientName, qrValue, qrImage } = body;

    // ✅ Validate required fields
    if (!to || !patientName || !qrImage) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields",
          required: ["to", "patientName", "qrImage"],
        }),
        { status: 400, headers }
      );
    }

    // 🔐 Get Mailjet credentials
    const MJ_KEY = Deno.env.get("MAILJET_API_KEY");
    const MJ_SECRET = Deno.env.get("MAILJET_SECRET_KEY");

    if (!MJ_KEY || !MJ_SECRET) {
      throw new Error("Mailjet environment variables missing");
    }

    const auth = btoa(`${MJ_KEY}:${MJ_SECRET}`);

    // 📧 Build HTML email with clickable QR and reference
    const htmlContent = `
      <div style="font-family: sans-serif; line-height: 1.5; color: #333;">
        <p>Hello ${patientName},</p>

        <p>Please present the QR code below when you arrive at the pharmacy:</p>

        <p>
          <a href="${qrImage}" target="_blank" style="display:inline-block;">
            <img src="${qrImage}" alt="QR Code" style="width:200px;height:200px;border-radius:12px;"/>
          </a>
        </p>

        <p>Kind regards,<br/>Coleshill Pharmacy</p>
      </div>
    `;

    const payload = {
      Messages: [
        {
          From: {
            Email: "info@coleshillpharmacy.co.uk", // Must be verified in Mailjet
            Name: "Coleshill Pharmacy",
          },
          To: [{ Email: to, Name: patientName }],
          Subject: "Your Pharmacy QR Code",
          HTMLPart: htmlContent,
        },
      ],
    };

    console.log("📤 Sending Mailjet payload:", JSON.stringify(payload, null, 2));

    // 🚀 Send email
    const resp = await fetch("https://api.mailjet.com/v3.1/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await resp.json();
    console.log("📬 Mailjet full response:", JSON.stringify(result, null, 2));

    // ❌ Handle Mailjet-level errors
    if (!resp.ok || result.Messages?.[0]?.Status !== "success") {
      const mailjetError =
        result.Messages?.[0]?.Errors?.[0]?.ErrorMessage ||
        "Unknown Mailjet error";
      throw new Error(mailjetError);
    }

    // ✅ Success
    return new Response(JSON.stringify({ success: true }), { headers });
  } catch (err) {
    console.error("❌ send-qr-email error:", err);
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers }
    );
  }
});
