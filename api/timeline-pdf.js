// GET /api/timeline-pdf — streams the EU AI Act compliance timeline as a PDF
// for direct download (no email required).
import rateLimit from "./_rate-limit.js";
import { renderTimelinePdf } from "./_timeline-pdf.js";

export default async function handler(req, res) {
  if (!rateLimit(req, res, { limit: 30, windowMs: 60_000 })) return;
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  try {
    const pdf = await renderTimelinePdf();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="EU-AI-Act-Compliance-Timeline.pdf"');
    res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=86400");
    res.statusCode = 200;
    return res.end(pdf);
  } catch (e) {
    console.error("timeline-pdf error:", e?.message || e);
    return res.status(500).json({ error: "Could not generate the PDF. Please try again." });
  }
}
