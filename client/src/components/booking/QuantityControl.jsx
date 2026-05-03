import Button from "../common/Button";

export default function QuantityControl({ value, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <Button type="button" variant="secondary" className="h-8 w-8 px-0 py-0" onClick={() => onChange(Math.max(0, value - 1))}>-</Button>
      <span className="min-w-8 text-center text-sm font-semibold text-[#1B2A4A]">{value}</span>
      <Button type="button" variant="secondary" className="h-8 w-8 px-0 py-0" onClick={() => onChange(value + 1)}>+</Button>
    </div>
  );
}
