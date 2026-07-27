const AGENTS = [
  {
    name: "Intake Agent",
    framework: "LangChain",
    detail:
      "Collects symptoms conversationally, cross-checks existing records, and never offers a diagnosis.",
  },
  {
    name: "Triage Agent",
    framework: "LangGraph + RAG",
    detail:
      "Assesses urgency against your clinical knowledge base, then pauses for a nurse's approval — every time.",
  },
  {
    name: "Scheduling Agent",
    framework: "Tool calling",
    detail:
      "Finds the next open slot with the right specialist and books it directly against your calendar.",
  },
  {
    name: "Billing Agent",
    framework: "RAG-informed",
    detail:
      "Drafts insurance claims against real coverage rules, ready for staff review before filing.",
  },
  {
    name: "Follow-up Agent",
    framework: "Automated",
    detail:
      "Sends a warm, personalized check-in a few days after the visit — no one falls through the cracks.",
  },
];

export function AgentsSection() {
  return (
    <section id="how-it-works" className="border-b border-ink/10 px-6 py-24 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-clinical">
          Five agents, one journey
        </p>
        <h2 className="max-w-2xl text-balance font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Every step is handled — and every clinical call still goes through a human.
        </h2>

        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-5">
          {AGENTS.map((agent) => (
            <div key={agent.name} className="bg-paper p-6">
              <p className="font-mono text-[11px] uppercase tracking-wider text-neutral-dark">
                {agent.framework}
              </p>
              <h3 className="mt-3 font-display text-lg font-semibold tracking-tight">
                {agent.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">{agent.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
