"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  ArrowUpRight,
  Bell,
  CalendarDays,
  ChevronRight,
  ClipboardList,
  Globe2,
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  PackagePlus,
  PackageSearch,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Tags,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react"
import { authClient, clearAuthToken } from "@/lib/auth-client"
import Logo from "@/components/shared/Logo"
import ThemeToggle from "@/components/shared/ThemeToggle"
import { cn } from "@/lib/utils"

export type DashboardRole = "customer" | "owner" | "admin"

type DashboardUser = {
  name: string
  email: string
  image: string | null
  role: DashboardRole
}

type NavItem = {
  label: string
  href: string
  icon: LucideIcon
  soon?: boolean
}

const customerNav: NavItem[] = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Browse Equipment", href: "/equipment", icon: PackageSearch },
  { label: "My Rentals", href: "/dashboard/rentals", icon: CalendarDays },
  { label: "Favorites", href: "/dashboard/favorites", icon: Heart },
]

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
]

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
  {
    label: "Settings",
    href: "/dashboard/admin/settings",
    icon: Settings,
  },
  { label: "Browse Equipment", href: "/equipment", icon: PackageSearch },
]

const accountNav: NavItem[] = [
  { label: "Profile", href: "/dashboard/profile", icon: UserRound },
]

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
  "/dashboard/admin/settings": "Platform Settings",
  "/dashboard/profile": "Profile",
}

const roleThemes = {
  customer: {
    label: "Customer",
    from: "#0ea5e9",
    to: "#2563eb",
    accent: "#2563eb",
    glow: "rgba(37, 99, 235, 0.45)",
    chip: "bg-sky-400/15 text-sky-300",
  },
  owner: {
    label: "Owner",
    from: "#f59e0b",
    to: "#ea580c",
    accent: "#ea580c",
    glow: "rgba(234, 88, 12, 0.45)",
    chip: "bg-amber-400/15 text-amber-300",
  },
  admin: {
    label: "Admin",
    from: "#8b5cf6",
    to: "#d946ef",
    accent: "#8b5cf6",
    glow: "rgba(139, 92, 246, 0.45)",
    chip: "bg-violet-400/15 text-violet-300",
  },
} as const

function isActiveLink(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === "/dashboard"
  }

  return pathname === href || pathname.startsWith(`${href}/`)
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")
}

function NavLink({
  item,
  active,
  collapsed,
  accent,
  onNavigate,
}: {
  item: NavItem
  active: boolean
  collapsed: boolean
  accent: string
  onNavigate: () => void
}) {
  const Icon = item.icon

  const className = cn(
    "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
    active
      ? "text-white shadow-lg"
      : item.soon
        ? "cursor-not-allowed text-slate-500"
        : "text-slate-400 hover:bg-white/[0.06] hover:text-white",
    collapsed && "lg:justify-center lg:px-0"
  )

  const content = (
    <>
      {active && (
        <span className="absolute inset-y-2 left-0 w-1 rounded-r-full bg-white/80" />
      )}

      <Icon
        size={18}
        className={cn(
          "shrink-0 transition",
          active ? "text-white" : "text-slate-500 group-hover:text-white",
          item.soon && !active && "text-slate-600"
        )}
      />

      <span
        className={cn("flex-1 truncate text-left", collapsed && "lg:hidden")}
      >
        {item.label}
      </span>

      {item.soon && (
        <span
          className={cn(
            "rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-slate-400 uppercase",
            collapsed && "lg:hidden"
          )}
        >
          Soon
        </span>
      )}

      {active && (
        <ArrowUpRight
          size={15}
          className={cn("shrink-0 text-white/80", collapsed && "lg:hidden")}
        />
      )}
    </>
  )

  if (item.soon) {
    return (
      <span
        aria-disabled="true"
        title={collapsed ? item.label : undefined}
        className={className}
      >
        {content}
      </span>
    )
  }

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      title={collapsed ? item.label : undefined}
      aria-current={active ? "page" : undefined}
      className={className}
      style={
        active
          ? {
              backgroundImage: `linear-gradient(100deg, ${accent}, ${accent}cc)`,
              boxShadow: `0 12px 28px -14px ${accent}`,
            }
          : undefined
      }
    >
      {content}
    </Link>
  )
}

export default function DashboardShell({
  user,
  defaultCollapsed = false,
  children,
}: {
  user: DashboardUser
  defaultCollapsed?: boolean
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [menuPath, setMenuPath] = useState<string | null>(null)
  const [collapsed, setCollapsed] = useState(defaultCollapsed)
  const [signingOut, setSigningOut] = useState(false)

  const isOwner = user.role === "owner"
  const isAdmin = user.role === "admin"
  const nav = isAdmin ? adminNav : isOwner ? ownerNav : customerNav
  const theme = roleThemes[user.role]
  const roleLabel = theme.label
  const pageTitle = pageTitles[pathname] ?? "Dashboard"
  const resolvedTitle =
    pathname.endsWith("/edit") && pathname.startsWith("/dashboard/equipment/")
      ? "Edit Equipment"
      : pageTitle

  const open = menuPath === pathname

  const close = () => setMenuPath(null)

  const toggleCollapsed = () => {
    const next = !collapsed

    setCollapsed(next)

    document.cookie = `onrent_dashboard_sidebar=${
      next ? "collapsed" : "expanded"
    }; path=/; max-age=31536000; samesite=lax`
  }

  const handleSignOut = async () => {
    setSigningOut(true)
    await authClient.signOut()
    clearAuthToken()
    close()
    router.push("/")
    router.refresh()
  }

  return (
    <div className="relative min-h-screen bg-[#f4f7fb] dark:bg-slate-950">
      {/* Ambient background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div
          className="absolute -top-32 right-[-10%] h-[420px] w-[420px] rounded-full opacity-30 blur-3xl dark:opacity-20"
          style={{ backgroundColor: theme.accent }}
        />
        <div className="absolute bottom-0 left-[-12%] h-[380px] w-[380px] rounded-full bg-sky-300/20 blur-3xl dark:bg-sky-500/10" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.07)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)] bg-[size:56px_56px]" />
      </div>

      {/* Mobile backdrop */}
      <div
        aria-hidden="true"
        onClick={close}
        className={cn(
          "fixed inset-0 z-[60] bg-slate-950/60 backdrop-blur-sm transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />

      {/* Dashboard topbar — sits where the public navbar used to be */}
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/90 shadow-sm backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-900/90">
        <div className="mx-auto flex h-16 w-full max-w-[1560px] items-center justify-between gap-3 px-3 sm:px-5 lg:px-6">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setMenuPath(pathname)}
              aria-label="Open menu"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:text-slate-900 lg:hidden dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
            >
              <Menu size={18} />
            </button>

            <div className="min-w-0">
              <p className="hidden items-center gap-1 text-[10px] font-semibold tracking-[0.16em] text-slate-400 uppercase sm:flex">
                Dashboard
                <ChevronRight size={10} />
                {roleLabel}
              </p>
              <h1 className="truncate text-base font-bold text-slate-900 sm:text-lg dark:text-white">
                {resolvedTitle}
              </h1>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <form
              action="/equipment"
              className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 transition focus-within:border-slate-300 md:flex dark:border-slate-800 dark:bg-slate-950/60"
            >
              <Search size={14} className="text-slate-400" />
              <input
                type="search"
                name="search"
                placeholder="Search equipment"
                aria-label="Search equipment"
                className="w-24 bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400 lg:w-32 dark:text-slate-200"
              />
            </form>

            <ThemeToggle />

            <Link
              href={isAdmin ? "/dashboard/admin/rentals" : "/dashboard/rentals"}
              aria-label="Rental notifications"
              title="Rentals"
              className="relative hidden h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:text-slate-900 sm:inline-flex dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              <Bell size={16} />
              <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-rose-500" />
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
                  className="h-9 w-9 rounded-xl object-cover shadow-sm ring-2 ring-white dark:ring-slate-800"
                />
              ) : (
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold text-white"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${theme.from}, ${theme.to})`,
                  }}
                >
                  {initials(user.name)}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      <div className="relative mx-auto w-full max-w-[1560px] px-3 pt-4 pb-10 sm:px-5 lg:px-6 lg:pt-6">
        <div className="lg:flex lg:items-start lg:gap-5">
          {/* Sidebar */}
          <aside
            className={cn(
              "fixed inset-y-0 left-0 z-[70] flex w-[276px] flex-col overflow-hidden bg-slate-950 text-slate-300 shadow-2xl transition-[transform,width] duration-300 ease-out",
              "lg:sticky lg:inset-y-auto lg:top-[88px] lg:left-auto lg:z-10 lg:h-[calc(100vh-7rem)] lg:translate-x-0 lg:rounded-[26px]",
              "border border-white/5",
              collapsed && "lg:w-[84px]",
              open ? "translate-x-0" : "-translate-x-full"
            )}
          >
            {/* Role glow */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div
                className="absolute top-0 -left-20 h-56 w-56 rounded-full opacity-30 blur-3xl"
                style={{ backgroundColor: theme.accent }}
              />
              <div className="absolute -right-12 -bottom-24 h-60 w-60 rounded-full bg-indigo-500/10 blur-3xl" />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
            </div>

            {/* Brand */}
            <div
              className={cn(
                "relative flex h-[74px] shrink-0 items-center gap-3 border-b border-white/5 px-4",
                collapsed && "lg:gap-1 lg:px-0"
              )}
            >
              <div className={cn(collapsed && "lg:hidden")}>
                <Logo tone="light" imageClassName="w-[104px]" />
              </div>

              <Link
                href="/dashboard"
                title="OnRent dashboard"
                className={cn(
                  "hidden h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-base font-black text-white",
                  collapsed && "lg:flex"
                )}
                style={{
                  backgroundImage: `linear-gradient(135deg, ${theme.from}, ${theme.to})`,
                  boxShadow: `0 10px 24px -12px ${theme.accent}`,
                }}
              >
                O
              </Link>

              <div className="ml-auto flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close menu"
                  className="rounded-lg p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white lg:hidden"
                >
                  <Menu size={18} />
                </button>

                <button
                  type="button"
                  onClick={toggleCollapsed}
                  aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                  aria-pressed={collapsed}
                  title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                  className="hidden h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/10 hover:text-white lg:inline-flex"
                >
                  <Menu size={18} />
                </button>
              </div>
            </div>

            {/* Role badge */}
            <div
              className={cn(
                "relative mx-4 mt-4 flex items-center justify-between gap-2 rounded-2xl border border-white/[0.07] bg-white/[0.04] px-3 py-2.5",
                collapsed && "lg:mx-2 lg:justify-center lg:px-0"
              )}
            >
              <span
                className={cn(
                  "flex items-center gap-2 text-xs font-semibold text-slate-300",
                  collapsed && "lg:hidden"
                )}
              >
                <ShieldCheck size={15} style={{ color: theme.accent }} />
                {roleLabel} workspace
              </span>

              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase",
                  theme.chip,
                  collapsed && "lg:hidden"
                )}
              >
                {roleLabel}
              </span>

              <span
                className={cn(
                  "hidden h-8 w-8 items-center justify-center rounded-xl",
                  collapsed && "lg:flex"
                )}
                style={{
                  backgroundColor: `${theme.accent}26`,
                  color: theme.accent,
                }}
                title={`${roleLabel} workspace`}
              >
                <ShieldCheck size={16} />
              </span>
            </div>

            {/* Navigation */}
            <nav className="relative flex-1 [scrollbar-width:thin] space-y-6 overflow-x-hidden overflow-y-auto px-3 pt-5 pb-4">
              <div>
                <p
                  className={cn(
                    "px-3 pb-2 text-[10px] font-semibold tracking-[0.18em] text-slate-600 uppercase",
                    collapsed && "lg:hidden"
                  )}
                >
                  Workspace
                </p>
                <div
                  className={cn(
                    "mb-2 hidden h-px bg-white/5",
                    collapsed && "lg:block"
                  )}
                />
                <div className="space-y-1">
                  {nav.map((item) => (
                    <NavLink
                      key={item.href}
                      item={item}
                      active={isActiveLink(pathname, item.href)}
                      collapsed={collapsed}
                      accent={theme.accent}
                      onNavigate={close}
                    />
                  ))}
                </div>
              </div>

              <div>
                <p
                  className={cn(
                    "px-3 pb-2 text-[10px] font-semibold tracking-[0.18em] text-slate-600 uppercase",
                    collapsed && "lg:hidden"
                  )}
                >
                  Account
                </p>
                <div
                  className={cn(
                    "mb-2 hidden h-px bg-white/5",
                    collapsed && "lg:block"
                  )}
                />
                <div className="space-y-1">
                  {accountNav.map((item) => (
                    <NavLink
                      key={item.href}
                      item={item}
                      active={isActiveLink(pathname, item.href)}
                      collapsed={collapsed}
                      accent={theme.accent}
                      onNavigate={close}
                    />
                  ))}
                </div>
              </div>

              <Link
                href="/"
                title="Back to site"
                className={cn(
                  "group flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-2.5 text-sm font-medium text-slate-400 transition hover:border-white/15 hover:text-white",
                  collapsed && "lg:justify-center lg:px-0"
                )}
              >
                <Globe2 size={17} className="shrink-0 text-slate-500" />
                <span className={cn("flex-1", collapsed && "lg:hidden")}>
                  Back to site
                </span>
                <ArrowUpRight
                  size={14}
                  className={cn("opacity-50", collapsed && "lg:hidden")}
                />
              </Link>
            </nav>

            {/* Help card */}
            <div className={cn("relative px-3 pb-3", collapsed && "lg:hidden")}>
              <Link
                href="/how-it-works"
                className="group block overflow-hidden rounded-2xl border border-white/[0.07] bg-gradient-to-br from-white/[0.08] to-white/[0.01] p-3 transition hover:border-white/15"
              >
                <span className="flex items-center gap-1.5 text-[11px] font-semibold text-white">
                  <Sparkles size={13} style={{ color: theme.from }} />
                  Need a hand?
                </span>
                <p className="mt-1 text-[11px] leading-5 text-slate-400">
                  Learn how renting works in under a minute.
                </p>
                <span
                  className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase"
                  style={{ color: theme.from }}
                >
                  How it works
                  <ArrowUpRight
                    size={11}
                    className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </span>
              </Link>
            </div>

            {/* User card */}
            <div className="relative border-t border-white/5 p-3">
              <div
                className={cn(
                  "flex items-center gap-3 rounded-2xl bg-white/[0.04] p-2.5",
                  collapsed && "lg:flex-col lg:gap-2 lg:p-2"
                )}
              >
                {user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.image}
                    alt={user.name}
                    className="h-10 w-10 shrink-0 rounded-xl object-cover ring-2 ring-white/10"
                  />
                ) : (
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${theme.from}, ${theme.to})`,
                    }}
                  >
                    {initials(user.name)}
                  </span>
                )}

                <div className={cn("min-w-0 flex-1", collapsed && "lg:hidden")}>
                  <p className="truncate text-sm font-semibold text-white">
                    {user.name}
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    {user.email}
                  </p>
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
          <div className="min-w-0 flex-1">
            <main className="min-w-0">{children}</main>
          </div>
        </div>
      </div>
    </div>
  )
}
