import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { SANS, SERIF, COLORS, RADIUS, SHADOWS } from "../constants.js";
import { ROLES } from "../data/roles.js";

const RELATIONSHIP_OPTIONS = [
  { id: "develops", label: "We develop, train, or commission AI systems", signal: "provider", icon: "🏗",
    examples: "This covers a wide range. Typical examples include: a SaaS company building AI-powered HR screening tools; a healthtech firm developing diagnostic imaging software; a fintech startup creating credit-scoring algorithms. It also applies if you integrate a GPAI model (e.g. GPT, Claude, Gemini) via API into a product or service you offer — this makes you a 'downstream provider' under Art. 3(68), even without training your own model. Commissioning a third party to build AI that you then offer under your brand also counts. Note: 'placing on the market' and 'putting into service' are both captured — so internal-only AI tools developed for your own organisation's use also qualify." },
  { id: "usesProfessionally", label: "We use AI systems in our professional activities", signal: "deployer", icon: "⚙",
    examples: "'Professional' means any business or organisational activity — not limited to regulated professions like law or accountancy. Typical examples: a bank using a third-party AI tool for credit-risk assessment; a recruitment agency using AI CV screening software; a logistics company deploying AI route-optimisation; a hospital using AI diagnostic tools developed by a medtech provider; a government agency using AI for benefits-eligibility decisions. The deployer is the organisation that decides to use the AI system, not individual employees. If your company directs staff to use an AI tool, the company is the deployer." },
  { id: "placesNonEU", label: "We bring AI systems from non-EU providers into the EU market", signal: "importer", icon: "📦",
    examples: "An EU-based IT solutions company that sources AI-powered devices from a non-EU manufacturer and is the first to make them available on the EU market. Or an EU distributor partnering with a US AI company to bring their enterprise platform to European customers. The key test: you are EU-based, the AI system bears a non-EU provider's name, and you are placing it on the EU market (not just using it yourself). If you rebrand a high-risk system under your own name, Art. 25 may reclassify you as its provider instead." },
  { id: "distributes", label: "We distribute or resell AI systems in the EU", signal: "distributor", icon: "🔄",
    examples: "A wholesale technology distributor bundling AI software with hardware solutions; a value-added reseller (VAR) offering AI-based cybersecurity tools developed by another provider; a reseller platform making various AI tools available to enterprise customers. The common thread: you make AI systems available on the EU market as part of the supply chain, without being the developer or the first importer. Distributor obligations under Art. 24 focus primarily on high-risk AI systems." },
  { id: "representsNonEU", label: "We represent a non-EU AI provider under a written mandate", signal: "authRep", icon: "📜",
    examples: "An EU-based regulatory compliance consultancy appointed by a US AI company to handle EU AI Act obligations on their behalf; an EU subsidiary formally mandated by its non-EU parent company; a specialist 'EU representative' service firm (similar to a GDPR Art. 27 representative). The Act provides for authorised representatives both for high-risk AI system providers (Art. 22) and for GPAI model providers (Art. 54). The mandate must be in writing and specify the delegated tasks." },
  { id: "personallyAffected", label: "I am personally affected by AI decisions", signal: "affected", icon: "👤",
    examples: "A job applicant screened by AI recruitment tools; a citizen subject to AI-assisted predictive policing or border-control screening; a patient whose diagnosis or treatment is influenced by AI clinical decision-support; a consumer whose creditworthiness is assessed by AI; a student evaluated by automated grading or proctoring; an insurance applicant whose premium is set by AI risk models; a welfare recipient whose benefits eligibility is determined by AI. Key rights — such as the right to explanation (Art. 86) and the right to complain (Art. 85) — primarily apply in the context of high-risk AI systems." },
];

const CLARIFYING_QUESTIONS = {
  provider: [
    { id: "ownBrand", question: "Do you place the AI system on the market or put it into service under your own name or trademark?", helpText: "This includes commissioning someone else to develop AI that you then offer under your brand, as well as building AI systems for internal use ('putting into service')." },
  ],
  deployer: [
    { id: "ownAuthority", question: "Is this professional use under your authority (not personal use)?", helpText: "Personal non-professional use is excluded from the EU AI Act (Art. 2(10))." },
  ],
  importer: [
    { id: "euBased", question: "Are you based in the EU, and does the AI system bear a non-EU entity's name?", helpText: "Importers must be established in the EU and bring in systems from third-country providers." },
  ],
  authRep: [
    { id: "hasWrittenMandate", question: "Do you have a written mandate from the non-EU provider?", helpText: "An authorised representative must hold a formal written mandate from the provider (Art. 22)." },
  ],
};

function computeResults(selections, clarifications) {
  const results = [];

  if (selections.includes("develops") && clarifications.ownBrand === true) {
    results.push("provider");
  }
  if (selections.includes("usesProfessionally") && clarifications.ownAuthority === true) {
    results.push("deployer");
  }
  if (selections.includes("placesNonEU") && clarifications.euBased === true) {
    results.push("importer");
  }
  if (selections.includes("distributes") && !results.includes("provider") && !results.includes("importer")) {
    results.push("distributor");
  }
  if (selections.includes("representsNonEU") && clarifications.hasWrittenMandate === true) {
    results.push("authRep");
  }
  if (selections.includes("personallyAffected")) {
    results.push("affected");
  }

  return results;
}

function getEarlyExit(selections, clarifications) {
  if (selections.length === 0) {
    return { type: "no-selection", message: "The EU AI Act may not directly apply to you.", detail: "Based on your selections, none of the six roles appear to match your situation. The Act primarily regulates providers, deployers, importers, distributors, and authorised representatives of AI systems, and establishes rights for affected persons." };
  }
  if (selections.length === 1 && selections[0] === "usesProfessionally" && clarifications.ownAuthority === false) {
    return { type: "personal-use", message: "Personal non-professional use is outside scope.", detail: "Article 2(10) of the EU AI Act excludes personal non-professional use from its scope. If you only use AI in a personal capacity, the regulation's deployer obligations do not apply to you." };
  }
  return null;
}

export default function RoleIdentifier({ onArticleClick, onApplyRole, onFRIAClick }) {
  const [step, setStep] = useState(0);
  const [selections, setSelections] = useState([]);
  const [clarifications, setClarifications] = useState({});
  const [expandedExamples, setExpandedExamples] = useState(new Set());
  const containerRef = useRef(null);

  const handleToggleSelection = useCallback((id) => {
    setSelections(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  }, []);

  const handleClarify = useCallback((id, value) => {
    setClarifications(prev => ({ ...prev, [id]: value }));
  }, []);

  const activeClarifyingRoles = RELATIONSHIP_OPTIONS
    .filter(opt => selections.includes(opt.id) && CLARIFYING_QUESTIONS[opt.signal])
    .map(opt => opt.signal);

  const hasClarifyStep = activeClarifyingRoles.length > 0;

  const allClarified = activeClarifyingRoles.every(role =>
    CLARIFYING_QUESTIONS[role].every(q => clarifications[q.id] !== undefined)
  );

  const canProceedStep0 = selections.length > 0;
  const canProceedStep1 = allClarified;

  const results = computeResults(selections, clarifications);
  const earlyExit = getEarlyExit(selections, clarifications);

  // Check if distributor was selected but subsumed by provider/importer
  const distributorSubsumed = selections.includes("distributes") && !results.includes("distributor") && (results.includes("provider") || results.includes("importer"));

  // Dynamic steps — skip "Clarifying Questions" when not needed
  const steps = useMemo(() => {
    const s = [{ id: "relationship", title: "Your Relationship with AI" }];
    if (hasClarifyStep) s.push({ id: "clarify", title: "Clarifying Questions" });
    s.push({ id: "results", title: "Your Results" });
    return s;
  }, [hasClarifyStep]);

  // Map visual step to internal step index
  const visualStep = step === 0 ? 0 : (step === 1 && hasClarifyStep) ? 1 : steps.length - 1;

  // Scroll to top on step transitions
  useEffect(() => {
    containerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  // Auto-redirect to step 0 if on step 1 but clarify step is no longer needed
  useEffect(() => {
    if (step === 1 && !hasClarifyStep) setStep(0);
  }, [step, hasClarifyStep]);

  const handleNext = () => {
    if (step === 0) {
      if (!hasClarifyStep) {
        setStep(2);
      } else {
        setStep(1);
      }
    } else if (step === 1) {
      setStep(2);
    }
  };

  const handleBack = () => {
    if (step === 2 && !hasClarifyStep) {
      setStep(0);
    } else {
      setStep(step - 1);
    }
  };

  const handleReset = () => {
    setStep(0);
    setSelections([]);
    setClarifications({});
  };

  // Check if user had selections but nothing matched (all clarifications failed)
  const isNoMatch = step === 2 && !earlyExit && results.length === 0 && selections.length > 0;

  return (
    <div ref={containerRef} style={{ maxWidth: 800, margin: "0 auto" }}>
      {/* Header */}
      <div className="role-id-header" style={{ textAlign: "center", padding: "40px 0 32px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 16px", background: COLORS.primaryLight, border: `1px solid ${COLORS.primaryLightBorder}`, borderRadius: RADIUS.round, fontSize: 12, color: COLORS.primary, fontWeight: 500, marginBottom: 20, fontFamily: SANS }}>
          Article 3 — Roles Under the EU AI Act
        </div>
        <h1 className="role-id-title" style={{ fontSize: 36, fontWeight: 400, lineHeight: 1.2, color: COLORS.textPrimary, margin: "0 0 12px", fontFamily: SERIF }}>
          What's My Role Under the EU AI Act?
        </h1>
        <p className="role-id-subtitle" style={{ fontSize: 15, color: COLORS.textMuted, lineHeight: 1.7, maxWidth: 560, margin: "0 auto", fontFamily: SANS }}>
          The EU AI Act defines 5 supply-chain roles in Article 3 and establishes rights for affected persons. Answer a few questions to identify which role(s) apply to you.
        </p>
      </div>

      {/* Progress Bar */}
      <div style={{ display: "flex", gap: 8, marginBottom: 32 }}>
        {steps.map((s, i) => (
          <div key={s.id} style={{ flex: 1 }}>
            <div style={{
              height: 4, borderRadius: 2,
              background: i <= visualStep ? COLORS.primary : "#e2e8f0",
              transition: "background 0.3s",
            }} />
            <p style={{ fontSize: 11, color: i <= visualStep ? COLORS.primary : COLORS.textPlaceholder, marginTop: 6, fontWeight: i === visualStep ? 600 : 400, fontFamily: SANS }}>
              {s.title}
            </p>
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="role-id-card" style={{ background: COLORS.white, borderRadius: RADIUS.xxl, border: `1px solid ${COLORS.borderDefault}`, padding: "36px 32px", boxShadow: SHADOWS.sm, marginBottom: 32 }}>
        {step === 0 && (
          <>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: COLORS.textPrimary, margin: "0 0 6px", fontFamily: SANS }}>
              Your Relationship with AI
            </h2>
            <p style={{ fontSize: 14, color: COLORS.textMuted, margin: "0 0 24px", fontFamily: SANS }}>
              Select all that describe your organisation's relationship with AI systems.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {RELATIONSHIP_OPTIONS.map((opt) => {
                const isSelected = selections.includes(opt.id);
                const isExamplesOpen = expandedExamples.has(opt.id);
                return (
                  <div key={opt.id} style={{
                    background: isSelected ? COLORS.primaryLight : COLORS.surfaceAltBg,
                    border: `2px solid ${isSelected ? COLORS.primary : COLORS.borderDefault}`,
                    borderRadius: RADIUS.xl, transition: "all 0.15s", overflow: "hidden",
                  }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <button
                        onClick={() => handleToggleSelection(opt.id)}
                        aria-pressed={isSelected}
                        style={{
                          display: "flex", alignItems: "center", gap: 14, padding: "16px 18px",
                          background: "transparent", border: "none", cursor: "pointer", textAlign: "left",
                          fontFamily: SANS, flex: 1, minWidth: 0,
                        }}
                      >
                        <div style={{
                          width: 22, height: 22, borderRadius: 6, border: `2px solid ${isSelected ? COLORS.primary : COLORS.borderInput}`,
                          background: isSelected ? COLORS.primary : COLORS.white,
                          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                          transition: "all 0.15s",
                        }}>
                          {isSelected && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg>}
                        </div>
                        <span style={{ fontSize: 22, flexShrink: 0 }} aria-hidden="true">{opt.icon}</span>
                        <span style={{ fontSize: 14, color: isSelected ? COLORS.primary : COLORS.textBody, fontWeight: isSelected ? 600 : 500, flex: 1, minWidth: 0 }}>
                          {opt.label}
                        </span>
                      </button>
                      {/* Examples toggle — separate button, not nested */}
                      <button
                        onClick={() => setExpandedExamples(prev => { const n = new Set(prev); n.has(opt.id) ? n.delete(opt.id) : n.add(opt.id); return n; })}
                        aria-expanded={isExamplesOpen}
                        aria-controls={`examples-${opt.id}`}
                        title={isExamplesOpen ? "Hide examples" : "Show examples"}
                        style={{
                          display: "inline-flex", alignItems: "center", gap: 5, flexShrink: 0,
                          fontSize: 12, color: isExamplesOpen ? COLORS.primary : COLORS.textMuted, fontWeight: 500, fontFamily: SANS,
                          padding: "6px 14px", marginRight: 14, borderRadius: RADIUS.md,
                          background: isExamplesOpen ? (isSelected ? COLORS.white : "#eee") : "transparent",
                          border: `1px solid ${isExamplesOpen ? COLORS.borderDefault : "transparent"}`,
                          cursor: "pointer", transition: "all 0.12s",
                        }}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><path d="M12 17h.01" /></svg>
                        Examples
                      </button>
                    </div>
                    {/* Expanded examples panel */}
                    {isExamplesOpen && (
                      <div id={`examples-${opt.id}`} style={{ padding: "0 18px 14px 18px", fontFamily: SANS }}>
                        <p style={{ fontSize: 12.5, color: COLORS.textMuted, lineHeight: 1.7, margin: 0, background: isSelected ? COLORS.white : "#f0ede6", padding: "12px 16px", borderRadius: RADIUS.md }}>
                          {opt.examples}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: COLORS.textPrimary, margin: "0 0 6px", fontFamily: SANS }}>
              Clarifying Questions
            </h2>
            <p style={{ fontSize: 14, color: COLORS.textMuted, margin: "0 0 24px", fontFamily: SANS }}>
              A few follow-up questions to confirm your role(s).
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {activeClarifyingRoles.map((role) => {
                const roleData = ROLES[role];
                return (
                  <div key={role} style={{ padding: "20px", background: roleData.colorBg, borderRadius: RADIUS.xl, border: `1px solid ${roleData.colorBorder}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                      <span style={{ fontSize: 18 }}>{roleData.icon}</span>
                      <h3 style={{ fontSize: 15, fontWeight: 600, color: COLORS.textPrimary, margin: 0, fontFamily: SANS }}>{roleData.label}</h3>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                      {CLARIFYING_QUESTIONS[role].map((q) => (
                        <div key={q.id}>
                          <p style={{ fontSize: 14, color: COLORS.textBody, margin: "0 0 8px", fontFamily: SANS, fontWeight: 500 }}>
                            {q.question}
                          </p>
                          {q.helpText && (
                            <p style={{ fontSize: 12, color: COLORS.textMuted, margin: "0 0 10px", fontFamily: SANS, lineHeight: 1.5 }}>
                              {q.helpText}
                            </p>
                          )}
                          <div style={{ display: "flex", gap: 8 }}>
                            {[true, false].map((val) => {
                              const isSelected = clarifications[q.id] === val;
                              return (
                                <button key={String(val)}
                                  onClick={() => handleClarify(q.id, val)}
                                  aria-pressed={isSelected}
                                  style={{
                                    padding: "8px 20px", borderRadius: RADIUS.md,
                                    border: `2px solid ${isSelected ? roleData.color : COLORS.borderLight}`,
                                    background: isSelected ? roleData.colorBg : COLORS.white,
                                    color: isSelected ? roleData.color : COLORS.textSecondary,
                                    fontWeight: isSelected ? 600 : 500, fontSize: 13,
                                    cursor: "pointer", fontFamily: SANS, transition: "all 0.15s",
                                  }}
                                >
                                  {val ? "Yes" : "No"}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: COLORS.textPrimary, margin: "0 0 6px", fontFamily: SANS }}>
              Your Results
            </h2>
            <p style={{ fontSize: 14, color: COLORS.textMuted, margin: "0 0 24px", fontFamily: SANS }}>
              Your identified role(s) under the EU AI Act
            </p>

            {(earlyExit || isNoMatch) ? (
              <div style={{ padding: "28px 24px", background: COLORS.warningBg, borderRadius: RADIUS.xl, border: `1px solid ${COLORS.warningBorder}`, textAlign: "center" }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>
                  {earlyExit?.type === "personal-use" ? "🏠" : "🔍"}
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: COLORS.warningText, margin: "0 0 8px", fontFamily: SANS }}>
                  {earlyExit ? earlyExit.message : "No roles matched your answers."}
                </h3>
                <p style={{ fontSize: 14, color: COLORS.textMuted, lineHeight: 1.6, maxWidth: 500, margin: "0 auto 16px", fontFamily: SANS }}>
                  {earlyExit ? earlyExit.detail : "Based on your clarifying answers, none of the EU AI Act supply-chain roles could be confirmed. This may mean the Act does not directly apply to your organisation, or you may want to reconsider your answers."}
                </p>
                <button onClick={handleReset}
                  style={{
                    padding: "10px 20px", background: COLORS.white, color: COLORS.textSecondary,
                    border: `1px solid ${COLORS.borderLight}`, borderRadius: RADIUS.md,
                    cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: SANS,
                  }}
                >
                  Try again with different answers
                </button>
              </div>
            ) : (
              <>
                {results.length > 1 && (
                  <div style={{ padding: "14px 18px", background: COLORS.primaryLight, borderRadius: RADIUS.lg, border: `1px solid ${COLORS.primaryLightBorder}`, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={COLORS.primary} strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
                    <p style={{ fontSize: 13, color: COLORS.primary, margin: 0, fontFamily: SANS }}>
                      You have <strong>{results.length} roles</strong> under the EU AI Act. You should review the provisions for each role.
                    </p>
                  </div>
                )}

                {distributorSubsumed && (
                  <div style={{ padding: "12px 16px", background: "#ecfeff", borderRadius: RADIUS.lg, border: "1px solid #a5f3fc", marginBottom: 16, display: "flex", alignItems: "flex-start", gap: 8 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
                    <p style={{ fontSize: 12, color: COLORS.textMuted, margin: 0, fontFamily: SANS, lineHeight: 1.5 }}>
                      <strong>Distribution note:</strong> You selected distribution activities, but under Art. 3(7), the distributor role is distinct from provider and importer. Since you qualify as {results.includes("provider") ? "a provider" : "an importer"}, your distribution activities are already covered by that role's obligations. For a different AI system where you are only the distributor, separate distributor obligations (Art. 24) would apply.
                    </p>
                  </div>
                )}

                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {results.map((roleId) => {
                    const role = ROLES[roleId];
                    const isDeployer = roleId === "deployer";
                    return (
                      <div key={roleId} style={{
                        padding: "24px", background: role.colorBg, borderRadius: RADIUS.xxl,
                        border: `2px solid ${role.colorBorder}`,
                      }}>
                        <div className="role-result-header" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                          <div style={{
                            width: 44, height: 44, borderRadius: 12, background: COLORS.white,
                            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
                            flexShrink: 0,
                          }}>
                            {role.icon}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <h3 style={{ fontSize: 17, fontWeight: 600, color: COLORS.textPrimary, margin: 0, fontFamily: SANS }}>
                              {role.label}
                            </h3>
                            <span style={{
                              display: "inline-block", padding: "2px 8px", background: COLORS.white,
                              borderRadius: RADIUS.sm, fontSize: 11, color: role.color, fontWeight: 600,
                              fontFamily: SANS, marginTop: 2, border: `1px solid ${role.colorBorder}`,
                            }}>
                              {role.legalBasis}
                            </span>
                          </div>
                          <span style={{ fontSize: 13, color: COLORS.textMuted, fontFamily: SANS, fontWeight: 500, flexShrink: 0 }}>
                            {role.articles.length} articles
                          </span>
                        </div>

                        <p style={{ fontSize: 13, color: COLORS.textMuted, lineHeight: 1.6, margin: "0 0 16px", fontFamily: SANS, fontStyle: "italic" }}>
                          {roleId === "affected" ? role.legalDefinition : `"${role.legalDefinition}"`}
                        </p>

                        {/* Key article groups */}
                        <div className="role-result-groups" style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
                          {role.keyArticleGroups.map((group) => (
                            <button key={group.name}
                              onClick={() => onArticleClick(group.articleNum)}
                              style={{
                                display: "flex", alignItems: "center", gap: 10, padding: "9px 12px",
                                background: COLORS.white, borderRadius: RADIUS.lg, fontSize: 13,
                                color: COLORS.textBody, fontFamily: SANS, border: "none", cursor: "pointer",
                                textAlign: "left", width: "100%", transition: "background 0.15s",
                              }}
                              onMouseEnter={e => e.currentTarget.style.background = "#f7f5f2"}
                              onMouseLeave={e => e.currentTarget.style.background = COLORS.white}
                            >
                              <div style={{ width: 8, height: 8, borderRadius: "50%", background: group.color, flexShrink: 0 }} />
                              <span style={{ flex: 1 }}>{group.name}</span>
                              <span style={{ fontSize: 11, color: COLORS.textPlaceholder, fontWeight: 500 }}>{group.ref}</span>
                            </button>
                          ))}
                        </div>

                        <div className="role-result-actions" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          <button
                            onClick={() => onApplyRole(roleId)}
                            style={{
                              padding: "10px 18px", background: role.color, color: COLORS.white,
                              border: "none", borderRadius: RADIUS.md, cursor: "pointer",
                              fontSize: 13, fontWeight: 600, fontFamily: SANS, transition: "opacity 0.15s",
                            }}
                            onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
                            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                          >
                            View {role.articles.length} articles →
                          </button>
                          {isDeployer && onFRIAClick && (
                            <button
                              onClick={onFRIAClick}
                              style={{
                                padding: "10px 18px", background: COLORS.white, color: COLORS.orangeDot,
                                border: `1px solid ${COLORS.orangeBorder}`, borderRadius: RADIUS.md,
                                cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: SANS,
                                display: "flex", alignItems: "center", gap: 6,
                              }}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" /><path d="M9 14l2 2 4-4" /></svg>
                              Start FRIA Screening
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* Navigation buttons */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 }}>
        {step > 0 ? (
          <button onClick={handleBack}
            style={{
              padding: "10px 20px", background: COLORS.white, color: COLORS.textSecondary,
              border: `1px solid ${COLORS.borderLight}`, borderRadius: RADIUS.md,
              cursor: "pointer", fontSize: 14, fontWeight: 500, fontFamily: SANS,
              display: "flex", alignItems: "center", gap: 6,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            Back
          </button>
        ) : <div />}

        {step < 2 ? (
          <button
            onClick={handleNext}
            disabled={step === 0 ? !canProceedStep0 : !canProceedStep1}
            style={{
              padding: "10px 24px",
              background: (step === 0 ? canProceedStep0 : canProceedStep1) ? COLORS.primary : "#e2e8f0",
              color: (step === 0 ? canProceedStep0 : canProceedStep1) ? COLORS.white : COLORS.textPlaceholder,
              border: "none", borderRadius: RADIUS.md, cursor: (step === 0 ? canProceedStep0 : canProceedStep1) ? "pointer" : "not-allowed",
              fontSize: 14, fontWeight: 600, fontFamily: SANS,
              display: "flex", alignItems: "center", gap: 6, transition: "all 0.15s",
            }}
          >
            Continue
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </button>
        ) : (
          <button onClick={handleReset}
            style={{
              padding: "10px 20px", background: COLORS.white, color: COLORS.textSecondary,
              border: `1px solid ${COLORS.borderLight}`, borderRadius: RADIUS.md,
              cursor: "pointer", fontSize: 14, fontWeight: 500, fontFamily: SANS,
              display: "flex", alignItems: "center", gap: 6,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 4v6h6" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" /></svg>
            Start over
          </button>
        )}
      </div>
    </div>
  );
}
