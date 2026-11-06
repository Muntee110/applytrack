import * as React from "react";
import { cn } from "@/lib/utils/cn";

export function Table({ className, ...props }) {
  return (
    <div className="relative w-full overflow-auto rounded-lg border border-slate-200 dark:border-slate-800">
      <table
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  );
}

export function TableHeader({ className, ...props }) {
  return (
    <thead
      className={cn(
        "bg-slate-50/75 border-b border-slate-200 dark:bg-slate-900/60 dark:border-slate-800",
        className
      )}
      {...props}
    />
  );
}

export function TableBody({ className, ...props }) {
  return (
    <tbody
      className={cn(
        "divide-y divide-slate-100 bg-white dark:divide-slate-800/80 dark:bg-slate-950",
        className
      )}
      {...props}
    />
  );
}

export function TableRow({ className, ...props }) {
  return (
    <tr
      className={cn(
        "transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-900/50",
        className
      )}
      {...props}
    />
  );
}

export function TableHead({ className, ...props }) {
  return (
    <th
      className={cn(
        "h-10 px-4 text-left align-middle text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 whitespace-nowrap",
        className
      )}
      {...props}
    />
  );
}

export function TableCell({ className, ...props }) {
  return (
    <td
      className={cn("p-4 align-middle text-slate-700 dark:text-slate-300", className)}
      {...props}
    />
  );
}

export function TableCaption({ className, ...props }) {
  return (
    <caption
      className={cn("mt-4 text-xs text-slate-500 dark:text-slate-400", className)}
      {...props}
    />
  );
}
