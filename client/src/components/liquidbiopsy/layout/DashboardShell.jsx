import { useRef } from "react";
import ThemeToggle from "../ThemeToggle";
import PulseDot from "../primitives/PulseDot";
import { Icon } from "../icons";
import { ICONS } from "../iconPaths";
import { NAV_PAGES } from "../nav";
import useFocusTrap from "../useFocusTrap";

// The uploaded filename, not a fabricated name -- there is no real
// patient-identity field anywhere in the API response.
function displayNameFromFilename(filename) {
  if (!filename) return null;
  return filename.replace(/\.vcf\.gz$/i, "").replace(/\.vcf$/i, "");
}

export default function DashboardShell({ activePage, onNavigate, meta, tierSummary, callerAdapterValidated = true, theme, toggleTheme, onReset, onBack, sidebarOpen, setSidebarOpen, children }) {
  const pageTitle = NAV_PAGES.find((p) => p.id === activePage)?.label || "Dashboard";
  const tier1 = tierSummary?.counts?.tier_1_actionable_somatic ?? 0;
  const tier2 = tierSummary?.counts?.tier_2_uncertain_needs_review ?? 0;
  const patientName = displayNameFromFilename(meta.source_filename);
  const sidebarRef = useRef(null);
  useFocusTrap(sidebarRef, sidebarOpen, () => setSidebarOpen(false));

  return (
    <div style={{
      minHeight: "100vh", background: "var(--lb-bg-page)",
      fontFamily: "var(--lb-font-body)", transition: "background 0.5s", display: "flex",
    }}>
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 40, background: "var(--lb-bg-overlay)", backdropFilter: "blur(4px)" }} />
      )}

      <aside
        ref={sidebarRef}
        role={sidebarOpen ? "dialog" : undefined}
        aria-modal={sidebarOpen ? "true" : undefined}
        aria-label="Navigation"
        tabIndex={-1}
        style={{
          position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 50,
          width: "220px", background: "var(--lb-bg-surface-raised)",
          borderRight: "1px solid var(--lb-border)",
          display: "flex", flexDirection: "column",
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s ease",
          boxShadow: sidebarOpen ? "4px 0 20px rgba(0,0,0,0.15)" : "none",
        }} className="lb-sidebar">
        <div style={{ padding: "16px", borderBottom: "1px solid var(--lb-border)", flexShrink: 0 }}>
          <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--lb-text-primary)", lineHeight: 1 }}>OncoTrace-AI</p>
          <p style={{ fontSize: "10px", color: "var(--lb-text-muted)", marginTop: "4px" }}>{patientName || `Sample ${meta.sample_id}`}</p>
        </div>

        <nav style={{ flex: 1, padding: "12px 8px", overflowY: "auto" }}>
          {NAV_PAGES.map((page) => {
            const active = activePage === page.id;
            return (
              <button key={page.id}
                onClick={() => { onNavigate(page.id); setSidebarOpen(false); }}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: "10px",
                  padding: "9px 12px", borderRadius: "var(--lb-radius-md)", marginBottom: "2px",
                  border: "none", cursor: "pointer", textAlign: "left",
                  background: active ? "var(--lb-status-info-bg)" : "transparent",
                  color: active ? "var(--lb-status-info)" : "var(--lb-text-secondary)",
                  transition: "all 0.2s",
                }}>
                <Icon d={ICONS[page.icon] || ICONS.dna} size={14} style={{ color: active ? "var(--lb-status-info)" : "var(--lb-text-secondary)", flexShrink: 0 }} />
                <span style={{ fontSize: "12px", fontWeight: active ? 700 : 500 }}>{page.label}</span>
                {active && <div style={{ marginLeft: "auto", width: "4px", height: "4px", borderRadius: "50%", background: "var(--lb-status-info)" }} />}
              </button>
            );
          })}
        </nav>

        <div style={{ padding: "12px", borderTop: "1px solid var(--lb-border)", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 10px", borderRadius: "var(--lb-radius-sm)", background: "var(--lb-status-low-bg)", border: "1px solid var(--lb-status-low-border)" }}>
            <PulseDot color="var(--lb-status-low)" />
            <span style={{ fontSize: "10px", fontWeight: 600, color: "var(--lb-status-low)" }}>Analysis Complete</span>
          </div>
        </div>
      </aside>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }} className="lb-main-area">
        <header style={{
          position: "sticky", top: 0, zIndex: 30,
          background: "var(--lb-bg-surface-raised)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
          borderBottom: "1px solid var(--lb-border)", flexShrink: 0,
        }}>
          <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 16px" }}>
            <div style={{ height: "56px", display: "flex", alignItems: "center", gap: "12px" }}>
              <button onClick={() => setSidebarOpen((o) => !o)}
                aria-label={sidebarOpen ? "Close navigation" : "Open navigation"}
                data-lb-btn="utility"
                style={{
                  width: "32px", height: "32px", borderRadius: "var(--lb-radius-md)", flexShrink: 0,
                  border: "1px solid var(--lb-border)", background: "var(--lb-input-bg)",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--lb-text-secondary)",
                }}>
                <Icon d={sidebarOpen ? ICONS.close : ICONS.menu} size={16} style={{ color: "var(--lb-text-secondary)" }} />
              </button>

              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: "14px", fontWeight: 700, color: "var(--lb-text-primary)", lineHeight: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {pageTitle}
                </p>
                <p style={{ fontSize: "10px", color: "var(--lb-text-muted)", marginTop: "1px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {[patientName, meta.sample_id].filter(Boolean).join(" · ")}
                </p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0, flexWrap: "wrap", justifyContent: "flex-end" }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: "6px",
                  padding: "5px 10px", borderRadius: "var(--lb-radius-sm)",
                  background: "var(--lb-status-info-bg)", border: "1px solid var(--lb-status-info-border)",
                }} title="This is a research prototype, not a validated clinical diagnostic tool.">
                  <PulseDot color="var(--lb-status-info)" />
                  <span style={{ fontSize: "10px", fontWeight: 700, color: "var(--lb-status-info)" }} className="lb-hide-xs">
                    Research Prototype · Tier 1: {tier1} · Tier 2: {tier2}
                  </span>
                </div>
                {!callerAdapterValidated && (
                  <div
                    title="This file's variant caller adapter has not been validated against a known file from that caller. Field interpretation, including VAF and depth, may be wrong."
                    style={{
                      display: "flex", alignItems: "center", gap: "5px",
                      padding: "5px 10px", borderRadius: "var(--lb-radius-sm)",
                      background: "var(--lb-status-high-bg)", border: "1px solid var(--lb-status-high-border)",
                    }}>
                    <Icon d={ICONS.alert} size={11} style={{ color: "var(--lb-status-high)" }} />
                    <span style={{ fontSize: "10px", fontWeight: 700, color: "var(--lb-status-high)" }} className="lb-hide-xs">
                      Unvalidated adapter
                    </span>
                  </div>
                )}
                <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
                {onBack && (
                  <button onClick={onBack} title="Back to site" aria-label="Back to site"
                    data-lb-btn="utility"
                    style={{
                      width: "32px", height: "32px", flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      borderRadius: "var(--lb-radius-md)", border: "1px solid var(--lb-border)",
                      background: "var(--lb-input-bg)", cursor: "pointer",
                    }}>
                    <Icon d={ICONS.back} size={16} style={{ color: "var(--lb-text-secondary)" }} />
                  </button>
                )}
                <button onClick={onReset} aria-label="Start a new analysis"
                  data-lb-btn="secondary"
                  style={{
                    display: "flex", alignItems: "center", gap: "5px",
                    padding: "7px 12px", borderRadius: "var(--lb-radius-md)", border: "1px solid var(--lb-border-strong)",
                    background: "var(--lb-bg-surface)", color: "var(--lb-text-primary)", fontSize: "12px", fontWeight: 600, cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}>
                  <Icon d={ICONS.upload} size={13} style={{ color: "var(--lb-text-primary)" }} />
                  <span className="lb-hide-xs">New Patient</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <main style={{ flex: 1, overflowY: "auto", padding: "20px 16px 80px" }}>
          <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
            {children}
          </div>
        </main>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .lb-sidebar { transform: translateX(0) !important; box-shadow: none !important; }
          .lb-main-area { margin-left: 220px; }
        }
        @media (min-width: 1024px) {
          .ov-row2 { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .lb-hide-xs { display: none !important; }
        }
        [data-lb-theme] ::-webkit-scrollbar { width: 6px; height: 6px; }
        [data-lb-theme] ::-webkit-scrollbar-track { background: transparent; }
        [data-lb-theme] ::-webkit-scrollbar-thumb { background: rgba(128,128,128,0.3); border-radius: 99px; }
        [data-lb-theme] input::placeholder { color: var(--lb-text-muted); }
      `}</style>
    </div>
  );
}
