import { useState, useEffect, useRef, useCallback } from "react";

/* ── NAV_LINKS: href must match the wrapper id in App.jsx ── */
const NAV_LINKS = [
  { label: "Home",     href: "#"           },
  { label: "Products", href: "#solution"   },
  { label: "Impact",   href: "#impact"     },
  { label: "Research", href: "#case-study" },
  { label: "Team",     href: "#team"       },
  { label: "Contact",  href: "#cta"        },
];

/* ── all section ids for scroll-spy (skip "#") ── */
const SECTION_IDS = NAV_LINKS.filter((l) => l.href !== "#").map((l) => l.href);

/* ── smooth scroll helper ── */
function scrollToId(href) {
  if (href === "#") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  const el = document.querySelector(href);
  if (el) {
    const y = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: y, behavior: "smooth" });
  }
}

/* ── icons ── */
function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="6"  x2="20" y2="6"  />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="18" x2="20" y2="18" />
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6"  x2="6"  y2="18" />
      <line x1="6"  y1="6"  x2="18" y2="18" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
export default function Navbar() {
  const [active, setActive]     = useState("#");
  const [menuOpen, setMenuOpen] = useState(false);
  const [visible, setVisible]   = useState(true);
  const [atTop, setAtTop]       = useState(true);

  const lastScrollY  = useRef(0);
  const hideTimer    = useRef(null);
  const ticking      = useRef(false);
  const clickLock    = useRef(false);   // blocks scroll-spy briefly after click
  const mobileRef    = useRef(null);

  /* ─────────────────────────────────────────────
     1. SCROLL-SPY — highlights the visible section
     ───────────────────────────────────────────── */
  useEffect(() => {
    const onScroll = () => {
      if (clickLock.current) return;

      const scrollY = window.scrollY;

      // at the very top → Home
      if (scrollY < 200) {
        setActive("#");
        return;
      }

      let current = "#";
      for (const id of SECTION_IDS) {
        const el = document.querySelector(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top + scrollY - 200;
        if (scrollY >= top) current = id;
      }
      setActive(current);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // initial check
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ─────────────────────────────────────────────
     2. SHOW / HIDE navbar on scroll + mouse
     ───────────────────────────────────────────── */
  useEffect(() => {
    const HIDE_DELAY = 2500;

    const scheduleHide = () => {
      clearTimeout(hideTimer.current);
      hideTimer.current = setTimeout(() => {
        if (window.scrollY > 80) setVisible(false);
      }, HIDE_DELAY);
    };

    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setAtTop(y < 80);
        setVisible(true);
        if (y >= 80) scheduleHide();
        else clearTimeout(hideTimer.current);
        lastScrollY.current = y;
        ticking.current = false;
      });
    };

    const onMouse = (e) => {
      if (e.clientY < 100) {
        setVisible(true);
        clearTimeout(hideTimer.current);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouse, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouse);
      clearTimeout(hideTimer.current);
    };
  }, []);

  /* ─────────────────────────────────────────────
     3. AUTO-CLOSE mobile menu on resize / outside
     ───────────────────────────────────────────── */
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 1024) setMenuOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e) => {
      if (mobileRef.current && !mobileRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [menuOpen]);

  /* ─────────────────────────────────────────────
     4. CLICK HANDLER
     ───────────────────────────────────────────── */
  const handleNav = useCallback((e, href) => {
    e.preventDefault();
    setMenuOpen(false);
    setActive(href);

    // lock scroll-spy so it doesn't fight the animated scroll
    clickLock.current = true;
    setTimeout(() => { clickLock.current = false; }, 1400);

    // small delay so mobile menu closes visually first
    requestAnimationFrame(() => scrollToId(href));
  }, []);

  /* ─────────────────────────────────────────────
     STYLES
     ───────────────────────────────────────────── */
  const glassStyle = {
    background: "rgba(4, 12, 32, 0.85)",
    backdropFilter: "blur(28px) saturate(180%)",
    WebkitBackdropFilter: "blur(28px) saturate(180%)",
    border: "1px solid rgba(37, 99, 235, 0.28)",
    boxShadow:
      "0 0 48px rgba(37,99,235,0.10), 0 10px 36px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)",
  };

  const innerGlow = {
    background: "linear-gradient(180deg, rgba(37,99,235,0.09) 0%, transparent 55%)",
  };

  /* ═════════════════════════════════════════════
     RENDER
     ═════════════════════════════════════════════ */
  return (
    <header
      className={`
        fixed inset-x-0 top-0 z-50
        pointer-events-none
        px-4 sm:px-5 pt-3 sm:pt-4 pb-0
        transition-transform duration-500 ease-in-out
        ${visible ? "translate-y-0" : "-translate-y-[120%]"}
      `}
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <div className="relative flex items-center justify-between w-full max-w-[1280px] mx-auto h-[56px] sm:h-[60px]">

        {/* ════════ LOGO ════════ */}
        <a
          href="#"
          onClick={(e) => handleNav(e, "#")}
          className="
            pointer-events-auto relative z-10
            flex items-center gap-2 sm:gap-2.5 shrink-0 no-underline
            h-[44px] sm:h-[48px] px-4 sm:px-5 rounded-full
          "
          style={glassStyle}
        >
          <div className="absolute inset-0 rounded-full pointer-events-none" style={innerGlow} />
          <img
            src="/onco-logo.png"
            alt="OncoTraceAI"
            className="relative z-10 w-7 h-7 sm:w-8 sm:h-8 object-contain rounded-md shrink-0"
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />
          <span
            className="relative z-10 text-[14px] sm:text-[15.5px] font-bold tracking-tight whitespace-nowrap leading-none"
            style={{ color: "rgba(255,255,255,0.94)" }}
          >
            Onco<span style={{ color: "#2563EB" }}>TraceAI</span>
          </span>
        </a>

        {/* ════════ DESKTOP CENTER LINKS ════════ */}
        <ul
          className="
            pointer-events-auto
            hidden lg:flex items-center gap-0.5 list-none m-0 shrink-0
            absolute left-1/2 -translate-x-1/2
            px-1.5 py-1.5 rounded-full h-[48px]
          "
          style={{ ...glassStyle, background: "rgba(4,12,32,0.85)" }}
        >
          <div className="absolute inset-0 rounded-full pointer-events-none" style={innerGlow} />

          {NAV_LINKS.map((link) => {
            const isActive = active === link.href;
            return (
              <li key={link.label} className="relative z-10">
                <a
                  href={link.href}
                  onClick={(e) => handleNav(e, link.href)}
                  className="
                    inline-flex items-center
                    px-4 xl:px-5 py-[7px] rounded-full
                    text-[13px] xl:text-[13.5px] leading-none whitespace-nowrap
                    no-underline cursor-pointer
                    transition-all duration-200
                  "
                  style={
                    isActive
                      ? {
                          background: "rgba(37,99,235,0.22)",
                          border: "1px solid rgba(37,99,235,0.40)",
                          color: "#ffffff",
                          fontWeight: 500,
                          boxShadow:
                            "0 2px 12px rgba(37,99,235,0.28), inset 0 1px 0 rgba(255,255,255,0.06)",
                        }
                      : {
                          border: "1px solid transparent",
                          color: "rgba(160,190,255,0.58)",
                          fontWeight: 400,
                        }
                  }
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.color = "rgba(210,225,255,0.88)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.color = "rgba(160,190,255,0.58)";
                  }}
                >
                  {link.label}
                </a>
              </li>
            );
          })}
        </ul>

        {/* ════════ RIGHT SIDE ════════ */}
        <div className="relative flex items-center gap-2 sm:gap-2.5 shrink-0 z-10">
          {/* Desktop CTA */}
          <a
            href="#cta"
            onClick={(e) => handleNav(e, "#cta")}
            className="
              pointer-events-auto
              hidden lg:inline-flex items-center
              px-6 xl:px-7 py-2.5 rounded-full
              text-[13px] xl:text-[13.5px] font-medium tracking-wide text-white
              no-underline cursor-pointer whitespace-nowrap
              transition-all duration-200
              hover:-translate-y-px active:translate-y-0
            "
            style={{
              background: "linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%)",
              border: "1px solid rgba(59,130,246,0.48)",
              boxShadow:
                "0 0 22px rgba(37,99,235,0.38), 0 3px 10px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.12)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "linear-gradient(135deg, #3b82f6 0%, #2563EB 100%)";
              e.currentTarget.style.boxShadow =
                "0 0 32px rgba(37,99,235,0.55), 0 5px 18px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%)";
              e.currentTarget.style.boxShadow =
                "0 0 22px rgba(37,99,235,0.38), 0 3px 10px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.12)";
            }}
          >
            Get in Touch
          </a>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
            className="
              pointer-events-auto
              lg:hidden flex items-center justify-center
              w-[38px] h-[38px] rounded-full cursor-pointer
              transition-all duration-200 active:scale-90
            "
            style={{
              border: "1px solid rgba(37,99,235,0.30)",
              background: menuOpen ? "rgba(37,99,235,0.20)" : "rgba(37,99,235,0.10)",
              color: "rgba(160,200,255,0.85)",
            }}
          >
            <span
              className="transition-transform duration-300"
              style={{ transform: menuOpen ? "rotate(90deg)" : "rotate(0)" }}
            >
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </span>
          </button>
        </div>
      </div>

      {/* ════════ MOBILE DROPDOWN ════════ */}
      <div
        ref={mobileRef}
        className={`
          lg:hidden pointer-events-auto
          absolute top-[68px] sm:top-[76px] left-4 right-4 sm:left-5 sm:right-5
          rounded-[22px] overflow-hidden
          transition-all duration-300 ease-in-out
          ${menuOpen
            ? "opacity-100 max-h-[520px] translate-y-0 scale-100"
            : "opacity-0 max-h-0 -translate-y-3 scale-[0.98] pointer-events-none"
          }
        `}
        style={{
          background: "rgba(4,10,28,0.96)",
          backdropFilter: "blur(28px) saturate(180%)",
          WebkitBackdropFilter: "blur(28px) saturate(180%)",
          border: menuOpen ? "1px solid rgba(37,99,235,0.20)" : "1px solid transparent",
          boxShadow: menuOpen
            ? "0 0 32px rgba(37,99,235,0.14), 0 20px 60px rgba(0,0,0,0.60)"
            : "none",
          fontFamily: "'DM Sans', sans-serif",
          transformOrigin: "top center",
        }}
      >
        {NAV_LINKS.map((link, i) => {
          const isActive = active === link.href;
          return (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleNav(e, link.href)}
              className="
                flex items-center justify-between
                px-6 py-4 text-[14px] leading-none
                no-underline cursor-pointer
                transition-all duration-200
              "
              style={{
                borderBottom:
                  i < NAV_LINKS.length - 1
                    ? "1px solid rgba(37,99,235,0.09)"
                    : "none",
                color: isActive ? "#ffffff" : "rgba(160,190,255,0.62)",
                fontWeight: isActive ? 500 : 400,
                background: isActive ? "rgba(37,99,235,0.08)" : "transparent",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = "#fff";
                  e.currentTarget.style.background = "rgba(37,99,235,0.07)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = "rgba(160,190,255,0.62)";
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              <span>{link.label}</span>
              {isActive && (
                <span
                  className="w-1.5 h-1.5 rounded-full bg-blue-500"
                  style={{ boxShadow: "0 0 8px rgba(37,99,235,0.6)" }}
                />
              )}
            </a>
          );
        })}

        <div className="px-5 py-4">
          <a
            href="#cta"
            onClick={(e) => handleNav(e, "#cta")}
            className="
              block w-full py-3 px-6 rounded-full
              text-[13.5px] font-medium text-white text-center
              no-underline cursor-pointer
              transition-all duration-200 active:scale-[0.97]
            "
            style={{
              background: "linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%)",
              border: "1px solid rgba(59,130,246,0.40)",
              boxShadow: "0 0 20px rgba(37,99,235,0.30)",
            }}
          >
            Get in Touch
          </a>
        </div>
      </div>
    </header>
  );
}