import Card from "../primitives/Card";
import SectionHeader from "../primitives/SectionHeader";
import Badge from "../primitives/Badge";
import KPICard from "../primitives/KPICard";
import ProgressBar from "../primitives/ProgressBar";
import { Icon } from "../icons";
import { ICONS } from "../iconPaths";
import { vafColor, clinvarColor, tierColor, TIER_LABELS } from "../colors";

const TIER_ORDER = [
  "tier_1_actionable_somatic",
  "tier_2_uncertain_needs_review",
  "tier_3_germline_pattern_clinically_relevant",
  "tier_4_benign_or_artifact",
  "not_evaluated",
];

function Callout({ tone = "info", icon = "info", children }) {
  return (
    <div style={{
      padding: "14px 16px", borderRadius: "var(--lb-radius-lg)", marginBottom: "16px",
      background: `var(--lb-status-${tone}-bg)`, border: `1px solid var(--lb-status-${tone}-border)`,
      display: "flex", alignItems: "flex-start", gap: "10px",
    }}>
      <Icon d={ICONS[icon]} size={14} style={{ color: `var(--lb-status-${tone})`, flexShrink: 0, marginTop: "1px" }} />
      <div style={{ fontSize: "var(--lb-text-xs)", lineHeight: 1.7, color: "var(--lb-text-secondary)" }}>
        {children}
      </div>
    </div>
  );
}

export default function OverviewPage({ data }) {
  const { meta, qc_summary, tier_summary, qc_flag_summary, germline_summary, vaf_profile, gene_summary } = data;
  const counts = tier_summary?.counts || {};
  const totalTiered = TIER_ORDER.reduce((sum, t) => sum + (counts[t] || 0), 0) || 1;
  const skippedStages = Object.entries(meta.stages || {}).filter(([, s]) => s.status !== "ran");

  return (
    <div>
      <Callout tone="info">{meta.disclaimer}</Callout>

      {/* An unvalidated caller adapter must warn before any derived result is shown. */}
      {meta.caller_adapter_warning && (
        <Callout tone="high" icon="alert">
          <strong style={{ color: "var(--lb-status-high)" }}>Unvalidated caller adapter — </strong>
          {meta.caller_adapter_warning}
        </Callout>
      )}

      {/* A declared build contradicted by the coordinates is a hard warning. */}
      {meta.reference_build_corroboration?.status === "conflict" && (
        <Callout tone="high" icon="alert">
          <strong style={{ color: "var(--lb-status-high)" }}>Reference build mismatch — </strong>
          {meta.reference_build_corroboration.warning}
        </Callout>
      )}

      {!meta.reference_build_confirmed && (
        <Callout tone="moderate" icon="alert">
          <strong style={{ color: "var(--lb-status-moderate)" }}>Reference build unconfirmed — </strong>
          Coordinate-based annotation (ClinVar, CIViC) is refused until the build is confirmed, so
          clinical findings below are absent rather than negative.
        </Callout>
      )}

      {/* Pipeline stages: a stage that did not run is shown as such, never as a negative result. */}
      <Card style={{ padding: "16px 20px", marginBottom: "16px" }}>
        <SectionHeader title="Pipeline Stages" accent="var(--lb-status-neutral)" />
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {Object.entries(meta.stages || {}).map(([stage, s]) => {
            const ran = s.status === "ran";
            return (
              <div key={stage} title={s.detail || s.status} style={{
                display: "flex", alignItems: "center", gap: "6px",
                padding: "6px 10px", borderRadius: "var(--lb-radius-sm)",
                background: ran ? "var(--lb-status-low-bg)" : "var(--lb-status-moderate-bg)",
                border: `1px solid ${ran ? "var(--lb-status-low-border)" : "var(--lb-status-moderate-border)"}`,
              }}>
                <Icon d={ran ? ICONS.checkCircle : ICONS.alert} size={12}
                  style={{ color: ran ? "var(--lb-status-low)" : "var(--lb-status-moderate)" }} />
                <span style={{ fontSize: "var(--lb-text-xs)", fontWeight: 600, color: "var(--lb-text-primary)" }}>
                  {stage.replace(/_/g, " ")}
                </span>
                {!ran && (
                  <span style={{ fontSize: "var(--lb-text-2xs)", color: "var(--lb-status-moderate)" }}>
                    {s.status.replace("skipped_", "").replace(/_/g, " ")}
                  </span>
                )}
              </div>
            );
          })}
        </div>
        {skippedStages.length > 0 && (
          <p style={{ fontSize: "var(--lb-text-2xs)", color: "var(--lb-text-muted)", marginTop: "10px", lineHeight: 1.6 }}>
            Stages not marked complete had a missing input or an unsupported precondition — their findings are
            absent, not negative. Hover any stage for the exact reason.
          </p>
        )}
      </Card>

      {/* Header */}
      <Card style={{ padding: "20px", marginBottom: "16px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "20px", fontWeight: 900, color: "var(--lb-text-primary)" }}>
                Sample {meta.sample_id}
              </span>
              {counts.tier_1_actionable_somatic > 0 ? (
                <Badge label={`${counts.tier_1_actionable_somatic} actionable somatic`} color="var(--lb-status-high)" />
              ) : (
                <Badge label="No actionable somatic finding" color="var(--lb-status-low)" />
              )}
              {!meta.caller_adapter_validated && <Badge label="Unvalidated adapter" color="var(--lb-status-high)" />}
            </div>
            <p style={{ fontSize: "var(--lb-text-sm)", color: "var(--lb-text-secondary)" }}>
              {[meta.panel_name, meta.caller].filter(Boolean).join(" — ")}
            </p>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
            {[
              { l: "Input format", v: (meta.input_format || "vcf").toUpperCase() },
              { l: "Reference", v: `${meta.reference_build}${meta.reference_build_confirmed ? "" : " (unconfirmed)"}` },
              { l: "Build source", v: (meta.reference_build_source || "").replace(/_/g, " ") },
              { l: "Genes", v: meta.panel_gene_count },
            ].map((item, i) => (
              <div key={i}>
                <p style={{ fontSize: "var(--lb-text-2xs)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--lb-text-muted)", marginBottom: "2px" }}>{item.l}</p>
                <p style={{ fontSize: "var(--lb-text-sm)", fontWeight: 700, color: "var(--lb-text-primary)" }}>{item.v}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: "12px", marginBottom: "16px" }}>
        <KPICard label="Total Variants" value={qc_summary.total_records} unit="calls" color="var(--lb-status-info)" icon="dna" />
        <KPICard label="Pass Filter" value={qc_summary.pass_count} unit={`/ ${qc_summary.total_records}`} color="var(--lb-status-low)" icon="shield" sub={`${Math.round(qc_summary.pass_rate * 100)}% pass the caller's own filters`} />
        <KPICard label="QC Downgraded" value={qc_flag_summary?.confidence_downgraded ?? 0} unit="calls" color="var(--lb-status-moderate)" icon="alert" sub="Artifact or multi-flag QC concerns" />
        <KPICard label="Artifact Candidates" value={qc_flag_summary?.contamination_candidates ?? 0} unit="calls" color="var(--lb-status-high)" icon="alert" sub="Shared motif across unrelated loci" />
        <KPICard label="Mean Depth" value={qc_summary.depth.mean} unit="×" color="var(--lb-status-info)" icon="layers" ideal="≥500×" sub={`Range: ${qc_summary.depth.min}× – ${qc_summary.depth.max}×`} />
      </div>

      {/* Tier breakdown — replaces the former single 0-100 score */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px", marginBottom: "16px" }} className="ov-row2">
        <Card style={{ padding: "24px" }}>
          <SectionHeader title="Variant Tiers" accent="var(--lb-status-info)" />
          {TIER_ORDER.map((tier) => {
            const n = counts[tier] || 0;
            return (
              <div key={tier} style={{ marginBottom: "14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px", gap: "8px", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "var(--lb-text-sm)", fontWeight: 700, color: "var(--lb-text-primary)" }}>
                    {TIER_LABELS[tier] || tier}
                  </span>
                  <span style={{ fontSize: "var(--lb-text-sm)", fontWeight: 900, color: tierColor(tier) }}>{n}</span>
                </div>
                <ProgressBar value={n} max={totalTiered} color={tierColor(tier)} height={6} />
                <p style={{ fontSize: "var(--lb-text-2xs)", color: "var(--lb-text-muted)", marginTop: "3px", lineHeight: 1.5 }}>
                  {tier_summary?.definitions?.[tier]}
                </p>
              </div>
            );
          })}
          <div style={{ padding: "12px", borderRadius: "var(--lb-radius-md)", marginTop: "8px", background: "var(--lb-status-info-bg)", border: "1px solid var(--lb-status-info-border)" }}>
            <p style={{ fontSize: "var(--lb-text-sm)", fontWeight: 900, color: "var(--lb-status-info)", marginBottom: "4px" }}>
              Review priority count: {tier_summary?.review_priority_count}
            </p>
            <p style={{ fontSize: "var(--lb-text-2xs)", color: "var(--lb-status-info)", lineHeight: 1.6 }}>
              {tier_summary?.review_priority_formula}
            </p>
          </div>
        </Card>

        {/* Germline vs somatic + VAF context */}
        <Card style={{ padding: "24px" }}>
          <SectionHeader title="Germline / Somatic Pattern" accent="var(--lb-chart-2)" />
          {germline_summary?.applied === false ? (
            <p style={{ fontSize: "var(--lb-text-sm)", color: "var(--lb-text-secondary)", lineHeight: 1.7 }}>
              {germline_summary.reason}
            </p>
          ) : (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: "12px", marginBottom: "14px" }}>
                {[
                  { label: "Heterozygous pattern", value: germline_summary?.putative_heterozygous_germline_pattern ?? 0 },
                  { label: "Homozygous pattern", value: germline_summary?.putative_homozygous_germline_pattern ?? 0 },
                  { label: "Common in population", value: germline_summary?.common_population_variant ?? 0 },
                  { label: "Median VAF", value: `${Math.round((vaf_profile.median || 0) * 100)}%` },
                ].map((m, i) => (
                  <div key={i} style={{ padding: "14px", borderRadius: "var(--lb-radius-md)", background: "var(--lb-row-hover)", border: "1px solid var(--lb-border)" }}>
                    <p style={{ fontSize: "var(--lb-text-2xs)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--lb-text-muted)", marginBottom: "6px" }}>{m.label}</p>
                    <p style={{ fontSize: "18px", fontWeight: 900, color: "var(--lb-chart-2)" }}>{m.value}</p>
                  </div>
                ))}
              </div>
              <div style={{ padding: "12px", borderRadius: "var(--lb-radius-md)", background: "var(--lb-status-moderate-bg)", border: "1px solid var(--lb-status-moderate-border)" }}>
                <p style={{ fontSize: "var(--lb-text-xs)", color: "var(--lb-status-moderate)", lineHeight: 1.6, fontWeight: 600 }}>
                  {data.germline_summary?.population_af_source_note}
                </p>
              </div>
            </>
          )}
          <p style={{ fontSize: "var(--lb-text-2xs)", color: "var(--lb-text-muted)", marginTop: "10px", lineHeight: 1.6 }}>
            {vaf_profile.note}
          </p>
        </Card>
      </div>

      {/* Provenance checklist */}
      {meta.provenance?.checklist?.length > 0 && (
        <Card style={{ padding: "20px", marginBottom: "16px" }}>
          <SectionHeader title="Referenced Files Not Supplied" accent="var(--lb-status-moderate)" />
          <p style={{ fontSize: "var(--lb-text-xs)", color: "var(--lb-text-secondary)", marginBottom: "12px", lineHeight: 1.6 }}>
            This file's header records the commands that produced it. These external files were referenced but
            not provided, so the capabilities noted below are unavailable.
          </p>
          {meta.provenance.checklist.map((item, i) => (
            <div key={i} style={{ display: "flex", gap: "8px", padding: "8px 10px", borderRadius: "var(--lb-radius-sm)", background: "var(--lb-row-hover)", border: "1px solid var(--lb-border)", marginBottom: "6px" }}>
              <Icon d={ICONS.alert} size={12} style={{ color: "var(--lb-status-moderate)", flexShrink: 0, marginTop: "2px" }} />
              <span style={{ fontSize: "var(--lb-text-xs)", color: "var(--lb-text-secondary)", lineHeight: 1.5 }}>{item}</span>
            </div>
          ))}
        </Card>
      )}

      {/* Gene table */}
      <Card style={{ padding: "20px", marginBottom: "16px" }}>
        <SectionHeader title="Genes Ranked by Highest VAF" accent="var(--lb-status-info)" />
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "var(--lb-text-sm)", minWidth: "620px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--lb-border)" }}>
                {["Gene", "Variants", "Max VAF", "ClinVar", "Evidence"].map((h) => (
                  <th key={h} style={{ paddingBottom: "10px", paddingRight: "12px", textAlign: "left", fontSize: "var(--lb-text-2xs)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--lb-text-muted)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {gene_summary.slice(0, 12).map((row, i) => (
                <tr key={i} style={{ borderBottom: "1px solid var(--lb-border)" }}>
                  <td style={{ padding: "10px 12px 10px 0", fontWeight: 900, color: "var(--lb-status-info)" }}>{row.gene}</td>
                  <td style={{ padding: "10px 12px 10px 0", color: "var(--lb-text-secondary)" }}>{row.variant_count}</td>
                  <td style={{ padding: "10px 12px 10px 0" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <div style={{ width: "40px", height: "4px", background: "var(--lb-track)", borderRadius: "99px", overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${(row.max_vaf || 0) * 100}%`, background: vafColor(row.max_vaf), borderRadius: "99px" }} />
                      </div>
                      <span style={{ fontWeight: 700, color: vafColor(row.max_vaf) }}>{((row.max_vaf || 0) * 100).toFixed(1)}%</span>
                    </div>
                  </td>
                  <td style={{ padding: "10px 12px 10px 0" }}>
                    <Badge label={row.clinvar_max_significance || "No match"} color={clinvarColor(row.clinvar_max_significance)} small />
                  </td>
                  <td style={{ padding: "10px 0" }}>
                    <Badge
                      label={row.civic_variant_level_actionable ? "Variant-level" : row.civic_gene_level_evidence ? "Gene-level only" : "None found"}
                      color={row.civic_variant_level_actionable ? "var(--lb-status-high)" : row.civic_gene_level_evidence ? "var(--lb-status-moderate)" : "var(--lb-status-neutral)"}
                      small
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
