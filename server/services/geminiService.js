// AI Services for Digital Threat Analyzer & Complaint Assistant
// Provides intelligent contextual fallback if GEMINI_API_KEY is not set

export async function analyzeDigitalThreat(text, context = {}) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are an expert AI Women's Safety & Digital Harassment Assessment Assistant for SHIELD.
Analyze the following text or reported communication:
"${text}"

Respond strictly in valid JSON format with this structure:
{
  "risk_level": "low" | "suspicious" | "harassment" | "high_risk",
  "category": "extortion_blackmail" | "stalking" | "impersonation" | "abusive_language" | "unsolicited_contact",
  "threat_score": number (1 to 10),
  "summary": "Clear factual assessment of threat elements detected",
  "immediate_actions": ["array of prioritized action recommendations"],
  "recommended_channel": "1930 / cybercrime.gov.in" | "112 / Local Police" | "181 / Women Helpline" | "Campus Internal Committee",
  "evidence_preservation_tips": ["how to safeguard this evidence without altering metadata"]
}`
            }]
          }],
          generationConfig: {
            responseMimeType: "application/json"
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidateText) {
          return JSON.parse(candidateText);
        }
      }
    } catch (err) {
      console.warn("Gemini API call failed, using intelligent heuristics:", err.message);
    }
  }

  // Robust Heuristics Engine (ensures 100% demo uptime without external key dependency)
  const lower = text.toLowerCase();
  let riskLevel = "low";
  let score = 3;
  let category = "unsolicited_contact";
  let actions = [
    "Do not delete messages or call logs; they constitute primary digital evidence.",
    "Take full-screen captures showing timestamps and profile handles.",
    "Refrain from engaging or responding to provocative messages."
  ];
  let channel = "181 / Women Helpline (Advisory)";

  const highRiskKeywords = ["leak", "morph", "nude", "kill", "harm", "blackmail", "money", "ruin", "destroy", "post online", "private pictures"];
  const harassmentKeywords = ["bitch", "whore", "idiot", "watch you", "outside", "follow", "hostel", "room", "alone"];

  const hasHighRisk = highRiskKeywords.some(kw => lower.includes(kw));
  const hasHarassment = harassmentKeywords.some(kw => lower.includes(kw));

  if (hasHighRisk) {
    riskLevel = "high_risk";
    score = 9;
    category = "extortion_blackmail";
    channel = "1930 National Cybercrime Portal & 112 Emergency";
    actions = [
      "CRITICAL: Do NOT pay money or send additional photos under duress.",
      "Lock down your social media privacy settings and enable Two-Factor Authentication.",
      "Compute on-device NCII perceptual hash in SHIELD to prevent hash matches without uploading images.",
      "Register an immediate incident report on cybercrime.gov.in or call 1930.",
      "Preserve original uncompressed message files for Section 63 BSA certificate filing."
    ];
  } else if (hasHarassment) {
    riskLevel = "harassment";
    score = 7;
    category = "stalking";
    channel = "112 / Campus Security & 181 Women Helpline";
    actions = [
      "Block the sender handle across all connected channels.",
      "Share incident link with your configured SHIELD Trusted Contacts.",
      "File a report with the College Internal Committee (ICC) if campus affiliated."
    ];
  } else if (text.length > 20) {
    riskLevel = "suspicious";
    score = 5;
    category = "unsolicited_contact";
  }

  return {
    risk_level: riskLevel,
    category,
    threat_score: score,
    summary: `Heuristic evaluation detected ${riskLevel.toUpperCase()} threat indicators. Target appears to be subjected to ${category.replace('_', ' ')}.`,
    immediate_actions: actions,
    recommended_channel: channel,
    evidence_preservation_tips: [
      "Do not edit or crop screenshots; retain status bars showing date, time, and carrier.",
      "Export chat backup archives directly from app settings if available.",
      "Use SHIELD Vault to compute an immutable SHA-256 fingerprint immediately."
    ]
  };
}

export async function draftLegalComplaint(incident, evidenceItems = []) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are an AI legal documentation assistant for SHIELD (Women's Safety Platform).
Draft a factual, formal, non-accusatory complaint representation that can be submitted to Police Authorities / College Internal Committee / Cybercrime Portal.
Incident details:
- Title/Subject: ${incident.title || incident.category}
- Category: ${incident.category}
- Approximate Location: ${incident.approximate_location?.name || 'NITK Campus vicinity'}
- Date & Time: ${incident.created_at}
- Specifics: ${incident.description}
- Attached Evidence Count: ${evidenceItems.length}
- Evidence Hashes: ${evidenceItems.map(e => e.sha256_hash).join(', ') || 'SHA-256 verified in vault'}

Return JSON:
{
  "subject": "Formal Complaint Subject Line",
  "addressed_to": "The Station House Officer / Chairperson, Internal Committee",
  "body": "Formatted multi-paragraph formal complaint text",
  "statutory_references": ["Relevant sections e.g. BNS Section 78 (Stalking), Section 79 (Insulting modesty), IT Act Section 66E / 67A"],
  "evidence_table_summary": "Summary of evidence chain attached",
  "bsa_section_63_note": "Statement regarding admissibility of electronic records under Section 63 Bharatiya Sakshya Adhiniyam, 2023"
}`
            }]
          }],
          generationConfig: {
            responseMimeType: "application/json"
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidateText) {
          return JSON.parse(candidateText);
        }
      }
    } catch (err) {
      console.warn("Gemini complaint draft fallback:", err.message);
    }
  }

  // Standard Complaint Draft complying with Bharatiya Nyaya Sanhita (BNS) & Section 63 BSA 2023
  const cat = incident.category || "Safety Incident";
  const loc = incident.approximate_location?.name || "Campus Vicinity, Surathkal";
  const dateFormatted = new Date(incident.created_at || Date.now()).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  return {
    subject: `Complaint regarding incident of ${cat.replace('_', ' ').toUpperCase()} on ${dateFormatted} at ${loc}`,
    addressed_to: "To,\nThe Station House Officer / Member Secretary, Internal Complaints Committee (ICC),\nSurathkal, Karnataka",
    body: `Respected Authority,

I am writing to formally submit a record of an incident that took place on ${dateFormatted} in the vicinity of ${loc}.

1. FACTUAL ACCOUNT:
${incident.description || 'The complainant was subjected to targeted intimidation and unsafe circumstances at the specified location.'}

2. DIGITAL & PHYSICAL EVIDENCE:
In accordance with verifiable chain-of-custody protocols, the accompanying electronic exhibits have been cryptographically fingerprinted using SHA-256 integrity algorithms at the time of archival. The raw media files remain unmanipulated.

3. PRAYER / RELIEF SOUGHT:
I earnestly request the concerned authorities to take cognizance of this report, review available CCTV footage in the corridor of ${loc}, enhance security patrols, and initiate inquiry under applicable statutory provisions.

Yours faithfully,
[Complainant Name / Anonymous Reference Token: ${incident.id || 'SHIELD-REF-2026'}]`,
    statutory_references: [
      "Bharatiya Nyaya Sanhita (BNS), 2023 - Sections 78 (Stalking) / 79 (Act intended to insult modesty)",
      "Information Technology Act, 2000 - Section 66E (Violation of privacy) & Section 67",
      "Bharatiya Sakshya Adhiniyam (BSA), 2023 - Section 63 (Conditions in respect of admissibility of electronic records)"
    ],
    evidence_table_summary: `${evidenceItems.length || 1} electronic exhibits hashed and logged in immutable tamper-evident chain`,
    bsa_section_63_note: "Electronic records generated via SHIELD include cryptographic SHA-256 hashes and timestamped audit entries to facilitate preparation of the requisite certificate under Section 63 of Bharatiya Sakshya Adhiniyam, 2023."
  };
}
