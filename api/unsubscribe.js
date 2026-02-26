import rateLimit from "./_rate-limit.js";

export default async function handler(req, res) {
  if (!rateLimit(req, res, { limit: 10, windowMs: 60_000 })) return;

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { token } = req.query || {};

  if (!token || !/^[a-f0-9]{64}$/.test(token)) {
    return sendPage(res, "Invalid Link", "This unsubscribe link is invalid or has expired.");
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return sendPage(res, "Error", "Service unavailable. Please try again later.");
  }

  try {
    // Find subscriber by token
    const findResp = await fetch(
      `${supabaseUrl}/rest/v1/subscribers?unsubscribe_token=eq.${token}&select=id,email`,
      {
        headers: {
          "apikey": supabaseKey,
          "Authorization": "Bearer " + supabaseKey,
        },
      }
    );

    const rows = await findResp.json();

    if (!rows || rows.length === 0) {
      return sendPage(res, "Already Unsubscribed", "This email has already been removed from our list, or the link has expired.");
    }

    // Delete the subscriber
    const deleteResp = await fetch(
      `${supabaseUrl}/rest/v1/subscribers?unsubscribe_token=eq.${token}`,
      {
        method: "DELETE",
        headers: {
          "apikey": supabaseKey,
          "Authorization": "Bearer " + supabaseKey,
          "Prefer": "return=minimal",
        },
      }
    );

    if (!deleteResp.ok) {
      const errBody = await deleteResp.text();
      console.error("Supabase delete failed:", deleteResp.status, errBody);
      return sendPage(res, "Error", "Something went wrong. Please try again later.");
    }

    return sendPage(res, "Unsubscribed", "You've been removed from the FRIA deadline updates list. You won't receive any further emails from us.");

  } catch (err) {
    console.error("Unsubscribe error:", err);
    return sendPage(res, "Error", "Something went wrong. Please try again later.");
  }
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function sendPage(res, title, message) {
  const safeTitle = escapeHtml(title);
  const safeMessage = escapeHtml(message);
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  return res.status(200).send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeTitle} — EU AI Act Navigator</title>
</head>
<body style="margin:0;padding:0;background:#f7f5f2;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;">
  <div style="max-width:440px;margin:0 auto;padding:40px 20px;text-align:center;">
    <div style="background:white;border-radius:16px;padding:36px 32px;border:1px solid #e8e4de;box-shadow:0 1px 4px rgba(0,0,0,0.04);">
      <h1 style="margin:0 0 12px;font-size:22px;color:#1e3a5f;font-weight:600;">${safeTitle}</h1>
      <p style="font-size:14px;color:#374151;line-height:1.7;margin:0 0 24px;">${safeMessage}</p>
      <a href="https://euai.app" style="display:inline-block;padding:12px 24px;background:#1e3a5f;color:white;text-decoration:none;border-radius:10px;font-size:14px;font-weight:600;">
        Back to EU AI Act Navigator
      </a>
    </div>
  </div>
</body>
</html>`);
}
