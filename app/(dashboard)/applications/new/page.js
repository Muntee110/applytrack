import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { ApplicationForm } from "@/components/features/applications/application-form";

export const metadata = {
  title: "New Application",
  description: "Track a new job application and log interview stages.",
};

export default function NewApplicationPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back button */}
      <div>
        <Link
          href="/applications"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Applications</span>
        </Link>
      </div>

      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
            Track New Opportunity
          </h1>
          <span className="rounded-md bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-800 dark:bg-blue-950 dark:text-blue-300">
            Create
          </span>
        </div>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Enter the position, pipeline status, salary expectations, and interview contact details.
        </p>
      </div>

      {/* Application Form */}
      <ApplicationForm />
    </div>
  );
}
