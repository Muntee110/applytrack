"use client";

import * as React from "react";
import Link from "next/link";
import {
  Briefcase,
  Users,
  CheckCircle,
  XCircle,
  TrendingUp,
  Award,
  Calendar,
  Building,
  Laptop,
  Building2,
  MapPin,
  Clock,
  ArrowRight,
  Flame,
  Activity,
  Plus,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { STATUS_CONFIG, APPLICATION_STATUS } from "@/lib/utils/constants";
import { formatDate } from "@/lib/utils/formatters";
import { cn } from "@/lib/utils/cn";

export function AnalyticsDashboard({ analytics }) {
  const {
    metrics,
    workplaceDistribution = [],
    monthlyActivity = [],
    statusDistribution = [],
    topCompanies = [],
    recentActivity = [],
    weeklyVelocity = 0,
  } = analytics;

  // Max count for monthly bar chart scaling
  const maxMonthlyCount = Math.max(
    1,
    ...monthlyActivity.map((m) => m.count)
  );

  return (
    <div className="space-y-8">
      {/* 1. Header with Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
            Pipeline Analytics & Insights
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Track interview conversion velocity, application volume, and hiring momentum.
          </p>
        </div>

        <Link href="/applications/new">
          <Button variant="default" size="sm" className="gap-1.5 shadow-sm font-semibold">
            <Plus className="h-4 w-4" />
            <span>Track New Application</span>
          </Button>
        </Link>
      </div>

      {/* 2. Top Metric KPI Grid: 7 Core Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Total Submitted */}
        <Card className="border border-slate-200 dark:border-slate-800">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Total Submitted
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                <Briefcase className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2.5 flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {metrics.total}
              </span>
              <span className="text-xs font-medium text-slate-500">roles</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
              All tracked opportunities
            </p>
          </CardContent>
        </Card>

        {/* Currently Active */}
        <Card className="border border-slate-200 dark:border-slate-800">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Active in Pipeline
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
                <Activity className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2.5 flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {metrics.active}
              </span>
              <span className="text-xs font-medium text-amber-600 dark:text-amber-400">live</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
              In progress (applied & interviewing)
            </p>
          </CardContent>
        </Card>

        {/* Interviews Scheduled */}
        <Card className="border border-slate-200 dark:border-slate-800">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Interviews
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2.5 flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {metrics.interviewing}
              </span>
              <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">rounds</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
              Active technical & recruiter screens
            </p>
          </CardContent>
        </Card>

        {/* Offers Received */}
        <Card className="border border-slate-200 dark:border-slate-800">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Offers Received
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                <CheckCircle className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2.5 flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {metrics.offers}
              </span>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">won</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
              Formal job offers in hand
            </p>
          </CardContent>
        </Card>

        {/* Rejections */}
        <Card className="border border-slate-200 dark:border-slate-800">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Rejections
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
                <XCircle className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2.5 flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {metrics.rejected}
              </span>
              <span className="text-xs font-medium text-slate-500">closed</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
              Archived or unfulfilled roles
            </p>
          </CardContent>
        </Card>

        {/* Application-to-Interview Conversion Rate */}
        <Card className="border border-slate-200 dark:border-slate-800">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Interview Rate
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2.5 flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
                {metrics.interviewRate}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
              Applications advancing to screens
            </p>
          </CardContent>
        </Card>

        {/* Interview-to-Offer Conversion Rate */}
        <Card className="border border-slate-200 dark:border-slate-800">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Offer Conversion
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                <Award className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2.5 flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {metrics.offerRate}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
              Interviews converted to offer
            </p>
          </CardContent>
        </Card>

        {/* Weekly Velocity / Trend */}
        <Card className="border border-slate-200 dark:border-slate-800">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Weekly Velocity
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-orange-600 dark:bg-orange-950/60 dark:text-orange-400">
                <Flame className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2.5 flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {weeklyVelocity}
              </span>
              <span className="text-xs font-medium text-slate-500">apps/wk</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
              Average submission cadence
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 3. Middle Section: Monthly Activity Chart & Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Application Activity Chart (2 cols) */}
        <Card className="lg:col-span-2 border border-slate-200 dark:border-slate-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Monthly Application Activity</CardTitle>
                <CardDescription>
                  Number of applications submitted over the past 6 months
                </CardDescription>
              </div>
              <Badge variant="secondary" className="font-semibold text-xs">
                Last 6 Months
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {/* Visual SVG Bar Chart */}
            <div className="h-64 w-full flex items-end gap-3 sm:gap-6 pt-6 pb-2 px-2">
              {monthlyActivity.map((item, idx) => {
                const heightPct = Math.max(
                  12,
                  Math.round((item.count / maxMonthlyCount) * 100)
                );
                const isCurrent = idx === monthlyActivity.length - 1;

                return (
                  <div
                    key={`${item.month}-${item.year}`}
                    className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
                  >
                    {/* Count Callout */}
                    <span className="mb-2 text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:scale-110 transition-transform">
                      {item.count}
                    </span>

                    {/* Bar Pillar */}
                    <div className="w-full max-w-[48px] rounded-t-lg overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-end h-full">
                      <div
                        className={cn(
                          "w-full rounded-t-lg transition-all duration-500",
                          isCurrent
                            ? "bg-blue-600 dark:bg-blue-500 shadow-sm"
                            : "bg-blue-300 hover:bg-blue-400 dark:bg-blue-900/60 dark:hover:bg-blue-800"
                        )}
                        style={{ height: `${heightPct}%` }}
                      />
                    </div>

                    {/* Month Label */}
                    <span
                      className={cn(
                        "mt-3 text-xs font-semibold",
                        isCurrent
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-slate-500 dark:text-slate-400"
                      )}
                    >
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Status Distribution (1 col) */}
        <Card className="border border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle>Pipeline Distribution</CardTitle>
            <CardDescription>
              Share of applications across all interview stages
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {statusDistribution.map((item) => {
              const config = STATUS_CONFIG[item.status] || STATUS_CONFIG[APPLICATION_STATUS.APPLIED];

              return (
                <div key={item.status} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <div className="flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${config.dotColor}`} />
                      <span className="text-slate-800 dark:text-slate-200">
                        {config.label}
                      </span>
                    </div>
                    <span className="text-slate-500 dark:text-slate-400">
                      {item.count} ({item.percentage}%)
                    </span>
                  </div>

                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className={cn("h-full rounded-full transition-all duration-500", config.dotColor)}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* 4. Bottom Section: Workplace Breakdown, Top Companies & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workplace Type Distribution */}
        <Card className="border border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle>Workplace Preference</CardTitle>
            <CardDescription>
              Remote vs. Hybrid vs. On-site positions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {workplaceDistribution.map((item) => {
              const icon =
                item.type === "Remote" ? (
                  <Laptop className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                ) : item.type === "Hybrid" ? (
                  <Building2 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                ) : (
                  <MapPin className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                );

              return (
                <div key={item.type} className="rounded-xl border border-slate-100 p-3.5 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white shadow-xs dark:bg-slate-800">
                        {icon}
                      </div>
                      <span className="text-slate-800 dark:text-slate-200">
                        {item.type}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-900 dark:text-slate-100 font-bold">
                        {item.count} roles
                      </span>
                      <span className="text-slate-400 dark:text-slate-500 ml-1.5">
                        ({item.percentage}%)
                      </span>
                    </div>
                  </div>

                  <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        item.type === "Remote"
                          ? "bg-blue-600 dark:bg-blue-500"
                          : item.type === "Hybrid"
                          ? "bg-purple-600 dark:bg-purple-500"
                          : "bg-amber-600 dark:bg-amber-500"
                      )}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Top Companies Leaderboard */}
        <Card className="border border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle>Top Companies Applied</CardTitle>
            <CardDescription>
              Organizations where you have active submissions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {topCompanies.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No companies tracked yet.</p>
            ) : (
              topCompanies.map((c) => {
                const statusCfg = STATUS_CONFIG[c.status] || STATUS_CONFIG[APPLICATION_STATUS.APPLIED];

                return (
                  <div
                    key={c.company}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-xs font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300 shrink-0">
                        {c.company.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                          {c.company}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {c.latestRole}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0 ml-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {c.count} {c.count === 1 ? "app" : "apps"}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        {/* Recent Activity Timeline */}
        <Card className="border border-slate-200 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle>Recent Activity Timeline</CardTitle>
              <CardDescription>
                Chronological audit of status updates
              </CardDescription>
            </div>
            <Link
              href="/applications"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No activity logged yet.</p>
            ) : (
              <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                {recentActivity.slice(0, 5).map((act) => {
                  const statusCfg = STATUS_CONFIG[act.status] || STATUS_CONFIG[APPLICATION_STATUS.APPLIED];

                  return (
                    <div key={act.id} className="relative">
                      {/* Timeline Dot */}
                      <span className={cn(
                        "absolute -left-6 top-1 h-2.5 w-2.5 rounded-full ring-4 ring-white dark:ring-slate-900",
                        statusCfg.dotColor
                      )} />

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Link
                            href={`/applications/${act.id}`}
                            className="text-xs font-semibold text-slate-900 dark:text-slate-100 hover:underline truncate"
                          >
                            {act.company}
                          </Link>
                          <Badge variant={statusCfg.variant} className="text-[10px] py-0 px-1.5">
                            {statusCfg.label}
                          </Badge>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {act.role} — {act.stage}
                        </p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                          {formatDate(act.date)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
