import { useRef, useState } from "react";
import ThemeToggle from "./ThemeToggle";
import { Icon, LockIcon } from "./icons";
import { ICONS } from "./iconPaths";
import { isMockMode } from "./api";
import TermsModal from "./legal/TermsModal";

function formatSize(bytes) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

const STEPS = [
  { num: "01", title: "Upload your VCF", desc: "Drop your .vcf or .vcf.gz file. Standard variant call formats supported." },
  { num: "02", title: "Parsing & Annotation", desc: "Your file's variant calls are parsed and annotated against reference databases — no realignment or re-calling happens here." },
  { num: "03", title: "Structured Summary", desc: "A structured variant report with QC metrics and general reference context, usually ready within a minute or two." },
];

export default function FileUpload({ onAnalyze, theme, toggleTheme, onBack }) {
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const termsLinkRef = useRef(null);
  // Most VCFs (including VarDict output) don't state their reference build in the
  // header, and the analysis service refuses to guess — a wrong build silently
  // invalidates every coordinate-based annotation. So it's asked for up front.
  const [referenceBuild, setReferenceBuild] = useState("");

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  };
  const handleDragOver = (e) => { e.preventDefault(); setDragOver(true); };
  const handleDragLeave = () => setDragOver(false);
  const clearFile = () => setFile(null);
  const openPicker = () => document.getElementById("vcf-input").click();
  const handleDropzoneKeyDown = (e) => {
    if (file) return;
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openPicker(); }
  };
  const canSubmit = Boolean(file) && (isMockMode || Boolean(referenceBuild));
  const handleSubmit = () => { if (canSubmit) onAnalyze(file, referenceBuild || undefined); };

  const dropBorder = dragOver
    ? "var(--lb-status-info)"
    : file ? "var(--lb-status-info-border)" : "var(--lb-border-strong)";
  const dropBg = dragOver ? "var(--lb-status-info-bg)" : file ? "var(--lb-row-hover)" : "transparent";

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--lb-bg-page)",
      fontFamily: "var(--lb-font-body)",
      transition: "background 0.5s",
      overflowX: "hidden",
    }}>
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "var(--lb-bg-surface-raised)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
        borderBottom: "1px solid var(--lb-border)",
      }}>
        <div style={{ maxWidth: "1024px", margin: "0 auto", padding: "0 20px", height: "56px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {onBack && (
              <button onClick={onBack} title="Back to site" aria-label="Back to site" data-lb-btn="utility" style={{
                width: "32px", height: "32px", borderRadius: "var(--lb-radius-md)", border: "1px solid var(--lb-border)",
                background: "var(--lb-input-bg)", display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", flexShrink: 0,
              }}>
                <Icon d={ICONS.back} size={16} style={{ color: "var(--lb-text-secondary)" }} />
              </button>
            )}
            <div style={{ width: "28px", height: "28px", borderRadius: "var(--lb-radius-sm)", background: "var(--lb-brand)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <img src="/ribbon-logo.webp" alt="" style={{ width: 22, height: 22, objectFit: "contain" }} />
            </div>
            <div>
              <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--lb-text-primary)", lineHeight: 1 }}>OncoTrace-AI</p>
              <p style={{ fontSize: "10px", color: "var(--lb-text-muted)", marginTop: "2px" }}>Genomic Intelligence</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {isMockMode && (
              <span title="No analysis backend is connected — responses come from a local mock." style={{
                fontSize: "10px", fontWeight: 700, padding: "4px 9px", borderRadius: "var(--lb-radius-sm)",
                background: "var(--lb-status-moderate-bg)", border: "1px solid var(--lb-status-moderate-border)", color: "var(--lb-status-moderate)",
              }}>
                Demo mode
              </span>
            )}
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: "1024px", margin: "0 auto", padding: "64px 20px" }}>
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <h1 style={{ fontSize: "var(--lb-text-2xl)", fontFamily: "var(--lb-font-display)", fontWeight: 700, lineHeight: 1.15, letterSpacing: "-0.01em", color: "var(--lb-text-primary)", marginBottom: "16px" }}>
            Upload a VCF. Get a Structured Variant Report.
          </h1>
          <p style={{ fontSize: "clamp(15px,2vw,18px)", color: "var(--lb-text-secondary)", lineHeight: 1.7, maxWidth: "480px", margin: "0 auto", fontWeight: 300 }}>
            Our pipeline parses variant calls and annotates them against reference databases, then returns a structured summary — built for research and pilot review, not clinical diagnosis.
          </p>
        </div>

        {/* Open, flowing layout -- no outer card wrapping either column. Only
            the pieces that are genuinely functional surfaces (the dropzone,
            the select, the button, the status callouts) keep a boundary; the
            two columns are separated by a divider rather than two floating
            boxes. */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "40px", alignItems: "start" }} className="lb-lg-two-col">
          <div style={{ minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "var(--lb-radius-md)", background: "var(--lb-brand)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon d={ICONS.upload} size={16} style={{ color: "#fff" }} />
              </div>
              <div>
                <p style={{ fontSize: "14px", fontWeight: 700, color: "var(--lb-text-primary)" }}>Upload VCF File</p>
                <p style={{ fontSize: "11px", color: "var(--lb-text-muted)", marginTop: "1px" }}>Supports .vcf and .vcf.gz formats</p>
              </div>
            </div>

            <label htmlFor="vcf-input" style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(0 0 0 0)" }}>
              Upload VCF file
            </label>
            <div
              onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}
              onClick={() => !file && openPicker()}
              role={file ? undefined : "button"}
              tabIndex={file ? undefined : 0}
              onKeyDown={handleDropzoneKeyDown}
              aria-label={file ? undefined : "Drop your VCF file here, or activate to browse files"}
              style={{
                position: "relative", border: `2px dashed ${dropBorder}`, borderRadius: "var(--lb-radius-md)",
                background: dropBg, padding: "28px 20px", textAlign: "center",
                cursor: file ? "default" : "pointer", transform: dragOver ? "scale(1.01)" : "scale(1)",
                transition: "all 0.3s", minHeight: "140px", display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <input id="vcf-input" type="file" accept=".vcf,.vcf.gz" style={{ display: "none" }}
                onChange={(e) => { if (e.target.files[0]) setFile(e.target.files[0]); }} />

              {dragOver && (
                <div style={{ position: "absolute", inset: 0, borderRadius: "var(--lb-radius-md)", display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                  <p style={{ color: "var(--lb-status-info)", fontSize: "14px", fontWeight: 600 }}>Release to upload</p>
                </div>
              )}

              {file ? (
                <div style={{ display: "flex", alignItems: "center", gap: "16px", width: "100%", textAlign: "left" }}>
                  <div style={{ width: "44px", height: "44px", borderRadius: "var(--lb-radius-md)", background: "var(--lb-status-info-bg)", border: "1px solid var(--lb-status-info-border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon d={ICONS.file} size={20} style={{ color: "var(--lb-status-info)" }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--lb-text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</p>
                    <p style={{ fontSize: "11px", color: "var(--lb-text-muted)", marginTop: "2px" }}>{formatSize(file.size)}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "6px" }}>
                      <Icon d={ICONS.check} size={12} style={{ color: "var(--lb-status-low)" }} strokeWidth={2.5} />
                      <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--lb-status-low)" }}>Ready to analyze</span>
                    </div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); clearFile(); }} aria-label="Remove selected file" data-lb-btn="utility" style={{
                    width: "32px", height: "32px", borderRadius: "var(--lb-radius-md)", border: "1px solid var(--lb-border)",
                    background: "var(--lb-input-bg)", color: "var(--lb-text-muted)", display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", flexShrink: 0,
                  }}>
                    <Icon d={ICONS.close} size={14} style={{ color: "var(--lb-text-muted)" }} strokeWidth={2} />
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
                  <div style={{ position: "relative" }}>
                    <div style={{ width: "56px", height: "56px", borderRadius: "var(--lb-radius-md)", background: "var(--lb-input-bg)", border: "1px solid var(--lb-border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon d={ICONS.download} size={24} style={{ color: "var(--lb-text-muted)" }} />
                    </div>
                    <div style={{ position: "absolute", top: "-4px", right: "-4px", width: "16px", height: "16px", borderRadius: "50%", background: "var(--lb-status-info)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ color: "#fff", fontSize: "9px", fontWeight: 900, lineHeight: 1 }}>+</span>
                    </div>
                  </div>
                  <div>
                    <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--lb-text-primary)", marginBottom: "4px" }}>Drop your VCF file here</p>
                    <p style={{ fontSize: "12px", color: "var(--lb-text-muted)" }}>
                      or <span style={{ color: "var(--lb-status-info)", fontWeight: 600, cursor: "pointer" }}>browse files</span>
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: "6px" }}>
                    {[".vcf", ".vcf.gz", "Max 500 MB"].map((t) => (
                      <span key={t} style={{ padding: "4px 10px", borderRadius: "var(--lb-radius-sm)", border: "1px solid var(--lb-border)", background: "var(--lb-input-bg)", color: "var(--lb-text-secondary)", fontSize: "10px", fontWeight: 500 }}>{t}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {!isMockMode && (
              <div style={{ marginTop: "16px" }}>
                <label htmlFor="ref-build" style={{
                  display: "block", fontSize: "var(--lb-text-2xs)", fontWeight: 900, textTransform: "uppercase",
                  letterSpacing: "0.12em", color: "var(--lb-text-muted)", marginBottom: "6px",
                }}>
                  Reference genome build (required)
                </label>
                <select
                  id="ref-build"
                  value={referenceBuild}
                  onChange={(e) => setReferenceBuild(e.target.value)}
                  style={{
                    width: "100%", padding: "11px 12px", borderRadius: "var(--lb-radius-md)",
                    border: `1px solid ${referenceBuild ? "var(--lb-border)" : "var(--lb-status-moderate-border)"}`,
                    background: "var(--lb-input-bg)", color: "var(--lb-text-primary)",
                    fontSize: "var(--lb-text-base)",
                  }}
                >
                  <option value="">Select the build this file was aligned to…</option>
                  <option value="GRCh38">GRCh38 / hg38</option>
                  <option value="GRCh37">GRCh37 / hg19</option>
                </select>
                <p style={{ fontSize: "var(--lb-text-2xs)", color: "var(--lb-text-muted)", marginTop: "6px", lineHeight: 1.5 }}>
                  Most VCFs don't record this, and we won't guess — the wrong build would invalidate every
                  coordinate-based annotation. Confirm it with whoever ran the sequencing pipeline.
                </p>
              </div>
            )}

            <button onClick={handleSubmit} disabled={!canSubmit} data-lb-btn="primary" style={{
              marginTop: "16px", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
              padding: "14px 24px", borderRadius: "var(--lb-radius-md)", border: "1px solid", fontSize: "14px", fontWeight: 700, transition: "background 0.2s, opacity 0.2s",
              ...(canSubmit
                ? { background: "var(--lb-brand)", borderColor: "transparent", color: "#fff", cursor: "pointer" }
                : { background: "var(--lb-input-bg)", borderColor: "var(--lb-border)", color: "var(--lb-text-muted)", cursor: "not-allowed" }),
            }}>
              <span>Get Your Report</span>
              <Icon d={ICONS.arrowRight} size={16} style={{ color: canSubmit ? "#fff" : "var(--lb-text-muted)" }} />
            </button>

            <div style={{
              marginTop: "16px", display: "flex", alignItems: "flex-start", gap: "10px", padding: "12px 14px",
              borderRadius: "var(--lb-radius-md)", background: "var(--lb-status-moderate-bg)", border: "1px solid var(--lb-status-moderate-border)",
            }}>
              <Icon d={ICONS.alert} size={14} style={{ color: "var(--lb-status-moderate)", flexShrink: 0, marginTop: "1px" }} />
              <p style={{ fontSize: "11.5px", fontWeight: 600, color: "var(--lb-status-moderate)", lineHeight: 1.6 }}>
                For research and pilot use only. Not intended for clinical diagnosis and not a substitute for
                clinical-grade testing technologies. Encrypted in transit.{" "}
                <button
                  ref={termsLinkRef}
                  onClick={() => setTermsOpen(true)}
                  style={{
                    background: "none", border: "none", padding: 0, margin: 0, cursor: "pointer",
                    font: "inherit", fontWeight: 700, color: "var(--lb-status-moderate)", textDecoration: "underline",
                  }}
                >
                  View Terms &amp; Data Use
                </button>
              </p>
            </div>

            <div style={{
              marginTop: "20px", display: "flex", alignItems: "flex-start", gap: "12px", padding: "16px", borderRadius: "var(--lb-radius-md)",
              background: "var(--lb-status-low-bg)", border: "1px solid var(--lb-status-low-border)",
            }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "var(--lb-radius-sm)", background: "color-mix(in srgb, var(--lb-status-low) 16%, transparent)", color: "var(--lb-status-low)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <LockIcon size={14} />
              </div>
              <div>
                <p style={{ fontSize: "12px", fontWeight: 600, color: "var(--lb-status-low)" }}>How your file is handled</p>
                <p style={{ fontSize: "11px", color: "var(--lb-text-secondary)", marginTop: "2px", lineHeight: 1.5 }}>
                  Processed by our own self-hosted analysis service (not sent to third-party APIs) · not persisted after analysis · not a substitute for clinical-grade compliance certification
                </p>
              </div>
            </div>
          </div>

          <div className="lb-steps-col" style={{ display: "flex", flexDirection: "column", gap: "16px", minWidth: 0, paddingTop: "2px" }}>
            <p style={{ fontSize: "10px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--lb-text-muted)", marginBottom: "8px" }}>How It Works</p>
            {STEPS.map((step, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "16px", position: "relative" }}>
                {i < STEPS.length - 1 && (
                  <div style={{ position: "absolute", left: "15px", top: "32px", width: "1px", height: "28px", background: "linear-gradient(to bottom, var(--lb-border-strong), transparent)" }} />
                )}
                <div style={{ width: "32px", height: "32px", borderRadius: "var(--lb-radius-md)", background: "var(--lb-status-info-bg)", border: "1px solid var(--lb-status-info-border)", color: "var(--lb-status-info)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: "10px", fontWeight: 900 }}>{step.num}</span>
                </div>
                <div style={{ paddingBottom: i < STEPS.length - 1 ? "24px" : 0 }}>
                  <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--lb-text-primary)" }}>{step.title}</p>
                  <p style={{ fontSize: "11px", color: "var(--lb-text-muted)", marginTop: "2px", lineHeight: 1.6 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <TermsModal open={termsOpen} onClose={() => setTermsOpen(false)} triggerRef={termsLinkRef} />

      <style>{`
        @media (min-width: 1024px) {
          .lb-lg-two-col { grid-template-columns: 1fr 300px !important; }
          .lb-steps-col { border-left: 1px solid var(--lb-border); padding-left: 32px !important; }
        }
      `}</style>
    </div>
  );
}
