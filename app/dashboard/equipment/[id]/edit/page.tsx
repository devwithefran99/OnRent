import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import EditEquipmentLoader from "@/components/dashboard/EditEquipmentLoader";

export const metadata: Metadata = {
  title: "Edit Equipment | OnRent",
};

export default async function EditEquipmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/signin?redirect=/dashboard/equipment");
  }

  if (session.user.role !== "owner") {
    redirect("/dashboard");
  }

  const { id } = await params;

  return (
    <EditEquipmentLoader equipmentId={id} userId={session.user.id} />
  );
}
