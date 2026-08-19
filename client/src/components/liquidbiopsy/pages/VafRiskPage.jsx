import Card from "../primitives/Card";
import SectionHeader from "../primitives/SectionHeader";
import Badge from "../primitives/Badge";
import VAFGeneChart from "../charts/VAFGeneChart";
import { vafColor, filterPassColor } from "../colors";

const VAF_GUIDE = [
  { range: "0–10%", interp: "Low fraction — sequencing noise or low-fraction sample", color: "var(--lb-chart-2)" },
  { range: "10–20%", interp: "Sub-clonal somatic", color: "var(--lb-status-info)" },
  { range: "20–50%", interp: "Heterozygous somatic (typical range)", color: "var(--lb-status-moderate)", ideal: true },
  { range: "50–70%", interp: "High variant burden at this locus / possible LOH", color: "var(--lb-status-moderate)" },
  { range: "70–90%", interp: "Near-homozygous; clonal dominance at this locus", color: "var(--lb-status-high)" },
  { range: "90–100%", interp: "Homozygous / complete loss of heterozygosity", color: "var(--lb-status-high)" },
];

export default function VafRiskPage({ data, theme }) {
  const { gene_summary, variants } = data;
  const highVaf = variants.filter((v) => v.vaf >= 0.7).sort((a, b) => b.vaf - a.vaf);
  const maxDepth = Math.max(...variants.map((v) => v.depth));
  const vafPerGene = gene_summary.map((g) => ({ gene: g.gene, max_vaf: g.max_vaf })).sort((a, b) => b.max_vaf - a.max_vaf);
  const topHigh = vafPerGene.filter((g) => g.max_vaf >= 0.7).map((g) => `${g.gene} ${(g.max_vaf * 100).toFixed(1)}%`).join(", ");
  const topLow = gene_summary.filter((g) => g.max_vaf < 0.05).map((g) => g.gene).join(", ") || "none in this file";

  return (
    <div>
      <Card style={{ padding: "20px", marginBottom: "16px" }}>
        <SectionHeader
          title="Variant Allele Frequency per Gene (Max VAF, High → Low)"
          accent="var(--lb-status-high)"
          right={
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {[{ l: "Low (<20%)", c: "var(--lb-status-low)" }, { l: "Moderate (20–50%)", c: "var(--lb-status-moderate)" }, { l: "High (>50%)", c: "var(--lb-status-high)" }].map((r, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "2px", background: r.c }} />
                  <span style={{ fontSize: "var(--lb-text-2xs)", color: "var(--lb-text-secondary)" }}>{r.l}</span>
                </div>
              ))}
            </div>
          }
        />
        <VAFGeneChart data={vafPerGene} theme={theme} />
        <div style={{ marginTop: "12px", display: "flex", flexWrap: "wrap", gap: "12px" }}>
          {topHigh && (
            <div style={{ padding: "10px 14px", borderRadius: "var(--lb-radius-md)", background: "var(--lb-status-high-bg)", border: "1px solid var(--lb-status-high-border)" }}>
              <p style={{ fontSize: "var(--lb-text-2xs)", color: "var(--lb-status-high)", fontWeight: 600 }}>
                General reference: VAF &gt;70% ({topHigh}) typically indicates clonal dominance or loss of heterozygosity at that locus
              </p>
            </div>
          )}
          <div style={{ padding: "10px 14px", borderRadius: "var(--lb-radius-md)", background: "var(--lb-status-low-bg)", border: "1px solid var(--lb-status-low-border)" }}>
            <p style={{ fontSize: "var(--lb-text-2xs)", color: "var(--lb-status-low)", fontWeight: 600 }}>
              General reference: VAF &lt;5% ({topLow}) typically indicates low-fraction or sub-clonal variants
            </p>
          </div>
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "16px", marginBottom: "16px" }}>
        <Card style={{ padding: "20px" }}>
          <SectionHeader title="VAF Interpretation Guide" accent="var(--lb-status-info)" />
          {VAF_GUIDE.map((r, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px",
              padding: "8px 10px", borderRadius: "var(--lb-radius-sm)",
              background: r.ideal ? "var(--lb-status-low-bg)" : "transparent",
              border: r.ideal ? "1px solid var(--lb-status-low-border)" : "1px solid transparent",
            }}>
              <span style={{ width: "44px", fontSize: "var(--lb-text-2xs)", fontWeight: 700, color: r.color, flexShrink: 0 }}>{r.range}</span>
              <span style={{ fontSize: "var(--lb-text-xs)", color: "var(--lb-text-secondary)" }}>{r.interp}</span>
              {r.ideal && <span style={{ fontSize: "var(--lb-text-2xs)", color: "var(--lb-status-low)", fontWeight: 700, marginLeft: "auto" }}>Typical somatic</span>}
            </div>
          ))}
        </Card>

        <Card style={{ padding: "20px" }}>
          <SectionHeader title="High-VAF Variants" accent="var(--lb-status-high)" />
          <p style={{ fontSize: "var(--lb-text-xs)", color: "var(--lb-text-secondary)", marginBottom: "12px" }}>Variants with VAF ≥ 70%, highest first</p>
          {highVaf.length === 0 && <p style={{ fontSize: "var(--lb-text-xs)", color: "var(--lb-text-muted)" }}>None in this file.</p>}
          {highVaf.map((v, i) => {
            const isPass = v.filter.length === 1 && v.filter[0] === "PASS";
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px", padding: "10px", borderRadius: "var(--lb-radius-md)", background: "var(--lb-row-hover)", border: "1px solid var(--lb-border)" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "var(--lb-text-sm)", fontWeight: 900, color: "var(--lb-status-info)" }}>{v.gene}</span>
                    <Badge label={v.type} color="var(--lb-chart-2)" small />
                    <Badge label={v.filter.join(";")} color={filterPassColor(isPass)} small />
                  </div>
                  <p style={{ fontSize: "var(--lb-text-2xs)", color: "var(--lb-text-muted)" }}>chr{v.chrom}:{v.pos.toLocaleString()} · Depth: {v.depth}×</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: "18px", fontWeight: 900, color: vafColor(v.vaf), lineHeight: 1 }}>{(v.vaf * 100).toFixed(1)}%</p>
                  <p style={{ fontSize: "9px", color: "var(--lb-text-muted)" }}>VAF</p>
                </div>
              </div>
            );
          })}
        </Card>

        <Card style={{ padding: "20px" }}>
          <SectionHeader title="Depth vs VAF" accent="var(--lb-chart-2)" />
          <p style={{ fontSize: "var(--lb-text-xs)", color: "var(--lb-text-secondary)", marginBottom: "12px" }}>Bubble size = read depth. High depth + moderate VAF (20–50%) are generally the most reliable calls.</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {variants.map((v, i) => (
              <div key={i} title={`${v.gene}: VAF=${(v.vaf * 100).toFixed(1)}%, Depth=${v.depth}×`} style={{ display: "inline-flex" }}>
                <div style={{
                  width: `${Math.max(8, (v.depth / maxDepth) * 24)}px`,
                  height: `${Math.max(8, (v.depth / maxDepth) * 24)}px`,
                  borderRadius: "50%",
                  background: vafColor(v.vaf),
                  opacity: 0.75,
                  cursor: "pointer",
                }} />
              </div>
            ))}
          </div>
          <p style={{ fontSize: "var(--lb-text-2xs)", color: "var(--lb-text-muted)", marginTop: "10px" }}>Hover a bubble for its gene, VAF, and depth.</p>
        </Card>
      </div>
    </div>
  );
}
