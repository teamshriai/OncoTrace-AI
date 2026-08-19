// Kept hand-rolled — recharts has no first-class gauge primitive, and hacking one
// together from two half-pies plus a rotated needle overlay is more code and more
// fragile than this ~90-line SVG version. SVG presentation attributes resolve
// var(...) directly, unlike a <canvas> 2D context, so this can read tokens as-is.
export default function SemiGauge({ score, tierLabels = ["Low", "Moderate", "Elevated"] }) {
  const size = 200;
  const cx = size / 2;
  const cy = size * 0.65;
  const r = 78;
  const startAngle = Math.PI;
  const totalArc = Math.PI;
  const pct = Math.max(0, Math.min(score, 100)) / 100;
  const needleAngle = startAngle + pct * totalArc;
  const nx = cx + r * Math.cos(needleAngle);
  const ny = cy + r * Math.sin(needleAngle);

  const zones = [
    { pct: 0.34, color: "var(--lb-status-low)", label: tierLabels[0] },
    { pct: 0.33, color: "var(--lb-status-moderate)", label: tierLabels[1] },
    { pct: 0.33, color: "var(--lb-status-high)", label: tierLabels[2] },
  ];
  let zoneOffset = 0;
  const zoneArcs = zones.map((z) => {
    const a1 = startAngle + zoneOffset * totalArc;
    const a2 = startAngle + (zoneOffset + z.pct) * totalArc;
    const lx1 = cx + r * Math.cos(a1), ly1 = cy + r * Math.sin(a1);
    const lx2 = cx + r * Math.cos(a2), ly2 = cy + r * Math.sin(a2);
    const ri = r - 16;
    const ix1 = cx + ri * Math.cos(a1), iy1 = cy + ri * Math.sin(a1);
    const ix2 = cx + ri * Math.cos(a2), iy2 = cy + ri * Math.sin(a2);
    const d = `M${lx1},${ly1} A${r},${r} 0 0,1 ${lx2},${ly2} L${ix2},${iy2} A${ri},${ri} 0 0,0 ${ix1},${iy1} Z`;
    const arc = { ...z, d, midAngle: (a1 + a2) / 2 };
    zoneOffset += z.pct;
    return arc;
  });

  const tierColor = score >= 67 ? "var(--lb-status-high)" : score >= 34 ? "var(--lb-status-moderate)" : "var(--lb-status-low)";
  const tierText = score >= 67 ? tierLabels[2] : score >= 34 ? tierLabels[1] : tierLabels[0];

  return (
    <svg viewBox={`0 0 ${size} ${size * 0.7}`} style={{ width: "100%", maxWidth: "260px" }}>
      <defs>
        <filter id="lb-needle-shadow">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="rgba(0,0,0,0.3)" />
        </filter>
      </defs>
      {zoneArcs.map((z, i) => (
        <g key={i}>
          <path d={z.d} fill={z.color} opacity="0.85" />
          <text
            x={cx + (r - 8) * Math.cos(z.midAngle)}
            y={cy + (r - 8) * Math.sin(z.midAngle)}
            textAnchor="middle"
            style={{ fontSize: "7px", fill: "#fff", fontWeight: 700 }}
          >
            {z.label}
          </text>
        </g>
      ))}
      <line x1={cx} y1={cy} x2={nx} y2={ny}
        stroke="var(--lb-text-primary)" strokeWidth="2.5"
        strokeLinecap="round" filter="url(#lb-needle-shadow)" />
      <circle cx={cx} cy={cy} r="6" fill="var(--lb-text-primary)" />
      <circle cx={cx} cy={cy} r="3" fill="var(--lb-bg-surface)" />
      <text x={cx} y={cy - 22} textAnchor="middle" style={{ fontSize: "26px", fontWeight: 900, fill: tierColor }}>
        {Math.round(score)}
      </text>
      <text x={cx} y={cy - 8} textAnchor="middle" style={{ fontSize: "9px", fontWeight: 700, fill: "var(--lb-text-secondary)" }}>
        / 100
      </text>
      <text x={cx} y={cy + 14} textAnchor="middle" style={{ fontSize: "10px", fontWeight: 700, fill: tierColor }}>
        {tierText}
      </text>
    </svg>
  );
}
