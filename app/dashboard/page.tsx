import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  Mail,
  PackagePlus,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { auth } from "@/lib/auth";
import SignOutButton from "@/components/auth/SignOutButton";

export const metadata: Metadata = {
  title: "Dashboard | OnRent",
  description: "Manage your OnRent rentals and listings.",
};

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/signin");
  }

  const { user } = session;
  const isAdmin = user.role === "admin";
  const isOwner = user.role === "owner";
  const roleLabel = isAdmin
    ? "Admin account"
    : isOwner
      ? "Owner account"
      : "Customer account";

  const quickLinks = isOwner
    ? [
        {
          icon: PackagePlus,
          title: "List new equipment",
          description: "Add a machine or tool and start earning.",
          href: "/equipment",
        },
        {
          icon: BriefcaseBusiness,
          title: "My listings",
          description: "Review the equipment you have published.",
          href: "/equipment",
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
    <main className="min-h-[calc(100vh-200px)] bg-slate-50 py-10 sm:py-14">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <UserRound size={26} />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
                  {roleLabel}
                </p>

                <h1 className="mt-1 text-2xl font-bold text-slate-900">
                  Welcome, {user.name}
                </h1>

                <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                  <Mail size={14} />
                  {user.email}
                </p>
              </div>
            </div>

            <SignOutButton />
          </div>
        </section>

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {quickLinks.map(({ icon: Icon, title, description, href }) => (
            <Link
              key={title}
              href={href}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                <Icon size={20} />
              </span>

              <h2 className="mt-4 font-bold text-slate-900">{title}</h2>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                {description}
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500 shadow-sm">
          <ShieldCheck size={20} className="mt-0.5 shrink-0 text-emerald-600" />
          <p>
            Your account is secured with OnRent authentication. Sessions are
            stored securely and expire automatically.
          </p>
        </div>
      </div>
    </main>
  );
}
