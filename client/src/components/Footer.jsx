import { useState } from "react";

const cols = {
  Product: ["Platform Overview", "AI Engine", "Pipeline", "Integrations", "Security", "Pricing"],
  Company: ["About Us", "Careers", "Press", "Investors", "Partners"],
  Resources: ["Documentation", "Publications", "White Papers", "Case Studies", "Blog"],
  Legal: ["Privacy Policy", "Terms of Service", "HIPAA Notice", "Cookie Policy"],
};

const badges = ["FDA", "CE-IVD", "CAP", "HIPAA", "ISO 15189"];

const noiseSvg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n' x='0' y='0'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`;

export default function Footer() {
  const [email, setEmail] = useState("");

  return (
    <footer
      style={{
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#fafafa",
        color: "#1a1a2e",
        fontFamily: "'Georgia', 'Times New Roman', serif",
      }}
    >
      {/* ── Grainy white texture overlay ── */}
      <div
        style={{
          pointerEvents: "none",
          position: "absolute",
          inset: 0,
          zIndex: 1,
          backgroundImage: noiseSvg,
          backgroundSize: "300px 300px",
          backgroundRepeat: "repeat",
          opacity: 0.55,
          mixBlendMode: "multiply",
        }}
      />

      {/* ── Subtle warm tint beneath the noise ── */}
      <div
        style={{
          pointerEvents: "none",
          position: "absolute",
          inset: 0,
          zIndex: 0,
          background: "linear-gradient(180deg, #fff 0%, #f0f6ff 60%, #dbeafe 100%)",
        }}
      />

      {/* ── Blue hemisphere — centre anchored at very bottom edge ── */}
      <div
        style={{
          pointerEvents: "none",
          position: "absolute",
          left: "50%",
          bottom: 0,
          transform: "translateX(-50%)",
          width: "140%",
          paddingBottom: "70%",
          borderRadius: "50% 50% 0 0",
          zIndex: 2,
          background:
            "radial-gradient(ellipse at 50% 100%, rgba(59,130,246,0.55) 0%, rgba(59,130,246,0.32) 22%, rgba(59,130,246,0.14) 45%, rgba(59,130,246,0.04) 65%, transparent 80%)",
          filter: "blur(2px)",
        }}
      />

      {/* ── Soft inner glow at the dome apex ── */}
      <div
        style={{
          pointerEvents: "none",
          position: "absolute",
          left: "50%",
          bottom: 0,
          transform: "translateX(-50%)",
          width: "70%",
          paddingBottom: "35%",
          borderRadius: "50% 50% 0 0",
          zIndex: 2,
          background:
            "radial-gradient(ellipse at 50% 100%, rgba(59,130,246,0.45) 0%, rgba(59,130,246,0.18) 40%, transparent 68%)",
          filter: "blur(28px)",
        }}
      />

      {/* ── Outermost feather — dissolves blue into white ── */}
      <div
        style={{
          pointerEvents: "none",
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          bottom: 0,
          width: "160%",
          height: "55%",
          zIndex: 3,
          background:
            "radial-gradient(ellipse at 50% 100%, rgba(219,234,254,0.60) 0%, rgba(219,234,254,0.22) 40%, transparent 70%)",
          filter: "blur(18px)",
        }}
      />

      {/* ── Main content ── */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "72px 48px 40px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1fr",
            gap: "48px",
          }}
          className="footer-grid"
        >
          {/* Brand column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Logo */}
            <h2
              style={{
                fontSize: "26px",
                fontWeight: "700",
                letterSpacing: "-0.5px",
                color: "#111",
                margin: 0,
                fontFamily: "'Georgia', serif",
              }}
            >
              Shri-
              <span style={{ color: "#3b82f6", fontStyle: "italic" }}>
                AI
              </span>
            </h2>

            <p
              style={{
                fontSize: "13.5px",
                lineHeight: "1.7",
                color: "#6b6b7a",
                maxWidth: "240px",
                margin: 0,
                fontFamily: "'Georgia', serif",
              }}
            >
              AI For Health. Care For All. An Open Source, Not-for-Profit bringing AI-powered breast cancer screening to your neighbourhood.
            </p>

            {/* Newsletter */}
            <div style={{ paddingTop: "8px" }}>
              <p
                style={{
                  fontSize: "10px",
                  fontWeight: "700",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#aaa",
                  marginBottom: "10px",
                  fontFamily: "'Georgia', serif",
                }}
              >
                Newsletter
              </p>
              <div
                style={{
                  display: "flex",
                  overflow: "hidden",
                  borderRadius: "8px",
                  border: "1px solid rgba(59,130,246,0.25)",
                  backgroundColor: "rgba(255,255,255,0.75)",
                  backdropFilter: "blur(8px)",
                  boxShadow: "0 2px 12px rgba(59,130,246,0.08)",
                }}
              >
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    flex: 1,
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    padding: "10px 14px",
                    fontSize: "13px",
                    color: "#1a1a2e",
                    fontFamily: "'Georgia', serif",
                  }}
                />
                <button
                  style={{
                    background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                    border: "none",
                    padding: "10px 18px",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#fff",
                    cursor: "pointer",
                    letterSpacing: "0.02em",
                    fontFamily: "'Georgia', serif",
                    transition: "opacity 0.2s",
                  }}
                  onMouseEnter={(e) => (e.target.style.opacity = "0.85")}
                  onMouseLeave={(e) => (e.target.style.opacity = "1")}
                >
                  Send
                </button>
              </div>
            </div>
          </div>

          {/* Nav columns — unchanged */}
          {Object.entries(cols).map(([cat, items]) => (
            <div key={cat}>
              <h3
                style={{
                  fontSize: "10.5px",
                  fontWeight: "700",
                  letterSpacing: "0.13em",
                  textTransform: "uppercase",
                  color: "#111",
                  marginBottom: "18px",
                  marginTop: 0,
                  fontFamily: "'Georgia', serif",
                }}
              >
                {cat}
              </h3>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "11px" }}>
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      style={{
                        fontSize: "13px",
                        color: "#787887",
                        textDecoration: "none",
                        fontFamily: "'Georgia', serif",
                        transition: "color 0.2s",
                      }}
                      onMouseEnter={(e) => (e.target.style.color = "#3b82f6")}
                      onMouseLeave={(e) => (e.target.style.color = "#787887")}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div
          style={{
            marginTop: "64px",
            height: "1px",
            background: "linear-gradient(90deg, transparent 0%, rgba(59,130,246,0.20) 30%, rgba(59,130,246,0.20) 70%, transparent 100%)",
          }}
        />

        {/* Bottom bar */}
        <div
          style={{
            marginTop: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <p
            style={{
              fontSize: "11.5px",
              color: "#aaa",
              margin: 0,
              fontFamily: "'Georgia', serif",
            }}
          >
            © 2025 Shri-AI.org – Bringing AI Breast Cancer Prevention to You. Committed to ethical AI and patient privacy.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {badges.map((b) => (
              <span
                key={b}
                style={{
                  borderRadius: "999px",
                  border: "1px solid rgba(59,130,246,0.30)",
                  background: "rgba(59,130,246,0.07)",
                  padding: "4px 13px",
                  fontSize: "10.5px",
                  fontWeight: "600",
                  color: "#1d4ed8",
                  letterSpacing: "0.05em",
                  fontFamily: "'Georgia', serif",
                }}
              >
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 900px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 540px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}