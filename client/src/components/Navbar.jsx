import { useState, useEffect, useRef } from "react";

const NAV_LINKS = [
  { label: "Home",       href: "#"         },
  { label: "What We Do", href: "#solution" },
  { label: "Impact",     href: "#impact"   },
  { label: "Team",       href: "#team"     },
  { label: "Contact",    href: "#contact"  },
];

function scrollToSection(e, href, callback) {
  e.preventDefault();
  if (callback) callback();
  if (href === "#") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  const el = document.querySelector(href);
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: "smooth" });
  }
}

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

export default function Navbar() {
  const [active, setActive]     = useState("#");
  const [menuOpen, setMenuOpen] = useState(false);
  const [visible, setVisible]   = useState(true);
  const [atTop, setAtTop]       = useState(true);

  const lastScrollY  = useRef(0);
  const hideTimer    = useRef(null);
  const ticking      = useRef(false);

  useEffect(() => {
    const HIDE_DELAY = 2500;

    const scheduleHide = () => {
      clearTimeout(hideTimer.current);
      hideTimer.current = setTimeout(() => {
        if (window.scrollY > 80) {
          setVisible(false);
        }
      }, HIDE_DELAY);
    };

    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;

      requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const isAtTop  = currentY < 80;

        setAtTop(isAtTop);

        if (isAtTop) {
          setVisible(true);
          clearTimeout(hideTimer.current);
        } else {
          setVisible(true);
          scheduleHide();
        }

        lastScrollY.current = currentY;
        ticking.current = false;
      });
    };

    const onMouseMove = (e) => {
      if (e.clientY < 100) {
        setVisible(true);
        clearTimeout(hideTimer.current);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouseMove);
      clearTimeout(hideTimer.current);
    };
  }, []);

  const handleNav = (e, href) => {
    scrollToSection(e, href, () => setMenuOpen(false));
    setActive(href);
  };

  const glassStyle = {
    background: "rgba(4, 12, 32, 0.85)",
    backdropFilter: "blur(28px) saturate(180%)",
    WebkitBackdropFilter: "blur(28px) saturate(180%)",
    border: "1px solid rgba(37, 99, 235, 0.28)",
    boxShadow:
      "0 0 48px rgba(37,99,235,0.10), 0 10px 36px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)",
  };

  return (
    <header
      className={`
        fixed inset-x-0 top-0 z-50
        pointer-events-none
        px-5 pt-4 pb-0
        transition-transform duration-500 ease-in-out
        ${visible ? "translate-y-0" : "-translate-y-[120%]"}
      `}
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Invisible flex container — no background, no border, no shadow */}
      <div className="relative flex items-center justify-between w-full max-w-[1280px] mx-auto h-[60px]">

        {/* ── LOGO (independent pill) ── */}
        <a
          href="#"
          onClick={(e) => handleNav(e, "#")}
          className="
            pointer-events-auto
            relative z-10 flex items-center gap-2.5 shrink-0 no-underline
            h-[48px] px-5 rounded-full
          "
          style={glassStyle}
        >
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, rgba(37,99,235,0.09) 0%, transparent 55%)",
            }}
          />
          <img
            src="/onco-logo.png"
            alt="OncoTraceAI"
            className="relative z-10 w-8 h-8 object-contain rounded-md shrink-0"
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />
          <span
            className="relative z-10 text-[15.5px] font-bold tracking-tight whitespace-nowrap leading-none"
            style={{ color: "rgba(255,255,255,0.94)" }}
          >
            Onco
            <span style={{ color: "#2563EB" }}>TraceAI</span>
          </span>
        </a>

        {/* ── CENTER LINKS (independent pill) ── */}
        <ul
          className="
            pointer-events-auto
            hidden lg:flex items-center gap-0.5 list-none m-0 shrink-0
            absolute left-1/2 -translate-x-1/2
            px-1.5 py-1.5 rounded-full h-[48px]
          "
          style={{
            ...glassStyle,
            background: "rgba(4, 12, 32, 0.85)",
            border: "1px solid rgba(37,99,235,0.28)",
          }}
        >
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, rgba(37,99,235,0.09) 0%, transparent 55%)",
            }}
          />
          {NAV_LINKS.map((link) => (
            <li key={link.href} className="relative z-10">
              <a
                href={link.href}
                onClick={(e) => handleNav(e, link.href)}
                className={`
                  inline-flex items-center
                  px-5 py-[7px] rounded-full
                  text-[13.5px] leading-none whitespace-nowrap
                  no-underline cursor-pointer
                  transition-all duration-200
                `}
                style={
                  active === link.href
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
                  if (active !== link.href) {
                    e.currentTarget.style.color = "rgba(210,225,255,0.88)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (active !== link.href) {
                    e.currentTarget.style.color = "rgba(160,190,255,0.58)";
                  }
                }}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* ── RIGHT SIDE (independent pill) ── */}
        <div className="relative flex items-center gap-2.5 shrink-0 z-10">
          {/* CTA */}
          <a
            href="#contact"
            onClick={(e) => handleNav(e, "#contact")}
            className="
              pointer-events-auto
              hidden lg:inline-flex items-center
              px-7 py-2.5 rounded-full
              text-[13.5px] font-medium tracking-wide text-white
              no-underline cursor-pointer whitespace-nowrap
              transition-transform duration-200
              hover:-translate-y-px active:translate-y-0
            "
            style={{
              background: "linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%)",
              border: "1px solid rgba(59,130,246,0.48)",
              boxShadow:
                "0 0 22px rgba(37,99,235,0.38), 0 3px 10px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.12)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background =
                "linear-gradient(135deg, #3b82f6 0%, #2563EB 100%)";
              e.currentTarget.style.boxShadow =
                "0 0 32px rgba(37,99,235,0.55), 0 5px 18px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background =
                "linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%)";
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
              transition-colors duration-200
            "
            style={{
              border: "1px solid rgba(37,99,235,0.30)",
              background: "rgba(37,99,235,0.10)",
              color: "rgba(160,200,255,0.85)",
            }}
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* ── MOBILE DROPDOWN ── */}
      <div
        className={`
          lg:hidden pointer-events-auto
          absolute top-[76px] left-5 right-5
          rounded-[22px] overflow-hidden
          transition-all duration-300 ease-in-out
          ${menuOpen
            ? "opacity-100 max-h-[420px] translate-y-0"
            : "opacity-0 max-h-0 -translate-y-2 pointer-events-none"
          }
        `}
        style={{
          background: "rgba(4,10,28,0.96)",
          backdropFilter: "blur(28px) saturate(180%)",
          WebkitBackdropFilter: "blur(28px) saturate(180%)",
          border: "1px solid rgba(37,99,235,0.20)",
          boxShadow:
            "0 0 32px rgba(37,99,235,0.14), 0 20px 60px rgba(0,0,0,0.60)",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {NAV_LINKS.map((link, i) => (
          <a
            key={link.href}
            href={link.href}
            onClick={(e) => handleNav(e, link.href)}
            className="block px-6 py-4 text-[14px] leading-none no-underline cursor-pointer transition-all duration-150"
            style={{
              borderBottom:
                i < NAV_LINKS.length - 1
                  ? "1px solid rgba(37,99,235,0.09)"
                  : "none",
              color:
                active === link.href
                  ? "#ffffff"
                  : "rgba(160,190,255,0.62)",
              fontWeight: active === link.href ? 500 : 400,
              background:
                active === link.href
                  ? "rgba(37,99,235,0.08)"
                  : "transparent",
            }}
            onMouseEnter={(e) => {
              if (active !== link.href) {
                e.currentTarget.style.color = "#fff";
                e.currentTarget.style.background = "rgba(37,99,235,0.07)";
              }
            }}
            onMouseLeave={(e) => {
              if (active !== link.href) {
                e.currentTarget.style.color = "rgba(160,190,255,0.62)";
                e.currentTarget.style.background = "transparent";
              }
            }}
          >
            {link.label}
          </a>
        ))}

        <div className="px-5 py-4">
          <a
            href="#contact"
            onClick={(e) => handleNav(e, "#contact")}
            className="block w-full py-3 px-6 rounded-full text-[13.5px] font-medium text-white text-center no-underline cursor-pointer transition-all duration-200"
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