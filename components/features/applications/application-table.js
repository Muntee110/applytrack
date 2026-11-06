"use client";

import * as React from "react";
import Link from "next/link";
import {
  ExternalLink,
  MoreVertical,
  Trash2,
  Eye,
  Building,
  Calendar,
  DollarSign,
  MapPin,
} from "lucide-react";
import { ApplicationStatusPill } from "./application-status-pill";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { deleteApplicationAction } from "@/app/actions/applications";
import { formatDate } from "@/lib/utils/formatters";
import { useApplicationModal } from "@/components/providers/modal-provider";
import { useToast } from "@/components/ui/toast";

export function ApplicationTable({ applications = [] }) {
  const { openModal } = useApplicationModal();
  const toast = useToast();
  const [activeMenuId, setActiveMenuId] = React.useState(null);
  const [deletingId, setDeletingId] = React.useState(null);

  // Close active dropdown menu when clicking anywhere
  React.useEffect(() => {
    const handleDocumentClick = () => setActiveMenuId(null);
    if (activeMenuId) {
      document.addEventListener("click", handleDocumentClick);
    }
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [activeMenuId]);

  const handleDelete = async (id, company) => {
    if (!window.confirm(`Are you sure you want to delete the application for ${company}?`)) {
      return;
    }

    try {
      setDeletingId(id);
      const res = await deleteApplicationAction(id);
      if (res.success) {
        toast?.success("Application Deleted", `Removed ${company} from your pipeline.`);
      } else {
        toast?.error("Delete Failed", res.error || "Failed to delete application.");
      }
    } catch {
      toast?.error("Error", "Could not delete application.");
    } finally {
      setDeletingId(null);
    }
  };

  if (applications.length === 0) {
    return (
      <EmptyState
        title="No job applications found"
        description="Try adjusting your search query, clearing filters, or track a new application to populate your dashboard."
        action={
          <Button onClick={openModal} variant="default" size="sm">
            Add New Application
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table View (hidden on mobile) */}
      <div className="hidden md:block overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900/80">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50/75 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
              <tr>
                <th scope="col" className="py-3.5 pl-5 pr-3">
                  Company & Role
                </th>
                <th scope="col" className="px-3 py-3.5">
                  Pipeline Status
                </th>
                <th scope="col" className="px-3 py-3.5">
                  Interview Stage
                </th>
                <th scope="col" className="px-3 py-3.5">
                  Salary / Comp
                </th>
                <th scope="col" className="px-3 py-3.5">
                  Applied Date
                </th>
                <th scope="col" className="relative py-3.5 pl-3 pr-5 text-right">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {applications.map((app) => {
                const isMenuOpen = activeMenuId === app.id;
                const isDeleting = deletingId === app.id;

                return (
                  <tr
                    key={app.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group"
                  >
                    {/* Company & Role */}
                    <td className="py-4 pl-5 pr-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200 group-hover:scale-105 transition-transform">
                          {app.company.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <Link
                            href={`/applications/${app.id}`}
                            className="font-semibold text-slate-900 hover:text-blue-600 dark:text-slate-100 dark:hover:text-blue-400 transition-colors"
                          >
                            {app.company}
                          </Link>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-slate-600 dark:text-slate-400">
                              {app.role}
                            </span>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500">
                              • {app.workplaceType}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Status Pill with optimistic inline update */}
                    <td className="px-3 py-4">
                      <ApplicationStatusPill
                        id={app.id}
                        currentStatus={app.status}
                      />
                    </td>

                    {/* Stage */}
                    <td className="px-3 py-4 text-xs font-medium text-slate-600 dark:text-slate-400">
                      {app.stage || "Application Submitted"}
                    </td>

                    {/* Salary */}
                    <td className="px-3 py-4 text-xs font-medium text-slate-700 dark:text-slate-300">
                      {app.salary || "—"}
                    </td>

                    {/* Applied Date */}
                    <td className="px-3 py-4 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {formatDate(app.appliedDate)}
                    </td>

                    {/* Actions Menu */}
                    <td className="relative py-4 pl-3 pr-5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/applications/${app.id}`}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors"
                          title="View Details"
                          aria-label={`View application details for ${app.role} at ${app.company}`}
                        >
                          <Eye className="h-4 w-4" />
                        </Link>

                        {app.url && (
                          <a
                            href={app.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors"
                            title="Open Job Posting"
                            aria-label={`Open job posting for ${app.role} at ${app.company}`}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}

                        <button
                          type="button"
                          onClick={() => handleDelete(app.id, app.company)}
                          disabled={isDeleting}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/50 dark:hover:text-rose-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 transition-colors disabled:opacity-50"
                          title="Delete Application"
                          aria-label={`Delete application for ${app.company}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View (shown only on mobile screens) */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {applications.map((app) => {
          const isDeleting = deletingId === app.id;

          return (
            <div
              key={app.id}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900/90 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    {app.company.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <Link
                      href={`/applications/${app.id}`}
                      className="font-semibold text-slate-900 dark:text-white hover:underline text-sm"
                    >
                      {app.company}
                    </Link>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {app.role}
                    </p>
                  </div>
                </div>
                <ApplicationStatusPill
                  id={app.id}
                  currentStatus={app.status}
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <span className="block text-[10px] uppercase font-semibold text-slate-400">
                    Stage
                  </span>
                  <span className="font-medium text-slate-700 dark:text-slate-300 truncate block">
                    {app.stage || "Submitted"}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-semibold text-slate-400">
                    Salary
                  </span>
                  <span className="font-medium text-slate-700 dark:text-slate-300 truncate block">
                    {app.salary || "—"}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[11px] text-slate-400">
                  Applied {formatDate(app.appliedDate)}
                </span>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/applications/${app.id}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 focus-visible:outline-none focus-visible:underline"
                    aria-label={`View details for ${app.role} at ${app.company}`}
                  >
                    Details
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(app.id, app.company)}
                    disabled={isDeleting}
                    className="text-xs text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 ml-2 focus-visible:outline-none focus-visible:underline disabled:opacity-50"
                    aria-label={`Delete application for ${app.company}`}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
