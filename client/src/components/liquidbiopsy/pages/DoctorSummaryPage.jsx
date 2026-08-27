import Card from "../primitives/Card";
import DonutChart from "../charts/DonutChart";
import BarChart from "../charts/BarChart";
import VAFTrendLine from "../charts/VAFTrendLine";
import VAFHistogram from "../charts/VAFHistogram";
import { Icon } from "../icons";
import { ICONS } from "../iconPaths";
import { tierColor, depthColor, mqColor, qualitativeColor, TIER_LABELS } from "../colors";

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

// Small colored icon badge, reused ahead of every section header on this page
// so each block reads as a distinct, colorful "instrument" rather than a
// stack of identical gray cards -- purely decorative, same pattern KPICard
// already uses elsewhere in this design system.
function IconBadge({ icon, color, size = 32 }) {
  return (
    <div style={{
      width: `${size}px`, height: `${size}px`, borderRadius: "var(--lb-radius-md)", flexShrink: 0,
      background: `color-mix(in srgb, ${color} 16%, transparent)`,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <Icon d={ICONS[icon]} size={size * 0.47} style={{ color }} />
    </div>
  );
}

function SectionHead({ icon, color, title, right }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px", flexWrap: "wrap" }}>
      <IconBadge icon={icon} color={color} />
      <div style={{ flex: 1, minWidth: "160px" }}>
        <span style={{
          fontSize: "var(--lb-text-2xs)", fontWeight: 900, textTransform: "uppercase",
          letterSpacing: "0.12em", color: "var(--lb-text-muted)",
        }}>
          {title}
        </span>
      </div>
      {right}
    </div>
  );
}

// Pure-CSS radial gauge for the Clinical Review Priority count -- same
// disclosed value/ceiling shown as text beneath it, just rendered as a ring
// instead of a thin bar so it reads at a glance.
function PriorityGauge({ value, max, color }) {
  const pct = max > 0 ? Math.min(100, ((value || 0) / max) * 100) : 0;
  return (
    <div style={{
      position: "relative", width: "104px", height: "104px", borderRadius: "50%", flexShrink: 0,
      background: `conic-gradient(${color} ${pct}%, var(--lb-track) 0)`,
    }}>
      <div style={{
        position: "absolute", inset: "8px", borderRadius: "50%", background: "var(--lb-bg-surface)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ fontSize: "26px", fontWeight: 900, color, lineHeight: 1 }}>{value ?? "—"}</span>
        <span style={{ fontSize: "9px", fontWeight: 700, color: "var(--lb-text-muted)", marginTop: "2px" }}>of {max}</span>
      </div>
    </div>
  );
}

// A slim, single-container horizontal stat bar -- deliberately not a grid of
// individually-boxed KPICards. Used for quick-glance counts that belong
// together as one continuous row rather than as separate tiles.
function StatStrip({ title, items }) {
  return (
    <Card style={{ padding: "16px 20px", marginBottom: "14px" }}>
      {title && (
        <p style={{ fontSize: "var(--lb-text-2xs)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--lb-text-muted)", marginBottom: "12px" }}>
          {title}
        </p>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(190px,100%),1fr))", gap: "16px" }}>
        {items.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
            <IconBadge icon={s.icon} color={s.color} />
            <div style={{ minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "6px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "22px", fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}{s.unit || ""}</span>
                <span style={{ fontSize: "var(--lb-text-xs)", fontWeight: 700, color: "var(--lb-text-primary)" }}>{s.label}</span>
              </div>
              {s.sub && <p style={{ fontSize: "var(--lb-text-2xs)", color: "var(--lb-text-muted)", marginTop: "2px", lineHeight: 1.4 }}>{s.sub}</p>}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default function DoctorSummaryPage({ data }) {
  const { meta, tier_summary, patient_summary, variants, variant_type_distribution } = data;
  const counts = tier_summary?.counts || {};
  const totalTiered = TIER_ORDER.reduce((sum, t) => sum + (counts[t] || 0), 0) || 1;

  const tierDonutData = TIER_ORDER
    .filter((t) => (counts[t] || 0) > 0)
    .map((t) => ({ label: TIER_LABELS[t], value: counts[t], color: tierColor(t) }));

  const typeDonutData = (variant_type_distribution || []).map((d, i) => ({ label: d.type, value: d.count, color: qualitativeColor(i) }));
  const totalTyped = typeDonutData.reduce((sum, d) => sum + d.value, 0);

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

  // New chart datasets, mirroring the same aggregates already used verbatim
  // on the Variant Analysis, VAF & Risk, and Technical Details tabs --
  // duplicated locally per this file's own convention rather than extracted
  // into a shared helper.
  const chrDist = (data.chromosome_distribution || []).map((d, i) => ({ ...d, color: qualitativeColor(i) }));
  const vafHistogramData = (data.vaf_profile?.histogram || []).map((d, i) => ({ ...d, color: qualitativeColor(i) }));
  const filterStatusData = [
    { label: "Pass", value: data.qc_summary?.pass_count || 0, color: "var(--lb-status-low)" },
    { label: "Non-pass", value: data.qc_summary?.non_pass_count || 0, color: "var(--lb-status-moderate)" },
  ];
  const depthPerVariantData = variants.slice(0, 20).map((v) => ({ label: v.gene, count: v.depth, color: depthColor(v.depth) }));
  const mqPerVariantData = variants.slice(0, 20).map((v) => ({ label: v.gene, count: v.mq, color: mqColor(v.mq) }));

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

      {/* Reserved for a future patient-record integration -- this app has no
          real demographic fields today (confirmed against the schema:
          sample_id and source_filename are the only identifiers anywhere in
          the response), so these are deliberately empty placeholders, not
          fabricated values. */}
      <Card style={{ padding: "18px 20px", marginBottom: "14px" }}>
        <SectionHead icon="user" color="var(--lb-status-neutral)" title="Patient Demographics" />
        <p style={{ fontSize: "var(--lb-text-2xs)", color: "var(--lb-text-muted)", marginBottom: "14px", lineHeight: 1.5 }}>
          Reserved for a future patient-record integration — no demographic data is collected or inferred by this
          analysis today.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(140px,100%),1fr))", gap: "14px" }}>
          {["Full Name", "Date of Birth", "Age", "Sex", "Contact Number", "MRN / Patient ID", "Ordering Physician"].map((label, i) => (
            <div key={i}>
              <p style={{ fontSize: "var(--lb-text-2xs)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--lb-text-muted)", marginBottom: "6px" }}>
                {label}
              </p>
              <div style={{ height: "16px", borderRadius: "var(--lb-radius-sm)", background: "var(--lb-track)" }} />
            </div>
          ))}
        </div>
      </Card>

      {/* Findings-first: donuts, not a number wall. Variant type
          distribution is the same aggregate already computed and shown on
          the Variant Analysis tab -- surfaced here too as a second real
          chart alongside the tier breakdown, matching how a lab report pairs
          a findings donut with a variant-type donut. */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(280px,100%),1fr))", gap: "14px", marginBottom: "14px" }}>
        <Card style={{ padding: "20px" }}>
          <SectionHead icon="target" color="var(--lb-status-info)" title="Findings Overview" />
          <div style={{ display: "flex", alignItems: "center", gap: "18px", flexWrap: "wrap" }}>
            <DonutChart data={tierDonutData} size={140} label={String(totalTiered)} sublabel="Variants" />
            <div style={{ flex: 1, minWidth: "180px" }}>
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

        {typeDonutData.length > 0 && (
          <Card style={{ padding: "20px" }}>
            <SectionHead icon="layers" color="var(--lb-chart-1)" title="Variant Type Distribution" />
            <div style={{ display: "flex", alignItems: "center", gap: "18px", flexWrap: "wrap" }}>
              <DonutChart data={typeDonutData} size={140} label={String(totalTyped)} sublabel="Total" />
              <div style={{ flex: 1, minWidth: "180px" }}>
                {typeDonutData.map((d, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "7px" }}>
                    <span style={{ width: "9px", height: "9px", borderRadius: "3px", background: d.color, flexShrink: 0 }} />
                    <span style={{ fontSize: "var(--lb-text-xs)", color: "var(--lb-text-secondary)", flex: 1 }}>{d.label}</span>
                    <span style={{ fontSize: "var(--lb-text-sm)", fontWeight: 900, color: d.color }}>{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Visual trend + confidence charts, in place of a raw number/gene dump. */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(320px,100%),1fr))", gap: "14px", marginBottom: "14px" }}>
        <Card style={{ padding: "20px" }}>
          <SectionHead icon="trend" color="var(--lb-status-info)" title="Variant Severity Trend Across the Genome" />
          <p style={{ fontSize: "var(--lb-text-xs)", color: "var(--lb-text-secondary)", marginBottom: "10px", lineHeight: 1.5 }}>
            How much of the sample's DNA carries each variant, ordered across the genome — the same per-variant
            values behind the Clinical Review Priority score above. Dashed lines mark the typical clonal (30%) and
            low-fraction (5%) reference points; dot color matches the finding tiers.
          </p>
          <VAFTrendLine data={trendData} />
        </Card>

        <Card style={{ padding: "20px" }}>
          <SectionHead icon="filter" color="var(--lb-chart-3)" title="Sequencing Confidence" />
          <p style={{ fontSize: "var(--lb-text-xs)", color: "var(--lb-text-secondary)", marginBottom: "10px", lineHeight: 1.5 }}>
            How many independent reads back each result — higher generally means a more reliable call.
          </p>
          <BarChart data={depthHistogram} xKey="label" yKey="count" colorKey="color" height={180} />
        </Card>
      </div>

      {/* Genome-wide molecular composition -- chromosome spread and VAF-
          histogram shape, the same aggregates already computed for the
          Variant Analysis tab, surfacing them as a second genome-wide view
          alongside the trend/confidence row above, before the purely
          technical/QC row below. */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(320px,100%),1fr))", gap: "14px", marginBottom: "14px" }}>
        {chrDist.length > 0 && (
          <Card style={{ padding: "20px" }}>
            <SectionHead icon="sort" color="var(--lb-chart-3)" title="Variants per Chromosome" />
            <BarChart data={chrDist} xKey="chrom" yKey="count" colorKey="color" height={160} />
          </Card>
        )}

        {vafHistogramData.length > 0 && (
          <Card style={{ padding: "20px" }}>
            <SectionHead icon="flask" color="var(--lb-status-info)" title={`VAF Distribution Across All ${variants.length} Variants`} />
            <VAFHistogram data={vafHistogramData} />
          </Card>
        )}
      </div>

      {/* Most technical of the added charts -- pure sequencing-confidence/QC
          signal, not a clinical finding, so it's placed last among all chart
          sections, immediately before the Germline/Somatic categorization
          below. */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(260px,100%),1fr))", gap: "14px", marginBottom: "14px" }}>
        <Card style={{ padding: "20px" }}>
          <SectionHead icon="filter" color="var(--lb-status-low)" title="By Filter Status" />
          <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
            <DonutChart data={filterStatusData} size={140} label={String(variants.length)} sublabel="Variants" />
            <div style={{ flex: 1, minWidth: "120px" }}>
              {filterStatusData.map((d, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "7px" }}>
                  <span style={{ width: "9px", height: "9px", borderRadius: "3px", background: d.color, flexShrink: 0 }} />
                  <span style={{ fontSize: "var(--lb-text-xs)", color: "var(--lb-text-secondary)", flex: 1 }}>{d.label}</span>
                  <span style={{ fontSize: "var(--lb-text-sm)", fontWeight: 900, color: d.color }}>{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card style={{ padding: "20px" }}>
          <SectionHead icon="layers" color="var(--lb-status-info)" title="Sequencing Depth per Variant (first 20)" />
          <BarChart data={depthPerVariantData} xKey="label" yKey="count" colorKey="color" height={160} />
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
          <SectionHead icon="target" color="var(--lb-status-low)" title="Mapping Quality (MQ) per Variant (first 20)" />
          <BarChart data={mqPerVariantData} xKey="label" yKey="count" colorKey="color" height={160} />
          <div style={{ marginTop: "8px", padding: "10px", borderRadius: "var(--lb-radius-md)", background: "var(--lb-row-hover)", border: "1px solid var(--lb-border)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(96px,100%),1fr))", gap: "8px" }}>
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

      {/* Germline vs somatic context, already plain-language, now as a
          sleek stat strip instead of individually boxed tiles. */}
      <div style={{ marginBottom: "16px" }}>
        {data.germline_summary?.applied === false ? (
          <>
            <SectionHead icon="shield" color="var(--lb-chart-2)" title="Germline / Somatic Pattern" />
            <p style={{ fontSize: "var(--lb-text-sm)", color: "var(--lb-text-secondary)", lineHeight: 1.7 }}>
              {data.germline_summary.reason}
            </p>
          </>
        ) : (
          <>
            <StatStrip
              title="Germline / Somatic Pattern"
              items={[
                { label: "Heterozygous pattern", value: data.germline_summary?.putative_heterozygous_germline_pattern ?? 0, icon: "layers", color: "var(--lb-chart-2)" },
                { label: "Homozygous pattern", value: data.germline_summary?.putative_homozygous_germline_pattern ?? 0, icon: "shield", color: "var(--lb-chart-2)" },
                { label: "Common in population", value: data.germline_summary?.common_population_variant ?? 0, icon: "users", color: "var(--lb-chart-2)" },
                { label: "Median VAF", value: Math.round((data.vaf_profile?.median || 0) * 100), unit: "%", icon: "trend", color: "var(--lb-chart-2)" },
              ]}
            />
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
        <Card style={{ padding: "18px 20px", marginBottom: "14px" }}>
          <SectionHead icon="arrowRight" color="var(--lb-status-low)" title="Typical Next Steps (Illustrative)" />
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

      {/* Rule-based synthesis of the fields shown elsewhere on this page --
          deliberately not labeled "AI": it's a template over disclosed
          values, not a separate model, and calling it AI would itself be the
          kind of overclaim this whole page exists to avoid. Placed last,
          after every chart, so the first screen leads with visuals rather
          than prose. */}
      <Card style={{ padding: "18px 20px", marginBottom: "14px" }}>
        <SectionHead icon="stethoscope" color="var(--lb-status-info)" title="Clinical Impression (Rule-Based Summary)" />
        <p style={{ fontSize: "var(--lb-text-sm)", color: "var(--lb-text-primary)", lineHeight: 1.7, marginBottom: "18px" }}>
          {clinicalImpression}
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(240px,100%),1fr))", gap: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
            <PriorityGauge value={reviewPriority} max={reviewPriorityMax} color="var(--lb-status-high)" />
            <div>
              <p style={{ fontSize: "var(--lb-text-2xs)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--lb-text-muted)", marginBottom: "6px" }}>
                Clinical Review Priority
              </p>
              <p style={{ fontSize: "var(--lb-text-2xs)", color: "var(--lb-text-muted)", lineHeight: 1.5 }}>
                A disclosed count, not a black-box score: {reviewPriorityFormula}
              </p>
            </div>
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
