import { useState } from "react";
import useInView from "../hooks/useInView";

const team = [
  {
    name: "Senapathi Palanisamy",
    role: "CEO & Founder",
    bio: "Founder of ViSolve, Senas.net Pvt. Ltd  \n Ex-Chairman of OpenEMR",
    initials: "SP",
    detail: null,
  },
  {
    name: "Manoj Mittal",
    role: "Group Vice President, FP&A – Gartner",
    bio: "Finance leader specializing in FP&A, M&A, and corporate growth strategy.",
    initials: "MM",
    detail: `Manoj Mittal is a Strategic Finance leader with deep expertise in FP&A, corporate growth strategy, and M&A. He has a proven track record of defining and executing growth roadmaps that drive financial performance and long-term value creation.

As the Group Vice President of FP&A at Gartner, Manoj has managed $1B+ budgets and P&Ls of up to $1B in revenue with 35% BUC margins. During his tenures at Gartner and HP, he spearheaded several high-impact acquisitions, scaling businesses and driving 10%+ revenue CAGR.

His experience spans a rich variety of business models — including SaaS, subscription, digital markets, media, and entertainment — giving him a uniquely versatile perspective on growth and value creation.

Manoj holds an MBA from Harvard Business School, an M.S. from the University of Wisconsin, and a B.S. from the Indian Institute of Technology (IIT).`,
  },
  {
    name: "Molecular Biologist",
    role: "Genomics & Biomarker Expert",
    bio: "Studies molecular mechanisms and biomarkers to enable precision-driven cancer insights.",
    initials: "MB",
    detail: null,
  },
  {
    name: "Oncologist",
    role: "Cancer Care Specialist",
    bio: "Leads cancer diagnosis, treatment planning, and patient care strategies.",
    initials: "OC",
    detail: null,
  },
  {
    name: "Pathologist",
    role: "Diagnostic Expert",
    bio: "Analyzes tissue and lab samples to detect disease at the cellular level.",
    initials: "PT",
    detail: null,
  },
  {
    name: "Radiologist",
    role: "Imaging Specialist",
    bio: "Interprets medical imaging to identify abnormalities and guide treatment.",
    initials: "RL",
    detail: null,
  },
];

function TeamCard({ m, delay, inView }) {
  const [showDetail, setShowDetail] = useState(false);

  return (
    <>
      {/* Backdrop */}
      {showDetail && m.detail && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={() => setShowDetail(false)}
        />
      )}

      {/* Detail Modal */}
      {showDetail && m.detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="relative w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowDetail(false)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition"
              aria-label="Close"
            >
              ✕
            </button>

            {/* Avatar */}
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 text-2xl font-extrabold text-white shadow-lg">
              {m.initials}
            </div>

            {/* Name & Role */}
            <h3 className="mt-5 text-center text-xl font-bold text-slate-900">
              {m.name}
            </h3>
            <p className="mt-1 text-center text-sm font-semibold text-blue-600">
              {m.role}
            </p>

            {/* Divider */}
            <div className="my-5 h-px w-full bg-slate-100" />

            {/* Detail Text */}
            <div className="max-h-64 overflow-y-auto pr-1 custom-scrollbar">
              {m.detail.split("\n\n").map((para, idx) => (
                <p
                  key={idx}
                  className="mb-4 text-sm leading-relaxed text-slate-600 last:mb-0"
                >
                  {para}
                </p>
              ))}
            </div>

            {/* Education Badges */}
            <div className="mt-6 flex flex-wrap gap-2 justify-center">
              {["Harvard Business School", "Univ. of Wisconsin", "IIT"].map(
                (badge) => (
                  <span
                    key={badge}
                    className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-100"
                  >
                    {badge}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {/* Card */}
      <div
        onClick={() => m.detail && setShowDetail(true)}
        className={`group relative rounded-2xl border border-slate-100 bg-slate-50 p-6 text-center transition-all duration-700
          ${inView ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}
          ${
            m.detail
              ? "cursor-pointer hover:shadow-xl hover:border-blue-200 hover:bg-blue-50/40"
              : "hover:shadow-md"
          }
        `}
        style={{ transitionDelay: `${delay}ms` }}
      >
        {/* Clickable hint badge */}
        {m.detail && (
          <span className="absolute top-3 right-3 rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            View Profile
          </span>
        )}

        {/* Avatar */}
        <div
          className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full text-lg font-bold transition-transform duration-300 group-hover:scale-110
            ${m.detail ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-700"}
          `}
        >
          {m.initials}
        </div>

        {/* Name */}
        <h3 className="mt-4 text-sm font-bold text-slate-900">{m.name}</h3>

        {/* Role */}
        <p className="mt-0.5 text-xs font-semibold text-blue-600">{m.role}</p>

        {/* Bio */}
        <p className="mt-3 text-xs leading-relaxed text-slate-500 whitespace-pre-line">
          {m.bio}
        </p>

        {/* Click hint text */}
        {m.detail && (
          <p className="mt-3 text-[11px] font-medium text-blue-500 group-hover:text-blue-700 transition-colors">
            Click to learn more →
          </p>
        )}
      </div>
    </>
  );
}

export default function TeamSection() {
  const [ref, inView] = useInView();

  return (
    <section id="team" className="scroll-mt-20 bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            Our Team
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Built by clinicians, researchers & engineers
          </h2>
          <p className="mt-4 text-base text-slate-500">
            A multidisciplinary team united by the belief that smarter data
            means healthier lives.
          </p>
        </div>

        <div className="mt-12" ref={ref}>

          {/* First Row: Sena and Manoj */}
          <div className="mx-auto grid max-w-2xl gap-8 sm:grid-cols-2">
            {team.slice(0, 2).map((m, i) => (
              <TeamCard key={m.name} m={m} delay={i * 100} inView={inView} />
            ))}
          </div>

          {/* Second Row: Rest of the team */}
          <div className="mx-auto mt-8 grid max-w-6xl gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {team.slice(2).map((m, i) => (
              <TeamCard
                key={m.name}
                m={m}
                delay={(i + 2) * 100}
                inView={inView}
              />
            ))}
          </div>

        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 9999px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #bfdbfe;
          border-radius: 9999px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #93c5fd;
        }
      `}</style>
    </section>
  );
}