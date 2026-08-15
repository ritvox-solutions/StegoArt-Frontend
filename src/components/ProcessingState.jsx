import { useEffect, useState } from "react";

/**
 * Spinner + rotating status text. `messages` is shown in order, advancing
 * every `intervalMs`, looping on the last message until the parent swaps
 * this out for a result/error state.
 */
export default function ProcessingState({ messages, intervalMs = 1800 }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
    if (messages.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => Math.min(i + 1, messages.length - 1));
    }, intervalMs);
    return () => clearInterval(id);
  }, [messages, intervalMs]);

  return (
    <div className="flex flex-col items-center justify-center gap-5 rounded-2xl border border-border-subtle bg-surface px-6 py-16 text-center">
      <span
        className="h-10 w-10 animate-spin rounded-full border-4 border-border border-t-brand-from"
        role="status"
        aria-live="polite"
      />
      <p className="text-base font-medium text-text" aria-live="polite">
        {messages[index]}
      </p>
    </div>
  );
}
