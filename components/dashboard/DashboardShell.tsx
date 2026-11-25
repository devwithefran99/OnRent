"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowUpRight,
  CalendarDays,
  ClipboardList,
  Globe2,
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  PackagePlus,
  PackageSearch,
  Settings,
  ShieldCheck,
  Tags,
  UserRound,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { authClient, clearAuthToken } from "@/lib/auth-client";
import Logo from "@/components/shared/Logo";
import { cn } from "@/lib/utils";

export type DashboardRole = "customer" | "owner" | "admin";

type DashboardUser = {
  name: string;
  email: string;
  image: string | null;
  role: DashboardRole;
};

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  soon?: boolean;
};

const customerNav: NavItem[] = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Browse Equipment", href: "/equipment", icon: PackageSearch },
  { label: "My Rentals", href: "/dashboard/rentals", icon: CalendarDays },
  { label: "Favorites", href: "/dashboard/favorites", icon: Heart },
];

const ownerNav: NavItem[] = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Browse Equipment", href: "/equipment", icon: PackageSearch },
  { label: "My Equipment", href: "/dashboard/equipment", icon: Package },
  {
    label: "Add Equipment",
    href: "/dashboard/equipment/new",
    icon: PackagePlus,
  },
  {
    label: "Rental Requests",
    href: "/dashboard/rentals",
    icon: ClipboardList,
  },
];

const adminNav: NavItem[] = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  {
    label: "Equipment Approvals",
    href: "/dashboard/admin/equipment",
    icon: ShieldCheck,
  },
  { label: "Categories", href: "/dashboard/admin/categories", icon: Tags },
  { label: "All Users", href: "/dashboard/admin/users", icon: Users },
  {
    label: "All Rentals",
    href: "/dashboard/admin/rentals",
    icon: CalendarDays,
  },
  { label: "Browse Equipment", href: "/equipment", icon: PackageSearch },
];

const accountNav: NavItem[] = [
  { label: "Profile", href: "/dashboard/profile", icon: UserRound },
  { label: "Settings", href: "/dashboard/settings", icon: Settings, soon: true },
];

const pageTitles: Record<string, string> = {
  "/dashboard": "Overview",
  "/equipment": "Browse Equipment",
  "/dashboard/rentals": "My Rentals",
  "/dashboard/favorites": "Favorites",
  "/dashboard/equipment": "My Equipment",
  "/dashboard/equipment/new": "Add Equipment",
  "/dashboard/admin/equipment": "Equipment Approvals",
  "/dashboard/admin/categories": "Categories",
  "/dashboard/admin/users": "All Users",
  "/dashboard/admin/rentals": "All Rentals",
  "/dashboard/profile": "Profile",
  "/dashboard/settings": "Settings",
};

function isActiveLink(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === "/dashboard";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function NavLink({
  item,
  active,
  onNavigate,
}: {
  item: NavItem;
  active: boolean;
  onNavigate: () => void;
}) {
  const Icon = item.icon;

  const className = cn(
    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
    active
      ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-950/40"
      : item.soon
        ? "cursor-not-allowed text-slate-500"
        : "text-slate-400 hover:bg-white/5 hover:text-white"
  );

  const content = (
    <>
      <Icon
        size={18}
        className={cn(
          "shrink-0 transition",
          active ? "text-white" : "text-slate-500 group-hover:text-blue-300",
          item.soon && !active && "text-slate-600"
        )}
      />

      <span className="flex-1 truncate">{item.label}</span>

      {item.soon && (
        <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Soon
        </span>
      )}

      {active && <ArrowUpRight size={15} className="shrink-0 text-white/80" />}
    </>
  );

  if (item.soon) {
    return (
      <span aria-disabled="true" className={className}>
        {content}
      </span>
    );
  }

  return (
    <Link href={item.href} onClick={onNavigate} className={className}>
      {content}
    </Link>
  );
}

export default function DashboardShell({
  user,
  children,
}: {
  user: DashboardUser;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const isOwner = user.role === "owner";
  const isAdmin = user.role === "admin";
  const nav = isAdmin ? adminNav : isOwner ? ownerNav : customerNav;
  const roleLabel = isAdmin ? "Admin" : isOwner ? "Owner" : "Customer";
  const pageTitle = pageTitles[pathname] ?? "Dashboard";
  const resolvedTitle =
    pathname.endsWith("/edit") && pathname.startsWith("/dashboard/equipment/")
      ? "Edit Equipment"
      : pageTitle;
  const close = () => setOpen(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    await authClient.signOut();
    clearAuthToken();
    close();
    router.push("/");
    router.refresh();
  };

  return (
    <div className="bg-slate-100/70">
      {/* Mobile backdrop */}
      <div
        aria-hidden="true"
        onClick={close}
        className={cn(
          "fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />

      <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="lg:grid lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start lg:gap-8">
          {/* Sidebar */}
          <aside
            className={cn(
              "fixed inset-y-0 left-0 z-[60] flex w-[280px] flex-col overflow-hidden bg-slate-950 text-slate-300 shadow-2xl transition-transform duration-300",
              "lg:sticky lg:top-28 lg:bottom-auto lg:z-0 lg:h-[calc(100vh-7rem)] lg:translate-x-0 lg:rounded-3xl lg:shadow-xl",
              open ? "translate-x-0" : "-translate-x-full"
            )}
          >
            {/* Glow */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute -left-16 top-8 h-48 w-48 rounded-full bg-blue-600/25 blur-3xl" />
              <div className="absolute -bottom-20 -right-10 h-56 w-56 rounded-full bg-indigo-500/15 blur-3xl" />
            </div>

            {/* Brand */}
            <div className="relative flex items-center justify-between gap-3 px-5 pb-5 pt-6">
              <div className="flex flex-col gap-1.5">
                <Logo imageClassName="w-28" />
                <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-500">
                  Dashboard
                </span>
              </div>

              <button
                type="button"
                onClick={close}
                aria-label="Close menu"
                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white lg:hidden"
              >
                <X size={18} />
              </button>
            </div>

            {/* Role badge */}
            <div className="relative mx-5 mb-5 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5">
              <span className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <ShieldCheck
                  size={15}
                  className={
                    isAdmin
                      ? "text-violet-400"
                      : isOwner
                        ? "text-orange-400"
                        : "text-blue-400"
                  }
                />
                {roleLabel} workspace
              </span>

              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                  isAdmin
                    ? "bg-violet-400/15 text-violet-300"
                    : isOwner
                      ? "bg-orange-400/15 text-orange-300"
                      : "bg-blue-400/15 text-blue-300"
                )}
              >
                {roleLabel}
              </span>
            </div>

            {/* Navigation */}
            <nav className="relative flex-1 space-y-6 overflow-y-auto px-3 pb-4 [scrollbar-width:thin]">
              <div>
                <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">
                  Workspace
                </p>
                <div className="space-y-1">
                  {nav.map((item) => (
                    <NavLink
                      key={item.href}
                      item={item}
                      active={isActiveLink(pathname, item.href)}
                      onNavigate={close}
                    />
                  ))}
                </div>
              </div>

              <div>
                <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">
                  Account
                </p>
                <div className="space-y-1">
                  {accountNav.map((item) => (
                    <NavLink
                      key={item.href}
                      item={item}
                      active={isActiveLink(pathname, item.href)}
                      onNavigate={close}
                    />
                  ))}
                </div>
              </div>
            </nav>

            {/* User card */}
            <div className="relative border-t border-white/10 p-4">
              <div className="flex items-center gap-3 rounded-2xl bg-white/[0.04] p-3">
                {user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.image}
                    alt={user.name}
                    className="h-10 w-10 shrink-0 rounded-xl object-cover ring-2 ring-white/10"
                  />
                ) : (
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 text-sm font-bold text-white">
                    {initials(user.name)}
                  </span>
                )}

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white">
                    {user.name}
                  </p>
                  <p className="truncate text-xs text-slate-500">{user.email}</p>
                </div>

                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={signingOut}
                  aria-label="Sign out"
                  title="Sign out"
                  className="rounded-lg p-2 text-slate-400 transition hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
                >
                  <LogOut size={17} />
                </button>
              </div>
            </div>
          </aside>

          {/* Main column */}
          <div className="min-w-0">
            {/* Topbar */}
            <header className="sticky top-[112px] z-40 flex items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white/85 px-4 py-3 shadow-sm backdrop-blur-md sm:px-5">
              <div className="flex min-w-0 items-center gap-3">
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  aria-label="Open menu"
                  className="rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:border-blue-200 hover:text-blue-600 lg:hidden"
                >
                  <Menu size={19} />
                </button>

                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                    {roleLabel} dashboard
                  </p>
                  <h1 className="truncate text-lg font-bold text-slate-900">
                    {resolvedTitle}
                  </h1>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <Link
                  href="/equipment"
                  className="hidden items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-blue-200 hover:text-blue-600 sm:inline-flex"
                >
                  <Globe2 size={14} />
                  Browse site
                </Link>

                <Link
                  href="/dashboard/profile"
                  title="Your profile"
                  className="rounded-xl transition hover:opacity-90"
                >
                  {user.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.image}
                      alt={user.name}
                      className="h-9 w-9 rounded-xl object-cover ring-2 ring-slate-100"
                    />
                  ) : (
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 text-xs font-bold text-white">
                      {initials(user.name)}
                    </span>
                  )}
                </Link>
              </div>
            </header>

            <main className="mt-6 min-w-0">{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
}
