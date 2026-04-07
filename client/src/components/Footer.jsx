import { useState, useEffect, useCallback } from "react";

const MOUNTAIN_IMAGE_URL = "/footer_image.jpg";

function useWindowWidth() {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return width;
}

export default function Footer() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);
  const width = useWindowWidth();

  const isMobile = width < 640;
  const isTablet = width >= 640 && width < 1024;
  const isDesktop = width >= 1024;

  const handleSend = useCallback(() => {
    if (email) {
      setSent(true);
      setTimeout(() => setSent(false), 2500);
      setEmail("");
    }
  }, [email]);

  const handleCopy = useCallback(() => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText("info@oncotraceai.org");
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const outerPadding = isMobile ? "16px 10px" : isTablet ? "24px 16px" : "32px 24px";
  
  const colPadding = isMobile
    ? "28px 20px 24px"
    : isTablet
    ? "36px 28px 28px"
    : "48px 44px 40px";

  const col2Padding = isMobile
    ? "28px 20px 24px"
    : isTablet
    ? "36px 28px 28px"
    : "48px 40px 40px";

  const col3Padding = col2Padding;

  const headingSize = isMobile
    ? "20px"
    : isTablet
    ? "24px"
    : "clamp(22px, 2.6vw, 36px)";

  const gridStyle = isDesktop
    ? {
        display: "grid",
        gridTemplateColumns: "1.2fr 1px 0.9fr 1px 0.9fr",
        minHeight: "360px",
      }
    : isTablet
    ? {
        display: "grid",
        gridTemplateColumns: "1fr 1px 1fr",
        minHeight: "auto",
      }
    : {
        display: "flex",
        flexDirection: "column",
      };

  const bottomBarStyle = isMobile
    ? {
        padding: "16px 20px 20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
        textAlign: "center",
      }
    : {
        padding: "16px 44px 22px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "16px",
        flexWrap: "wrap",
      };

  const navGap = isMobile ? "24px" : "40px";

  const HorizontalDivider = () => (
    <div
      style={{
        margin: isMobile ? "0 20px" : "0 28px",
        height: "1px",
        background:
          "linear-gradient(90deg,transparent,rgba(59,130,246,0.26) 30%,rgba(59,130,246,0.26) 70%,transparent)",
      }}
    />
  );

  const VerticalDivider = () => (
    <div
      style={{
        background: "rgba(59,130,246,0.15)",
        margin: "32px 0",
      }}
    />
  );

  return (
    <footer
      style={{
        position: "relative",
        overflow: "hidden",
        padding: outerPadding,
        fontFamily: "'Inter','Helvetica Neue',Arial,sans-serif",
        boxSizing: "border-box",
      }}
    >
      {/* Background image */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${MOUNTAIN_IMAGE_URL})`,
          backgroundSize: "cover",
          backgroundPosition: "center 40%",
          filter: "brightness(0.68) saturate(1.3)",
          transform: "scale(1.08)",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(160deg,rgba(10,22,70,0.52) 0%,rgba(29,78,216,0.28) 50%,rgba(10,22,70,0.62) 100%)",
          zIndex: 1,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.97)",
            borderRadius: isMobile ? "14px" : "18px",
            boxShadow:
              "0 8px 48px rgba(29,78,216,0.18),0 2px 12px rgba(0,0,0,0.10)",
            border: "1px solid rgba(59,130,246,0.18)",
            overflow: "hidden",
          }}
        >
          {/* ── UPPER GRID ── */}
          <div style={gridStyle}>
            {/* COL 1 — Headline + CTA + Email */}
            <div
              style={{
                padding: colPadding,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: "24px",
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: "10px",
                    fontWeight: "700",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "#3b82f6",
                    marginBottom: "14px",
                    marginTop: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <span>✦</span> Contact Us
                </p>
                <h2
                  style={{
                    fontSize: headingSize,
                    fontWeight: "700",
                    lineHeight: "1.2",
                    color: "#0f1e50",
                    margin: "0 0 6px 0",
                    letterSpacing: "-0.4px",
                  }}
                >
                  Interested in exploring OncoTrace-AI,
                </h2>
                <h2
                  style={{
                    fontSize: headingSize,
                    fontWeight: "700",
                    lineHeight: "1.2",
                    color: "#93c5fd",
                    margin: "0 0 24px 0",
                    letterSpacing: "-0.4px",
                  }}
                >
                  collaborating on research or joining the open ecosystem?
                </h2>
                <a
                  href="#"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "transparent",
                    color: "#0f1e50",
                    borderRadius: "999px",
                    padding: isMobile ? "10px 20px" : "12px 26px",
                    fontSize: isMobile ? "13px" : "14px",
                    fontWeight: "600",
                    textDecoration: "none",
                    border: "1.5px solid rgba(15,30,80,0.22)",
                    marginBottom: "24px",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      "linear-gradient(135deg,#1d4ed8,#3b82f6)";
                    e.currentTarget.style.color = "#fff";
                    e.currentTarget.style.borderColor = "transparent";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#0f1e50";
                    e.currentTarget.style.borderColor = "rgba(15,30,80,0.22)";
                  }}
                >
                  Schedule a call now →
                </a>
              </div>
              <div>
                <p
                  style={{
                    fontSize: "10px",
                    fontWeight: "700",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "#9ca3af",
                    marginBottom: "9px",
                    marginTop: 0,
                  }}
                >
                  Or email us at
                </p>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "#1e2a4a",
                    borderRadius: "999px",
                    padding: "10px 18px",
                    cursor: "pointer",
                    maxWidth: "100%",
                    flexWrap: "wrap",
                  }}
                  onClick={handleCopy}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") handleCopy();
                  }}
                  aria-label="Copy email address"
                >
                  <a
                    href="mailto:info@oncotraceai.org"
                    style={{
                      fontSize: isMobile ? "11px" : "13px",
                      fontWeight: "600",
                      color: "#e8f0fe",
                      textDecoration: "none",
                      wordBreak: "break-all",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    info@oncotraceai.org
                  </a>
                  <span style={{ fontSize: "12px", color: "#93c5fd" }}>
                    {copied ? "✓" : "⎘"}
                  </span>
                </div>
              </div>
            </div>

            {/* Divider between col1 and col2 */}
            {isDesktop && <VerticalDivider />}
            {isTablet && <VerticalDivider />}
            {isMobile && <HorizontalDivider />}

            {/* COL 2 — Nav links */}
            <div
              style={{
                padding: col2Padding,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: "24px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: navGap,
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    minWidth: isMobile ? "120px" : "auto",
                  }}
                >
                  <p
                    style={{
                      fontSize: "10px",
                      fontWeight: "700",
                      letterSpacing: "0.13em",
                      textTransform: "uppercase",
                      color: "#9ca3af",
                      margin: "0 0 4px 0",
                    }}
                  >
                    Quick Links
                  </p>
                  {["How It Works", "Benefits", "Features", "Team"].map(
                    (item) => (
                      <a
                        key={item}
                        href="#"
                        style={{
                          fontSize: "13px",
                          color: "#4b5563",
                          textDecoration: "none",
                          transition: "color 0.2s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.color = "#1d4ed8")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.color = "#4b5563")
                        }
                      >
                        {item}
                      </a>
                    )
                  )}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    minWidth: isMobile ? "120px" : "auto",
                  }}
                >
                  <p
                    style={{
                      fontSize: "10px",
                      fontWeight: "700",
                      letterSpacing: "0.13em",
                      textTransform: "uppercase",
                      color: "#9ca3af",
                      margin: "0 0 4px 0",
                    }}
                  >
                    Information
                  </p>
                  {["Terms of Service", "Privacy Policy", "Cookies Settings"].map(
                    (item) => (
                      <a
                        key={item}
                        href="#"
                        style={{
                          fontSize: "13px",
                          color: "#4b5563",
                          textDecoration: "none",
                          transition: "color 0.2s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.color = "#1d4ed8")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.color = "#4b5563")
                        }
                      >
                        {item}
                      </a>
                    )
                  )}
                </div>
              </div>

              {/* Brand tagline block */}
              <div
                style={{
                  background: "#f0f6ff",
                  borderRadius: "12px",
                  border: "1.5px solid rgba(59,130,246,0.15)",
                  padding: isMobile ? "16px 18px" : "20px 22px",
                }}
              >
                <div
                  style={{
                    fontSize: "28px",
                    color: "#3b82f6",
                    fontWeight: "700",
                    lineHeight: "1",
                    marginBottom: "10px",
                  }}
                >
                  "
                </div>
                <p
                  style={{
                    fontSize: "13px",
                    color: "#0f1e50",
                    lineHeight: "1.65",
                    margin: "0 0 12px 0",
                    fontWeight: "500",
                  }}
                >
                  From AI-based risk prediction to liquid biopsy-powered
                  real-time monitoring — precision oncology intelligence that is
                  open, accessible, and built for every community.
                </p>
                <p
                  style={{
                    fontSize: "11px",
                    color: "#3b82f6",
                    fontWeight: "600",
                    margin: 0,
                    letterSpacing: "0.02em",
                  }}
                >
                  — OncoTrace-AI
                </p>
              </div>
            </div>

            {/* Divider between col2 and col3 */}
            {isDesktop && <VerticalDivider />}
            {isMobile && <HorizontalDivider />}

            {/* COL 3 — Newsletter + Social links */}
            {!isTablet && (
              <div
                style={{
                  padding: col3Padding,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: "24px",
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: "10px",
                      fontWeight: "700",
                      letterSpacing: "0.13em",
                      textTransform: "uppercase",
                      color: "#9ca3af",
                      margin: "0 0 8px 0",
                    }}
                  >
                    Newsletter
                  </p>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "#4b5563",
                      lineHeight: "1.55",
                      margin: "0 0 14px 0",
                    }}
                  >
                    Get the latest updates on AI-driven cancer prediction,
                    real-time monitoring, and open-source oncology.
                  </p>
                  <div
                    style={{
                      display: "flex",
                      overflow: "hidden",
                      borderRadius: "10px",
                      border: "1.5px solid rgba(59,130,246,0.26)",
                      background: "#f0f6ff",
                    }}
                  >
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSend()}
                      aria-label="Email address for newsletter"
                      style={{
                        flex: 1,
                        background: "transparent",
                        border: "none",
                        outline: "none",
                        padding: "11px 14px",
                        fontSize: "13px",
                        color: "#1a1a1a",
                        fontFamily: "inherit",
                        minWidth: 0,
                      }}
                    />
                    <button
                      onClick={handleSend}
                      aria-label={sent ? "Email sent" : "Send newsletter signup"}
                      style={{
                        background: sent
                          ? "linear-gradient(135deg,#16a34a,#15803d)"
                          : "linear-gradient(135deg,#3b82f6,#1d4ed8)",
                        border: "none",
                        padding: "11px 18px",
                        fontSize: "13px",
                        fontWeight: "600",
                        color: "#fff",
                        cursor: "pointer",
                        fontFamily: "inherit",
                        whiteSpace: "nowrap",
                        transition: "background 0.3s",
                      }}
                    >
                      {sent ? "✓ Sent!" : "Send"}
                    </button>
                  </div>
                </div>

                {/* Social links */}
                <div>
                  <p
                    style={{
                      fontSize: "10px",
                      fontWeight: "700",
                      letterSpacing: "0.13em",
                      textTransform: "uppercase",
                      color: "#9ca3af",
                      margin: "0 0 12px 0",
                    }}
                  >
                    Follow Us
                  </p>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    {[
                      { name: "LinkedIn", handle: "/oncotraceai" },
                      { name: "Twitter", handle: "@oncotraceai" },
                      { name: "GitHub", handle: "oncotraceai" },
                      { name: "Instagram", handle: "@oncotraceai" },
                    ].map((s) => (
                      <a
                        key={s.name}
                        href="#"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "8px 12px",
                          borderRadius: "8px",
                          background: "#f8faff",
                          border: "1px solid rgba(59,130,246,0.12)",
                          textDecoration: "none",
                          transition: "background 0.2s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = "#e8f0fe")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "#f8faff")
                        }
                      >
                        <span
                          style={{
                            fontSize: "12px",
                            fontWeight: "600",
                            color: "#0f1e50",
                          }}
                        >
                          {s.name}
                        </span>
                        <span style={{ fontSize: "11px", color: "#3b82f6" }}>
                          {s.handle}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Tablet: Col 3 rendered below the 2-col grid */}
          {isTablet && (
            <>
              <div
                style={{
                  margin: "0 28px",
                  height: "1px",
                  background:
                    "linear-gradient(90deg,transparent,rgba(59,130,246,0.26) 30%,rgba(59,130,246,0.26) 70%,transparent)",
                }}
              />
              <div
                style={{
                  padding: col3Padding,
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "28px",
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: "10px",
                      fontWeight: "700",
                      letterSpacing: "0.13em",
                      textTransform: "uppercase",
                      color: "#9ca3af",
                      margin: "0 0 8px 0",
                    }}
                  >
                    Newsletter
                  </p>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "#4b5563",
                      lineHeight: "1.55",
                      margin: "0 0 14px 0",
                    }}
                  >
                    Get the latest updates on AI-driven cancer prediction,
                    real-time monitoring, and open-source oncology.
                  </p>
                  <div
                    style={{
                      display: "flex",
                      overflow: "hidden",
                      borderRadius: "10px",
                      border: "1.5px solid rgba(59,130,246,0.26)",
                      background: "#f0f6ff",
                    }}
                  >
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSend()}
                      aria-label="Email address for newsletter"
                      style={{
                        flex: 1,
                        background: "transparent",
                        border: "none",
                        outline: "none",
                        padding: "11px 14px",
                        fontSize: "13px",
                        color: "#1a1a1a",
                        fontFamily: "inherit",
                        minWidth: 0,
                      }}
                    />
                    <button
                      onClick={handleSend}
                      aria-label={sent ? "Email sent" : "Send newsletter signup"}
                      style={{
                        background: sent
                          ? "linear-gradient(135deg,#16a34a,#15803d)"
                          : "linear-gradient(135deg,#3b82f6,#1d4ed8)",
                        border: "none",
                        padding: "11px 18px",
                        fontSize: "13px",
                        fontWeight: "600",
                        color: "#fff",
                        cursor: "pointer",
                        fontFamily: "inherit",
                        whiteSpace: "nowrap",
                        transition: "background 0.3s",
                      }}
                    >
                      {sent ? "✓ Sent!" : "Send"}
                    </button>
                  </div>
                </div>

                <div>
                  <p
                    style={{
                      fontSize: "10px",
                      fontWeight: "700",
                      letterSpacing: "0.13em",
                      textTransform: "uppercase",
                      color: "#9ca3af",
                      margin: "0 0 12px 0",
                    }}
                  >
                    Follow Us
                  </p>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    {[
                      { name: "LinkedIn", handle: "/oncotraceai" },
                      { name: "Twitter", handle: "@oncotraceai" },
                      { name: "GitHub", handle: "oncotraceai" },
                      { name: "Instagram", handle: "@oncotraceai" },
                    ].map((s) => (
                      <a
                        key={s.name}
                        href="#"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "8px 12px",
                          borderRadius: "8px",
                          background: "#f8faff",
                          border: "1px solid rgba(59,130,246,0.12)",
                          textDecoration: "none",
                          transition: "background 0.2s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = "#e8f0fe")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "#f8faff")
                        }
                      >
                        <span
                          style={{
                            fontSize: "12px",
                            fontWeight: "600",
                            color: "#0f1e50",
                          }}
                        >
                          {s.name}
                        </span>
                        <span style={{ fontSize: "11px", color: "#3b82f6" }}>
                          {s.handle}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ── Divider ── */}
          <div
            style={{
              margin: isMobile ? "0 20px" : "0 44px",
              height: "1px",
              background:
                "linear-gradient(90deg,transparent,rgba(59,130,246,0.26) 30%,rgba(59,130,246,0.26) 70%,transparent)",
            }}
          />

          {/* ── BOTTOM BAR ── */}
          <div style={bottomBarStyle}>
            <div
              style={{
                background: "#f0f6ff",
                border: "1.5px solid rgba(59,130,246,0.2)",
                borderRadius: "8px",
                padding: "6px 22px",
                display: "inline-flex",
                alignItems: "center",
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  fontSize: isMobile ? "17px" : "20px",
                  fontWeight: "900",
                  letterSpacing: "-0.5px",
                  color: "#64748b",
                  userSelect: "none",
                  lineHeight: "1",
                  fontFamily: "'Inter','Helvetica Neue',Arial,sans-serif",
                  whiteSpace: "nowrap",
                }}
              >
                OncoTrace-<span style={{ color: "#3b82f6" }}>AI</span>
              </span>
            </div>
            <p
              style={{
                fontSize: "12px",
                color: "#9ca3af",
                margin: 0,
                flex: isMobile ? "none" : "1 1 180px",
                textAlign: isMobile ? "center" : "left",
              }}
            >
              © 2025 OncoTrace-AI • v2026.04.07 
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
