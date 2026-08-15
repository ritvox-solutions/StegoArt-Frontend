import { useToast } from "../state/ToastContext";

const toneStyles = {
  danger: "border-danger-border bg-danger-bg text-text",
  warning: "border-warning-border bg-warning-bg text-text",
};

export default function ToastViewport() {
  const { toasts, dismissToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4 sm:items-end sm:right-4 sm:left-auto"
      role="region"
      aria-label="Notifications"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          role="alert"
          className={`pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-lg border px-4 py-3 shadow-lg ${
            toneStyles[t.tone] ?? toneStyles.danger
          }`}
        >
          <p className="flex-1 text-sm leading-snug">{t.message}</p>
          <div className="flex shrink-0 items-center gap-2">
            {t.onRetry && (
              <button
                type="button"
                onClick={() => {
                  dismissToast(t.id);
                  t.onRetry();
                }}
                className="rounded-md bg-surface-raised px-2.5 py-1 text-xs font-semibold text-text hover:bg-surface-hover"
              >
                Retry
              </button>
            )}
            <button
              type="button"
              onClick={() => dismissToast(t.id)}
              aria-label="Dismiss notification"
              className="rounded-md px-1.5 py-1 text-xs text-text-muted hover:text-text"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
