import { useEffect } from 'react';

export default function AboutSection() {
  useEffect(() => {
    const link = document.createElement('link');
    link.href =
      'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const pillars = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
          <path
            d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2v-4M9 21H5a2 2 0 01-2-2v-4m0 0h18"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      ),
      title: 'Next-Generation Sequencing (NGS)',
      desc: 'High-throughput genomic profiling across 500+ cancer-related gene panels with sub-0.01% VAF sensitivity.',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
          <path
            d="M3 3v18h18"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M7 16l4-6 4 4 5-8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      title: 'Longitudinal ctDNA Kinetic Analysis',
      desc: 'Continuous molecular monitoring across treatment cycles to capture tumor evolution in real time.',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
          <path
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M12 6v6l4 2"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      ),
      title: 'Survival & Time-to-Event Modeling',
      desc: 'Deep learning–driven prognostic models that predict clinical outcomes and inform therapeutic timing.',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
          <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M21 21l-4.35-4.35"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M11 8v6M8 11h6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      ),
      title: 'Explainable AI Decision Support',
      desc: 'Transparent, SHAP-powered clinical insights that are fully traceable and interpretable by clinicians.',
    },
  ];

  const stats = [
    { value: '12K+', label: 'Patients Monitored' },
    { value: '47', label: 'Clinical Partners' },
    { value: '3.1M', label: 'Biomarkers Analyzed' },
    { value: '99.2%', label: 'Sensitivity Rate' },
  ];

  return (
    <section
      id="about"
      className="relative overflow-hidden"
      style={{
        background:
          'linear-gradient(180deg, #ffffff 0%, #f8faff 40%, #f0f5ff 70%, #f8faff 100%)',
        fontFamily: '"Inter", sans-serif',
      }}
    >
      {/* Subtle decorative blobs */}
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(59,130,246,0.04) 0%, transparent 70%)',
          transform: 'translate(30%, -40%)',
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(99,102,241,0.03) 0%, transparent 70%)',
          transform: 'translate(-30%, 40%)',
        }}
      />

      <div className="max-w-6xl mx-auto px-6 py-24 lg:py-32 relative z-10">
        {/* Badge */}
        <div className="flex justify-center mb-8">
          <div
            className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full"
            style={{
              background: 'rgba(239, 246, 255, 0.8)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(59,130,246,0.12)',
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: '#3b82f6' }}
            />
            <span
              className="text-xs font-semibold tracking-widest uppercase"
              style={{ color: '#3b82f6', letterSpacing: '0.14em' }}
            >
              About Shri AI
            </span>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2
            style={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 700,
              fontSize: 'clamp(2.2rem, 5vw, 3.6rem)',
              lineHeight: 1.12,
              letterSpacing: '-0.02em',
              color: '#0f172a',
            }}
          >
            Transforming Oncology{' '}
            <span style={{ color: '#3b82f6' }}>Monitoring</span>
          </h2>
        </div>

        {/* Main content glass card */}
        <div
          className="rounded-3xl p-8 md:p-12 mb-16"
          style={{
            background: 'rgba(255, 255, 255, 0.55)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(59, 130, 246, 0.08)',
            boxShadow:
              '0 8px 40px -12px rgba(59, 130, 246, 0.08), 0 0 0 0.5px rgba(255,255,255,0.8) inset',
          }}
        >
          <div className="grid md:grid-cols-2 gap-10 md:gap-14">
            {/* Left column – problem & solution */}
            <div>
              <div
                className="inline-block px-3 py-1 rounded-md text-xs font-medium mb-5"
                style={{
                  background: 'rgba(59,130,246,0.06)',
                  color: '#3b82f6',
                  letterSpacing: '0.04em',
                }}
              >
                The Challenge
              </div>
              <p
                className="leading-relaxed mb-8"
                style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.8 }}
              >
                Cancer treatment decisions are often based on delayed imaging
                results and static biomarkers. This can limit the ability to
                identify treatment resistance or disease progression at an early
                stage.
              </p>

              <div
                className="inline-block px-3 py-1 rounded-md text-xs font-medium mb-5"
                style={{
                  background: 'rgba(16,185,129,0.06)',
                  color: '#059669',
                  letterSpacing: '0.04em',
                }}
              >
                Our Approach
              </div>
              <p
                className="leading-relaxed"
                style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.8 }}
              >
                Shri AI introduces dynamic molecular monitoring through liquid
                biopsy — analyzing circulating tumor DNA (ctDNA) to track tumor
                evolution over time, enabling earlier and more precise clinical
                decisions.
              </p>
            </div>

            {/* Right column – vision + stats */}
            <div className="flex flex-col justify-between">
              <div>
                <div
                  className="inline-block px-3 py-1 rounded-md text-xs font-medium mb-5"
                  style={{
                    background: 'rgba(99,102,241,0.06)',
                    color: '#6366f1',
                    letterSpacing: '0.04em',
                  }}
                >
                  Vision
                </div>
                <p
                  className="leading-relaxed"
                  style={{
                    color: '#475569',
                    fontSize: '0.95rem',
                    lineHeight: 1.8,
                  }}
                >
                  Our objective is to bridge research innovation with real-world
                  clinical application. The validation process will begin in the
                  United States, with a vision to deploy accessible and scalable
                  monitoring solutions in India and other global regions.
                </p>
              </div>

              {/* Stats row inside the card */}
              <div
                className="grid grid-cols-2 gap-4 mt-8 p-5 rounded-2xl"
                style={{
                  background: 'rgba(248, 250, 255, 0.8)',
                  border: '1px solid rgba(59,130,246,0.06)',
                }}
              >
                {stats.map((s, i) => (
                  <div key={i} className="text-center py-2">
                    <div
                      style={{
                        fontFamily: '"Playfair Display", serif',
                        fontWeight: 700,
                        fontSize: '1.5rem',
                        color: '#1e3a5f',
                        lineHeight: 1,
                      }}
                    >
                      {s.value}
                    </div>
                    <div
                      style={{
                        color: '#94a3b8',
                        fontSize: '0.7rem',
                        marginTop: '6px',
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        fontWeight: 500,
                      }}
                    >
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Integrated approach label */}
        <div className="text-center mb-10">
          <h3
            style={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 600,
              fontSize: '1.6rem',
              color: '#0f172a',
              letterSpacing: '-0.01em',
            }}
          >
            Our Integrated Approach
          </h3>
          <p
            className="mt-2 max-w-lg mx-auto"
            style={{ color: '#94a3b8', fontSize: '0.88rem' }}
          >
            Combining cutting-edge sequencing with intelligent analytics to
            redefine cancer monitoring.
          </p>
        </div>

        {/* Four pillar cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {pillars.map((p, i) => (
            <div
              key={p.title}
              className="group rounded-2xl p-6 cursor-default"
              style={{
                background: 'rgba(255,255,255,0.6)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(59,130,246,0.06)',
                boxShadow: '0 2px 16px -4px rgba(59,130,246,0.05)',
                transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.transform = 'translateY(-6px)';
                el.style.boxShadow =
                  '0 16px 48px -12px rgba(59,130,246,0.12)';
                el.style.borderColor = 'rgba(59,130,246,0.14)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.transform = 'translateY(0)';
                el.style.boxShadow =
                  '0 2px 16px -4px rgba(59,130,246,0.05)';
                el.style.borderColor = 'rgba(59,130,246,0.06)';
              }}
            >
              {/* Icon */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
                style={{
                  background: [
                    'linear-gradient(135deg, #eff6ff, #dbeafe)',
                    'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
                    'linear-gradient(135deg, #eef2ff, #e0e7ff)',
                    'linear-gradient(135deg, #f0f9ff, #dbeafe)',
                  ][i],
                  color: ['#3b82f6', '#0284c7', '#6366f1', '#2563eb'][i],
                }}
              >
                {p.icon}
              </div>

              <h4
                style={{
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 600,
                  fontSize: '0.92rem',
                  color: '#1e293b',
                  marginBottom: '0.5rem',
                  lineHeight: 1.35,
                }}
              >
                {p.title}
              </h4>
              <p
                style={{
                  color: '#94a3b8',
                  fontSize: '0.8rem',
                  lineHeight: 1.65,
                }}
              >
                {p.desc}
              </p>

              {/* Accent bar */}
              <div
                className="mt-5 h-[2px] rounded-full"
                style={{
                  width: '40px',
                  background: [
                    'rgba(59,130,246,0.25)',
                    'rgba(2,132,199,0.25)',
                    'rgba(99,102,241,0.25)',
                    'rgba(37,99,235,0.25)',
                  ][i],
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
          ))}
        </div>

        {/* Bottom highlight strip */}
        <div
          className="rounded-2xl px-8 py-7 flex flex-col md:flex-row items-center justify-between gap-6"
          style={{
            background: 'rgba(255, 255, 255, 0.5)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(59,130,246,0.08)',
            boxShadow: '0 4px 24px -8px rgba(59,130,246,0.06)',
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                boxShadow: '0 4px 14px -4px rgba(59,130,246,0.4)',
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="w-5 h-5 text-white"
              >
                <path
                  d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <h4
                style={{
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  color: '#1e293b',
                  marginBottom: '2px',
                }}
              >
                Clinical Validation Underway
              </h4>
              <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
                Starting in the United States — expanding to India & beyond.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              className="px-6 py-2.5 rounded-full text-sm font-semibold text-white"
              style={{
                background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
                boxShadow:
                  '0 4px 16px -4px rgba(59,130,246,0.4), inset 0 1px 0 rgba(255,255,255,0.15)',
                letterSpacing: '0.01em',
                transition: 'all 0.25s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  '0 8px 24px -4px rgba(59,130,246,0.5)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow =
                  '0 4px 16px -4px rgba(59,130,246,0.4), inset 0 1px 0 rgba(255,255,255,0.15)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Learn More
            </button>
            <button
              className="px-6 py-2.5 rounded-full text-sm font-medium"
              style={{
                background: 'rgba(255,255,255,0.7)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(59,130,246,0.12)',
                color: '#2563eb',
                letterSpacing: '0.01em',
                transition: 'all 0.25s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(59,130,246,0.25)';
                e.currentTarget.style.background = 'rgba(239,246,255,0.8)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(59,130,246,0.12)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.7)';
              }}
            >
              View Technology →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}