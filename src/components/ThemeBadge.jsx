import { SANS } from "../constants.js";

export default function ThemeBadge({ theme, onClick, active, small }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex", alignItems: "center", borderRadius: 20,
        fontFamily: SANS, fontWeight: 500,
        padding: small ? "3px 10px" : "5px 14px",
        fontSize: small ? 11 : 13,
        backgroundColor: active ? theme.color + "22" : theme.color + "10",
        color: theme.color,
        border: `1px solid ${theme.color}${active ? "50" : "25"}`,
        cursor: "pointer",
        transition: "all 0.15s",
        boxShadow: active ? `0 0 0 2px ${theme.color}30` : "none",
      }}
    >
      {theme.name}
    </button>
  );
}
