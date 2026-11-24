import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { auth } from "@/lib/auth";
import AdminEquipmentList from "@/components/dashboard/AdminEquipmentList";

export const metadata: Metadata = {
  title: "Equipment Approvals | OnRent",
  description: "Review and approve equipment submitted by owners.",
};

export default async function AdminEquipmentPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/signin?redirect=/dashboard/admin/equipment");
  }

  if (session.user.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Equipment approvals
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Approve a listing to publish it, or reject it to keep it private.
          </p>
        </div>

        <Link
          href="/equipment"
          className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-blue-200 hover:text-blue-600"
        >
          <ExternalLink size={15} />
          View marketplace
        </Link>
      </div>

      <AdminEquipmentList />
    </div>
  );
}
