"use client";

import * as React from "react";
import { ChevronDown, Check } from "lucide-react";
import { updateApplicationStatusAction } from "@/app/actions/applications";
import { APPLICATION_STATUS, STATUS_CONFIG } from "@/lib/utils/constants";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils/cn";

export function ApplicationStatusPill({ id, currentStatus }) {
  const [status, setStatus] = React.useState(currentStatus);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isPending, setIsPending] = React.useState(false);
  const dropdownRef = React.useRef(null);
  const toast = useToast();

  React.useEffect(() => {
    setStatus(currentStatus);
  }, [currentStatus]);

  // Close dropdown on outside click
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleStatusChange = async (newStatus) => {
    if (newStatus === status) {
      setIsOpen(false);
      return;
    }

    const previousStatus = status;
    // Optimistic update
    setStatus(newStatus);
    setIsOpen(false);
    setIsPending(true);

    try {
      const res = await updateApplicationStatusAction(id, newStatus);
      if (res.success) {
        toast?.success("Status Updated", `Moved application to ${STATUS_CONFIG[newStatus]?.label || newStatus}.`);
      } else {
        // Rollback
        setStatus(previousStatus);
        toast?.error("Update Failed", res.error || "Failed to update status.");
      }
    } catch {
      setStatus(previousStatus);
      toast?.error("Network Error", "Unable to update status.");
    } finally {
      setIsPending(false);
    }
  };

  const currentConfig = STATUS_CONFIG[status] || STATUS_CONFIG[APPLICATION_STATUS.APPLIED];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        disabled={isPending}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Current status: ${currentConfig.label}. Click to change status`}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border transition-all",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
          currentConfig.color,
          isPending && "opacity-70 animate-pulse"
        )}
      >
        <span
          className={cn("h-1.5 w-1.5 rounded-full shrink-0", currentConfig.dotColor)}
          aria-hidden="true"
        />
        <span>{currentConfig.label}</span>
        <ChevronDown className="h-3 w-3 opacity-60 ml-0.5" />
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label="Application statuses"
          className="absolute left-0 z-50 mt-1.5 w-44 origin-top-left rounded-xl border border-slate-200 bg-white p-1 shadow-lg ring-1 ring-black/5 focus:outline-none dark:border-slate-800 dark:bg-slate-900 animate-in fade-in zoom-in-95 duration-100"
        >
          <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Change Pipeline Status
          </div>
          {Object.entries(STATUS_CONFIG).map(([key, config]) => {
            const isSelected = key === status;
            return (
              <button
                key={key}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={(e) => {
                  e.stopPropagation();
                  handleStatusChange(key);
                }}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:bg-slate-100 dark:focus-visible:bg-slate-800",
                  isSelected
                    ? "bg-slate-100 font-semibold text-slate-900 dark:bg-slate-800 dark:text-white"
                    : "text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/60"
                )}
              >
                <div className="flex items-center gap-2">
                  <span className={cn("h-2 w-2 rounded-full", config.dotColor)} />
                  <span>{config.label}</span>
                </div>
                {isSelected && <Check className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
