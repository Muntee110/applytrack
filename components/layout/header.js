"use client";

import * as React from "react";
import { Plus, Search, Bell } from "lucide-react";
import { Breadcrumbs } from "./breadcrumbs";
import { MobileNav } from "./mobile-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useApplicationModal } from "@/components/providers/modal-provider";

export function Header() {
  const { openModal } = useApplicationModal();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/80 px-4 sm:px-6 backdrop-blur-md transition-colors dark:border-slate-800 dark:bg-slate-900/80">
      {/* Left Section: Mobile Drawer Trigger + Breadcrumbs */}
      <div className="flex items-center gap-3 sm:gap-4">
        <MobileNav />
        <div className="hidden sm:block">
          <Breadcrumbs />
        </div>
      </div>

      {/* Right Section: Actions & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Add CTA */}
        <Button
          onClick={openModal}
          size="sm"
          variant="default"
          className="hidden sm:inline-flex gap-1.5 shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span>New Application</span>
        </Button>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* User Avatar */}
        <div
          role="img"
          aria-label="User profile: Alex Morgan"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 ring-2 ring-slate-100 dark:bg-blue-950 dark:text-blue-300 dark:ring-slate-800 cursor-pointer"
        >
          AM
        </div>
      </div>
    </header>
  );
}
