import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import EquipmentForm from "@/components/dashboard/EquipmentForm";

export const metadata: Metadata = {
  title: "Add Equipment | OnRent",
  description: "List a new machine or tool on OnRent.",
};

export default async function NewEquipmentPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/signin?redirect=/dashboard/equipment/new");
  }

  // Only owners can create listings.
  if (session.user.role !== "owner") {
    redirect("/dashboard");
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Add equipment</h1>
        <p className="mt-1 text-sm text-slate-500">
          Fill in the details below. Your listing will be visible after an admin
          approves it.
        </p>
      </div>

      <EquipmentForm mode="create" />
    </div>
  );
}
