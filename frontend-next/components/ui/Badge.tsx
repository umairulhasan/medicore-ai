const SEVERITY_STYLES: Record<string, string> = {
  low: "bg-mint-soft text-clinical-dark",
  medium: "bg-neutral-light text-ink",
  high: "bg-clay-light/40 text-clay",
  urgent: "bg-clay text-paper",
};

export function SeverityBadge({ severity }: { severity?: string }) {
  if (!severity) return null;
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 font-mono text-xs uppercase tracking-wider ${
        SEVERITY_STYLES[severity] ?? SEVERITY_STYLES.medium
      }`}
    >
      {severity}
    </span>
  );
}
