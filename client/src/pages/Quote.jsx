import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import Stepper from "../components/common/Stepper";
import { createBooking } from "../services/booking.service";

const PREFERRED_TIMES = ["Morning (8am–12pm)", "Afternoon (12pm–5pm)", "Evening (5pm–8pm)"];
const STORAGE_KEY = "quote_draft";

function loadDraft() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function Quote() {
  const draft = loadDraft();

  const [step, setStep] = useState(draft?.step ?? 1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [bookingRef, setBookingRef] = useState("");

  const [contact, setContact] = useState(draft?.contact ?? { firstName: "", lastName: "", email: "", phone: "" });
  const [move, setMove] = useState(draft?.move ?? { pickupAddress: "", dropoffAddress: "", moveDate: "", preferredTime: PREFERRED_TIMES[0] });
  const [items, setItems] = useState(draft?.items ?? []);
  const [newItem, setNewItem] = useState({ label: "", quantity: 1, isFragile: false, description: "" });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ step, contact, move, items }));
  }, [step, contact, move, items]);

  const setContactVal = (k, v) => setContact((c) => ({ ...c, [k]: v }));
  const setMoveVal = (k, v) => setMove((m) => ({ ...m, [k]: v }));

  const addItem = () => {
    if (!newItem.label.trim()) return;
    setItems((prev) => [...prev, { ...newItem, label: newItem.label.trim() }]);
    setNewItem({ label: "", quantity: 1, isFragile: false, description: "" });
  };

  const removeItem = (index) => setItems((prev) => prev.filter((_, i) => i !== index));

  const step1Valid = contact.firstName && contact.lastName && contact.email && contact.phone;
  const step2Valid = move.pickupAddress && move.dropoffAddress && move.moveDate;
  const step3Valid = items.length > 0;

  async function submit() {
    setError("");
    setLoading(true);
    try {
      const payload = {
        serviceType: "residential",
        pricingMode: "custom",
        selectedItems: items.map((item, i) => ({
          itemKey: `item_${i}`,
          label: item.label,
          quantity: Number(item.quantity),
          isFragile: item.isFragile,
          description: item.description,
          volumeScore: 1,
          weightScore: 1,
          isHeavy: false
        })),
        distanceKm: 0,
        urgency: "standard",
        truckType: "medium",
        workersCount: 2,
        hasFragileItems: items.some((i) => i.isFragile),
        pickup: { address: move.pickupAddress, floor: 1, hasElevator: false, parkingDistance: "close", hasNarrowStairs: false },
        dropoff: { address: move.dropoffAddress, floor: 1, hasElevator: false, parkingDistance: "close", hasNarrowStairs: false },
        moveDate: move.moveDate,
        preferredTime: move.preferredTime,
        customerSnapshot: {
          firstName: contact.firstName,
          lastName: contact.lastName,
          email: contact.email,
          phone: contact.phone,
          address: { street: move.pickupAddress, city: "", province: "NB", postalCode: "" },
          emergencyContact: { name: "N/A", phone: contact.phone, relationship: "Self" }
        }
      };

      const res = await createBooking(payload);
      localStorage.removeItem(STORAGE_KEY);
      setBookingRef(res.data.data.bookingRef);
      setSubmitted(true);
    } catch (e) {
      setError(e?.response?.data?.message || "Unable to submit your request. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <section className="section-wrap py-16">
        <div className="mx-auto max-w-lg text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
              <svg className="h-10 w-10 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-[#1B2A4A]">Request Received</h1>
          <p className="mt-3 text-slate-600">Thank you! We've received your moving request. Our team will review the details and reach out to you within 24 hours to confirm and finalize everything.</p>
          <p className="mt-4 inline-block rounded-xl bg-[#1B2A4A]/5 px-4 py-2 font-mono text-sm font-semibold text-[#1B2A4A]">Ref: {bookingRef}</p>
          <div className="mt-8 flex justify-center gap-3">
            <Link to="/" className="rounded-xl bg-[#1B2A4A] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0f1e35] transition">Back to Home</Link>
            <button onClick={() => { localStorage.removeItem(STORAGE_KEY); setSubmitted(false); setStep(1); setContact({ firstName: "", lastName: "", email: "", phone: "" }); setMove({ pickupAddress: "", dropoffAddress: "", moveDate: "", preferredTime: PREFERRED_TIMES[0] }); setItems([]); setBookingRef(""); }} className="rounded-xl border border-[#1B2A4A]/20 px-6 py-3 text-sm font-semibold text-[#1B2A4A] hover:bg-slate-50 transition">New Request</button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-wrap py-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#1B2A4A]">Request a Move</h1>
          <p className="mt-2 text-slate-500">Fill out the form below and we'll get back to you within 24 hours.</p>
        </div>

        <Stepper steps={["Contact", "Move Details", "Items", "Review"]} currentStep={step} />

        <div className="mt-6">
          {step === 1 && (
            <Card className="p-8">
              <h2 className="text-xl font-bold text-[#1B2A4A]">Your Contact Information</h2>
              <p className="mt-1 text-sm text-slate-500">We'll use this to follow up with you about your move.</p>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <Field label="First Name" required>
                  <input className={inputCls} placeholder="John" value={contact.firstName} onChange={(e) => setContactVal("firstName", e.target.value)} />
                </Field>
                <Field label="Last Name" required>
                  <input className={inputCls} placeholder="Doe" value={contact.lastName} onChange={(e) => setContactVal("lastName", e.target.value)} />
                </Field>
                <Field label="Email Address" required>
                  <input className={inputCls} type="email" placeholder="john@example.com" value={contact.email} onChange={(e) => setContactVal("email", e.target.value)} />
                </Field>
                <Field label="Phone Number" required>
                  <input className={inputCls} type="tel" placeholder="(506) 000-0000" value={contact.phone} onChange={(e) => setContactVal("phone", e.target.value)} />
                </Field>
              </div>

              <div className="mt-8 flex justify-end">
                <Button onClick={() => setStep(2)} disabled={!step1Valid}>Continue</Button>
              </div>
            </Card>
          )}

          {step === 2 && (
            <Card className="p-8">
              <h2 className="text-xl font-bold text-[#1B2A4A]">Move Details</h2>
              <p className="mt-1 text-sm text-slate-500">Tell us where you're moving from and to.</p>

              <div className="mt-6 space-y-4">
                <Field label="Pickup Address" required>
                  <input className={inputCls} placeholder="123 Main St, Moncton, NB" value={move.pickupAddress} onChange={(e) => setMoveVal("pickupAddress", e.target.value)} />
                </Field>
                <Field label="Dropoff Address" required>
                  <input className={inputCls} placeholder="456 Elm St, Fredericton, NB" value={move.dropoffAddress} onChange={(e) => setMoveVal("dropoffAddress", e.target.value)} />
                </Field>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Preferred Move Date" required>
                    <input className={inputCls} type="date" value={move.moveDate} onChange={(e) => setMoveVal("moveDate", e.target.value)} />
                  </Field>
                  <Field label="Preferred Time">
                    <select className={inputCls} value={move.preferredTime} onChange={(e) => setMoveVal("preferredTime", e.target.value)}>
                      {PREFERRED_TIMES.map((t) => <option key={t}>{t}</option>)}
                    </select>
                  </Field>
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <Button variant="secondary" onClick={() => setStep(1)}>Back</Button>
                <Button onClick={() => setStep(3)} disabled={!step2Valid}>Continue</Button>
              </div>
            </Card>
          )}

          {step === 3 && (
            <Card className="p-8">
              <h2 className="text-xl font-bold text-[#1B2A4A]">Items to Move</h2>
              <p className="mt-1 text-sm text-slate-500">List everything you need moved. Add as many items as needed.</p>

              {items.length > 0 && (
                <div className="mt-5 space-y-2">
                  {items.map((item, i) => (
                    <div key={i} className="flex items-start justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-[#1B2A4A]">{item.label}</span>
                          <span className="rounded-full bg-[#1B2A4A]/10 px-2 py-0.5 text-xs font-medium text-[#1B2A4A]">Qty {item.quantity}</span>
                          {item.isFragile && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">Fragile</span>}
                        </div>
                        {item.description && <p className="mt-1 text-xs text-slate-500">{item.description}</p>}
                      </div>
                      <button onClick={() => removeItem(i)} className="ml-3 mt-0.5 text-slate-400 transition hover:text-red-500">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-5 rounded-xl border border-dashed border-slate-300 p-5">
                <p className="mb-3 text-sm font-semibold text-slate-700">Add an Item</p>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="mb-1 block text-xs font-medium text-slate-600">Item Name <span className="text-red-500">*</span></label>
                    <input
                      className={inputCls}
                      placeholder="e.g. Sofa, Refrigerator, Box of books…"
                      value={newItem.label}
                      onChange={(e) => setNewItem((n) => ({ ...n, label: e.target.value }))}
                      onKeyDown={(e) => e.key === "Enter" && addItem()}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600">Quantity</label>
                    <input
                      className={inputCls}
                      type="number"
                      min="1"
                      value={newItem.quantity}
                      onChange={(e) => setNewItem((n) => ({ ...n, quantity: Number(e.target.value) }))}
                    />
                  </div>
                  <div className="flex items-end pb-0.5">
                    <label className="flex cursor-pointer select-none items-center gap-2 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded accent-[#1B2A4A]"
                        checked={newItem.isFragile}
                        onChange={(e) => setNewItem((n) => ({ ...n, isFragile: e.target.checked }))}
                      />
                      This item is fragile
                    </label>
                  </div>
                  <div className="md:col-span-2">
                    <label className="mb-1 block text-xs font-medium text-slate-600">Description <span className="text-slate-400">(optional)</span></label>
                    <textarea
                      className={inputCls}
                      rows={2}
                      placeholder="Any extra details about this item…"
                      value={newItem.description}
                      onChange={(e) => setNewItem((n) => ({ ...n, description: e.target.value }))}
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={addItem}
                  disabled={!newItem.label.trim()}
                  className="mt-3 flex items-center gap-1.5 rounded-xl border border-[#1B2A4A]/20 px-4 py-2 text-sm font-semibold text-[#1B2A4A] transition hover:bg-[#1B2A4A]/5 disabled:opacity-40"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Add Item
                </button>
              </div>

              <div className="mt-8 flex justify-between">
                <Button variant="secondary" onClick={() => setStep(2)}>Back</Button>
                <Button onClick={() => { if (newItem.label.trim()) addItem(); setStep(4); }} disabled={items.length === 0 && !newItem.label.trim()}>Review Request</Button>
              </div>
            </Card>
          )}

          {step === 4 && (
            <Card className="p-8">
              <h2 className="text-xl font-bold text-[#1B2A4A]">Review Your Request</h2>
              <p className="mt-1 text-sm text-slate-500">Please confirm your details before submitting.</p>

              <div className="mt-6 space-y-4">
                <ReviewSection title="Contact">
                  <ReviewRow label="Name" value={`${contact.firstName} ${contact.lastName}`} />
                  <ReviewRow label="Email" value={contact.email} />
                  <ReviewRow label="Phone" value={contact.phone} />
                </ReviewSection>

                <ReviewSection title="Move Details">
                  <ReviewRow label="From" value={move.pickupAddress} />
                  <ReviewRow label="To" value={move.dropoffAddress} />
                  <ReviewRow label="Date" value={move.moveDate} />
                  <ReviewRow label="Time" value={move.preferredTime} />
                </ReviewSection>

                <ReviewSection title={`Items (${items.length})`}>
                  {items.map((item, i) => (
                    <div key={i} className="flex items-start justify-between py-2">
                      <div>
                        <span className="text-sm font-medium text-slate-700">{item.label}</span>
                        {item.isFragile && <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">Fragile</span>}
                        {item.description && <p className="mt-0.5 text-xs text-slate-500">{item.description}</p>}
                      </div>
                      <span className="ml-4 shrink-0 text-sm text-slate-500">×{item.quantity}</span>
                    </div>
                  ))}
                </ReviewSection>
              </div>

              <p className="mt-5 rounded-xl bg-blue-50 p-4 text-sm text-blue-700">
                After submitting, our team will review your request and contact you within 24 hours to confirm scheduling and discuss next steps.
              </p>

              {error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}

              <div className="mt-8 flex justify-between">
                <Button variant="secondary" onClick={() => setStep(3)}>Back</Button>
                <Button onClick={submit} disabled={loading}>{loading ? "Submitting…" : "Submit Request"}</Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
}

const inputCls = "w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-[#1B2A4A] focus:outline-none focus:ring-1 focus:ring-[#1B2A4A]";

function Field({ label, required, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

function ReviewSection({ title, children }) {
  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">{title}</p>
      <div className="divide-y divide-slate-100">{children}</div>
    </div>
  );
}

function ReviewRow({ label, value }) {
  return (
    <div className="flex items-start justify-between py-1.5">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="ml-4 text-right text-sm font-medium text-slate-700">{value}</span>
    </div>
  );
}
