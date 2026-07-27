"use client";

import { FormEvent, useState } from "react";
import { startJourney } from "@/lib/api";
import { ChatMessage } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { SeverityBadge } from "@/components/ui/Badge";
import { MessageBubble } from "./MessageBubble";

const EXAMPLES = [
  "I've had a sore throat and mild fever for two days.",
  "I need a refill on my blood pressure medication.",
  "I noticed a rash on my arm after a hike yesterday.",
];

export function ChatWindow() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "Hi, I'm the MediCore intake assistant. Tell me what's going on and I'll help get you scheduled.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [severity, setSeverity] = useState<string | undefined>();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;

    const patientMessage: ChatMessage = { id: crypto.randomUUID(), role: "patient", text };
    setMessages((prev) => [...prev, patientMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const result = await startJourney({
        patient_id: 1,
        doctor_id: 1,
        symptoms_text: text,
        thread_id: crypto.randomUUID(),
      });

      setSeverity(result.severity);
      setStatus(result.status);

      const reply: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        text:
          result.status === "awaiting_nurse_approval"
            ? "Thanks — I've logged your symptoms and a nurse is reviewing them now. You'll get a confirmation shortly once your appointment is scheduled."
            : `Update: ${result.status}`,
      };
      setMessages((prev) => [...prev, reply]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          text: "Something went wrong reaching the clinic system. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex h-[640px] flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white/60">
      <div className="flex items-center justify-between border-b border-ink/10 px-6 py-4">
        <div>
          <p className="font-display text-sm font-semibold tracking-tight">Patient Intake</p>
          <p className="font-mono text-[11px] uppercase tracking-wider text-neutral-dark">
            Sunrise Family Clinic
          </p>
        </div>
        {status && (
          <div className="flex items-center gap-2">
            <SeverityBadge severity={severity} />
            <span className="font-mono text-[11px] text-ink/50">{status}</span>
          </div>
        )}
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-6 py-5">
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-sm border border-ink/10 bg-white/70 px-4 py-3 text-sm text-ink/50">
              Reviewing your message…
            </div>
          </div>
        )}
      </div>

      {messages.length === 1 && (
        <div className="flex flex-wrap gap-2 px-6 pb-3">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              onClick={() => setInput(ex)}
              className="rounded-full border border-ink/10 px-3 py-1.5 text-xs text-ink/70 hover:border-clinical hover:text-clinical"
            >
              {ex}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-center gap-3 border-t border-ink/10 p-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe your symptoms..."
          className="flex-1 rounded-full border border-ink/15 bg-paper px-4 py-2.5 text-sm outline-none focus:border-clinical"
        />
        <Button type="submit" disabled={isLoading || !input.trim()}>
          Send
        </Button>
      </form>
    </div>
  );
}
