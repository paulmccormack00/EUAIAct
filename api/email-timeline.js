// POST /api/email-timeline — emails the compliance-timeline PDF to the address
// the user enters, and captures the lead (email + optional name/role) in the
// Supabase `subscribers` table. The PDF is generated server-side and attached.
import rateLimit from "./_rate-limit.js";
import { renderTimelinePdf } from "./_timeline-pdf.js";

const ROLES = ["Provider", "Deployer", "Importer", "Distributor", "Affected person", "Other"];

export default async function handler(req, res) {
  // Tighter limit than subscribe — this sends an email, so guard against abuse.
  if (!rateLimit(req, res, { limit: 5, windowMs: 60_000 })) return;

  const allowedOrigins = ["https://euai.app", "https://eu-ai-act-navigator.vercel.app", "capacitor://localhost"];
  const origin = req.headers.origin || "";
  const isAllowed = allowedOrigins.includes(origin) || /^https:\/\/euai-app-[a-z0-9]+-[a-z0-9-]+\.vercel\.app$/.test(origin);
  if (isAllowed) res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { email, name, role } = req.body || {};
  if (!email || typeof email !== "string" || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Please enter a valid email address." });
  }
  const cleanEmail = email.toLowerCase().trim();
  const cleanName = typeof name === "string" ? name.trim().slice(0, 100) : "";
  const cleanRole = typeof role === "string" && ROLES.includes(role) ? role : "";

  if (!process.env.RESEND_API_KEY) {
    console.error("Missing RESEND_API_KEY");
    return res.status(500).json({ error: "Email service unavailable." });
  }

  const { randomBytes } = await import("crypto");
  const unsubscribeToken = randomBytes(32).toString("hex");
  const unsubscribeUrl = `https://euai.app/api/unsubscribe?token=${unsubscribeToken}`;

  try {
    const pdf = await renderTimelinePdf();

    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.RESEND_API_KEY}` },
      body: JSON.stringify({
        from: "Paul McCormack <updates@euai.app>",
        reply_to: "paul@siriconsult.com",
        to: cleanEmail,
        subject: "Your EU AI Act compliance timeline (PDF)",
        headers: {
          "List-Unsubscribe": `<${unsubscribeUrl}>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        },
        attachments: [{ filename: "EU-AI-Act-Compliance-Timeline.pdf", content: pdf.toString("base64") }],
        html: buildEmailHtml(cleanName, unsubscribeUrl),
      }),
    });

    if (!resp.ok) {
      const errBody = await resp.text();
      console.error("Resend API error:", resp.status, errBody);
      return res.status(502).json({ error: "We couldn't send the email. Please try again." });
    }

    // Best-effort lead capture — never block the email the user asked for.
    captureLead(cleanEmail, cleanName, cleanRole, unsubscribeToken).catch((e) =>
      console.error("Lead capture error:", e?.message || e)
    );

    return res.status(200).json({ success: true });
  } catch (e) {
    console.error("email-timeline error:", e?.message || e);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
}

async function captureLead(email, name, role, unsubscribeToken) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
  if (!supabaseUrl || !supabaseKey) return;

  const headers = {
    "Content-Type": "application/json",
    apikey: supabaseKey,
    Authorization: `Bearer ${supabaseKey}`,
    Prefer: "resolution=merge-duplicates,return=minimal",
  };
  const full = {
    email,
    unsubscribe_token: unsubscribeToken,
    created_at: new Date().toISOString(),
    name: name || null,
    role: role || null,
    source: "timeline_pdf",
  };

  let resp = await fetch(`${supabaseUrl}/rest/v1/subscribers?on_conflict=email`, {
    method: "POST",
    headers,
    body: JSON.stringify(full),
  });

  // If the name/role/source columns don't exist yet, fall back to email-only so
  // the lead is still captured. (Run the ALTER TABLE to enable the richer fields.)
  if (!resp.ok) {
    const body = await resp.text();
    if (resp.status === 409 || body.includes("duplicate") || body.includes("23505")) return; // already a subscriber
    if (/column|PGRST204|schema cache/i.test(body)) {
      const minimal = { email, unsubscribe_token: unsubscribeToken, created_at: new Date().toISOString() };
      resp = await fetch(`${supabaseUrl}/rest/v1/subscribers?on_conflict=email`, {
        method: "POST",
        headers,
        body: JSON.stringify(minimal),
      });
      if (!resp.ok && resp.status !== 409) console.error("Lead capture (minimal) failed:", resp.status, await resp.text());
      return;
    }
    console.error("Lead capture failed:", resp.status, body);
  }
}

function buildEmailHtml(name, unsubscribeUrl) {
  const greeting = name ? `Hi ${escapeHtml(name)},` : "Hi,";
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;background:#f7f5f2;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#374151;">
  <div style="max-width:560px;margin:0 auto;padding:32px 24px;">
    <p style="font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:#9a7b3f;font-weight:600;margin:0 0 6px;">euai.app</p>
    <h1 style="font-size:22px;color:#1a1a1a;margin:0 0 16px;font-weight:600;">Your EU AI Act compliance timeline</h1>
    <p style="font-size:15px;line-height:1.6;margin:0 0 14px;">${greeting}</p>
    <p style="font-size:15px;line-height:1.6;margin:0 0 14px;">Your copy of the EU AI Act compliance timeline is attached as a PDF — every deadline from entry into force through the high-risk framework, updated for the Digital Omnibus (high-risk obligations and FRIA now deferred to 2 December 2027 and 2 August 2028, pending Official Journal publication).</p>
    <p style="font-size:15px;line-height:1.6;margin:0 0 20px;">You can always view the latest version at <a href="https://euai.app/timeline" style="color:#1e3a5f;">euai.app/timeline</a>.</p>
    <p style="font-size:13px;line-height:1.6;color:#6b7280;margin:0 0 6px;">Until the Digital Omnibus is published in the Official Journal, the original AI Act dates remain the binding law — so keep preparing.</p>
    <hr style="border:none;border-top:1px solid #e6e2db;margin:24px 0;">
    <p style="font-size:12px;color:#9ca3af;line-height:1.5;margin:0;">Informational only — not legal advice. You're receiving this because you requested a copy of the timeline from euai.app. <a href="${unsubscribeUrl}" style="color:#9ca3af;">Unsubscribe</a>.</p>
  </div>
</body></html>`;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
