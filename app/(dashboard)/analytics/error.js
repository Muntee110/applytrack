"use client";

import * as React from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AnalyticsError({ error, reset }) {
  React.useEffect(() => {
    console.error("Analytics route error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[450px] flex-col items-center justify-center rounded-2xl border border-rose-200 bg-rose-50/40 p-8 text-center dark:border-rose-900/50 dark:bg-rose-950/20">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-900/50 dark:text-rose-400 shadow-xs">
        <AlertTriangle className="h-7 w-7" />
      </div>
      <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-slate-100">
        Unable to compute analytics
      </h2>
      <p className="mt-2 max-w-md text-sm text-slate-600 dark:text-slate-400">
        {error?.message || "There was an issue processing your pipeline conversion metrics."}
      </p>
      <div className="mt-6 flex items-center gap-3">
        <Button
          onClick={() => reset()}
          variant="default"
          className="gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Recalculate Metrics</span>
        </Button>
      </div>
    </div>
  );
}
