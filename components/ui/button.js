import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const buttonVariants = {
  variant: {
    default:
      "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-sm focus-visible:ring-blue-500 dark:bg-blue-600 dark:hover:bg-blue-500",
    secondary:
      "bg-slate-100 text-slate-900 hover:bg-slate-200 active:bg-slate-300 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 focus-visible:ring-slate-400",
    outline:
      "border border-slate-300 bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white focus-visible:ring-slate-400",
    ghost:
      "bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white focus-visible:ring-slate-400",
    destructive:
      "bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 shadow-sm focus-visible:ring-rose-500 dark:bg-rose-700 dark:hover:bg-rose-600",
    success:
      "bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 shadow-sm focus-visible:ring-emerald-500 dark:bg-emerald-600 dark:hover:bg-emerald-500",
    link:
      "text-blue-600 underline-offset-4 hover:underline p-0 h-auto font-normal dark:text-blue-400",
  },
  size: {
    sm: "h-8 px-3 text-xs rounded-md gap-1.5",
    md: "h-9 px-4 text-sm rounded-lg gap-2",
    lg: "h-11 px-6 text-base rounded-lg gap-2.5",
    icon: "h-9 w-9 p-0 rounded-lg justify-center",
    "icon-sm": "h-8 w-8 p-0 rounded-md justify-center",
  },
};

export const Button = React.forwardRef(
  (
    {
      className,
      variant = "default",
      size = "md",
      isLoading = false,
      disabled,
      children,
      type = "button",
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-colors select-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          "dark:focus-visible:ring-offset-slate-950",
          buttonVariants.variant[variant] || buttonVariants.variant.default,
          buttonVariants.size[size] || buttonVariants.size.md,
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin shrink-0" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
