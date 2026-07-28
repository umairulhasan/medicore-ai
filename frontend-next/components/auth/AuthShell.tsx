import Link from "next/link";

export function AuthShell({
  title,
  subtitle,
  footerText,
  footerLinkText,
  footerLinkHref,
  children,
}: {
  title: string;
  subtitle: string;
  footerText: string;
  footerLinkText: string;
  footerLinkHref: string;
  children: React.ReactNode;
}) {
  return (
    <main className="grid min-h-screen bg-paper lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-clinical p-12 text-paper lg:flex">
        <Link href="/" className="font-display text-lg font-semibold tracking-tight">
          MediCore <span className="text-mint">AI</span>
        </Link>
        <div>
          <p className="max-w-sm text-balance font-display text-3xl font-semibold leading-snug tracking-tight">
            Every clinical decision still goes through a human.
          </p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-paper/70">
            Intake, triage, scheduling, and billing — automated end to end,
            with a nurse checkpoint built into the workflow itself.
          </p>
        </div>
        <p className="font-mono text-[11px] uppercase tracking-wider text-paper/50">
          Demo build — synthetic data only
        </p>
      </div>

      <div className="flex flex-col items-center justify-center px-6 py-16 sm:px-10">
        <div className="w-full max-w-sm">
          <Link
            href="/"
            className="mb-10 block font-display text-lg font-semibold tracking-tight lg:hidden"
          >
            MediCore <span className="text-clinical">AI</span>
          </Link>

          <h1 className="font-display text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-1.5 text-sm text-ink/60">{subtitle}</p>

          <div className="mt-8">{children}</div>

          <p className="mt-8 text-center text-sm text-ink/60">
            {footerText}{" "}
            <Link href={footerLinkHref} className="font-medium text-clinical hover:underline">
              {footerLinkText}
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
