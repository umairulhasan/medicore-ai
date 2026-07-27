import { Button } from "@/components/ui/Button";

const TIERS = [
  {
    name: "Starter",
    price: "$99",
    tagline: "For solo practices getting off the phone.",
    features: ["Intake agent", "Scheduling agent", "1 location"],
    highlighted: false,
  },
  {
    name: "Growth",
    price: "$299",
    tagline: "Most practices land here.",
    features: [
      "Everything in Starter",
      "Triage agent with nurse approval",
      "Billing agent + claim drafting",
      "Document generation (DOCX/PDF)",
      "Up to 3 locations",
    ],
    highlighted: true,
  },
  {
    name: "Pro",
    price: "$699",
    tagline: "For multi-location groups.",
    features: [
      "Everything in Growth",
      "Voice intake + image analysis",
      "Custom knowledge base",
      "Unlimited locations",
    ],
    highlighted: false,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="px-6 py-24 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-clinical">
          Pricing
        </p>
        <h2 className="max-w-xl text-balance font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Priced for independent practices, not hospital systems.
        </h2>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`flex flex-col rounded-2xl border p-8 ${
                tier.highlighted
                  ? "border-clinical bg-clinical text-paper shadow-lg"
                  : "border-ink/10 bg-white/60"
              }`}
            >
              <h3 className="font-display text-xl font-semibold tracking-tight">{tier.name}</h3>
              <p
                className={`mt-1 text-sm ${tier.highlighted ? "text-paper/80" : "text-ink/60"}`}
              >
                {tier.tagline}
              </p>
              <p className="mt-6 font-display text-4xl font-semibold tracking-tight">
                {tier.price}
                <span
                  className={`ml-1 font-body text-base font-normal ${
                    tier.highlighted ? "text-paper/70" : "text-ink/50"
                  }`}
                >
                  /mo
                </span>
              </p>

              <ul className="mt-8 flex-1 space-y-3 text-sm">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span
                      className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${
                        tier.highlighted ? "bg-mint" : "bg-clinical"
                      }`}
                    />
                    <span className={tier.highlighted ? "text-paper/90" : "text-ink/75"}>{f}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={tier.highlighted ? "clay" : "secondary"}
                className={`mt-8 w-full ${tier.highlighted ? "" : ""}`}
              >
                Talk to us
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
