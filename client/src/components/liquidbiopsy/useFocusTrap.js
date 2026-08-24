import { useEffect } from "react";

// Hand-rolled focus trap for the two dialog-like surfaces in this feature (the
// Terms modal and the mobile sidebar drawer) -- no modal/dialog dependency
// exists anywhere in this app, and pulling one in for two call sites isn't
// worth it. Cycles Tab/Shift+Tab within `containerRef` and closes on Escape.
export default function useFocusTrap(containerRef, isOpen, onClose) {
  useEffect(() => {
    if (!isOpen) return;
    const container = containerRef.current;
    if (!container) return;

    const FOCUSABLE = 'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const getFocusable = () => Array.from(container.querySelectorAll(FOCUSABLE)).filter((el) => !el.disabled);

    const focusables = getFocusable();
    (focusables[0] || container).focus();

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose?.();
        return;
      }
      if (e.key !== "Tab") return;
      const items = getFocusable();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown, true);
    return () => document.removeEventListener("keydown", handleKeyDown, true);
  }, [isOpen, containerRef, onClose]);
}
