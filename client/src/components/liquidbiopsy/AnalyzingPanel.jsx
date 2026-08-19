import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";
import { Icon } from "./icons";
import { ICONS } from "./iconPaths";

// Client-side staged pacing, not a live status feed from the backend (v1 is a
// single blocking request/response — see the plan's integration-seam notes).
// Still far more honest than a static spinner for something that can take a while.
const STAGES = [
  "Reading file…",
  "Parsing variant calls…",
  "Running annotation…",
  "Computing summary metrics…",
];

export default function AnalyzingPanel({ fileName, theme, toggleTheme, onCancel, onBack }) {
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    if (stageIndex >= STAGES.length - 1) return;
    const t = setTimeout(() => setStageIndex((i) => i + 1), 1300 + Math.random() * 700);
    return () => clearTimeout(t);
  }, [stageIndex]);

  const progressPct = Math.round(((stageIndex + 1) / STAGES.length) * 100);

  return (
    <div style={{ minHeight: "100vh", background: "var(--lb-bg-page)", fontFamily: "var(--lb-font-body)", display: "flex", flexDirection: "column" }}>
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "var(--lb-bg-surface-raised)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
        borderBottom: "1px solid var(--lb-border)",
      }}>
        <div style={{ maxWidth: "1024px", margin: "0 auto", padding: "0 20px", height: "56px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {onBack && (
              <button onClick={onBack} title="Back to site" style={{
                width: "28px", height: "28px", borderRadius: "8px", border: "1px solid var(--lb-border)",
                background: "var(--lb-input-bg)", display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", flexShrink: 0,
              }}>
                <Icon d={ICONS.back} size={13} style={{ color: "var(--lb-text-secondary)" }} />
              </button>
            )}
            <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: "var(--lb-accent-gradient)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon d={ICONS.logo} size={16} style={{ color: "#fff" }} />
            </div>
            <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--lb-text-primary)" }}>OncoTrace-AI</p>
          </div>
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </div>
      </nav>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
        <div style={{ maxWidth: "420px", width: "100%", textAlign: "center" }}>
          <div style={{
            width: "56px", height: "56px", borderRadius: "50%", margin: "0 auto 24px",
            border: "3px solid var(--lb-status-info-border)", borderTopColor: "var(--lb-status-info)",
            animation: "lb-spin 1s linear infinite",
          }} />
          <p style={{ fontSize: "13px", color: "var(--lb-text-muted)", marginBottom: "6px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {fileName}
          </p>
          <p style={{ fontSize: "16px", fontWeight: 700, color: "var(--lb-text-primary)", marginBottom: "24px" }}>
            {STAGES[stageIndex]}
          </p>
          <div style={{ width: "100%", height: "6px", background: "var(--lb-track)", borderRadius: "99px", overflow: "hidden", marginBottom: "12px" }}>
            <div style={{ height: "100%", width: `${progressPct}%`, background: "var(--lb-accent-gradient)", borderRadius: "99px", transition: "width 0.6s ease" }} />
          </div>
          <p style={{ fontSize: "11px", color: "var(--lb-text-muted)", marginBottom: "28px", lineHeight: 1.6 }}>
            Depending on file size, this can take anywhere from a few seconds to a couple of minutes.
          </p>
          <button onClick={onCancel} style={{
            padding: "10px 20px", borderRadius: "var(--lb-radius-md)", border: "1px solid var(--lb-border)",
            background: "var(--lb-input-bg)", color: "var(--lb-text-secondary)", fontSize: "13px", fontWeight: 600, cursor: "pointer",
          }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
