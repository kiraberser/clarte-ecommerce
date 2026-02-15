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
          "border px-4 py-2 text-sm transition-colors hover:bg-foreground hover:text-background",
          !activeCategory && "bg-foreground text-background"
        )}
      >
        Todas
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat.slug}
          href={`/collection?category=${cat.slug}`}
          className={cn(
            "border px-4 py-2 text-sm transition-colors hover:bg-foreground hover:text-background",
            activeCategory === cat.slug && "bg-foreground text-background"
          )}
        >
          {cat.nombre}
        </Link>
      ))}
    </div>
  );
}
