"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Laptop } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function ThemeToggle({ className }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by waiting for mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={cn(
          "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-transparent dark:border-slate-800",
          className
        )}
      >
        <span className="h-4 w-4 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
      </div>
    );
  }

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  const getLabel = () => {
    if (theme === "light") return "Current theme: Light. Click to switch to Dark.";
    if (theme === "dark") return "Current theme: Dark. Click to switch to System.";
    return "Current theme: System. Click to switch to Light.";
  };

  return (
    <button
      type="button"
      onClick={cycleTheme}
      aria-label={getLabel()}
      title={getLabel()}
      className={cn(
        "relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100",
        className
      )}
    >
      {theme === "light" && <Sun className="h-4 w-4 text-amber-500 transition-transform rotate-0" />}
      {theme === "dark" && <Moon className="h-4 w-4 text-blue-400 transition-transform rotate-0" />}
      {theme === "system" && <Laptop className="h-4 w-4 text-slate-500 dark:text-slate-400" />}
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
