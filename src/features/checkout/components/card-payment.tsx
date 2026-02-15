"use client";

import { useState } from "react";
import { initMercadoPago, CardPayment } from "@mercadopago/sdk-react";
import { processCardPayment } from "@/shared/lib/services/payments";
import { ApiError } from "@/shared/lib/api";

const mpPublicKey = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY!;
initMercadoPago(mpPublicKey, { locale: "es-MX" });

const MP_STATUS_MESSAGES: Record<string, string> = {
  cc_rejected_bad_filled_card_number: "Revisa el número de tarjeta.",
  cc_rejected_bad_filled_date: "Revisa la fecha de vencimiento.",
  cc_rejected_bad_filled_other: "Revisa los datos de la tarjeta.",
  cc_rejected_bad_filled_security_code: "Revisa el código de seguridad.",
  cc_rejected_blacklist: "No pudimos procesar tu pago.",
  cc_rejected_call_for_authorize: "Debes autorizar el pago con tu banco.",
  cc_rejected_card_disabled: "Activa tu tarjeta o usa otra.",
  cc_rejected_duplicated_payment: "Ya realizaste un pago por ese monto.",
  cc_rejected_high_risk: "Tu pago fue rechazado. Usa otra tarjeta.",
  cc_rejected_insufficient_amount: "Fondos insuficientes.",
  cc_rejected_max_attempts: "Llegaste al límite de intentos. Usa otra tarjeta.",
  cc_rejected_other_reason: "Tu tarjeta no procesó el pago.",
};

interface CardPaymentBrickProps {
  amount: number;
  pedidoId: number;
  payerEmail: string;
  onSuccess: () => void;
  onError?: (message: string) => void;
}

export function CardPaymentBrick({
  amount,
  pedidoId,
  payerEmail,
  onSuccess,
  onError,
}: CardPaymentBrickProps) {
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {processing && (
        <div className="flex items-center justify-center py-4">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
          <span className="ml-2 text-sm text-muted-foreground">
            Procesando pago...
          </span>
        </div>
      )}

      <CardPayment
        initialization={{ amount, payer: { email: payerEmail } }}
        locale="es-MX"
        customization={{
          paymentMethods: {
            minInstallments: 1,
            maxInstallments: 12,
          },
          visual: {
            hideFormTitle: true,
          },
        }}
        onSubmit={async (formData) => {
          setError("");
          setProcessing(true);

          try {
            const result = await processCardPayment({
              pedido_id: pedidoId,
              token: formData.token,
              payment_method_id: formData.payment_method_id,
              issuer_id: formData.issuer_id,
              installments: formData.installments,
              payer: {
                email: formData.payer.email || payerEmail,
                identification: {
                  type: formData.payer.identification?.type ?? "",
                  number: formData.payer.identification?.number ?? "",
                },
              },
            });

            if (result.status === "approved") {
              onSuccess();
            } else {
              const msg =
                MP_STATUS_MESSAGES[result.status_detail] ||
                "El pago fue rechazado. Intenta con otra tarjeta.";
              setError(msg);
              onError?.(msg);
            }
          } catch (err) {
            const msg =
              err instanceof ApiError
                ? err.data.message || "Error al procesar el pago."
                : "Error de conexión. Intenta de nuevo.";
            setError(msg);
            onError?.(msg);
          } finally {
            setProcessing(false);
          }
        }}
        onError={() => {}}
      />
    </div>
  );
}
