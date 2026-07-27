import Link from "next/link";
import { ChatWindow } from "@/components/patient/ChatWindow";

export default function PatientPage() {
  return (
    <main className="min-h-screen bg-paper px-6 py-10 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex items-center justify-between">
          <Link href="/" className="font-display text-lg font-semibold tracking-tight">
            MediCore <span className="text-clinical">AI</span>
          </Link>
          <span className="font-mono text-xs uppercase tracking-wider text-ink/50">
            Patient Portal
          </span>
        </div>
        <ChatWindow />
        <p className="mt-4 text-center text-xs text-ink/40">
          This assistant does not provide medical advice or diagnoses. In an
          emergency, call 911 or go to your nearest emergency room.
        </p>
      </div>
    </main>
  );
}
