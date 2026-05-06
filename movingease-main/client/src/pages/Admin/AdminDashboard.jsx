import { Link } from "react-router-dom";
import Card from "../../components/common/Card";

export default function AdminDashboard() {
  return (
    <section className="section-wrap py-10">
      <Card className="p-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#C0272D]">Admin</p>
        <h1 className="mt-2 text-3xl font-bold text-[#1B2A4A]">Booking Requests</h1>
        <p className="mt-2 text-slate-600">Manage incoming estimate requests and review customer move details.</p>
        <div className="mt-6">
          <Link to="/admin/bookings" className="inline-block rounded-xl bg-[#1B2A4A] px-5 py-3 text-sm font-semibold text-white">View All Requests</Link>
        </div>
      </Card>
    </section>
  );
}
