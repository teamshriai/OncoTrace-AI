// Icon components for the whole feature — merges what used to be Dashboard.jsx's
// `Icon` renderer and File.jsx's standalone icon components. Path data lives in
// ./iconPaths.js, kept separate so this file only exports components (React Fast
// Refresh requires that of any file exporting a component).

export const Icon = ({ d, size = 16, style = {}, strokeWidth = 1.5 }) => (
  <svg
    style={{ width: size, height: size, flexShrink: 0, ...style }}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={d} />
  </svg>
);

// Not reducible to a single `d` path (rect + path) — kept as its own component.
export const LockIcon = ({ size = 16, style = {} }) => (
  <svg
    style={{ width: size, height: size, flexShrink: 0, ...style }}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);

// Cancer-awareness ribbon, used as the small logo badge next to the
// OncoTrace-AI wordmark. Filled rather than stroked (unlike Icon) so the
// bow and tails stay legible at the ~16px size those badges render at.
export const RibbonIcon = ({ size = 16, style = {} }) => (
  <svg style={{ width: size, height: size, flexShrink: 0, ...style }} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 11 C9.5 7 5 6.5 5.5 10 C6 12.5 9.5 12.5 12 11 Z" />
    <path d="M12 11 C14.5 7 19 6.5 18.5 10 C18 12.5 14.5 12.5 12 11 Z" />
    <path d="M10.7 11.5 L6.5 21 L9 19.3 L11 22 L11.5 12 Z" />
    <path d="M13.3 11.5 L17.5 21 L15 19.3 L13 22 L12.5 12 Z" />
    <circle cx="12" cy="10.5" r="1.6" />
  </svg>
);
