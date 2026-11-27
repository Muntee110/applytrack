"use client";

import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Search,
  X,
  SlidersHorizontal,
  Calendar,
  ArrowUpDown,
  RotateCcw,
  Building,
} from "lucide-react";
import { APPLICATION_STATUS, WORKPLACE_TYPES } from "@/lib/utils/constants";
import { cn } from "@/lib/utils/cn";

function ApplicationFiltersContent({
  statusCounts = {},
  totalCount = 0,
  filteredCount = 0,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get("search") || "";
  const currentStatus = searchParams.get("status") || "ALL";
  const currentWorkplace = searchParams.get("workplace") || "ALL";
  const currentDateRange = searchParams.get("dateRange") || "ALL";
  const currentSort = searchParams.get("sort") || "newest";

  const [searchTerm, setSearchTerm] = React.useState(currentSearch);

  // Keep state in sync if URL changes
  React.useEffect(() => {
    setSearchTerm(currentSearch);
  }, [currentSearch]);

  const updateFilters = (updates) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === "ALL" || value === "" || (key === "sort" && value === "newest")) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateFilters({ search: searchTerm.trim() });
  };

  const clearSearch = () => {
    setSearchTerm("");
    updateFilters({ search: "" });
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    const params = new URLSearchParams();
    const currentView = searchParams.get("view");
    if (currentView) {
      params.set("view", currentView);
    }
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
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
      (currentWorkplace && currentWorkplace !== "ALL") ||
      (currentDateRange && currentDateRange !== "ALL") ||
      (currentSort && currentSort !== "newest")
  );

  return (
    <div className="space-y-4">
      {/* Top Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        {/* Search input with submit & clear */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            placeholder="Search by company name, job role, or location..."
            aria-label="Search applications"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-10 w-full rounded-xl border border-slate-300 bg-white pl-9 pr-9 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 shadow-xs"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={clearSearch}
              aria-label="Clear search input"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 focus-visible:outline-none rounded"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </form>

        {/* Action Controls: Workplace, Date Range, and Sorting */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* Workplace Filter */}
          <div className="flex items-center gap-1.5 shrink-0">
            <label htmlFor="workplace-filter" className="sr-only">
              Workplace Arrangement
            </label>
            <select
              id="workplace-filter"
              value={currentWorkplace}
              onChange={(e) => updateFilters({ workplace: e.target.value })}
              className="h-10 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 shadow-xs cursor-pointer"
            >
              <option value="ALL">All Arrangements</option>
              <option value={WORKPLACE_TYPES.REMOTE}>Remote</option>
              <option value={WORKPLACE_TYPES.HYBRID}>Hybrid</option>
              <option value={WORKPLACE_TYPES.ONSITE}>On-site</option>
            </select>
          </div>

          {/* Date Range Filter */}
          <div className="flex items-center gap-1.5 shrink-0">
            <label htmlFor="date-range-filter" className="sr-only">
              Date Range
            </label>
            <select
              id="date-range-filter"
              value={currentDateRange}
              onChange={(e) => updateFilters({ dateRange: e.target.value })}
              className="h-10 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 shadow-xs cursor-pointer"
            >
              <option value="ALL">All Time</option>
              <option value="7d">Past 7 Days</option>
              <option value="30d">Past 30 Days</option>
              <option value="90d">Past 90 Days</option>
              <option value="this_year">This Year</option>
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-1.5 shrink-0">
            <label htmlFor="sort-filter" className="sr-only">
              Sort Applications
            </label>
            <select
              id="sort-filter"
              value={currentSort}
              onChange={(e) => updateFilters({ sort: e.target.value })}
              className="h-10 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 shadow-xs cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="company_asc">Company (A-Z)</option>
              <option value="company_desc">Company (Z-A)</option>
              <option value="status">Pipeline Status</option>
            </select>
          </div>

          {/* Clear All Filters Button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearAllFilters}
              title="Reset all active filters"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white transition-colors shrink-0 cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Status Pill Tabs Bar with Result Counts */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3 dark:border-slate-800">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {statusTabs.map((tab) => {
            const isActive = currentStatus === tab.key;

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => updateFilters({ status: tab.key })}
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all shrink-0 select-none cursor-pointer",
                  isActive
                    ? "bg-slate-900 text-white shadow-xs dark:bg-slate-100 dark:text-slate-950"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
                )}
              >
                <span>{tab.label}</span>
                {typeof tab.count === "number" && (
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.2 text-[10px] font-bold",
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

        {/* Result Counter Feedback */}
        <div className="text-xs font-medium text-slate-500 dark:text-slate-400 shrink-0">
          Showing <span className="font-bold text-slate-900 dark:text-slate-100">{filteredCount}</span> of{" "}
          <span className="font-bold text-slate-900 dark:text-slate-100">{totalCount}</span> applications
          {hasActiveFilters && " (Filtered)"}
        </div>
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
