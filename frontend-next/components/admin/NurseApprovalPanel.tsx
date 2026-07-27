"use client";

import { useEffect, useState } from "react";
import { getTriageQueue, submitNurseDecision } from "@/lib/api";
import { TriageQueueItem } from "@/lib/types";
import { SeverityBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export function NurseApprovalPanel() {
  const [queue, setQueue] = useState<TriageQueueItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [resolvedIds, setResolvedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    getTriageQueue()
      .then(setQueue)
      .finally(() => setIsLoading(false));
  }, []);

  async function handleDecision(item: TriageQueueItem, approved: boolean) {
    setProcessingId(item.thread_id);
    try {
      await submitNurseDecision(item.thread_id, approved);
      setResolvedIds((prev) => new Set(prev).add(item.thread_id));
    } finally {
      setProcessingId(null);
    }
  }

  const pending = queue.filter((item) => !resolvedIds.has(item.thread_id));

  return (
    <div className="rounded-2xl border border-ink/10 bg-white/60">
      <div className="flex items-center justify-between border-b border-ink/10 px-6 py-4">
        <div>
          <h3 className="font-display text-base font-semibold tracking-tight">
            Triage Approval Queue
          </h3>
          <p className="font-mono text-[11px] uppercase tracking-wider text-neutral-dark">
            Human-in-the-loop checkpoint
          </p>
        </div>
        <span className="rounded-full bg-clay/10 px-3 py-1 font-mono text-xs text-clay">
          {pending.length} pending
        </span>
      </div>

      <div className="divide-y divide-ink/10">
        {isLoading && (
          <p className="px-6 py-8 text-center text-sm text-ink/50">Loading queue…</p>
        )}

        {!isLoading && pending.length === 0 && (
          <p className="px-6 py-8 text-center text-sm text-ink/50">
            All caught up — no assessments waiting for review.
          </p>
        )}

        {pending.map((item) => (
          <div key={item.thread_id} className="px-6 py-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-display text-sm font-semibold">{item.patient_name}</p>
                <p className="mt-1 max-w-md text-sm leading-relaxed text-ink/70">
                  {item.rationale}
                </p>
                <p className="mt-2 font-mono text-[11px] text-ink/40">
                  Submitted {new Date(item.submitted_at).toLocaleTimeString()}
                </p>
              </div>
              <SeverityBadge severity={item.severity} />
            </div>

            <div className="mt-4 flex gap-3">
              <Button
                variant="primary"
                onClick={() => handleDecision(item, true)}
                disabled={processingId === item.thread_id}
              >
                Approve
              </Button>
              <Button
                variant="clay"
                onClick={() => handleDecision(item, false)}
                disabled={processingId === item.thread_id}
              >
                Escalate
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
