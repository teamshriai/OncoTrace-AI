import useInView from "../hooks/useInView";

const team = [
  {
    name: "Senapathi Palanisamy",
    role: "CEO & Founder",
    bio: "Founder of ViSolve, Senas.net Pvt. Ltd  \n Ex-Chairman of OpenEMR",
    initials: "SP",
  },
  {
    name: "Manoj Mittal",
    role: "Group Vice President, FP&A – Gartner",
    bio: "Finance leader specializing in FP&A, M&A, and corporate growth strategy.",
    initials: "MM",
  },
  {
    name: "Molecular Biologist",
    role: "Genomics & Biomarker Expert",
    bio: "Studies molecular mechanisms and biomarkers to enable precision-driven cancer insights.",
    initials: "MB",
  },
  {
    name: "Oncologist",
    role: "Cancer Care Specialist",
    bio: "Leads cancer diagnosis, treatment planning, and patient care strategies.",
    initials: "OC",
  },
  {
    name: "Pathologist",
    role: "Diagnostic Expert",
    bio: "Analyzes tissue and lab samples to detect disease at the cellular level.",
    initials: "PT",
  },
  {
    name: "Radiologist",
    role: "Imaging Specialist",
    bio: "Interprets medical imaging to identify abnormalities and guide treatment.",
    initials: "RL",
  },
];

export default function TeamSection() {
  const [ref, inView] = useInView();

  return (
    <section id="team" className="scroll-mt-20 bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">

        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            Our Team
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Built by clinicians, researchers & engineers
          </h2>
          <p className="mt-4 text-base text-slate-500">
            A multidisciplinary team united by the belief that smarter data means healthier lives.
          </p>
        </div>

        <div className="mt-12" ref={ref}>
          {/* First Row: Sena and Manoj */}
          <div className="mx-auto grid max-w-2xl gap-8 sm:grid-cols-2">
            {team.slice(0, 2).map((m, i) => (
              <div
                key={m.name}
                className={`rounded-2xl border border-slate-100 bg-slate-50 p-6 text-center transition-all duration-700 hover:shadow-md ${
                  inView ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                }`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-700">
                  {m.initials}
                </div>

                <h3 className="mt-4 text-sm font-bold text-slate-900">
                  {m.name}
                </h3>

                <p className="mt-0.5 text-xs font-semibold text-blue-600">
                  {m.role}
                </p>

                <p className="mt-3 text-xs leading-relaxed text-slate-500 whitespace-pre-line">
                  {m.bio}
                </p>
              </div>
            ))}
          </div>

          {/* Second Row: Rest of the team */}
          <div className="mx-auto mt-8 grid max-w-6xl gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {team.slice(2).map((m, i) => (
              <div
                key={m.name}
                className={`rounded-2xl border border-slate-100 bg-slate-50 p-6 text-center transition-all duration-700 hover:shadow-md ${
                  inView ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                }`}
                style={{ transitionDelay: `${(i + 2) * 100}ms` }}
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-700">
                  {m.initials}
                </div>

                <h3 className="mt-4 text-sm font-bold text-slate-900">
                  {m.name}
                </h3>

                <p className="mt-0.5 text-xs font-semibold text-blue-600">
                  {m.role}
                </p>

                <p className="mt-3 text-xs leading-relaxed text-slate-500 whitespace-pre-line">
                  {m.bio}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}