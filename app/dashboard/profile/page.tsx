import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import ProfileForm from "@/components/dashboard/ProfileForm";

export const metadata: Metadata = {
  title: "Profile | OnRent",
  description: "Update your OnRent profile and contact details.",
};

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/signin?redirect=/dashboard/profile");
  }

  const user = session.user;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Profile</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage how you appear on OnRent. Your email stays private.
        </p>
      </div>

      <ProfileForm
        user={{
          name: user.name,
          email: user.email,
          image: user.image ?? null,
          role: (user as { role?: string }).role ?? "customer",
          phone: (user as { phone?: string }).phone ?? "",
          address: (user as { address?: string }).address ?? "",
        }}
      />
    </div>
  );
}
