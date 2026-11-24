import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Globe2,
  Heart,
  Mail,
  Package,
  PackagePlus,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Dashboard | OnRent",
  description: "Manage your OnRent rentals and listings.",
};

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/signin?redirect=/dashboard");
  }

  const { user } = session;
  const isAdmin = user.role === "admin";
  const isOwner = user.role === "owner";
  const roleLabel = isAdmin
    ? "Admin account"
    : isOwner
      ? "Owner account"
      : "Customer account";

  const stats = isOwner
    ? [
        { icon: Package, label: "Listed equipment", value: "0" },
        { icon: Clock3, label: "Pending approval", value: "0" },
        { icon: CalendarDays, label: "Rental requests", value: "0" },
      ]
    : [
        { icon: CalendarDays, label: "Active rentals", value: "0" },
        { icon: CheckCircle2, label: "Completed rentals", value: "0" },
        { icon: Heart, label: "Favorites", value: "0" },
      ];

  const quickLinks = isOwner
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
          href: "/equipment",
        },
        {
          icon: ArrowRight,
          title: "Browse equipment",
          description: "Find the right equipment for your next project.",
          href: "/equipment",
        },
      ];

  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 p-6 text-white shadow-xl sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-blue-500/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-indigo-500/15 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-blue-200">
              <Sparkles size={13} />
              {roleLabel}
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
                href="/equipment"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-blue-50"
              >
                {isOwner ? "Browse marketplace" : "Find equipment"}
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

          <div className="grid grid-cols-3 gap-3 lg:w-[360px]">
            {stats.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="rounded-2xl border border-white/10 bg-white/[0.06] p-3 backdrop-blur"
              >
                <Icon size={16} className="text-blue-300" />
                <p className="mt-2 text-xl font-bold text-white">{value}</p>
                <p className="mt-0.5 text-[11px] leading-tight text-slate-400">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick links */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {quickLinks.map(({ icon: Icon, title, description, href }) => (
          <Link
            key={title}
            href={href}
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
              <Icon size={20} />
            </span>

            <h3 className="mt-4 font-bold text-slate-900">{title}</h3>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              {description}
            </p>

            <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-blue-600">
              Continue
              <ArrowRight
                size={14}
                className="transition group-hover:translate-x-0.5"
              />
            </span>
          </Link>
        ))}
      </div>

      {/* Security note */}
      <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500 shadow-sm">
        <ShieldCheck size={20} className="mt-0.5 shrink-0 text-emerald-600" />
        <p>
          Your account is secured with OnRent authentication. Sessions are
          stored securely and expire automatically.
        </p>
      </div>
    </div>
  );
}
