"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/shared/components/navbar";
import { Footer } from "@/shared/components/footer";

export function StoreShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
