import { useEffect, useState } from "react";

const FIELDS = [
  { name: "name", label: "Name", type: "text" },
  { name: "email", label: "Email", type: "email" },
  { name: "organization", label: "Organization", type: "text" },
];

export default function CTASection() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    organization: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

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
    setForm({
      name: "",
      email: "",
      organization: "",
      message: "",
    });
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-black font-[Inter] text-white">
      {/* Background image - covers fully on all screen sizes */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/download.jpg')" }}
      />

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/35" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-16 sm:px-6">
        <div className="w-full max-w-[460px] rounded-lg border border-white/10 bg-white/5 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.45)] backdrop-blur-md sm:p-10 md:max-w-[560px] lg:max-w-[620px]">
          <div className="mb-9">
            <p className="mb-3 text-[10px] tracking-[0.2em] text-white/40">
              GET IN TOUCH
            </p>
            <h2 className="mb-2.5 text-[28px] font-semibold text-white sm:text-[30px]">
              Let&apos;s Connect
            </h2>
            <p className="text-[13px] leading-6 text-white/65">
              Interested in a demo, partnership, or learning more? Reach out to
              us.
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
                Thanks! We&apos;ll be in the touch.
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}