export default function Footer() {
  return (
    <footer className="mt-16 bg-[#1B2A4A] text-white">
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-6 py-12 md:grid-cols-3">
        <div>
          <img
            src="https://res.cloudinary.com/dgqxt06km/image/upload/c_crop,g_north_west,h_137,w_351,x_135,y_106/WhatsApp_Image_2026-05-11_at_5.23.53_AM-removebg-preview_ibu9at.png"
            alt="Edge Moving Solutions Ltd."
            className="h-14 w-auto object-contain brightness-0 invert"
          />
          <p className="mt-3 text-sm text-slate-200">Professional residential and office moving services across New Brunswick.</p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-200">Contact</p>
          <p className="mt-2">+1 506-471-9393</p>
          <p>edgemovingsolutions@gmail.com</p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-200">Hours</p>
          <p className="mt-2">Mon - Sat: 7:00 AM - 8:00 PM</p>
          <p>Sunday: By appointment</p>
        </div>
      </div>
      <div className="border-t border-white/10 px-6 py-4 text-center text-xs text-slate-300">© {new Date().getFullYear()} Edge Moving Solutions Ltd. All rights reserved.</div>
    </footer>
  );
}
