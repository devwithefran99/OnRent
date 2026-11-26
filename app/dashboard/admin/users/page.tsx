import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AdminUsers from "@/components/dashboard/AdminUsers";

export const metadata: Metadata = {
  title: "All Users | OnRent",
  description: "See every customer, owner and admin account on OnRent.",
};

export default async function AdminUsersPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/signin?redirect=/dashboard/admin/users");
  }

  if (session.user.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-slate-500">
          Customers, equipment owners and admins registered on OnRent.
        </p>
      </div>

      <AdminUsers />
    </div>
  );
}
