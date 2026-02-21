export const highlightText = (text, query) => {
  if (!query || query.length < 2) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  return text.replace(regex, "§HL_START§$1§HL_END§");
};

export const truncateText = (text, maxLength = 300) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).replace(/\s+\S*$/, "") + "…";
};

export const formatArticleText = (text) => {
  let formatted = text;
  formatted = formatted.replace(/\s(\d+)\.\s+/g, "\n\n$1. ");
  formatted = formatted.replace(/\s\(([a-z])\)\s+/g, "\n   ($1) ");
  return formatted;
};

export const renderHighlightedParts = (str) => {
  const parts = str.split(/§HL_START§|§HL_END§/);
  return parts.map((part, i) =>
    i % 2 === 1
      ? <mark key={i} style={{ backgroundColor: "#fef08a", borderRadius: 2, padding: "0 2px" }}>{part}</mark>  // COLORS.highlight
      : <span key={i}>{part}</span>
  );
};
