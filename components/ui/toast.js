"use client";

import * as React from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const ToastContext = React.createContext({
  toast: () => {},
  success: () => {},
  error: () => {},
  info: () => {},
});

export function useToast() {
  return React.useContext(ToastContext);
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = React.useState([]);

  const addToast = React.useCallback(({ title, description, variant = "info", duration = 3500 }) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newToast = { id, title, description, variant };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, []);

  const removeToast = React.useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toastHelpers = React.useMemo(
    () => ({
      toast: addToast,
      success: (title, description) => addToast({ title, description, variant: "success" }),
      error: (title, description) => addToast({ title, description, variant: "error" }),
      info: (title, description) => addToast({ title, description, variant: "info" }),
    }),
    [addToast]
  );

  return (
    <ToastContext.Provider value={toastHelpers}>
      {children}

      {/* Floating Toast Notification Viewport */}
      <div
        aria-live="polite"
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none p-2 sm:p-0"
      >
        {toasts.map((t) => {
          const isSuccess = t.variant === "success";
          const isError = t.variant === "error";

          return (
            <div
              key={t.id}
              role="status"
              className={cn(
                "pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-md transition-all duration-200 animate-in slide-in-from-bottom-3",
                isSuccess && "bg-white/95 dark:bg-slate-900/95 border-emerald-200 dark:border-emerald-900/80 text-slate-900 dark:text-slate-100",
                isError && "bg-white/95 dark:bg-slate-900/95 border-rose-200 dark:border-rose-900/80 text-slate-900 dark:text-slate-100",
                !isSuccess && !isError && "bg-white/95 dark:bg-slate-900/95 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100"
              )}
            >
              <div className="shrink-0 mt-0.5">
                {isSuccess && <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />}
                {isError && <AlertCircle className="h-5 w-5 text-rose-600 dark:text-rose-400" />}
                {!isSuccess && !isError && <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
              </div>

              <div className="flex-1 space-y-0.5">
                <p className="text-sm font-semibold leading-tight">{t.title}</p>
                {t.description && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                    {t.description}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => removeToast(t.id)}
                aria-label="Close notification"
                className="shrink-0 rounded-md p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
