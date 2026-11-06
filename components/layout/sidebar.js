"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  BarChart3,
  Settings,
  Plus,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { useApplicationModal } from "@/components/providers/modal-provider";

const NAV_ITEMS = [
  { label: "Overview", href: "/", icon: LayoutDashboard },
  { label: "Applications", href: "/applications", icon: Briefcase },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Settings", href: "/settings", icon: Settings },
];

function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex-1 space-y-1 px-3 py-4">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
              isActive
                ? "bg-blue-50 text-blue-700 shadow-xs dark:bg-blue-950/60 dark:text-blue-300"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-slate-100"
            )}
          >
            <Icon
              className={cn(
                "h-4 w-4 transition-colors",
                isActive
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300"
              )}
            />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function Sidebar({ className }) {
  const { openModal } = useApplicationModal();

  return (
    <aside
      className={cn(
        "flex h-screen w-64 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/95 select-none transition-colors",
        className
      )}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between border-b border-slate-100 px-6 dark:border-slate-800/80">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/25 transition-transform group-hover:scale-105">
            <Briefcase className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
              Apply<span className="text-blue-600 dark:text-blue-500">Track</span>
            </span>
            <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Pipeline Pro
            </span>
          </div>
        </Link>
      </div>

      {/* Quick Action Button */}
      <div className="p-4 pb-2">
        <Button
          onClick={openModal}
          variant="default"
          className="w-full justify-center gap-2 shadow-sm font-semibold"
        >
          <Plus className="h-4 w-4" />
          <span>New Application</span>
        </Button>
      </div>

      {/* Navigation Links wrapped in Suspense for Next.js 16 Partial Prerendering */}
      <React.Suspense
        fallback={
          <div className="flex-1 space-y-2 p-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 rounded-lg bg-slate-100 dark:bg-slate-800/50 animate-pulse" />
            ))}
          </div>
        }
      >
        <SidebarNav />
      </React.Suspense>

      {/* Goal Tracker Micro Widget */}
      <div className="p-4">
        <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-950/50">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span className="flex items-center gap-1.5">
              <Target className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              Weekly Goal
            </span>
            <span className="text-blue-600 dark:text-blue-400">7 / 10</span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-blue-600 transition-all dark:bg-blue-500"
              style={{ width: "70%" }}
            />
          </div>
          <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
            3 more applications to hit your weekly target!
          </p>
        </div>
      </div>

      {/* User Footer Profile */}
      <div className="border-t border-slate-100 p-3.5 dark:border-slate-800/80">
        <div className="flex items-center gap-3 rounded-lg p-1.5 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50">
          <div className="relative">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              AM
            </div>
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500 dark:border-slate-900" />
          </div>
          <div className="flex flex-1 flex-col overflow-hidden text-left">
            <span className="truncate text-xs font-semibold text-slate-900 dark:text-slate-100">
              Alex Morgan
            </span>
            <span className="truncate text-[11px] text-slate-500 dark:text-slate-400">
              Senior Software Engineer
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
