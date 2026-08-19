import Card from "./Card";
import PulseDot from "./PulseDot";
import { Icon } from "../icons";
import { ICONS } from "../iconPaths";

export default function KPICard({ label, value, unit, color = "var(--lb-status-info)", sub, icon, ideal }) {
  return (
    <Card style={{ padding: "16px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "8px" }}>
        <div style={{
          width: "32px", height: "32px", borderRadius: "var(--lb-radius-md)", flexShrink: 0,
          background: `color-mix(in srgb, ${color} 16%, transparent)`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon d={ICONS[icon] || ICONS.dna} size={16} style={{ color }} />
        </div>
        <PulseDot color={color} />
      </div>
      <p style={{ fontSize: "var(--lb-text-xl)", fontWeight: 900, color: "var(--lb-text-primary)", lineHeight: 1, letterSpacing: "-0.02em" }}>
        {value}<span style={{ fontSize: "var(--lb-text-sm)", fontWeight: 600, color: "var(--lb-text-secondary)", marginLeft: "3px" }}>{unit}</span>
      </p>
      <p style={{ fontSize: "var(--lb-text-xs)", color: "var(--lb-text-secondary)", marginTop: "6px", fontWeight: 600 }}>{label}</p>
      {ideal && <p style={{ fontSize: "var(--lb-text-2xs)", color: "var(--lb-text-muted)", marginTop: "3px" }}>Ideal: {ideal}</p>}
      {sub && <p style={{ fontSize: "var(--lb-text-2xs)", color: "var(--lb-text-muted)", marginTop: "3px" }}>{sub}</p>}
    </Card>
  );
}
