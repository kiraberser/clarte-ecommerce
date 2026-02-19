"use client";

import { useState, useEffect, useDeferredValue } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Search, ArrowRight } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import type { Product, ApiResponse, PaginatedData } from "@/shared/types/api";
import { API_BASE_URL } from "@/shared/lib/api";

interface SearchBarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchBar({ open, onOpenChange }: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [results, setResults] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (deferredQuery.length < 2) {
      setResults([]);
      return;
    }

    let cancelled = false;
    setLoading(true);

    fetch(`${API_BASE_URL}/productos/?search=${encodeURIComponent(deferredQuery)}&page_size=6`)
      .then((res) => res.json())
      .then((json: ApiResponse<PaginatedData<Product>>) => {
        if (!cancelled) {
          setResults(json.data.results);
          setTotalCount(json.data.count);
        }
      })
      .catch(() => {
        if (!cancelled) setResults([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [deferredQuery]);

  function handleClose() {
    setQuery("");
    setResults([]);
    setTotalCount(0);
    onOpenChange(false);
  }

  function handleViewAll() {
    if (!query.trim()) return;
    handleClose();
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={(v) => { if (!v) handleClose(); else onOpenChange(v); }}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed inset-x-0 top-0 z-50 border-b bg-background p-6 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top">
          <DialogPrimitive.Title className="sr-only">
            Buscar productos
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            Escribe para buscar lámparas
          </DialogPrimitive.Description>
          <div className="mx-auto max-w-2xl">
            <div className="flex items-center gap-3">
              <Search className="h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Buscar lámparas..."
                className="border-0 text-lg focus-visible:ring-0"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleViewAll();
                }}
              />
            </div>

            {loading && query.length >= 2 && (
              <p className="mt-4 border-t pt-4 text-sm text-muted-foreground">
                Buscando...
              </p>
            )}

            {!loading && results.length > 0 && (
              <>
                <div className="mt-4 flex items-center justify-between border-t pt-3">
                  <p className="text-xs text-muted-foreground">
                    {totalCount}{" "}
                    {totalCount === 1 ? "resultado" : "resultados"} para &ldquo;{deferredQuery}&rdquo;
                  </p>
                  {totalCount > results.length && (
                    <button
                      onClick={handleViewAll}
                      className="flex items-center gap-1 text-xs font-medium underline underline-offset-4 hover:text-muted-foreground"
                    >
                      Ver todos
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  )}
                </div>
                <ul className="mt-2 divide-y">
                  {results.map((product) => (
                    <li key={product.id}>
                      <Link
                        href={`/products/${product.slug}`}
                        onClick={handleClose}
                        className="flex items-center justify-between py-3 text-sm transition-colors hover:text-muted-foreground"
                      >
                        <span className="font-medium">{product.nombre}</span>
                        <span className="text-muted-foreground">
                          ${Number(product.precio_final).toLocaleString()}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {!loading && query.length >= 2 && results.length === 0 && (
              <p className="mt-4 border-t pt-4 text-sm text-muted-foreground">
                No se encontraron resultados para &ldquo;{query}&rdquo;
              </p>
            )}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
