import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-xl font-bold tracking-tight text-[#1B2A4A]">Edge Moving Solution Ltd.</Link>
        <div className="flex items-center gap-3">
          <Link to="/request" className="rounded-xl border border-[#1B2A4A]/15 px-4 py-2 text-sm font-semibold text-[#1B2A4A] transition hover:bg-[#1B2A4A]/5">Request a Move</Link>
          <Link to="/admin/bookings" className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100">Admin</Link>
          <a href="tel:+15064719393" className="rounded-xl bg-[#C0272D] px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-[#a32026]">Call Now</a>
        </div>
      </nav>
    </header>
  );
}
