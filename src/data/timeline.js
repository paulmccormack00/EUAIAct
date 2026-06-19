// Single source of truth for the EU AI Act compliance timeline.
// Imported by the on-screen tracker (DeadlineTracker.jsx) AND the server-side
// PDF generator (api/_timeline-pdf.js), so the page and the downloadable/emailed
// PDF can never drift apart.

export const DEADLINES = [
  {
    date: "1 August 2024",
    isoDate: "2024-08-01",
    title: "Entry into Force",
    description: "The EU AI Act (Regulation (EU) 2024/1689) entered into force, starting the phased implementation timeline.",
    articles: ["Article 113"],
    details: [
      "Published in the Official Journal on 12 July 2024",
      "20-day period before entry into force",
      "Sets the clock for all subsequent deadlines",
    ],
  },
  {
    date: "2 February 2025",
    isoDate: "2025-02-02",
    title: "Prohibited AI Practices & AI Literacy",
    description: "Prohibitions on unacceptable-risk AI practices take effect. AI literacy obligations begin for providers and deployers.",
    articles: ["Article 5", "Article 4"],
    details: [
      "Ban on social scoring, manipulative AI, emotion recognition in workplaces/schools, real-time biometric identification (with exceptions)",
      "Organisations must ensure staff have sufficient AI literacy",
      "6-month transition from entry into force",
      "Pending Digital Omnibus change: the AI literacy duty (Art 4) is being softened from \"ensure\" to \"take measures to support the development of\" literacy; a new Art 5 prohibition on \"nudifier\"/CSAM tools is being added (see 2 December 2026)",
    ],
  },
  {
    date: "2 August 2025",
    isoDate: "2025-08-02",
    title: "GPAI, Governance, Notified Bodies & Penalties",
    description: "General-purpose AI model rules apply. EU AI governance structure and notified bodies framework become operational. Penalty framework is enforceable.",
    articles: ["Articles 28-39", "Articles 51-56", "Articles 64-65", "Article 99"],
    details: [
      "GPAI providers must comply with transparency, documentation, and copyright obligations",
      "Systemic risk GPAI models face additional requirements (adversarial testing, incident reporting)",
      "EU AI Office, AI Board, and national competent authorities fully operational",
      "Notified bodies framework operational — Member States must designate notifying authorities (Chapter III, Section 4)",
      "Notified bodies perform third-party conformity assessments for certain high-risk AI systems",
      "Penalties: up to EUR 35M / 7% turnover for prohibited practices; EUR 15M / 3% for other violations",
      "12-month transition from entry into force",
      "Pending Digital Omnibus change: the AI Office gains exclusive competence over AI built on a provider's own GPAI model and over AI in VLOPs/VLOSEs, plus inspection, binding-commitment and fining powers",
    ],
  },
  {
    date: "2 February 2026",
    isoDate: "2026-02-02",
    title: "Commission Guidelines & Templates",
    description: "The European Commission was required to publish guidelines on high-risk AI classification rules (Article 6) and the post-market monitoring plan template (Article 72). The Article 6 guidelines were published in draft on 19 May 2026; the Article 72 template remains outstanding.",
    articles: ["Article 6", "Article 72"],
    details: [
      "Draft Commission guidelines on Article 6 classification rules for high-risk AI published 19 May 2026 — public consultation open until 23 July 2026",
      "Post-market monitoring plan template (Article 72 implementing act) — still not published",
      "These support providers preparing for the high-risk obligations (now deferred to 2 December 2027 / 2 August 2028 under the Digital Omnibus)",
      "18-month transition from entry into force",
    ],
    links: [
      { label: "Draft Commission guidelines — Article 6 high-risk classification (19 May 2026)", url: "https://digital-strategy.ec.europa.eu/en/library/draft-commission-guidelines-classification-high-risk-ai-systems" },
      { label: "Commission AI Act guidance page", url: "https://digital-strategy.ec.europa.eu/en/news/supporting-implementation-ai-act-clear-guidelines" },
      { label: "Article 6 — AI Act Service Desk", url: "https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-6" },
      { label: "Article 72 — AI Act Service Desk", url: "https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-72" },
    ],
  },
  {
    date: "2 August 2026",
    isoDate: "2026-08-02",
    title: "Transparency Obligations (Article 50)",
    description: "Article 50 transparency duties apply: people must be told when they are interacting with an AI system, and AI-generated or manipulated content (deepfakes, synthetic audio/images/text) must be marked as such. Under the Digital Omnibus, high-risk obligations and FRIA are NO LONGER due on this date — they are deferred to December 2027 / August 2028.",
    articles: ["Article 50"],
    details: [
      "Providers must disclose when content is AI-generated and ensure synthetic output is machine-readable as artificially generated",
      "Deployers must inform people when they interact with AI (e.g. chatbots) and label deepfakes and AI-generated text on matters of public interest",
      "Important: this was previously billed as \"full application / high-risk\" — that is no longer correct. High-risk system obligations, conformity assessment and FRIA move to 2 December 2027 (Annex III) and 2 August 2028 (Annex I)",
      "24-month transition from entry into force",
      "Note: until the Digital Omnibus is published in the Official Journal, the original AI Act dates remain the binding law — see status banner above",
    ],
    highlight: true,
  },
  {
    date: "2 December 2026",
    isoDate: "2026-12-02",
    title: "New Prohibition & Watermarking Grace Ends",
    description: "A new Article 5 prohibition takes effect targeting AI that generates non-consensual intimate imagery (\"nudifier\" apps) and child sexual abuse material. The Article 50(2) watermarking grace period also ends for systems placed on the market before 2 August 2026.",
    articles: ["Article 5", "Article 50"],
    details: [
      "New Art 5 ban on AI tools designed to produce non-consensual intimate images and CSAM",
      "Art 50(2) machine-readable marking of AI-generated content must be in place even for systems that were already on the market before 2 August 2026",
      "Introduced by the Digital Omnibus (agreed 7 May 2026, Parliament-approved 16 June 2026)",
    ],
    pending: true,
  },
  {
    date: "2 August 2027",
    isoDate: "2027-08-02",
    title: "Legacy GPAI Compliance & National Sandboxes",
    description: "GPAI models placed on the market before 2 August 2025 must be brought into compliance (Article 111). Member States must have at least one AI regulatory sandbox operational by this date.",
    articles: ["Article 111", "Article 57"],
    details: [
      "GPAI models placed on market before 2 August 2025 must have completed compliance steps (Art 111) — unchanged by the Digital Omnibus",
      "Each Member State must establish at least one operational AI regulatory sandbox (Art 57) — moved here from 2 August 2026",
      "Annex I product-embedded high-risk obligations are NOT due here — they move to 2 August 2028",
      "36-month transition from entry into force",
    ],
  },
  {
    date: "2 December 2027",
    isoDate: "2027-12-02",
    title: "High-Risk (Annex III) & FRIA",
    description: "Stand-alone (Annex III) high-risk AI obligations apply, including the full provider and deployer framework, conformity assessment, and Fundamental Rights Impact Assessments (FRIA) under Article 27. Deferred 16 months from the original 2 August 2026 date by the Digital Omnibus.",
    articles: ["Article 6", "Articles 8-15", "Article 26", "Article 27", "Article 43"],
    details: [
      "High-risk AI systems must comply with Articles 8-15 (risk management, data governance, documentation, transparency, human oversight, accuracy, robustness, cybersecurity)",
      "Deployers of Annex III high-risk AI must conduct FRIAs under Article 27 (public bodies, public-service providers, and credit/insurance deployers)",
      "Provider obligations: quality management, conformity assessment, CE marking, EU database registration",
      "Deployer obligations under Article 26: human oversight, monitoring, logging, incident reporting",
      "New fixed date set by the Digital Omnibus — replaces the original 2 August 2026 high-risk deadline",
    ],
    pending: true,
    friaPrimary: true,
  },
  {
    date: "2 August 2028",
    isoDate: "2028-08-02",
    title: "High-Risk Embedded in Products (Annex I)",
    description: "High-risk AI systems embedded in products covered by EU harmonised safety legislation (Annex I) must comply. Deferred 12 months from the original 2 August 2027 date by the Digital Omnibus.",
    articles: ["Article 6(1)", "Annex I"],
    details: [
      "Covers AI in: machinery, toys, lifts, medical devices, civil aviation, motor vehicles, marine equipment, rail systems",
      "These AI systems follow the Article 6(1) route — classified as high-risk through existing product safety frameworks",
      "Under the Digital Omnibus, the Machinery Regulation moves to Annex I Section B (sectoral safety rules take precedence over dual compliance)",
      "New fixed date set by the Digital Omnibus — replaces the original 2 August 2027 Annex I deadline",
    ],
    pending: true,
  },
];

// Supporting copy for the PDF / email (mirrors the on-page status banner).
export const TIMELINE_META = {
  title: "EU AI Act Compliance Timeline",
  subtitle: "Every deadline from entry into force to the high-risk framework — updated for the Digital Omnibus.",
  lastReviewed: "19 June 2026",
  omnibusNote:
    "The Digital Omnibus on AI was provisionally agreed on 7 May 2026 and approved by the European Parliament in plenary on 16 June 2026 (423 / 57 / 174). It defers the high-risk obligations to 2 December 2027 (Annex III, including FRIA) and 2 August 2028 (Annex I), and adds a new Article 5 ban on \"nudifier\"/CSAM tools. Formal Council adoption and publication in the Official Journal are still pending — until publication, the original AI Act dates remain the binding law, so keep preparing. Deadlines marked \"Pending OJ\" take legal effect on publication.",
  sources: [
    "European Commission press release IP/26/1024 (7 May 2026)",
    "Council of the EU press release (7 May 2026)",
    "European Parliament — AI Act simplification deal & plenary approval (16 June 2026)",
    "Draft Commission guidelines on Article 6 high-risk classification (19 May 2026)",
    "Gibson Dunn; Covington / Global Policy Watch; White & Case; Bird & Bird analyses",
  ],
};
