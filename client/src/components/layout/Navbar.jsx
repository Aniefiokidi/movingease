import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-2">
        <Link to="/" className="flex items-center">
          <img
            src="https://res.cloudinary.com/dgqxt06km/image/upload/c_crop,g_north_west,h_137,w_351,x_135,y_106/WhatsApp_Image_2026-05-11_at_5.23.53_AM-removebg-preview_ibu9at.png"
            alt="Edge Moving Solutions Ltd."
            className="h-20 w-auto object-contain"
          />
        </Link>
        <div className="flex items-center gap-3">
          <Link to="/about" className="px-4 py-2 text-sm font-semibold text-slate-600 transition hover:text-[#1B2A4A]">About Us</Link>
          <Link to="/quote" className="rounded-xl border border-[#1B2A4A]/15 px-4 py-2 text-sm font-semibold text-[#1B2A4A] transition hover:bg-[#1B2A4A]/5">Request a Move</Link>
          <a href="tel:+15064719393" className="rounded-xl bg-[#C0272D] px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-[#a32026]">Call Now</a>
        </div>
      </nav>
    </header>
  );
}
