import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AdminBookings from "@/components/dashboard/AdminBookings";

export const metadata: Metadata = {
  title: "All Rentals | OnRent",
  description: "Review every booking made on the OnRent marketplace.",
};

export default async function AdminRentalsPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/signin?redirect=/dashboard/admin/rentals");
  }

  if (session.user.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">All rentals</h1>
        <p className="mt-1 text-sm text-slate-500">
          Every booking request on OnRent, with customer and owner details.
        </p>
      </div>

      <AdminBookings />
    </div>
  );
}
