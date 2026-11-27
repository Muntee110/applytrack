"use client";

import * as React from "react";
import Link from "next/link";
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  Clock,
  Calendar,
  Check,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { markReminderCompletedAction } from "@/app/actions/applications";
import { useToast } from "@/components/ui/toast";

export function NotificationBell() {
  const toast = useToast();
  const [isOpen, setIsOpen] = React.useState(false);
  const [data, setData] = React.useState({
    reminders: [],
    overdueCount: 0,
    upcomingCount: 0,
    totalActive: 0,
  });
  const [loading, setLoading] = React.useState(true);
  const [updatingId, setUpdatingId] = React.useState(null);
  const dropdownRef = React.useRef(null);

  const fetchReminders = React.useCallback(async () => {
    try {
      const res = await fetch("/api/reminders", { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setData({
            reminders: json.reminders || [],
            overdueCount: json.overdueCount || 0,
            upcomingCount: json.upcomingCount || 0,
            totalActive: json.totalActive || 0,
          });
        }
      }
    } catch (err) {
      console.warn("Could not fetch reminders:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchReminders();
    // Poll every 30 seconds for fresh reminder statuses
    const interval = setInterval(fetchReminders, 30000);
    return () => clearInterval(interval);
  }, [fetchReminders]);

  // Click outside listener
  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleMarkCompleted = async (e, applicationId, company) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setUpdatingId(applicationId);
      const res = await markReminderCompletedAction(applicationId, true);
      if (res.success) {
        toast?.success("Reminder Completed", `Marked follow-up for ${company} as done.`);
        // Update local state immediately
        setData((prev) => {
          const updated = prev.reminders.map((r) =>
            r.applicationId === applicationId ? { ...r, isCompleted: true } : r
          );
          const active = updated.filter((r) => !r.isCompleted);
          const overdue = active.filter((r) => r.isOverdue).length;
          return {
            reminders: updated,
            overdueCount: overdue,
            upcomingCount: active.length - overdue,
            totalActive: active.length,
          };
        });
      }
    } catch (err) {
      console.error("Failed to complete reminder:", err);
      toast?.error("Error", "Could not update reminder status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const activeReminders = data.reminders.filter((r) => !r.isCompleted);
  const completedReminders = data.reminders.filter((r) => r.isCompleted);

  const formatDueText = (dueDateStr, isOverdue) => {
    if (!dueDateStr) return "";
    const due = new Date(dueDateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueMidnight = new Date(due);
    dueMidnight.setHours(0, 0, 0, 0);

    const diffMs = dueMidnight.getTime() - today.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Due today";
    if (diffDays === 1) return "Due tomorrow";
    if (diffDays === -1) return "1 day overdue";
    if (diffDays < -1) return `${Math.abs(diffDays)} days overdue`;
    return `In ${diffDays} days`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={`Follow-up alerts: ${data.totalActive} active reminders`}
        aria-expanded={isOpen}
        className={cn(
          "relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100",
          isOpen && "ring-2 ring-blue-500 bg-slate-50 dark:bg-slate-800"
        )}
      >
        <Bell className="h-4 w-4" />

        {/* Counter Badge */}
        {data.totalActive > 0 && (
          <span
            className={cn(
              "absolute -top-1 -right-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full px-1 text-[10px] font-bold text-white shadow-xs",
              data.overdueCount > 0 ? "bg-rose-600 animate-pulse" : "bg-blue-600"
            )}
          >
            {data.totalActive > 9 ? "9+" : data.totalActive}
          </span>
        )}
      </button>

      {/* Popover Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900 z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 p-4 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                Reminders & Follow-ups
              </span>
              {data.totalActive > 0 && (
                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  {data.totalActive} active
                </span>
              )}
            </div>
            {data.overdueCount > 0 && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 dark:text-rose-400">
                <AlertCircle className="h-3.5 w-3.5" />
                {data.overdueCount} overdue
              </span>
            )}
          </div>

          {/* Body */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80">
            {activeReminders.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
                  All caught up!
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-xs">
                  No overdue follow-ups or upcoming interview rounds scheduled right now.
                </p>
              </div>
            ) : (
              activeReminders.map((rem) => {
                const dueText = formatDueText(rem.dueDate, rem.isOverdue);
                const isOverdue = rem.isOverdue;

                return (
                  <div
                    key={rem.id}
                    className={cn(
                      "group flex items-start justify-between gap-3 p-3.5 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors",
                      isOverdue && "bg-rose-50/30 dark:bg-rose-950/20"
                    )}
                  >
                    <Link
                      href={`/applications/${rem.applicationId}`}
                      onClick={() => setIsOpen(false)}
                      className="flex-1 min-w-0"
                    >
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                            isOverdue
                              ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                              : rem.type === "INTERVIEW_SCHEDULED"
                              ? "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300"
                              : "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                          )}
                        >
                          {isOverdue ? "Overdue" : rem.type === "INTERVIEW_SCHEDULED" ? "Interview" : "Follow-up"}
                        </span>
                        <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                          {rem.company}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-1">
                        {rem.title}
                      </p>

                      <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-400 dark:text-slate-500">
                        <span className={cn("flex items-center gap-1 font-medium", isOverdue ? "text-rose-600 dark:text-rose-400" : "text-slate-500 dark:text-slate-400")}>
                          <Clock className="h-3 w-3" />
                          {dueText}
                        </span>
                        {rem.description && (
                          <span className="truncate">• {rem.description}</span>
                        )}
                      </div>
                    </Link>

                    {/* Mark Done button */}
                    <button
                      type="button"
                      title="Mark as completed"
                      disabled={updatingId === rem.applicationId}
                      onClick={(e) => handleMarkCompleted(e, rem.applicationId, rem.company)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-600 dark:border-slate-700 dark:text-slate-400 dark:hover:border-emerald-600 dark:hover:bg-emerald-950/60 dark:hover:text-emerald-300 transition-colors shrink-0 mt-0.5"
                    >
                      <Check className="h-3.5 w-3.5" />
                    </button>
                  </div>
                );
              })
            )}

            {/* Recently Completed section (if any) */}
            {completedReminders.length > 0 && (
              <div className="p-3 bg-slate-50/50 dark:bg-slate-900/50">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Recently Completed ({completedReminders.length})
                </span>
                <div className="mt-2 space-y-1">
                  {completedReminders.slice(0, 3).map((r) => (
                    <div
                      key={r.id}
                      className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 line-through py-0.5"
                    >
                      <span className="truncate">{r.company} — {r.title}</span>
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 ml-2" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-slate-100 p-2.5 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-950/50 flex items-center justify-between text-xs">
            <Link
              href="/applications"
              onClick={() => setIsOpen(false)}
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-semibold inline-flex items-center gap-1"
            >
              <span>View Applications Pipeline</span>
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
