"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

function BreadcrumbsContent() {
  const pathname = usePathname();

  const getBreadcrumbs = () => {
    if (pathname === "/") {
      return [{ label: "Dashboard", href: "/" }];
    }

    const segments = pathname.split("/").filter(Boolean);
    const crumbs = [{ label: "Dashboard", href: "/" }];

    let currentHref = "";
    segments.forEach((seg, idx) => {
      currentHref += `/${seg}`;
      let label = seg.charAt(0).toUpperCase() + seg.slice(1);
      if (seg === "applications") label = "Applications";
      else if (seg === "new") label = "New Application";
      else if (seg === "analytics") label = "Analytics";
      else if (seg === "settings") label = "Settings";
      else if (idx === segments.length - 1 && segments[idx - 1] === "applications") {
        label = "Application Details";
      }

      crumbs.push({ label, href: currentHref });
    });

    return crumbs;
  };

  const crumbs = getBreadcrumbs();

  return (
    <nav aria-label="Breadcrumb" className="flex items-center space-x-1 text-xs text-slate-500 dark:text-slate-400">
      {crumbs.map((crumb, idx) => {
        const isLast = idx === crumbs.length - 1;

        return (
          <div key={crumb.href} className="flex items-center">
            {idx > 0 && <ChevronRight className="h-3.5 w-3.5 mx-1 text-slate-400 dark:text-slate-600" />}
            {idx === 0 && <Home className="h-3.5 w-3.5 mr-1 text-slate-400 dark:text-slate-500" />}
            {isLast ? (
              <span className="font-semibold text-slate-900 dark:text-slate-100" aria-current="page">
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className="hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              >
                {crumb.label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}

export function Breadcrumbs() {
  return (
    <React.Suspense fallback={<div className="h-4 w-28 rounded bg-slate-200/60 dark:bg-slate-800/60 animate-pulse" />}>
      <BreadcrumbsContent />
    </React.Suspense>
  );
}
