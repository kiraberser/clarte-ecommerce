"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/shared/lib/auth-context";
import { Skeleton } from "@/shared/components/ui/skeleton";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user?.is_staff)) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[hsl(0_0%_6%)]">
        <div className="space-y-4 w-80">
          <Skeleton className="h-8 w-48 bg-[hsl(0_0%_14%)]" />
          <Skeleton className="h-4 w-64 bg-[hsl(0_0%_14%)]" />
          <Skeleton className="h-4 w-56 bg-[hsl(0_0%_14%)]" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user?.is_staff) {
    return null;
  }

  return <>{children}</>;
}
