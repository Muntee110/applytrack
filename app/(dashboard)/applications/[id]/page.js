import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ExternalLink,
  Mail,
  CheckCircle2,
} from "lucide-react";
import { ApplicationsService } from "@/lib/services/applications.service";
import { ApplicationStatusPill } from "@/components/features/applications/application-status-pill";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils/formatters";
import { APPLICATION_STATUS } from "@/lib/utils/constants";

export async function generateStaticParams() {
  const apps = await ApplicationsService.listApplications();
  return apps.map((app) => ({ id: app.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const application = await ApplicationsService.getApplication(id);
  if (!application) return { title: "Application Not Found" };
  return {
    title: `${application.company} — ${application.role}`,
    description: `Application details for ${application.role} at ${application.company}.`,
  };
}

export default async function ApplicationDetailPage({ params }) {
  const { id } = await params;
  const application = await ApplicationsService.getApplication(id);

  if (!application) {
    notFound();
  }

  const stages = [
    { label: "Wishlist", status: APPLICATION_STATUS.WISHLIST },
    { label: "Applied", status: APPLICATION_STATUS.APPLIED },
    { label: "Interviewing", status: APPLICATION_STATUS.INTERVIEWING },
    { label: "Offer", status: APPLICATION_STATUS.OFFER },
  ];

  const currentStageIndex = stages.findIndex((s) => s.status === application.status);

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Back button */}
      <div>
        <Link
          href="/applications"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to All Applications</span>
        </Link>
      </div>

      {/* Main Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-start sm:items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 font-extrabold text-blue-700 text-xl dark:bg-blue-950 dark:text-blue-300">
            {application.company.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {application.company}
              </h1>
              <Badge variant="secondary">
                {application.workplaceType}
              </Badge>
              {application.priority && (
                <Badge
                  variant={
                    application.priority === "High"
                      ? "destructive"
                      : application.priority === "Medium"
                      ? "warning"
                      : "secondary"
                  }
                >
                  {application.priority} Priority
                </Badge>
              )}
            </div>
            <p className="mt-1 text-base text-slate-600 dark:text-slate-300 font-medium">
              {application.role}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ApplicationStatusPill
            id={application.id}
            currentStatus={application.status}
          />
          {application.url && (
            <a
              href={application.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              <span>Visit Posting</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </div>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-4">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Salary / Comp
            </span>
            <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100 text-sm truncate">
              {application.salary || "Not Specified"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Location
            </span>
            <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100 text-sm truncate">
              {application.location || "Remote"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Current Stage
            </span>
            <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100 text-sm truncate">
              {application.stage || "Submitted"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Applied On
            </span>
            <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100 text-sm truncate">
              {formatDate(application.appliedDate)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 2-Column Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Notes & History */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Interview Notes & Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              {application.notes ? (
                <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-700 leading-relaxed dark:bg-slate-950/60 dark:text-slate-300 whitespace-pre-wrap border border-slate-100 dark:border-slate-800">
                  {application.notes}
                </div>
              ) : (
                <p className="text-sm text-slate-400 italic">
                  No notes recorded yet for this role.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Key Contacts & Stage Tracker */}
        <div className="space-y-6">
          {/* Contact Card */}
          <Card>
            <CardHeader>
              <CardTitle>Recruiter / Primary Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {application.contactName || application.contactEmail ? (
                <>
                  {application.contactName && (
                    <div>
                      <span className="text-xs text-slate-400">Name</span>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {application.contactName}
                      </p>
                    </div>
                  )}
                  {application.contactEmail && (
                    <div>
                      <span className="text-xs text-slate-400">Email</span>
                      <a
                        href={`mailto:${application.contactEmail}`}
                        className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:underline dark:text-blue-400 mt-0.5"
                      >
                        <Mail className="h-3.5 w-3.5" />
                        <span>{application.contactEmail}</span>
                      </a>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-xs text-slate-400 italic">
                  No contact person recorded.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Pipeline Funnel Stage */}
          <Card>
            <CardHeader>
              <CardTitle>Pipeline Journey</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stages.map((stage, idx) => {
                  const isPassed =
                    currentStageIndex !== -1 && idx <= currentStageIndex;
                  const isCurrent =
                    currentStageIndex !== -1 && idx === currentStageIndex;

                  return (
                    <div key={stage.status} className="flex items-center gap-3">
                      <div
                        className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                          isCurrent
                            ? "bg-blue-600 text-white ring-4 ring-blue-100 dark:ring-blue-950"
                            : isPassed
                            ? "bg-emerald-600 text-white"
                            : "bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                        }`}
                      >
                        {isPassed && !isCurrent ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          idx + 1
                        )}
                      </div>
                      <span
                        className={`text-sm ${
                          isCurrent
                            ? "font-bold text-slate-900 dark:text-white"
                            : isPassed
                            ? "font-medium text-slate-700 dark:text-slate-300"
                            : "text-slate-400"
                        }`}
                      >
                        {stage.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
