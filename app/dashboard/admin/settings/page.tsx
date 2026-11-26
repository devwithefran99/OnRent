import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AdminSettings from "@/components/dashboard/AdminSettings";

export const metadata: Metadata = {
  title: "Platform Settings | OnRent",
  description: "Configure the OnRent marketplace settings.",
};

export default async function AdminSettingsPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/signin?redirect=/dashboard/admin/settings");
  }

  if (session.user.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-slate-500">
          Manage support details, rental defaults and how new listings are
          reviewed.
        </p>
      </div>

      <AdminSettings />
    </div>
  );
}
