import { Component } from "react";
import { SANS, SERIF } from "../constants.js";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          minHeight: "50vh", padding: "40px 20px", textAlign: "center",
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%", background: "#fef2f2",
            display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20,
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2">
              <circle cx="12" cy="12" r="10" /><path d="M12 8v4m0 4h.01" />
            </svg>
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 400, color: "#1a1a1a", margin: "0 0 8px", fontFamily: SERIF }}>
            Something went wrong
          </h2>
          <p style={{ fontSize: 14, color: "#546478", lineHeight: 1.6, maxWidth: 400, margin: "0 auto 24px", fontFamily: SANS }}>
            An unexpected error occurred. Please try refreshing the page.
          </p>
          <button
            onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload(); }}
            style={{
              padding: "12px 24px", background: "#1e3a5f", color: "white",
              border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600,
              cursor: "pointer", fontFamily: SANS,
            }}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
