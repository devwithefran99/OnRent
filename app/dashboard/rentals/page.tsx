import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import MyRentals from "@/components/dashboard/MyRentals";
import OwnerBookings from "@/components/dashboard/OwnerBookings";

export const metadata: Metadata = {
  title: "Rentals | OnRent",
  description: "Track your OnRent bookings and rental requests.",
};

export default async function RentalsPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/signin?redirect=/dashboard/rentals");
  }

  const isOwner = session.user.role === "owner";
  const isAdmin = session.user.role === "admin";

  // Admin rental view is part of the admin dashboard roadmap.
  if (isAdmin) {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          {isOwner ? "Rental requests" : "My rentals"}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {isOwner
            ? "Approve or reject booking requests for your equipment."
            : "Track the bookings you have requested and their status."}
        </p>
      </div>

      {isOwner ? <OwnerBookings /> : <MyRentals />}
    </div>
  );
}
