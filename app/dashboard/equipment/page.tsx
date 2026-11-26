import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import { auth } from "@/lib/auth";
import OwnerEquipmentList from "@/components/dashboard/OwnerEquipmentList";

export const metadata: Metadata = {
  title: "My Equipment | OnRent",
  description: "Manage the equipment you have listed on OnRent.",
};

export default async function MyEquipmentPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/signin?redirect=/dashboard/equipment");
  }

  if (session.user.role !== "owner") {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-slate-500">
            Edit or delete your listings. Pending items are waiting for admin
            approval.
          </p>
        </div>

        <Link
          href="/dashboard/equipment/new"
          className="inline-flex w-fit items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-orange-600"
        >
          <Plus size={16} />
          Add equipment
        </Link>
      </div>

      <OwnerEquipmentList />
    </div>
  );
}
