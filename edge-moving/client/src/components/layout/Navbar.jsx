import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  const transparent = isHome && !scrolled;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        transparent
          ? "bg-transparent"
          : "bg-white border-b border-[#E4E1DA] shadow-sm"
      }`}
    >
      <div className="section-wrap flex items-center justify-between h-18 md:h-20" style={{ height: "72px" }}>
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-sm flex items-center justify-center text-xs font-bold tracking-wider flex-shrink-0 transition-colors ${
              transparent ? "bg-white/15 text-white border border-white/30" : "bg-[#1B2A4A] text-white"
            }`}
          >
            EM
          </div>
          <div className="leading-tight">
            <div className={`font-semibold text-[15px] tracking-wide transition-colors ${transparent ? "text-white" : "text-[#1B2A4A]"}`}>
              Edge Moving Solution
            </div>
            <div className={`text-[10px] uppercase tracking-[0.18em] transition-colors ${transparent ? "text-white/55" : "text-[#1B2A4A]/45"}`}>
              Ltd.
            </div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors ${transparent ? "text-white/80 hover:text-white" : "text-[#1B2A4A]/60 hover:text-[#1B2A4A]"}`}
          >
            Home
          </Link>
          <Link
            to="/book"
            className={`text-sm font-medium transition-colors ${transparent ? "text-white/80 hover:text-white" : "text-[#1B2A4A]/60 hover:text-[#1B2A4A]"}`}
          >
            Book a Move
          </Link>
          <a
            href="tel:5064719393"
            className={`text-sm font-medium transition-colors ${transparent ? "text-white/80 hover:text-white" : "text-[#1B2A4A]/60 hover:text-[#1B2A4A]"}`}
          >
            506‑471‑9393
          </a>
          <Link
            to="/book"
            className={`text-sm font-medium px-5 py-2.5 rounded-sm transition-all ${
              transparent
                ? "border border-white/60 text-white hover:bg-white hover:text-[#1B2A4A]"
                : "bg-[#1B2A4A] text-white hover:bg-[#243859]"
            }`}
          >
            Get a Free Quote
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 flex flex-col gap-[5px]"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle navigation"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`block h-px w-6 transition-colors ${transparent ? "bg-white" : "bg-[#1B2A4A]"}`}
            />
          ))}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-[#E4E1DA] shadow-md">
          <div className="section-wrap py-5 flex flex-col gap-1">
            <Link to="/" className="text-[#1B2A4A]/70 hover:text-[#1B2A4A] text-sm font-medium py-2.5 border-b border-[#F0EDE6]">Home</Link>
            <Link to="/book" className="text-[#1B2A4A]/70 hover:text-[#1B2A4A] text-sm font-medium py-2.5 border-b border-[#F0EDE6]">Book a Move</Link>
            <a href="tel:5064719393" className="text-[#1B2A4A]/70 hover:text-[#1B2A4A] text-sm font-medium py-2.5 border-b border-[#F0EDE6]">506‑471‑9393</a>
            <Link to="/book" className="mt-3 bg-[#1B2A4A] text-white text-sm font-medium px-5 py-3 rounded-sm text-center">
              Get a Free Quote
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
