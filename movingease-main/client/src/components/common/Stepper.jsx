export default function Stepper({ steps, currentStep }) {
  return (
    <div className="flex flex-wrap gap-2">
      {steps.map((step, index) => {
        const active = index + 1 === currentStep;
        const completed = index + 1 < currentStep;
        return (
          <div
            key={step}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${active ? "bg-[#1B2A4A] text-white" : completed ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}
          >
            {index + 1}. {step}
          </div>
        );
      })}
    </div>
  );
}
