import type { Metadata } from "next";
import EquipmentHeader from "@/components/equipment/EquipmentHeader";
import EquipmentExplorer from "@/components/equipment/EquipmentExplorer";

export const metadata: Metadata = {
  title: "All Equipment for Rent | OnRent",
  description:
    "Browse verified construction, photography, vehicle, agriculture, electronics, and event equipment available for rent across Bangladesh.",
};

export default async function EquipmentPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string | string[] }>;
}) {
  const { category } = await searchParams;
  const initialCategory = Array.isArray(category) ? category[0] : category;

  return (
    <main>
      <EquipmentHeader />
      <EquipmentExplorer initialCategory={initialCategory} />
    </main>
  );
}
