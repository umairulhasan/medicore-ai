const NODES = [
  { label: "Intake", x: 80 },
  { label: "Triage", x: 280 },
  { label: "Scheduling", x: 480 },
  { label: "Billing", x: 680 },
  { label: "Follow-up", x: 880 },
];

/**
 * The product's actual state machine, drawn as a heartbeat trace. Each spike
 * is one agent handoff; the line only keeps moving forward, mirroring the
 * one-way patient journey in orchestrator/graph.py — this is the real
 * mechanic, not a decorative waveform.
 */
export function JourneyVisual() {
  return (
    <div className="relative w-full">
      <svg
        viewBox="0 0 1000 220"
        className="w-full"
        role="img"
        aria-label="Patient journey: Intake, Triage, Scheduling, Billing, Follow-up"
      >
        <path
          d="M0,120 L60,120 L80,50 L100,190 L120,120 L260,120 L280,50 L300,190 L320,120
             L460,120 L480,50 L500,190 L520,120 L660,120 L680,50 L700,190 L720,120
             L860,120 L880,50 L900,190 L920,120 L1000,120"
          fill="none"
          stroke="#2F6F5E"
          strokeWidth="3"
          strokeLinejoin="round"
          strokeLinecap="round"
          pathLength={1000}
          strokeDasharray={1000}
          className="animate-pulse-line"
        />

        {NODES.map((node, i) => (
          <g key={node.label}>
            <circle
              cx={node.x}
              cy={50}
              r={7}
              fill="#4CE0A0"
              stroke="#12211D"
              strokeWidth="1.5"
              className="animate-node-pulse"
              style={{ animationDelay: `${i * 0.4}s`, transformOrigin: `${node.x}px 50px` }}
            />
            <text
              x={node.x}
              y={185}
              textAnchor="middle"
              className="fill-ink font-mono text-[13px] uppercase tracking-wider"
            >
              {node.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
