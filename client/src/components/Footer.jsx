import { useState, useEffect, useCallback } from "react";

const FIELDS = [
  { name: "name", label: "Name", type: "text" },
  { name: "email", label: "Email", type: "email" },
  { name: "organization", label: "Organization", type: "text" },
];

function useWindowWidth() {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return width;
}

export default function Footer() {
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    organization: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const width = useWindowWidth();

  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const isDesktop = width >= 1024;

  useEffect(() => {
    const id = "inter-font";
    if (!document.getElementById(id)) {
      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap";
      document.head.appendChild(link);
    }
  }, []);

  const update = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
    setSubmitted(true);
    setForm({ name: "", email: "", organization: "", message: "" });
    setTimeout(() => setSubmitted(false), 4000);
  };

  const handleCopy = useCallback(() => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText("info@oncotraceai.org");
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const handleScheduleCall = useCallback(() => {
    const ctaSection = document.getElementById("cta");
    if (ctaSection) {
      const offset = 108 + 8;
      const top =
        ctaSection.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    }
  }, []);

  const navigationLinks = [
    { label: "How It Works", href: "#mammogram" },
    { label: "Benefits", href: "#liquid-biopsy" },
    { label: "Features", href: "#case-study" },
    { label: "Team", href: "#team" },
  ];

  const legalLinks = [
    { label: "Terms of Service", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Cookies Settings", href: "#" },
  ];

  const socialLinks = [
    { name: "LinkedIn", handle: "oncotraceai", icon: LinkedInIcon },
    { name: "Call", handle: "+1 408.850.2243", icon: PhoneIcon },
  ];

  return (
    <>
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }

        @keyframes floatReverse {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(20px) rotate(-5deg);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.05);
          }
        }

        .floating-shape {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          opacity: 0.4;
        }

        .shape-1 {
          width: 400px;
          height: 400px;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          top: 10%;
          left: 5%;
          animation: float 8s ease-in-out infinite;
        }

        .shape-2 {
          width: 350px;
          height: 350px;
          background: linear-gradient(135deg, #06b6d4, #3b82f6);
          top: 50%;
          right: 10%;
          animation: floatReverse 10s ease-in-out infinite;
        }

        .shape-3 {
          width: 300px;
          height: 300px;
          background: linear-gradient(135deg, #8b5cf6, #ec4899);
          bottom: 10%;
          left: 40%;
          animation: float 12s ease-in-out infinite;
        }

        .grid-pattern {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
          background-size: 50px 50px;
          opacity: 0.5;
        }

        @media (max-width: 768px) {
          .floating-shape {
            filter: blur(40px);
          }
          .shape-1 {
            width: 250px;
            height: 250px;
          }
          .shape-2 {
            width: 200px;
            height: 200px;
          }
          .shape-3 {
            width: 180px;
            height: 180px;
          }
        }
      `}</style>

      {/* ─────────────────────────── COMBINED SECTION ─────────────────────────── */}
      <div
        className="relative overflow-hidden font-[Inter] text-white"
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
        }}
      >
        {/* Background Graphics - Shared across both sections */}
        <div className="floating-shape shape-1" style={{ animationDelay: "0s" }} />
        <div className="floating-shape shape-2" style={{ animationDelay: "2s" }} />
        <div className="floating-shape shape-3" style={{ animationDelay: "4s" }} />
        
        {/* Grid Pattern */}
        <div className="grid-pattern" />

        {/* Additional Decorative Elements */}
        <div
          style={{
            position: "absolute",
            top: "15%",
            right: "15%",
            width: "200px",
            height: "200px",
            border: "2px solid rgba(59, 130, 246, 0.2)",
            borderRadius: "50%",
            animation: "pulse 4s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "20%",
            left: "10%",
            width: "150px",
            height: "150px",
            border: "2px solid rgba(139, 92, 246, 0.2)",
            borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
            animation: "floatReverse 6s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "40%",
            left: "20%",
            width: "180px",
            height: "180px",
            border: "2px solid rgba(6, 182, 212, 0.2)",
            borderRadius: "50%",
            animation: "pulse 5s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "35%",
            right: "20%",
            width: "220px",
            height: "220px",
            border: "2px solid rgba(236, 72, 153, 0.2)",
            borderRadius: "50%",
            animation: "float 7s ease-in-out infinite",
          }}
        />

        {/* ─────────────────────────── CTA SECTION ─────────────────────────── */}
        <section
          id="cta"
          className="relative min-h-screen"
        >
          <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8 sm:px-6">
            <div className="w-full max-w-[460px] rounded-lg border border-white/10 bg-white/5 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.45)] backdrop-blur-md sm:p-10 md:max-w-[560px] lg:max-w-[620px]">
              <div className="mb-9">
                <p className="mb-3 text-[10px] tracking-[0.2em] text-white/40">
                  BUILD TOGETHER
                </p>
                <h2 className="mb-2.5 text-[28px] font-semibold text-white sm:text-[30px]">
                  Partner With Us
                </h2>
                <p className="text-[13px] leading-6 text-white/65">
                  Interested in a partnership? Reach out to us.
                </p>
              </div>

              <div className="mb-8 h-px bg-white/10" />

              <form onSubmit={handleSubmit} className="flex flex-col gap-[18px]">
                {FIELDS.map((field) => (
                  <div key={field.name} className="flex flex-col gap-1.5">
                    <label
                      htmlFor={field.name}
                      className="text-[10px] tracking-[0.1em] text-white/45"
                    >
                      {field.label}
                    </label>
                    <input
                      id={field.name}
                      name={field.name}
                      type={field.type}
                      value={form[field.name]}
                      onChange={update}
                      required
                      className="w-full rounded border border-white/10 bg-white/5 px-3.5 py-3 text-white outline-none transition placeholder:text-white/25 focus:border-blue-500/70 focus:bg-white/10"
                    />
                  </div>
                ))}

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="message"
                    className="text-[10px] tracking-[0.1em] text-white/45"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={form.message}
                    onChange={update}
                    className="w-full rounded border border-white/10 bg-white/5 px-3.5 py-3 text-white outline-none transition placeholder:text-white/25 focus:border-blue-500/70 focus:bg-white/10"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-2 rounded bg-blue-600 px-4 py-3 text-[12px] tracking-[0.12em] text-white transition hover:-translate-y-0.5 hover:bg-blue-700"
                >
                  SEND MESSAGE
                </button>

                {submitted && (
                  <p className="mt-1 text-center text-[12px] text-emerald-300">
                    Thanks! We&apos;ll be in touch.
                  </p>
                )}
              </form>
            </div>
          </div>
        </section>

        {/* ─────────────────────────── FOOTER SECTION ─────────────────────────── */}
        <footer
          className="relative"
          style={{
            fontFamily:
              "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', 'Inter', 'Helvetica Neue', Arial, sans-serif",
          }}
        >
          {/* Main content */}
          <div
            className="relative z-10 px-4 sm:px-6 lg:px-8 py-6 lg:py-8"
            style={{ maxWidth: "1400px", margin: "0 auto" }}
          >
            {/* Glassmorphic container */}
            <div
              className="backdrop-blur-xl rounded-3xl overflow-hidden"
              style={{
                background: "rgba(255, 255, 255, 0.12)",
                border: "1px solid rgba(255, 255, 255, 0.18)",
                boxShadow:
                  "0 8px 32px 0 rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.05) inset, 0 2px 4px 0 rgba(0, 0, 0, 0.05)",
              }}
            >
              {/* Grid layout */}
              <div
                className={`grid gap-6 p-5 sm:p-6 lg:p-8 ${
                  isMobile
                    ? "grid-cols-1"
                    : isTablet
                    ? "grid-cols-2"
                    : "grid-cols-3"
                }`}
              >
                {/* Column 1: Brand & Contact */}
                <div className="flex flex-col gap-5">
                  {/* Logo & Tagline */}
                  <div>
                    <h2
                      className="text-white font-bold tracking-tight mb-3"
                      style={{
                        fontSize: isMobile ? "26px" : "30px",
                        letterSpacing: "-0.5px",
                      }}
                    >
                      OncoTrace-<span style={{ color: "#60a5fa" }}>AI</span>
                    </h2>
                    <p
                      className="text-blue-100 leading-relaxed"
                      style={{
                        fontSize: isMobile ? "15px" : "16px",
                        fontWeight: "400",
                        opacity: 0.95,
                        lineHeight: "1.6",
                      }}
                    >
                      Precision oncology intelligence that is open, accessible,
                      and built for every community.
                    </p>
                  </div>

                  {/* Contact Email */}
                  <div>
                    <p
                      className="text-blue-200 uppercase tracking-wider mb-3"
                      style={{
                        fontSize: "12px",
                        fontWeight: "600",
                        opacity: 0.85,
                        letterSpacing: "0.5px",
                      }}
                    >
                      Contact Us
                    </p>
                    <div
                      onClick={handleCopy}
                      className="group inline-flex items-center gap-2 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200"
                      style={{
                        background: "rgba(255, 255, 255, 0.1)",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        backdropFilter: "blur(10px)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          "rgba(255, 255, 255, 0.15)";
                        e.currentTarget.style.borderColor =
                          "rgba(255, 255, 255, 0.25)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                          "rgba(255, 255, 255, 0.1)";
                        e.currentTarget.style.borderColor =
                          "rgba(255, 255, 255, 0.15)";
                      }}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") handleCopy();
                      }}
                      aria-label="Copy email address"
                    >
                      <EmailIcon />
                      <a
                        href="mailto:info@oncotraceai.org"
                        className="text-white font-medium"
                        style={{ fontSize: "14px", textDecoration: "none" }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        info@oncotraceai.org
                      </a>
                      <span
                        className="text-blue-300 transition-opacity duration-200 ml-auto"
                        style={{ fontSize: "16px" }}
                      >
                        {copied ? "✓" : "⎘"}
                      </span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={handleScheduleCall}
                    className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold transition-all duration-200 self-start"
                    style={{
                      fontSize: "15px",
                      background: "rgba(59, 130, 246, 0.2)",
                      border: "1px solid rgba(59, 130, 246, 0.3)",
                      color: "#fff",
                      backdropFilter: "blur(10px)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        "linear-gradient(135deg, #3b82f6, #1d4ed8)";
                      e.currentTarget.style.borderColor = "transparent";
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow =
                        "0 8px 20px rgba(59, 130, 246, 0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        "rgba(59, 130, 246, 0.2)";
                      e.currentTarget.style.borderColor =
                        "rgba(59, 130, 246, 0.3)";
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <CalendarIcon />
                    Schedule a call now
                    <ArrowRightIcon />
                  </button>
                </div>

                {/* Column 2: Navigation Links */}
                <div className="flex flex-col gap-5">
                  {/* Quick Links */}
                  <div>
                    <p
                      className="text-blue-200 uppercase tracking-wider mb-3"
                      style={{
                        fontSize: "12px",
                        fontWeight: "600",
                        opacity: 0.85,
                        letterSpacing: "0.5px",
                      }}
                    >
                      Quick Links
                    </p>
                    <nav className="flex flex-col gap-2">
                      {navigationLinks.map((link) => (
                        <a
                          key={link.label}
                          href={link.href}
                          className="text-white transition-all duration-200 inline-flex items-center gap-2 group"
                          style={{
                            fontSize: "15px",
                            fontWeight: "400",
                            opacity: 0.9,
                            textDecoration: "none",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.opacity = "1";
                            e.currentTarget.style.paddingLeft = "8px";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.opacity = "0.9";
                            e.currentTarget.style.paddingLeft = "0";
                          }}
                        >
                          <span
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            style={{ color: "#60a5fa", fontSize: "14px" }}
                          >
                            →
                          </span>
                          {link.label}
                        </a>
                      ))}
                    </nav>
                  </div>

                  {/* Legal Links */}
                  <div>
                    <p
                      className="text-blue-200 uppercase tracking-wider mb-3"
                      style={{
                        fontSize: "12px",
                        fontWeight: "600",
                        opacity: 0.85,
                        letterSpacing: "0.5px",
                      }}
                    >
                      Information
                    </p>
                    <nav className="flex flex-col gap-2">
                      {legalLinks.map((link) => (
                        <a
                          key={link.label}
                          href={link.href}
                          className="text-white transition-all duration-200 inline-flex items-center gap-2 group"
                          style={{
                            fontSize: "15px",
                            fontWeight: "400",
                            opacity: 0.9,
                            textDecoration: "none",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.opacity = "1";
                            e.currentTarget.style.paddingLeft = "8px";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.opacity = "0.9";
                            e.currentTarget.style.paddingLeft = "0";
                          }}
                        >
                          <span
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            style={{ color: "#60a5fa", fontSize: "14px" }}
                          >
                            →
                          </span>
                          {link.label}
                        </a>
                      ))}
                    </nav>
                  </div>

                  {/* Social Links */}
                  <div>
                    <p
                      className="text-blue-200 uppercase tracking-wider mb-3"
                      style={{
                        fontSize: "12px",
                        fontWeight: "600",
                        opacity: 0.85,
                        letterSpacing: "0.5px",
                      }}
                    >
                      Reach Us
                    </p>
                    <div className="flex flex-col gap-2">
                      {socialLinks.map((social) => (
                        <a
                          key={social.name}
                          href="#"
                          className="group flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200"
                          style={{
                            background: "rgba(255, 255, 255, 0.08)",
                            border: "1px solid rgba(255, 255, 255, 0.12)",
                            textDecoration: "none",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background =
                              "rgba(255, 255, 255, 0.12)";
                            e.currentTarget.style.borderColor =
                              "rgba(255, 255, 255, 0.2)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background =
                              "rgba(255, 255, 255, 0.08)";
                            e.currentTarget.style.borderColor =
                              "rgba(255, 255, 255, 0.12)";
                          }}
                        >
                          <span
                            className="flex items-center gap-2.5 text-white font-medium"
                            style={{ fontSize: "14px" }}
                          >
                            <social.icon />
                            {social.name}
                          </span>
                          <span
                            className="text-blue-300"
                            style={{ fontSize: "13px", opacity: 0.85 }}
                          >
                            {social.handle}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Column 3: Map & Address */}
                <div
                  className={`flex flex-col gap-5 ${
                    isTablet ? "col-span-2" : ""
                  }`}
                >
                  <div>
                    <p
                      className="text-blue-200 uppercase tracking-wider mb-3"
                      style={{
                        fontSize: "12px",
                        fontWeight: "600",
                        opacity: 0.85,
                        letterSpacing: "0.5px",
                      }}
                    >
                      Our Location
                    </p>

                    {/* Map */}
                    <div
                      className="rounded-2xl overflow-hidden mb-4"
                      style={{
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
                        height: isMobile
                          ? "220px"
                          : isTablet
                          ? "240px"
                          : "200px",
                        maxWidth:
                          isMobile ? "100%" : isTablet ? "400px" : "100%",
                      }}
                    >
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.566960307229!2d76.98685017639728!3d10.996022489166432!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba859fb5b93f923%3A0x8dad57dab1d7cae9!2sVisolve!5e1!3m2!1sen!2sin!4v1775796154311!5m2!1sen!2sin"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="OncoTrace AI Location"
                      />
                    </div>

                    {/* Address */}
                    <div
                      className="px-5 py-4 rounded-xl"
                      style={{
                        background: "rgba(255, 255, 255, 0.1)",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        backdropFilter: "blur(10px)",
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <LocationIcon />
                        <div>
                          <p
                            className="text-white font-semibold mb-1.5"
                            style={{ fontSize: "15px" }}
                          >
                            Visolve
                          </p>
                          <p
                            className="text-blue-100 leading-relaxed"
                            style={{
                              fontSize: "14px",
                              opacity: 0.9,
                              lineHeight: "1.6",
                            }}
                          >
                            Olymbus, Rukmani Nagar,
                            <br />
                            Ramanathapuram, Coimbatore,
                            <br />
                            Tamil Nadu 641045
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div
                style={{
                  height: "1px",
                  background:
                    "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15) 30%, rgba(255, 255, 255, 0.15) 70%, transparent)",
                  margin: "0 20px",
                }}
              />

              {/* Bottom bar */}
              <div
                className={`flex items-center justify-between gap-4 px-5 sm:px-6 lg:px-8 py-5 ${
                  isMobile ? "flex-col text-center" : "flex-row"
                }`}
              >
                {/* Brand badge */}
                <div
                  className="inline-flex items-center px-5 py-2.5 rounded-lg"
                  style={{
                    background: "rgba(255, 255, 255, 0.1)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <span
                    className="font-bold tracking-tight"
                    style={{
                      fontSize: isMobile ? "17px" : "19px",
                      color: "#e2e8f0",
                      letterSpacing: "-0.3px",
                    }}
                  >
                    OncoTrace-<span style={{ color: "#60a5fa" }}>AI</span>
                  </span>
                </div>

                {/* Copyright */}
                <p
                  className="text-blue-200"
                  style={{ fontSize: "13px", opacity: 0.8, margin: 0 }}
                >                  © 2026 OncoTrace-AI • All rights reserved • v18.04.2026
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

// ─────────────────────────── Icon Components ───────────────────────────

function LinkedInIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-blue-300"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-blue-300"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-blue-300"
    >
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="flex-shrink-0 mt-0.5 text-blue-300"
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="transition-transform duration-200 group-hover:translate-x-1"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
} 