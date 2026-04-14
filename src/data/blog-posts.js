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
    metaDescription: "Who must do a FRIA under Article 27? Public bodies, public service providers, and credit/insurance deployers. Deadline: 2 Aug 2026. Full requirements and prep guide.",
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
      { type: "numbered-action", items: [
        { action: "Inventory your AI systems", detail: "Identify all AI systems in use and classify them against Annex III categories to determine which are high-risk." },
        { action: "Determine your deployer type", detail: "Confirm whether you fall under Article 27(1) obligations as a public body, public service provider, or credit/insurance deployer." },
        { action: "Audit existing DPIAs", detail: "Map which DPIAs can be leveraged under Article 27(4) to reduce the effort required for your FRIA." },
        { action: "Identify affected rights", detail: "Map each AI system to the EU Charter rights it could impact — covering all seven title areas." },
        { action: "Build your assessment team", detail: "Involve legal, technical, DPO, and affected stakeholder representatives from the outset." },
        { action: "Start documenting", detail: "Begin recording processes, human oversight measures, and risk mitigation strategies before the template is published." },
        { action: "Monitor for the official template", detail: "Track the EU AI Office for the Article 27(5) template publication — but don't wait for it to begin preparation." },
      ]},

      { type: "heading", text: "Key Takeaways" },
      { type: "takeaways", items: [
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
    metaDescription: "FRIA vs DPIA: what each covers, where they overlap, and how Article 27(4) lets you reuse your existing DPIA. Side-by-side comparison with practical guidance.",
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
  {
    slug: "prohibited-ai-practices-article-5-guide",
    title: "Article 5 Explained: The 8 Prohibited AI Practices You Need to Know",
    subtitle: "A plain-English breakdown of every AI practice banned outright under the EU AI Act — effective since 2 February 2025",
    author: "Paul McCormack",
    authorRole: "AI Governance & Compliance",
    date: "2026-03-04",
    readTime: "11 min read",
    category: "Deep Dive",
    tags: ["Article 5", "Prohibited Practices", "AI Literacy", "Compliance"],
    metaDescription: "All 8 banned AI practices under Article 5 — in force since Feb 2025. Fines up to EUR 35M. Subliminal manipulation, social scoring, facial scraping, and 5 more explained.",
    metaKeywords: "prohibited AI practices EU AI Act, Article 5 AI Act, banned AI systems Europe, social scoring AI ban, subliminal manipulation AI",
    content: [
      { type: "lead", text: "Article 5 is the sharpest edge of the EU AI Act. It bans eight categories of AI practice outright — no risk mitigation, no conformity assessment, no exceptions. These prohibitions have been in force since 2 February 2025, making them the first provisions of the AI Act to apply. If your AI system falls into any of these categories, it must be discontinued immediately." },

      { type: "heading", text: "Why Article 5 Matters Now" },
      { type: "paragraph", text: "While most of the EU AI Act phases in over time — high-risk obligations in August 2026, product safety rules in 2027 — the prohibited practices took effect on 2 February 2025. This means enforcement is already live. Any organisation deploying AI in the EU should have already audited its systems against these categories." },
      { type: "paragraph", text: "Penalties for violating Article 5 are the highest in the Act: up to EUR 35 million or 7% of global annual turnover, whichever is higher (Article 99(3)). For context, this exceeds GDPR's maximum fine framework." },

      { type: "heading", text: "The 8 Prohibited Practices" },

      { type: "heading", text: "1. Subliminal Manipulation" },
      { type: "paragraph", text: "Article 5(1)(a) prohibits AI systems that deploy subliminal techniques beyond a person's consciousness, or purposefully manipulative or deceptive techniques, to materially distort behaviour in a way that causes or is reasonably likely to cause significant harm." },
      { type: "paragraph", text: "The key elements: the technique must operate below conscious awareness or be deliberately deceptive, and the distortion must be material — meaning it genuinely changes a person's decision-making in a way that causes real harm. A recommendation algorithm that nudges preferences is not automatically caught; one that systematically exploits cognitive vulnerabilities to cause financial or physical harm likely is." },

      { type: "heading", text: "2. Exploitation of Vulnerabilities" },
      { type: "paragraph", text: "Article 5(1)(b) bans AI systems that exploit vulnerabilities of specific groups due to age, disability, or social or economic situation. This targets systems designed to take advantage of people who are less able to resist manipulation — for example, AI-driven marketing that targets elderly people with misleading financial products, or systems that exploit children's developmental vulnerabilities." },

      { type: "heading", text: "3. Social Scoring" },
      { type: "paragraph", text: "Article 5(1)(c) prohibits AI systems used by public authorities (or on their behalf) for general-purpose social scoring — evaluating or classifying people based on social behaviour or personality characteristics, where the resulting score leads to detrimental treatment that is unjustified or disproportionate." },
      { type: "paragraph", text: "This prohibition targets government-run social credit systems. Private loyalty programmes and credit scoring are not caught by this provision, though they may fall under other obligations as high-risk systems under Annex III." },

      { type: "heading", text: "4. Individual Criminal Offence Risk Assessment" },
      { type: "paragraph", text: "Article 5(1)(d) bans AI systems that assess the risk of a natural person committing criminal offences solely based on profiling or personality traits. The ban does not extend to AI systems that support human assessment based on objective, verifiable facts directly linked to criminal activity — it specifically targets pure predictive profiling." },

      { type: "heading", text: "5. Untargeted Facial Image Scraping" },
      { type: "paragraph", text: "Article 5(1)(e) prohibits creating or expanding facial recognition databases through untargeted scraping of facial images from the internet or CCTV footage. This directly addresses practices like those used by Clearview AI and similar services that build biometric databases without consent." },

      { type: "heading", text: "6. Emotion Recognition in Workplace and Education" },
      { type: "paragraph", text: "Article 5(1)(f) bans AI systems that infer emotions in workplace and educational settings, except where the system is intended for medical or safety purposes. An employer cannot use AI to monitor whether employees are 'engaged' or 'stressed' through facial analysis, but a system detecting driver fatigue in safety-critical transport is permitted." },

      { type: "heading", text: "7. Biometric Categorisation for Sensitive Attributes" },
      { type: "paragraph", text: "Article 5(1)(g) prohibits biometric categorisation systems that individually categorise people based on biometric data to deduce or infer race, political opinions, trade union membership, religious beliefs, sex life, or sexual orientation. Law enforcement use of biometric categorisation for other purposes may still be permissible under strict conditions." },

      { type: "heading", text: "8. Real-Time Remote Biometric Identification in Public Spaces" },
      { type: "paragraph", text: "Article 5(1)(h) prohibits real-time remote biometric identification (RBI) in publicly accessible spaces for law enforcement purposes — with three narrow exceptions: targeted search for victims of specific crimes (abduction, trafficking, sexual exploitation), prevention of a specific and imminent threat to life or a genuine terrorist threat, and identification of suspects of serious criminal offences listed in Annex II." },
      { type: "paragraph", text: "Even where exceptions apply, use requires prior judicial authorisation (except in duly justified cases of urgency) and must comply with strict necessity and proportionality requirements." },

      { type: "heading", text: "How to Audit Against Article 5" },
      { type: "numbered-action", items: [
        { action: "Inventory all AI systems", detail: "List every AI system deployed in your organisation, including third-party tools and embedded AI features in software you use." },
        { action: "Map to the 8 categories", detail: "For each system, assess whether it could fall within any of the eight prohibited categories. Pay particular attention to systems involving biometrics, behavioural analysis, or vulnerability targeting." },
        { action: "Document your assessment", detail: "Record why each system does or does not fall within scope. This documentation protects you in the event of a regulatory inquiry." },
        { action: "Discontinue or modify", detail: "Any system that falls within a prohibited category must be discontinued. If the system can be modified to remove the prohibited element, document the changes and reassess." },
        { action: "Monitor ongoing compliance", detail: "New AI features or use cases may inadvertently cross into prohibited territory. Build Article 5 checks into your AI procurement and deployment processes." },
      ]},

      { type: "heading", text: "Key Takeaways" },
      { type: "takeaways", items: [
        "Article 5 prohibitions have been in force since 2 February 2025 — enforcement is already live",
        "Eight categories of AI practice are banned outright, covering manipulation, social scoring, predictive policing, facial scraping, emotion recognition, biometric categorisation, and real-time biometric identification",
        "Penalties are the highest in the AI Act: up to EUR 35 million or 7% of global turnover",
        "Real-time biometric identification has three narrow law enforcement exceptions with strict safeguards",
        "Every organisation using AI should audit existing systems against these categories now",
      ]},
    ],
  },
  {
    slug: "high-risk-ai-classification-guide",
    title: "Is Your AI System High-Risk? A Practical Guide to Article 6 and Annex III",
    subtitle: "How to determine whether your AI system is classified as high-risk under the EU AI Act — and what that means for compliance",
    author: "Paul McCormack",
    authorRole: "AI Governance & Compliance",
    date: "2026-03-03",
    readTime: "14 min read",
    category: "Guide",
    tags: ["High-Risk AI", "Article 6", "Annex III", "Classification", "Compliance"],
    metaDescription: "Is your AI system high-risk? Two pathways under Article 6, all 8 Annex III categories explained, plus the Article 6(3) exception. Step-by-step classification guide.",
    metaKeywords: "high-risk AI EU AI Act, Article 6 classification, Annex III AI systems, EU AI Act high-risk requirements, AI risk classification",
    content: [
      { type: "lead", text: "The classification of your AI system as 'high-risk' is the single most consequential determination under the EU AI Act. High-risk systems face the full weight of the Act's requirements — risk management, data governance, technical documentation, human oversight, accuracy, robustness, and cybersecurity. Getting this classification right is the foundation of EU AI Act compliance." },

      { type: "diagram", title: "High-Risk Classification — Two Pathways", caption: "Article 6 establishes two routes to high-risk classification. Both lead to the same compliance obligations.", steps: [
        { type: "start", text: "Is your AI system a safety component of, or itself, a product covered by EU harmonisation legislation listed in Annex I?" },
        { type: "yes", text: "High-risk via Article 6(1) — product safety pathway", badge: "PATH 1", ref: "Annex I legislation" },
        { type: "start", text: "Does your AI system fall within one of the 8 use-case categories listed in Annex III?" },
        { type: "yes", text: "High-risk via Article 6(2) — use-case pathway", badge: "PATH 2", ref: "Annex III categories" },
      ]},

      { type: "heading", text: "Pathway 1: Product Safety (Article 6(1) + Annex I)" },
      { type: "paragraph", text: "The first pathway catches AI systems that are safety components of products already regulated under EU harmonisation legislation. If the product requires a third-party conformity assessment under its sector-specific legislation, and the AI component is a safety-relevant element, the system is classified as high-risk." },
      { type: "paragraph", text: "Annex I lists the relevant EU legislation — including the Machinery Regulation, Medical Devices Regulation, Civil Aviation Regulation, and others covering toys, lifts, pressure equipment, radio equipment, and vehicles. If your AI system operates within any of these regulated product categories and has safety relevance, it is high-risk." },
      { type: "paragraph", text: "The compliance deadline for Annex I product systems is 2 August 2027 — one year later than the general high-risk deadline." },

      { type: "heading", text: "Pathway 2: Use-Case Categories (Article 6(2) + Annex III)" },
      { type: "paragraph", text: "The second pathway is broader and catches most AI systems that practitioners are concerned about. Annex III lists eight categories of high-risk use cases:" },

      { type: "table", headers: ["#", "Category", "Examples"], rows: [
        ["1", "Biometrics", "Remote biometric identification (not real-time law enforcement, which is prohibited), biometric categorisation, emotion recognition where permitted"],
        ["2", "Critical infrastructure", "AI managing safety of road traffic, water supply, gas, heating, electricity, digital infrastructure"],
        ["3", "Education and vocational training", "AI determining access to education, evaluating learning outcomes, monitoring prohibited behaviour during exams"],
        ["4", "Employment and worker management", "AI screening CVs, evaluating candidates, making promotion/termination decisions, allocating tasks, monitoring performance"],
        ["5", "Access to essential services", "Creditworthiness assessment, life and health insurance risk/pricing, emergency services dispatch, public assistance eligibility"],
        ["6", "Law enforcement", "Polygraph-type AI, evidence reliability assessment, crime analytics, profiling in criminal investigations"],
        ["7", "Migration, asylum and border control", "Polygraph-type AI for migration interviews, risk assessment for irregular migration, identity document authentication"],
        ["8", "Administration of justice and democratic processes", "AI assisting judicial research and interpretation of law, AI intended to influence election outcomes"],
      ]},

      { type: "heading", text: "The Article 6(3) Exception" },
      { type: "paragraph", text: "Not every AI system that falls within an Annex III category is automatically high-risk. Article 6(3) provides an important exception: an AI system listed in Annex III is not high-risk if it does not pose a significant risk of harm to the health, safety, or fundamental rights of natural persons." },
      { type: "paragraph", text: "Specifically, a system may be exempted if it performs a narrow procedural task, improves the result of a previously completed human activity, detects decision-making patterns without replacing or influencing human assessment, or performs a preparatory task to an assessment relevant to the use cases in Annex III." },
      { type: "callout", text: "\"The provider must document the Article 6(3) assessment and register it in the EU database before placing the system on the market or putting it into service.\"" },
      { type: "paragraph", text: "This is not a blanket escape clause. The provider must document why they consider the system non-high-risk and register this in the EU database under Article 49(2). Market surveillance authorities can challenge this assessment under Article 80." },

      { type: "heading", text: "What High-Risk Classification Means" },
      { type: "paragraph", text: "Once classified as high-risk, your AI system must comply with Articles 8-15 (requirements) and Articles 16-27 (obligations on operators). The key requirements are:" },
      { type: "list", items: [
        "Article 9: A risk management system — continuous, iterative, covering the entire system lifecycle",
        "Article 10: Data and data governance — training, validation, and testing datasets must meet quality criteria",
        "Article 11: Technical documentation — detailed system documentation before market placement",
        "Article 12: Record-keeping — automatic logging of events during the system's operation",
        "Article 13: Transparency — deployers must receive sufficient information to understand and use the system",
        "Article 14: Human oversight — the system must be designed to allow effective human oversight",
        "Article 15: Accuracy, robustness, and cybersecurity — measurable levels, resilience against errors and attacks",
      ]},

      { type: "heading", text: "Practical Classification Steps" },
      { type: "numbered-action", items: [
        { action: "Check Annex I first", detail: "If your AI system is part of a product covered by EU harmonisation legislation (medical devices, machinery, vehicles, etc.), classification is straightforward — it's high-risk via Article 6(1)." },
        { action: "Map to Annex III categories", detail: "For standalone AI systems, assess whether the intended purpose falls within any of the eight Annex III categories. Focus on the system's purpose, not its technology." },
        { action: "Apply the Article 6(3) exception", detail: "If the system falls within Annex III but performs only narrow procedural tasks or preparatory work, assess whether the exception applies. Document this assessment thoroughly." },
        { action: "Consider intended and foreseeable use", detail: "Classification is based on intended purpose and reasonably foreseeable misuse — not just the current deployment. A recruitment tool is high-risk even if currently used for a single internal position." },
        { action: "Register your determination", detail: "If claiming non-high-risk under Article 6(3), register in the EU database. If classified as high-risk, begin compliance planning for the requirements in Articles 8-15." },
      ]},

      { type: "heading", text: "Key Takeaways" },
      { type: "takeaways", items: [
        "Two pathways to high-risk: product safety (Annex I) or use-case categories (Annex III)",
        "Annex III covers 8 categories: biometrics, critical infrastructure, education, employment, essential services, law enforcement, migration, and justice",
        "Article 6(3) allows exemption for narrow procedural or preparatory AI tasks — but requires documentation and database registration",
        "High-risk classification triggers the full compliance framework: Articles 8-15 requirements plus operator obligations",
        "The compliance deadline for Annex III systems is 2 August 2026; for Annex I product systems, 2 August 2027",
      ]},
    ],
  },
  {
    slug: "gpai-obligations-article-53-55-guide",
    title: "General-Purpose AI Models: What Articles 53 and 55 Require",
    subtitle: "Provider obligations for GPAI models — from technical documentation to systemic risk, explained for model developers and downstream integrators",
    author: "Paul McCormack",
    authorRole: "AI Governance & Compliance",
    date: "2026-03-01",
    readTime: "10 min read",
    category: "Guide",
    tags: ["GPAI", "Article 53", "Article 55", "Systemic Risk", "Provider Obligations"],
    metaDescription: "What Articles 53–55 require from GPAI providers — technical docs, copyright policy, training data summaries, and systemic risk rules. Effective since Aug 2025.",
    metaKeywords: "GPAI EU AI Act, general purpose AI obligations, Article 53, Article 55 systemic risk, GPAI model compliance",
    content: [
      { type: "lead", text: "General-purpose AI models — think foundation models, large language models, and multimodal systems — have their own dedicated compliance framework under the EU AI Act. Articles 53 and 55 establish what providers of these models must do, with obligations that have applied since 2 August 2025. This guide breaks down the requirements for both standard GPAI models and those with systemic risk." },

      { type: "heading", text: "What Is a General-Purpose AI Model?" },
      { type: "paragraph", text: "Article 3(63) defines a general-purpose AI model as an AI model — including where trained with a large amount of data using self-supervision at scale — that displays significant generality and is capable of competently performing a wide range of distinct tasks regardless of the way the model is placed on the market. This captures foundation models, large language models (LLMs), and multimodal models like GPT, Claude, Gemini, Llama, and Mistral." },
      { type: "paragraph", text: "The key distinction: GPAI obligations apply to the model itself, not to specific AI systems built on top of it. A provider who fine-tunes a GPAI model and deploys it as a customer service chatbot has obligations both as a GPAI provider (for the model) and potentially as a high-risk AI system provider (for the deployed system)." },

      { type: "heading", text: "Article 53: Obligations for All GPAI Providers" },
      { type: "paragraph", text: "Every provider of a GPAI model placed on the EU market must comply with four core obligations under Article 53(1):" },

      { type: "numbered-action", items: [
        { action: "Technical documentation (Annex XI)", detail: "Prepare and maintain technical documentation of the model, including its training and testing process, and the results of its evaluation. This must be provided to the AI Office on request. Annex XI specifies the required content in detail." },
        { action: "Downstream provider information (Annex XII)", detail: "Provide information and documentation to downstream providers who integrate the GPAI model into their AI systems. Annex XII specifies what must be shared — capabilities, limitations, intended use, and integration guidance." },
        { action: "Copyright compliance policy", detail: "Put in place a policy to comply with EU copyright law, in particular Directive (EU) 2019/790. This includes respecting opt-out rights under Article 4(3) of the Directive — where rights holders have expressly reserved the right to opt out of text and data mining." },
        { action: "Training data summary", detail: "Draw up and make publicly available a sufficiently detailed summary of the content used for training the GPAI model. The AI Office has published a template for this summary." },
      ]},

      { type: "heading", text: "The Open-Source Exception" },
      { type: "paragraph", text: "Article 53(2) provides a limited exception for open-source GPAI models — those whose parameters, including weights, architecture, and model usage information, are made publicly available. Open-source providers are exempt from the downstream information (Annex XII) and technical documentation obligations, but must still comply with copyright policy and the training data summary requirements." },
      { type: "paragraph", text: "This exception does not apply if the model is classified as having systemic risk under Article 51 — in that case, the full obligations apply regardless of licensing." },

      { type: "heading", text: "When Does a GPAI Model Have Systemic Risk?" },
      { type: "paragraph", text: "Article 51 establishes two routes to systemic risk classification:" },
      { type: "list", items: [
        "Presumption based on compute: A GPAI model is presumed to have systemic risk if the cumulative compute used for its training exceeds 10^25 FLOPs (Annex XIII). This threshold can be updated by the Commission.",
        "Commission designation: The Commission can designate a model as having systemic risk based on criteria in Annex XIII, considering capabilities, reach, number of registered users, cross-border availability, and other indicators."
      ]},
      { type: "paragraph", text: "Once classified, the provider must notify the Commission within two weeks. The classification can be challenged through the procedure in Article 52." },

      { type: "heading", text: "Article 55: Additional Obligations for Systemic Risk Models" },
      { type: "paragraph", text: "Providers of GPAI models with systemic risk must comply with all Article 53 obligations plus additional requirements under Article 55:" },
      { type: "list", items: [
        "Model evaluation — perform standardised state-of-the-art evaluations, including adversarial testing, to identify and mitigate systemic risks",
        "Systemic risk assessment and mitigation — assess and mitigate possible systemic risks at Union level, including their sources",
        "Serious incident tracking — document and report serious incidents and possible corrective measures to the AI Office and national competent authorities",
        "Adequate cybersecurity — ensure an adequate level of cybersecurity protection for the model and its physical infrastructure",
      ]},

      { type: "heading", text: "Codes of Practice" },
      { type: "paragraph", text: "Article 56 introduces codes of practice as the primary compliance mechanism for GPAI obligations. The AI Office has been coordinating the development of these codes with GPAI providers, downstream providers, and other stakeholders. Adherence to an approved code of practice creates a presumption of conformity with the corresponding obligations." },
      { type: "paragraph", text: "For providers who choose not to follow a code of practice, Article 53(4) requires them to demonstrate an alternative adequate means of compliance — which the AI Office must approve." },

      { type: "heading", text: "Timeline" },
      { type: "paragraph", text: "GPAI obligations under Articles 53-55 have applied since 2 August 2025. Providers who placed GPAI models on the market before that date had a transition period to comply. Any new GPAI model placed on the EU market must now comply from day one." },

      { type: "heading", text: "Key Takeaways" },
      { type: "takeaways", items: [
        "GPAI obligations apply to model providers — separate from any high-risk AI system obligations on downstream deployers",
        "All GPAI providers must produce technical documentation, downstream information, copyright policies, and training data summaries",
        "Open-source models get a partial exemption — but not if they have systemic risk",
        "Systemic risk is presumed above 10^25 FLOPs and triggers additional evaluation, mitigation, and reporting obligations",
        "GPAI obligations have applied since 2 August 2025 — compliance is already required",
      ]},
    ],
  },
  {
    slug: "eu-ai-act-compliance-timeline-2024-2027",
    title: "EU AI Act Compliance Timeline: Every Deadline from 2024 to 2027",
    subtitle: "A complete breakdown of the phased application dates — what applies when, and what you should be doing right now",
    author: "Paul McCormack",
    authorRole: "AI Governance & Compliance",
    date: "2026-02-28",
    readTime: "9 min read",
    category: "Guide",
    tags: ["Timeline", "Compliance Deadlines", "Phased Application", "Article 113"],
    metaDescription: "Every EU AI Act deadline from 2024–2027 in one guide. Prohibited practices and GPAI are already live. High-risk obligations hit Aug 2026. Phase-by-phase breakdown.",
    metaKeywords: "EU AI Act timeline, AI Act compliance deadlines, when does EU AI Act apply, AI Act 2026 deadline, EU AI Act phased application",
    content: [
      { type: "lead", text: "The EU AI Act doesn't switch on all at once. Regulation (EU) 2024/1689 entered into force on 1 August 2024, but its provisions apply in phases over three years. This article maps every key deadline, explains what becomes applicable at each stage, and helps you prioritise your compliance effort." },

      { type: "diagram", title: "EU AI Act — Phased Application Timeline", caption: "Five key dates from entry into force to full application of product safety requirements.", steps: [
        { type: "start", text: "1 August 2024 — Entry into force" },
        { type: "yes", text: "2 February 2025 — Prohibited practices (Art. 5) and AI literacy (Art. 4)", badge: "LIVE", ref: "Already in effect" },
        { type: "yes", text: "2 August 2025 — GPAI (Arts. 51-55), governance (Arts. 64-70), notified bodies", badge: "LIVE", ref: "Already in effect" },
        { type: "diamond", text: "2 August 2026 — Full application: high-risk AI systems (Arts. 6-49), FRIA (Art. 27), all remaining provisions", ref: "Upcoming" },
        { type: "no", text: "2 August 2027 — Annex I product safety legislation alignment", badge: "2027", ref: "Article 6(1) systems" },
      ]},

      { type: "heading", text: "Phase 1: 2 February 2025 — Prohibited Practices and AI Literacy" },
      { type: "paragraph", text: "The first provisions to apply were the prohibited AI practices under Article 5 and the AI literacy obligation under Article 4. This was deliberately front-loaded — the EU wanted the most harmful AI practices banned as quickly as possible." },
      { type: "paragraph", text: "Article 5 bans eight categories of AI practice outright, including subliminal manipulation, social scoring, predictive policing based solely on profiling, untargeted facial image scraping, workplace emotion recognition, and real-time biometric identification in public spaces (with narrow law enforcement exceptions)." },
      { type: "paragraph", text: "Article 4 requires all providers and deployers to ensure sufficient AI literacy among staff and personnel who operate or oversee AI systems. This is a broad, ongoing obligation — not a one-time training exercise." },
      { type: "callout", text: "\"Providers and deployers of AI systems shall take measures to ensure, to their best extent, a sufficient level of AI literacy of their staff and other persons dealing with the operation and use of AI systems on their behalf.\" — Article 4" },

      { type: "heading", text: "Phase 2: 2 August 2025 — GPAI, Governance, and Notified Bodies" },
      { type: "paragraph", text: "The second wave brought the general-purpose AI model framework into effect. This includes:" },
      { type: "list", items: [
        "Articles 51-55: All GPAI provider obligations — technical documentation, downstream information, copyright compliance, training data summaries, and additional obligations for models with systemic risk",
        "Articles 64-70: The governance framework — the AI Office, the European AI Board, the Advisory Forum, the Scientific Panel, and national competent authority designations",
        "Articles 28-39: The notified body framework — rules for conformity assessment bodies, notification procedures, and requirements for performing conformity assessments",
        "Article 101: Fines for GPAI providers who violate their obligations",
      ]},

      { type: "heading", text: "Phase 3: 2 August 2026 — Full Application (The Big Deadline)" },
      { type: "paragraph", text: "This is the date that matters most for the majority of organisations. On 2 August 2026, all remaining provisions become applicable, including:" },
      { type: "list", items: [
        "Articles 6-7: High-risk AI classification rules (Annex III use-case pathway)",
        "Articles 8-15: All requirements for high-risk AI systems — risk management, data governance, documentation, logging, transparency, human oversight, accuracy, robustness, cybersecurity",
        "Articles 16-27: All operator obligations — providers, deployers, importers, distributors, and authorised representatives",
        "Article 27: Fundamental rights impact assessment (FRIA) for public bodies, public service providers, and credit/insurance deployers",
        "Article 50: Transparency obligations for providers and deployers of certain AI systems (chatbots, deepfakes, emotion recognition)",
        "Articles 71-84: The full market surveillance framework, including post-market monitoring, incident reporting, and the EU database",
        "Articles 85-87: Rights provisions — right to complaint, right to explanation, whistleblower protection",
        "Article 99: Full penalty framework — up to EUR 35M or 7% turnover for prohibited practice violations, EUR 15M or 3% for other infringements",
      ]},

      { type: "heading", text: "Phase 4: 2 August 2027 — Product Safety Alignment" },
      { type: "paragraph", text: "The final phase applies to AI systems classified as high-risk under Article 6(1) — those that are safety components of products covered by EU harmonisation legislation listed in Annex I. These systems get an extra year to comply because their conformity assessment procedures need to be integrated with existing sector-specific processes." },
      { type: "paragraph", text: "This affects AI in medical devices, machinery, vehicles, toys, lifts, radio equipment, civil aviation, and other regulated product categories. If your AI system is embedded in a physical product covered by Annex I legislation, your deadline is August 2027, not August 2026." },

      { type: "heading", text: "What You Should Be Doing Right Now (March 2026)" },
      { type: "numbered-action", items: [
        { action: "Confirm Article 5 compliance", detail: "The prohibited practices have been in force for over a year. If you haven't audited your AI systems against the eight banned categories, do it immediately." },
        { action: "Verify AI literacy measures", detail: "Article 4 is also live. Ensure your staff have received adequate training on AI literacy relevant to their roles." },
        { action: "Classify your AI systems", detail: "With five months until the August 2026 deadline, you need to have classified every AI system as prohibited, high-risk, limited-risk, or minimal-risk. Use Article 6 and Annex III as your guide." },
        { action: "Begin FRIA preparation", detail: "If you're a public body, public service provider, or credit/insurance deployer using high-risk AI, start your Article 27 FRIA preparation now. Don't wait for the official template." },
        { action: "Engage your supply chain", detail: "If you're a deployer relying on a provider for high-risk AI systems, confirm that your provider is preparing for Article 16 obligations — documentation, conformity assessment, CE marking." },
        { action: "Set up monitoring processes", detail: "Post-market monitoring (Article 72) and incident reporting (Article 73) need operational processes in place by August 2026." },
      ]},

      { type: "heading", text: "Key Takeaways" },
      { type: "takeaways", items: [
        "The EU AI Act applies in four phases: February 2025, August 2025, August 2026, and August 2027",
        "Prohibited practices (Article 5) and AI literacy (Article 4) are already in force since February 2025",
        "GPAI obligations have applied since August 2025 — model providers must already comply",
        "2 August 2026 is the critical deadline for high-risk AI systems, FRIA, transparency, and the full enforcement framework",
        "Product safety AI systems (Annex I) have until August 2027",
        "With five months to go, organisations should be deep into classification, FRIA preparation, and compliance planning",
      ]},
    ],
  },
];
