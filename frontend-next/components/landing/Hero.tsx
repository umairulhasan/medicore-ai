import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { JourneyVisual } from "./JourneyVisual";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-ink/10 px-6 pb-20 pt-10 sm:px-10 lg:px-16">
      <nav className="mx-auto flex max-w-6xl items-center justify-between pb-16">
        <span className="font-display text-lg font-semibold tracking-tight">
          MediCore <span className="text-clinical">AI</span>
        </span>
        <div className="hidden items-center gap-8 font-mono text-xs uppercase tracking-wider text-ink/70 sm:flex">
          <a href="#how-it-works" className="hover:text-ink">How it works</a>
          <a href="#pricing" className="hover:text-ink">Pricing</a>
          <Link href="/patient" className="hover:text-ink">Patient portal</Link>
          <Link href="/admin" className="hover:text-ink">Admin</Link>
        </div>
      </nav>

      <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="animate-fade-up">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-clinical">
            Built for independent practices
          </p>
          <h1 className="text-balance font-display text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            The pulse of your practice, automated.
          </h1>
          <p className="mt-6 max-w-lg text-balance text-lg leading-relaxed text-ink/75">
            MediCore AI handles intake, triage, scheduling, and billing —
            with a licensed human always reviewing anything clinical before
            it reaches a patient. No EHR overhaul required.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link href="/patient">
              <Button variant="primary">Try the patient portal</Button>
            </Link>
            <a href="#pricing">
              <Button variant="secondary">See pricing</Button>
            </a>
          </div>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white/60 p-6 shadow-[0_1px_0_0_rgba(18,33,29,0.04)]">
          <p className="mb-1 font-mono text-[11px] uppercase tracking-wider text-neutral-dark">
            Live journey trace
          </p>
          <JourneyVisual />
        </div>
      </div>
    </section>
  );
}
