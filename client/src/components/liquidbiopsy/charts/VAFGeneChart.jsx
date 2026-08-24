import { useEffect, useRef } from "react";

// Kept hand-rolled (recharts' vertical bar layout needs more custom tick handling
// than this already gets right for 30+ categorical rows). Colors are read live
// from the CSS custom properties on the canvas element's computed style, since a
// <canvas> 2D context can't resolve var(...) itself the way SVG/DOM styling can.
function cssVar(el, name, fallback) {
  if (!el) return fallback;
  const v = getComputedStyle(el).getPropertyValue(name).trim();
  return v || fallback;
}

export default function VAFGeneChart({ data, theme }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const draw = () => {
      const ctx = canvas.getContext("2d");
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const W = rect.width, H = rect.height;
      const pad = { top: 8, right: 60, bottom: 8, left: 80 };
      const cW = W - pad.left - pad.right;
      const rowH = Math.max(14, (H - pad.top - pad.bottom) / data.length);

      const textMuted = cssVar(canvas, "--lb-text-muted", "#94a3b8");
      const textSecondary = cssVar(canvas, "--lb-text-secondary", "#64748b");
      const border = cssVar(canvas, "--lb-border", "rgba(148,163,184,0.15)");
      const low = cssVar(canvas, "--lb-status-low", "#34d399");
      const moderate = cssVar(canvas, "--lb-status-moderate", "#f0b429");
      const high = cssVar(canvas, "--lb-status-high", "#f56565");

      ctx.clearRect(0, 0, W, H);

      const thX = pad.left + 0.5 * cW;
      ctx.beginPath();
      ctx.setLineDash([3, 3]);
      ctx.moveTo(thX, pad.top);
      ctx.lineTo(thX, H - pad.bottom);
      ctx.strokeStyle = border;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = textMuted;
      ctx.font = "8px 'Plus Jakarta Sans',sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("50%", thX, pad.top + 8);

      data.forEach((d, i) => {
        const y = pad.top + i * rowH + rowH / 4;
        const bH = rowH * 0.5;
        const bW = Math.max(d.max_vaf * cW, 1);
        const color = d.max_vaf >= 0.5 ? high : d.max_vaf >= 0.2 ? moderate : low;
        ctx.beginPath();
        ctx.roundRect(pad.left, y, bW, bH, 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.fillStyle = textSecondary;
        ctx.font = "9px 'Plus Jakarta Sans',sans-serif";
        ctx.textAlign = "right";
        ctx.fillText(d.gene, pad.left - 4, y + bH / 2 + 3);
        ctx.fillStyle = color;
        ctx.font = "bold 9px 'Plus Jakarta Sans',sans-serif";
        ctx.textAlign = "left";
        ctx.fillText((d.max_vaf * 100).toFixed(1) + "%", pad.left + bW + 4, y + bH / 2 + 3);
      });
    };

    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [data, theme]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: "100%", height: `${Math.max(300, data.length * 18)}px`, display: "block" }}
    />
  );
}
