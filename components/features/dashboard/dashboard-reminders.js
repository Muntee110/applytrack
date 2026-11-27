"use client";

import * as React from "react";
import Link from "next/link";
import {
  Bell,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Check,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { markReminderCompletedAction } from "@/app/actions/applications";
import { cn } from "@/lib/utils/cn";

export function DashboardReminders({ initialReminders = [], overdueCount = 0, upcomingCount = 0 }) {
  const toast = useToast();
  const [reminders, setReminders] = React.useState(initialReminders);
  const [updatingId, setUpdatingId] = React.useState(null);

  const handleMarkCompleted = async (e, applicationId, company) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setUpdatingId(applicationId);
      const res = await markReminderCompletedAction(applicationId, true);
      if (res.success) {
        toast?.success("Completed", `Follow-up for ${company} marked as completed.`);
        setReminders((prev) =>
          prev.map((r) =>
            r.applicationId === applicationId ? { ...r, isCompleted: true } : r
          )
        );
      } else {
        toast?.error("Error", res.error || "Failed to update reminder.");
      }
    } catch {
      toast?.error("Error", "Could not complete reminder.");
    } finally {
      setUpdatingId(null);
    }
  };

  const activeReminders = reminders.filter((r) => !r.isCompleted);

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
    <Card className="border border-slate-200 dark:border-slate-800">
      <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
            <Bell className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-base">Follow-Up & Interview Alerts</CardTitle>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Action items and recruiter touchpoints requiring attention
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {overdueCount > 0 && (
            <Badge variant="destructive" className="gap-1 text-xs">
              <AlertCircle className="h-3 w-3" />
              <span>{overdueCount} Overdue</span>
            </Badge>
          )}
          {upcomingCount > 0 && (
            <Badge variant="secondary" className="gap-1 text-xs">
              <Clock className="h-3 w-3" />
              <span>{upcomingCount} Upcoming</span>
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {activeReminders.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
              You are all caught up!
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-sm">
              No follow-ups or upcoming interview rounds are due right now. Schedule reminders when tracking new roles.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {activeReminders.slice(0, 4).map((rem) => {
              const dueText = formatDueText(rem.dueDate, rem.isOverdue);
              const isOverdue = rem.isOverdue;

              return (
                <div
                  key={rem.id}
                  className={cn(
                    "flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-slate-50/70 dark:hover:bg-slate-900/40 transition-colors gap-3",
                    isOverdue && "bg-rose-50/30 dark:bg-rose-950/20"
                  )}
                >
                  <Link
                    href={`/applications/${rem.applicationId}`}
                    className="flex items-start sm:items-center gap-3 min-w-0 flex-1 group"
                  >
                    <div
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-bold text-xs",
                        isOverdue
                          ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                          : rem.type === "INTERVIEW_SCHEDULED"
                          ? "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300"
                          : "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                      )}
                    >
                      {rem.company.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 dark:text-white text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                          {rem.company}
                        </span>
                        <span
                          className={cn(
                            "rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase",
                            isOverdue
                              ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                              : rem.type === "INTERVIEW_SCHEDULED"
                              ? "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300"
                              : "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                          )}
                        >
                          {isOverdue ? "Overdue" : rem.type === "INTERVIEW_SCHEDULED" ? "Interview" : "Follow-Up"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 truncate">
                        {rem.title} — {rem.description}
                      </p>
                    </div>
                  </Link>

                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 ml-12 sm:ml-0">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 text-xs font-semibold",
                        isOverdue ? "text-rose-600 dark:text-rose-400" : "text-slate-500 dark:text-slate-400"
                      )}
                    >
                      <Clock className="h-3.5 w-3.5" />
                      {dueText}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      isLoading={updatingId === rem.applicationId}
                      disabled={updatingId === rem.applicationId}
                      onClick={(e) => handleMarkCompleted(e, rem.applicationId, rem.company)}
                      className="gap-1.5 text-xs h-8"
                    >
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Mark Done</span>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
