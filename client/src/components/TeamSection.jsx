import useInView from "../hooks/useInView";

const founder = {
  name: "Sena Palanisamy",
  role: "CEO & Founder",
  bio: "Founder of ViSolve and founder of Senas.net Pvt. Ltd",
  initials: "SP",
};

const advisory = [
  { name: "Anand Jyothis", role: "Advisory Board", bio: "Built realtime AI Oxidative stress prediction", initials: "AJ" },
  { name: "Vimal Prasath", role: "Advisory Board", bio: "Built realtime AI Oxidative stress prediction", initials: "VP" },
  { name: "Sri Vathsav", role: "Advisory Board", bio: "Built realtime AI Oxidative stress prediction", initials: "SV" },
];

const technical = [
  { name: "Thulasi", role: "Technical Board", bio: "Built realtime AI Oxidative stress prediction", initials: "T" },
  { name: "Sri Minalini", role: "Technical Board", bio: "Built realtime AI Oxidative stress prediction", initials: "SM" },
];

function Card({ member, delay, inView }) {
  return (
    <div
      className={`rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm transition-all duration-500 hover:shadow-md ${
        inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
        {member.initials}
      </div>
      <h3 className="mt-3 text-sm font-semibold text-slate-900">{member.name}</h3>
      <p className="mt-0.5 text-xs font-medium text-blue-600">{member.role}</p>
      <p className="mt-2 text-xs leading-relaxed text-slate-500">{member.bio}</p>
    </div>
  );
}

export default function TeamSection() {
  const [ref, inView] = useInView(0.1);

  return (
    <section id="team" className="scroll-mt-20 bg-slate-50 py-24" ref={ref}>
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">Our Team</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900">Built by clinicians &amp; developers</h2>
          <p className="mt-3 text-sm text-slate-500">A multidisciplinary team united by the belief that smarter data means healthier lives.</p>
        </div>

        <div className="mt-16">
          <h3 className="mb-6 text-center text-xs font-semibold uppercase tracking-widest text-slate-400">Founder</h3>
          <div className="mx-auto max-w-xs">
            <Card member={founder} delay={0} inView={inView} />
          </div>
        </div>

        <div className="mt-16">
          <h3 className="mb-6 text-center text-xs font-semibold uppercase tracking-widest text-slate-400">Advisory Board</h3>
          <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-3">
            {advisory.map((m, i) => (
              <Card key={m.name} member={m} delay={(i + 1) * 100} inView={inView} />
            ))}
          </div>
        </div>

        <div className="mt-16">
          <h3 className="mb-6 text-center text-xs font-semibold uppercase tracking-widest text-slate-400">Technical Board</h3>
          <div className="mx-auto grid max-w-2xl gap-6 sm:grid-cols-2">
            {technical.map((m, i) => (
              <Card key={m.name} member={m} delay={(i + 4) * 100} inView={inView} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}