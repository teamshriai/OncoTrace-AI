import { useState } from "react";

const badges = ["FDA", "CE-IVD", "CAP", "HIPAA", "ISO 15189"];
const MOUNTAIN_IMAGE_URL = "/footer_image.jpg";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSend = () => {
    if (email) { setSent(true); setTimeout(() => setSent(false), 2500); setEmail(""); }
  };
  const handleCopy = () => {
    navigator.clipboard.writeText("dev-team@oncotraceai.org");
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer style={{
      position: "relative", overflow: "hidden",
      padding: "32px 24px",
      fontFamily: "'Inter','Helvetica Neue',Arial,sans-serif",
      boxSizing: "border-box",
    }}>
      {/* Background image without blur */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${MOUNTAIN_IMAGE_URL})`, backgroundSize: "cover", backgroundPosition: "center 40%", filter: "brightness(0.68) saturate(1.3)", transform: "scale(1.08)", zIndex: 0 }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg,rgba(10,22,70,0.52) 0%,rgba(29,78,216,0.28) 50%,rgba(10,22,70,0.62) 100%)", zIndex: 1 }} />

      <div style={{ position: "relative", zIndex: 10, maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ background: "rgba(255,255,255,0.97)", borderRadius: "18px", boxShadow: "0 8px 48px rgba(29,78,216,0.18),0 2px 12px rgba(0,0,0,0.10)", border: "1px solid rgba(59,130,246,0.18)", overflow: "hidden" }}>

          {/* ── UPPER: 3-column grid ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1px 0.9fr 1px 0.9fr", minHeight: "360px" }}>

            {/* COL 1 — Headline + CTA + Email */}
            <div style={{ padding: "48px 44px 40px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <p style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase", color: "#3b82f6", marginBottom: "14px", marginTop: 0, display: "flex", alignItems: "center", gap: "5px" }}>
                  <span>✦</span> Contact Us
                </p>
                <h2 style={{ fontSize: "clamp(22px, 2.6vw, 36px)", fontWeight: "700", lineHeight: "1.2", color: "#0f1e50", margin: "0 0 6px 0", letterSpacing: "-0.4px" }}>
                  Interested in exploring OncoTrace-AI,
                </h2>
                <h2 style={{ fontSize: "clamp(22px, 2.6vw, 36px)", fontWeight: "700", lineHeight: "1.2", color: "#93c5fd", margin: "0 0 32px 0", letterSpacing: "-0.4px" }}>
                  collaborating on research or joining the open ecosystem?
                </h2>
                <a href="#" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "transparent", color: "#0f1e50", borderRadius: "999px", padding: "12px 26px", fontSize: "14px", fontWeight: "600", textDecoration: "none", border: "1.5px solid rgba(15,30,80,0.22)", marginBottom: "24px", transition: "all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "linear-gradient(135deg,#1d4ed8,#3b82f6)"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "transparent"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#0f1e50"; e.currentTarget.style.borderColor = "rgba(15,30,80,0.22)"; }}>
                  Schedule a call now →
                </a>
              </div>
              <div>
                <p style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.14em", textTransform: "uppercase", color: "#9ca3af", marginBottom: "9px", marginTop: 0 }}>Or email us at</p>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#1e2a4a", borderRadius: "999px", padding: "10px 18px", cursor: "pointer" }} onClick={handleCopy}>
                  <a href="mailto:dev-team@oncotraceai.org" style={{ fontSize: "13px", fontWeight: "600", color: "#e8f0fe", textDecoration: "none" }} onClick={e => e.stopPropagation()}>dev-team@oncotraceai.org</a>
                  <span style={{ fontSize: "12px", color: "#93c5fd" }}>{copied ? "✓" : "⎘"}</span>
                </div>
              </div>
            </div>

            {/* Vertical divider */}
            <div style={{ background: "rgba(59,130,246,0.15)", margin: "32px 0" }} />

            {/* COL 2 — Nav links */}
            <div style={{ padding: "48px 40px 40px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div style={{ display: "flex", gap: "40px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <p style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.13em", textTransform: "uppercase", color: "#9ca3af", margin: "0 0 4px 0" }}>Quick Links</p>
                  {["How It Works", "Benefits", "Features", "Team"].map(item => (
                    <a key={item} href="#" style={{ fontSize: "13px", color: "#4b5563", textDecoration: "none", transition: "color 0.2s" }}
                      onMouseEnter={e => e.target.style.color = "#1d4ed8"} onMouseLeave={e => e.target.style.color = "#4b5563"}>{item}</a>
                  ))}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <p style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.13em", textTransform: "uppercase", color: "#9ca3af", margin: "0 0 4px 0" }}>Information</p>
                  {["Terms of Service", "Privacy Policy", "Cookies Settings"].map(item => (
                    <a key={item} href="#" style={{ fontSize: "13px", color: "#4b5563", textDecoration: "none", transition: "color 0.2s" }}
                      onMouseEnter={e => e.target.style.color = "#1d4ed8"} onMouseLeave={e => e.target.style.color = "#4b5563"}>{item}</a>
                  ))}
                </div>
              </div>

              {/* Brand tagline block */}
              <div style={{ background: "#f0f6ff", borderRadius: "12px", border: "1.5px solid rgba(59,130,246,0.15)", padding: "20px 22px" }}>
                <div style={{ fontSize: "28px", color: "#3b82f6", fontWeight: "700", lineHeight: "1", marginBottom: "10px" }}>"</div>
                <p style={{ fontSize: "13px", color: "#0f1e50", lineHeight: "1.65", margin: "0 0 12px 0", fontWeight: "500" }}>
                  From AI-based risk prediction to liquid biopsy-powered real-time monitoring — precision oncology intelligence that is open, accessible, and built for every community.
                </p>
                <p style={{ fontSize: "11px", color: "#3b82f6", fontWeight: "600", margin: 0, letterSpacing: "0.02em" }}>— OncoTrace-AI</p>
              </div>
            </div>

            {/* Vertical divider */}
            <div style={{ background: "rgba(59,130,246,0.15)", margin: "32px 0" }} />

            {/* COL 3 — Newsletter + Social links */}
            <div style={{ padding: "48px 40px 40px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <p style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.13em", textTransform: "uppercase", color: "#9ca3af", margin: "0 0 8px 0" }}>Newsletter</p>
                <p style={{ fontSize: "13px", color: "#4b5563", lineHeight: "1.55", margin: "0 0 14px 0" }}>
                  Get the latest updates on AI-driven cancer prediction, real-time monitoring, and open-source oncology.
                </p>
                <div style={{ display: "flex", overflow: "hidden", borderRadius: "10px", border: "1.5px solid rgba(59,130,246,0.26)", background: "#f0f6ff", marginBottom: "0" }}>
                  <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSend()}
                    style={{ flex: 1, background: "transparent", border: "none", outline: "none", padding: "11px 14px", fontSize: "13px", color: "#1a1a1a", fontFamily: "inherit" }} />
                  <button onClick={handleSend} style={{ background: sent ? "linear-gradient(135deg,#16a34a,#15803d)" : "linear-gradient(135deg,#3b82f6,#1d4ed8)", border: "none", padding: "11px 18px", fontSize: "13px", fontWeight: "600", color: "#fff", cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap", transition: "background 0.3s" }}>
                    {sent ? "✓ Sent!" : "Send"}
                  </button>
                </div>
              </div>

              {/* Social links as full rows */}
              <div>
                <p style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.13em", textTransform: "uppercase", color: "#9ca3af", margin: "0 0 12px 0" }}>Follow Us</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {[
                    { name: "LinkedIn", handle: "/oncotraceai" },
                    { name: "Twitter", handle: "@oncotraceai" },
                    { name: "GitHub", handle: "oncotraceai" },
                    { name: "Instagram", handle: "@oncotraceai" },
                  ].map(s => (
                    <a key={s.name} href="#" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", borderRadius: "8px", background: "#f8faff", border: "1px solid rgba(59,130,246,0.12)", textDecoration: "none", transition: "background 0.2s" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#e8f0fe"}
                      onMouseLeave={e => e.currentTarget.style.background = "#f8faff"}>
                      <span style={{ fontSize: "12px", fontWeight: "600", color: "#0f1e50" }}>{s.name}</span>
                      <span style={{ fontSize: "11px", color: "#3b82f6" }}>{s.handle}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Divider ── */}
          <div style={{ margin: "0 44px", height: "1px", background: "linear-gradient(90deg,transparent,rgba(59,130,246,0.26) 30%,rgba(59,130,246,0.26) 70%,transparent)" }} />

          {/* ── BOTTOM BAR ── */}
          <div style={{ padding: "16px 44px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
            <div style={{ background: "#f0f6ff", border: "1.5px solid rgba(59,130,246,0.2)", borderRadius: "8px", padding: "6px 22px", display: "inline-flex", alignItems: "center", flexShrink: 0 }}>
              <span style={{ fontSize: "20px", fontWeight: "900", letterSpacing: "-0.5px", color: "#64748b", userSelect: "none", lineHeight: "1", fontFamily: "'Inter','Helvetica Neue',Arial,sans-serif", whiteSpace: "nowrap" }}>
                OncoTrace-<span style={{ color: "#3b82f6" }}>AI</span>
              </span>
            </div>
            <p style={{ fontSize: "10px", color: "#9ca3af", margin: 0, flex: "1 1 180px" }}>
              © 2025 OncoTrace-AI – AI-Powered Precision Oncology Intelligence. From risk prediction to real-time monitoring. Open source · Not for profit.
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
}