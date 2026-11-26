import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  Globe2,
  Mail,
  Package,
  PackagePlus,
  ShieldCheck,
  Sparkles,
  Tags,
  Users,
} from "lucide-react";
import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import AdminStats from "@/components/dashboard/AdminStats";
import RoleStats from "@/components/dashboard/RoleStats";
import DashboardAnalytics from "@/components/dashboard/DashboardAnalytics";

export const metadata: Metadata = {
  title: "Dashboard | OnRent",
  description: "Manage your OnRent rentals and listings.",
};

const roleAccents = {
  customer: { accent: "#2563eb", from: "#0ea5e9", label: "Customer" },
  owner: { accent: "#ea580c", from: "#f59e0b", label: "Owner" },
  admin: { accent: "#8b5cf6", from: "#d946ef", label: "Admin" },
} as const;

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/signin?redirect=/dashboard");
  }

  const { user } = session;
  const role = (user.role ?? "customer") as "customer" | "owner" | "admin";
  const isAdmin = role === "admin";
  const isOwner = role === "owner";
  const theme = roleAccents[role];
  const RoleIcon = isAdmin ? ShieldCheck : isOwner ? BriefcaseBusiness : Sparkles;

  const quickLinks = isAdmin
    ? [
        {
          icon: ShieldCheck,
          title: "Review listings",
          description: "Approve or reject equipment submitted by owners.",
          href: "/dashboard/admin/equipment",
        },
        {
          icon: Package,
          title: "Browse marketplace",
          description: "See all equipment currently live on OnRent.",
          href: "/equipment",
        },
        {
          icon: CalendarDays,
          title: "All rentals",
          description: "Review every booking request and its status.",
          href: "/dashboard/admin/rentals",
        },
        {
          icon: Tags,
          title: "Categories",
          description: "Add, rename and organise equipment categories.",
          href: "/dashboard/admin/categories",
        },
        {
          icon: Users,
          title: "All users",
          description: "Browse customers, owners and admin accounts.",
          href: "/dashboard/admin/users",
        },
      ]
    : isOwner
      ? [
          {
            icon: PackagePlus,
            title: "List new equipment",
            description: "Add a machine or tool and start earning.",
            href: "/dashboard/equipment/new",
          },
          {
            icon: BriefcaseBusiness,
            title: "My listings",
            description: "Review the equipment you have published.",
            href: "/dashboard/equipment",
          },
        ]
      : [
          {
            icon: CalendarDays,
            title: "My rentals",
            description: "Track your active and upcoming rentals.",
            href: "/dashboard/rentals",
          },
          {
            icon: ArrowRight,
            title: "Browse equipment",
            description: "Find the right equipment for your next project.",
            href: "/equipment",
          },
        ];

  return (
    <div className="space-y-5">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-950 p-5 text-white shadow-xl sm:p-7 lg:p-8">
        <div
          className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full opacity-40 blur-3xl"
          style={{ backgroundColor: theme.accent }}
        />
        <div className="pointer-events-none absolute -bottom-28 left-1/4 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_70%)]" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <span
              className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wider"
              style={{
                borderColor: `${theme.accent}66`,
                backgroundColor: `${theme.accent}1f`,
                color: "#fff",
              }}
            >
              <RoleIcon size={13} style={{ color: theme.from }} />
              {theme.label} account
            </span>

            <h2 className="mt-4 text-2xl font-bold leading-tight sm:text-3xl">
              Welcome back, {user.name}
            </h2>

            <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-300">
              <Mail size={14} />
              {user.email}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={isAdmin ? "/dashboard/admin/equipment" : "/equipment"}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold transition hover:bg-slate-100"
                style={{ color: theme.accent }}
              >
                {isAdmin
                  ? "Review listings"
                  : isOwner
                    ? "Browse marketplace"
                    : "Find equipment"}
                <ArrowRight size={16} />
              </Link>

              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                <Globe2 size={16} />
                Back to home
              </Link>
            </div>
          </div>

          {!isAdmin && (
            <RoleStats role={isOwner ? "owner" : "customer"} />
          )}
        </div>
      </section>

      {/* Analytics + charts */}
      <DashboardAnalytics role={role} />

      {/* Admin totals */}
      {isAdmin && (
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Marketplace totals
              </h2>
              <p className="text-xs text-slate-500">
                Live counts across the whole platform.
              </p>
            </div>

            <Link
              href="/equipment"
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              View marketplace
              <ArrowRight size={13} />
            </Link>
          </div>

          <AdminStats />
        </section>
      )}

      {/* Quick links */}
      <section className="space-y-3">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Quick actions
          </h2>
          <p className="text-xs text-slate-500">
            Jump straight into the things you do most.
          </p>
        </div>

        <div
          className={cn(
            "grid grid-cols-1 gap-4 sm:grid-cols-2",
            quickLinks.length > 2 && "xl:grid-cols-3"
          )}
        >
          {quickLinks.map(({ icon: Icon, title, description, href }) => (
            <Link
              key={title}
              href={href}
              className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
            >
              <div
                className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full opacity-0 blur-2xl transition group-hover:opacity-30"
                style={{ backgroundColor: theme.accent }}
              />

              <span
                className="relative flex h-11 w-11 items-center justify-center rounded-xl transition group-hover:scale-105"
                style={{
                  backgroundColor: `${theme.accent}14`,
                  color: theme.accent,
                }}
              >
                <Icon size={20} />
              </span>

              <h3 className="relative mt-4 font-bold text-slate-900 dark:text-white">
                {title}
              </h3>

              <p className="relative mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                {description}
              </p>

              <span
                className="relative mt-4 inline-flex items-center gap-1 text-xs font-semibold"
                style={{ color: theme.accent }}
              >
                Continue
                <ArrowRight
                  size={14}
                  className="transition group-hover:translate-x-0.5"
                />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Security note */}
      <div className="flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-white p-5 text-sm text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
        <ShieldCheck size={20} className="mt-0.5 shrink-0 text-emerald-600" />
        <p>
          Your account is secured with OnRent authentication. Sessions are
          stored securely and expire automatically.
        </p>
      </div>
    </div>
  );
}
