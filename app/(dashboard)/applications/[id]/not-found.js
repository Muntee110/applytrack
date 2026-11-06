import Link from "next/link";
import { FolderX, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ApplicationNotFound() {
  return (
    <div className="flex min-h-[450px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
        <FolderX className="h-7 w-7" />
      </div>
      <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-slate-100">
        Job Application Not Found
      </h2>
      <p className="mt-1.5 max-w-sm text-sm text-slate-500 dark:text-slate-400">
        This application may have been removed or does not exist in your pipeline.
      </p>
      <div className="mt-6">
        <Link href="/applications">
          <Button variant="default" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Applications</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
