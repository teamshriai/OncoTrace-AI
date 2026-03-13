import { useState } from "react";

const cols = {
  Product: ["Platform Overview", "AI Engine", "Pipeline", "Integrations", "Security", "Pricing"],
  Company: ["About Us", "Careers", "Press", "Investors", "Partners"],
  Resources: ["Documentation", "Publications", "White Papers", "Case Studies", "Blog"],
  Legal: ["Privacy Policy", "Terms of Service", "HIPAA Notice", "Cookie Policy"],
};

const badges = ["FDA", "CE-IVD", "CAP", "HIPAA", "ISO 15189"];

export default function Footer() {
  const [email, setEmail] = useState("");

  return (
    <footer
      style={{
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#f5f5f0",
        color: "#1a1a1a",
        fontFamily: "'Georgia', 'Times New Roman', serif",
        minHeight: "500px",
      }}
    >
      {/* ── Radial glow blobs matching screenshot ── */}
      {/* Blue glow — bottom center */}
      <div
        style={{
          pointerEvents: "none",
          position: "absolute",
          left: "55%",
          bottom: "-80px",
          transform: "translateX(-50%)",
          width: "700px",
          height: "500px",
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at center, rgba(59,130,246,0.30) 0%, rgba(99,102,241,0.18) 35%, transparent 70%)",
          filter: "blur(40px)",
          zIndex: 0,
        }}
      />
      {/* Purple/pink glow — bottom right */}
      <div
        style={{
          pointerEvents: "none",
          position: "absolute",
          right: "5%",
          bottom: "0px",
          width: "420px",
          height: "360px",
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at center, rgba(168,85,247,0.22) 0%, rgba(236,72,153,0.12) 45%, transparent 70%)",
          filter: "blur(50px)",
          zIndex: 0,
        }}
      />
      {/* Teal glow — bottom left */}
      <div
        style={{
          pointerEvents: "none",
          position: "absolute",
          left: "10%",
          bottom: "0px",
          width: "350px",
          height: "300px",
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at center, rgba(20,184,166,0.18) 0%, rgba(59,130,246,0.10) 50%, transparent 70%)",
          filter: "blur(45px)",
          zIndex: 0,
        }}
      />

      {/* ── Main content ── */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "72px 48px 0",
        }}
      >
        {/* Top section: headline left, nav links right */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "48px",
            flexWrap: "wrap",
          }}
        >
          {/* Left: eyebrow + headline */}
          <div style={{ maxWidth: "520px" }}>
            <p
              style={{
                fontSize: "11px",
                fontWeight: "600",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#3b82f6",
                marginBottom: "16px",
                marginTop: 0,
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontFamily: "'Georgia', serif",
              }}
            >
              <span style={{ fontSize: "14px" }}>✦</span> Contact Us
            </p>
            <h2
              style={{
                fontSize: "clamp(28px, 4vw, 48px)",
                fontWeight: "700",
                lineHeight: "1.18",
                color: "#111",
                margin: 0,
                fontFamily: "'Georgia', serif",
                letterSpacing: "-0.5px",
              }}
            >
              Interested in working{" "}
              <span style={{ color: "#111" }}>together,</span>{" "}
              <span style={{ color: "#9ca3af", fontStyle: "italic" }}>
                trying our the platform or simply learning more?
              </span>
            </h2>
          </div>

          {/* Right: nav links */}
          <div style={{ display: "flex", gap: "40px", paddingTop: "8px", flexWrap: "wrap" }}>
            {["How It Works", "Benefits", "Features", "Team"].map((item) => (
              <a
                key={item}
                href="#"
                style={{
                  fontSize: "14px",
                  color: "#555",
                  textDecoration: "none",
                  fontFamily: "'Georgia', serif",
                  transition: "color 0.2s",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => (e.target.style.color = "#111")}
                onMouseLeave={(e) => (e.target.style.color = "#555")}
              >
                {item}
              </a>
            ))}
          </div>
        </div>

        {/* Middle section: contact info */}
        <div style={{ marginTop: "48px" }}>
          <p
            style={{
              fontSize: "12px",
              color: "#9ca3af",
              marginBottom: "6px",
              marginTop: 0,
              fontFamily: "'Georgia', serif",
            }}
          >
            Contact Shri-AI at:
          </p>
          <a
            href="mailto:hello@shri-ai.org"
            style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "#111",
              textDecoration: "none",
              fontFamily: "'Georgia', serif",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#3b82f6")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#111")}
          >
            hello@shri-ai.org
            <span style={{ fontSize: "16px", transform: "rotate(-45deg)", display: "inline-block" }}>↑</span>
          </a>
        </div>

        {/* Newsletter row */}
        <div style={{ marginTop: "32px", maxWidth: "360px" }}>
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
              border: "1px solid rgba(0,0,0,0.12)",
              backgroundColor: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(8px)",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
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
                color: "#1a1a1a",
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

      {/* ── Giant logo watermark ── */}
      <div
        style={{
          position: "relative",
          zIndex: 5,
          textAlign: "center",
          marginTop: "24px",
          lineHeight: "1",
          overflow: "hidden",
          paddingBottom: "0",
        }}
      >
        <span
          style={{
            fontSize: "clamp(80px, 16vw, 180px)",
            fontWeight: "900",
            fontFamily: "'Georgia', serif",
            letterSpacing: "-4px",
            color: "#111",
            display: "block",
            userSelect: "none",
          }}
        >
          Shri-<span style={{ color: "#3b82f6", fontStyle: "italic" }}>AI</span>
        </span>
      </div>

      {/* ── Bottom bar ── */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 48px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
          marginTop: "-8px",
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

      {/* Social links row */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 48px 32px",
          display: "flex",
          justifyContent: "flex-end",
          gap: "24px",
        }}
      >
        {["LinkedIn", "Twitter", "GitHub"].map((s) => (
          <a
            key={s}
            href="#"
            style={{
              fontSize: "12px",
              color: "#aaa",
              textDecoration: "none",
              fontFamily: "'Georgia', serif",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.target.style.color = "#111")}
            onMouseLeave={(e) => (e.target.style.color = "#aaa")}
          >
            {s}
          </a>
        ))}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-top {
            flex-direction: column !important;
          }
        }
      `}</style>
    </footer>
  );
}