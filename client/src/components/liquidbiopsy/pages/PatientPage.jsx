import Card from "../primitives/Card";
import SectionHeader from "../primitives/SectionHeader";
import { Icon } from "../icons";
import { ICONS } from "../iconPaths";

export default function PatientPage({ data }) {
  const { patient_summary, meta } = data;

  return (
    <div>
      <div style={{ padding: "24px", borderRadius: "var(--lb-radius-lg)", marginBottom: "16px", background: "var(--lb-status-info-bg)", border: "1px solid var(--lb-status-info-border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "var(--lb-radius-md)", background: "var(--lb-accent-gradient)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Icon d={ICONS.user} size={20} style={{ color: "#fff" }} />
          </div>
          <div>
            <p style={{ fontSize: "16px", fontWeight: 900, color: "var(--lb-text-primary)" }}>Plain-Language View (Pilot / Demo)</p>
            <p style={{ fontSize: "var(--lb-text-xs)", color: "var(--lb-text-secondary)" }}>How findings could be translated for patient communication</p>
          </div>
        </div>
        <p style={{ fontSize: "var(--lb-text-sm)", color: "var(--lb-text-secondary)", lineHeight: 1.7 }}>
          This page shows what a plain-language version of a genomic report <strong style={{ color: "var(--lb-text-primary)" }}>could</strong> look like — it is illustrative for this pilot, not a finished patient-facing report for a specific case. Any real use requires review and sign-off by a treating clinician or genetic counselor.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: "12px", marginBottom: "16px" }}>
        {[
          { icon: "dna", label: "Genes Tested", value: patient_summary.genes_tested, desc: "Different gene regions analyzed", color: "var(--lb-status-info)" },
          { icon: "alert", label: "Notable Findings", value: patient_summary.genes_with_findings, desc: "Genes with a variant at ≥20% VAF", color: "var(--lb-status-moderate)" },
          { icon: "pill", label: "Genes with Literature Evidence", value: patient_summary.genes_with_variant_level_evidence + (data.actionability_summary?.genes.length || 0), desc: "General associations, not confirmed variant-specific matches", color: "var(--lb-status-low)" },
        ].map((k, i) => (
          <Card key={i} style={{ padding: "20px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "var(--lb-radius-md)", marginBottom: "12px", background: `color-mix(in srgb, ${k.color} 16%, transparent)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon d={ICONS[k.icon] || ICONS.dna} size={18} style={{ color: k.color }} />
            </div>
            <p style={{ fontSize: "28px", fontWeight: 900, color: k.color, lineHeight: 1 }}>{k.value}</p>
            <p style={{ fontSize: "var(--lb-text-sm)", fontWeight: 700, color: "var(--lb-text-primary)", marginTop: "8px" }}>{k.label}</p>
            <p style={{ fontSize: "var(--lb-text-xs)", color: "var(--lb-text-secondary)", marginTop: "4px", lineHeight: 1.4 }}>{k.desc}</p>
          </Card>
        ))}
      </div>

      <Card style={{ padding: "20px", marginBottom: "16px" }}>
        <SectionHeader title="Key Gene Findings, Explained" accent="var(--lb-status-info)" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "12px" }}>
          {patient_summary.gene_cards.map((g, i) => (
            <div key={i} style={{ padding: "16px", borderRadius: "var(--lb-radius-lg)", background: "var(--lb-row-hover)", border: "1px solid var(--lb-border)", borderLeft: "4px solid var(--lb-status-info)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "14px", fontWeight: 900, color: "var(--lb-text-primary)" }}>{g.gene}</span>
                {g.plain_name && <span style={{ fontSize: "var(--lb-text-2xs)", color: "var(--lb-text-secondary)" }}>— {g.plain_name}</span>}
              </div>
              <div style={{ marginBottom: "8px" }}>
                <p style={{ fontSize: "var(--lb-text-2xs)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--lb-status-info)", marginBottom: "3px" }}>What We Found</p>
                <p style={{ fontSize: "var(--lb-text-sm)", color: "var(--lb-text-primary)", lineHeight: 1.5 }}>{g.finding}</p>
              </div>
              <div style={{ marginBottom: "8px" }}>
                <p style={{ fontSize: "var(--lb-text-2xs)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--lb-status-low)", marginBottom: "3px" }}>Why It Matters</p>
                <p style={{ fontSize: "var(--lb-text-sm)", color: "var(--lb-text-secondary)", lineHeight: 1.5 }}>{g.why}</p>
              </div>
              <div style={{ padding: "8px 10px", borderRadius: "var(--lb-radius-sm)", background: "var(--lb-status-info-bg)", border: "1px solid var(--lb-status-info-border)" }}>
                <p style={{ fontSize: "var(--lb-text-xs)", fontWeight: 700, color: "var(--lb-status-info)" }}>→ {g.action}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card style={{ padding: "20px", marginBottom: "16px" }}>
        <SectionHeader title="Typical Next Steps (Illustrative)" accent="var(--lb-status-low)" />
        <p style={{ fontSize: "var(--lb-text-xs)", color: "var(--lb-text-muted)", marginBottom: "16px" }}>
          Generic steps in a real clinical workflow — not generated from this specific file.
        </p>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {patient_summary.next_steps.map((step, i) => (
            <div key={i} style={{ display: "flex", gap: "16px", paddingBottom: i < patient_summary.next_steps.length - 1 ? "20px" : 0 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--lb-accent-gradient)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: "12px", fontWeight: 900, color: "#fff" }}>{i + 1}</span>
                </div>
                {i < patient_summary.next_steps.length - 1 && <div style={{ width: "2px", flex: 1, background: "var(--lb-border)", marginTop: "4px" }} />}
              </div>
              <div style={{ paddingTop: "6px" }}>
                <p style={{ fontSize: "var(--lb-text-sm)", color: "var(--lb-text-primary)", lineHeight: 1.6, fontWeight: 500 }}>{step}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div style={{ padding: "20px", borderRadius: "var(--lb-radius-lg)", background: "var(--lb-status-moderate-bg)", border: "1px solid var(--lb-status-moderate-border)", display: "flex", alignItems: "flex-start", gap: "14px" }}>
        <div style={{ width: "36px", height: "36px", borderRadius: "var(--lb-radius-md)", flexShrink: 0, background: "color-mix(in srgb, var(--lb-status-moderate) 16%, transparent)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--lb-status-moderate)" }}>
          <Icon d={ICONS.alert} size={16} />
        </div>
        <div>
          <p style={{ fontSize: "var(--lb-text-2xs)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--lb-status-moderate)", marginBottom: "6px" }}>Important Notice</p>
          <p style={{ fontSize: "var(--lb-text-sm)", fontWeight: 600, lineHeight: 1.7, color: "var(--lb-text-primary)" }}>
            {meta.disclaimer} This page must be discussed with a treating physician or genetic counselor before any decision is based on it.
          </p>
        </div>
      </div>
    </div>
  );
}
