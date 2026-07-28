"use client";

import { useState } from "react";
import Link from "next/link";

const PATIENT_URL = process.env.NEXT_PUBLIC_GRADIO_PATIENT_URL ?? "http://localhost:7860";
const ADMIN_URL = process.env.NEXT_PUBLIC_GRADIO_ADMIN_URL ?? "http://localhost:7861";

/**
 * TESTING ONLY.
 *
 * Embeds the existing Python/Gradio frontend (frontend/patient_app.py and
 * frontend/admin_dashboard.py) inside the Next.js app via iframe, so you
 * can sanity-check the Gradio UI without leaving the Next.js dev server.
 *
 * Delete this route (and this file) before shipping to production — the
 * real product frontend is the rest of this Next.js app, not Gradio.
 * Requires both Gradio apps to be running locally:
 *   uv run python frontend/patient_app.py
 *   uv run python frontend/admin_dashboard.py
 */
export default function GradioTestPage() {
  const [tab, setTab] = useState<"patient" | "admin">("patient");
  const activeUrl = tab === "patient" ? PATIENT_URL : ADMIN_URL;

  return (
    <main className="min-h-screen bg-paper px-6 py-10 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="font-display text-lg font-semibold tracking-tight">
            MediCore <span className="text-clinical">AI</span>
          </Link>
          <span className="font-mono text-xs uppercase tracking-wider text-ink/50">
            Dev tools
          </span>
        </div>

        <div className="mb-6 rounded-xl border border-clay/30 bg-clay/10 px-4 py-3 text-sm text-clay">
          <strong className="font-semibold">Testing only.</strong> This page embeds the
          Python/Gradio frontend for local comparison. Remove this route
          before deploying to production — it isn't part of the shipped
          product UI.
        </div>

        <div className="mb-4 flex gap-2 rounded-full border border-ink/10 bg-white/60 p-1 w-fit">
          <button
            onClick={() => setTab("patient")}
            className={`rounded-full px-4 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors ${
              tab === "patient" ? "bg-clinical text-paper" : "text-ink/60 hover:text-ink"
            }`}
          >
            Patient app
          </button>
          <button
            onClick={() => setTab("admin")}
            className={`rounded-full px-4 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors ${
              tab === "admin" ? "bg-clinical text-paper" : "text-ink/60 hover:text-ink"
            }`}
          >
            Admin app
          </button>
        </div>

        <div className="overflow-hidden rounded-2xl border border-ink/10 bg-white">
          <div className="flex items-center justify-between border-b border-ink/10 px-4 py-2">
            <p className="font-mono text-[11px] text-ink/50">{activeUrl}</p>
            <a
              href={activeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[11px] text-clinical hover:underline"
            >
              Open in new tab ↗
            </a>
          </div>
          <iframe
            src={activeUrl}
            title={`Gradio ${tab} app`}
            className="h-[720px] w-full"
            // Gradio apps run same-origin logic fine here since this is
            // local dev only; tighten/remove sandboxing rules if you keep
            // this around longer than expected.
          />
        </div>
      </div>
    </main>
  );
}
