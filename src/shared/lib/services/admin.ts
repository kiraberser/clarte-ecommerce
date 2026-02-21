import { apiGet, apiPost, apiPut, apiDelete, apiPatch } from "@/shared/lib/api";
import type {
  ApiResponse,
  PaginatedData,
  AdminProduct,
  AdminCategory,
  AdminCoupon,
  AdminOrderListItem,
  AdminOrder,
  AdminPayment,
  AdminUser,
  Sale,
  SaleDetail,
  SalesSummary,
  Contact,
  ContactEstado,
  NewsletterAdmin,
} from "@/shared/types/api";

// ──────────────────────────────────────────────
// Productos
// ──────────────────────────────────────────────

export function getAdminProducts(params?: string) {
  const query = params ? `?${params}` : "";
  return apiGet<ApiResponse<PaginatedData<AdminProduct>>>(
    `/productos/admin/productos/${query}`,
    true,
  );
}

export function getAdminProduct(id: number) {
  return apiGet<ApiResponse<AdminProduct>>(
    `/productos/admin/productos/${id}/`,
    true,
  );
}

export function createProduct(data: Partial<AdminProduct>) {
  return apiPost<ApiResponse<AdminProduct>>(
    "/productos/admin/productos/",
    data,
    true,
  );
}

export function updateProduct(id: number, data: Partial<AdminProduct>) {
  return apiPut<ApiResponse<AdminProduct>>(
    `/productos/admin/productos/${id}/`,
    data,
    true,
  );
}

export function deleteProduct(id: number) {
  return apiDelete<void>(`/productos/admin/productos/${id}/`, true);
}

export async function uploadImage(file: File): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    throw new Error("Error al subir la imagen");
  }
  const json = await res.json();
  return json.data;
}

// ──────────────────────────────────────────────
// Categorías
// ──────────────────────────────────────────────

export function getAdminCategories() {
  return apiGet<ApiResponse<AdminCategory[]>>(
    "/productos/admin/categorias/",
    true,
  );
}

export function createCategory(data: Partial<AdminCategory>) {
  return apiPost<ApiResponse<AdminCategory>>(
    "/productos/admin/categorias/",
    data,
    true,
  );
}

export function updateCategory(id: number, data: Partial<AdminCategory>) {
  return apiPut<ApiResponse<AdminCategory>>(
    `/productos/admin/categorias/${id}/`,
    data,
    true,
  );
}

export function deleteCategory(id: number) {
  return apiDelete<void>(`/productos/admin/categorias/${id}/`, true);
}

// ──────────────────────────────────────────────
// Cupones
// ──────────────────────────────────────────────

export function getAdminCoupons() {
  return apiGet<ApiResponse<AdminCoupon[]>>("/descuentos/admin/", true);
}

export function createCoupon(data: Partial<AdminCoupon>) {
  return apiPost<ApiResponse<AdminCoupon>>("/descuentos/admin/", data, true);
}

export function updateCoupon(id: number, data: Partial<AdminCoupon>) {
  return apiPut<ApiResponse<AdminCoupon>>(`/descuentos/admin/${id}/`, data, true);
}

export function deleteCoupon(id: number) {
  return apiDelete<void>(`/descuentos/admin/${id}/`, true);
}

// ──────────────────────────────────────────────
// Pedidos
// ──────────────────────────────────────────────

export function getAdminOrders(params?: string) {
  const query = params ? `?${params}` : "";
  return apiGet<ApiResponse<PaginatedData<AdminOrderListItem>>>(
    `/pedidos/admin/${query}`,
    true,
  );
}

export function getAdminOrder(numeroPedido: string) {
  return apiGet<ApiResponse<AdminOrder>>(
    `/pedidos/admin/${numeroPedido}/`,
    true,
  );
}

export function updateOrderStatus(numeroPedido: string, estado: string) {
  return apiPatch<ApiResponse<AdminOrder>>(
    `/pedidos/admin/${numeroPedido}/estado/`,
    { estado },
    true,
  );
}

// ──────────────────────────────────────────────
// Ventas
// ──────────────────────────────────────────────

export function getAdminSales(params?: string) {
  const query = params ? `?${params}` : "";
  return apiGet<ApiResponse<PaginatedData<Sale>>>(
    `/ventas/${query}`,
    true,
  );
}

export function getAdminSale(id: number) {
  return apiGet<ApiResponse<SaleDetail>>(`/ventas/${id}/`, true);
}

export function getSalesSummary() {
  return apiGet<ApiResponse<SalesSummary>>("/ventas/resumen/", true);
}

// ──────────────────────────────────────────────
// Pagos (admin)
// ──────────────────────────────────────────────

export function getAdminPayments(params?: string) {
  const query = params ? `?${params}` : "";
  return apiGet<ApiResponse<PaginatedData<AdminPayment>>>(
    `/pagos/admin/${query}`,
    true,
  );
}

export function getAdminPayment(id: number) {
  return apiGet<ApiResponse<AdminPayment>>(`/pagos/admin/${id}/`, true);
}

// ──────────────────────────────────────────────
// Usuarios (admin)
// ──────────────────────────────────────────────

export function getAdminUsers(params?: string) {
  const query = params ? `?${params}` : "";
  return apiGet<ApiResponse<PaginatedData<AdminUser>>>(
    `/usuarios/admin/${query}`,
    true,
  );
}

export function updateAdminUser(id: number, data: Partial<AdminUser>) {
  return apiPatch<ApiResponse<AdminUser>>(
    `/usuarios/admin/${id}/`,
    data,
    true,
  );
}

// ──────────────────────────────────────────────
// Contactos
// ──────────────────────────────────────────────

export function getAdminContacts(params?: string) {
  const query = params ? `?${params}` : "";
  return apiGet<ApiResponse<PaginatedData<Contact>>>(
    `/contacto/admin/${query}`,
    true,
  );
}

export function updateContactEstado(id: number, estado: ContactEstado) {
  return apiPatch<ApiResponse<Contact>>(
    `/contacto/admin/${id}/estado/`,
    { estado },
    true,
  );
}

// ──────────────────────────────────────────────
// Newsletter
// ──────────────────────────────────────────────

export function getAdminSubscriptions(params?: string) {
  const query = params ? `?${params}` : "";
  return apiGet<ApiResponse<PaginatedData<NewsletterAdmin>>>(
    `/contacto/admin/newsletter/${query}`,
    true,
  );
}
