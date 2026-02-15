import type {
  ApiResponse,
  PaginatedData,
  Order,
  OrderListItem,
  CreateOrderData,
} from "@/shared/types/api";
import { apiPost, apiGet } from "@/shared/lib/api";

export async function createOrder(data: CreateOrderData) {
  const res = await apiPost<ApiResponse<Order>>(
    "/pedidos/crear/",
    data,
    true,
  );
  return res.data;
}

export async function getMyOrders(estado?: string) {
  const params = estado ? `?estado=${estado}` : "";
  const res = await apiGet<ApiResponse<PaginatedData<OrderListItem>>>(
    `/pedidos/${params}`,
    true,
  );
  return res.data;
}

export async function getOrder(numeroPedido: string) {
  const res = await apiGet<ApiResponse<Order>>(
    `/pedidos/${numeroPedido}/`,
    true,
  );
  return res.data;
}

export async function cancelOrder(numeroPedido: string) {
  const res = await apiPost<ApiResponse<Order>>(
    `/pedidos/${numeroPedido}/cancelar/`,
    {},
    true,
  );
  return res.data;
}
