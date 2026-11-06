import Link from "next/link";
import {
  Briefcase,
  Users,
  CheckCircle,
  TrendingUp,
  Plus,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ApplicationsService } from "@/lib/services/applications.service";
import { STATUS_CONFIG, APPLICATION_STATUS } from "@/lib/utils/constants";
import { formatDate } from "@/lib/utils/formatters";

export const metadata = {
  title: "Dashboard Overview",
};

export default async function DashboardPage() {
  const metrics = await ApplicationsService.getDashboardMetrics();
  const recentApplications = await ApplicationsService.listApplications({
    sortBy: "updatedAt",
    sortOrder: "desc",
  });

  const recent = recentApplications.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Top Welcome & Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
            Welcome back, Alex 👋
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Here is what is happening across your job search pipeline today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/applications">
            <Button variant="outline" size="sm" className="gap-2">
              <span>View All Applications</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Metrics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Applications */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Total Tracked
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                <Briefcase className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {metrics.total}
              </span>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                roles
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {metrics.wishlist} in wishlist pipeline
            </p>
          </CardContent>
        </Card>

        {/* Active Pipelines */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Active In Progress
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {metrics.active}
              </span>
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                Active stages
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Applied & scheduled rounds
            </p>
          </CardContent>
        </Card>

        {/* Interviews Scheduled */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Interviewing
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
                <Users className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {metrics.interviewing}
              </span>
              <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                {metrics.interviewRate} conversion
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Technical & system design calls
            </p>
          </CardContent>
        </Card>

        {/* Offers Received */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Offers Received
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                <CheckCircle className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {metrics.offers}
              </span>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                {metrics.offerRate} offer rate
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Congratulations! Ready to negotiate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Applications Feed */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 dark:border-slate-800">
          <div>
            <CardTitle>Recent Application Activity</CardTitle>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Latest status changes and updates across your applications
            </p>
          </div>
          <Link href="/applications">
            <Button variant="ghost" size="sm" className="gap-1 text-xs">
              <span>View All</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {recent.map((app) => {
              const statusCfg = STATUS_CONFIG[app.status] || STATUS_CONFIG[APPLICATION_STATUS.APPLIED];

              return (
                <div
                  key={app.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 hover:bg-slate-50/70 dark:hover:bg-slate-900/40 transition-colors gap-3"
                >
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                      {app.company.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base">
                          {app.company}
                        </span>
                        <span className="text-xs text-slate-400 dark:text-slate-500">
                          • {app.workplaceType}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                        {app.role}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 ml-13 sm:ml-0">
                    <div className="text-left sm:text-right">
                      <Badge variant={statusCfg.variant} dot>
                        {statusCfg.label}
                      </Badge>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                        Applied {formatDate(app.appliedDate)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
