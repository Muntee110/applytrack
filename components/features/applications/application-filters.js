"use client";

import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, X } from "lucide-react";
import { APPLICATION_STATUS, WORKPLACE_TYPES } from "@/lib/utils/constants";
import { cn } from "@/lib/utils/cn";

function ApplicationFiltersContent({ statusCounts = {} }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get("search") || "";
  const currentStatus = searchParams.get("status") || "ALL";
  const currentWorkplace = searchParams.get("workplace") || "ALL";

  const [searchTerm, setSearchTerm] = React.useState(currentSearch);

  // Sync state if URL changes externally
  React.useEffect(() => {
    setSearchTerm(currentSearch);
  }, [currentSearch]);

  const updateFilters = (updates) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === "ALL" || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateFilters({ search: searchTerm });
  };

  const clearSearch = () => {
    setSearchTerm("");
    updateFilters({ search: "" });
  };

  const statusTabs = [
    { key: "ALL", label: "All", count: statusCounts.total || 0 },
    { key: APPLICATION_STATUS.APPLIED, label: "Applied", count: statusCounts.applied || 0 },
    { key: APPLICATION_STATUS.INTERVIEWING, label: "Interviewing", count: statusCounts.interviewing || 0 },
    { key: APPLICATION_STATUS.OFFER, label: "Offer", count: statusCounts.offers || 0 },
    { key: APPLICATION_STATUS.WISHLIST, label: "Wishlist", count: statusCounts.wishlist || 0 },
    { key: APPLICATION_STATUS.REJECTED, label: "Rejected", count: statusCounts.rejected || 0 },
  ];

  const hasActiveFilters = Boolean(
    currentSearch ||
      (currentStatus && currentStatus !== "ALL") ||
      (currentWorkplace && currentWorkplace !== "ALL")
  );

  return (
    <div className="space-y-4">
      {/* Top Filter Bar: Search + Workplace dropdown */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search input form */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            placeholder="Search by company, role, location, or notes..."
            aria-label="Search applications by company, role, or notes"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-10 w-full rounded-xl border border-slate-300 bg-white pl-9 pr-9 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={clearSearch}
              aria-label="Clear search query"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </form>

        {/* Workplace arrangement filter */}
        <div className="flex items-center gap-2">
          <label htmlFor="workplace-filter" className="text-xs font-semibold text-slate-500 dark:text-slate-400 shrink-0">
            Workplace:
          </label>
          <select
            id="workplace-filter"
            value={currentWorkplace}
            onChange={(e) => updateFilters({ workplace: e.target.value })}
            className="h-9 rounded-lg border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
          >
            <option value="ALL">All Arrangements</option>
            <option value={WORKPLACE_TYPES.REMOTE}>Remote Only</option>
            <option value={WORKPLACE_TYPES.HYBRID}>Hybrid Only</option>
            <option value={WORKPLACE_TYPES.ONSITE}>On-site Only</option>
          </select>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                router.push(pathname);
              }}
              className="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:underline px-2 py-1"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Status Pill Tabs Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {statusTabs.map((tab) => {
          const isActive = currentStatus === tab.key;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => updateFilters({ status: tab.key })}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all shrink-0 select-none",
                isActive
                  ? "bg-slate-900 text-white shadow-xs dark:bg-slate-100 dark:text-slate-950"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
              )}
            >
              <span>{tab.label}</span>
              {typeof tab.count === "number" && (
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.2 text-[10px] font-semibold",
                    isActive
                      ? "bg-slate-800 text-slate-200 dark:bg-slate-200 dark:text-slate-800"
                      : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ApplicationFilters(props) {
  return (
    <React.Suspense
      fallback={
        <div className="h-24 w-full rounded-xl bg-slate-100 dark:bg-slate-800/40 animate-pulse" />
      }
    >
      <ApplicationFiltersContent {...props} />
    </React.Suspense>
  );
}
