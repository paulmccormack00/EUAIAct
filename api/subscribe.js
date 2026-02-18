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
    return res.status(500).json({ error: "Service unavailable." });
  }

  const resp = await fetch(supabaseUrl + "/rest/v1/subscribers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": supabaseKey,
      "Authorization": "Bearer " + supabaseKey,
      "Prefer": "return=minimal",
    },
    body: JSON.stringify({
      email: email.toLowerCase().trim(),
      created_at: new Date().toISOString(),
    }),
  });

  if (resp.status === 409 || resp.status === 23505) {
    return res.status(409).json({ error: "duplicate" });
  }

  if (!resp.ok) {
    const errBody = await resp.text();
    if (errBody.includes("duplicate") || errBody.includes("23505")) {
      return res.status(409).json({ error: "duplicate" });
    }
    console.error("Supabase insert failed:", resp.status, errBody);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }

  return res.status(200).json({ success: true });
}
