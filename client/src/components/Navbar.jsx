import { useState, useEffect, useRef, useCallback } from "react";

const NAV_LINKS = [
  { label: "Home", href: "#" },
  {
    label: "Products",
    href: "#mammogram",
    dropdown: [
      { label: "Mammogram", href: "#mammogram", icon: "🩺", desc: "AI-powered breast imaging analysis" },
      { label: "Liquid Biopsy", href: "#liquid-biopsy", icon: "🔬", desc: "Non-invasive cancer detection" },
    ],
  },
  { label: "About us", href: "#solution" },
  { label: "Research", href: "#case-study" },
  { label: "Team", href: "#team" },
  { label: "Contact", href: "#cta" },
];

const SECTION_IDS = ["#mammogram", "#liquidbiopsy", "#solution", "#case-study", "#team", "#cta"];

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

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="18" x2="20" y2="18" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function ChevronDown({ open }) {
  return (
    <svg
      width="12" height="12" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      style={{
        marginLeft: "4px",
        transition: "transform 0.25s ease",
        transform: open ? "rotate(180deg)" : "rotate(0deg)",
        flexShrink: 0,
      }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      className="shrink-0"
    >
      <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" stroke="none" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      className="shrink-0"
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      className="shrink-0"
    >
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

export default function Navbar({ currentPage = 'home', onNavigate, isDemoPage = false }) {
  const [active, setActive] = useState("#");
  const [menuOpen, setMenuOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [atTop, setAtTop] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);

  const lastScrollY = useRef(0);
  const hideTimer = useRef(null);
  const ticking = useRef(false);
  const clickLock = useRef(false);
  const mobileRef = useRef(null);
  const dropdownRef = useRef(null);
  const dropdownTimer = useRef(null);

  // Reset states when page changes
  useEffect(() => {
    setMenuOpen(false);
    setMobileProductsOpen(false);
    setDropdownOpen(false);
    setVisible(true);
    if (isDemoPage) {
      setActive("demo");
    } else {
      setActive("#");
    }
  }, [currentPage, isDemoPage]);

  useEffect(() => {
    if (isDemoPage) return; // Don't track sections on demo page
    const onScroll = () => {
      if (clickLock.current) return;
      const scrollY = window.scrollY;
      if (scrollY < 200) { setActive("#"); return; }
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
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [isDemoPage]);

  useEffect(() => {
    const HIDE_DELAY = 2500;
    const scheduleHide = () => {
      clearTimeout(hideTimer.current);
      hideTimer.current = setTimeout(() => {
        if (window.scrollY > 80 && !isDemoPage) setVisible(false);
      }, HIDE_DELAY);
    };
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setAtTop(y < 80);
        setVisible(true);
        if (y >= 80 && !isDemoPage) scheduleHide();
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
  }, [isDemoPage]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) {
        setMenuOpen(false);
        setMobileProductsOpen(false);
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e) => {
      if (mobileRef.current && !mobileRef.current.contains(e.target)) {
        setMenuOpen(false);
        setMobileProductsOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [menuOpen]);

  useEffect(() => {
    if (!dropdownOpen) return;
    const onClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [dropdownOpen]);

  const handleNav = useCallback((e, href) => {
    e.preventDefault();
    setMenuOpen(false);
    setMobileProductsOpen(false);
    setDropdownOpen(false);

    // If on demo page and clicking a nav link, go home first
    if (isDemoPage && href !== "demo") {
      onNavigate?.('home');
      // Small delay to let the page render, then scroll
      setTimeout(() => {
        if (href !== "#") {
          scrollToId(href);
        }
      }, 100);
      return;
    }

    setActive(href);
    clickLock.current = true;
    setTimeout(() => { clickLock.current = false; }, 1400);
    requestAnimationFrame(() => scrollToId(href));
  }, [isDemoPage, onNavigate]);

  const handleDemoToggle = useCallback((e) => {
    e.preventDefault();
    setMenuOpen(false);
    setMobileProductsOpen(false);
    setDropdownOpen(false);

    if (isDemoPage) {
      onNavigate?.('home');
    } else {
      onNavigate?.('demo');
    }
  }, [isDemoPage, onNavigate]);

  const handleLogoClick = useCallback((e) => {
    e.preventDefault();
    setMenuOpen(false);
    setMobileProductsOpen(false);
    setDropdownOpen(false);

    if (isDemoPage) {
      onNavigate?.('home');
    } else {
      setActive("#");
      clickLock.current = true;
      setTimeout(() => { clickLock.current = false; }, 1400);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [isDemoPage, onNavigate]);

  const productHrefs = ["#mammogram", "#liquidbiopsy"];
  const isProductsActive = productHrefs.includes(active);

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

  const activeStyle = {
    background: "rgba(37,99,235,0.22)",
    border: "1px solid rgba(37,99,235,0.40)",
    color: "#ffffff",
    fontWeight: 500,
    boxShadow: "0 2px 12px rgba(37,99,235,0.28), inset 0 1px 0 rgba(255,255,255,0.06)",
  };

  const inactiveStyle = {
    border: "1px solid transparent",
    color: "rgba(160,190,255,0.58)",
    fontWeight: 400,
  };

  const LogoBlock = () => (
    <a
      href="#"
      onClick={handleLogoClick}
      className="pointer-events-auto shrink-0 no-underline flex items-center"
      style={{ gap: "clamp(10px, 1.8vw, 14px)" }}
    >
      <img
        src="/onco-logo.png"
        alt="OncoTraceAI logo"
        style={{
          width: "clamp(60px, 8.25vw, 84px)",
          height: "clamp(60px, 8.25vw, 84px)",
          objectFit: "contain",
          flexShrink: 0,
          filter:
            "drop-shadow(0 4px 14px rgba(37,99,235,0.35)) drop-shadow(0 2px 6px rgba(0,0,0,0.5))",
        }}
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
      />

      <div
        className="relative flex items-center"
        style={{
          ...glassStyle,
          padding: "clamp(8px, 1.2vw, 10px) clamp(14px, 2vw, 22px)",
          borderRadius: "999px",
        }}
      >
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={innerGlow}
        />
        <span
          className="relative z-10 whitespace-nowrap leading-none font-bold tracking-tight"
          style={{ fontSize: "clamp(13px, 1.8vw, 16px)" }}
        >
          <span style={{ color: "#e8185a" }}>Onco</span>
          <span style={{ color: "#4c82f7" }}>Trace</span>
          <span style={{ color: "#e8185a" }}>AI</span>
        </span>
      </div>
    </a>
  );

  // Demo page button styles
  const demoButtonBaseStyle = {
    height: "clamp(44px, 6vw, 52px)",
    border: "1px solid",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  };

  const viewDemoStyle = {
    ...demoButtonBaseStyle,
    background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
    borderColor: "rgba(16,185,129,0.48)",
    boxShadow: "0 0 22px rgba(16,185,129,0.38), 0 3px 10px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.12)",
  };

  const goHomeStyle = {
    ...demoButtonBaseStyle,
    background: "linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%)",
    borderColor: "rgba(59,130,246,0.48)",
    boxShadow: "0 0 22px rgba(37,99,235,0.38), 0 3px 10px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.12)",
  };

  const viewDemoHoverStyle = {
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    boxShadow: "0 0 32px rgba(16,185,129,0.55), 0 5px 18px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15)",
  };

  const goHomeHoverStyle = {
    background: "linear-gradient(135deg, #3b82f6 0%, #2563EB 100%)",
    boxShadow: "0 0 32px rgba(37,99,235,0.55), 0 5px 18px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15)",
  };

  // Mobile demo button styles
  const mobileDemoStyle = isDemoPage
    ? {
        background: "linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%)",
        border: "1px solid rgba(59,130,246,0.40)",
        boxShadow: "0 0 20px rgba(37,99,235,0.30)",
      }
    : {
        background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
        border: "1px solid rgba(16,185,129,0.40)",
        boxShadow: "0 0 20px rgba(16,185,129,0.30)",
      };

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
      <div className="relative flex items-center justify-between w-full max-w-[1280px] mx-auto">
        <LogoBlock />

        {/* Desktop Nav Links - Hidden on Demo Page */}
        {!isDemoPage && (
          <ul
            className="
              pointer-events-auto
              hidden lg:flex items-center gap-0.5 list-none m-0 shrink-0
              absolute left-1/2 -translate-x-1/2
              px-1.5 py-1.5 rounded-full
            "
            style={{
              ...glassStyle,
              background: "rgba(4,12,32,0.85)",
              height: "clamp(44px, 6vw, 52px)",
            }}
          >
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={innerGlow}
            />

            {NAV_LINKS.map((link) => {
              const isActive = link.dropdown
                ? isProductsActive
                : active === link.href;

              if (link.dropdown) {
                return (
                  <li
                    key={link.label}
                    className="relative z-10"
                    ref={dropdownRef}
                  >
                    <button
                      onClick={() => setDropdownOpen((o) => !o)}
                      onMouseEnter={() => {
                        clearTimeout(dropdownTimer.current);
                        setDropdownOpen(true);
                      }}
                      onMouseLeave={() => {
                        dropdownTimer.current = setTimeout(
                          () => setDropdownOpen(false),
                          180
                        );
                      }}
                      className="
                        inline-flex items-center
                        px-4 xl:px-5 py-[7px] rounded-full
                        text-[13px] xl:text-[13.5px] leading-none whitespace-nowrap
                        cursor-pointer transition-all duration-200
                        bg-transparent outline-none
                      "
                      style={isActive ? activeStyle : inactiveStyle}
                    >
                      {link.label}
                      <ChevronDown open={dropdownOpen} />
                    </button>

                    <div
                      onMouseEnter={() => {
                        clearTimeout(dropdownTimer.current);
                        setDropdownOpen(true);
                      }}
                      onMouseLeave={() => {
                        dropdownTimer.current = setTimeout(
                          () => setDropdownOpen(false),
                          180
                        );
                      }}
                      className="absolute top-[calc(100%+10px)] left-1/2 -translate-x-1/2"
                      style={{
                        width: "260px",
                        pointerEvents: dropdownOpen ? "auto" : "none",
                        opacity: dropdownOpen ? 1 : 0,
                        transform: `translateX(-50%) translateY(${dropdownOpen ? "0px" : "-8px"})`,
                        transition: "opacity 0.22s ease, transform 0.22s ease",
                      }}
                    >
                      <div
                        className="absolute left-1/2 -translate-x-1/2"
                        style={{
                          top: "-6px",
                          width: 0,
                          height: 0,
                          borderLeft: "7px solid transparent",
                          borderRight: "7px solid transparent",
                          borderBottom: "7px solid rgba(37,99,235,0.28)",
                          zIndex: 1,
                        }}
                      />
                      <div
                        className="absolute left-1/2 -translate-x-1/2"
                        style={{
                          top: "-5px",
                          width: 0,
                          height: 0,
                          borderLeft: "6px solid transparent",
                          borderRight: "6px solid transparent",
                          borderBottom: "6px solid rgba(4,10,28,0.97)",
                          zIndex: 2,
                        }}
                      />

                      <div
                        className="relative rounded-[18px] overflow-hidden p-1.5"
                        style={{
                          background: "rgba(4,10,28,0.97)",
                          backdropFilter: "blur(28px) saturate(180%)",
                          WebkitBackdropFilter: "blur(28px) saturate(180%)",
                          border: "1px solid rgba(37,99,235,0.28)",
                          boxShadow:
                            "0 0 40px rgba(37,99,235,0.14), 0 20px 50px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.04)",
                        }}
                      >
                        {link.dropdown.map((item) => {
                          const isItemActive = active === item.href;
                          return (
                            <a
                              key={item.href}
                              href={item.href}
                              onClick={(e) => handleNav(e, item.href)}
                              className="flex items-start gap-3 px-4 py-3 rounded-[13px] no-underline cursor-pointer transition-all duration-200 group"
                              style={{
                                background: isItemActive
                                  ? "rgba(37,99,235,0.16)"
                                  : "transparent",
                                border: isItemActive
                                  ? "1px solid rgba(37,99,235,0.30)"
                                  : "1px solid transparent",
                              }}
                              onMouseEnter={(e) => {
                                if (!isItemActive) {
                                  e.currentTarget.style.background =
                                    "rgba(37,99,235,0.10)";
                                  e.currentTarget.style.border =
                                    "1px solid rgba(37,99,235,0.18)";
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!isItemActive) {
                                  e.currentTarget.style.background =
                                    "transparent";
                                  e.currentTarget.style.border =
                                    "1px solid transparent";
                                }
                              }}
                            >
                              <span
                                className="text-[18px] leading-none mt-0.5 shrink-0"
                                style={{
                                  filter:
                                    "drop-shadow(0 0 6px rgba(37,99,235,0.5))",
                                }}
                              >
                                {item.icon}
                              </span>
                              <div>
                                <div
                                  className="text-[13px] font-medium leading-none mb-1"
                                  style={{
                                    color: isItemActive
                                      ? "#fff"
                                      : "rgba(210,225,255,0.90)",
                                  }}
                                >
                                  {item.label}
                                </div>
                                <div
                                  className="text-[11.5px] leading-snug"
                                  style={{
                                    color: "rgba(140,170,220,0.55)",
                                  }}
                                >
                                  {item.desc}
                                </div>
                              </div>
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  </li>
                );
              }

              return (
                <li key={link.label} className="relative z-10">
                  <a
                    href={link.href}
                    onClick={(e) => handleNav(e, link.href)}
                    className="inline-flex items-center px-4 xl:px-5 py-[7px] rounded-full text-[13px] xl:text-[13.5px] leading-none whitespace-nowrap no-underline cursor-pointer transition-all duration-200"
                    style={isActive ? activeStyle : inactiveStyle}
                    onMouseEnter={(e) => {
                      if (!isActive)
                        e.currentTarget.style.color =
                          "rgba(210,225,255,0.88)";
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive)
                        e.currentTarget.style.color =
                          "rgba(160,190,255,0.58)";
                    }}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>
        )}

        {/* Demo page - centered label */}
        {isDemoPage && (
          <div
            className="
              pointer-events-none
              hidden lg:flex items-center justify-center
              absolute left-1/2 -translate-x-1/2
              px-6 py-2.5 rounded-full
            "
            style={{
              ...glassStyle,
              background: "rgba(4,12,32,0.85)",
              height: "clamp(44px, 6vw, 52px)",
            }}
          >
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={innerGlow}
            />
            <span
              className="relative z-10 text-[13.5px] font-medium tracking-wide whitespace-nowrap"
              style={{ color: "rgba(210,225,255,0.90)" }}
            >
              <span className="inline-flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Interactive Demo
              </span>
            </span>
          </div>
        )}

        {/* Right side buttons */}
        <div className="relative flex items-center gap-2 sm:gap-2.5 shrink-0 z-10">

          {/* Desktop: View Demo / Go Home button */}
          <button
            onClick={handleDemoToggle}
            className="
              pointer-events-auto
              hidden lg:inline-flex items-center gap-2
              px-6 xl:px-7 rounded-full
              text-[13px] xl:text-[13.5px] font-medium tracking-wide text-white
              no-underline cursor-pointer whitespace-nowrap
              transition-all duration-300 ease-out
              hover:-translate-y-px active:translate-y-0 active:scale-[0.98]
            "
            style={isDemoPage ? goHomeStyle : viewDemoStyle}
            onMouseEnter={(e) => {
              const hoverStyle = isDemoPage ? goHomeHoverStyle : viewDemoHoverStyle;
              e.currentTarget.style.background = hoverStyle.background;
              e.currentTarget.style.boxShadow = hoverStyle.boxShadow;
            }}
            onMouseLeave={(e) => {
              const baseStyle = isDemoPage ? goHomeStyle : viewDemoStyle;
              e.currentTarget.style.background = baseStyle.background;
              e.currentTarget.style.boxShadow = baseStyle.boxShadow;
            }}
          >
            {isDemoPage ? (
              <>
                <ArrowLeftIcon />
                <span>Go Home</span>
              </>
            ) : (
              <>
                <PlayIcon />
                <span>View Demo</span>
              </>
            )}
          </button>

          {/* Desktop: Partner with us - only on home */}
          {!isDemoPage && (
            <a
              href="#cta"
              onClick={(e) => handleNav(e, "#cta")}
              className="
                pointer-events-auto
                hidden lg:inline-flex items-center
                px-6 xl:px-7 rounded-full
                text-[13px] xl:text-[13.5px] font-medium tracking-wide text-white
                no-underline cursor-pointer whitespace-nowrap
                transition-all duration-200
                hover:-translate-y-px active:translate-y-0
              "
              style={{
                height: "clamp(44px, 6vw, 52px)",
                background:
                  "linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%)",
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
              Partner with us
            </a>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
            className="
              pointer-events-auto
              lg:hidden flex items-center justify-center
              w-[42px] h-[42px] rounded-full cursor-pointer
              transition-all duration-200 active:scale-90
            "
            style={{
              border: "1px solid rgba(37,99,235,0.30)",
              background: menuOpen
                ? "rgba(37,99,235,0.20)"
                : "rgba(37,99,235,0.10)",
              color: "rgba(160,200,255,0.85)",
            }}
          >
            <span
              className="transition-transform duration-300"
              style={{
                transform: menuOpen ? "rotate(90deg)" : "rotate(0)",
              }}
            >
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        ref={mobileRef}
        className={`
          lg:hidden pointer-events-auto
          absolute left-4 right-4 sm:left-5 sm:right-5
          rounded-[22px] overflow-hidden
          transition-all duration-300 ease-in-out
          ${
            menuOpen
              ? "opacity-100 max-h-[700px] translate-y-0 scale-100"
              : "opacity-0 max-h-0 -translate-y-3 scale-[0.98] pointer-events-none"
          }
        `}
        style={{
          top: "calc(100% + 8px)",
          background: "rgba(4,10,28,0.96)",
          backdropFilter: "blur(28px) saturate(180%)",
          WebkitBackdropFilter: "blur(28px) saturate(180%)",
          border: menuOpen
            ? "1px solid rgba(37,99,235,0.20)"
            : "1px solid transparent",
          boxShadow: menuOpen
            ? "0 0 32px rgba(37,99,235,0.14), 0 20px 60px rgba(0,0,0,0.60)"
            : "none",
          fontFamily: "'DM Sans', sans-serif",
          transformOrigin: "top center",
        }}
      >
        {/* If on demo page, show simplified mobile menu */}
        {isDemoPage ? (
          <>
            {/* Demo indicator */}
            <div
              className="flex items-center gap-2.5 px-6 py-4"
              style={{
                borderBottom: "1px solid rgba(37,99,235,0.09)",
                color: "rgba(160,190,255,0.62)",
              }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[14px] font-medium text-emerald-400">Interactive Demo</span>
            </div>

            {/* Go Home button */}
            <div className="px-5 py-4">
              <button
                onClick={handleDemoToggle}
                className="flex items-center justify-center gap-2 w-full py-3 px-6 rounded-full text-[13.5px] font-medium text-white text-center no-underline cursor-pointer transition-all duration-200 active:scale-[0.97]"
                style={mobileDemoStyle}
              >
                <ArrowLeftIcon />
                <span>Go Home</span>
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Regular nav links */}
            {NAV_LINKS.map((link, i) => {
              const isActive = link.dropdown
                ? isProductsActive
                : active === link.href;
              const isLast = i === NAV_LINKS.length - 1;

              if (link.dropdown) {
                return (
                  <div key={link.label}>
                    <button
                      onClick={() => setMobileProductsOpen((o) => !o)}
                      className="w-full flex items-center justify-between px-6 py-4 text-[14px] leading-none cursor-pointer transition-all duration-200 bg-transparent outline-none"
                      style={{
                        borderBottom: "1px solid rgba(37,99,235,0.09)",
                        color: isActive
                          ? "#ffffff"
                          : "rgba(160,190,255,0.62)",
                        fontWeight: isActive ? 500 : 400,
                        background: isActive
                          ? "rgba(37,99,235,0.08)"
                          : "transparent",
                      }}
                    >
                      <span>{link.label}</span>
                      <ChevronDown open={mobileProductsOpen} />
                    </button>

                    <div
                      style={{
                        maxHeight: mobileProductsOpen ? "200px" : "0px",
                        overflow: "hidden",
                        transition: "max-height 0.3s ease",
                      }}
                    >
                      {link.dropdown.map((item, idx) => {
                        const isItemActive = active === item.href;
                        return (
                          <a
                            key={item.href}
                            href={item.href}
                            onClick={(e) => handleNav(e, item.href)}
                            className="flex items-center gap-3 pl-10 pr-6 py-3.5 text-[13.5px] no-underline cursor-pointer transition-all duration-200"
                            style={{
                              borderBottom:
                                idx < link.dropdown.length - 1
                                  ? "1px solid rgba(37,99,235,0.06)"
                                  : "1px solid rgba(37,99,235,0.09)",
                              color: isItemActive
                                ? "#ffffff"
                                : "rgba(140,170,220,0.70)",
                              fontWeight: isItemActive ? 500 : 400,
                              background: isItemActive
                                ? "rgba(37,99,235,0.10)"
                                : "rgba(255,255,255,0.015)",
                            }}
                            onMouseEnter={(e) => {
                              if (!isItemActive) {
                                e.currentTarget.style.color = "#fff";
                                e.currentTarget.style.background =
                                  "rgba(37,99,235,0.08)";
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isItemActive) {
                                e.currentTarget.style.color =
                                  "rgba(140,170,220,0.70)";
                                e.currentTarget.style.background =
                                  "rgba(255,255,255,0.015)";
                              }
                            }}
                          >
                            <span className="text-[16px] shrink-0">
                              {item.icon}
                            </span>
                            <div>
                              <div className="leading-none mb-0.5">
                                {item.label}
                              </div>
                              <div
                                className="text-[11px] leading-snug"
                                style={{
                                  color: "rgba(120,150,200,0.50)",
                                }}
                              >
                                {item.desc}
                              </div>
                            </div>
                            {isItemActive && (
                              <span
                                className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"
                                style={{
                                  boxShadow:
                                    "0 0 8px rgba(37,99,235,0.6)",
                                }}
                              />
                            )}
                          </a>
                        );
                      })}
                    </div>
                  </div>
                );
              }

              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNav(e, link.href)}
                  className="flex items-center justify-between px-6 py-4 text-[14px] leading-none no-underline cursor-pointer transition-all duration-200"
                  style={{
                    borderBottom: !isLast
                      ? "1px solid rgba(37,99,235,0.09)"
                      : "none",
                    color: isActive
                      ? "#ffffff"
                      : "rgba(160,190,255,0.62)",
                    fontWeight: isActive ? 500 : 400,
                    background: isActive
                      ? "rgba(37,99,235,0.08)"
                      : "transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = "#fff";
                      e.currentTarget.style.background =
                        "rgba(37,99,235,0.07)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color =
                        "rgba(160,190,255,0.62)";
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-blue-500"
                      style={{
                        boxShadow: "0 0 8px rgba(37,99,235,0.6)",
                      }}
                    />
                  )}
                </a>
              );
            })}

            {/* Mobile bottom buttons */}
            <div className="px-5 py-3 flex flex-col gap-2.5">
              {/* View Demo button */}
              <button
                onClick={handleDemoToggle}
                className="flex items-center justify-center gap-2 w-full py-3 px-6 rounded-full text-[13.5px] font-medium text-white text-center cursor-pointer transition-all duration-200 active:scale-[0.97]"
                style={mobileDemoStyle}
              >
                <PlayIcon />
                <span>View Demo</span>
              </button>

              {/* Partner with us button */}
              <a
                href="#cta"
                onClick={(e) => handleNav(e, "#cta")}
                className="block w-full py-3 px-6 rounded-full text-[13.5px] font-medium text-white text-center no-underline cursor-pointer transition-all duration-200 active:scale-[0.97]"
                style={{
                  background:
                    "linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%)",
                  border: "1px solid rgba(59,130,246,0.40)",
                  boxShadow: "0 0 20px rgba(37,99,235,0.30)",
                }}
              >
                Partner with us
              </a>
            </div>
          </>
        )}
      </div>
    </header>
  );
}