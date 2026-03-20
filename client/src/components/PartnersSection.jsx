import useInView from "../hooks/useInView";

const partners = [
  "KMCH",
  "PSG",
  "Ganga",
  "Kupuswamy",
];

export default function PartnersSection() {
  const [ref, inView] = useInView();

  return (
    <section className="bg-slate-50 py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <p className="text-center text-sm font-semibold uppercase tracking-widest text-slate-400">
          Trusted by leading health organizations
        </p>

        <div
          ref={ref}
          className={`mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4 transition-all duration-700 ${
            inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          {partners.map((name) => (
            <div
              key={name}
              className="flex h-20 items-center justify-center rounded-xl border border-slate-200 bg-white text-lg font-bold tracking-tight text-slate-300 transition-colors hover:text-slate-500"
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}