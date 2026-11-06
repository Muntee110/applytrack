"use client";

import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Table as TableIcon, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function ViewToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentView = searchParams.get("view") || "table";

  const setView = (view) => {
    const params = new URLSearchParams(searchParams.toString());
    if (view === "table") {
      params.delete("view");
    } else {
      params.set("view", view);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div
      role="group"
      aria-label="View layout switch"
      className="inline-flex items-center rounded-xl border border-slate-200 bg-slate-100/70 p-1 dark:border-slate-800 dark:bg-slate-900/80"
    >
      <button
        type="button"
        onClick={() => setView("table")}
        aria-label="Table View"
        title="Table View"
        className={cn(
          "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all",
          currentView === "table"
            ? "bg-white text-slate-900 shadow-xs dark:bg-slate-800 dark:text-white"
            : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
        )}
      >
        <TableIcon className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Table</span>
      </button>

      <button
        type="button"
        onClick={() => setView("board")}
        aria-label="Kanban Board View"
        title="Kanban Board View"
        className={cn(
          "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all",
          currentView === "board"
            ? "bg-white text-slate-900 shadow-xs dark:bg-slate-800 dark:text-white"
            : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
        )}
      >
        <LayoutGrid className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Pipeline Board</span>
      </button>
    </div>
  );
}
