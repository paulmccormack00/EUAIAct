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
      await sendConfirmationEmail(cleanEmail, unsubscribeToken);
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
      from: "Paul McCormack <updates@euai.app>",
      reply_to: "paul@siriconsult.com",
      to: email,
      subject: "You're in — tracking the FRIA deadline for you",
      headers: {
        "List-Unsubscribe": `<${unsubscribeUrl}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
      html: buildEmailHtml(unsubscribeUrl),
    }),
  });

  if (!resp.ok) {
    const errBody = await resp.text();
    console.error("Resend API error:", resp.status, errBody);
  }
}

function buildEmailHtml(unsubscribeUrl) {
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <title>You're in — tracking the FRIA deadline for you</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #f4f5f7; }
    a { color: #d4a843; text-decoration: underline; }
    a:hover { color: #e6bc5a; }
    @media screen and (max-width: 600px) {
      .email-container { width: 100% !important; }
      .fluid { max-width: 100% !important; height: auto !important; }
      .stack-column { display: block !important; width: 100% !important; }
      .padding-mobile { padding-left: 24px !important; padding-right: 24px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f5f7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">

  <div style="display: none; font-size: 1px; color: #f4f5f7; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    You're tracking the FRIA deadline. We'll notify you when the EU AI Office publishes the official template.
  </div>

  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f5f7;">
    <tr>
      <td align="center" style="padding: 32px 16px;">

        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="580" class="email-container" style="max-width: 580px; width: 100%;">

          <!-- HEADER -->
          <tr>
            <td style="background-color: #0a1e5c; padding: 32px 40px 28px; border-radius: 12px 12px 0 0;" class="padding-mobile">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="font-size: 22px; font-weight: 700; color: #ffffff; font-family: Georgia, 'Times New Roman', serif; letter-spacing: -0.3px;">
                    <img src="https://euai.app/android-chrome-192x192.png" alt="EU AI Act Navigator" width="32" height="32" style="width: 32px; height: 32px; vertical-align: middle; margin-right: 10px; border-radius: 6px; display: inline-block;" />
                    EU AI Act Navigator
                  </td>
                  <td align="right" style="font-size: 12px; color: #8a94b8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; text-transform: uppercase; letter-spacing: 1.5px;">
                    FRIA Updates
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- HERO -->
          <tr>
            <td style="background-color: #0d2470; padding: 36px 40px 40px; text-align: center;" class="padding-mobile">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
                <tr>
                  <td style="width: 64px; height: 64px; background-color: #d4a843; border-radius: 50%; text-align: center; line-height: 64px; font-size: 28px; color: #0d2470;">
                    &#10003;
                  </td>
                </tr>
              </table>
              <p style="margin: 20px 0 0; font-size: 26px; font-weight: 700; color: #ffffff; font-family: Georgia, 'Times New Roman', serif; line-height: 1.3;">
                You're in.
              </p>
              <p style="margin: 12px 0 0; font-size: 15px; color: #b0b8d4; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6;">
                We'll notify you when the EU AI Office publishes<br>the official FRIA template.
              </p>
            </td>
          </tr>

          <!-- DEADLINE BADGE -->
          <tr>
            <td style="background-color: #ffffff; padding: 36px 40px 0;" class="padding-mobile">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #fdf6e3; border-radius: 8px; border-left: 4px solid #d4a843;">
                <tr>
                  <td style="padding: 20px 24px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td>
                          <p style="margin: 0; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #9a8340; font-weight: 700; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                            FRIA Deadline
                          </p>
                          <p style="margin: 4px 0 0; font-size: 28px; font-weight: 700; color: #0a1e5c; font-family: Georgia, 'Times New Roman', serif; letter-spacing: -0.5px;">
                            2 August 2026
                          </p>
                        </td>
                        <td align="right" valign="middle" style="font-size: 13px; color: #6b7280; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                          Article 27
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="background-color: #ffffff; padding: 28px 40px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 15px; line-height: 1.7; color: #374151;" class="padding-mobile">
              <p style="margin: 0 0 16px;">
                Under Article 27, deployers of high-risk AI systems must complete a <strong>fundamental rights impact assessment</strong> before putting those systems into use.
              </p>
              <p style="margin: 0 0 16px;">
                No official template has been published yet by the EU AI Office. We'll email you as soon as it's available &mdash; plus send you a <strong>free FRIA Preparation Checklist</strong> to help you get ready.
              </p>
              <p style="margin: 0; color: #6b7280; font-size: 14px;">
                Nothing else, no spam. Just the update that matters.
              </p>
            </td>
          </tr>

          <!-- CTA BUTTON -->
          <tr>
            <td style="background-color: #ffffff; padding: 28px 40px 0; text-align: center;" class="padding-mobile">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
                <tr>
                  <td style="border-radius: 6px; background-color: #0d2470;">
                    <a href="https://euai.app" target="_blank" style="display: inline-block; padding: 14px 32px; font-size: 15px; font-weight: 600; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; text-decoration: none; border-radius: 6px;">
                      Browse the EU AI Act &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- DIVIDER -->
          <tr>
            <td style="background-color: #ffffff; padding: 32px 40px 0;" class="padding-mobile">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="border-top: 1px solid #e5e7eb; height: 1px; font-size: 0; line-height: 0;">&nbsp;</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- QUOTE -->
          <tr>
            <td style="background-color: #ffffff; padding: 28px 40px 0; text-align: center;" class="padding-mobile">
              <p style="margin: 0; font-size: 18px; font-style: italic; color: #0d2470; font-family: Georgia, 'Times New Roman', serif; line-height: 1.5;">
                &ldquo;The secret of getting ahead is getting started.&rdquo;
              </p>
              <p style="margin: 8px 0 0; font-size: 13px; color: #9ca3af; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                &mdash; Mark Twain
              </p>
            </td>
          </tr>

          <!-- DIVIDER -->
          <tr>
            <td style="background-color: #ffffff; padding: 28px 40px 0;" class="padding-mobile">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="border-top: 1px solid #e5e7eb; height: 1px; font-size: 0; line-height: 0;">&nbsp;</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- NOTE FROM PAUL -->
          <tr>
            <td style="background-color: #ffffff; padding: 28px 40px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;" class="padding-mobile">
              <p style="margin: 0 0 4px; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #9ca3af; font-weight: 700;">
                A note from Paul
              </p>
              <p style="margin: 12px 0 0; font-size: 14px; line-height: 1.7; color: #4b5563;">
                Thanks for signing up. I built this navigator because I've spent 16 years helping organisations make sense of complex regulation &mdash; first as a lawyer, then as a founder, and now as someone who genuinely believes compliance shouldn't require a six-figure budget or a law degree.
              </p>
              <p style="margin: 14px 0 0; font-size: 14px; line-height: 1.7; color: #4b5563;">
                The August 2026 deadline is real, the tools don't exist yet, and most organisations aren't ready.
              </p>
              <p style="margin: 14px 0 0; font-size: 14px; color: #4b5563;">
                More to come.
              </p>
              <p style="margin: 20px 0 0; font-size: 14px; color: #0a1e5c; font-weight: 600;">
                &mdash; Paul McCormack
              </p>
              <p style="margin: 2px 0 0; font-size: 12px;">
                <a href="https://www.linkedin.com/in/paulmccormack1" style="color: #0d2470; text-decoration: none; font-weight: 500;">Connect on LinkedIn &rarr;</a>
              </p>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background-color: #ffffff; padding: 32px 40px 36px; border-radius: 0 0 12px 12px;" class="padding-mobile">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="border-top: 1px solid #e5e7eb; padding-top: 24px; text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; line-height: 1.8; color: #9ca3af;">
                    <a href="https://euai.app" style="color: #6b7280; text-decoration: none; font-weight: 600;">EU AI Act Navigator</a> &middot; <a href="https://euai.app" style="color: #6b7280; text-decoration: none;">euai.app</a>
                    <br>
                    <a href="https://euai.app" style="color: #9ca3af; text-decoration: underline;">Privacy Notice</a>
                    <br><br>
                    <a href="${unsubscribeUrl}" style="color: #9ca3af; text-decoration: underline;">Unsubscribe</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>`;
}
