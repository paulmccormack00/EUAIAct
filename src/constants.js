const FONT_FACE_CSS = `
@font-face {
  font-family: 'LoveFrom Serif';
  src: url('data:font/woff2;base64,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') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'DM Sans';
  font-style: normal;
  font-weight: 400 700;
  font-display: swap;
  src: url(/fonts/dm-sans-latin.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
@font-face {
  font-family: 'DM Sans';
  font-style: normal;
  font-weight: 400 700;
  font-display: swap;
  src: url(/fonts/dm-sans-latin-ext.woff2) format('woff2');
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
`;

const SERIF = "'LoveFrom Serif', 'Iowan Old Style', 'Palatino Linotype', Palatino, Georgia, serif";
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
  textMuted: "#546478",
  textPlaceholder: "#4a5f74",
  textFaint: "#cbd5e1",

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

export { FONT_FACE_CSS, SERIF, SANS, COLORS, RADIUS, SHADOWS, FOCUS_CSS };
