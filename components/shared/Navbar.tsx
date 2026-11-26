"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowUpRight,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { authClient, clearAuthToken } from "@/lib/auth-client";
import Logo from "@/components/shared/Logo";
import ThemeToggle from "@/components/shared/ThemeToggle";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "All Equipment", href: "/equipment" },
  { name: "How It Works", href: "/how-it-works" },
  { name: "About Us", href: "/about" },
];

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  // The drawer remembers the route it was opened on, so navigating anywhere
  // closes it automatically without a state-syncing effect.
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const [signingOut, setSigningOut] = useState(false);
  const { data: session, isPending } = authClient.useSession();

  const isOpen = menuPath === pathname;

  const closeMenu = () => setMenuPath(null);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const handleSignOut = async () => {
    setSigningOut(true);
    await authClient.signOut();
    clearAuthToken();
    closeMenu();
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/70 bg-white/80 backdrop-blur-xl transition-colors dark:border-slate-800/80 dark:bg-slate-950/80">
      {/* Brand accent line */}
      <div className="h-0.5 w-full bg-gradient-to-r from-blue-600 via-indigo-500 to-orange-500" />

      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Logo
          priority
          imageClassName="w-24 sm:w-28 dark:brightness-0 dark:invert"
        />

        {/* Desktop navigation pill */}
        <div className="hidden items-center gap-1 rounded-full border border-slate-200/70 bg-slate-50/80 p-1 lg:flex dark:border-slate-800 dark:bg-slate-900/60">
          {navLinks.map((link) => {
            const active = isActive(link.href);

            return (
              <Link
                key={link.name}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                )}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Desktop actions */}
        <div className="hidden items-center gap-2.5 lg:flex">
          <ThemeToggle />

          {isPending ? (
            <span className="h-9 w-36 animate-pulse rounded-full bg-slate-100 dark:bg-slate-800" />
          ) : session ? (
            <>
              <Link
                href="/dashboard"
                className="group inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-300 hover:text-blue-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-blue-500/40 dark:hover:text-blue-400"
              >
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name}
                    width={28}
                    height={28}
                    className="h-7 w-7 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-[11px] font-bold text-white">
                    {initials(session.user.name || "OnRent")}
                  </span>
                )}

                <span className="hidden max-w-[7rem] truncate lg:inline">
                  {session.user.name?.split(" ")[0] || "Dashboard"}
                </span>

                <LayoutDashboard
                  size={15}
                  className="text-slate-400 transition group-hover:text-blue-500"
                />
              </Link>

              <button
                type="button"
                onClick={handleSignOut}
                disabled={signingOut}
                className="inline-flex h-9 items-center gap-2 rounded-full px-3 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <LogOut size={16} />
                <span className="hidden xl:inline">
                  {signingOut ? "Signing out…" : "Sign out"}
                </span>
              </button>
            </>
          ) : (
            <>
              <Link
                href="/signin"
                className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                Sign in
              </Link>

              <Link
                href="/signup"
                className="group inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:from-orange-500 hover:to-orange-600 hover:shadow-orange-500/20"
              >
                Sign up
                <ArrowUpRight
                  size={15}
                  className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </>
          )}
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />

          <button
            type="button"
            onClick={() => setMenuPath(isOpen ? null : pathname)}
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
            className="rounded-xl border border-slate-200 bg-white p-2 text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        className={cn(
          "overflow-hidden border-slate-200/70 bg-white/95 backdrop-blur-xl transition-all duration-300 lg:hidden dark:border-slate-800 dark:bg-slate-950/95",
          isOpen
            ? "visible max-h-[34rem] border-t opacity-100"
            : "invisible max-h-0 opacity-0"
        )}
      >
        <div className="space-y-1 px-4 py-4">
          {navLinks.map((link) => {
            const active = isActive(link.href);

            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={closeMenu}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold transition",
                  active
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white"
                )}
              >
                {link.name}
                <ArrowUpRight size={15} className="opacity-40" />
              </Link>
            );
          })}

          <div className="mt-3 flex gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
            {isPending ? (
              <span className="h-10 flex-1 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
            ) : session ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={closeMenu}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-blue-600 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-orange-600"
                >
                  <LayoutDashboard size={15} />
                  Dashboard
                </Link>

                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={signingOut}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 py-2.5 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
                >
                  <LogOut size={15} />
                  {signingOut ? "Signing out…" : "Sign out"}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/signin"
                  onClick={closeMenu}
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
                >
                  Sign in
                </Link>

                <Link
                  href="/signup"
                  onClick={closeMenu}
                  className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-2.5 text-center text-sm font-semibold text-white transition hover:from-orange-500 hover:to-orange-600"
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
