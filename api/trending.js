// Curated prompt library — maps topic keys to anonymised, pre-written prompts
const PROMPT_LIBRARY = {
  high_risk: [
    "Does my AI system count as high-risk?",
    "How do I classify a high-risk AI system under Article 6?",
    "What obligations apply to high-risk AI providers?",
  ],
  fria: [
    "What are my FRIA obligations under Article 27?",
    "Who needs to carry out a fundamental rights impact assessment?",
    "What should a fundamental rights impact assessment cover?",
  ],
  roles: [
    "What's the difference between a provider and deployer?",
    "What are a deployer's key obligations under the AI Act?",
    "When does a deployer become a provider?",
  ],
  timeline: [
    "When do the high-risk AI rules take effect?",
    "What's the full EU AI Act application timeline?",
    "Which provisions are already in force?",
  ],
  gpai: [
    "What are the GPAI model obligations?",
    "Does the AI Act apply to general-purpose AI like ChatGPT?",
    "What's the difference between GPAI and high-risk AI?",
  ],
  prohibited: [
    "What AI practices are banned under Article 5?",
    "Is social scoring prohibited in the EU?",
    "What are the penalties for prohibited AI practices?",
  ],
  penalties: [
    "What fines can be imposed under the AI Act?",
    "How are AI Act penalties calculated?",
    "What's the maximum fine for non-compliance?",
  ],
  conformity: [
    "How does conformity assessment work for AI systems?",
    "Do I need a notified body for my AI system?",
    "What's the self-assessment route for high-risk AI?",
  ],
  transparency: [
    "What are the transparency obligations for AI systems?",
    "Do I need to disclose that content is AI-generated?",
    "What labelling rules apply to deepfakes?",
  ],
  governance: [
    "How is the EU AI Act enforced?",
    "What role does the AI Office play?",
    "Which national authority enforces the AI Act?",
  ],
};

const DEFAULT_PROMPTS = [
  "Does my AI system count as high-risk?",
  "What are my FRIA obligations under Article 27?",
  "What's the difference between a provider and deployer?",
  "When do the high-risk AI rules take effect?",
];

import rateLimit from "./_rate-limit.js";

export default async function handler(req, res) {
  if (!rateLimit(req, res, { limit: 30, windowMs: 60_000 })) return;

  const allowedOrigins = ["https://euai.app", "https://eu-ai-act-navigator.vercel.app"];
  const origin = req.headers.origin || "";
  const isAllowed = allowedOrigins.includes(origin) || /^https:\/\/euai-app-[a-z0-9]+-[a-z0-9-]+\.vercel\.app$/.test(origin);
  res.setHeader("Access-Control-Allow-Origin", isAllowed ? origin : allowedOrigins[0]);
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return res.status(200).json({ prompts: DEFAULT_PROMPTS });
  }

  try {
    // Query topic counts from last 14 days
    const since = new Date(Date.now() - 14 * 86400000).toISOString();
    const resp = await fetch(
      `${supabaseUrl}/rest/v1/chat_logs?select=topic&topic=not.is.null&created_at=gte.${since}`,
      {
        headers: {
          "apikey": supabaseKey,
          "Authorization": "Bearer " + supabaseKey,
        },
      }
    );

    if (!resp.ok) {
      console.error("Supabase query failed:", resp.status);
      return res.status(200).json({ prompts: DEFAULT_PROMPTS });
    }

    const rows = await resp.json();

    if (!rows || rows.length < 10) {
      // Not enough data yet — return defaults
      return res.status(200).json({ prompts: DEFAULT_PROMPTS });
    }

    // Count topics
    const counts = {};
    for (const row of rows) {
      if (row.topic && PROMPT_LIBRARY[row.topic]) {
        counts[row.topic] = (counts[row.topic] || 0) + 1;
      }
    }

    // Sort by frequency, pick top 4
    const topTopics = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([topic]) => topic);

    if (topTopics.length < 4) {
      return res.status(200).json({ prompts: DEFAULT_PROMPTS });
    }

    // Pick one random prompt per topic
    const prompts = topTopics.map(topic => {
      const options = PROMPT_LIBRARY[topic];
      return options[Math.floor(Math.random() * options.length)];
    });

    // Cache for 1 hour
    res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=7200");
    return res.status(200).json({ prompts });

  } catch (err) {
    console.error("Trending error:", err);
    return res.status(200).json({ prompts: DEFAULT_PROMPTS });
  }
}
