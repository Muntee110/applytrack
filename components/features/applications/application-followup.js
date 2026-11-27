"use client";

import * as React from "react";
import { Calendar, Bell, CheckCircle2, AlertCircle, Clock, Save, RefreshCw } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import {
  updateFollowUpAction,
  markReminderCompletedAction,
} from "@/app/actions/applications";
import { cn } from "@/lib/utils/cn";

export function ApplicationFollowUp({
  applicationId,
  company,
  role,
  initialFollowUpDate,
  initialCompleted = false,
}) {
  const toast = useToast();
  const [followUpDate, setFollowUpDate] = React.useState(
    initialFollowUpDate ? initialFollowUpDate.split("T")[0] : ""
  );
  const [isCompleted, setIsCompleted] = React.useState(Boolean(initialCompleted));
  const [isSavingDate, setIsSavingDate] = React.useState(false);
  const [isTogglingStatus, setIsTogglingStatus] = React.useState(false);

  // Compute status
  const todayStr = new Date().toISOString().split("T")[0];
  const isOverdue = followUpDate && followUpDate < todayStr && !isCompleted;
  const isDueToday = followUpDate && followUpDate === todayStr && !isCompleted;

  const handleSaveDate = async (e) => {
    e.preventDefault();
    if (isSavingDate) return;

    try {
      setIsSavingDate(true);
      const isoDate = followUpDate ? new Date(followUpDate).toISOString() : null;
      const res = await updateFollowUpAction(applicationId, isoDate);

      if (res.success) {
        setIsCompleted(false);
        toast?.success(
          "Follow-Up Scheduled",
          isoDate
            ? `Reminder set for ${company} on ${followUpDate}.`
            : `Cleared follow-up date for ${company}.`
        );
      } else {
        toast?.error("Update Failed", res.error || "Could not save follow-up date.");
      }
    } catch {
      toast?.error("Error", "Could not save reminder.");
    } finally {
      setIsSavingDate(false);
    }
  };

  const handleToggleCompleted = async () => {
    if (isTogglingStatus) return;

    try {
      setIsTogglingStatus(true);
      const newStatus = !isCompleted;
      const res = await markReminderCompletedAction(applicationId, newStatus);

      if (res.success) {
        setIsCompleted(newStatus);
        toast?.success(
          newStatus ? "Follow-Up Completed!" : "Follow-Up Reopened",
          newStatus
            ? `Marked reminder for ${company} as finished.`
            : `Reopened follow-up reminder for ${company}.`
        );
      } else {
        toast?.error("Update Failed", res.error || "Could not update status.");
      }
    } catch {
      toast?.error("Error", "Could not toggle reminder status.");
    } finally {
      setIsTogglingStatus(false);
    }
  };

  return (
    <Card className="border border-slate-200 dark:border-slate-800">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <div className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg",
            isOverdue
              ? "bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400"
              : isCompleted
              ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400"
              : "bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400"
          )}>
            <Bell className="h-4 w-4" />
          </div>
          <CardTitle className="text-base">Follow-up & Reminders</CardTitle>
        </div>

        {/* Status Badge */}
        {followUpDate ? (
          isCompleted ? (
            <Badge variant="success" className="gap-1 text-xs">
              <CheckCircle2 className="h-3 w-3" />
              <span>Completed</span>
            </Badge>
          ) : isOverdue ? (
            <Badge variant="destructive" className="gap-1 text-xs animate-pulse">
              <AlertCircle className="h-3 w-3" />
              <span>Overdue</span>
            </Badge>
          ) : isDueToday ? (
            <Badge variant="warning" className="gap-1 text-xs">
              <Clock className="h-3 w-3" />
              <span>Due Today</span>
            </Badge>
          ) : (
            <Badge variant="secondary" className="gap-1 text-xs">
              <Calendar className="h-3 w-3" />
              <span>Scheduled</span>
            </Badge>
          )
        ) : (
          <Badge variant="secondary" className="text-xs text-slate-400">
            No Reminder
          </Badge>
        )}
      </CardHeader>

      <CardContent className="space-y-4 pt-1">
        <form onSubmit={handleSaveDate} className="space-y-3">
          <div>
            <label
              htmlFor={`followup-date-${applicationId}`}
              className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5"
            >
              Next Follow-Up Date
            </label>
            <div className="flex items-center gap-2">
              <input
                id={`followup-date-${applicationId}`}
                type="date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                className="h-9 flex-1 rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
              <Button
                type="submit"
                variant="outline"
                size="sm"
                isLoading={isSavingDate}
                disabled={isSavingDate}
                className="h-9 gap-1.5 text-xs shrink-0 font-medium"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Save Date</span>
              </Button>
            </div>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
              Trigger alerts in your top navigation header and dashboard overview.
            </p>
          </div>
        </form>

        {/* Completion Toggle */}
        {followUpDate && (
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              {isCompleted ? "Marked as finished" : "Follow-up pending"}
            </span>
            <Button
              type="button"
              variant={isCompleted ? "outline" : "default"}
              size="sm"
              isLoading={isTogglingStatus}
              disabled={isTogglingStatus}
              onClick={handleToggleCompleted}
              className="h-8 gap-1.5 text-xs font-semibold"
            >
              {isCompleted ? (
                <>
                  <RefreshCw className="h-3 w-3" />
                  <span>Reopen Reminder</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Mark as Completed</span>
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
