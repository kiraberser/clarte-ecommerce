import { cacheLife, cacheTag } from "next/cache";
import type {
  ApiResponse,
  PaginatedData,
  Product,
  ProductDetail,
  Category,
} from "@/shared/types/api";
import { API_BASE_URL } from "@/shared/lib/api";

// ──────────────────────────────────────────────
// Server-side data fetching with "use cache"
// ──────────────────────────────────────────────

async function serverFetch<T>(endpoint: string): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Failed to fetch ${endpoint}: ${res.status}`);
  }

  return res.json();
}

const EMPTY_PAGINATED = {
  count: 0,
  total_pages: 0,
  current_page: 1,
  next: null,
  previous: null,
  results: [],
};

export async function getProducts(
  params?: Record<string, string>,
): Promise<PaginatedData<Product>> {
  "use cache";
  cacheLife("catalog");
  cacheTag("products");

  try {
    const query = params
      ? "?" + new URLSearchParams(params).toString()
      : "";
    const res = await serverFetch<ApiResponse<PaginatedData<Product>>>(
      `/productos/${query}`,
    );
    return res.data;
  } catch {
    return EMPTY_PAGINATED as PaginatedData<Product>;
  }
}

export async function getProductBySlug(slug: string) {
  "use cache";
  cacheLife("product");
  cacheTag("products", `product-${slug}`);

  const res = await serverFetch<ApiResponse<ProductDetail>>(
    `/productos/${slug}/`,
  );
  return res.data;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  "use cache";
  cacheLife("catalog");
  cacheTag("products", "featured");

  try {
    const res = await serverFetch<ApiResponse<Product[]>>(
      "/productos/destacados/",
    );
    return res.data;
  } catch {
    return [];
  }
}

export async function getRelatedProducts(
  categorySlug: string,
  excludeId: number,
): Promise<Product[]> {
  "use cache";
  cacheLife("catalog");
  cacheTag("products");

  try {
    const data = await getProducts({ categoria: categorySlug });
    return data.results
      .filter((p) => p.id !== excludeId)
      .slice(0, 8);
  } catch {
    return [];
  }
}

export async function getCategories(): Promise<Category[]> {
  "use cache";
  cacheLife("catalog");
  cacheTag("categories");

  try {
    const res = await serverFetch<ApiResponse<Category[]>>(
      "/productos/categorias/",
    );
    return res.data;
  } catch {
    return [];
  }
}

