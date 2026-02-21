export const BLOG_POSTS = [
  {
    slug: "article-27-fria-requirements-explained",
    title: "Article 27 Deep Dive: FRIA Requirements Explained",
    subtitle: "What deployers of high-risk AI systems need to know about fundamental rights impact assessments",
    author: "Paul McCormack",
    authorRole: "AI Governance & Compliance",
    date: "2026-02-20",
    readTime: "12 min read",
    category: "Deep Dive",
    tags: ["FRIA", "Article 27", "High-Risk AI", "Deployer Obligations"],
    metaDescription: "Comprehensive guide to Article 27 of the EU AI Act — FRIA requirements, who must comply, the 2 August 2026 deadline, and how to prepare your fundamental rights impact assessment.",
    metaKeywords: "FRIA EU AI Act, Article 27 AI Act, fundamental rights impact assessment, FRIA template, EU AI Act deployer obligations",
    content: [
      { type: "lead", text: "Article 27 of the EU AI Act introduces the fundamental rights impact assessment (FRIA) — a mandatory obligation for certain deployers of high-risk AI systems. With the 2 August 2026 deadline approaching, this article explains exactly who must comply, what a FRIA involves, and how to prepare." },

      { type: "diagram", title: "FRIA Decision Flow — Am I Required to Do a FRIA?", caption: "Simplified decision tree based on Article 27(1) and Annex III. Use the FRIA Screening Tool for a full interactive assessment.", steps: [
        { type: "start", text: "Is your system an AI system under Article 3(1)?" },
        { type: "diamond", text: "Does it fall under a high-risk use case in Annex III?", ref: "Article 6(2)" },
        { type: "diamond", text: "Are you a public body, public service provider, or credit/insurance deployer?", ref: "Article 27(1)" },
        { type: "yes", text: "FRIA is required before putting the system into use", badge: "YES", ref: "Deadline: 2 August 2026" },
        { type: "no", text: "FRIA not legally required — but voluntary assessment recommended", badge: "NO", ref: "Best practice under Article 27" },
      ]},

      { type: "heading", text: "Who Must Conduct a FRIA?" },
      { type: "paragraph", text: "Not every organisation that uses AI is obligated to conduct a FRIA. Article 27(1) specifies three categories of deployers who must perform this assessment before putting a high-risk AI system into use:" },
      { type: "list", items: [
        "Public authorities and bodies (government departments, agencies, local authorities)",
        "Private entities providing public services (healthcare providers, utility companies, public transport operators)",
        "Deployers using AI for creditworthiness assessment or life and health insurance risk/pricing (Annex III, point 5(b) and (c))"
      ]},
      { type: "paragraph", text: "Crucially, the obligation applies to deployers — not providers. A deployer is the organisation using the AI system under its own authority, while the provider is the entity that developed it. This distinction matters because the deployer is closest to the actual impact on individuals' fundamental rights." },

      { type: "heading", text: "What Does a FRIA Cover?" },
      { type: "paragraph", text: "The FRIA must assess the impact of the high-risk AI system on the fundamental rights enshrined in the EU Charter of Fundamental Rights. Article 27(1) specifically lists the following areas:" },
      { type: "list", items: [
        "A description of the deployer's processes using the high-risk AI system",
        "The period of time and frequency for which the system will be used",
        "Categories of persons and groups likely to be affected",
        "Specific risks of harm likely to impact the identified categories",
        "Description of human oversight measures",
        "Measures to be taken if risks materialise, including governance and complaint mechanisms"
      ]},
      { type: "paragraph", text: "The assessment must be performed before the high-risk AI system is put into use. It is not a one-time exercise — deployers should update it when circumstances change materially." },

      { type: "heading", text: "The Article 27(4) DPIA Bridge" },
      { type: "paragraph", text: "One of the most important provisions for practitioners is Article 27(4), which creates a bridge between the FRIA and the data protection impact assessment (DPIA) under GDPR Article 35." },
      { type: "callout", text: "\"Where the obligations set out in paragraph 1 of this Article are already met through the data protection impact assessment carried out pursuant to Article 35 of Regulation (EU) 2016/679 [...] the fundamental rights impact assessment [...] shall complement that data protection impact assessment.\"" },
      { type: "paragraph", text: "This means that if you have already conducted a DPIA for the same AI system, you can reuse relevant sections of that assessment. In practice, a comprehensive DPIA may cover 30-40% of what a FRIA requires, particularly around data processing, privacy risks, and data subject impacts." },

      { type: "heading", text: "Timeline and Deadline" },
      { type: "paragraph", text: "The FRIA obligation applies from 2 August 2026 — the date when the full provisions on high-risk AI systems become applicable. Deployers who are already using high-risk AI systems on that date must conduct their FRIA as soon as possible and no later than the application deadline." },
      { type: "paragraph", text: "The EU AI Office is expected to publish a FRIA template questionnaire under Article 27(5), but this has not yet been released. Organisations should not wait for this template before starting their preparation — the substantive requirements in Article 27(1) are already clear enough to begin." },

      { type: "heading", text: "Market Surveillance Notification" },
      { type: "paragraph", text: "Article 27(1) also requires deployers to notify the relevant market surveillance authority of the results of the FRIA. This is a significant obligation that goes beyond internal documentation — it creates an external accountability mechanism." },
      { type: "paragraph", text: "The notification must be submitted to the authority designated under Article 70. For most EU member states, this is the national data protection authority or a dedicated AI authority." },

      { type: "heading", text: "Practical Preparation Steps" },
      { type: "list", items: [
        "Inventory your AI systems: Identify all AI systems in use and classify them against Annex III",
        "Determine your deployer type: Confirm whether you fall under Article 27(1) obligations",
        "Audit existing DPIAs: Map which DPIAs can be leveraged under Article 27(4)",
        "Identify affected rights: Map each AI system to the Charter rights it could impact",
        "Build your assessment team: Involve legal, technical, DPO, and affected stakeholder representatives",
        "Start documenting: Begin recording processes, oversight measures, and risk mitigation strategies",
        "Monitor for the official template: Track the EU AI Office for the Article 27(5) template publication"
      ]},

      { type: "heading", text: "Key Takeaways" },
      { type: "list", items: [
        "The FRIA is mandatory for public bodies, public service providers, and credit/insurance deployers of high-risk AI",
        "It must be conducted before the AI system is put into use",
        "Existing DPIAs can be reused under Article 27(4) to reduce effort",
        "The August 2026 deadline is approaching — preparation should begin now",
        "Market surveillance authorities must be notified of FRIA results",
        "The EU AI Office template is not yet published but the requirements are clear"
      ]},
    ],
  },
  {
    slug: "fria-vs-dpia-difference",
    title: "FRIA vs DPIA: What's the Difference and How They Work Together",
    subtitle: "Understanding the relationship between the EU AI Act's FRIA and the GDPR's DPIA — and why Article 27(4) is the key provision",
    author: "Paul McCormack",
    authorRole: "AI Governance & Compliance",
    date: "2026-02-18",
    readTime: "10 min read",
    category: "Comparison",
    tags: ["FRIA", "DPIA", "Article 27(4)", "GDPR", "Integration"],
    metaDescription: "FRIA vs DPIA comparison — how the EU AI Act's fundamental rights impact assessment differs from the GDPR's data protection impact assessment, and how Article 27(4) connects them.",
    metaKeywords: "FRIA vs DPIA, Article 27(4), DPIA AI Act, fundamental rights impact assessment vs data protection impact assessment",
    content: [
      { type: "lead", text: "If you're a DPO or compliance officer preparing for the EU AI Act, you've likely asked: how does the new FRIA relate to the DPIA I already do under GDPR? This article breaks down the differences, overlaps, and the critical Article 27(4) bridge provision." },

      { type: "diagram", title: "FRIA vs DPIA — Scope Comparison", caption: "The FRIA encompasses all EU Charter rights. The DPIA focuses on data protection. Article 27(4) bridges them.", steps: [
        { type: "start", text: "DPIA — Data Protection Impact Assessment", ref: "GDPR Article 35" },
        { type: "diamond", text: "Privacy (Art. 7) + Data Protection (Art. 8) — Shared overlap zone reusable under Article 27(4)", ref: "~30-40% of FRIA pre-populated" },
        { type: "start", text: "FRIA — Fundamental Rights Impact Assessment", ref: "AI Act Article 27" },
        { type: "yes", text: "Dignity · Freedoms · Equality · Non-Discrimination · Solidarity · Workers' Rights · Children's Rights · Justice · Effective Remedy", badge: "FRIA-ONLY", ref: "EU Charter Titles I-VII" },
      ]},

      { type: "heading", text: "At a Glance: FRIA vs DPIA" },
      { type: "table", headers: ["Dimension", "DPIA (GDPR Art. 35)", "FRIA (AI Act Art. 27)"], rows: [
        ["Legal basis", "Regulation (EU) 2016/679 (GDPR)", "Regulation (EU) 2024/1689 (AI Act)"],
        ["Trigger", "High-risk processing of personal data", "Deployment of high-risk AI by specific deployer types"],
        ["Scope", "Data protection and privacy rights", "All fundamental rights in the EU Charter"],
        ["Who must conduct", "Data controller", "Deployer (public body, public service provider, credit/insurance)"],
        ["When", "Before processing begins", "Before AI system is put into use"],
        ["Notify authority", "DPA if high risk remains (Art. 36)", "Market surveillance authority (mandatory, Art. 27(1))"],
        ["Focus", "Privacy risks to data subjects", "Broader rights: dignity, freedoms, equality, solidarity, justice"],
      ]},

      { type: "heading", text: "The Core Difference: Scope of Rights" },
      { type: "paragraph", text: "The most fundamental difference is scope. A DPIA focuses specifically on data protection and privacy — the right to privacy under Article 7 of the Charter and the right to data protection under Article 8. A FRIA must assess impact across the entire Charter of Fundamental Rights." },
      { type: "paragraph", text: "This means a FRIA considers rights that a DPIA typically doesn't address: human dignity, non-discrimination, freedom of expression, workers' rights, the right to an effective remedy, and children's rights, among others." },
      { type: "paragraph", text: "In practice, an AI system used for recruitment (Annex III, category 4) needs a FRIA that assesses discrimination risks (Article 21 of the Charter), workers' rights (Article 27-31), and equality before the law (Article 20) — none of which a standard DPIA would cover." },

      { type: "heading", text: "The Overlap: What DPIAs and FRIAs Share" },
      { type: "paragraph", text: "Despite the scope difference, there is significant overlap:" },
      { type: "list", items: [
        "System description — both require documenting what the system does, how it processes data, and its purpose",
        "Affected persons — both identify who is impacted and what groups are vulnerable",
        "Risk assessment methodology — both use systematic risk identification and evaluation",
        "Mitigation measures — both document controls to reduce identified risks",
        "Governance structures — both address oversight, review processes, and accountability"
      ]},
      { type: "paragraph", text: "This overlap is exactly why Article 27(4) exists — to prevent unnecessary duplication of effort." },

      { type: "heading", text: "Article 27(4): The Bridge Provision" },
      { type: "paragraph", text: "Article 27(4) explicitly allows deployers to build on their existing DPIA work:" },
      { type: "callout", text: "Where the FRIA obligations are already met through a DPIA under GDPR Article 35 or the Law Enforcement Directive Article 27, the FRIA shall complement — not duplicate — that assessment." },
      { type: "paragraph", text: "In practice, this means:" },
      { type: "list", items: [
        "If you have a comprehensive DPIA for the same AI system, you can reuse the system description, data flow mapping, affected person analysis, and privacy risk assessment sections",
        "The FRIA then becomes a complementary assessment that adds the non-privacy fundamental rights dimensions",
        "You save significant effort on sections S1 (system description), S2 (affected persons), and parts of S4 (privacy/freedom rights)",
        "Estimated effort reduction: 30-40% if the DPIA is comprehensive and current"
      ]},

      { type: "heading", text: "A Unified Assessment Architecture" },
      { type: "paragraph", text: "For organisations with multiple AI systems, the most efficient approach is a unified assessment architecture. Instead of treating the FRIA and DPIA as separate exercises, create a shared 'processing activity nucleus' that captures common data once:" },
      { type: "list", items: [
        "Entity context (organisation details, sector, jurisdictions) — used by both DPIA and FRIA",
        "Data context (data categories, subjects, volume) — used by DPIA, reusable in FRIA",
        "Processing context (purposes, legal basis, automation level) — used by both",
        "Transfer context (recipients, locations, mechanisms) — drives TIA, referenced in both",
        "Technology context (AI system details, risk classification) — FRIA-specific but shared with AI inventory"
      ]},
      { type: "paragraph", text: "This approach eliminates duplicate data entry and ensures consistency across assessments. When the processing activity changes, all linked assessments are flagged for review." },

      { type: "heading", text: "When Do You Need Both?" },
      { type: "paragraph", text: "Most high-risk AI systems that require a FRIA will also require a DPIA. This is because high-risk AI systems almost always involve processing personal data of individuals whose rights are affected." },
      { type: "paragraph", text: "The main scenario where you'd have a FRIA without a DPIA is an AI system that doesn't process personal data but still impacts fundamental rights — for example, an AI used in critical infrastructure management that affects safety rights without processing individual data. In practice, this is rare." },

      { type: "heading", text: "Practical Recommendations" },
      { type: "list", items: [
        "Don't duplicate effort — audit your existing DPIAs first and map reusable sections",
        "Build integrated teams — your FRIA team should include your DPO from the start",
        "Use a shared data model — capture AI system information once, reference it in both assessments",
        "Align your review cycles — schedule DPIA and FRIA reviews together for each AI system",
        "Document the Article 27(4) connection — explicitly note which FRIA sections reuse DPIA findings",
        "Prepare for regulatory scrutiny — market surveillance authorities will expect to see how your FRIA and DPIA relate"
      ]},

      { type: "heading", text: "Key Takeaways" },
      { type: "list", items: [
        "The DPIA focuses on data protection; the FRIA covers all Charter fundamental rights",
        "Article 27(4) explicitly allows DPIA reuse within the FRIA — saving 30-40% of effort",
        "A unified assessment architecture is the most efficient approach for multiple AI systems",
        "Most high-risk AI systems will require both a DPIA and a FRIA",
        "Start with your existing DPIAs and build the FRIA as a complementary layer"
      ]},
    ],
  },
];
