import { useState } from "react";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import { submitRequest } from "../services/request.service";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  serviceType: "Residential Move",
  pickupAddress: "",
  dropoffAddress: "",
  moveDate: "",
  notes: ""
};

export default function Request() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ loading: false, success: false, error: "" });

  const setValue = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus({ loading: true, success: false, error: "" });

    try {
      await submitRequest(form);
      setStatus({ loading: false, success: true, error: "" });
      setForm(initialForm);
    } catch (error) {
      setStatus({
        loading: false,
        success: false,
        error: error?.response?.data?.message || "Unable to submit request right now."
      });
    }
  }

  return (
    <main className="section-wrap py-10">
      <div className="grid gap-8 lg:grid-cols-[0.95fr_0.85fr]">
        <div className="space-y-6">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#C0272D]">Request a move</p>
            <h1 className="text-4xl font-bold text-[#1B2A4A]">Send us your moving details and we’ll follow up by email.</h1>
            <p className="max-w-2xl text-slate-600">No complex pricing needed yet. Just tell us where and when, and we’ll contact you to confirm the move.</p>
          </div>

          <Card className="p-6">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  className="rounded-xl border border-slate-200 px-4 py-3"
                  placeholder="Full name"
                  value={form.name}
                  onChange={(e) => setValue("name", e.target.value)}
                  required
                />
                <input
                  className="rounded-xl border border-slate-200 px-4 py-3"
                  placeholder="Email address"
                  type="email"
                  value={form.email}
                  onChange={(e) => setValue("email", e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <input
                  className="rounded-xl border border-slate-200 px-4 py-3"
                  placeholder="Phone number"
                  value={form.phone}
                  onChange={(e) => setValue("phone", e.target.value)}
                  required
                />
                <input
                  className="rounded-xl border border-slate-200 px-4 py-3"
                  placeholder="Preferred move date"
                  type="date"
                  value={form.moveDate}
                  onChange={(e) => setValue("moveDate", e.target.value)}
                />
              </div>

              <div className="grid gap-4">
                <input
                  className="rounded-xl border border-slate-200 px-4 py-3"
                  placeholder="Pickup address"
                  value={form.pickupAddress}
                  onChange={(e) => setValue("pickupAddress", e.target.value)}
                />
                <input
                  className="rounded-xl border border-slate-200 px-4 py-3"
                  placeholder="Dropoff address"
                  value={form.dropoffAddress}
                  onChange={(e) => setValue("dropoffAddress", e.target.value)}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Additional details</label>
                <textarea
                  className="w-full rounded-xl border border-slate-200 p-4 text-sm leading-relaxed"
                  placeholder="Any important notes for your move"
                  value={form.notes}
                  onChange={(e) => setValue("notes", e.target.value)}
                  rows={5}
                />
              </div>

              {status.error && <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{status.error}</p>}
              {status.success && <p className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">Request submitted! We’ll follow up shortly.</p>}

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-500">We’ll send the request details to your inbox and contact you manually.</p>
                <Button type="submit" disabled={status.loading}>{status.loading ? "Sending..." : "Submit request"}</Button>
              </div>
            </form>
          </Card>
        </div>

        <aside className="space-y-4">
          <Card className="p-6">
            <h2 className="text-xl font-bold text-[#1B2A4A]">What happens next?</h2>
            <ul className="mt-4 space-y-3 text-slate-600">
              <li>1. We receive your request by email.</li>
              <li>2. Our team reviews your move details.</li>
              <li>3. We contact you to confirm availability and pricing.</li>
            </ul>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-[#1B2A4A]">Need help now?</h3>
            <p className="mt-2 text-sm text-slate-600">Call us at <a className="font-semibold text-[#1B2A4A]" href="tel:+15064719393">(506) 471-9393</a> for immediate support.</p>
          </Card>
        </aside>
      </div>
    </main>
  );
}
