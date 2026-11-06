import * as React from "react";
import { cn } from "@/lib/utils/cn";

const badgeVariants = {
  default:
    "bg-slate-900 text-slate-50 dark:bg-slate-100 dark:text-slate-900",
  secondary:
    "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
  outline:
    "border border-slate-300 text-slate-700 dark:border-slate-700 dark:text-slate-300",
  info:
    "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-900/80",
  warning:
    "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-900/80",
  success:
    "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-900/80",
  destructive:
    "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-900/80",
};

const dotColors = {
  default: "bg-slate-400 dark:bg-slate-600",
  secondary: "bg-slate-400 dark:bg-slate-500",
  outline: "bg-slate-400",
  info: "bg-blue-500 dark:bg-blue-400",
  warning: "bg-amber-500 dark:bg-amber-400",
  success: "bg-emerald-500 dark:bg-emerald-400",
  destructive: "bg-rose-500 dark:bg-rose-400",
};

export function Badge({
  className,
  variant = "default",
  dot = false,
  children,
  ...props
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border border-transparent transition-colors",
        badgeVariants[variant] || badgeVariants.default,
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full shrink-0",
            dotColors[variant] || dotColors.default
          )}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}
