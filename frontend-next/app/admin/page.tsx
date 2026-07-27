import Link from "next/link";
import { MetricsOverview } from "@/components/admin/MetricsOverview";
import { NurseApprovalPanel } from "@/components/admin/NurseApprovalPanel";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-paper px-6 py-10 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex items-center justify-between">
          <Link href="/" className="font-display text-lg font-semibold tracking-tight">
            MediCore <span className="text-clinical">AI</span>
          </Link>
          <span className="font-mono text-xs uppercase tracking-wider text-ink/50">
            Admin Dashboard
          </span>
        </div>

        <div className="space-y-10">
          <MetricsOverview />
          <NurseApprovalPanel />
        </div>
      </div>
    </main>
  );
}
