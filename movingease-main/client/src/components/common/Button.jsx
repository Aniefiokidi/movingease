export default function Button({ className = "", variant = "primary", ...props }) {
  const styles = {
    primary: "bg-[#C0272D] text-white hover:bg-[#a32026] shadow-md",
    secondary: "bg-white text-[#1B2A4A] border border-[#1B2A4A]/20 hover:bg-slate-50",
    ghost: "text-[#1B2A4A] hover:bg-[#1B2A4A]/5"
  };

  return (
    <button
      className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${styles[variant]} ${className}`}
      {...props}
    />
  );
}
