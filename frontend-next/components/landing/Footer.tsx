import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-ink/10 px-6 py-10 sm:px-10 lg:px-16">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <span className="font-display text-sm font-semibold tracking-tight">
          MediCore <span className="text-clinical">AI</span>
        </span>
        <p className="font-mono text-xs text-ink/50">
          Demo build — synthetic data only. Not a substitute for clinical judgment.
        </p>
        <div className="flex gap-6 font-mono text-xs uppercase tracking-wider text-ink/60">
          <Link href="/patient" className="hover:text-ink">Patient portal</Link>
          <Link href="/admin" className="hover:text-ink">Admin</Link>
          <Link href="/gradio-test" className="text-clay/70 hover:text-clay">
            Gradio (dev only)
          </Link>
        </div>
      </div>
    </footer>
  );
}
