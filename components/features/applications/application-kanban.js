"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowLeft,
  Building,
  DollarSign,
  MapPin,
  Calendar,
  Plus,
  Eye,
  Trash2,
} from "lucide-react";
import { APPLICATION_STATUS, STATUS_CONFIG } from "@/lib/utils/constants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { updateApplicationStatusAction, deleteApplicationAction } from "@/app/actions/applications";
import { useToast } from "@/components/ui/toast";
import { useApplicationModal } from "@/components/providers/modal-provider";
import { formatDate } from "@/lib/utils/formatters";
import { cn } from "@/lib/utils/cn";

const KANBAN_COLUMNS = [
  { id: APPLICATION_STATUS.WISHLIST, title: "Wishlist", color: "border-slate-300 dark:border-slate-700" },
  { id: APPLICATION_STATUS.APPLIED, title: "Applied", color: "border-blue-400 dark:border-blue-600" },
  { id: APPLICATION_STATUS.INTERVIEWING, title: "Interviewing", color: "border-amber-400 dark:border-amber-600" },
  { id: APPLICATION_STATUS.OFFER, title: "Offer", color: "border-emerald-400 dark:border-emerald-600" },
  { id: APPLICATION_STATUS.REJECTED, title: "Rejected", color: "border-rose-400 dark:border-rose-600" },
];

const STAGE_ORDER = [
  APPLICATION_STATUS.WISHLIST,
  APPLICATION_STATUS.APPLIED,
  APPLICATION_STATUS.INTERVIEWING,
  APPLICATION_STATUS.OFFER,
];

export function ApplicationKanban({ applications = [] }) {
  const toast = useToast();
  const { openModal } = useApplicationModal();
  const [localApps, setLocalApps] = React.useState(applications);

  React.useEffect(() => {
    setLocalApps(applications);
  }, [applications]);

  const handleMoveStage = async (id, nextStatus) => {
    const prevApps = [...localApps];

    // Optimistic update
    setLocalApps((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: nextStatus } : app))
    );

    try {
      const res = await updateApplicationStatusAction(id, nextStatus);
      if (res.success) {
        toast?.success("Stage Advanced", `Moved to ${STATUS_CONFIG[nextStatus]?.label || nextStatus}.`);
      } else {
        setLocalApps(prevApps);
        toast?.error("Move Failed", res.error || "Could not update status.");
      }
    } catch {
      setLocalApps(prevApps);
      toast?.error("Error", "Network error updating status.");
    }
  };

  const handleDelete = async (id, company) => {
    if (!window.confirm(`Delete application for ${company}?`)) return;

    const prevApps = [...localApps];
    setLocalApps((prev) => prev.filter((app) => app.id !== id));

    try {
      const res = await deleteApplicationAction(id);
      if (res.success) {
        toast?.success("Application Deleted", `Removed ${company}.`);
      } else {
        setLocalApps(prevApps);
        toast?.error("Delete Failed", res.error || "Could not delete.");
      }
    } catch {
      setLocalApps(prevApps);
      toast?.error("Error", "Network error.");
    }
  };

  if (localApps.length === 0) {
    return (
      <EmptyState
        title="No job applications found"
        description="Try adjusting your search query, clearing filters, or track a new application to populate your pipeline board."
        action={
          <Button onClick={openModal} variant="default" size="sm">
            Add New Application
          </Button>
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-start overflow-x-auto pb-4">
      {KANBAN_COLUMNS.map((col) => {
        const colApps = localApps.filter((a) => a.status === col.id);
        const config = STATUS_CONFIG[col.id];

        return (
          <div
            key={col.id}
            className="flex flex-col rounded-2xl border border-slate-200/90 bg-slate-100/50 p-3 dark:border-slate-800/80 dark:bg-slate-900/40 min-h-[500px]"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between px-2 py-1.5 mb-3 border-b border-slate-200/60 dark:border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <span className={cn("h-2.5 w-2.5 rounded-full shrink-0", config.dotColor)} />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  {col.title}
                </h3>
              </div>
              <span className="rounded-full bg-slate-200/70 px-2 py-0.5 text-[11px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                {colApps.length}
              </span>
            </div>

            {/* Column Cards */}
            <div className="flex-1 space-y-3">
              {colApps.length === 0 ? (
                <div className="flex h-32 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300/80 p-4 text-center dark:border-slate-800">
                  <p className="text-xs text-slate-400">No applications</p>
                </div>
              ) : (
                colApps.map((app) => {
                  const stageIdx = STAGE_ORDER.indexOf(app.status);
                  const canMoveForward = stageIdx !== -1 && stageIdx < STAGE_ORDER.length - 1;
                  const canMoveBackward = stageIdx > 0;
                  const nextStage = canMoveForward ? STAGE_ORDER[stageIdx + 1] : null;
                  const prevStage = canMoveBackward ? STAGE_ORDER[stageIdx - 1] : null;

                  return (
                    <div
                      key={app.id}
                      className="group relative rounded-xl border border-slate-200 bg-white p-4 shadow-xs transition-all hover:shadow-md hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 space-y-2.5"
                    >
                      {/* Top row: Company & Priority */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-xs font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                            {app.company.slice(0, 2).toUpperCase()}
                          </div>
                          <Link
                            href={`/applications/${app.id}`}
                            className="font-bold text-sm text-slate-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400 transition-colors line-clamp-1"
                          >
                            {app.company}
                          </Link>
                        </div>

                        {app.priority && (
                          <Badge
                            variant={
                              app.priority === "High"
                                ? "destructive"
                                : app.priority === "Medium"
                                ? "warning"
                                : "secondary"
                            }
                            className="text-[10px] px-1.5 py-0"
                          >
                            {app.priority}
                          </Badge>
                        )}
                      </div>

                      {/* Role & Stage */}
                      <div>
                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 line-clamp-1">
                          {app.role}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                          {app.stage || app.workplaceType}
                        </p>
                      </div>

                      {/* Salary or Date */}
                      <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-800/80">
                        <span>{app.salary || app.workplaceType}</span>
                        <span>{formatDate(app.appliedDate)}</span>
                      </div>

                      {/* Card Actions: Quick Advance / Retreat */}
                      <div className="flex items-center justify-between pt-1 text-xs">
                        <div className="flex items-center gap-1">
                          <Link
                            href={`/applications/${app.id}`}
                            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                            title="View Details"
                            aria-label={`View details for ${app.role} at ${app.company}`}
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDelete(app.id, app.company)}
                            className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                            title="Delete"
                            aria-label={`Delete application for ${app.company}`}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-1">
                          {canMoveBackward && (
                            <button
                              type="button"
                              onClick={() => handleMoveStage(app.id, prevStage)}
                              title={`Move back to ${STATUS_CONFIG[prevStage]?.label}`}
                              aria-label={`Move application back to ${STATUS_CONFIG[prevStage]?.label}`}
                              className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                            >
                              <ArrowLeft className="h-3 w-3" />
                            </button>
                          )}
                          {canMoveForward && (
                            <button
                              type="button"
                              onClick={() => handleMoveStage(app.id, nextStage)}
                              title={`Advance to ${STATUS_CONFIG[nextStage]?.label}`}
                              aria-label={`Advance application to ${STATUS_CONFIG[nextStage]?.label}`}
                              className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-300 dark:hover:bg-blue-900 transition-colors text-[11px] font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                            >
                              <span>Next</span>
                              <ArrowRight className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
