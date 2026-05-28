import { Link } from "react-router-dom";
import Card from "../components/common/Card";

const SERVICES = [
  {
    title: "Residential Moving",
    description: "Moving to a new home? We help individuals and families move safely and efficiently, whether locally or long-distance.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    )
  },
  {
    title: "Apartment & Condo Moving",
    description: "From stairs to elevators, our team is experienced in handling apartment and condo relocations with care.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
      </svg>
    )
  },
  {
    title: "Office & Commercial Moving",
    description: "We help businesses relocate equipment, furniture, and supplies with minimal downtime and maximum care.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
      </svg>
    )
  },
  {
    title: "Furniture Delivery",
    description: "Need help transporting furniture or large items? We provide reliable pickup and delivery services.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    )
  },
  {
    title: "Packing & Unpacking",
    description: "Protect your valuables with our professional packing assistance and organized unpacking services.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    )
  },
  {
    title: "Loading & Unloading",
    description: "Already have a truck or storage container? We provide experienced movers to help with loading and unloading.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
      </svg>
    )
  }
];

const WHY_US = [
  "Professional and friendly movers",
  "Affordable and transparent pricing",
  "Safe handling of all belongings",
  "Reliable and on-time service",
  "Clean and well-maintained moving equipment"
];

export default function About() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-[#1B2A4A] py-20 text-white">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <img
            src="https://res.cloudinary.com/dgqxt06km/image/upload/c_crop,g_north_west,h_137,w_351,x_135,y_106/WhatsApp_Image_2026-05-11_at_5.23.53_AM-removebg-preview_ibu9at.png"
            alt="Edge Moving Solutions Ltd."
            className="mx-auto h-24 w-auto object-contain brightness-0 invert"
          />
          <h1 className="mt-6 text-4xl font-black leading-tight md:text-5xl">Moving Made Easy,<br />Safe &amp; Reliable</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-300">
            At Edge Moving Solutions, we provide dependable moving services designed to make your relocation smooth and stress-free. Our team is committed to handling your belongings with care, professionalism, and efficiency.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/quote" className="rounded-xl bg-[#C0272D] px-6 py-3 font-semibold text-white shadow-md transition hover:bg-[#a32026]">Request a Move</Link>
            <a href="tel:+15064719393" className="rounded-xl border border-white/20 px-6 py-3 font-semibold text-white transition hover:bg-white/10">Call Us</a>
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="section-wrap py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#C0272D]">Who We Are</p>
            <h2 className="mt-3 text-3xl font-bold text-[#1B2A4A]">A Moving Company Built on Trust</h2>
            <p className="mt-4 leading-relaxed text-slate-600">
              We understand that every move is important. That's why we focus on punctual service, affordable pricing, and customer satisfaction from start to finish. Whether you're moving your home, apartment, office, or heavy items, we treat every relocation as if it were our own.
            </p>
            <p className="mt-4 leading-relaxed text-slate-600">
              Our team brings the right equipment, experience, and attitude to every job — so you can focus on what matters most while we take care of the rest.
            </p>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="bg-[#F4F6F9] py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#C0272D]">Our Mission</p>
            <h2 className="mt-3 text-3xl font-bold text-[#1B2A4A]">Moving with Honesty, Integrity &amp; Excellence</h2>
            <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-slate-600">
              At Edge Moving Solutions, our mission is to provide quality moving services with honesty, integrity, and excellence. We aim to remove the stress from moving and give our customers peace of mind every step of the way.
            </p>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section-wrap py-16">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#C0272D]">What We Offer</p>
          <h2 className="mt-3 text-3xl font-bold text-[#1B2A4A]">Our Services</h2>
          <p className="mt-2 max-w-xl text-slate-500">From single-item deliveries to full commercial relocations, we have a service for every need.</p>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service) => (
              <Card key={service.title} className="p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1B2A4A]/5 text-[#1B2A4A]">
                  {service.icon}
                </div>
                <h3 className="mt-4 text-lg font-bold text-[#1B2A4A]">{service.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{service.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-[#1B2A4A] py-16 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#C0272D]">Why Choose Us</p>
              <h2 className="mt-3 text-3xl font-bold">The Edge Difference</h2>
              <p className="mt-4 leading-relaxed text-slate-300">We don't just move your items — we move them with care. Here's what sets us apart from the rest.</p>
            </div>
            <ul className="space-y-3">
              {WHY_US.map((point) => (
                <li key={point} className="flex items-start gap-3 rounded-xl bg-white/5 px-5 py-4">
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#C0272D]">
                    <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-slate-200">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="section-wrap py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm md:p-12">
            <div className="grid gap-8 md:grid-cols-2 md:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#C0272D]">Where We Operate</p>
                <h2 className="mt-3 text-3xl font-bold text-[#1B2A4A]">Service Areas</h2>
                <p className="mt-4 leading-relaxed text-slate-600">
                  We proudly serve customers across local and surrounding communities in New Brunswick with dependable moving and transportation services. Whether you're moving across town or across the province, we're ready to help.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {["Moncton", "Dieppe", "Riverview", "Fredericton", "Saint John", "Quispamsis", "Shediac", "Sussex"].map((city) => (
                  <div key={city} className="flex items-center gap-2 rounded-xl bg-[#F4F6F9] px-4 py-3">
                    <svg className="h-4 w-4 shrink-0 text-[#C0272D]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    <span className="text-sm font-medium text-[#1B2A4A]">{city}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Hours */}
      <section className="bg-[#F4F6F9] py-16">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#C0272D]">Get in Touch</p>
          <h2 className="mt-3 text-3xl font-bold text-[#1B2A4A]">Request a Free Quote</h2>
          <p className="mt-2 max-w-xl text-slate-500">Planning a move? Contact Edge Moving Solutions today and let us help you move with confidence.</p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <Card className="flex items-start gap-4 p-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#C0272D]/10 text-[#C0272D]">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Phone</p>
                <a href="tel:+15064719393" className="mt-1 block text-base font-semibold text-[#1B2A4A] hover:text-[#C0272D] transition">506-471-9393</a>
              </div>
            </Card>

            <Card className="flex items-start gap-4 p-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#C0272D]/10 text-[#C0272D]">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Email</p>
                <a href="mailto:edgemovingsolutions@gmail.com" className="mt-1 block text-base font-semibold text-[#1B2A4A] hover:text-[#C0272D] transition break-all">edgemovingsolutions@gmail.com</a>
              </div>
            </Card>

            <Card className="flex items-start gap-4 p-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#C0272D]/10 text-[#C0272D]">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Business Hours</p>
                <p className="mt-1 text-base font-semibold text-[#1B2A4A]">Monday – Saturday</p>
                <p className="text-sm text-slate-500">8:00 AM – 6:00 PM</p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Customer Promise */}
      <section className="section-wrap py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="rounded-3xl bg-[#1B2A4A] px-8 py-14 text-center text-white shadow-md">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#C0272D]">Our Promise to You</p>
            <h2 className="mt-4 text-3xl font-black">Your Belongings Matter to Us</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
              We treat every move with care, professionalism, and attention to detail — because your satisfaction is our priority. From the first call to the final box, we are with you every step of the way.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/quote" className="rounded-xl bg-[#C0272D] px-6 py-3 font-semibold text-white shadow-md transition hover:bg-[#a32026]">Request a Move</Link>
              <a href="tel:+15064719393" className="rounded-xl border border-white/20 px-6 py-3 font-semibold text-white transition hover:bg-white/10">Call 506-471-9393</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
