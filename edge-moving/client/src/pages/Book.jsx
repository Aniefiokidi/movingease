import { useState } from "react";
import api from "../services/api";

const PROPERTY_SIZES = [
  "Studio / Bachelor",
  "1 Bedroom",
  "2 Bedrooms",
  "3 Bedrooms",
  "4+ Bedrooms",
  "Commercial / Office",
];

const EMPTY = {
  name: "",
  email: "",
  phone: "",
  fromAddress: "",
  toAddress: "",
  preferredDate: "",
  propertySize: "",
  notes: "",
};

function Field({ label, required, children, hint }) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#1B2A4A]/50 mb-1.5">
        {label} {required && <span className="text-[#B8924A]">*</span>}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-[#1B2A4A]/35">{hint}</p>}
    </div>
  );
}

const inputCls =
  "w-full bg-white border border-[#E4E1DA] rounded-sm px-4 py-3 text-sm text-[#1B2A4A] placeholder-[#1B2A4A]/30 focus:outline-none focus:border-[#1B2A4A] focus:ring-1 focus:ring-[#1B2A4A]/20 transition-colors";

export default function Book() {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState("");

  function onChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      await api.post("/inquiry", form);
      setStatus("success");
      setForm(EMPTY);
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err?.response?.data?.message || "Something went wrong. Please try again or call us directly."
      );
    }
  }

  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F6F3]">
        <div className="max-w-md w-full mx-4 text-center">
          <div className="w-14 h-14 rounded-sm bg-[#1B2A4A] flex items-center justify-center mx-auto mb-6">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="serif text-3xl font-bold text-[#1B2A4A] mb-4">Request Received</h2>
          <p className="text-[#1B2A4A]/55 text-sm leading-relaxed mb-2">
            Thank you for reaching out. We've received your moving request and sent a confirmation to your email.
          </p>
          <p className="text-[#1B2A4A]/55 text-sm leading-relaxed mb-8">
            A member of our team will be in touch within <strong className="text-[#1B2A4A]">24 hours</strong> to discuss the details.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => setStatus("idle")}
              className="border border-[#E4E1DA] text-[#1B2A4A] text-sm font-medium px-6 py-3 rounded-sm hover:bg-[#F0EDE6] transition-colors"
            >
              Submit Another Request
            </button>
            <a
              href="tel:5064719393"
              className="bg-[#1B2A4A] text-white text-sm font-medium px-6 py-3 rounded-sm hover:bg-[#243859] transition-colors"
            >
              Call Us: 506‑471‑9393
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F6F3]">
      {/* Page header */}
      <div className="bg-[#1B2A4A]" style={{ paddingTop: "72px" }}>
        <div className="section-wrap py-14">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#B8924A] font-medium mb-3">Get Started</p>
          <h1 className="serif text-4xl md:text-5xl font-bold text-white mb-4">Book Your Move</h1>
          <p className="text-white/50 text-sm leading-relaxed max-w-md">
            Fill in the form below and our team will contact you within 24 hours to confirm your appointment.
          </p>
        </div>
      </div>

      {/* Form section */}
      <div className="section-wrap py-16">
        <div className="max-w-2xl">
          {status === "error" && (
            <div className="mb-6 border border-red-200 bg-red-50 rounded-sm px-4 py-3 text-sm text-red-700">
              {errorMsg}
            </div>
          )}

          <form onSubmit={onSubmit} noValidate>
            <div className="bg-white border border-[#E4E1DA] rounded-sm p-8 md:p-10">
              <h2 className="text-base font-semibold text-[#1B2A4A] mb-1">Your Contact Information</h2>
              <p className="text-xs text-[#1B2A4A]/40 mb-7">We use this to follow up with you directly.</p>

              <div className="grid md:grid-cols-2 gap-5">
                <Field label="Full Name" required>
                  <input
                    className={inputCls}
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={onChange}
                    placeholder="John Smith"
                    required
                    autoComplete="name"
                  />
                </Field>
                <Field label="Email Address" required>
                  <input
                    className={inputCls}
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={onChange}
                    placeholder="john@example.com"
                    required
                    autoComplete="email"
                  />
                </Field>
                <Field label="Phone Number" required hint="We may call to confirm details.">
                  <input
                    className={inputCls}
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={onChange}
                    placeholder="506-000-0000"
                    required
                    autoComplete="tel"
                  />
                </Field>
              </div>
            </div>

            <div className="mt-4 bg-white border border-[#E4E1DA] rounded-sm p-8 md:p-10">
              <h2 className="text-base font-semibold text-[#1B2A4A] mb-1">Move Details</h2>
              <p className="text-xs text-[#1B2A4A]/40 mb-7">Tell us where you're moving from and to.</p>

              <div className="grid gap-5">
                <Field label="Moving From" required hint="City, neighbourhood, or full address.">
                  <input
                    className={inputCls}
                    type="text"
                    name="fromAddress"
                    value={form.fromAddress}
                    onChange={onChange}
                    placeholder="e.g. 123 Main St, Moncton, NB"
                    required
                  />
                </Field>
                <Field label="Moving To" required hint="City, neighbourhood, or full address.">
                  <input
                    className={inputCls}
                    type="text"
                    name="toAddress"
                    value={form.toAddress}
                    onChange={onChange}
                    placeholder="e.g. 456 Oak Ave, Fredericton, NB"
                    required
                  />
                </Field>
                <div className="grid md:grid-cols-2 gap-5">
                  <Field label="Preferred Moving Date" required>
                    <input
                      className={inputCls}
                      type="date"
                      name="preferredDate"
                      value={form.preferredDate}
                      onChange={onChange}
                      min={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </Field>
                  <Field label="Property Size">
                    <select
                      className={inputCls}
                      name="propertySize"
                      value={form.propertySize}
                      onChange={onChange}
                    >
                      <option value="">Select (optional)</option>
                      {PROPERTY_SIZES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </Field>
                </div>
                <Field label="Additional Notes">
                  <textarea
                    className={`${inputCls} resize-none`}
                    name="notes"
                    value={form.notes}
                    onChange={onChange}
                    rows={4}
                    placeholder="Anything we should know — special items, access restrictions, preferred timing, etc."
                  />
                </Field>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <button
                type="submit"
                disabled={status === "loading"}
                className="bg-[#1B2A4A] hover:bg-[#243859] disabled:opacity-60 text-white font-semibold px-10 py-4 rounded-sm transition-all text-sm tracking-wide flex items-center gap-2"
              >
                {status === "loading" ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    Sending…
                  </>
                ) : (
                  <>
                    Submit Request
                    <span className="text-lg leading-none">→</span>
                  </>
                )}
              </button>
              <p className="text-xs text-[#1B2A4A]/35 leading-relaxed">
                By submitting, you agree to be contacted by our team. We'll never share your information.
              </p>
            </div>
          </form>

          {/* Contact alternative */}
          <div className="mt-12 pt-8 border-t border-[#E4E1DA]">
            <p className="text-sm text-[#1B2A4A]/50 mb-4">Prefer to reach us directly?</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="tel:5064719393"
                className="flex items-center gap-3 group"
              >
                <div className="w-9 h-9 rounded-sm bg-[#F0EDE6] flex items-center justify-center text-[#1B2A4A] text-sm group-hover:bg-[#1B2A4A] group-hover:text-white transition-colors">
                  ☎
                </div>
                <div>
                  <p className="text-xs text-[#1B2A4A]/40 uppercase tracking-wider">Call Us</p>
                  <p className="text-sm font-semibold text-[#1B2A4A]">506‑471‑9393</p>
                </div>
              </a>
              <a
                href="mailto:edgemovingsolutions@gmail.com"
                className="flex items-center gap-3 group"
              >
                <div className="w-9 h-9 rounded-sm bg-[#F0EDE6] flex items-center justify-center text-[#1B2A4A] text-sm group-hover:bg-[#1B2A4A] group-hover:text-white transition-colors">
                  ✉
                </div>
                <div>
                  <p className="text-xs text-[#1B2A4A]/40 uppercase tracking-wider">Email Us</p>
                  <p className="text-sm font-semibold text-[#1B2A4A]">edgemovingsolutions@gmail.com</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
