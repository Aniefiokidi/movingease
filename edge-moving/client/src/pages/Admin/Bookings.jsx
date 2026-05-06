import { useEffect, useMemo, useState } from "react";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import { getAdminBookings } from "../../services/booking.service";

const centsToCad = (value) => `CAD $${(Number(value || 0) / 100).toFixed(2)}`;

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [error, setError] = useState("");

  const filtered = useMemo(() => {
    if (!statusFilter) return bookings;
    return bookings.filter((item) => item.status === statusFilter);
  }, [bookings, statusFilter]);

  async function load() {
    setError("");
    setLoading(true);
    try {
      const response = await getAdminBookings();
      setBookings(response.data.data || []);
    } catch (e) {
      setError(e?.response?.data?.message || "Unable to load bookings.");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <section className="section-wrap py-10">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-[#C0272D]">Admin</p>
          <h1 className="text-3xl font-bold text-[#1B2A4A]">Booking Requests</h1>
        </div>
        <div className="flex items-center gap-2">
          <select className="rounded-xl border border-slate-200 px-3 py-2 text-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All status</option>
            <option value="quote">Quote</option>
            <option value="confirmed">Confirmed</option>
            <option value="assigned">Assigned</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <Button type="button" variant="secondary" onClick={load}>Refresh</Button>
        </div>
      </div>

      {error ? <p className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
      {loading ? <p className="text-sm text-slate-500">Loading booking requests...</p> : null}

      <div className="grid gap-4">
        {filtered.map((booking) => (
          <Card key={booking._id} className="p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{booking.bookingRef}</p>
                <h2 className="mt-1 text-xl font-bold text-[#1B2A4A]">
                  {booking.customerSnapshot?.firstName || ""} {booking.customerSnapshot?.lastName || ""}
                </h2>
                <p className="text-sm text-slate-600">{booking.customerSnapshot?.phone || "No phone"}</p>
              </div>
              <div className="text-right">
                <p className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{booking.status}</p>
                <p className="mt-2 text-2xl font-black text-[#C0272D]">{centsToCad(booking.pricing?.totalEstimate)}</p>
                <p className="text-xs text-slate-500">Estimated price</p>
              </div>
            </div>

            <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="font-semibold text-[#1B2A4A]">Move details</p>
                <p className="mt-1 text-slate-600">Pickup: {booking.pickup?.address || "N/A"}</p>
                <p className="text-slate-600">Dropoff: {booking.dropoff?.address || "N/A"}</p>
                <p className="text-slate-600">Date: {booking.moveDate ? new Date(booking.moveDate).toLocaleDateString() : "TBD"}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="font-semibold text-[#1B2A4A]">Selected items</p>
                {Array.isArray(booking.selectedItems) && booking.selectedItems.length > 0 ? (
                  <ul className="mt-1 space-y-1 text-slate-600">
                    {booking.selectedItems.map((item) => (
                      <li key={`${booking._id}-${item.itemKey}`}>{item.label} x{item.quantity}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-1 text-slate-600">No item list provided.</p>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
