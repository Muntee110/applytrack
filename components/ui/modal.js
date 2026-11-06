"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = "max-w-xl",
  className,
}) {
  const modalRef = React.useRef(null);

  // WAI-ARIA Modal behavior: ESC dismiss, background scroll lock, focus trap, and restore focus
  React.useEffect(() => {
    if (!isOpen) return;

    const previousActiveElement = document.activeElement;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Set initial focus inside modal
    const timer = setTimeout(() => {
      const modalElement = modalRef.current;
      if (modalElement) {
        const focusableElements = modalElement.querySelectorAll(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length > 0) {
          focusableElements[0].focus();
        }
      }
    }, 50);

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key === "Tab") {
        const modalElement = modalRef.current;
        if (!modalElement) return;

        const focusables = modalElement.querySelectorAll(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = originalOverflow || "unset";
      window.removeEventListener("keydown", handleKeyDown);
      if (previousActiveElement && typeof previousActiveElement.focus === "function") {
        previousActiveElement.focus();
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby={description ? "modal-description" : undefined}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-hidden"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog card with strict max height of 90vh (90dvh) and flex column layout */}
      <div
        ref={modalRef}
        className={cn(
          "relative z-10 flex flex-col w-full max-h-[90vh] md:max-h-[90dvh] rounded-2xl border border-slate-200 bg-white shadow-2xl transition-all overflow-hidden",
          "dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100",
          "animate-in zoom-in-95 duration-150 ease-out",
          maxWidth,
          className
        )}
      >
        {/* Header - Fixed & non-shrinking at the top */}
        <div className="shrink-0 flex items-start justify-between border-b border-slate-100 p-5 sm:p-6 dark:border-slate-800 bg-white dark:bg-slate-900 z-10">
          <div className="space-y-1 pr-4">
            {title && (
              <h2
                id="modal-title"
                className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50"
              >
                {title}
              </h2>
            )}
            {description && (
              <p
                id="modal-description"
                className="text-sm text-slate-500 dark:text-slate-400"
              >
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content area: Form with scrollable body and fixed footer */}
        {children}
      </div>
    </div>
  );
}

export function ModalBody({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "flex-1 min-h-0 overflow-y-auto p-5 sm:p-6 space-y-4 overscroll-contain modal-scrollbar",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function ModalFooter({ className, ...props }) {
  return (
    <div
      className={cn(
        "shrink-0 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 px-5 py-4 sm:px-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 mt-auto z-10",
        className
      )}
      {...props}
    />
  );
}
