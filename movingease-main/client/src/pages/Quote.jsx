import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import Stepper from "../components/common/Stepper";
import ItemSelector from "../components/booking/ItemSelector";
import PriceSummary from "../components/booking/PriceSummary";
import { createBooking } from "../services/booking.service";
import { ITEM_CATALOG, PACKAGE_OPTIONS, SERVICE_TYPES } from "../utils/itemCatalog";
import { calculateLivePrice } from "../utils/pricingEngine";

export default function Quote() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [createdBooking, setCreatedBooking] = useState(null);

  const [form, setForm] = useState({
    serviceType: "residential",
    pricingMode: "package",
    selectedPackage: "quick_move",
    selectedItems: [],
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    moveDate: "",
    preferredTime: "Morning",
    distanceKm: 10,
    urgency: "standard",
    pickupAddress: "",
    dropoffAddress: "",
    pickupFloor: 1,
    dropoffFloor: 1,
    pickupHasElevator: true,
    dropoffHasElevator: true,
    pickupHasNarrowStairs: false,
    dropoffHasNarrowStairs: false,
    pickupParkingDistance: "close",
    dropoffParkingDistance: "close",
    discountAmount: 0
  });

  const steps = ["Service", "Pricing Mode", "Move Details", "Contact", "Review"];
  const price = useMemo(() => calculateLivePrice(form), [form]);

  const setValue = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const setPackage = (selectedPackage) => {
    const pkg = PACKAGE_OPTIONS.find((item) => item.key === selectedPackage);
    setForm((current) => ({
      ...current,
      selectedPackage,
      pricingMode: "package",
      truckType: pkg?.truckType,
      workersCount: pkg?.workersCount
    }));
  };

  const loadPackageIntoItems = () => {
    const pack = PACKAGE_OPTIONS.find((item) => item.key === form.selectedPackage);
    if (!pack) return [];

    if (pack.key === "quick_move") return [{ ...ITEM_CATALOG.find((item) => item.key === "sofa_2"), itemKey: "sofa_2", quantity: 1 }].map(normalizeItem);
    if (pack.key === "small_move") return [
      { ...ITEM_CATALOG.find((item) => item.key === "bed_single"), itemKey: "bed_single", quantity: 1 },
      { ...ITEM_CATALOG.find((item) => item.key === "table"), itemKey: "table", quantity: 1 },
      { ...ITEM_CATALOG.find((item) => item.key === "boxes"), itemKey: "boxes", quantity: 3 }
    ].map(normalizeItem);
    if (pack.key === "medium_move") return [
      { ...ITEM_CATALOG.find((item) => item.key === "sofa_3"), itemKey: "sofa_3", quantity: 1 },
      { ...ITEM_CATALOG.find((item) => item.key === "bed_queen"), itemKey: "bed_queen", quantity: 1 },
      { ...ITEM_CATALOG.find((item) => item.key === "fridge_small"), itemKey: "fridge_small", quantity: 1 },
      { ...ITEM_CATALOG.find((item) => item.key === "boxes"), itemKey: "boxes", quantity: 6 }
    ].map(normalizeItem);

    return [
      { ...ITEM_CATALOG.find((item) => item.key === "sofa_3"), itemKey: "sofa_3", quantity: 2 },
      { ...ITEM_CATALOG.find((item) => item.key === "bed_king"), itemKey: "bed_king", quantity: 1 },
      { ...ITEM_CATALOG.find((item) => item.key === "fridge_large"), itemKey: "fridge_large", quantity: 1 },
      { ...ITEM_CATALOG.find((item) => item.key === "washing_machine"), itemKey: "washing_machine", quantity: 1 },
      { ...ITEM_CATALOG.find((item) => item.key === "boxes"), itemKey: "boxes", quantity: 10 }
    ].map(normalizeItem);
  };

  const normalizeSelectedItems = (items = []) => items.map(normalizeItem).filter((item) => item.quantity > 0);

  async function submitBooking() {
    setError("");
    setLoading(true);
    try {
      const selectedItems = form.pricingMode === "package" ? loadPackageIntoItems() : normalizeSelectedItems(form.selectedItems);
      const payload = {
        serviceType: form.serviceType,
        pricingMode: form.pricingMode,
        selectedPackage: form.pricingMode === "package" ? form.selectedPackage : undefined,
        selectedItems,
        distanceKm: Number(form.distanceKm),
        urgency: form.urgency,
        truckType: price.recommendedTruck,
        workersCount: price.recommendedWorkers,
        discountAmount: Number(form.discountAmount || 0),
        hasFragileItems: selectedItems.some((item) => item.isFragile),
        pickup: {
          address: form.pickupAddress,
          floor: Number(form.pickupFloor),
          hasElevator: Boolean(form.pickupHasElevator),
          parkingDistance: form.pickupParkingDistance,
          hasNarrowStairs: Boolean(form.pickupHasNarrowStairs)
        },
        dropoff: {
          address: form.dropoffAddress,
          floor: Number(form.dropoffFloor),
          hasElevator: Boolean(form.dropoffHasElevator),
          parkingDistance: form.dropoffParkingDistance,
          hasNarrowStairs: Boolean(form.dropoffHasNarrowStairs)
        },
        moveDate: form.moveDate,
        preferredTime: form.preferredTime,
        customerSnapshot: {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          address: { street: form.pickupAddress, city: "", province: "NB", postalCode: "" },
          emergencyContact: { name: "N/A", phone: form.phone, relationship: "Self" }
        }
      };

      const response = await createBooking(payload);
      setCreatedBooking(response.data.data);
      setStep(5);
    } catch (e) {
      setError(e?.response?.data?.message || "Unable to create booking right now.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="section-wrap py-10">
      <div className="grid gap-6 lg:grid-cols-[1.5fr_0.9fr]">
        <div className="space-y-4">
          <Stepper steps={steps} currentStep={step} />

          {step === 1 && (
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-[#1B2A4A]">Step 1: Choose service type</h2>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {SERVICE_TYPES.map((service) => (
                  <button
                    type="button"
                    key={service.key}
                    onClick={() => setValue("serviceType", service.key)}
                    className={`rounded-xl border p-4 text-left transition ${form.serviceType === service.key ? "border-[#1B2A4A] bg-[#1B2A4A]/5" : "border-slate-200 hover:border-[#1B2A4A]/30"}`}
                  >
                    <p className="font-semibold text-[#1B2A4A]">{service.title}</p>
                    <p className="mt-1 text-sm text-slate-500">{service.description}</p>
                  </button>
                ))}
              </div>
              <div className="mt-6 flex justify-end"><Button onClick={() => setStep(2)}>Continue</Button></div>
            </Card>
          )}

          {step === 2 && (
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-[#1B2A4A]">Step 2: Pricing mode</h2>
              <div className="mt-4 flex gap-3">
                <Button type="button" variant={form.pricingMode === "package" ? "primary" : "secondary"} onClick={() => setValue("pricingMode", "package")}>Package estimate</Button>
                <Button type="button" variant={form.pricingMode === "custom" ? "primary" : "secondary"} onClick={() => setValue("pricingMode", "custom")}>Custom item selection</Button>
              </div>

              {form.pricingMode === "package" ? (
                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  {PACKAGE_OPTIONS.map((pkg) => (
                    <button
                      key={pkg.key}
                      type="button"
                      onClick={() => setPackage(pkg.key)}
                      className={`rounded-xl border p-4 text-left transition ${form.selectedPackage === pkg.key ? "border-[#1B2A4A] bg-[#1B2A4A]/5" : "border-slate-200 hover:border-[#1B2A4A]/30"}`}
                    >
                      <p className="font-semibold text-[#1B2A4A]">{pkg.name}</p>
                      <p className="mt-1 text-sm text-slate-500">{pkg.includes}</p>
                      <p className="mt-1 text-sm font-semibold text-[#C0272D]">CAD ${(pkg.baseMin / 100).toFixed(0)} - ${(pkg.baseMax / 100).toFixed(0)}</p>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="mt-5"><ItemSelector selectedItems={form.selectedItems} onChange={(selectedItems) => setValue("selectedItems", selectedItems)} /></div>
              )}

              <div className="mt-6 flex justify-between">
                <Button type="button" variant="secondary" onClick={() => setStep(1)}>Back</Button>
                <Button type="button" onClick={() => setStep(3)}>Continue</Button>
              </div>
            </Card>
          )}

          {step === 3 && (
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-[#1B2A4A]">Step 3: Move details</h2>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <input className="rounded-xl border border-slate-200 px-3 py-2" placeholder="Pickup address" value={form.pickupAddress} onChange={(e) => setValue("pickupAddress", e.target.value)} />
                <input className="rounded-xl border border-slate-200 px-3 py-2" placeholder="Dropoff address" value={form.dropoffAddress} onChange={(e) => setValue("dropoffAddress", e.target.value)} />
                <input className="rounded-xl border border-slate-200 px-3 py-2" type="number" min="1" placeholder="Distance (km)" value={form.distanceKm} onChange={(e) => setValue("distanceKm", e.target.value)} />
                <input className="rounded-xl border border-slate-200 px-3 py-2" type="date" value={form.moveDate} onChange={(e) => setValue("moveDate", e.target.value)} />
                <select className="rounded-xl border border-slate-200 px-3 py-2" value={form.preferredTime} onChange={(e) => setValue("preferredTime", e.target.value)}>
                  <option>Morning</option>
                  <option>Afternoon</option>
                  <option>Evening</option>
                </select>
                <select className="rounded-xl border border-slate-200 px-3 py-2" value={form.urgency} onChange={(e) => setValue("urgency", e.target.value)}>
                  <option value="standard">Standard</option>
                  <option value="same_day">Same Day</option>
                  <option value="express">Express</option>
                </select>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <input className="rounded-xl border border-slate-200 px-3 py-2" type="number" min="1" placeholder="Pickup floor" value={form.pickupFloor} onChange={(e) => setValue("pickupFloor", e.target.value)} />
                <input className="rounded-xl border border-slate-200 px-3 py-2" type="number" min="1" placeholder="Dropoff floor" value={form.dropoffFloor} onChange={(e) => setValue("dropoffFloor", e.target.value)} />
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.pickupHasElevator} onChange={(e) => setValue("pickupHasElevator", e.target.checked)} /> Pickup has elevator</label>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.dropoffHasElevator} onChange={(e) => setValue("dropoffHasElevator", e.target.checked)} /> Dropoff has elevator</label>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.pickupHasNarrowStairs} onChange={(e) => setValue("pickupHasNarrowStairs", e.target.checked)} /> Pickup has narrow stairs</label>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.dropoffHasNarrowStairs} onChange={(e) => setValue("dropoffHasNarrowStairs", e.target.checked)} /> Dropoff has narrow stairs</label>
              </div>

              <div className="mt-6 flex justify-between">
                <Button type="button" variant="secondary" onClick={() => setStep(2)}>Back</Button>
                <Button type="button" onClick={() => setStep(4)}>Continue</Button>
              </div>
            </Card>
          )}

          {step === 4 && (
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-[#1B2A4A]">Step 4: Contact details</h2>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <input className="rounded-xl border border-slate-200 px-3 py-2" placeholder="First name" value={form.firstName} onChange={(e) => setValue("firstName", e.target.value)} />
                <input className="rounded-xl border border-slate-200 px-3 py-2" placeholder="Last name" value={form.lastName} onChange={(e) => setValue("lastName", e.target.value)} />
                <input className="rounded-xl border border-slate-200 px-3 py-2" placeholder="Email" value={form.email} onChange={(e) => setValue("email", e.target.value)} />
                <input className="rounded-xl border border-slate-200 px-3 py-2" placeholder="Phone" value={form.phone} onChange={(e) => setValue("phone", e.target.value)} />
              </div>
              <div className="mt-6 flex justify-between">
                <Button type="button" variant="secondary" onClick={() => setStep(3)}>Back</Button>
                <Button type="button" onClick={() => setStep(5)}>Continue</Button>
              </div>
            </Card>
          )}

          {step === 5 && (
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-[#1B2A4A]">Step 5: Review and request booking</h2>
              <div className="mt-4 rounded-xl bg-[#F4F6F9] p-4 text-sm text-slate-700">
                <p><span className="font-semibold">Service:</span> {SERVICE_TYPES.find((item) => item.key === form.serviceType)?.title}</p>
                <p><span className="font-semibold">Pickup:</span> {form.pickupAddress}</p>
                <p><span className="font-semibold">Dropoff:</span> {form.dropoffAddress}</p>
                <p><span className="font-semibold">Move date:</span> {form.moveDate || "TBD"} ({form.preferredTime})</p>
                <p><span className="font-semibold">Customer:</span> {form.firstName} {form.lastName} ({form.phone})</p>
              </div>
              <p className="mt-3 rounded-xl bg-amber-50 p-3 text-xs text-amber-700">This is an estimate only. Final pricing may vary based on actual conditions.</p>

              {error && <p className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}

              {!createdBooking ? (
                <div className="mt-6 flex justify-between">
                  <Button type="button" variant="secondary" onClick={() => setStep(4)}>Back</Button>
                  <Button type="button" onClick={submitBooking} disabled={loading}>{loading ? "Submitting..." : "Request Booking"}</Button>
                </div>
              ) : (
                <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <p className="font-semibold text-emerald-700">Booking request submitted: {createdBooking.bookingRef}</p>
                  <p className="mt-1 text-sm text-slate-700">Our team will review your request and contact you with final confirmation.</p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Link className="rounded-xl bg-[#1B2A4A] px-4 py-2 text-sm font-semibold text-white" to="/">Back to Home</Link>
                    <Link className="rounded-xl border border-[#1B2A4A]/20 px-4 py-2 text-sm font-semibold text-[#1B2A4A]" to="/quote">Create Another Estimate</Link>
                  </div>
                </div>
              )}
            </Card>
          )}
        </div>

        <div>
          <PriceSummary breakdown={price} />
        </div>
      </div>
    </section>
  );
}

function normalizeItem(item = {}) {
  return {
    itemKey: item.itemKey || item.key,
    label: item.label,
    quantity: Number(item.quantity || 0),
    volumeScore: Number(item.volumeScore || 0),
    weightScore: Number(item.weightScore || 0),
    isFragile: Boolean(item.isFragile),
    isHeavy: Boolean(item.isHeavy)
  };
}
