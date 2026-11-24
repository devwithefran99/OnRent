import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import DashboardShell, {
  type DashboardRole,
} from "@/components/dashboard/DashboardShell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/signin?redirect=/dashboard");
  }

  const { user } = session;

  return (
    <DashboardShell
      user={{
        name: user.name,
        email: user.email,
        image: user.image ?? null,
        role: ((user as { role?: string }).role ??
          "customer") as DashboardRole,
      }}
    >
      {children}
    </DashboardShell>
  );
}
