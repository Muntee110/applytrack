import Link from "next/link";
import { ApplicationsService } from "@/lib/services/applications.service";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { BarChart3, TrendingUp, Award, Plus } from "lucide-react";
import { STATUS_CONFIG, APPLICATION_STATUS } from "@/lib/utils/constants";

export const metadata = {
  title: "Pipeline Analytics",
  description: "Visualize conversion metrics, stage velocity, and pipeline insights.",
};

export default async function AnalyticsPage() {
  const [metrics, applications] = await Promise.all([
    ApplicationsService.getDashboardMetrics(),
    ApplicationsService.listApplications(),
  ]);

  if (metrics.total === 0) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
            Search Velocity & Analytics
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Understand your conversion rates and track hiring momentum.
          </p>
        </div>

        <EmptyState
          icon={BarChart3}
          title="No Analytics Data Yet"
          description="Log your active job opportunities to unlock pipeline conversion funnels, interview velocity metrics, and offer conversion rates."
          action={
            <Link href="/applications/new">
              <Button variant="default" size="sm" className="gap-1.5 font-semibold">
                <Plus className="h-4 w-4" />
                <span>Track Your First Application</span>
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  const statusDistribution = [
    { status: APPLICATION_STATUS.APPLIED, count: metrics.active - metrics.interviewing - metrics.offers },
    { status: APPLICATION_STATUS.INTERVIEWING, count: metrics.interviewing },
    { status: APPLICATION_STATUS.OFFER, count: metrics.offers },
    { status: APPLICATION_STATUS.WISHLIST, count: metrics.wishlist },
    { status: APPLICATION_STATUS.REJECTED, count: metrics.rejected },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
          Search Velocity & Analytics
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Understand your conversion rates and track hiring momentum.
        </p>
      </div>

      {/* Top Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Interview Rate
              </span>
              <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white">
              {metrics.interviewRate}
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Applications advancing to interview stages
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Offer Conversion
              </span>
              <Award className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white">
              {metrics.offerRate}
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Interviews converted to formal offers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Active Funnel
              </span>
              <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white">
              {metrics.active}
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Live roles currently in consideration
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Stage Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Pipeline Breakdown</CardTitle>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Current distribution of all tracked opportunities
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {statusDistribution.map((item) => {
            const config = STATUS_CONFIG[item.status];
            const pct =
              metrics.total > 0
                ? Math.round((item.count / metrics.total) * 100)
                : 0;

            return (
              <div key={item.status} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-medium">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${config.dotColor}`} />
                    <span className="text-slate-700 dark:text-slate-300">
                      {config.label}
                    </span>
                  </div>
                  <span className="text-slate-500 dark:text-slate-400">
                    {item.count} roles ({pct}%)
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className={`h-full rounded-full ${config.dotColor}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
