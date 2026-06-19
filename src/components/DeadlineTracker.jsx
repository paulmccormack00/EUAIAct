import { useState, useEffect } from "react";
import { SANS, SERIF, COLORS, RADIUS, SHADOWS, API_BASE } from "../constants.js";
import { DEADLINES } from "../data/timeline.js";
import EmailSubscribeForm from "./EmailSubscribeForm.jsx";

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

const COPY_ROLES = ["Provider", "Deployer", "Importer", "Distributor", "Affected person", "Other"];

export default function DeadlineTracker({ onArticleClick, onBlogClick }) {
  const [expandedIdx, setExpandedIdx] = useState(null);

  // "Email me a copy" form state
  const [emailFormOpen, setEmailFormOpen] = useState(false);
  const [copyEmail, setCopyEmail] = useState("");
  const [copyName, setCopyName] = useState("");
  const [copyRole, setCopyRole] = useState("");
  const [copyStatus, setCopyStatus] = useState(null); // null | "sending" | "sent" | "error"
  const [copyError, setCopyError] = useState("");

  const submitEmailCopy = async (e) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(copyEmail)) {
      setCopyStatus("error"); setCopyError("Please enter a valid email address.");
      return;
    }
    setCopyStatus("sending"); setCopyError("");
    try {
      const res = await fetch(`${API_BASE}/api/email-timeline`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: copyEmail, name: copyName, role: copyRole }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong. Please try again.");
      }
      setCopyStatus("sent");
    } catch (err) {
      setCopyStatus("error"); setCopyError(err.message || "Something went wrong. Please try again.");
    }
  };

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
          <span suppressHydrationWarning>{daysToTransparency > 0 ? `${daysToTransparency} days until transparency obligations apply` : "Transparency obligations now in force"}</span>
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
          <p suppressHydrationWarning style={{ fontSize: 36, fontWeight: 400, margin: 0, fontFamily: SERIF, color: COLORS.warmGold }}>
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
          <p suppressHydrationWarning style={{ fontSize: 36, fontWeight: 400, margin: 0, fontFamily: SERIF, color: COLORS.warmGold }}>
            {daysToFria > 0 ? daysToFria : "—"} <span style={{ fontSize: 13, opacity: 0.7, fontFamily: SANS, color: COLORS.primary }}>{daysToFria > 0 ? "days remaining" : "in force"}</span>
          </p>
        </div>
      </div>

      {/* Take it with you — download / email the PDF */}
      <div style={{
        marginBottom: 36, padding: "22px 24px", background: COLORS.white,
        borderRadius: RADIUS.xxl, border: `1px solid ${COLORS.borderDefault}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 240px" }}>
            <h2 style={{ fontSize: 18, fontWeight: 500, color: COLORS.textPrimary, margin: "0 0 4px", fontFamily: SERIF }}>Take this timeline with you</h2>
            <p style={{ fontSize: 13, color: COLORS.textMuted, lineHeight: 1.5, margin: 0, fontFamily: SANS }}>A clean, print-ready PDF of every deadline — download it or have it emailed to you.</p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a
              href="/api/timeline-pdf"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 18px", minHeight: 44,
                background: COLORS.primary, color: COLORS.white, borderRadius: RADIUS.md,
                fontSize: 14, fontWeight: 600, fontFamily: SANS, textDecoration: "none", boxSizing: "border-box",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = COLORS.primaryHover; }}
              onMouseLeave={e => { e.currentTarget.style.background = COLORS.primary; }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Download PDF
            </a>
            <button
              onClick={() => { setEmailFormOpen(o => !o); setCopyStatus(null); }}
              aria-expanded={emailFormOpen}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 18px", minHeight: 44,
                background: COLORS.white, color: COLORS.primary, border: `1px solid ${COLORS.primaryLightBorder}`,
                borderRadius: RADIUS.md, fontSize: 14, fontWeight: 600, fontFamily: SANS, cursor: "pointer", boxSizing: "border-box",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = COLORS.primaryLight; }}
              onMouseLeave={e => { e.currentTarget.style.background = COLORS.white; }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 5L2 7"/></svg>
              Email me a copy
            </button>
          </div>
        </div>

        {emailFormOpen && copyStatus !== "sent" && (
          <form onSubmit={submitEmailCopy} style={{ marginTop: 18, paddingTop: 18, borderTop: `1px solid ${COLORS.borderDefault}` }}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <input
                type="text" value={copyName} onChange={e => setCopyName(e.target.value)}
                placeholder="Name (optional)" aria-label="Your name (optional)" maxLength={100}
                style={{ flex: "1 1 160px", padding: "10px 12px", fontSize: 14, fontFamily: SANS, border: `1px solid ${COLORS.borderInput}`, borderRadius: RADIUS.md, color: COLORS.textPrimary }}
              />
              <input
                type="email" required value={copyEmail} onChange={e => setCopyEmail(e.target.value)}
                placeholder="you@company.com" aria-label="Your email address"
                style={{ flex: "1 1 200px", padding: "10px 12px", fontSize: 14, fontFamily: SANS, border: `1px solid ${COLORS.borderInput}`, borderRadius: RADIUS.md, color: COLORS.textPrimary }}
              />
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
              <select
                value={copyRole} onChange={e => setCopyRole(e.target.value)} aria-label="Your role (optional)"
                style={{ flex: "1 1 200px", padding: "10px 12px", fontSize: 14, fontFamily: SANS, border: `1px solid ${COLORS.borderInput}`, borderRadius: RADIUS.md, color: copyRole ? COLORS.textPrimary : COLORS.textPlaceholder, background: COLORS.white }}
              >
                <option value="">Your role (optional)</option>
                {COPY_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <button
                type="submit" disabled={copyStatus === "sending"}
                style={{
                  flex: "0 0 auto", padding: "11px 22px", minHeight: 44, background: COLORS.primary, color: COLORS.white,
                  border: "none", borderRadius: RADIUS.md, fontSize: 14, fontWeight: 600, fontFamily: SANS,
                  cursor: copyStatus === "sending" ? "default" : "pointer", opacity: copyStatus === "sending" ? 0.7 : 1,
                }}
              >
                {copyStatus === "sending" ? "Sending…" : "Send the PDF"}
              </button>
            </div>
            {copyStatus === "error" && (
              <p role="alert" style={{ fontSize: 13, color: COLORS.errorText, margin: "10px 0 0", fontFamily: SANS }}>{copyError}</p>
            )}
            <p style={{ fontSize: 11, color: COLORS.textFaint, margin: "10px 0 0", fontFamily: SANS }}>
              We'll email the PDF and occasional EU AI Act deadline updates. Unsubscribe anytime.
            </p>
          </form>
        )}
        {copyStatus === "sent" && (
          <div role="status" style={{ marginTop: 16, padding: "12px 16px", background: COLORS.successBg, border: `1px solid ${COLORS.successBorder}`, borderRadius: RADIUS.md, fontSize: 13, color: COLORS.successText, fontFamily: SANS }}>
            ✓ Sent — check your inbox for the PDF{copyName ? `, ${copyName}` : ""}. (It may take a minute; check spam if you don't see it.)
          </div>
        )}
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
                          <span suppressHydrationWarning style={{ fontSize: 11, color: "#4a5f74" }}>
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
