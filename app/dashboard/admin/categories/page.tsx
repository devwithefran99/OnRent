import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AdminCategories from "@/components/dashboard/AdminCategories";

export const metadata: Metadata = {
  title: "Categories | OnRent",
  description: "Create and manage the equipment categories on OnRent.",
};

export default async function AdminCategoriesPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/signin?redirect=/dashboard/admin/categories");
  }

  if (session.user.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-slate-500">
          Manage the categories owners can choose and visitors see on the home
          page.
        </p>
      </div>

      <AdminCategories />
    </div>
  );
}
