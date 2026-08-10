import { useState } from "react";
import ThemeToggle from "./ThemeToggle";

const UploadIcon = ({ className = "" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24"
    stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);
const FileIcon = ({ className = "" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24"
    stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);
const XIcon = ({ className = "" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24"
    stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 18L18 6M6 6l12 12" />
  </svg>
);
const CheckIcon = ({ className = "" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24"
    stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 13l4 4L19 7" />
  </svg>
);
const ArrowRightIcon = ({ className = "" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24"
    stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
);
const LockIcon = ({ className = "" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24"
    stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);
const LogoIcon = ({ className = "" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24"
    stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
  </svg>
);

function formatSize(bytes) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

const STEPS = [
  {
    num: "01",
    title: "Upload your VCF",
    desc: "Drop your .vcf or .vcf.gz file. Standard variant call formats supported.",
  },
  {
    num: "02",
    title: "Automated Processing",
    desc: "Your file goes through read conditioning, genome alignment, and variant signal extraction.",
  },
  {
    num: "03",
    title: "Receive Your Report",
    desc: "A structured risk report with mutation insights and clinical context — in seconds.",
  },
];

export default function FileUpload({ onAnalyze, loading, theme, toggleTheme }) {
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const isDark = theme === "dark";

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  };
  const handleDragOver = (e) => { e.preventDefault(); setDragOver(true); };
  const handleDragLeave = () => setDragOver(false);
  const clearFile = () => setFile(null);
  const handleSubmit = () => { if (file && !loading) onAnalyze(file); };

  const pageBg      = isDark ? "#07090f" : "#f2f2f7";
  const navBg       = isDark ? "rgba(7,9,15,0.85)"   : "rgba(255,255,255,0.85)";
  const navBorder   = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)";
  const cardBg      = isDark ? "rgba(255,255,255,0.04)" : "#ffffff";
  const cardBorder  = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";
  const textPrimary = isDark ? "#f1f5f9" : "#1d1d1f";
  const textMuted   = isDark ? "#64748b" : "#8e8e93";
  const textSub     = isDark ? "#94a3b8" : "#6e6e73";

  const pillBg      = isDark ? "rgba(59,130,246,0.1)"  : "rgba(239,246,255,1)";
  const pillBorder  = isDark ? "rgba(59,130,246,0.2)"  : "rgba(147,197,253,0.8)";
  const pillColor   = isDark ? "#60a5fa" : "#2563eb";

  const dropBorder  = dragOver
    ? "#60a5fa"
    : file
    ? isDark ? "rgba(129,140,248,0.3)" : "rgba(165,180,252,0.5)"
    : isDark ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.08)";

  const dropBg = dragOver
    ? isDark ? "rgba(59,130,246,0.06)" : "rgba(239,246,255,0.8)"
    : file
    ? isDark ? "rgba(99,102,241,0.04)" : "rgba(238,242,255,0.4)"
    : "transparent";

  const tagBg     = isDark ? "rgba(255,255,255,0.04)" : "#f1f5f9";
  const tagBorder = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)";
  const tagColor  = isDark ? "#64748b" : "#8e8e93";

  const stepNumBg     = isDark ? "rgba(59,130,246,0.1)"  : "rgba(239,246,255,1)";
  const stepNumBorder = isDark ? "rgba(59,130,246,0.15)" : "rgba(191,219,254,0.8)";
  const stepNumColor  = isDark ? "#60a5fa" : "#2563eb";

  const fmtOkBg     = isDark ? "rgba(16,185,129,0.08)" : "rgba(240,253,244,1)";
  const fmtOkColor  = isDark ? "#34d399" : "#059669";
  const fmtOkBorder = isDark ? "rgba(16,185,129,0.15)" : "rgba(167,243,208,0.7)";
  const fmtNoBg     = isDark ? "rgba(255,255,255,0.03)" : "#f8fafc";
  const fmtNoColor  = isDark ? "#475569" : "#94a3b8";
  const fmtNoBorder = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)";

  const secBg     = isDark ? "rgba(16,185,129,0.05)" : "rgba(240,253,244,1)";
  const secBorder = isDark ? "rgba(16,185,129,0.15)" : "rgba(167,243,208,0.7)";
  const secIconBg = isDark ? "rgba(16,185,129,0.1)"  : "rgba(209,250,229,1)";
  const secIconC  = isDark ? "#34d399" : "#059669";
  const secTitle  = isDark ? "#6ee7b7" : "#065f46";
  const secSub    = isDark ? "#065f46" : "#10b981";

  const btnReadyStyle = {
    background: "linear-gradient(135deg,#3b82f6,#6366f1)",
    borderColor: "rgba(99,102,241,0.3)",
    color: "#ffffff",
    cursor: "pointer",
    boxShadow: "0 4px 24px rgba(59,130,246,0.25)",
  };
  const btnDisStyle = {
    background: isDark ? "rgba(255,255,255,0.04)" : "#f1f5f9",
    borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
    color: isDark ? "#334155" : "#cbd5e1",
    cursor: "not-allowed",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: pageBg,
      fontFamily: "'Inter',-apple-system,BlinkMacSystemFont,'SF Pro Display',sans-serif",
      transition: "background 0.5s",
      overflowX: "hidden",
    }}>
      {/* Ambient glow */}
      {isDark && (
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
          <div style={{
            position: "absolute", top: "-160px",
            left: "50%", transform: "translateX(-50%)",
            width: "700px", height: "400px",
            background: "rgba(59,130,246,0.07)",
            borderRadius: "50%", filter: "blur(120px)",
          }} />
        </div>
      )}

      {/* Nav */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        background: navBg,
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderBottom: `1px solid ${navBorder}`,
        transition: "background 0.5s",
      }}>
        <div style={{
          maxWidth: "1024px", margin: "0 auto",
          padding: "0 20px", height: "56px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "28px", height: "28px", borderRadius: "8px",
              background: "linear-gradient(135deg,#3b82f6,#6366f1)",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <LogoIcon className="w-4 h-4 text-white" />
            </div>
            <div>
              <p style={{ fontSize: "14px", fontWeight: 600, color: textPrimary, lineHeight: 1, transition: "color 0.3s" }}>
                OncoTrace
              </p>
              <p style={{ fontSize: "10px", color: textMuted, marginTop: "2px", transition: "color 0.3s" }}>
                Genomic Intelligence
              </p>
            </div>
          </div>
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </div>
      </nav>

      {/* Content */}
      <div style={{ maxWidth: "1024px", margin: "0 auto", padding: "64px 20px" }}>

        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <h1 style={{
            fontSize: "clamp(2rem,5vw,3.5rem)",
            fontWeight: 900, lineHeight: 1.08,
            letterSpacing: "-0.03em",
            color: textPrimary,
            marginBottom: "20px",
            transition: "color 0.3s",
          }}>
            AI Powered
            <span style={{
              display: "block", marginTop: "4px",
              background: "linear-gradient(90deg,#3b82f6,#818cf8)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              Precision Monitoring of Oncology
            </span>
          </h1>

          <p style={{
            fontSize: "clamp(15px,2vw,18px)",
            color: textSub, lineHeight: 1.7,
            maxWidth: "480px", margin: "0 auto",
            fontWeight: 300, transition: "color 0.3s",
          }}>
            Upload your VCF file. Our pipeline extracts variant signals,
            maps them against clinical references, and returns a structured
            cancer risk report in seconds.
          </p>
        </div>

        {/* Two-column grid — fixed layout so right col never crashes */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "24px",
          alignItems: "start",
        }}
          className="lg-two-col"
        >
          {/* Upload card */}
          <div style={{
            background: cardBg,
            border: `1px solid ${cardBorder}`,
            borderRadius: "24px",
            padding: "clamp(24px,4vw,32px)",
            boxShadow: isDark ? "none" : "0 1px 3px rgba(0,0,0,0.06)",
            transition: "background 0.3s, border-color 0.3s",
            minWidth: 0,
          }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
              <div style={{
                width: "36px", height: "36px", borderRadius: "12px",
                background: "linear-gradient(135deg,#3b82f6,#6366f1)",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <UploadIcon className="w-4 h-4 text-white" />
              </div>
              <div>
                <p style={{ fontSize: "14px", fontWeight: 700, color: textPrimary, transition: "color 0.3s" }}>
                  Upload VCF File
                </p>
                <p style={{ fontSize: "11px", color: textMuted, marginTop: "1px", transition: "color 0.3s" }}>
                  Supports .vcf and .vcf.gz formats
                </p>
              </div>
            </div>

            {/* Drop zone — fixed height so it doesn't grow when file selected */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => !file && !loading && document.getElementById("vcf-input").click()}
              style={{
                position: "relative",
                border: `2px dashed ${dropBorder}`,
                borderRadius: "16px",
                background: dropBg,
                padding: "28px 20px",
                textAlign: "center",
                cursor: file ? "default" : "pointer",
                transform: dragOver ? "scale(1.01)" : "scale(1)",
                transition: "all 0.3s",
                minHeight: "140px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <input
                id="vcf-input"
                type="file"
                accept=".vcf,.vcf.gz"
                style={{ display: "none" }}
                onChange={(e) => { if (e.target.files[0]) setFile(e.target.files[0]); }}
              />

              {dragOver && (
                <div style={{
                  position: "absolute", inset: 0, borderRadius: "14px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  pointerEvents: "none",
                }}>
                  <p style={{ color: "#60a5fa", fontSize: "14px", fontWeight: 600 }}>
                    Release to upload
                  </p>
                </div>
              )}

              {file ? (
                <div style={{
                  display: "flex", alignItems: "center", gap: "16px",
                  width: "100%", textAlign: "left",
                }}>
                  <div style={{
                    width: "44px", height: "44px", borderRadius: "14px",
                    background: isDark ? "rgba(99,102,241,0.15)" : "rgba(238,242,255,1)",
                    border: `1px solid ${isDark ? "rgba(129,140,248,0.2)" : "rgba(165,180,252,0.6)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <FileIcon className="w-5 h-5" style={{ color: "#818cf8" }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontSize: "13px", fontWeight: 700, color: textPrimary,
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                      transition: "color 0.3s",
                    }}>
                      {file.name}
                    </p>
                    <p style={{ fontSize: "11px", color: textMuted, marginTop: "2px" }}>
                      {formatSize(file.size)}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "6px" }}>
                      <CheckIcon className="w-3 h-3" style={{ color: "#34d399" }} />
                      <span style={{ fontSize: "11px", fontWeight: 600, color: "#34d399" }}>
                        Ready to analyze
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); clearFile(); }}
                    style={{
                      width: "32px", height: "32px", borderRadius: "10px",
                      border: `1px solid ${tagBorder}`,
                      background: tagBg, color: textMuted,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer", flexShrink: 0, transition: "all 0.2s",
                    }}
                  >
                    <XIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
                  <div style={{ position: "relative" }}>
                    <div style={{
                      width: "56px", height: "56px", borderRadius: "16px",
                      background: tagBg, border: `1px solid ${tagBorder}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <UploadIcon className="w-6 h-6" style={{ color: textMuted }} />
                    </div>
                    <div style={{
                      position: "absolute", top: "-4px", right: "-4px",
                      width: "16px", height: "16px", borderRadius: "50%",
                      background: "#3b82f6", display: "flex",
                      alignItems: "center", justifyContent: "center",
                      boxShadow: "0 2px 8px rgba(59,130,246,0.4)",
                    }}>
                      <span style={{ color: "#fff", fontSize: "9px", fontWeight: 900, lineHeight: 1 }}>+</span>
                    </div>
                  </div>
                  <div>
                    <p style={{ fontSize: "13px", fontWeight: 600, color: textPrimary, marginBottom: "4px" }}>
                      Drop your VCF file here
                    </p>
                    <p style={{ fontSize: "12px", color: textMuted }}>
                      or{" "}
                      <span style={{ color: "#60a5fa", fontWeight: 600, cursor: "pointer" }}>
                        browse files
                      </span>
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: "6px" }}>
                    {[".vcf", ".vcf.gz", "Max 500 MB"].map((t) => (
                      <span key={t} style={{
                        padding: "4px 10px", borderRadius: "8px",
                        border: `1px solid ${tagBorder}`,
                        background: tagBg, color: tagColor,
                        fontSize: "10px", fontWeight: 500,
                      }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Button */}
            <button
              onClick={handleSubmit}
              disabled={loading || !file}
              style={{
                marginTop: "16px", width: "100%",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                padding: "14px 24px", borderRadius: "16px",
                border: "1px solid",
                fontSize: "14px", fontWeight: 600,
                transition: "all 0.3s",
                ...(loading || !file ? btnDisStyle : btnReadyStyle),
              }}
            >
              {loading ? (
                <>
                  <svg style={{ width: "16px", height: "16px" }}
                    className="animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle style={{ opacity: 0.2 }} cx="12" cy="12" r="10"
                      stroke="currentColor" strokeWidth="4" />
                    <path style={{ opacity: 0.8 }} fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  <span>Analyzing…</span>
                </>
              ) : (
                <>
                  <span>Analyze File</span>
                  <ArrowRightIcon className="w-4 h-4" />
                </>
              )}
            </button>

            <p style={{
              textAlign: "center", fontSize: "11px",
              color: textMuted, marginTop: "14px",
            }}>
              Encrypted in transit · Never stored · Research use only
            </p>

            {/* Security */}
            <div style={{
              marginTop: "20px", display: "flex", alignItems: "flex-start", gap: "12px",
              padding: "16px", borderRadius: "16px",
              background: secBg, border: `1px solid ${secBorder}`,
            }}>
              <div style={{
                width: "28px", height: "28px", borderRadius: "8px",
                background: secIconBg, color: secIconC,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <LockIcon className="w-3.5 h-3.5" />
              </div>
              <div>
                <p style={{ fontSize: "12px", fontWeight: 600, color: secTitle }}>
                  Enterprise-Grade Security
                </p>
                <p style={{ fontSize: "11px", color: secSub, marginTop: "2px" }}>
                  256-bit AES encryption · HIPAA Compliant · Zero data retention
                </p>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", minWidth: 0 }}>

            {/* How it works */}
            <div style={{
              background: cardBg, border: `1px solid ${cardBorder}`,
              borderRadius: "24px", padding: "24px",
              boxShadow: isDark ? "none" : "0 1px 3px rgba(0,0,0,0.06)",
              transition: "background 0.3s",
            }}>
              <p style={{
                fontSize: "10px", fontWeight: 900,
                textTransform: "uppercase", letterSpacing: "0.15em",
                color: textMuted, marginBottom: "24px",
              }}>
                How It Works
              </p>
              {STEPS.map((step, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "16px", position: "relative" }}>
                  {i < STEPS.length - 1 && (
                    <div style={{
                      position: "absolute", left: "15px", top: "32px",
                      width: "1px", height: "28px",
                      background: isDark
                        ? "linear-gradient(to bottom,rgba(59,130,246,0.25),transparent)"
                        : "linear-gradient(to bottom,rgba(147,197,253,0.8),transparent)",
                    }} />
                  )}
                  <div style={{
                    width: "32px", height: "32px", borderRadius: "10px",
                    background: stepNumBg, border: `1px solid ${stepNumBorder}`,
                    color: stepNumColor,
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <span style={{ fontSize: "10px", fontWeight: 900 }}>{step.num}</span>
                  </div>
                  <div style={{ paddingBottom: i < STEPS.length - 1 ? "24px" : 0 }}>
                    <p style={{ fontSize: "13px", fontWeight: 700, color: textPrimary, transition: "color 0.3s" }}>
                      {step.title}
                    </p>
                    <p style={{ fontSize: "11px", color: textMuted, marginTop: "2px", lineHeight: 1.6 }}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Formats */}
            <div style={{
              background: cardBg, border: `1px solid ${cardBorder}`,
              borderRadius: "24px", padding: "24px",
              boxShadow: isDark ? "none" : "0 1px 3px rgba(0,0,0,0.06)",
              transition: "background 0.3s",
            }}>
              <p style={{
                fontSize: "10px", fontWeight: 900,
                textTransform: "uppercase", letterSpacing: "0.15em",
                color: textMuted, marginBottom: "16px",
              }}>
                Supported Formats
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                  { fmt: "VCF 4.1 / 4.2 / 4.3",     ok: true },
                  { fmt: "GZIP Compressed (.vcf.gz)", ok: true },
                  { fmt: "Multi-sample VCF",          ok: true },
                  { fmt: "BGZF Compressed",           ok: false },
                ].map((row, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                    <span style={{ fontSize: "12px", fontWeight: 500, color: isDark ? "#cbd5e1" : "#3a3a3c" }}>
                      {row.fmt}
                    </span>
                    <span style={{
                      fontSize: "10px", fontWeight: 700,
                      padding: "4px 10px", borderRadius: "8px", border: "1px solid",
                      flexShrink: 0,
                      background: row.ok ? fmtOkBg : fmtNoBg,
                      color: row.ok ? fmtOkColor : fmtNoColor,
                      borderColor: row.ok ? fmtOkBorder : fmtNoBorder,
                    }}>
                      {row.ok ? "Supported" : "Coming Soon"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inline responsive grid style */}
      <style>{`
        @media (min-width: 1024px) {
          .lg-two-col {
            grid-template-columns: 1fr 340px !important;
          }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}