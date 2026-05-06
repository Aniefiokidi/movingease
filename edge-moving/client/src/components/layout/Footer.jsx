import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#1B2A4A] text-white">
      <div className="section-wrap pt-14 pb-10">
        <div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-sm bg-white/10 border border-white/20 flex items-center justify-center text-xs font-bold tracking-wider">
                EM
              </div>
              <div className="leading-tight">
                <div className="font-semibold text-[15px] tracking-wide text-white">Edge Moving Solution</div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-white/45">Ltd.</div>
              </div>
            </div>
            <p className="text-sm text-white/55 leading-relaxed max-w-xs">
              Professional moving services across New Brunswick. Licensed, insured, and committed to a stress-free move.
            </p>
          </div>

          {/* Company */}
          <div>
            <p className="text-[11px] uppercase tracking-[0.15em] text-white/40 mb-4 font-medium">Company</p>
            <ul className="space-y-2.5">
              <li><Link to="/" className="text-sm text-white/60 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/book" className="text-sm text-white/60 hover:text-white transition-colors">Book a Move</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-[11px] uppercase tracking-[0.15em] text-white/40 mb-4 font-medium">Contact</p>
            <ul className="space-y-2.5">
              <li>
                <a href="tel:5064719393" className="text-sm text-white/60 hover:text-white transition-colors">
                  506‑471‑9393
                </a>
              </li>
              <li>
                <a href="mailto:edgemovingsolutions@gmail.com" className="text-sm text-white/60 hover:text-white transition-colors break-all">
                  edgemovingsolutions@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <p className="text-[11px] uppercase tracking-[0.15em] text-white/40 mb-4 font-medium">Hours</p>
            <ul className="space-y-2.5">
              <li className="text-sm text-white/60">Mon – Sat: 7 AM – 8 PM</li>
              <li className="text-sm text-white/60">Sunday: By appointment</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/35">
            © {new Date().getFullYear()} Edge Moving Solution Ltd. All rights reserved.
          </p>
          <p className="text-xs text-white/35">New Brunswick, Canada</p>
        </div>
      </div>
    </footer>
  );
}
