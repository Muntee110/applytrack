import Link from "next/link";
import { Plus } from "lucide-react";
import { ApplicationsService } from "@/lib/services/applications.service";
import { ApplicationFilters } from "@/components/features/applications/application-filters";
import { ApplicationTable } from "@/components/features/applications/application-table";
import { ApplicationKanban } from "@/components/features/applications/application-kanban";
import { ViewToggle } from "@/components/features/applications/view-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Applications",
  description: "Manage, filter, and track all your active and past job applications.",
};

export default async function ApplicationsPage({ searchParams }) {
  // Await searchParams as recommended in recent Next.js versions
  const params = await searchParams;
  const search = params?.search || "";
  const status = params?.status || "ALL";
  const workplace = params?.workplace || "ALL";
  const view = params?.view || "table";

  const [applications, metrics] = await Promise.all([
    ApplicationsService.listApplications({
      search,
      status,
      workplace,
      sortBy: "appliedDate",
      sortOrder: "desc",
    }),
    ApplicationsService.getDashboardMetrics(),
  ]);

  const statusCounts = {
    total: metrics.total,
    applied: metrics.active - metrics.interviewing - metrics.offers,
    interviewing: metrics.interviewing,
    offers: metrics.offers,
    wishlist: metrics.wishlist,
    rejected: metrics.rejected,
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Count */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
              Job Applications
            </h1>
            <Badge variant="secondary" className="font-semibold">
              {applications.length} {applications.length === 1 ? "role" : "roles"}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Track interview milestones, follow-ups, and offer negotiations in one central place.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View Mode Switcher: Table vs Pipeline Board */}
          <ViewToggle />

          <Link href="/applications/new">
            <Button variant="default" size="sm" className="gap-1.5 shadow-sm font-semibold">
              <Plus className="h-4 w-4" />
              <span>New Application</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <ApplicationFilters statusCounts={statusCounts} />

      {/* View Switcher: Interactive Data Table or Pipeline Kanban Board */}
      {view === "board" ? (
        <ApplicationKanban applications={applications} />
      ) : (
        <ApplicationTable applications={applications} />
      )}
    </div>
  );
}
