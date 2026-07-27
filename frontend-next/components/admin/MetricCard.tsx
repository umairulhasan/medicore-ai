export function MetricCard({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-6 ${
        accent ? "border-clinical bg-clinical text-paper" : "border-ink/10 bg-white/60"
      }`}
    >
      <p
        className={`font-mono text-[11px] uppercase tracking-wider ${
          accent ? "text-paper/70" : "text-neutral-dark"
        }`}
      >
        {label}
      </p>
      <p className="mt-3 font-display text-3xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}
