import Link from "next/link";
import { ApplicationsService } from "@/lib/services/applications.service";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { BarChart3, Plus } from "lucide-react";
import { AnalyticsDashboard } from "@/components/features/analytics/analytics-dashboard";

export const metadata = {
  title: "Pipeline Analytics",
  description: "Visualize conversion metrics, stage velocity, and pipeline insights.",
};

export default async function AnalyticsPage() {
  const analytics = await ApplicationsService.getAdvancedAnalytics();

  if (analytics.metrics.total === 0) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
            Pipeline Analytics & Insights
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Track interview conversion velocity, application volume, and hiring momentum.
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

  return <AnalyticsDashboard analytics={analytics} />;
}
