"use client";

import { useEffect, useState } from "react";
import { generateReport, getMetrics } from "@/lib/api";
import { PracticeMetrics } from "@/lib/types";
import { MetricCard } from "./MetricCard";
import { Button } from "@/components/ui/Button";

export function MetricsOverview() {
  const [metrics, setMetrics] = useState<PracticeMetrics | null>(null);
  const [reportStatus, setReportStatus] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    getMetrics().then(setMetrics);
  }, []);

  async function handleGenerateReport() {
    setIsGenerating(true);
    setReportStatus(null);
    try {
      const result = await generateReport();
      setReportStatus(`Report ready: ${result.filepath}`);
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold tracking-tight">
            Practice Metrics
          </h2>
          <p className="font-mono text-[11px] uppercase tracking-wider text-neutral-dark">
            Last 30 days
          </p>
        </div>
        <Button onClick={handleGenerateReport} disabled={isGenerating}>
          {isGenerating ? "Generating…" : "Generate PPTX Report"}
        </Button>
      </div>

      {reportStatus && (
        <p className="mt-3 rounded-lg bg-mint-soft px-4 py-2 font-mono text-xs text-clinical-dark">
          {reportStatus}
        </p>
      )}

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
        <MetricCard label="Total Patients" value={metrics?.total_patients ?? "—"} accent />
        <MetricCard label="Appointments" value={metrics?.appointments_last_30d ?? "—"} />
        <MetricCard label="No-shows" value={metrics?.no_shows ?? "—"} />
        <MetricCard label="Claims Filed" value={metrics?.claims_filed ?? "—"} />
        <MetricCard
          label="Claimed Amount"
          value={metrics ? `$${metrics.total_claimed_amount.toLocaleString()}` : "—"}
        />
      </div>
    </div>
  );
}
