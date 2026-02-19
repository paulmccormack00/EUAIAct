import { EU_AI_ACT_DATA } from "./eu-ai-act-data.js";

const RECITAL_TO_ARTICLE_MAP = {
  1: [1, 2], 2: [2], 3: [2], 4: [1, 2], 5: [1], 6: [3], 7: [2], 8: [2, 3], 9: [2], 10: [2],
  11: [2], 12: [3], 13: [3], 14: [3], 15: [3], 16: [3], 17: [3, 5], 18: [3], 19: [3], 20: [3],
  21: [3], 22: [3, 5], 23: [3, 5], 24: [3, 5], 25: [5], 26: [5], 27: [5], 28: [5], 29: [5], 30: [5],
  31: [5], 32: [5], 33: [5], 34: [5, 27], 35: [5], 36: [5], 37: [5], 38: [5], 39: [5, 9], 40: [5],
  41: [5], 42: [5, 50], 43: [6], 44: [6], 45: [6, 7], 46: [6], 47: [6], 48: [6], 49: [6, 7], 50: [6],
  51: [6], 52: [6], 53: [6, 7], 54: [6, 7], 55: [6, 7], 56: [6, 7], 57: [6, 7], 58: [6, 7], 59: [6, 7],
  60: [6, 7], 61: [6], 62: [8, 9, 10, 11, 12, 13, 14, 15], 63: [9], 64: [10], 65: [10], 66: [10],
  67: [11], 68: [12], 69: [13], 70: [14], 71: [15], 72: [16, 17, 22, 23, 24, 25, 26], 73: [16, 25],
  74: [26], 75: [9, 10, 15, 42], 76: [40, 41], 77: [43], 78: [43], 79: [43, 44], 80: [43, 44, 45, 46],
  81: [47], 82: [48], 83: [49, 71], 84: [16, 25, 26, 27], 85: [25], 86: [25], 87: [25], 88: [25],
  89: [50, 51], 90: [50], 91: [50], 92: [26, 27], 93: [26], 94: [10], 95: [26], 96: [27],
  97: [51, 52, 53, 54, 55, 56], 98: [51, 53], 99: [51, 53], 100: [51, 52, 53], 101: [53], 102: [53],
  103: [53], 104: [53], 105: [53], 106: [53], 107: [53], 108: [53], 109: [51, 55], 110: [55], 111: [55],
  112: [56], 113: [56], 114: [57], 115: [64, 65, 66, 67, 68], 116: [65], 117: [66, 67], 118: [68, 69, 70],
  119: [57], 120: [70], 121: [71], 122: [72], 123: [73], 124: [57], 125: [74, 75, 76, 77], 126: [57],
  127: [57, 78], 128: [79, 80], 129: [57, 80], 130: [57], 131: [57], 132: [81, 82, 83, 84, 85],
  133: [85], 134: [99], 135: [99], 136: [99], 137: [99], 138: [99], 139: [95], 140: [95, 96], 141: [96],
  142: [113], 143: [2], 144: [113], 145: [6, 113], 146: [53, 113], 147: [113], 148: [1, 113],
  149: [57, 64], 150: [64, 65], 151: [67], 152: [67], 153: [57], 154: [57], 155: [68], 156: [70],
  157: [72], 158: [73], 159: [74], 160: [75], 161: [57, 78], 162: [79], 163: [80], 164: [81], 165: [82],
  166: [83], 167: [84], 168: [85], 169: [86], 170: [95], 171: [96], 172: [97], 173: [99], 174: [99],
  175: [99], 176: [99], 177: [99], 178: [113], 179: [113], 180: [113],
};

// Reverse map: article → recitals (computed once at module scope)
const ARTICLE_TO_RECITAL_MAP = {};
Object.entries(RECITAL_TO_ARTICLE_MAP).forEach(([recital, articles]) => {
  articles.forEach((article) => {
    if (!ARTICLE_TO_RECITAL_MAP[article]) ARTICLE_TO_RECITAL_MAP[article] = [];
    ARTICLE_TO_RECITAL_MAP[article].push(parseInt(recital));
  });
});
Object.values(ARTICLE_TO_RECITAL_MAP).forEach((arr) => arr.sort((a, b) => a - b));

// Key recital summaries for preview text
const RECITAL_SUMMARIES = {
  1: "This Regulation lays down harmonised rules on artificial intelligence, improving the internal market while promoting human-centric and trustworthy AI.",
  5: "The Regulation follows a risk-based approach, differentiating between AI uses that create unacceptable risk, high risk, and lower risk.",
  6: "The definition of AI system should be closely aligned with the work of international organisations, in particular the OECD.",
  12: "The notion of AI system should be based on key characteristics including the capability to infer — deriving outputs from inputs or data.",
  15: "Biometric identification involves automated recognition of physical, physiological and behavioural human features for establishing identity.",
  17: "Real-time biometric systems capture and compare data instantaneously. Post systems involve material captured before use, such as CCTV footage.",
  22: "Subliminal techniques that materially distort behaviour in a manner likely to cause significant harm should be prohibited.",
  25: "Certain AI practices are incompatible with Union values: manipulative AI, exploitation of vulnerabilities, social scoring, and certain biometric identification.",
  26: "Manipulation through subliminal techniques or purposefully deceptive approaches that impair informed decision-making should be prohibited.",
  27: "AI practices that exploit vulnerabilities of specific groups due to age, disability, or social/economic situation should be prohibited.",
  29: "Social scoring by public authorities evaluating persons based on social behaviour or personality traits, leading to detrimental treatment, should be prohibited.",
  30: "Biometric categorisation systems deducing race, political opinions, trade union membership, religious beliefs, sex life or sexual orientation should be prohibited.",
  32: "Real-time remote biometric identification in publicly accessible spaces is particularly intrusive and may evoke constant surveillance.",
  33: "Real-time remote biometric identification for law enforcement should be prohibited except in exhaustively listed, narrowly defined situations.",
  34: "Each use of real-time remote biometric identification should be subject to appropriate safeguards including temporal, geographic and personal limitations.",
  42: "Emotion recognition in the workplace and educational institutions should be prohibited due to power imbalances, except for medical or safety reasons.",
  43: "High-risk classification follows two routes: AI as a safety component under EU legislation, and stand-alone AI in specific use-case areas.",
  47: "Stand-alone high-risk AI includes biometrics, critical infrastructure, education, employment, essential services, law enforcement, migration and justice.",
  50: "Products whose safety component is an AI system under harmonisation legislation should be classified as high-risk where third-party assessment is required.",
  62: "Providers of high-risk AI systems bear primary obligations on risk management, data governance, documentation, transparency, human oversight, accuracy and robustness.",
  63: "A continuous and iterative risk management system should be established for high-risk AI systems throughout their entire lifecycle.",
  70: "Human oversight measures should be commensurate with the risks and level of autonomy of the AI system.",
  77: "A proportionate conformity assessment system should be applied. For Annex III systems, internal self-assessment should generally suffice.",
  89: "Providers and deployers of certain AI systems must comply with transparency obligations so affected persons are properly informed.",
  90: "Persons exposed to deepfake-generating AI should be informed that the content has been artificially generated or manipulated.",
  97: "General-purpose AI models can serve a variety of downstream purposes. Rules for GPAI models should be proportionate.",
  100: "GPAI models with systemic risk — those with high-impact capabilities — require additional obligations on public health, safety and fundamental rights.",
  109: "Systemic risks are those specific to high-impact GPAI models, including reasonably foreseeable negative effects on public health, safety or fundamental rights.",
  110: "The cumulative computation for training (measured in FLOPs) is a relevant approximation for model capabilities. The 10^25 FLOPs threshold indicates systemic risk.",
  112: "Codes of practice should be a central tool for GPAI model providers to demonstrate compliance.",
  128: "AI regulatory sandboxes allow testing innovative AI systems under regulatory supervision, facilitating learning for regulators and innovators.",
  133: "Affected persons subject to decisions based on high-risk AI output should have the right to a clear and meaningful explanation.",
  134: "Penalties include up to EUR 35 million or 7% of worldwide turnover for prohibited practices.",
  142: "Staggered application: prohibitions from 2 February 2025; GPAI rules from 2 August 2025; high-risk obligations from 2 August 2026.",
  147: "This Regulation enters into force on 1 August 2024. It is binding and directly applicable in all Member States.",
};

function isFootnoteEntry(text) {
  if (!text) return true;
  if (text.startsWith("OJ ")) return true;
  if (text.length < 300 && /^(Regulation|Directive|Decision|European (Parliament|Council))/.test(text)) return true;
  return false;
}

// Get best available text for a recital (prefer real text, fall back to summary)
function getRecitalDisplayText(num) {
  const recitalData = EU_AI_ACT_DATA.recitals[String(num)];
  const fullText = recitalData ? recitalData.text : null;
  const summary = RECITAL_SUMMARIES[num];
  if (fullText && !isFootnoteEntry(fullText)) return { text: fullText, isFullText: true };
  if (summary) return { text: summary, isFullText: false };
  return { text: null, isFullText: false };
}

export { RECITAL_TO_ARTICLE_MAP, ARTICLE_TO_RECITAL_MAP, RECITAL_SUMMARIES, isFootnoteEntry, getRecitalDisplayText };
