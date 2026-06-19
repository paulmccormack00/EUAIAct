const SERIF = "'Spectral', 'Iowan Old Style', 'Palatino Linotype', Palatino, Georgia, serif";
const SANS = "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif";

// ── Design Tokens ──────────────────────────────────────────

const COLORS = {
  // Brand
  primary: "#1e3a5f",
  primaryHover: "#2d5a8e",
  primaryLight: "#f0f4ff",
  primaryLightBorder: "#c7d6ec",
  primaryLinkUnderline: "#93b3d4",

  // Warm
  warmText: "#5c4d38",
  warmGold: "#d4c5a9",
  warmAccent: "#8b6914",
  warmBorder: "#f0ebe4",
  warmBgAlt: "#f5ede3",

  // Backgrounds
  pageBg: "#f7f5f2",
  surfaceAltBg: "#faf9f7",
  subtleBg: "#f8fafc",
  cardBg: "#fafaf8",

  // Text
  textPrimary: "#1a1a1a",
  textBody: "#374151",
  textSecondary: "#4a5568",
  textMuted: "#4d5d71",
  textPlaceholder: "#4a5f74",
  textFaint: "#7c8ca0",
  borderFaint: "#b0bac8",

  // Borders
  borderDefault: "#e8e4de",
  borderLight: "#e2e0dc",
  borderInput: "#d1d5db",
  borderSubtle: "#e2e8f0",

  // Status - Success
  successBg: "#f0fdf4",
  successBorder: "#bbf7d0",
  successText: "#166534",
  successDot: "#16a34a",
  successAccent: "#dcfce7",

  // Status - Error
  errorBg: "#fef2f2",
  errorBorder: "#fecaca",
  errorText: "#991b1b",
  errorDot: "#dc2626",
  errorAccent: "#ef4444",

  // Status - Warning
  warningBg: "#fffbeb",
  warningBorder: "#fde68a",
  warningText: "#92400e",
  warningDot: "#d97706",

  // Status - Orange
  orangeBg: "#fff7ed",
  orangeBorder: "#fed7aa",
  orangeText: "#9a3412",
  orangeDot: "#ea580c",

  // Status - Purple
  purpleBg: "#faf5ff",
  purpleBorder: "#e9d5ff",
  purpleText: "#5b21b6",
  purpleDot: "#7c3aed",

  // Status - Blue (info)
  infoBg: "#dbeafe",
  infoText: "#2563eb",

  // Highlight (search)
  highlight: "#fef08a",

  // Misc
  white: "#ffffff",
  overlayBg: "rgba(0,0,0,0.3)",
  chatOverlayBg: "rgba(0,0,0,0.15)",
};

const RADIUS = {
  xs: 4,
  sm: 6,
  md: 8,
  lg: 10,
  xl: 12,
  xxl: 16,
  round: 20,
  full: "50%",
};

const SHADOWS = {
  xs: "0 1px 2px rgba(0,0,0,0.04)",
  sm: "0 1px 4px rgba(0,0,0,0.04)",
  md: "0 2px 8px rgba(0,0,0,0.05)",
  lg: "0 4px 16px rgba(0,0,0,0.06)",
  xl: "0 8px 24px rgba(0,0,0,0.08)",
  xxl: "0 8px 32px rgba(0,0,0,0.08)",
  modal: "-4px 0 24px rgba(0,0,0,0.12)",
  fab: "0 4px 16px rgba(30,58,95,0.35)",
  fabHover: "0 6px 24px rgba(30,58,95,0.45)",
  focus: "0 0 0 3px rgba(30,58,95,0.08)",
  persona: "0 12px 40px rgba(0,0,0,0.08)",
};

const FOCUS_CSS = `
/* Prevent iOS Safari from auto-zooming when a form control with <16px text is
   focused (it zooms in and never zooms back, stranding the user on a shifted
   page). Force 16px on phones only; desktop keeps each control's inline size. */
@media (max-width: 767px) {
  input, textarea, select { font-size: 16px !important; }
}
button:focus-visible, input:focus-visible, textarea:focus-visible, select:focus-visible, a:focus-visible {
  outline: 2px solid #1e3a5f;
  outline-offset: 2px;
}
button:focus:not(:focus-visible), input:focus:not(:focus-visible), textarea:focus:not(:focus-visible), select:focus:not(:focus-visible), a:focus:not(:focus-visible) {
  outline: none;
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
`;

const API_BASE = "https://euai.app";

export { SERIF, SANS, COLORS, RADIUS, SHADOWS, FOCUS_CSS, API_BASE };
