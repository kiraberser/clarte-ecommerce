"use client";

import { useEffect } from "react";
import { useAuth } from "@/shared/lib/auth-context";
import { getWishlist } from "@/shared/lib/services/products-client";
import { useWishlistStore } from "@/features/products/store/use-wishlist-store";

export function useWishlistSync() {
  const { isAuthenticated, isLoading } = useAuth();
  const setIds = useWishlistStore((s) => s.setIds);
  const clear = useWishlistStore((s) => s.clear);

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      clear();
      return;
    }

    getWishlist().then((items) => {
      setIds(items.map((item) => item.producto.id));
    });
  }, [isAuthenticated, isLoading, setIds, clear]);
}
