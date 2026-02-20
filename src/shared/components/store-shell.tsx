"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/shared/components/navbar";
import { Footer } from "@/shared/components/footer";
import { useWishlistSync } from "@/shared/hooks/use-wishlist-sync";

export function StoreShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  useWishlistSync();
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
