"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

/**
 * Public site chrome. The dashboard has its own shell (sidebar + top bar), so
 * the standard navbar and footer are omitted for /dashboard and its subpages.
 */
export default function SiteChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isDashboard =
    pathname === "/dashboard" || pathname.startsWith("/dashboard/");

  if (isDashboard) return <>{children}</>;

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
