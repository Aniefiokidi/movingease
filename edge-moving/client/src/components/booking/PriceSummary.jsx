import Card from "../common/Card";

const centsToCad = (value) => `CAD $${(Number(value || 0) / 100).toFixed(2)}`;

export default function PriceSummary({ breakdown }) {
  const rows = [
    ["Base price", breakdown.basePrice],
    ["Distance", breakdown.distanceCost],
    ["Labor", breakdown.laborCost],
    ["Truck", breakdown.truckCost],
    ["Item cost", breakdown.itemCost],
    ["Accessibility fees", breakdown.accessibilitySurcharge],
    ["Discount", -Math.abs(Number(breakdown.discountAmount || 0))]
  ];

  return (
    <Card className="sticky top-24 p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Live Estimate</p>
      <p className="mt-2 text-3xl font-bold text-[#C0272D]">{centsToCad(breakdown.totalEstimate)}</p>
      <p className="mt-1 text-xs text-slate-500">Auto-rounded to nearest $5</p>

      <div className="mt-5 space-y-2 border-t border-slate-200 pt-4 text-sm">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between text-slate-700">
            <span>{label}</span>
            <span className="font-semibold">{centsToCad(value)}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-xl bg-[#1B2A4A] p-3 text-white">
        <p className="text-xs uppercase tracking-wide text-slate-200">Recommended setup</p>
        <p className="mt-1 text-sm font-semibold">Truck: {breakdown.recommendedTruck}</p>
        <p className="text-sm font-semibold">Workers: {breakdown.recommendedWorkers}</p>
      </div>

      <p className="mt-4 rounded-xl bg-amber-50 p-3 text-xs text-amber-700">
        This is an estimate only. Final pricing may vary based on actual conditions.
      </p>
    </Card>
  );
}
