import { useState, useEffect } from "react";
import { SANS, SERIF, COLORS, RADIUS, SHADOWS } from "../constants.js";
import EmailSubscribeForm from "./EmailSubscribeForm.jsx";

const DEADLINES = [
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

// Compute status dynamically based on current date
function getDeadlineStatus(deadline, allDeadlines) {
  if (deadline.tentative) return "tentative";
  const now = new Date();
  const target = new Date(deadline.isoDate);
  const days = Math.ceil((target - now) / 86400000);
  if (days < 0) return "passed";
  // Find the next upcoming non-tentative deadline
  const upcoming = allDeadlines
    .filter(d => !d.tentative && new Date(d.isoDate) > now)
    .sort((a, b) => new Date(a.isoDate) - new Date(b.isoDate));
  if (upcoming.length > 0 && deadline.isoDate === upcoming[0].isoDate) {
    return deadline.highlight ? "critical" : "current";
  }
  return "future";
}

function daysUntil(isoDate) {
  const target = new Date(isoDate);
  const now = new Date();
  return Math.ceil((target - now) / 86400000);
}

function getStatusColor(status) {
  switch (status) {
    case "passed": return { bg: "#f0fdf4", border: "#bbf7d0", dot: "#16a34a", text: "#166534" };
    case "current": return { bg: "#f0f4ff", border: "#c7d6ec", dot: "#1e3a5f", text: "#1e3a5f" };
    case "upcoming": return { bg: "#fffbeb", border: "#fde68a", dot: "#d97706", text: "#92400e" };
    case "critical": return { bg: "#fef2f2", border: "#fecaca", dot: "#dc2626", text: "#991b1b" };
    case "future": return { bg: "#f8fafc", border: "#e2e8f0", dot: "#4a5f74", text: "#4d5d71" };
    case "tentative": return { bg: "#faf5ff", border: "#e9d5ff", dot: "#7c3aed", text: "#5b21b6" };
    default: return { bg: "#f8fafc", border: "#e2e8f0", dot: "#4a5f74", text: "#4d5d71" };
  }
}

function getStatusLabel(status) {
  switch (status) {
    case "passed": return "Passed";
    case "current": return "Current Phase";
    case "upcoming": return "Upcoming";
    case "critical": return "Key Deadline";
    case "future": return "Future";
    case "tentative": return "Tentative";
    default: return "";
  }
}

export default function DeadlineTracker({ onArticleClick, onBlogClick }) {
  const [expandedIdx, setExpandedIdx] = useState(null);

  const transparencyDeadline = DEADLINES.find(d => d.highlight);
  const daysToTransparency = transparencyDeadline ? daysUntil(transparencyDeadline.isoDate) : 0;
  const friaDeadline = DEADLINES.find(d => d.friaPrimary);
  const daysToFria = friaDeadline ? daysUntil(friaDeadline.isoDate) : 0;

  // FAQPage structured data for timeline questions
  useEffect(() => {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "When does the EU AI Act fully apply?",
          "acceptedAnswer": { "@type": "Answer", "text": "Application is phased. Prohibited practices have applied since February 2025 and GPAI model obligations since August 2025. Article 50 transparency obligations apply from 2 August 2026. Under the Digital Omnibus amendment (agreed 7 May 2026, European Parliament-approved 16 June 2026), high-risk obligations are deferred: stand-alone Annex III systems and FRIA to 2 December 2027, and product-embedded Annex I systems to 2 August 2028. These deferrals take legal effect once the amendment is published in the Official Journal; until then the original dates remain the binding law." }
        },
        {
          "@type": "Question",
          "name": "What is the FRIA deadline under the EU AI Act?",
          "acceptedAnswer": { "@type": "Answer", "text": "Under the Digital Omnibus amendment the Fundamental Rights Impact Assessment (FRIA) deadline moves to 2 December 2027, tracking the deferred Annex III high-risk obligations. It applies to public bodies, public service providers, and credit or insurance deployers using high-risk AI systems listed in Annex III. The change takes legal effect on publication of the amendment in the Official Journal; until then the original 2 August 2026 date remains in law." }
        },
        {
          "@type": "Question",
          "name": "When do GPAI obligations apply?",
          "acceptedAnswer": { "@type": "Answer", "text": "General-purpose AI model obligations under Articles 53-55 have applied since 2 August 2025. All GPAI model providers placing models on the EU market must comply with technical documentation, copyright policy, and training data summary requirements." }
        },
        {
          "@type": "Question",
          "name": "What are the penalties for non-compliance with the EU AI Act?",
          "acceptedAnswer": { "@type": "Answer", "text": "Penalties reach up to EUR 35 million or 7% of global annual turnover for prohibited practice violations under Article 5. Other infringements carry fines up to EUR 15 million or 3% of turnover. SME economic viability must be considered." }
        },
        {
          "@type": "Question",
          "name": "Which AI practices are already banned under the EU AI Act?",
          "acceptedAnswer": { "@type": "Answer", "text": "Eight AI practices have been banned since 2 February 2025 under Article 5: subliminal manipulation, exploitation of vulnerabilities, social scoring, predictive policing based on profiling, untargeted facial image scraping, workplace and education emotion recognition, biometric categorisation for sensitive attributes, and real-time remote biometric identification in public spaces." }
        },
        {
          "@type": "Question",
          "name": "Will the Digital Omnibus change EU AI Act deadlines?",
          "acceptedAnswer": { "@type": "Answer", "text": "Yes. The Digital Omnibus on AI was provisionally agreed on 7 May 2026 and approved by the European Parliament in plenary on 16 June 2026 (423 in favour). It defers the high-risk obligations to 2 December 2027 (Annex III, including FRIA) and 2 August 2028 (Annex I), adds a new Article 5 ban on nudifier and CSAM tools, and simplifies several obligations. Formal Council adoption and publication in the Official Journal are still pending; until publication the original AI Act dates remain the binding law, so organisations should continue preparing." }
        }
      ]
    };
    let el = document.getElementById("timeline-faq-jsonld");
    if (!el) {
      el = document.createElement("script");
      el.type = "application/ld+json";
      el.id = "timeline-faq-jsonld";
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(faqSchema);
    return () => { el.remove(); };
  }, []);

  return (
    <div style={{ maxWidth: 820, margin: "0 auto", padding: "40px 0" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 16px", background: "#f0f4ff", border: "1px solid #c7d6ec", borderRadius: 20, fontSize: 12, color: "#1e3a5f", fontWeight: 600, marginBottom: 16, fontFamily: SANS }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          {daysToTransparency > 0 ? `${daysToTransparency} days until transparency obligations apply` : "Transparency obligations now in force"}
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 400, color: "#1a1a1a", margin: "0 0 8px", fontFamily: SERIF }}>
          EU AI Act Compliance Timeline
        </h1>
        <p style={{ fontSize: 15, color: "#4d5d71", lineHeight: 1.6, maxWidth: 600, margin: "0 auto", fontFamily: SANS }}>
          Every deadline you need to know — from prohibited practices to the high-risk framework. Track milestones, understand obligations, and prepare your organisation.
        </p>
      </div>

      {/* Digital Omnibus status banner */}
      <div style={{
        marginBottom: 28, padding: "18px 22px", background: "#fffbeb", borderRadius: 12,
        border: "1px solid #fde68a", borderLeft: "4px solid #d97706",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b45309" strokeWidth="2" aria-hidden="true"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#92400e", fontFamily: SANS }}>High-risk deadlines deferred — amendment agreed, not yet published</span>
        </div>
        <p style={{ fontSize: 13, color: "#92400e", lineHeight: 1.6, margin: "0 0 8px", fontFamily: SANS }}>
          The <strong>Digital Omnibus on AI</strong> was provisionally agreed on <strong>7 May 2026</strong> and approved by the European Parliament in plenary on <strong>16 June 2026</strong> (423 / 57 / 174). It moves the high-risk obligations to <strong>2 December 2027</strong> (Annex III, including FRIA) and <strong>2 August 2028</strong> (Annex I), and adds a new Article 5 ban on “nudifier”/CSAM tools.
        </p>
        <p style={{ fontSize: 13, color: "#92400e", lineHeight: 1.6, margin: "0 0 10px", fontFamily: SANS }}>
          Formal Council adoption and publication in the <strong>Official Journal</strong> are still pending. <strong>Until publication, the original AI Act dates remain the binding law</strong> — so keep preparing. Deadlines marked “Pending OJ” below take legal effect on publication.
        </p>
        <button
          onClick={() => onBlogClick?.("digital-omnibus-new-eu-ai-act-deadlines")}
          style={{
            display: "inline-flex", alignItems: "center", gap: 6, padding: 0, background: "none",
            border: "none", cursor: "pointer", fontFamily: SANS, fontSize: 13, fontWeight: 600,
            color: "#92400e", textDecoration: "underline",
          }}
        >
          Read the full analysis: The Digital Omnibus and the new deadlines →
        </button>
      </div>

      {/* Countdown hero — two figures */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginBottom: 36,
      }}>
        <div style={{
          background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryHover} 50%, ${COLORS.primary} 100%)`,
          borderRadius: RADIUS.round, padding: "26px 28px", color: "white",
        }}>
          <p style={{ fontSize: 12, opacity: 0.7, margin: "0 0 4px", fontFamily: SANS, textTransform: "uppercase", letterSpacing: "0.1em" }}>Transparency Obligations</p>
          <p style={{ fontSize: 28, fontWeight: 400, margin: "0 0 4px", fontFamily: SERIF }}>2 August 2026</p>
          <p style={{ fontSize: 13, opacity: 0.85, margin: "0 0 10px", fontFamily: SANS }}>Article 50 — disclose AI; mark synthetic content</p>
          <p style={{ fontSize: 36, fontWeight: 400, margin: 0, fontFamily: SERIF, color: COLORS.warmGold }}>
            {daysToTransparency > 0 ? daysToTransparency : "—"} <span style={{ fontSize: 13, opacity: 0.7, fontFamily: SANS, color: "white" }}>{daysToTransparency > 0 ? "days remaining" : "in force"}</span>
          </p>
        </div>
        <div style={{
          background: COLORS.white, border: `1px solid ${COLORS.borderDefault}`, borderLeft: `4px solid ${COLORS.primary}`,
          borderRadius: RADIUS.round, padding: "26px 28px", color: COLORS.primary,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <p style={{ fontSize: 12, opacity: 0.7, margin: 0, fontFamily: SANS, textTransform: "uppercase", letterSpacing: "0.1em" }}>High-Risk &amp; FRIA</p>
            <span style={{ fontSize: 10, fontWeight: 700, padding: "1px 8px", borderRadius: 20, background: "#faf5ff", color: "#5b21b6", border: "1px solid #e9d5ff" }}>Pending OJ</span>
          </div>
          <p style={{ fontSize: 28, fontWeight: 400, margin: "0 0 4px", fontFamily: SERIF }}>2 December 2027</p>
          <p style={{ fontSize: 13, opacity: 0.8, margin: "0 0 10px", fontFamily: SANS }}>Article 27 — Annex III high-risk &amp; FRIA</p>
          <p style={{ fontSize: 36, fontWeight: 400, margin: 0, fontFamily: SERIF, color: COLORS.warmGold }}>
            {daysToFria > 0 ? daysToFria : "—"} <span style={{ fontSize: 13, opacity: 0.7, fontFamily: SANS, color: COLORS.primary }}>{daysToFria > 0 ? "days remaining" : "in force"}</span>
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div style={{ position: "relative", paddingLeft: 32 }}>
        {/* Vertical line */}
        <div style={{ position: "absolute", left: 11, top: 8, bottom: 8, width: 2, background: "#e8e4de" }} />

        {DEADLINES.map((deadline, idx) => {
          const status = getDeadlineStatus(deadline, DEADLINES);
          const colors = getStatusColor(status);
          const expanded = expandedIdx === idx;
          const days = daysUntil(deadline.isoDate);
          const isPast = days < 0;

          return (
            <div key={idx} style={{ position: "relative", marginBottom: 16 }}>
              {/* Dot */}
              <div style={{
                position: "absolute", left: -27, top: 24, width: 14, height: 14, borderRadius: "50%",
                background: colors.dot, border: "3px solid white",
                boxShadow: deadline.highlight ? `0 0 0 4px ${colors.dot}33` : "0 0 0 2px #e8e4de",
                zIndex: 1,
              }} />

              {/* Card */}
              <div
                style={{
                  width: "100%", textAlign: "left",
                  background: expanded ? colors.bg : "white",
                  border: `1px solid ${expanded ? colors.border : "#e8e4de"}`,
                  borderRadius: 14, fontFamily: SANS,
                  transition: "all 0.2s", boxShadow: expanded ? "0 4px 16px rgba(0,0,0,0.06)" : "none",
                  borderLeft: deadline.highlight ? `4px solid ${colors.dot}` : `1px solid ${expanded ? colors.border : "#e8e4de"}`,
                  overflow: "hidden",
                }}
              >
                <button
                  onClick={() => setExpandedIdx(expanded ? null : idx)}
                  aria-expanded={expanded}
                  style={{
                    width: "100%", textAlign: "left", padding: "20px 24px",
                    background: "transparent", border: "none", cursor: "pointer", fontFamily: SANS,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a" }}>{deadline.date}</span>
                        <span style={{
                          fontSize: 11, fontWeight: 600, padding: "2px 10px", borderRadius: 20,
                          background: colors.bg, color: colors.text, border: `1px solid ${colors.border}`,
                        }}>
                          {getStatusLabel(status)}
                        </span>
                        {deadline.pending && (
                          <span style={{
                            fontSize: 11, fontWeight: 600, padding: "2px 10px", borderRadius: 20,
                            background: "#faf5ff", color: "#5b21b6", border: "1px solid #e9d5ff",
                          }}>
                            Pending OJ
                          </span>
                        )}
                        {!isPast && status !== "passed" && (
                          <span style={{ fontSize: 11, color: "#4a5f74" }}>
                            {days} days
                          </span>
                        )}
                      </div>
                      <h2 style={{ fontSize: 17, fontWeight: 600, color: "#1a1a1a", margin: "0 0 6px" }}>{deadline.title}</h2>
                      <p style={{ fontSize: 13, color: "#4d5d71", lineHeight: 1.6, margin: 0 }}>{deadline.description}</p>
                    </div>
                    <svg
                      width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4a5f74" strokeWidth="2" aria-hidden="true"
                      style={{ flexShrink: 0, marginTop: 4, transition: "transform 0.2s", transform: expanded ? "rotate(180deg)" : "none" }}
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </div>
                </button>

                {expanded && (
                  <div style={{ padding: "0 24px 20px", borderTop: `1px solid ${colors.border}` }}>
                    <ul style={{ margin: "16px 0 0", paddingLeft: 20, fontSize: 13, color: "#374151", lineHeight: 1.8 }}>
                      {deadline.details.map((detail, i) => (
                        <li key={i}>{detail}</li>
                      ))}
                    </ul>
                    {deadline.articles.length > 0 && (
                      <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                        {deadline.articles.map((art) => {
                          const match = art.match(/Article[s]?\s+(\d+)/);
                          const artNum = match ? Number(match[1]) : null;
                          return (
                            <button
                              key={art}
                              onClick={() => { if (artNum) onArticleClick?.(artNum); }}
                              style={{
                                padding: "4px 12px", background: "white", border: "1px solid #c7d6ec",
                                borderRadius: 6, fontSize: 12, color: "#1e3a5f", fontWeight: 500,
                                cursor: artNum ? "pointer" : "default", fontFamily: SANS,
                              }}
                            >
                              {art}
                            </button>
                          );
                        })}
                      </div>
                    )}
                    {deadline.links && deadline.links.length > 0 && (
                      <div style={{ marginTop: 12 }}>
                        <p style={{ fontSize: 11, color: "#4a5f74", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700, margin: "0 0 6px", fontFamily: SANS }}>Resources</p>
                        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                          {deadline.links.map((link) => (
                            <a
                              key={link.url}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ fontSize: 12, color: "#1e3a5f", textDecoration: "underline", fontFamily: SANS }}
                            >
                              {link.label} ↗
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Email alerts */}
      <div style={{
        marginTop: 36, padding: "28px 32px", background: COLORS.white, borderRadius: RADIUS.xxl,
        border: `1px solid ${COLORS.borderDefault}`, borderLeft: `4px solid ${COLORS.primary}`,
      }}>
        <EmailSubscribeForm
          heading="Get Deadline Alerts"
          description="Be notified when key deadlines approach and when the official FRIA template is published."
          submitLabel="Subscribe"
          loadingLabel="Subscribing…"
          successMessage="You're subscribed to deadline alerts."
          compact
        />
      </div>

      {/* Digital Omnibus Note */}
      <div style={{
        marginTop: 24, padding: "20px 24px", background: "#faf5ff", borderRadius: 12,
        border: "1px solid #e9d5ff",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#5b21b6", fontFamily: SANS }}>Digital Omnibus Watch</span>
        </div>
        <p style={{ fontSize: 13, color: "#6b21a8", lineHeight: 1.6, margin: "0 0 8px", fontFamily: SANS }}>
          The Digital Omnibus on AI was provisionally agreed on <strong>7 May 2026</strong>, confirmed by Coreper on 13 May 2026, cleared the IMCO and LIBE committees on 2 June 2026, and was approved by the European Parliament in plenary on <strong>16 June 2026</strong>. It defers the high-risk obligations (Annex III to 2 December 2027; Annex I to 2 August 2028), adds an Article 5 ban on “nudifier”/CSAM tools, softens the AI literacy duty, and expands the AI Office's competence and enforcement powers.
        </p>
        <p style={{ fontSize: 13, color: "#6b21a8", lineHeight: 1.6, margin: 0, fontFamily: SANS }}>
          Formal Council adoption and publication in the Official Journal are still pending. <strong>Until publication, the original AI Act dates remain the binding law</strong> — deadline relief is not a reason to delay preparation.
        </p>
      </div>

      {/* Last reviewed stamp */}
      <p style={{ marginTop: 20, textAlign: "center", fontSize: 12, color: "#94a3b8", fontFamily: SANS }}>
        Last reviewed: 19 June 2026 · Reflects the Digital Omnibus as approved by the European Parliament on 16 June 2026 (publication in the Official Journal pending).
      </p>
    </div>
  );
}
