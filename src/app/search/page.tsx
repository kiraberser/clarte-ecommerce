import Link from "next/link";
import { getProducts } from "@/shared/lib/services/products";
import { ProductGrid } from "@/features/products/components/product-grid";
import { FadeIn } from "@/shared/components/motion-wrapper";

interface SearchPageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q, page } = await searchParams;
  const query = q?.trim() ?? "";

  const params: Record<string, string> = {};
  if (query) params.search = query;
  if (page) params.page = page;

  const productsData = query
    ? await getProducts(params)
    : { count: 0, total_pages: 0, current_page: 1, results: [] };

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <FadeIn>
        <div className="mb-12">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {query ? `Resultados para "${query}"` : "Búsqueda"}
          </h1>
          {query && (
            <p className="mt-2 text-sm text-muted-foreground">
              {productsData.count}{" "}
              {productsData.count === 1 ? "producto encontrado" : "productos encontrados"}
            </p>
          )}
        </div>
      </FadeIn>

      {!query && (
        <FadeIn delay={0.1}>
          <p className="text-muted-foreground">
            Usa la barra de búsqueda para encontrar productos.
          </p>
        </FadeIn>
      )}

      {query && productsData.results.length === 0 && (
        <FadeIn delay={0.1}>
          <div className="py-16 text-center">
            <p className="text-muted-foreground">
              No encontramos productos para &ldquo;{query}&rdquo;.
            </p>
            <Link
              href="/collection"
              className="mt-4 inline-block text-sm underline underline-offset-4 hover:text-muted-foreground"
            >
              Ver toda la colección
            </Link>
          </div>
        </FadeIn>
      )}

      {productsData.results.length > 0 && (
        <FadeIn delay={0.1}>
          <ProductGrid products={productsData.results} />
        </FadeIn>
      )}

      {productsData.total_pages > 1 && (
        <FadeIn delay={0.2}>
          <div className="mt-12 flex justify-center gap-2">
            {Array.from(
              { length: productsData.total_pages },
              (_, i) => i + 1,
            ).map((p) => {
              const pageParams = new URLSearchParams();
              if (query) pageParams.set("q", query);
              pageParams.set("page", String(p));
              return (
                <a
                  key={p}
                  href={`/search?${pageParams.toString()}`}
                  className={`flex h-10 w-10 items-center justify-center border text-sm transition-colors hover:bg-foreground hover:text-background ${
                    p === productsData.current_page
                      ? "bg-foreground text-background"
                      : ""
                  }`}
                >
                  {p}
                </a>
              );
            })}
          </div>
        </FadeIn>
      )}
    </section>
  );
}
