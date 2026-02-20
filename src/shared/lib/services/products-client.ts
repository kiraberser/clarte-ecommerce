/**
 * Client-side product API calls (no "use cache" — safe to import in client components).
 */
import type {
  ApiResponse,
  ProductReview,
  WishlistItem,
} from "@/shared/types/api";
import { apiGet, apiPost, apiFetch } from "@/shared/lib/api";

// ──────────────────────────────────────────────
// Reseñas
// ──────────────────────────────────────────────

export async function getProductReviews(slug: string): Promise<ProductReview[]> {
  try {
    const res = await apiGet<ApiResponse<ProductReview[]>>(
      `/productos/${slug}/resenas/`,
    );
    return res.data;
  } catch {
    return [];
  }
}

export async function createReview(
  slug: string,
  data: { rating: number; comentario?: string },
): Promise<ApiResponse<ProductReview>> {
  return apiPost<ApiResponse<ProductReview>>(
    `/productos/${slug}/resenas/crear/`,
    data,
    true,
  );
}

// ──────────────────────────────────────────────
// Lista de Deseos
// ──────────────────────────────────────────────

export async function getWishlist(): Promise<WishlistItem[]> {
  try {
    const res = await apiGet<ApiResponse<WishlistItem[]>>(
      "/productos/lista-deseos/",
      true,
    );
    return res.data;
  } catch {
    return [];
  }
}

export async function addToWishlist(
  productId: number,
): Promise<ApiResponse<WishlistItem>> {
  return apiPost<ApiResponse<WishlistItem>>(
    "/productos/lista-deseos/",
    { producto_id: productId },
    true,
  );
}

export async function removeFromWishlist(
  productId: number,
): Promise<ApiResponse<null>> {
  return apiFetch<ApiResponse<null>>("/productos/lista-deseos/", {
    method: "DELETE",
    body: { producto_id: productId },
    auth: true,
  });
}
