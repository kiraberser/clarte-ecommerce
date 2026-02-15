import type {
  ApiResponse,
  PaymentResult,
  CardPaymentData,
} from "@/shared/types/api";
import { apiPost } from "@/shared/lib/api";

export async function processCardPayment(data: CardPaymentData) {
  const res = await apiPost<ApiResponse<PaymentResult>>(
    "/pagos/procesar-card/",
    data,
    true,
  );
  return res.data;
}
