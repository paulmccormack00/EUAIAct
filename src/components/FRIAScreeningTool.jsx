import { useState, useCallback, useEffect } from "react";
import { SANS, SERIF, COLORS, RADIUS, SHADOWS } from "../constants.js";

const ANNEX_III_CATEGORIES = [
  { id: "biometrics", label: "Biometric identification & categorisation", description: "Real-time or post remote biometric identification systems, emotion recognition, biometric categorisation", examples: "Facial recognition, fingerprint scanners, emotion detection in workplaces", articles: "Annex III, 1" },
  { id: "critical-infra", label: "Critical infrastructure", description: "Safety components of critical infrastructure management and operation", examples: "Energy grid management AI, water supply systems, digital infrastructure", articles: "Annex III, 2" },
  { id: "education", label: "Education & vocational training", description: "AI determining access to education, evaluating learning outcomes, monitoring prohibited behaviour during tests", examples: "Automated grading, student admission systems, exam proctoring AI", articles: "Annex III, 3" },
  { id: "employment", label: "Employment, workers management & self-employment", description: "Recruitment, selection, HR decisions, task allocation, performance monitoring, termination", examples: "CV screening tools, interview analysis AI, workforce scheduling systems", articles: "Annex III, 4" },
  { id: "essential-services", label: "Essential private & public services", description: "Creditworthiness assessment, life/health insurance pricing, emergency services dispatch", examples: "Credit scoring, insurance risk assessment, emergency call triage", articles: "Annex III, 5" },
  { id: "law-enforcement", label: "Law enforcement", description: "Polygraphs, evidence reliability assessment, profiling for criminal offences, crime analytics", examples: "Predictive policing, suspect profiling, evidence analysis AI", articles: "Annex III, 6" },
  { id: "migration", label: "Migration, asylum & border control", description: "Polygraphs, risk assessment, document authenticity verification, residence applications", examples: "Border screening AI, asylum application processing, visa assessment", articles: "Annex III, 7" },
  { id: "justice", label: "Administration of justice & democratic processes", description: "AI assisting judicial authorities in researching, interpreting facts and law, influencing elections", examples: "Legal research AI, sentencing recommendation systems, election influence monitoring", articles: "Annex III, 8" },
];

const DEPLOYER_TYPES = [
  { id: "public-body", label: "Public authority or body", description: "Government department, agency, local authority, or other public body deploying AI", friaRequired: true, note: "Required under Article 27, except for critical infrastructure AI under Annex III point 2" },
  { id: "public-service-private", label: "Private entity providing public services", description: "Private company providing services in the public interest (healthcare, education, essential services)", friaRequired: true, note: "Required under Article 27, except for critical infrastructure AI under Annex III point 2" },
  { id: "credit-insurance", label: "Credit scoring or life/health insurance assessor", description: "You use AI for creditworthiness or credit scoring (Annex III 5(b), excluding fraud detection) or life/health insurance risk and pricing (Annex III 5(c)) — applies regardless of public/private status", friaRequired: true, note: "Required under Article 27 — fraud detection AI is excluded from this category" },
  { id: "other-private", label: "Other private entity", description: "Private company not providing public services and not in credit/insurance assessment", friaRequired: false, note: "Not required under Article 27, but conducting a voluntary FRIA is recommended as best practice" },
];

const FUNDAMENTAL_RIGHTS = [
  { id: "dignity", label: "Human Dignity", charter: "Title I — Articles 1-5", description: "Right to human dignity, right to life, right to integrity, prohibition of torture, prohibition of slavery", examples: "Automated decisions affecting human dignity, life-critical AI systems, forced labour detection" },
  { id: "freedoms", label: "Freedoms", charter: "Title II — Articles 6-19", description: "Liberty, private life, data protection, marriage, thought/conscience/religion, expression, assembly, education, work, property, asylum", examples: "Privacy-invasive AI, surveillance systems, content moderation, facial recognition" },
  { id: "equality", label: "Equality & Non-Discrimination", charter: "Title III — Articles 20-26", description: "Equality before the law, non-discrimination, cultural diversity, gender equality, children's rights, elderly rights, disabled persons' rights", examples: "Biased hiring algorithms, discriminatory credit scoring, accessibility barriers" },
  { id: "solidarity", label: "Solidarity", charter: "Title IV — Articles 27-38", description: "Workers' right to information, collective bargaining, fair working conditions, child labour prohibition, social security, healthcare, environmental protection, consumer protection", examples: "AI workforce monitoring, automated scheduling without consent, environmental impact of AI training" },
  { id: "citizens", label: "Citizens' Rights", charter: "Title V — Articles 39-46", description: "Right to vote, right to good administration, access to documents, ombudsman, petition, free movement, diplomatic protection", examples: "AI-influenced electoral processes, automated administrative decisions" },
  { id: "justice", label: "Justice", charter: "Title VI — Articles 47-50", description: "Right to effective remedy, fair trial, presumption of innocence, legality of criminal offences", examples: "AI in criminal justice, automated legal decisions, risk assessment in sentencing" },
  { id: "general", label: "General Provisions", charter: "Title VII — Articles 51-54", description: "Scope, limitation of rights, prohibition of abuse, level of protection", examples: "Cross-border AI deployment, rights limitation justification" },
];

const STEPS = [
  { id: "ai-check", title: "AI System Check", subtitle: "Is your system an AI system under Article 3(1)?" },
  { id: "use-case", title: "Use Case Categories", subtitle: "Select all Annex III categories that apply to your AI system" },
  { id: "high-risk", title: "Risk Classification", subtitle: "High-risk classification result" },
  { id: "deployer", title: "Deployer Type", subtitle: "What type of organisation are you?" },
  { id: "rights", title: "Fundamental Rights", subtitle: "Which rights are potentially impacted?" },
  { id: "dpia", title: "Existing DPIA", subtitle: "Do you have an existing DPIA?" },
  { id: "results", title: "Your Results", subtitle: "FRIA screening summary" },
];

const AI_CRITERIA = [
  { id: "autonomy", label: "Operates with some level of autonomy", help: "The system can function without continuous human input for each decision" },
  { id: "inference", label: "Uses machine learning, logic, or statistics-based approaches", help: "The system uses models, algorithms, or knowledge-based reasoning to generate outputs" },
  { id: "adaptability", label: "Generates outputs (predictions, recommendations, decisions, content)", help: "The system produces outputs that can influence environments it interacts with" },
  { id: "objective", label: "Designed for explicit or implicit objectives", help: "The system is built to achieve specific goals or optimise for certain outcomes" },
];

export default function FRIAScreeningTool({ onArticleClick }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({
    aiCriteria: [],
    isAI: null,
    useCases: [],
    isHighRisk: null,
    deployerType: null,
    selectedRights: [],
    hasDPIA: null,
    dpiaScope: "",
    email: "",
  });
  const [emailStatus, setEmailStatus] = useState(null);
  const [emailError, setEmailError] = useState("");

  const handleCriteriaToggle = useCallback((criterionId) => {
    setAnswers(prev => {
      const current = prev.aiCriteria;
      const next = current.includes(criterionId)
        ? current.filter(c => c !== criterionId)
        : [...current, criterionId];
      return { ...prev, aiCriteria: next, isAI: next.length >= 3 ? true : next.length === 0 ? null : prev.isAI };
    });
  }, []);

  const handleUseCaseToggle = useCallback((categoryId) => {
    setAnswers(prev => {
      const current = prev.useCases;
      const next = current.includes(categoryId)
        ? current.filter(c => c !== categoryId)
        : [...current, categoryId];
      return { ...prev, useCases: next, isHighRisk: next.length > 0 ? true : null };
    });
  }, []);

  const handleDeployerSelect = useCallback((deployerType) => {
    setAnswers(prev => ({ ...prev, deployerType }));
  }, []);

  const handleRightsToggle = useCallback((rightId) => {
    setAnswers(prev => {
      const current = prev.selectedRights;
      const next = current.includes(rightId)
        ? current.filter(r => r !== rightId)
        : [...current, rightId];
      return { ...prev, selectedRights: next };
    });
  }, []);

  const canProceed = () => {
    switch (step) {
      case 0: return answers.aiCriteria.length > 0;
      case 1: return answers.useCases.length > 0;
      case 2: return answers.isHighRisk !== null;
      case 3: return answers.deployerType !== null;
      case 4: return answers.selectedRights.length > 0;
      case 5: return answers.hasDPIA !== null;
      default: return false;
    }
  };

  const getNotInScope = () => answers.aiCriteria.length > 0 && answers.aiCriteria.length < 3 && answers.isAI === false;

  const getFriaRequired = () => {
    if (!answers.deployerType) return null;
    const deployer = DEPLOYER_TYPES.find(d => d.id === answers.deployerType);
    return deployer?.friaRequired ?? false;
  };

  const getDpiaReusePercent = () => {
    if (!answers.hasDPIA) return 0;
    if (answers.dpiaScope === "comprehensive") return 40;
    if (answers.dpiaScope === "partial") return 20;
    return 10;
  };

  const getRiskLevel = () => {
    const rights = answers.selectedRights.length;
    if (rights >= 5) return { level: "Critical", color: "#dc2626", bg: "#fef2f2" };
    if (rights >= 3) return { level: "High", color: "#ea580c", bg: "#fff7ed" };
    if (rights >= 1) return { level: "Medium", color: "#d97706", bg: "#fffbeb" };
    return { level: "Low", color: "#16a34a", bg: "#f0fdf4" };
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    const email = answers.email.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailStatus("error");
      setEmailError("Please enter a valid email address.");
      return;
    }
    setEmailStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setEmailStatus("success");
      } else if (res.status === 409 || data.error === "duplicate") {
        setEmailStatus("success");
      } else {
        setEmailStatus("error");
        setEmailError(data.error || "Something went wrong.");
      }
    } catch {
      setEmailStatus("error");
      setEmailError("Network error. Please try again.");
    }
  };

  const handlePrint = () => {
    const friaRequired = getFriaRequired();
    const risk = getRiskLevel();
    const categories = answers.useCases.map(id => ANNEX_III_CATEGORIES.find(c => c.id === id)).filter(Boolean);
    const deployer = DEPLOYER_TYPES.find(d => d.id === answers.deployerType);
    const dpiaReuse = getDpiaReusePercent();
    const impactedRights = FUNDAMENTAL_RIGHTS.filter(r => answers.selectedRights.includes(r.id));
    const today = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

    const printHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>FRIA Screening Report — EU AI Act Navigator</title>
<style>
  @page { margin: 24mm 20mm; size: A4; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #1a1a1a; line-height: 1.6; background: white; }
  .header { background: #0a1e5c; color: white; padding: 32px 40px 28px; }
  .header-row { display: flex; align-items: center; justify-content: space-between; }
  .header h1 { font-size: 20px; font-weight: 700; font-family: Georgia, serif; letter-spacing: -0.3px; }
  .header .badge { font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #8a94b8; }
  .hero { background: #0d2470; color: white; padding: 28px 40px; text-align: center; }
  .hero .result { font-size: 28px; font-weight: 700; font-family: Georgia, serif; margin: 0 0 6px; }
  .hero .sub { font-size: 14px; color: #b0b8d4; }
  .content { padding: 28px 40px; }
  .summary-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 24px; }
  .summary-card { padding: 16px 20px; border-radius: 8px; border: 1px solid #e5e7eb; }
  .summary-card .label { font-size: 10px; text-transform: uppercase; letter-spacing: 1.2px; color: #9ca3af; font-weight: 700; margin-bottom: 6px; }
  .summary-card .value { font-size: 16px; font-weight: 700; }
  .summary-card .detail { font-size: 12px; color: #6b7280; margin-top: 3px; }
  .section-title { font-size: 14px; font-weight: 700; color: #0a1e5c; margin: 20px 0 10px; text-transform: uppercase; letter-spacing: 0.8px; border-bottom: 2px solid #0a1e5c; padding-bottom: 6px; }
  .heatmap { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-bottom: 20px; }
  .heatmap-item { padding: 8px 12px; border-radius: 6px; font-size: 12px; display: flex; align-items: center; gap: 8px; }
  .heatmap-item .dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .heatmap-item.impacted { background: #fef2f2; border: 1px solid #fecaca; color: #991b1b; font-weight: 600; }
  .heatmap-item.clear { background: #f8fafc; border: 1px solid #e5e7eb; color: #9ca3af; }
  .heatmap-item.impacted .dot { background: #dc2626; }
  .heatmap-item.clear .dot { background: #cbd5e1; }
  .next-steps { background: #f0f4ff; border: 1px solid #c7d6ec; border-radius: 8px; padding: 16px 20px; margin-bottom: 20px; page-break-before: always; }
  .next-steps ol { padding-left: 20px; font-size: 13px; color: #374151; }
  .next-steps li { margin-bottom: 4px; }
  .deadline-badge { background: #fdf6e3; border-left: 4px solid #d4a843; border-radius: 0 8px 8px 0; padding: 14px 20px; margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between; }
  .deadline-badge .date { font-size: 22px; font-weight: 700; color: #0a1e5c; font-family: Georgia, serif; }
  .deadline-badge .label { font-size: 10px; text-transform: uppercase; letter-spacing: 1.2px; color: #9a8340; font-weight: 700; }
  .footer { padding: 20px 40px; border-top: 1px solid #e5e7eb; font-size: 11px; color: #9ca3af; text-align: center; }
  .footer a { color: #0a1e5c; text-decoration: none; font-weight: 600; }
  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style>
</head>
<body>
  <div class="header">
    <div class="header-row">
      <h1>EU AI Act Navigator</h1>
      <span class="badge">FRIA Screening Report</span>
    </div>
  </div>
  <div class="hero">
    <p class="result">${friaRequired ? "FRIA is Required" : "FRIA is Not Required"}</p>
    <p class="sub">${friaRequired ? "Under Article 27, a Fundamental Rights Impact Assessment must be completed before deploying this AI system." : "Based on your deployer type, a FRIA is not legally required — though a voluntary assessment is recommended."}</p>
  </div>
  <div class="content">
    <div class="deadline-badge">
      <div>
        <p class="label">FRIA Deadline</p>
        <p class="date">2 August 2026</p>
      </div>
      <span style="font-size:12px;color:#6b7280;">Article 27</span>
    </div>
    <div class="summary-grid">
      <div class="summary-card">
        <p class="label">Classification</p>
        <p class="value">${answers.isHighRisk ? "High-Risk" : "Not High-Risk"}</p>
        <p class="detail">${categories.map(c => c.label).join(", ") || "—"}</p>
      </div>
      <div class="summary-card">
        <p class="label">Deployer Type</p>
        <p class="value">${deployer?.label || "—"}</p>
        <p class="detail" style="color:${friaRequired ? "#ea580c" : "#16a34a"};font-weight:600">${friaRequired ? "FRIA Obligated" : "FRIA Optional"}</p>
      </div>
      <div class="summary-card">
        <p class="label">Rights Impact</p>
        <p class="value" style="color:${risk.color}">${risk.level} Risk</p>
        <p class="detail">${answers.selectedRights.length} of 7 right categories impacted</p>
      </div>
      <div class="summary-card">
        <p class="label">DPIA Reuse</p>
        <p class="value">${dpiaReuse}% Reusable</p>
        <p class="detail">${answers.hasDPIA ? "Under Article 27(4)" : "No existing DPIA"}</p>
      </div>
    </div>
    <p class="section-title">Fundamental Rights Impact Heatmap</p>
    <div class="heatmap">
      ${FUNDAMENTAL_RIGHTS.map(r => {
        const impacted = answers.selectedRights.includes(r.id);
        return `<div class="heatmap-item ${impacted ? "impacted" : "clear"}"><span class="dot"></span>${r.label}</div>`;
      }).join("")}
    </div>
    <p class="section-title">Next Steps</p>
    <div class="next-steps">
      <ol>
        ${friaRequired ? "<li>Conduct a full FRIA covering all 10 sections (90 questions)</li>" : ""}
        ${friaRequired ? "<li>Document your assessment per Article 27(1) requirements</li>" : ""}
        ${answers.hasDPIA ? "<li>Leverage your existing DPIA under Article 27(4) to pre-populate applicable sections</li>" : ""}
        <li>Review AI system compliance with ${answers.isHighRisk ? "Articles 8-15 (high-risk requirements)" : "Article 50 (transparency obligations)"}</li>
        ${friaRequired ? "<li>Notify the relevant market surveillance authority per Article 27(1)</li>" : ""}
        <li>Establish ongoing monitoring and periodic review processes</li>
        ${answers.isHighRisk ? "<li>Ensure conformity assessment under Article 43 before market placement</li>" : ""}
      </ol>
    </div>
    ${deployer?.note ? `<p style="font-size:12px;color:#6b7280;font-style:italic;margin-top:16px;padding:12px 16px;background:#f8fafc;border-radius:6px;border:1px solid #e5e7eb;">${deployer.note}</p>` : ""}
  </div>
  <div class="footer">
    <p>Generated on ${today} by <a href="https://euai.app">EU AI Act Navigator</a> — euai.app</p>
    <p style="margin-top:4px;">This screening is for guidance only and does not constitute legal advice.</p>
  </div>
</body>
</html>`;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(printHtml);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => printWindow.print(), 300);
    }
  };

  const progressPercent = Math.round(((step + 1) / STEPS.length) * 100);

  const cardStyle = {
    background: COLORS.white,
    borderRadius: RADIUS.xxl,
    border: `1px solid ${COLORS.borderDefault}`,
    padding: "32px",
    marginBottom: 24,
    boxShadow: SHADOWS.sm,
  };

  const btnPrimary = {
    padding: "12px 28px",
    background: COLORS.primary,
    color: "white",
    border: "none",
    borderRadius: RADIUS.lg,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: SANS,
    transition: "all 0.15s",
  };

  const btnSecondary = {
    padding: "12px 28px",
    background: COLORS.white,
    color: COLORS.primary,
    border: `1px solid ${COLORS.primaryLightBorder}`,
    borderRadius: RADIUS.lg,
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: SANS,
    transition: "all 0.15s",
  };

  const renderStep = () => {
    switch (step) {
      case 0: return renderAICheck();
      case 1: return renderUseCase();
      case 2: return renderHighRisk();
      case 3: return renderDeployer();
      case 4: return renderRights();
      case 5: return renderDPIA();
      case 6: return renderResults();
      default: return null;
    }
  };

  const renderAICheck = () => (
    <div>
      <p style={{ fontSize: 14, color: "#546478", lineHeight: 1.7, marginBottom: 24, fontFamily: SANS }}>
        Article 3(1) defines an AI system by several key characteristics. Select all that apply to your system:
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {AI_CRITERIA.map((criterion) => {
          const selected = answers.aiCriteria.includes(criterion.id);
          return (
            <button
              key={criterion.id}
              onClick={() => handleCriteriaToggle(criterion.id)}
              style={{
                display: "flex", alignItems: "flex-start", gap: 14, padding: "16px 20px",
                background: selected ? "#f0f4ff" : "#fafaf8",
                border: `2px solid ${selected ? "#1e3a5f" : "#e8e4de"}`,
                borderRadius: 12, cursor: "pointer", textAlign: "left",
                transition: "all 0.15s", fontFamily: SANS,
              }}
            >
              <div style={{
                width: 22, height: 22, borderRadius: 6, border: `2px solid ${selected ? "#1e3a5f" : "#cbd5e1"}`,
                background: selected ? "#1e3a5f" : "white", display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, marginTop: 1, transition: "all 0.15s",
              }}>
                {selected && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg>}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a", marginBottom: 4 }}>{criterion.label}</div>
                <div style={{ fontSize: 13, color: "#546478", lineHeight: 1.5 }}>{criterion.help}</div>
              </div>
            </button>
          );
        })}
      </div>
      {answers.aiCriteria.length >= 3 && (
        <div style={{ marginTop: 20, padding: "16px 20px", background: "#f0fdf4", borderRadius: 10, border: "1px solid #bbf7d0" }}>
          <p style={{ fontSize: 14, color: "#166534", fontWeight: 600, margin: 0, fontFamily: SANS }}>
            Your system meets the Article 3(1) criteria for an AI system.
          </p>
        </div>
      )}
      {answers.aiCriteria.length > 0 && answers.aiCriteria.length < 3 && (
        <div style={{ marginTop: 20 }}>
          <button
            onClick={() => setAnswers(prev => ({ ...prev, isAI: false }))}
            style={{ ...btnSecondary, fontSize: 13, padding: "10px 20px", color: "#546478" }}
          >
            My system doesn't meet enough criteria — it's not an AI system
          </button>
        </div>
      )}
    </div>
  );

  const renderUseCase = () => (
    <div>
      <p style={{ fontSize: 14, color: "#546478", lineHeight: 1.7, marginBottom: 8, fontFamily: SANS }}>
        Annex III lists specific use cases that trigger high-risk classification. An AI system may span multiple categories — select <strong>all that apply</strong>:
      </p>
      {answers.useCases.length > 1 && (
        <div style={{ marginBottom: 16, padding: "10px 16px", background: "#f0f4ff", borderRadius: 8, border: "1px solid #c7d6ec" }}>
          <p style={{ fontSize: 13, color: "#1e3a5f", margin: 0, fontFamily: SANS }}>
            {answers.useCases.length} categories selected — your system will be assessed against each.
          </p>
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {ANNEX_III_CATEGORIES.map((cat) => {
          const selected = answers.useCases.includes(cat.id);
          return (
            <button
              key={cat.id}
              onClick={() => handleUseCaseToggle(cat.id)}
              style={{
                display: "flex", alignItems: "flex-start", gap: 14, padding: "16px 20px",
                background: selected ? "#f0f4ff" : "#fafaf8",
                border: `2px solid ${selected ? "#1e3a5f" : "#e8e4de"}`,
                borderRadius: 12, cursor: "pointer", textAlign: "left",
                transition: "all 0.15s", fontFamily: SANS,
              }}
            >
              <div style={{
                width: 22, height: 22, borderRadius: 6, border: `2px solid ${selected ? "#1e3a5f" : "#cbd5e1"}`,
                background: selected ? "#1e3a5f" : "white", display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, marginTop: 1, transition: "all 0.15s",
              }}>
                {selected && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg>}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a", marginBottom: 4 }}>{cat.label}</div>
                <div style={{ fontSize: 13, color: "#546478", lineHeight: 1.5, marginBottom: 6 }}>{cat.description}</div>
                <div style={{ fontSize: 12, color: "#4a5f74", fontStyle: "italic" }}>e.g. {cat.examples}</div>
              </div>
              <span style={{ fontSize: 11, color: "#4a5f74", fontWeight: 500, flexShrink: 0 }}>{cat.articles}</span>
            </button>
          );
        })}
      </div>
      <div style={{ marginTop: 20 }}>
        <button
          onClick={() => { setAnswers(prev => ({ ...prev, useCases: [], isHighRisk: false })); setStep(2); }}
          style={{ ...btnSecondary, fontSize: 13, padding: "10px 20px", color: "#546478" }}
        >
          None of these — my system doesn't fall under Annex III
        </button>
      </div>
    </div>
  );

  const renderHighRisk = () => {
    const isHighRisk = answers.isHighRisk;
    return (
      <div>
        {isHighRisk ? (
          <div style={{ padding: "24px", background: "#fff7ed", borderRadius: 12, border: "1px solid #fed7aa", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#ea580c", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: "#9a3412", margin: 0, fontFamily: SANS }}>High-Risk AI System</h3>
            </div>
            <p style={{ fontSize: 14, color: "#9a3412", lineHeight: 1.7, margin: 0, fontFamily: SANS }}>
              Based on your selection{answers.useCases.length > 1 ? "s" : ""} (<strong>{answers.useCases.map(id => ANNEX_III_CATEGORIES.find(c => c.id === id)?.label).filter(Boolean).join(", ")}</strong>), your AI system is classified as <strong>high-risk</strong> under Article 6(2) and Annex III. This means additional obligations apply, including the requirement for a Fundamental Rights Impact Assessment (FRIA) under Article 27.
            </p>
          </div>
        ) : (
          <div style={{ padding: "24px", background: "#f0fdf4", borderRadius: 12, border: "1px solid #bbf7d0", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: "#166534", margin: 0, fontFamily: SANS }}>Not High-Risk</h3>
            </div>
            <p style={{ fontSize: 14, color: "#166534", lineHeight: 1.7, margin: 0, fontFamily: SANS }}>
              Your AI system does not appear to fall under the high-risk classification in Annex III. Limited-risk or minimal-risk obligations may still apply (e.g., transparency obligations under Article 50). A FRIA is <strong>not required</strong> for non-high-risk systems.
            </p>
          </div>
        )}
        <div style={{ padding: "16px 20px", background: "#f8fafc", borderRadius: 10, border: "1px solid #e2e8f0" }}>
          <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.6, margin: 0, fontFamily: SANS }}>
            <strong>Note:</strong> Classification may also be triggered through the <button onClick={() => onArticleClick?.(6)} style={{ background: "none", border: "none", color: "#1e3a5f", textDecoration: "underline", cursor: "pointer", fontSize: 13, fontFamily: SANS, padding: 0 }}>Article 6</button> product safety route (Annex I). This screening focuses on the Annex III use-case route.
          </p>
        </div>
      </div>
    );
  };

  const renderDeployer = () => (
    <div>
      <p style={{ fontSize: 14, color: "#546478", lineHeight: 1.7, marginBottom: 24, fontFamily: SANS }}>
        Article 27(1) requires certain deployer types to conduct a FRIA before putting a high-risk AI system into use. What type of entity are you?
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {DEPLOYER_TYPES.map((dt) => {
          const selected = answers.deployerType === dt.id;
          return (
            <button
              key={dt.id}
              onClick={() => handleDeployerSelect(dt.id)}
              style={{
                display: "flex", alignItems: "flex-start", gap: 14, padding: "16px 20px",
                background: selected ? "#f0f4ff" : "#fafaf8",
                border: `2px solid ${selected ? "#1e3a5f" : "#e8e4de"}`,
                borderRadius: 12, cursor: "pointer", textAlign: "left",
                transition: "all 0.15s", fontFamily: SANS,
              }}
            >
              <div style={{
                width: 20, height: 20, borderRadius: "50%", border: `2px solid ${selected ? "#1e3a5f" : "#cbd5e1"}`,
                background: selected ? "#1e3a5f" : "white", display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, marginTop: 2,
              }}>
                {selected && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "white" }} />}
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a" }}>{dt.label}</span>
                  <span style={{
                    fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 6,
                    background: dt.friaRequired ? "#fef2f2" : "#f0fdf4",
                    color: dt.friaRequired ? "#dc2626" : "#16a34a",
                  }}>
                    {dt.friaRequired ? "FRIA Required" : "FRIA Not Required"}
                  </span>
                </div>
                <div style={{ fontSize: 13, color: "#546478", lineHeight: 1.5, marginBottom: 6 }}>{dt.description}</div>
                {dt.note && <div style={{ fontSize: 12, color: "#4a5f74", lineHeight: 1.5, fontStyle: "italic" }}>{dt.note}</div>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderRights = () => (
    <div>
      <p style={{ fontSize: 14, color: "#546478", lineHeight: 1.7, marginBottom: 24, fontFamily: SANS }}>
        Select all fundamental rights categories from the EU Charter that your AI system could potentially impact. This creates your rights impact profile.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {FUNDAMENTAL_RIGHTS.map((right) => {
          const selected = answers.selectedRights.includes(right.id);
          return (
            <button
              key={right.id}
              onClick={() => handleRightsToggle(right.id)}
              style={{
                display: "flex", alignItems: "flex-start", gap: 14, padding: "16px 20px",
                background: selected ? "#fef2f2" : "#fafaf8",
                border: `2px solid ${selected ? "#dc2626" : "#e8e4de"}`,
                borderRadius: 12, cursor: "pointer", textAlign: "left",
                transition: "all 0.15s", fontFamily: SANS,
              }}
            >
              <div style={{
                width: 22, height: 22, borderRadius: 6, border: `2px solid ${selected ? "#dc2626" : "#cbd5e1"}`,
                background: selected ? "#dc2626" : "white", display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, marginTop: 1,
              }}>
                {selected && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg>}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a", marginBottom: 2 }}>{right.label}</div>
                <div style={{ fontSize: 12, color: "#4a5f74", marginBottom: 6 }}>{right.charter}</div>
                <div style={{ fontSize: 13, color: "#546478", lineHeight: 1.5, marginBottom: 4 }}>{right.description}</div>
                <div style={{ fontSize: 12, color: "#4a5f74", fontStyle: "italic" }}>e.g. {right.examples}</div>
              </div>
            </button>
          );
        })}
      </div>
      {answers.selectedRights.length > 0 && (
        <div style={{ marginTop: 20, padding: "16px 20px", borderRadius: 10, background: getRiskLevel().bg, border: `1px solid ${getRiskLevel().color}22` }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: getRiskLevel().color, margin: 0, fontFamily: SANS }}>
            Rights Impact Level: {getRiskLevel().level} — {answers.selectedRights.length} of 7 categories impacted
          </p>
        </div>
      )}
    </div>
  );

  const renderDPIA = () => (
    <div>
      <p style={{ fontSize: 14, color: "#546478", lineHeight: 1.7, marginBottom: 24, fontFamily: SANS }}>
        Article 27(4) allows deployers to reuse relevant parts of an existing Data Protection Impact Assessment (DPIA) when conducting a FRIA. This can significantly reduce the effort required.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
        {[
          { value: true, label: "Yes, I have an existing DPIA for this AI system" },
          { value: false, label: "No, I don't have a DPIA" },
        ].map(({ value, label }) => {
          const selected = answers.hasDPIA === value;
          return (
            <button
              key={String(value)}
              onClick={() => setAnswers(prev => ({ ...prev, hasDPIA: value }))}
              style={{
                display: "flex", alignItems: "center", gap: 14, padding: "16px 20px",
                background: selected ? "#f0f4ff" : "#fafaf8",
                border: `2px solid ${selected ? "#1e3a5f" : "#e8e4de"}`,
                borderRadius: 12, cursor: "pointer", textAlign: "left",
                transition: "all 0.15s", fontFamily: SANS, fontSize: 14,
              }}
            >
              <div style={{
                width: 20, height: 20, borderRadius: "50%", border: `2px solid ${selected ? "#1e3a5f" : "#cbd5e1"}`,
                background: selected ? "#1e3a5f" : "white", display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                {selected && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "white" }} />}
              </div>
              {label}
            </button>
          );
        })}
      </div>

      {answers.hasDPIA && (
        <div style={{ padding: "20px", background: "#f0f4ff", borderRadius: 12, border: "1px solid #c7d6ec" }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: "#1e3a5f", margin: "0 0 12px", fontFamily: SANS }}>
            How comprehensive is your DPIA?
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { value: "comprehensive", label: "Comprehensive — covers the same AI system, data, and risks", reuse: "~40% of FRIA can be pre-populated" },
              { value: "partial", label: "Partial — covers some aspects but not the full AI deployment", reuse: "~20% of FRIA can be pre-populated" },
              { value: "minimal", label: "Minimal — exists but is outdated or covers different scope", reuse: "~10% of FRIA can be pre-populated" },
            ].map(({ value, label, reuse }) => {
              const selected = answers.dpiaScope === value;
              return (
                <button
                  key={value}
                  onClick={() => setAnswers(prev => ({ ...prev, dpiaScope: value }))}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px",
                    background: selected ? "white" : "transparent",
                    border: `1.5px solid ${selected ? "#1e3a5f" : "transparent"}`,
                    borderRadius: 8, cursor: "pointer", textAlign: "left",
                    fontFamily: SANS, fontSize: 13,
                  }}
                >
                  <span style={{ color: "#374151" }}>{label}</span>
                  <span style={{ fontSize: 11, color: "#1e3a5f", fontWeight: 600, flexShrink: 0 }}>{reuse}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {answers.hasDPIA === false && (
        <div style={{ padding: "16px 20px", background: "#fffbeb", borderRadius: 10, border: "1px solid #fde68a" }}>
          <p style={{ fontSize: 14, color: "#92400e", lineHeight: 1.6, margin: 0, fontFamily: SANS }}>
            <strong>Recommendation:</strong> Consider conducting a DPIA alongside your FRIA. Under Article 27(4), a joint assessment reduces effort and ensures alignment between privacy and fundamental rights obligations.
          </p>
        </div>
      )}
    </div>
  );

  const renderResults = () => {
    const friaRequired = getFriaRequired();
    const risk = getRiskLevel();
    const categories = answers.useCases.map(id => ANNEX_III_CATEGORIES.find(c => c.id === id)).filter(Boolean);
    const deployer = DEPLOYER_TYPES.find(d => d.id === answers.deployerType);
    const dpiaReuse = getDpiaReusePercent();

    return (
      <div className="fria-results-print">
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%", margin: "0 auto 16px",
            background: friaRequired ? "#fff7ed" : "#f0fdf4",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {friaRequired ? (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2"><path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            ) : (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>
            )}
          </div>
          <h3 className="fria-results-title" style={{ fontSize: 22, fontWeight: 500, color: "#1a1a1a", margin: "0 0 8px", fontFamily: SERIF }}>
            {friaRequired ? "FRIA is Required" : "FRIA is Not Required"}
          </h3>
          <p style={{ fontSize: 14, color: "#546478", fontFamily: SANS }}>
            {friaRequired
              ? "Under Article 27, your organisation must conduct a Fundamental Rights Impact Assessment before deploying this AI system."
              : "Based on your deployer type, a FRIA is not legally required. However, conducting one voluntarily demonstrates responsible AI governance."
            }
          </p>
        </div>

        {/* Summary Cards */}
        <div className="fria-results-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, marginBottom: 24 }}>
          <div style={{ padding: "20px", background: "#f8fafc", borderRadius: 12, border: "1px solid #e2e8f0" }}>
            <p style={{ fontSize: 11, color: "#4a5f74", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, margin: "0 0 8px", fontFamily: SANS }}>Classification</p>
            <p style={{ fontSize: 16, fontWeight: 600, color: "#1a1a1a", margin: 0, fontFamily: SANS }}>{answers.isHighRisk ? "High-Risk" : "Not High-Risk"}</p>
            {categories.length > 0 && <p style={{ fontSize: 13, color: "#546478", margin: "4px 0 0", fontFamily: SANS }}>{categories.map(c => c.label).join(", ")}</p>}
          </div>
          <div style={{ padding: "20px", background: "#f8fafc", borderRadius: 12, border: "1px solid #e2e8f0" }}>
            <p style={{ fontSize: 11, color: "#4a5f74", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, margin: "0 0 8px", fontFamily: SANS }}>Deployer Type</p>
            <p style={{ fontSize: 16, fontWeight: 600, color: "#1a1a1a", margin: 0, fontFamily: SANS }}>{deployer?.label || "—"}</p>
            <p style={{ fontSize: 13, color: friaRequired ? "#ea580c" : "#16a34a", fontWeight: 600, margin: "4px 0 0", fontFamily: SANS }}>
              {friaRequired ? "FRIA Obligated" : "FRIA Optional"}
            </p>
          </div>
          <div style={{ padding: "20px", background: risk.bg, borderRadius: 12, border: `1px solid ${risk.color}22` }}>
            <p style={{ fontSize: 11, color: "#4a5f74", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, margin: "0 0 8px", fontFamily: SANS }}>Rights Impact</p>
            <p style={{ fontSize: 16, fontWeight: 600, color: risk.color, margin: 0, fontFamily: SANS }}>{risk.level} Risk</p>
            <p style={{ fontSize: 13, color: "#546478", margin: "4px 0 0", fontFamily: SANS }}>{answers.selectedRights.length} of 7 right categories impacted</p>
          </div>
          <div style={{ padding: "20px", background: "#f8fafc", borderRadius: 12, border: "1px solid #e2e8f0" }}>
            <p style={{ fontSize: 11, color: "#4a5f74", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, margin: "0 0 8px", fontFamily: SANS }}>DPIA Reuse</p>
            <p style={{ fontSize: 16, fontWeight: 600, color: "#1a1a1a", margin: 0, fontFamily: SANS }}>{dpiaReuse}% Reusable</p>
            <p style={{ fontSize: 13, color: "#546478", margin: "4px 0 0", fontFamily: SANS }}>{answers.hasDPIA ? "Under Article 27(4)" : "No existing DPIA"}</p>
          </div>
        </div>

        {/* Rights Heatmap */}
        <div style={{ marginBottom: 24 }}>
          <h4 style={{ fontSize: 15, fontWeight: 600, color: "#1a1a1a", margin: "0 0 12px", fontFamily: SANS }}>Fundamental Rights Impact Heatmap</h4>
          <div className="fria-heatmap" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 8 }}>
            {FUNDAMENTAL_RIGHTS.map((right) => {
              const impacted = answers.selectedRights.includes(right.id);
              return (
                <div key={right.id} style={{
                  padding: "12px 16px", borderRadius: 8,
                  background: impacted ? "#fef2f2" : "#f8fafc",
                  border: `1px solid ${impacted ? "#fecaca" : "#e2e8f0"}`,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: impacted ? "#dc2626" : "#cbd5e1" }} />
                    <span style={{ fontSize: 13, fontWeight: 500, color: impacted ? "#991b1b" : "#4a5f74", fontFamily: SANS }}>{right.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Next Steps */}
        <div style={{ padding: "24px", background: "#f0f4ff", borderRadius: 12, border: "1px solid #c7d6ec", marginBottom: 24 }}>
          <h4 style={{ fontSize: 15, fontWeight: 600, color: "#1e3a5f", margin: "0 0 16px", fontFamily: SANS }}>Next Steps</h4>
          <ol style={{ margin: 0, paddingLeft: 20, fontFamily: SANS, fontSize: 14, color: "#374151", lineHeight: 2 }}>
            {friaRequired && <li>Conduct a full FRIA covering all 10 sections (90 questions)</li>}
            {friaRequired && <li>Document your assessment per Article 27(1) requirements</li>}
            {answers.hasDPIA && <li>Leverage your existing DPIA under Article 27(4) to pre-populate applicable sections</li>}
            <li>Review your AI system's compliance with {answers.isHighRisk ? "Articles 8-15 (high-risk requirements)" : "Article 50 (transparency obligations)"}</li>
            {friaRequired && <li>Notify the relevant market surveillance authority per Article 27(1)</li>}
            <li>Establish ongoing monitoring and periodic review processes</li>
            {answers.isHighRisk && <li>Ensure conformity assessment under Article 43 before market placement</li>}
          </ol>
        </div>

        {/* Email gate + download */}
        <div style={{ padding: "24px", background: "white", borderRadius: 12, border: "2px solid #1e3a5f" }}>
          <h4 style={{ fontSize: 15, fontWeight: 600, color: "#1e3a5f", margin: "0 0 8px", fontFamily: SANS }}>
            Save Your Results
          </h4>
          <p style={{ fontSize: 13, color: "#546478", margin: "0 0 16px", fontFamily: SANS }}>
            Enter your email to receive a copy of this screening summary, plus updates when the official FRIA template is published.
          </p>
          {emailStatus === "success" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: "#f0fdf4", borderRadius: 8 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
                <span style={{ fontSize: 14, color: "#16a34a", fontWeight: 500, fontFamily: SANS }}>Saved! Check your inbox.</span>
              </div>
              <button onClick={handlePrint} style={btnPrimary}>
                Print / Save as PDF
              </button>
            </div>
          ) : (
            <form onSubmit={handleEmailSubmit} className="fria-email-form" style={{ display: "flex", gap: 10 }}>
              <input
                type="email"
                aria-label="Email address to save screening results"
                placeholder="you@company.com"
                value={answers.email}
                onChange={e => { setAnswers(prev => ({ ...prev, email: e.target.value })); if (emailStatus === "error") setEmailStatus(null); }}
                style={{
                  flex: 1, padding: "12px 16px", border: emailStatus === "error" ? "1.5px solid #ef4444" : "1px solid #d1d5db",
                  borderRadius: 10, fontSize: 14, fontFamily: SANS, outline: "none",
                }}
              />
              <button type="submit" disabled={emailStatus === "loading"} style={{ ...btnPrimary, opacity: emailStatus === "loading" ? 0.7 : 1 }}>
                {emailStatus === "loading" ? "Saving…" : "Save & Download"}
              </button>
            </form>
          )}
          {emailStatus === "error" && emailError && (
            <p style={{ fontSize: 12, color: "#ef4444", margin: "8px 0 0", fontFamily: SANS }}>{emailError}</p>
          )}
        </div>
      </div>
    );
  };

  // Early exit views
  if (getNotInScope()) {
    return (
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 0" }}>
        <div style={cardStyle}>
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#f0fdf4", margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 500, color: "#1a1a1a", margin: "0 0 12px", fontFamily: SERIF }}>Not in Scope</h2>
            <p style={{ fontSize: 14, color: "#546478", lineHeight: 1.7, maxWidth: 500, margin: "0 auto 24px", fontFamily: SANS }}>
              Your system does not appear to meet the Article 3(1) definition of an AI system. The EU AI Act obligations, including the FRIA requirement, do not apply.
            </p>
            <p style={{ fontSize: 13, color: "#4a5f74", lineHeight: 1.6, maxWidth: 500, margin: "0 auto 24px", fontFamily: SANS }}>
              Note: Other regulations (GDPR, Product Liability Directive) may still apply. Consider reviewing your system against the full <button onClick={() => onArticleClick?.(3)} style={{ background: "none", border: "none", color: "#1e3a5f", textDecoration: "underline", cursor: "pointer", fontSize: 13, fontFamily: SANS, padding: 0 }}>Article 3 definitions</button>.
            </p>
            <button onClick={() => { setStep(0); setAnswers(prev => ({ ...prev, aiCriteria: [], isAI: null })); }} style={btnPrimary}>
              Start Over
            </button>
          </div>
        </div>
      </div>
    );
  }

  // FAQPage structured data for FRIA screening questions
  useEffect(() => {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Is my system an AI system under Article 3(1) of the EU AI Act?",
          "acceptedAnswer": { "@type": "Answer", "text": "An AI system under Article 3(1) is a machine-based system that operates with some level of autonomy, uses machine learning, logic, or statistics-based approaches, generates outputs such as predictions, recommendations, decisions, or content, and is designed for explicit or implicit objectives." }
        },
        {
          "@type": "Question",
          "name": "Does my AI system fall under a high-risk use case in Annex III of the EU AI Act?",
          "acceptedAnswer": { "@type": "Answer", "text": "Annex III lists 8 high-risk categories: biometric identification, critical infrastructure, education and vocational training, employment and worker management, essential public and private services, law enforcement, migration and border control, and administration of justice and democratic processes." }
        },
        {
          "@type": "Question",
          "name": "What type of organisation deployer am I under Article 27?",
          "acceptedAnswer": { "@type": "Answer", "text": "Article 27(1) distinguishes four deployer types: public authorities or bodies, private entities providing public services, entities using AI for credit scoring or life/health insurance assessment, and other private entities. Only the first three are obligated to conduct a FRIA." }
        },
        {
          "@type": "Question",
          "name": "Which fundamental rights could my AI system impact?",
          "acceptedAnswer": { "@type": "Answer", "text": "The EU Charter of Fundamental Rights covers seven title areas: Human Dignity (Articles 1-5), Freedoms (Articles 6-19), Equality and Non-Discrimination (Articles 20-26), Solidarity (Articles 27-38), Citizens' Rights (Articles 39-46), Justice (Articles 47-50), and General Provisions (Articles 51-54)." }
        },
        {
          "@type": "Question",
          "name": "Do I need to do a FRIA under the EU AI Act?",
          "acceptedAnswer": { "@type": "Answer", "text": "A Fundamental Rights Impact Assessment (FRIA) is mandatory under Article 27 for deployers of high-risk AI systems who are public bodies, private entities providing public services, or entities using AI for creditworthiness or life/health insurance assessment. The deadline is 2 August 2026." }
        },
        {
          "@type": "Question",
          "name": "Can I reuse my existing DPIA for the FRIA?",
          "acceptedAnswer": { "@type": "Answer", "text": "Yes. Article 27(4) creates a bridge between the FRIA and the GDPR Article 35 DPIA. If you have already conducted a DPIA for the same AI system, you can reuse relevant sections. A comprehensive DPIA may cover 30-40% of FRIA requirements." }
        },
        {
          "@type": "Question",
          "name": "What is the deadline for conducting a FRIA under the EU AI Act?",
          "acceptedAnswer": { "@type": "Answer", "text": "The FRIA obligation applies from 2 August 2026 — the date when the full provisions on high-risk AI systems become applicable. Deployers already using high-risk AI systems on that date must conduct their FRIA as soon as possible." }
        }
      ]
    };
    let el = document.getElementById("fria-faq-jsonld");
    if (!el) {
      el = document.createElement("script");
      el.type = "application/ld+json";
      el.id = "fria-faq-jsonld";
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(faqSchema);
    return () => { el.remove(); };
  }, []);

  return (
    <div style={{ maxWidth: 780, margin: "0 auto", padding: "40px 0" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 16px", background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 20, fontSize: 12, color: "#9a3412", fontWeight: 600, marginBottom: 16, fontFamily: SANS }}>
          FRIA Screening Tool
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 400, color: "#1a1a1a", margin: "0 0 8px", fontFamily: SERIF }}>
          Am I required to do a FRIA?
        </h1>
        <p style={{ fontSize: 15, color: "#546478", lineHeight: 1.6, fontFamily: SANS }}>
          Answer a few questions to determine your obligations under Article 27 of the EU AI Act.
        </p>
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#1e3a5f", fontFamily: SANS }}>Step {step + 1} of {STEPS.length}</span>
          <span style={{ fontSize: 12, color: "#4a5f74", fontFamily: SANS }}>{progressPercent}%</span>
        </div>
        <div style={{ height: 6, background: "#e8e4de", borderRadius: 3, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${progressPercent}%`, background: "#1e3a5f", borderRadius: 3, transition: "width 0.3s ease" }} />
        </div>
        {/* Step labels */}
        <div className="fria-step-tabs" style={{ display: "flex", gap: 4, marginTop: 12 }}>
          {STEPS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => { if (i < step) setStep(i); }}
              disabled={i > step}
              style={{
                flex: 1, padding: "8px 4px", background: i === step ? "#f0f4ff" : i < step ? "#f0fdf4" : "#fafaf8",
                border: `1px solid ${i === step ? "#c7d6ec" : i < step ? "#bbf7d0" : "#e8e4de"}`,
                borderRadius: 6, fontSize: 11, color: i <= step ? "#374151" : "#4a5f74",
                fontFamily: SANS, cursor: i < step ? "pointer" : "default",
                fontWeight: i === step ? 600 : 400, transition: "all 0.15s",
              }}
            >
              {s.title}
            </button>
          ))}
        </div>
      </div>

      {/* Current step card */}
      <div className="fria-card-inner" style={cardStyle}>
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 500, color: "#1a1a1a", margin: "0 0 4px", fontFamily: SERIF }}>
            {STEPS[step].title}
          </h2>
          <p style={{ fontSize: 14, color: "#4a5f74", margin: 0, fontFamily: SANS }}>
            {STEPS[step].subtitle}
          </p>
        </div>
        {renderStep()}
      </div>

      {/* Navigation */}
      {step < 6 && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            style={{ ...btnSecondary, opacity: step === 0 ? 0.4 : 1 }}
          >
            Back
          </button>
          {step === 2 && !answers.isHighRisk ? (
            <button onClick={() => { setStep(0); setAnswers(prev => ({ ...prev, useCases: [], isHighRisk: null })); }} style={btnPrimary}>
              Start Over
            </button>
          ) : (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              style={{ ...btnPrimary, opacity: canProceed() ? 1 : 0.5 }}
            >
              {step === 5 ? "See Results" : "Continue"}
            </button>
          )}
        </div>
      )}

      {step === 6 && (
        <div style={{ textAlign: "center", marginTop: 8 }}>
          <button onClick={() => { setStep(0); setAnswers({ aiCriteria: [], isAI: null, useCases: [], isHighRisk: null, deployerType: null, selectedRights: [], hasDPIA: null, dpiaScope: "", email: "" }); setEmailStatus(null); }} style={btnSecondary}>
            Start a New Screening
          </button>
        </div>
      )}
    </div>
  );
}
