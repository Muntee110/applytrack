import Link from "next/link";
import { FolderX, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "404 - Page Not Found | ApplyTrack",
};

export default function GlobalNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
          <FolderX className="h-8 w-8" />
        </div>
        <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Page Not Found
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          The page you are looking for does not exist, has been moved, or is temporarily unavailable.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/">
            <Button variant="default" size="sm" className="gap-2 w-full sm:w-auto">
              <Home className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </Button>
          </Link>
          <Link href="/applications">
            <Button variant="outline" size="sm" className="gap-2 w-full sm:w-auto">
              <span>View Applications</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
