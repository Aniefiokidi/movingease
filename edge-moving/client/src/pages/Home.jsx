import { Link } from "react-router-dom";

const REASONS = [
  {
    icon: "✓",
    title: "Licensed & Insured",
    desc: "Fully licensed and insured so your belongings are protected throughout the entire move.",
  },
  {
    icon: "✓",
    title: "Experienced Team",
    desc: "Our trained movers handle everything with care — from fragile items to heavy furniture.",
  },
  {
    icon: "✓",
    title: "Reliable & On Time",
    desc: "We show up when we say we will, communicate clearly, and see every job through.",
  },
  {
    icon: "✓",
    title: "Transparent Process",
    desc: "No surprises. We discuss every detail before move day so you feel confident.",
  },
  {
    icon: "✓",
    title: "Local Expertise",
    desc: "We know New Brunswick. From Moncton to Fredericton, we operate across the province.",
  },
  {
    icon: "✓",
    title: "Personalized Service",
    desc: "Every move is different. We tailor our approach to your specific situation and needs.",
  },
];

const STEPS = [
  {
    number: "01",
    title: "Submit Your Request",
    desc: "Fill out our simple booking form with your move details. It takes less than two minutes.",
  },
  {
    number: "02",
    title: "We Contact You",
    desc: "Our team reviews your request and reaches out within 24 hours to discuss the details.",
  },
  {
    number: "03",
    title: "We Handle the Rest",
    desc: "On move day, our professional crew arrives on time and gets the job done right.",
  },
];

export default function Home() {
  return (
    <main>
      {/* ─── Hero ─── */}
      <section className="relative min-h-screen flex items-center" style={{ background: "linear-gradient(135deg, #111c30 0%, #1B2A4A 50%, #243250 100%)" }}>
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />

        {/* Gold accent line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#B8924A]/40 to-transparent" />

        <div className="section-wrap relative z-10 py-32 md:py-40">
          <div className="max-w-3xl">
            <p className="text-[11px] uppercase tracking-[0.25em] text-[#B8924A] font-medium mb-6">
              Edge Moving Solution Ltd. — New Brunswick
            </p>
            <h1 className="serif text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6">
              Moving Made Simple,<br />
              <span className="text-[#B8924A]">Done Right.</span>
            </h1>
            <p className="text-lg text-white/60 leading-relaxed max-w-xl mb-10">
              Tell us about your move. We'll take care of the rest — professionally, reliably, and on your schedule.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/book"
                className="inline-flex items-center gap-2 bg-[#B8924A] hover:bg-[#a07d3f] text-white font-semibold px-8 py-4 rounded-sm transition-all text-sm tracking-wide"
              >
                Request a Quote
                <span className="text-lg leading-none">→</span>
              </Link>
              <a
                href="tel:5064719393"
                className="inline-flex items-center gap-2 border border-white/20 hover:border-white/40 text-white/75 hover:text-white font-medium px-8 py-4 rounded-sm transition-all text-sm"
              >
                Call 506‑471‑9393
              </a>
            </div>
          </div>

          {/* Stats bar */}
          <div className="mt-20 pt-10 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "1,200+", label: "Moves Completed" },
              { value: "4.9 / 5", label: "Customer Rating" },
              { value: "98%", label: "On-Time Delivery" },
              { value: "24 hrs", label: "Response Time" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-white/40 mt-1 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How it works ─── */}
      <section className="section-wrap py-24">
        <div className="mb-14">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#B8924A] font-medium mb-3">Simple Process</p>
          <h2 className="serif text-4xl font-bold text-[#1B2A4A]">How It Works</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-0 md:gap-px bg-transparent md:bg-[#E4E1DA]">
          {STEPS.map((step, i) => (
            <div key={step.number} className={`bg-[#F7F6F3] p-10 ${i < 2 ? "mb-px md:mb-0" : ""}`}>
              <div className="text-5xl font-bold text-[#1B2A4A]/10 mb-6 serif">{step.number}</div>
              <h3 className="text-lg font-semibold text-[#1B2A4A] mb-3">{step.title}</h3>
              <p className="text-sm text-[#1B2A4A]/55 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Why choose us ─── */}
      <section className="bg-[#1B2A4A]">
        <div className="section-wrap py-24">
          <div className="mb-14">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#B8924A] font-medium mb-3">Why Edge Moving</p>
            <h2 className="serif text-4xl font-bold text-white">The Standard You Deserve</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10">
            {REASONS.map((r) => (
              <div key={r.title} className="bg-[#1B2A4A] p-8">
                <div className="w-7 h-7 rounded-sm bg-[#B8924A]/20 flex items-center justify-center text-[#B8924A] text-sm font-bold mb-5">
                  {r.icon}
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{r.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA band ─── */}
      <section className="section-wrap py-24">
        <div className="rounded-sm bg-[#F0EDE6] border border-[#E4E1DA] px-10 py-14 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="serif text-3xl md:text-4xl font-bold text-[#1B2A4A] mb-3">
              Ready to plan your move?
            </h2>
            <p className="text-[#1B2A4A]/55 text-sm leading-relaxed max-w-md">
              Fill out our quick request form and we'll be in touch within 24 hours with everything you need.
            </p>
          </div>
          <div className="flex-shrink-0">
            <Link
              to="/book"
              className="inline-flex items-center gap-2 bg-[#1B2A4A] hover:bg-[#243859] text-white font-semibold px-8 py-4 rounded-sm transition-all text-sm tracking-wide whitespace-nowrap"
            >
              Book Your Move
              <span className="text-lg leading-none">→</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
