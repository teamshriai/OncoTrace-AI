import Card from "../primitives/Card";
import SectionHeader from "../primitives/SectionHeader";
import StatRow from "../primitives/StatRow";
import ProgressBar from "../primitives/ProgressBar";
import BarChart from "../charts/BarChart";
import { depthColor, mqColor, msiColor } from "../colors";

export default function QualityPage({ data }) {
  const { qc_summary, variants } = data;

  const kpis = [
    { label: "Mean Depth", value: `${qc_summary.depth.mean}×`, color: "var(--lb-status-info)", ideal: "≥500×" },
    { label: "Max Depth", value: `${qc_summary.depth.max.toLocaleString()}×`, color: "var(--lb-status-low)" },
    { label: "Min Depth", value: `${qc_summary.depth.min}×`, color: "var(--lb-status-moderate)", ideal: "≥100×" },
    { label: "Mean Map Quality", value: qc_summary.mapping_quality.mean, color: "var(--lb-status-info)", ideal: "≥30 (ideal 60)" },
    { label: "Pass Filter", value: `${qc_summary.pass_count}/${qc_summary.total_records}`, color: "var(--lb-status-low)", sub: `${Math.round(qc_summary.pass_rate * 100)}%` },
    { label: "Non-Pass", value: `${qc_summary.non_pass_count}/${qc_summary.total_records}`, color: "var(--lb-status-moderate)" },
  ];

  const depthData = variants.slice(0, 20).map((v) => ({ label: v.gene, count: v.depth, color: depthColor(v.depth) }));
  const mqData = variants.slice(0, 20).map((v) => ({ label: v.gene, count: v.mq, color: mqColor(v.mq) }));
  const strandBiasCandidates = variants.filter((v) => v.sbf > 0).sort((a, b) => b.oddratio - a.oddratio).slice(0, 8);
  const msiCandidates = variants.filter((v) => v.msi > 0).sort((a, b) => b.msi - a.msi).slice(0, 10);

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: "12px", marginBottom: "16px" }}>
        {kpis.map((k, i) => (
          <Card key={i} style={{ padding: "16px" }}>
            <p style={{ fontSize: "22px", fontWeight: 900, color: k.color, lineHeight: 1 }}>{k.value}</p>
            <p style={{ fontSize: "var(--lb-text-xs)", fontWeight: 600, color: "var(--lb-text-secondary)", marginTop: "6px" }}>{k.label}</p>
            {k.ideal && <p style={{ fontSize: "var(--lb-text-2xs)", color: "var(--lb-text-muted)", marginTop: "3px" }}>Ideal: {k.ideal}</p>}
            {k.sub && <p style={{ fontSize: "var(--lb-text-2xs)", color: "var(--lb-text-muted)", marginTop: "3px" }}>{k.sub}</p>}
          </Card>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "16px", marginBottom: "16px" }}>
        <Card style={{ padding: "20px" }}>
          <SectionHeader title="Sequencing Depth per Variant (first 20)" accent="var(--lb-status-info)" />
          <BarChart data={depthData} xKey="label" yKey="count" colorKey="color" height={160} />
          <div style={{ marginTop: "12px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {[{ l: "≥500× (excellent)", c: "var(--lb-status-low)" }, { l: "100–500× (adequate)", c: "var(--lb-status-moderate)" }, { l: "<100× (low)", c: "var(--lb-status-high)" }].map((r, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "2px", background: r.c }} />
                <span style={{ fontSize: "var(--lb-text-2xs)", color: "var(--lb-text-secondary)" }}>{r.l}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card style={{ padding: "20px" }}>
          <SectionHeader title="Mapping Quality (MQ) per Variant (first 20)" accent="var(--lb-status-low)" />
          <BarChart data={mqData} xKey="label" yKey="count" colorKey="color" height={160} />
          <div style={{ marginTop: "8px", padding: "10px", borderRadius: "var(--lb-radius-md)", background: "var(--lb-row-hover)", border: "1px solid var(--lb-border)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "8px" }}>
              {[{ l: "MQ = 60", d: "Perfectly unique mapping", c: "var(--lb-status-low)" }, { l: "MQ ≥ 30", d: "Acceptable", c: "var(--lb-status-moderate)" }, { l: "MQ < 30", d: "Poor, artefact risk", c: "var(--lb-status-high)" }].map((r, i) => (
                <div key={i}>
                  <p style={{ fontSize: "var(--lb-text-xs)", fontWeight: 700, color: r.c }}>{r.l}</p>
                  <p style={{ fontSize: "var(--lb-text-2xs)", color: "var(--lb-text-muted)" }}>{r.d}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <Card style={{ padding: "20px", marginBottom: "16px" }}>
        <SectionHeader title="Filter Flags Summary" accent="var(--lb-status-moderate)" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "12px" }}>
          {qc_summary.filter_flag_counts.map((f, i) => {
            const color = f.flag === "PASS" ? "var(--lb-status-low)" : "var(--lb-status-moderate)";
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", borderRadius: "var(--lb-radius-md)", background: "var(--lb-row-hover)", border: `1px solid ${color}` }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "var(--lb-radius-md)", flexShrink: 0, background: `color-mix(in srgb, ${color} 16%, transparent)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: "18px", fontWeight: 900, color }}>{f.count}</span>
                </div>
                <div>
                  <p style={{ fontSize: "var(--lb-text-sm)", fontWeight: 900, color: "var(--lb-text-primary)" }}>{f.flag}</p>
                  <p style={{ fontSize: "var(--lb-text-xs)", color: "var(--lb-text-secondary)", lineHeight: 1.4 }}>{f.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "16px", marginBottom: "16px" }}>
        <Card style={{ padding: "20px" }}>
          <SectionHeader title="Strand Bias (SBF) Analysis" accent="var(--lb-chart-4)" />
          <p style={{ fontSize: "var(--lb-text-xs)", color: "var(--lb-text-secondary)", marginBottom: "12px", lineHeight: 1.5 }}>
            Strand Bias Fisher p-value: low p-value indicates potential strand bias artefact. Variants with SBF &lt;0.05 AND Odds Ratio &gt;5 are flagged.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {strandBiasCandidates.map((v, i) => {
              const flagged = v.sbf < 0.05 && v.oddratio > 5;
              return (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: "10px", padding: "8px 10px", borderRadius: "var(--lb-radius-sm)",
                  background: flagged ? "var(--lb-status-high-bg)" : "var(--lb-row-hover)",
                  border: `1px solid ${flagged ? "var(--lb-status-high-border)" : "var(--lb-border)"}`,
                }}>
                  <span style={{ fontWeight: 900, color: "var(--lb-status-info)", fontSize: "var(--lb-text-sm)", width: "60px", flexShrink: 0 }}>{v.gene}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                      <span style={{ fontSize: "var(--lb-text-2xs)", color: "var(--lb-text-muted)" }}>SBF: {v.sbf}</span>
                      <span style={{ fontSize: "var(--lb-text-2xs)", color: "var(--lb-text-muted)" }}>OR: {v.oddratio.toFixed(2)}</span>
                    </div>
                    <ProgressBar value={Math.min(v.oddratio, 20)} max={20} color={flagged ? "var(--lb-status-high)" : "var(--lb-status-low)"} height={4} />
                  </div>
                  {flagged && <span style={{ fontSize: "9px", color: "var(--lb-status-high)", fontWeight: 700, flexShrink: 0 }}>⚠ BIAS</span>}
                </div>
              );
            })}
          </div>
        </Card>

        <Card style={{ padding: "20px" }}>
          <SectionHeader title="MSI Score per Variant" accent="var(--lb-chart-2)" />
          <p style={{ fontSize: "var(--lb-text-xs)", color: "var(--lb-text-secondary)", marginBottom: "12px", lineHeight: 1.5 }}>
            MSI &gt;1 indicates the variant sits in a microsatellite region (higher false-positive risk). MSI &gt;12 triggers the MSI12 filter.
          </p>
          {msiCandidates.map((v, i) => (
            <div key={i} style={{ marginBottom: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                <span style={{ fontSize: "var(--lb-text-xs)", color: "var(--lb-text-secondary)", fontWeight: 700 }}>
                  {v.gene} <span style={{ color: "var(--lb-text-muted)", fontWeight: 400, fontSize: "var(--lb-text-2xs)" }}>chr{v.chrom}:{v.pos.toLocaleString()}</span>
                </span>
                <span style={{ fontSize: "var(--lb-text-xs)", fontWeight: 900, color: msiColor(v.msi) }}>{v.msi}</span>
              </div>
              <ProgressBar value={v.msi} max={20} color={msiColor(v.msi)} height={5} />
            </div>
          ))}
        </Card>
      </div>

      <Card style={{ padding: "20px" }}>
        <SectionHeader title="Signal-to-Noise & Mismatch Reference Ranges" accent="var(--lb-status-info)" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "16px" }}>
          <div>
            <p style={{ fontSize: "var(--lb-text-2xs)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--lb-status-info)", marginBottom: "10px" }}>Signal-to-Noise (SN)</p>
            {[{ l: "SN < 1.5", d: "Below threshold — SN1.5 filter", c: "var(--lb-status-high)" }, { l: "SN 1.5–10", d: "Acceptable", c: "var(--lb-status-moderate)" }, { l: "SN ≥ 10", d: "Good signal quality", c: "var(--lb-status-low)" }].map((r, i) => (
              <StatRow key={i} label={r.l} value={r.d} color={r.c} />
            ))}
          </div>
          <div>
            <p style={{ fontSize: "var(--lb-text-2xs)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--lb-status-moderate)", marginBottom: "10px" }}>Mean Mismatches (NM)</p>
            {[{ l: "NM < 2", d: "Good — low mismatch rate", c: "var(--lb-status-low)" }, { l: "NM 2–5", d: "Caution — review carefully", c: "var(--lb-status-moderate)" }, { l: "NM ≥ 5.25", d: "NM5.25 filter triggered", c: "var(--lb-status-high)" }].map((r, i) => (
              <StatRow key={i} label={r.l} value={r.d} color={r.c} />
            ))}
            <p style={{ fontSize: "var(--lb-text-2xs)", color: "var(--lb-text-muted)", marginTop: "8px" }}>{qc_summary.high_mismatch_count} variant(s) flagged with NM5.25 in this file</p>
          </div>
          <div>
            <p style={{ fontSize: "var(--lb-text-2xs)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--lb-status-low)", marginBottom: "10px" }}>HiQ Allele Frequency (HIAF)</p>
            <p style={{ fontSize: "var(--lb-text-xs)", color: "var(--lb-text-secondary)", lineHeight: 1.6 }}>
              HIAF is VAF computed using only high-quality bases. If HIAF differs significantly from VAF, it may indicate a base-quality issue worth reviewing per-variant.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
