import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import FavoritesList from "@/components/dashboard/FavoritesList";

export const metadata: Metadata = {
  title: "Favorites | OnRent",
  description: "Equipment you saved for later.",
};

export default async function FavoritesPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/signin?redirect=/dashboard/favorites");
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-slate-500">
          Equipment you saved for later. Open an item to rent it.
        </p>
      </div>

      <FavoritesList />
    </div>
  );
}
