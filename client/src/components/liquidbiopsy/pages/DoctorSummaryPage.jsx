import Card from "../primitives/Card";
import SectionHeader from "../primitives/SectionHeader";
import Badge from "../primitives/Badge";
import DonutChart from "../charts/DonutChart";
import BarChart from "../charts/BarChart";
import VAFTrendLine from "../charts/VAFTrendLine";
import { Icon } from "../icons";
import { ICONS } from "../iconPaths";
import { tierColor, depthColor, TIER_LABELS } from "../colors";

const TIER_ORDER = [
  "tier_1_actionable_somatic",
  "tier_2_uncertain_needs_review",
  "tier_3_germline_pattern_clinically_relevant",
  "tier_4_benign_or_artifact",
  "not_evaluated",
];

// Genomic-order sort, needed for the VAF trend chart -- variants arrive in
// whatever order the file/caller produced, which is usually but not
// guaranteedly coordinate order.
const CHROM_ORDER = ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","X","Y","M"];
function chromRank(chrom) {
  const idx = CHROM_ORDER.indexOf(String(chrom).replace(/^chr/i, ""));
  return idx === -1 ? CHROM_ORDER.length : idx;
}

// Rendering one SVG dot per variant is exactly what made other pages freeze on
// a large real file earlier -- stride-downsample so the DOM stays bounded
// regardless of file size, while still spanning the whole genome rather than
// just the first/highest-depth slice.
const TREND_CAP = 600;
function downsample(sorted, cap) {
  if (sorted.length <= cap) return sorted;
  const stride = Math.ceil(sorted.length / cap);
  return sorted.filter((_, i) => i % stride === 0);
}

const DEPTH_BUCKETS = [
  { label: "<100×", min: 0, max: 100, sample: 50 },
  { label: "100–300×", min: 100, max: 300, sample: 200 },
  { label: "300–500×", min: 300, max: 500, sample: 400 },
  { label: "500–1000×", min: 500, max: 1000, sample: 700 },
  { label: "1000×+", min: 1000, max: Infinity, sample: 1200 },
];
function buildDepthHistogram(variants) {
  return DEPTH_BUCKETS.map((b) => ({
    label: b.label,
    count: variants.filter((v) => typeof v.depth === "number" && v.depth >= b.min && v.depth < b.max).length,
    color: depthColor(b.sample),
  }));
}

// Real CIViC evidence, not a synthesized "diagnosis" -- each variant's raw
// evidence list (annotate_civic.py) carries its own `disease` field verbatim
// from CIViC's curation. Surfacing it directly, with the evidence level
// alongside it, discloses exactly how strong the association is rather than
// silently filtering to only the strongest evidence.
const EVIDENCE_LEVEL_RANK = { A: 0, B: 1, C: 2, D: 3, E: 4 };
function buildAssociatedConditions(variants) {
  const byKey = new Map();
  for (const v of variants) {
    const evidence = v.civic?.evidence || [];
    for (const e of evidence) {
      if (!e.disease) continue;
      const level = (e.evidence_level || "").toUpperCase();
      const key = `${v.gene}|${e.disease}`;
      const existing = byKey.get(key);
      if (!existing || (EVIDENCE_LEVEL_RANK[level] ?? 9) < (EVIDENCE_LEVEL_RANK[existing.level] ?? 9)) {
        byKey.set(key, { gene: v.gene, disease: e.disease, level });
      }
    }
  }
  return [...byKey.values()].sort((a, b) => (EVIDENCE_LEVEL_RANK[a.level] ?? 9) - (EVIDENCE_LEVEL_RANK[b.level] ?? 9)).slice(0, 12);
}

// A rule-based synthesis of fields already shown elsewhere on this page --
// not a separate model, and not labeled "AI" for exactly that reason. Every
// sentence traces to a real, disclosed value; nothing here is inferred beyond
// what's already computed.
function buildClinicalImpression({ tier1Genes, tier3Count, conditions, reviewPriority, reviewPriorityFormula }) {
  const sentences = [];
  sentences.push(
    tier1Genes.length > 0
      ? `This sample shows ${tier1Genes.length} actionable somatic finding${tier1Genes.length > 1 ? "s" : ""}, in ${tier1Genes.join(", ")}.`
      : "This sample shows no variant meeting the actionable-somatic bar in this panel."
  );
  if (conditions.length > 0) {
    const top = [...new Set(conditions.slice(0, 3).map((c) => c.disease))].join(", ");
    sentences.push(
      `Based on the mutations found, the possible cancer type(s) most often studied with this evidence in the published `
      + `literature: ${top}. This is a literature association for these specific mutations, not a confirmed diagnosis -- `
      + `a targeted panel VCF cannot determine primary tumor site or stage on its own.`
    );
  }
  if (tier3Count > 0) {
    sentences.push(
      `${tier3Count} finding(s) show a germline (hereditary) pattern rather than a somatic one -- a different clinical `
      + `pathway from a tumor-acquired mutation, worth discussing with a genetic counselor.`
    );
  }
  if (reviewPriority != null) {
    sentences.push(`Clinical Review Priority: ${reviewPriority} (${reviewPriorityFormula}).`);
  }
  return sentences.join(" ");
}

// The uploaded filename, not a fabricated name -- this app has no real
// patient-identity field (confirmed against the schema: sample_id and
// source_filename are the only identifiers anywhere in the response), so the
// honest stand-in for "patient name" is literally what the file was named.
function displayNameFromFilename(filename) {
  if (!filename) return null;
  return filename.replace(/\.vcf\.gz$/i, "").replace(/\.vcf$/i, "");
}

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

export default function DoctorSummaryPage({ data }) {
  const { meta, tier_summary, patient_summary, variants, actionability_summary } = data;
  const counts = tier_summary?.counts || {};
  const totalTiered = TIER_ORDER.reduce((sum, t) => sum + (counts[t] || 0), 0) || 1;

  const tierDonutData = TIER_ORDER
    .filter((t) => (counts[t] || 0) > 0)
    .map((t) => ({ label: TIER_LABELS[t], value: counts[t], color: tierColor(t) }));

  const genesWithLiteratureEvidence = (patient_summary?.genes_with_variant_level_evidence || 0)
    + (actionability_summary?.genes?.length || 0);

  const trendData = downsample(
    [...variants].sort((a, b) => chromRank(a.chrom) - chromRank(b.chrom) || a.pos - b.pos),
    TREND_CAP
  ).map((v, i) => ({ index: i, vafPct: (v.vaf || 0) * 100, gene: v.gene, chrom: v.chrom, pos: v.pos, tier: v.tier?.tier }));

  const depthHistogram = buildDepthHistogram(variants);

  const tier1Genes = (patient_summary?.gene_cards || [])
    .filter((g) => g.evidence_basis === "tier_1_actionable_somatic")
    .map((g) => g.gene);
  const associatedConditions = buildAssociatedConditions(variants);
  const reviewPriority = tier_summary?.review_priority_count;
  const reviewPriorityFormula = tier_summary?.review_priority_formula;
  const reviewPriorityMax = totalTiered * 2; // formula's own ceiling: 2*tier1 + tier2, if every variant were tier1
  const clinicalImpression = buildClinicalImpression({
    tier1Genes,
    tier3Count: counts.tier_3_germline_pattern_clinically_relevant || 0,
    conditions: associatedConditions,
    reviewPriority,
    reviewPriorityFormula,
  });

  const patientName = displayNameFromFilename(meta.source_filename);

  let analysisDate = null;
  try {
    analysisDate = new Date(meta.analysis_timestamp).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
  } catch { /* leave null if unparseable */ }

  return (
    <div>
      <Callout tone="info">{meta.disclaimer}</Callout>

      {meta.caller_adapter_warning && (
        <Callout tone="high" icon="alert">
          <strong style={{ color: "var(--lb-status-high)" }}>Unvalidated caller adapter — </strong>
          {meta.caller_adapter_warning}
        </Callout>
      )}

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

      {/* Report header -- a masthead, not a floating card: a bottom divider
          is enough to separate it from the content that follows. */}
      <div style={{ paddingBottom: "20px", marginBottom: "20px", borderBottom: "1px solid var(--lb-border)" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "var(--lb-text-xl)", fontWeight: 700, color: "var(--lb-text-primary)" }}>
                {patientName || `Sample ${meta.sample_id}`}
              </span>
              {counts.tier_1_actionable_somatic > 0 ? (
                <Badge label={`${counts.tier_1_actionable_somatic} actionable somatic finding${counts.tier_1_actionable_somatic > 1 ? "s" : ""}`} color="var(--lb-status-high)" />
              ) : (
                <Badge label="No actionable somatic finding" color="var(--lb-status-low)" />
              )}
            </div>
            <p style={{ fontSize: "var(--lb-text-sm)", color: "var(--lb-text-secondary)" }}>
              Sample ID: {meta.sample_id}
            </p>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
            {[
              { l: "Reference Build", v: `${meta.reference_build}${meta.reference_build_confirmed ? "" : " (unconfirmed)"}` },
              { l: "Genes Covered", v: meta.panel_gene_count },
              { l: "Analysis Date", v: analysisDate || "—" },
            ].map((item, i) => (
              <div key={i}>
                <p style={{ fontSize: "var(--lb-text-2xs)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--lb-text-muted)", marginBottom: "2px" }}>{item.l}</p>
                <p style={{ fontSize: "var(--lb-text-sm)", fontWeight: 700, color: "var(--lb-text-primary)" }}>{item.v}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rule-based synthesis of the fields shown elsewhere on this page --
          deliberately not labeled "AI": it's a template over disclosed
          values, not a separate model, and calling it AI would itself be the
          kind of overclaim this whole page exists to avoid. */}
      <Card style={{ padding: "20px", marginBottom: "16px" }}>
        <SectionHeader title="Clinical Impression (Rule-Based Summary)" accent="var(--lb-status-info)" />
        <p style={{ fontSize: "var(--lb-text-sm)", color: "var(--lb-text-primary)", lineHeight: 1.7, marginBottom: "16px" }}>
          {clinicalImpression}
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "16px" }}>
          <div>
            <p style={{ fontSize: "var(--lb-text-2xs)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--lb-text-muted)", marginBottom: "8px" }}>
              Clinical Review Priority
            </p>
            <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "6px" }}>
              <span style={{ fontSize: "32px", fontWeight: 900, color: "var(--lb-status-high)", lineHeight: 1 }}>{reviewPriority ?? "—"}</span>
              <span style={{ fontSize: "var(--lb-text-xs)", color: "var(--lb-text-muted)" }}>of up to {reviewPriorityMax}</span>
            </div>
            <div style={{ height: "6px", background: "var(--lb-track)", borderRadius: "var(--lb-radius-full)", overflow: "hidden", marginBottom: "8px" }}>
              <div style={{ height: "100%", width: `${reviewPriorityMax > 0 ? Math.min(100, ((reviewPriority || 0) / reviewPriorityMax) * 100) : 0}%`, background: "var(--lb-status-high)", borderRadius: "var(--lb-radius-full)" }} />
            </div>
            <p style={{ fontSize: "var(--lb-text-2xs)", color: "var(--lb-text-muted)", lineHeight: 1.5 }}>
              A disclosed count, not a black-box score: {reviewPriorityFormula}
            </p>
          </div>

          <div>
            <p style={{ fontSize: "var(--lb-text-2xs)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--lb-text-muted)", marginBottom: "8px" }}>
              Possible Cancer Type (Literature Association)
            </p>
            {associatedConditions.length === 0 ? (
              <p style={{ fontSize: "var(--lb-text-xs)", color: "var(--lb-text-muted)" }}>
                No CIViC-curated cancer-type association found for any variant in this file.
              </p>
            ) : (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {associatedConditions.map((c, i) => (
                  <span key={i} title={`${c.gene} — CIViC evidence level ${c.level || "?"}`} style={{
                    fontSize: "var(--lb-text-xs)", padding: "4px 10px", borderRadius: "var(--lb-radius-sm)",
                    background: "var(--lb-status-info-bg)", border: "1px solid var(--lb-status-info-border)", color: "var(--lb-status-info)",
                  }}>
                    {c.disease} <span style={{ opacity: 0.6 }}>({c.gene}, level {c.level || "?"})</span>
                  </span>
                ))}
              </div>
            )}
            <p style={{ fontSize: "var(--lb-text-2xs)", color: "var(--lb-text-muted)", marginTop: "8px", lineHeight: 1.5 }}>
              From the mutations found in this file, cross-referenced against CIViC's curated evidence -- not a confirmed
              diagnosis of this patient's cancer type or site, which a VCF alone cannot determine.
            </p>
          </div>
        </div>
      </Card>

      {/* Findings-first: a chart, not a number wall. */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px", marginBottom: "16px" }} className="ov-row2">
        <Card style={{ padding: "24px" }}>
          <SectionHeader title="Findings Overview" accent="var(--lb-status-info)" />
          <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
            <DonutChart data={tierDonutData} size={140} label={String(totalTiered)} sublabel="Variants" />
            <div style={{ flex: 1, minWidth: "200px" }}>
              {TIER_ORDER.filter((t) => (counts[t] || 0) > 0).map((t) => (
                <div key={t} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "7px" }}>
                  <span style={{ width: "9px", height: "9px", borderRadius: "3px", background: tierColor(t), flexShrink: 0 }} />
                  <span style={{ fontSize: "var(--lb-text-xs)", color: "var(--lb-text-secondary)", flex: 1 }}>{TIER_LABELS[t]}</span>
                  <span style={{ fontSize: "var(--lb-text-sm)", fontWeight: 900, color: tierColor(t) }}>{counts[t]}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card style={{ padding: "24px" }}>
          <SectionHeader title="At a Glance" accent="var(--lb-chart-2)" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: "12px" }}>
            {[
              { label: "Genes Tested", value: patient_summary?.genes_tested ?? 0, desc: "Different gene regions analyzed", color: "var(--lb-status-info)" },
              { label: "Notable Findings", value: patient_summary?.genes_with_findings ?? 0, desc: "Genes with a substantial fraction of altered DNA", color: "var(--lb-status-moderate)" },
              { label: "Literature Evidence", value: genesWithLiteratureEvidence, desc: "General associations, not confirmed variant-specific matches", color: "var(--lb-status-low)" },
            ].map((k, i) => (
              <div key={i} style={{ padding: "14px", borderRadius: "var(--lb-radius-md)", background: "var(--lb-row-hover)", border: "1px solid var(--lb-border)" }}>
                <p style={{ fontSize: "24px", fontWeight: 900, color: k.color, lineHeight: 1 }}>{k.value}</p>
                <p style={{ fontSize: "var(--lb-text-xs)", fontWeight: 700, color: "var(--lb-text-primary)", marginTop: "6px" }}>{k.label}</p>
                <p style={{ fontSize: "var(--lb-text-2xs)", color: "var(--lb-text-secondary)", marginTop: "3px", lineHeight: 1.4 }}>{k.desc}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Key gene findings, in plain language. Flat section, not a card --
          the per-gene tiles below already carry their own border + accent
          color, so an outer Card would just be a second box around boxes. */}
      {patient_summary?.gene_cards?.length > 0 && (
        <div style={{ marginBottom: "24px" }}>
          <SectionHeader title="Key Gene Findings" accent="var(--lb-status-info)" />
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
        </div>
      )}

      {/* Visual trend + confidence charts, in place of a raw number/gene dump. */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: "16px", marginBottom: "16px" }}>
        <Card style={{ padding: "20px" }}>
          <SectionHeader title="Variant Severity Trend Across the Genome" accent="var(--lb-status-info)" />
          <p style={{ fontSize: "var(--lb-text-xs)", color: "var(--lb-text-secondary)", marginBottom: "10px", lineHeight: 1.5 }}>
            How much of the sample's DNA carries each variant, ordered across the genome — the same per-variant
            values behind the Clinical Review Priority score above. Dashed lines mark the typical clonal (30%) and
            low-fraction (5%) reference points; dot color matches the finding tiers.
          </p>
          <VAFTrendLine data={trendData} />
        </Card>

        <Card style={{ padding: "20px" }}>
          <SectionHeader title="Sequencing Confidence" accent="var(--lb-chart-3)" />
          <p style={{ fontSize: "var(--lb-text-xs)", color: "var(--lb-text-secondary)", marginBottom: "10px", lineHeight: 1.5 }}>
            How many independent reads back each result — higher generally means a more reliable call.
          </p>
          <BarChart data={depthHistogram} xKey="label" yKey="count" colorKey="color" height={180} />
        </Card>
      </div>

      {/* Germline vs somatic context, already plain-language. Flat section --
          the metric tiles below already carry their own border. */}
      <div style={{ marginBottom: "24px" }}>
        <SectionHeader title="Germline / Somatic Pattern" accent="var(--lb-chart-2)" />
        {data.germline_summary?.applied === false ? (
          <p style={{ fontSize: "var(--lb-text-sm)", color: "var(--lb-text-secondary)", lineHeight: 1.7 }}>
            {data.germline_summary.reason}
          </p>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: "12px", marginBottom: "14px" }}>
              {[
                { label: "Heterozygous pattern", value: data.germline_summary?.putative_heterozygous_germline_pattern ?? 0 },
                { label: "Homozygous pattern", value: data.germline_summary?.putative_homozygous_germline_pattern ?? 0 },
                { label: "Common in population", value: data.germline_summary?.common_population_variant ?? 0 },
                { label: "Median VAF", value: `${Math.round((data.vaf_profile?.median || 0) * 100)}%` },
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
      </div>

      {/* Next steps, kept illustrative and clearly labeled as such. */}
      {patient_summary?.next_steps?.length > 0 && (
        <Card style={{ padding: "20px", marginBottom: "16px" }}>
          <SectionHeader title="Typical Next Steps (Illustrative)" accent="var(--lb-status-low)" />
          <p style={{ fontSize: "var(--lb-text-xs)", color: "var(--lb-text-muted)", marginBottom: "16px" }}>
            Generic steps in a real clinical workflow — not generated from this specific file.
          </p>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {patient_summary.next_steps.map((step, i) => (
              <div key={i} style={{ display: "flex", gap: "16px", paddingBottom: i < patient_summary.next_steps.length - 1 ? "20px" : 0 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--lb-brand)", display: "flex", alignItems: "center", justifyContent: "center" }}>
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
      )}

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
