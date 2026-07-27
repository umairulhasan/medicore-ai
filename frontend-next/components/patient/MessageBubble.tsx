import { ChatMessage } from "@/lib/types";

export function MessageBubble({ message }: { message: ChatMessage }) {
  const isPatient = message.role === "patient";
  return (
    <div className={`flex ${isPatient ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isPatient
            ? "bg-clinical text-paper rounded-br-sm"
            : "bg-white/70 text-ink border border-ink/10 rounded-bl-sm"
        }`}
      >
        {message.text}
      </div>
    </div>
  );
}
