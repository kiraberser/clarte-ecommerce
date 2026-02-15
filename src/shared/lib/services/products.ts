import { cache } from "react";
import type {
  ApiResponse,
  PaginatedData,
  Product,
  ProductDetail,
  Category,
} from "@/shared/types/api";
import { API_BASE_URL } from "@/shared/lib/api";

// ──────────────────────────────────────────────
// Server-side data fetching with React.cache()
// ──────────────────────────────────────────────

async function serverFetch<T>(endpoint: string): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;
  const res = await fetch(url, { next: { revalidate: 60 } });

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

export const getProducts = cache(
  async (params?: Record<string, string>): Promise<PaginatedData<Product>> => {
    try {
      const query = params
        ? "?" + new URLSearchParams(params).toString()
        : "";
      const res = await serverFetch<ApiResponse<PaginatedData<Product>>>(
        `/productos/${query}`,
      );
      return res.data;
    } catch {
      // silently fallback
      return EMPTY_PAGINATED as PaginatedData<Product>;
    }
  },
);

export const getProductBySlug = cache(async (slug: string) => {
  const res = await serverFetch<ApiResponse<ProductDetail>>(
    `/productos/${slug}/`,
  );
  return res.data;
});

export const getFeaturedProducts = cache(async (): Promise<Product[]> => {
  try {
    const res = await serverFetch<ApiResponse<Product[]>>(
      "/productos/destacados/",
    );
    return res.data;
  } catch {
    // silently fallback
    return [];
  }
});

export const getCategories = cache(async (): Promise<Category[]> => {
  try {
    const res = await serverFetch<ApiResponse<Category[]>>(
      "/productos/categorias/",
    );
    return res.data;
  } catch {
    // silently fallback
    return [];
  }
});
