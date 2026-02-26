// /api/chat.js — Vercel Serverless Function (streaming)
// Streams responses from Anthropic API and logs questions to Supabase

export default async function handler(req, res) {
  const allowedOrigins = ["https://euai.app", "https://eu-ai-act-navigator.vercel.app"];
  const origin = req.headers.origin || "";
  const isAllowed = allowedOrigins.includes(origin) || /^https:\/\/euai-app-[a-z0-9]+-[a-z0-9-]+\.vercel\.app$/.test(origin);
  res.setHeader("Access-Control-Allow-Origin", isAllowed ? origin : allowedOrigins[0]);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { messages, context, sessionId, question } = req.body || {};
  if (!messages || !question) return res.status(400).json({ error: "Missing required fields" });
  if (!process.env.ANTHROPIC_API_KEY) return res.status(500).json({ error: "API key not configured" });

  // Input validation: limit message count and length
  if (!Array.isArray(messages) || messages.length > 20) return res.status(400).json({ error: "Too many messages" });
  if (typeof question !== "string" || question.length > 2000) return res.status(400).json({ error: "Question too long" });
  if (context && typeof context !== "string") return res.status(400).json({ error: "Invalid context" });
  if (context && context.length > 10000) return res.status(400).json({ error: "Context too long" });
  for (const m of messages) {
    if (!m || typeof m.content !== "string" || m.content.length > 5000) return res.status(400).json({ error: "Invalid message" });
    if (!["user", "assistant"].includes(m.role)) return res.status(400).json({ error: "Invalid message role" });
  }

  const systemPrompt = `You are the AI Act Advisor, an expert legal AI assistant embedded in the EU AI Act Navigator. You help compliance professionals, lawyers, DPOs, and business leaders understand and apply the EU AI Act (Regulation (EU) 2024/1689).

Your knowledge covers:
- All 113 articles and 180 recitals of the EU AI Act
- The staggered application timeline (Art 5 prohibitions from Feb 2025, GPAI from Aug 2025, high-risk from Aug 2026)
- Classification of high-risk AI systems (Annex I product safety route and Annex III use-case route)
- Obligations for providers, deployers, importers, distributors, and authorised representatives
- General-purpose AI model rules (Articles 51-56)
- Conformity assessment procedures
- Penalty framework (up to EUR 35M / 7% turnover for prohibited practices)

Guidelines:
1. Always cite specific article numbers using the format "Article X" (no underscores or brackets around article references).
2. Be precise about WHO an obligation applies to (provider vs deployer vs importer etc.)
3. When discussing timelines, reference Article 113 and give specific dates.
4. When classifying risk, walk through Article 6 systematically.
5. Be concise but thorough — this audience is professional.
6. If asked about something outside the EU AI Act, briefly note the relevant framework (GDPR, Product Liability Directive, etc.) but focus on the AI Act.
7. Where relevant, mention the plain English summary is available by clicking the Plain English button on the article page.

Formatting rules — you are responding in a chat panel, not a document:
- Do NOT use # or ## markdown headers. Instead use **bold text** for section labels.
- Use short paragraphs separated by blank lines.
- Use bullet points (- ) for lists, but keep them concise.
- Use **bold** for emphasis, not underscores.
- Keep responses focused and scannable. Aim for 150-300 words unless the question demands more detail.

${context || ""}

Respond in clear, structured prose suitable for a chat interface. Reference specific articles by number.`;

  try {
    const anthropicResp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5-20250929",
        max_tokens: 1000,
        stream: true,
        system: systemPrompt,
        messages: messages.map(m => ({ role: m.role, content: m.content })),
      }),
    });

    if (!anthropicResp.ok) {
      const errText = await anthropicResp.text();
      console.error("Anthropic API error:", anthropicResp.status, errText);
      return res.status(502).json({ error: "AI service temporarily unavailable" });
    }

    // Set up SSE streaming to client
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    let fullResponse = "";
    const reader = anthropicResp.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const data = line.slice(6);
        if (data === "[DONE]") continue;

        try {
          const event = JSON.parse(data);

          if (event.type === "content_block_delta" && event.delta?.type === "text_delta") {
            const text = event.delta.text;
            fullResponse += text;
            res.write("data: " + JSON.stringify({ text }) + "\n\n");
          }

          if (event.type === "message_stop") {
            res.write("data: [DONE]\n\n");
          }
        } catch (e) {
          // Skip malformed JSON chunks
        }
      }
    }

    res.end();

    // Log to Supabase after stream completes
    const topic = classifyTopic(question);
    logToSupabase(question, fullResponse, sessionId, context, topic).catch(e => {
      console.error("Supabase log error:", e.message || e);
    });

  } catch (e) {
    console.error("Chat API error:", e.message || e);
    if (!res.headersSent) {
      return res.status(500).json({ error: "Internal server error" });
    }
    res.end();
  }
}

const TOPIC_RULES = [
  { topic: "high_risk", patterns: ["high.risk", "annex.i", "annex.iii", "article 6", "article 7", "classif"] },
  { topic: "fria", patterns: ["fria", "fundamental.right", "impact.assessment", "article 27"] },
  { topic: "roles", patterns: ["provider", "deployer", "importer", "distributor", "authorised.rep", "difference.between"] },
  { topic: "timeline", patterns: ["timeline", "deadline", "when.do", "when.does", "entry.into.force", "application.date", "take.effect", "article 113"] },
  { topic: "gpai", patterns: ["gpai", "general.purpose", "foundation.model", "article 51", "article 52", "article 53", "article 54", "article 55", "article 56", "systemic.risk"] },
  { topic: "prohibited", patterns: ["prohibit", "banned", "article 5", "social.scor", "manipulat", "biometric.categori"] },
  { topic: "penalties", patterns: ["penalt", "fine", "sanction", "enforce", "article 99", "article 100", "article 101"] },
  { topic: "conformity", patterns: ["conformity", "notified.bod", "ce.mark", "self.assess", "article 43"] },
  { topic: "transparency", patterns: ["transparen", "disclos", "label", "deepfake", "ai.generated", "article 50"] },
  { topic: "governance", patterns: ["governance", "ai.office", "national.authority", "competent.authority", "article 64", "article 65"] },
];

function classifyTopic(question) {
  const q = question.toLowerCase();
  for (const { topic, patterns } of TOPIC_RULES) {
    if (patterns.some(p => new RegExp(p, "i").test(q))) return topic;
  }
  return null;
}

async function logToSupabase(question, response, sessionId, context, topic) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
  if (!supabaseUrl || !supabaseKey) return;

  const resp = await fetch(supabaseUrl + "/rest/v1/chat_logs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": supabaseKey,
      "Authorization": "Bearer " + supabaseKey,
      "Prefer": "return=minimal",
    },
    body: JSON.stringify({
      question,
      response: response.substring(0, 5000),
      session_id: sessionId || null,
      context: context || null,
      topic: topic || null,
      created_at: new Date().toISOString(),
    }),
  });

  if (!resp.ok) {
    const errBody = await resp.text();
    console.error("Supabase insert failed:", resp.status, errBody);
  }
}
