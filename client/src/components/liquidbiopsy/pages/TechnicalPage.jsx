import Card from "../primitives/Card";
import SectionHeader from "../primitives/SectionHeader";

export default function TechnicalPage({ data }) {
  const { technical_report, meta } = data;

  return (
    <div>
      <Card style={{ padding: "20px", marginBottom: "16px" }}>
        <SectionHeader title="Pipeline & Annotation Versions" accent="var(--lb-status-info)" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "12px" }}>
          {[
            { l: "Parser", v: technical_report.pipeline.parser },
            { l: "Normalization", v: technical_report.pipeline.normalization },
            { l: "Functional Annotator", v: technical_report.pipeline.annotator },
            { l: "ClinVar Join", v: technical_report.pipeline.clinvar_join },
            { l: "CIViC Join", v: technical_report.pipeline.civic_join },
            { l: "SnpEff DB", v: meta.annotation_versions.snpeff_db },
            { l: "ClinVar Release", v: meta.annotation_versions.clinvar_release },
            { l: "CIViC Release", v: meta.annotation_versions.civic_release },
          ].map((item, i) => (
            <div key={i} style={{ padding: "12px", borderRadius: "var(--lb-radius-md)", background: "var(--lb-row-hover)", border: "1px solid var(--lb-border)" }}>
              <p style={{ fontSize: "var(--lb-text-2xs)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--lb-text-muted)", marginBottom: "4px" }}>{item.l}</p>
              <p style={{ fontSize: "var(--lb-text-sm)", fontWeight: 700, color: "var(--lb-text-primary)" }}>{item.v}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card style={{ padding: "20px", marginBottom: "16px" }}>
        <SectionHeader title="VCF Filter Flag Definitions" accent="var(--lb-status-moderate)" />
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "var(--lb-text-sm)", minWidth: "400px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--lb-border)" }}>
                <th style={{ paddingBottom: "10px", paddingRight: "16px", textAlign: "left", fontSize: "var(--lb-text-2xs)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--lb-text-muted)", width: "100px" }}>Filter</th>
                <th style={{ paddingBottom: "10px", textAlign: "left", fontSize: "var(--lb-text-2xs)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--lb-text-muted)" }}>Description</th>
              </tr>
            </thead>
            <tbody>
              {technical_report.filter_definitions.map((r, i) => (
                <tr key={i} style={{ borderBottom: "1px solid var(--lb-border)" }}>
                  <td style={{ padding: "9px 16px 9px 0" }}>
                    <span style={{
                      padding: "2px 8px", borderRadius: "var(--lb-radius-sm)",
                      background: r.flag === "PASS" ? "var(--lb-status-low-bg)" : "var(--lb-status-moderate-bg)",
                      border: `1px solid ${r.flag === "PASS" ? "var(--lb-status-low-border)" : "var(--lb-status-moderate-border)"}`,
                      color: r.flag === "PASS" ? "var(--lb-status-low)" : "var(--lb-status-moderate)",
                      fontSize: "var(--lb-text-xs)", fontWeight: 700,
                    }}>{r.flag}</span>
                  </td>
                  <td style={{ padding: "9px 0", fontSize: "var(--lb-text-sm)", color: "var(--lb-text-secondary)" }}>{r.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card style={{ padding: "20px" }}>
        <SectionHeader title="Key Field Glossary" accent="var(--lb-chart-2)" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "12px" }}>
          {technical_report.field_glossary.map((item, i) => (
            <div key={i} style={{ padding: "12px", borderRadius: "var(--lb-radius-md)", background: "var(--lb-row-hover)", border: "1px solid var(--lb-border)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                <span style={{ padding: "2px 7px", borderRadius: "var(--lb-radius-sm)", background: "var(--lb-status-info-bg)", border: "1px solid var(--lb-status-info-border)", color: "var(--lb-status-info)", fontSize: "var(--lb-text-xs)", fontWeight: 700 }}>{item.field}</span>
                <span style={{ fontSize: "var(--lb-text-xs)", color: "var(--lb-text-secondary)" }}>{item.full_name}</span>
              </div>
              <p style={{ fontSize: "var(--lb-text-xs)", color: "var(--lb-text-secondary)", lineHeight: 1.5 }}>{item.definition}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
