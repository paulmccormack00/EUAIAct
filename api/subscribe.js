export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email } = req.body || {};

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Please enter a valid email address." });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_KEY env vars");
    return res.status(500).json({ error: "Service unavailable." });
  }

  const cleanEmail = email.toLowerCase().trim();
  const unsubscribeToken = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");

  try {
    const resp = await fetch(supabaseUrl + "/rest/v1/subscribers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": supabaseKey,
        "Authorization": "Bearer " + supabaseKey,
        "Prefer": "return=minimal",
      },
      body: JSON.stringify({
        email: cleanEmail,
        unsubscribe_token: unsubscribeToken,
        created_at: new Date().toISOString(),
      }),
    });

    if (resp.ok || resp.status === 201) {
      // Send confirmation email (non-blocking)
      sendConfirmationEmail(cleanEmail, unsubscribeToken).catch(e => {
        console.error("Confirmation email error:", e.message || e);
      });
      return res.status(200).json({ success: true });
    }

    const errBody = await resp.text();

    if (resp.status === 409 || errBody.includes("duplicate") || errBody.includes("23505")) {
      return res.status(409).json({ error: "duplicate" });
    }

    console.error("Supabase insert failed:", resp.status, errBody);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  } catch (err) {
    console.error("Subscribe error:", err);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
}

async function sendConfirmationEmail(email, unsubscribeToken) {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    console.error("Missing RESEND_API_KEY");
    return;
  }

  const unsubscribeUrl = `https://euai.app/api/unsubscribe?token=${unsubscribeToken}`;

  const resp = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${resendKey}`,
    },
    body: JSON.stringify({
      from: "EU AI Act Navigator <updates@euai.app>",
      to: email,
      subject: "You're subscribed — FRIA deadline updates",
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f7f5f2;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 20px;">
    <div style="background:white;border-radius:16px;padding:36px 32px;border:1px solid #e8e4de;">
      <div style="border-left:4px solid #1e3a5f;padding-left:16px;margin-bottom:24px;">
        <h1 style="margin:0 0 4px;font-size:20px;color:#1e3a5f;font-weight:600;">EU AI Act Navigator</h1>
        <p style="margin:0;font-size:13px;color:#8b7355;">FRIA Deadline Updates</p>
      </div>

      <p style="font-size:15px;color:#1a1a1a;line-height:1.7;margin:0 0 16px;">
        You're in. We'll notify you when the EU AI Office publishes the official FRIA template.
      </p>

      <div style="background:#f0f4ff;border-radius:10px;padding:16px 20px;margin:0 0 20px;">
        <p style="margin:0 0 4px;font-size:13px;color:#64748b;font-weight:500;">FRIA DEADLINE</p>
        <p style="margin:0;font-size:18px;color:#1e3a5f;font-weight:600;">2 August 2026</p>
        <p style="margin:4px 0 0;font-size:13px;color:#64748b;">Article 27 — Fundamental Rights Impact Assessment for high-risk AI systems</p>
      </div>

      <p style="font-size:14px;color:#374151;line-height:1.7;margin:0 0 8px;">
        Under Article 27, deployers of high-risk AI systems must complete a fundamental rights impact assessment before putting those systems into use. No official template has been published yet by the EU AI Office.
      </p>

      <p style="font-size:14px;color:#374151;line-height:1.7;margin:0 0 24px;">
        We'll email you as soon as the template is available — nothing else, no spam.
      </p>

      <a href="https://euai.app" style="display:inline-block;padding:12px 24px;background:#1e3a5f;color:white;text-decoration:none;border-radius:10px;font-size:14px;font-weight:600;">
        Browse the EU AI Act
      </a>
    </div>

    <div style="text-align:center;padding:24px 0 0;">
      <p style="font-size:11px;color:#94a3b8;margin:0 0 4px;">EU AI Act Navigator · euai.app</p>
      <p style="font-size:11px;color:#94a3b8;margin:0;">
        <a href="${unsubscribeUrl}" style="color:#94a3b8;text-decoration:underline;">Unsubscribe</a>
      </p>
    </div>
  </div>
</body>
</html>`,
    }),
  });

  if (!resp.ok) {
    const errBody = await resp.text();
    console.error("Resend API error:", resp.status, errBody);
  }
}
