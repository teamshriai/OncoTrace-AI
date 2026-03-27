import useInView from "../hooks/useInView";

const team = [
  {
    name: "Senapathi Palanisamy",
    role: "CEO & Founder",
    bio: "Founder of ViSolve and founder of Senas.net Pvt. Ltd",
    initials: "SP",
  },
  {
    name: "Vimal Prasath",
    role: "Researcher & Developer",
    bio: "Built realtime AI Oxidative stress prediction",
    initials: "VP",
  },
  {
    name: "Sri Vathsav",
    role: "Researcher & Developer",
    bio: "Built realtime AI Oxidative stress prediction",
    initials: "SV",
  },
  {
    name: "Anand Jyothis",
    role: "Researcher & Developer Engineering",
    bio: "Built realtime AI Oxidative stress prediction",
    initials: "AJ",
  },
  {
    name: "Thulasi",
    role: "Researcher & Developer Engineering",
    bio: "Built realtime AI Oxidative stress prediction",
    initials: "T",
  },
    {
    name: "Sri Minalini",
    role: "Researcher & Developer Engineering",
    bio: "Built realtime AI Oxidative stress prediction",
    initials: "SM",
  },
];

export default function TeamSection() {
  const [ref, inView] = useInView();

  return (
    <section id="team" className="scroll-mt-20 bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600">
            Our Team
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Built by clinicians &amp; Developers
          </h2>
          <p className="mt-4 text-base text-slate-500">
            A multidisciplinary team united by the belief that smarter data
            means healthier lives.
          </p>
        </div>

        <div
          ref={ref}
          className="mx-auto mt-16 grid max-w-4xl gap-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          {team.map((m, i) => (
            <div
              key={m.name}
              className={`rounded-2xl border border-slate-100 bg-slate-50 p-6 text-center transition-all duration-700 hover:shadow-md ${
                inView
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-lg font-bold text-emerald-700">
                {m.initials}
              </div>
              <h3 className="mt-4 text-sm font-bold text-slate-900">
                {m.name}
              </h3>
              <p className="mt-0.5 text-xs font-semibold text-emerald-600">
                {m.role}
              </p>
              <p className="mt-3 text-xs leading-relaxed text-slate-500">
                {m.bio}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}