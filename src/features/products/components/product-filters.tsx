"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { Category } from "@/shared/types/api";
import { cn } from "@/shared/lib/utils";

interface ProductFiltersProps {
  categories: Category[];
}

export function ProductFilters({ categories }: ProductFiltersProps) {
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category");

  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href="/collection"
        className={cn(
          "rounded-lg border border-foreground/15 px-4 py-2 text-sm transition-all hover:border-sunset hover:bg-sunset hover:text-white",
          !activeCategory && "border-sunset bg-sunset text-white"
        )}
      >
        Todas
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat.slug}
          href={`/collection?category=${cat.slug}`}
          className={cn(
            "rounded-lg border border-foreground/15 px-4 py-2 text-sm transition-all hover:border-sunset hover:bg-sunset hover:text-white",
            activeCategory === cat.slug && "border-sunset bg-sunset text-white"
          )}
        >
          {cat.nombre}
        </Link>
      ))}
    </div>
  );
}
