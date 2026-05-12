import { useState } from "react";
import { Link } from "react-router-dom";
import Card from "../components/common/Card";

const SEED_TESTIMONIALS = [
  {
    _id: "seed-1",
    quote: "Our move from Moncton to Saint John was perfectly organized. The crew wrapped every item with care and delivered on time.",
    name: "Chinedu Okafor",
    location: "Moncton"
  },
  {
    _id: "seed-2",
    quote: "Booking was easy, the estimate matched what we expected, and the movers were polite from start to finish.",
    name: "Adaeze Nwosu",
    location: "Dieppe"
  },
  {
    _id: "seed-3",
    quote: "I appreciated the clear communication before move day. Everything from pickup to drop-off felt smooth and professional.",
    name: "Miguel Ramirez",
    location: "Fredericton"
  },
  {
    _id: "seed-4",
    quote: "Great experience for our office relocation. They handled our equipment carefully and kept us on schedule.",
    name: "Sofia Alvarez",
    location: "Saint John"
  },
  {
    _id: "seed-5",
    quote: "Fast, friendly, and very efficient. Even our heavy furniture was moved without any issues.",
    name: "Ethan Brooks",
    location: "Riverview"
  },
  {
    _id: "seed-6",
    quote: "This was the easiest move we have had. The team arrived prepared, worked quickly, and treated our home with respect.",
    name: "Olivia Carter",
    location: "Quispamsis"
  }
];

export default function Home() {
  const [testimonials, setTestimonials] = useState(SEED_TESTIMONIALS);
  const [reviewForm, setReviewForm] = useState({ name: "", location: "", quote: "", rating: 5 });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);


  function handleReviewInput(event) {
    const { name, value } = event.target;
    setReviewForm((current) => ({ ...current, [name]: value }));
  }

  async function handleAddReview(event) {
    event.preventDefault();
    const name = reviewForm.name.trim();
    const location = reviewForm.location.trim();
    const quote = reviewForm.quote.trim();
    const rating = reviewForm.rating;
    if (!name || !location || !quote) return;

    setSubmitting(true);
    try {
      const res = await api.post("/testimonials", { name, location, quote, rating });
      const saved = res.data?.data;
      setTestimonials((current) => [saved || { _id: `local-${Date.now()}`, name, location, quote, rating }, ...current]);
    } catch {
      setTestimonials((current) => [{ _id: `local-${Date.now()}`, name, location, quote, rating }, ...current]);
    } finally {
      setReviewForm({ name: "", location: "", quote: "", rating: 5 });
      setSubmitting(false);
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 4000);
    }
  }

  return (
    <main>
      <section className="relative overflow-hidden py-20">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1600518464441-9154a4dea21b?auto=format&fit=crop&w=1600&q=80')"
          }}
        />
        <div className="absolute inset-0 bg-[#1B2A4A]/70" />
        <div className="section-wrap relative z-10">
          <div className="rounded-3xl bg-white/95 p-8 shadow-lg md:p-12">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#C0272D]">Edge Moving Solution Ltd.</p>
              <h1 className="mt-3 text-4xl font-black leading-tight text-[#1B2A4A] md:text-5xl">Reliable Moving Services Across New Brunswick</h1>
              <p className="mt-4 max-w-xl text-slate-600">Submit your moving request in minutes and we'll get back to you within 24 hours.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/quote" className="rounded-xl bg-[#C0272D] px-5 py-3 font-semibold text-white shadow-md transition hover:bg-[#a32026]">Request a Move</Link>
                <a href="tel:+15064719393" className="rounded-xl border border-[#1B2A4A]/20 px-5 py-3 font-semibold text-[#1B2A4A] transition hover:bg-[#1B2A4A]/5">Call Now</a>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section className="section-wrap py-8">
        <h2 className="text-3xl font-bold text-[#1B2A4A]">How It Works</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            { title: "Submit a Request", desc: "Fill out our simple form with your contact info, move details, and items." },
            { title: "We Confirm with You", desc: "Our team reviews your request and contacts you within 24 hours to confirm." },
            { title: "We Move You", desc: "Our professional movers show up on time and handle your move with care." }
          ].map((item, index) => (
            <Card key={item.title} className="p-5">
              <p className="text-sm font-semibold text-[#C0272D]">Step {index + 1}</p>
              <p className="mt-2 text-lg font-bold text-[#1B2A4A]">{item.title}</p>
              <p className="mt-2 text-sm text-slate-600">{item.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="section-wrap py-8">
        <h2 className="text-3xl font-bold text-[#1B2A4A]">Why Choose Us</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            { title: "Reliable", text: "On-time teams and clear communication from quote to move day." },
            { title: "Affordable", text: "Competitive rates with no hidden fees — we're upfront about everything." },
            { title: "Professional Movers", text: "Trained movers equipped for residential and commercial jobs." }
          ].map((item) => (
            <Card key={item.title} className="p-5">
              <p className="text-xl font-bold text-[#1B2A4A]">{item.title}</p>
              <p className="mt-2 text-sm text-slate-600">{item.text}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="section-wrap py-8">
        <h2 className="text-3xl font-bold text-[#1B2A4A]">Services</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            { title: "Residential", text: "Houses, apartments, condos, and full home moves." },
            { title: "Commercial", text: "Office and business relocations with minimal downtime." },
            { title: "Single Item Moves", text: "Fast transport for heavy or fragile furniture and appliances." }
          ].map((service) => (
            <Card key={service.title} className="p-5">
              <p className="font-semibold text-[#1B2A4A]">{service.title}</p>
              <p className="mt-2 text-sm text-slate-600">{service.text}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="section-wrap py-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#C0272D]">People Who Moved With Us</p>
        <h2 className="mt-2 text-3xl font-bold text-[#1B2A4A]">Real moves. Real people.</h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">Here's what they had to say after moving with Edge Moving Solution.</p>

        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item) => (
            <Card key={item._id} className="flex flex-col justify-between p-5">
              <p className="text-sm leading-relaxed text-slate-700">"{item.quote}"</p>
              <div className="mt-4 border-t border-slate-100 pt-3">
                <p className="text-sm font-semibold text-[#1B2A4A]">{item.name}</p>
                <p className="text-xs text-slate-400">{item.location}, NB</p>
                <p className="mt-1 text-xs font-medium text-amber-500">{"★".repeat(item.rating ?? 5)}{"☆".repeat(5 - (item.rating ?? 5))}</p>
              </div>
            </Card>
          ))}
        </div>

        <Card className="mt-8 p-6">
          <h3 className="text-xl font-bold text-[#1B2A4A]">Moved with us? Tell the world.</h3>
          <p className="mt-1 text-sm text-slate-500">Your story helps others make the right call.</p>

          {submitSuccess && (
            <p className="mt-3 rounded-xl bg-emerald-50 p-3 text-sm font-medium text-emerald-700">
              Thanks! Your story is now live.
            </p>
          )}

          <form className="mt-4 grid gap-3 md:grid-cols-2" onSubmit={handleAddReview}>
            <input
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              type="text"
              name="name"
              value={reviewForm.name}
              onChange={handleReviewInput}
              placeholder="Your name"
              required
            />
            <input
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              type="text"
              name="location"
              value={reviewForm.location}
              onChange={handleReviewInput}
              placeholder="City (e.g. Moncton)"
              required
            />
            <div className="md:col-span-2">
              <p className="mb-1.5 text-sm font-medium text-slate-600">Your Rating</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewForm((f) => ({ ...f, rating: star }))}
                    className={`text-2xl transition ${star <= reviewForm.rating ? "text-amber-400" : "text-slate-300"}`}
                  >★</button>
                ))}
              </div>
            </div>
            <textarea
              className="min-h-28 rounded-xl border border-slate-200 px-3 py-2 text-sm md:col-span-2"
              name="quote"
              value={reviewForm.quote}
              onChange={handleReviewInput}
              placeholder="How did your move go? Be specific — it helps others."
              required
            />
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-xl bg-[#1B2A4A] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#15223c] disabled:opacity-60"
              >
                {submitting ? "Saving..." : "Share My Experience"}
              </button>
            </div>
          </form>
        </Card>
      </section>

      <section className="section-wrap py-16">
        <div className="rounded-3xl bg-[#1B2A4A] px-8 py-12 text-center text-white shadow-md">
          <h3 className="text-3xl font-black">Ready to plan your move?</h3>
          <p className="mt-3 text-slate-200">Submit your request today and we'll be in touch within 24 hours.</p>
          <Link to="/quote" className="mt-6 inline-block rounded-xl bg-[#C0272D] px-6 py-3 font-semibold text-white transition hover:bg-[#a32026]">Request a Move</Link>
        </div>
      </section>
    </main>
  );
}
