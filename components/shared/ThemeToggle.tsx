"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

/**
 * Day / night switch used in the navbar.
 * next-themes stores the choice in localStorage and toggles the `dark` class
 * on <html>, so every page picks up the theme on reload.
 *
 * The visual state is driven by CSS (`dark:` variants) instead of a mounted
 * flag, so there is no hydration flash or mismatch.
 */
export default function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Toggle dark mode"
      title="Toggle dark mode"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "group relative inline-flex h-9 w-[3.75rem] shrink-0 items-center rounded-full border border-slate-200 bg-slate-100 p-1 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-slate-700 dark:bg-slate-800 dark:focus-visible:ring-offset-slate-950",
        className
      )}
    >
      {/* Static icons behind the sliding thumb */}
      <span className="pointer-events-none absolute inset-0 flex items-center justify-between px-2.5">
        <Sun
          size={12}
          className="text-orange-500 opacity-100 transition-opacity duration-300 dark:text-slate-500 dark:opacity-60"
        />
        <Moon
          size={12}
          className="text-slate-400 opacity-60 transition-opacity duration-300 dark:text-blue-300 dark:opacity-100"
        />
      </span>

      {/* Sliding thumb */}
      <span className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white text-orange-500 shadow-sm transition-transform duration-300 dark:translate-x-6 dark:bg-slate-950 dark:text-blue-300">
        <Sun size={14} className="dark:hidden" />
        <Moon size={14} className="hidden dark:block" />
      </span>
    </button>
  );
}
