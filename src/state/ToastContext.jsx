import { createContext, useCallback, useContext, useState } from "react";

const ToastContext = createContext(null);

let nextId = 1;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message, { onRetry, tone = "danger", durationMs = 9000 } = {}) => {
      const id = nextId++;
      setToasts((prev) => [...prev, { id, message, onRetry, tone }]);
      if (durationMs) {
        setTimeout(() => dismissToast(id), durationMs);
      }
      return id;
    },
    [dismissToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, showToast, dismissToast }}>{children}</ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}
