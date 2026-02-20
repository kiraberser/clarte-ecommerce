"use client";

import Image from "next/image";
import { Separator } from "@/shared/components/ui/separator";
import { useCartStore } from "@/features/cart/store/use-cart-store";
import { useMounted } from "@/shared/hooks/use-mounted";

interface CheckoutSummaryProps {
  couponCode?: string;
  couponDiscount?: number;
}

export function CheckoutSummary({ couponCode, couponDiscount = 0 }: CheckoutSummaryProps) {
  const items = useCartStore((s) => s.items);
  const totalPrice = useCartStore((s) => s.totalPrice);
  const mounted = useMounted();

  if (!mounted) {
    return (
      <div className="space-y-4">
        <div className="h-6 w-32 animate-pulse bg-secondary" />
        <div className="h-20 animate-pulse bg-secondary" />
      </div>
    );
  }

  if (items.length === 0) return null;

  const subtotal = totalPrice();
  const finalTotal = Math.max(0, subtotal - couponDiscount);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Resumen del Pedido</h2>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.product.id} className="flex items-center gap-4">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden border bg-secondary">
              <Image
                src={item.product.imagen_principal || "/placeholder-product.svg"}
                alt={item.product.nombre}
                fill
                className="object-cover"
                sizes="56px"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium">
                {item.product.nombre}
              </p>
              <p className="text-sm text-muted-foreground">
                Cant: {item.quantity}
              </p>
            </div>
            <p className="text-sm font-medium">
              ${(Number(item.product.precio_final) * item.quantity).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <Separator />

      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Subtotal</span>
        <span>${subtotal.toLocaleString()}</span>
      </div>

      {couponDiscount > 0 && couponCode && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Descuento <span className="font-medium text-foreground">({couponCode})</span>
          </span>
          <span className="text-green-600">−${couponDiscount.toLocaleString()}</span>
        </div>
      )}

      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Envío</span>
        <span>Gratis</span>
      </div>

      <Separator />

      <div className="flex items-center justify-between">
        <span className="font-semibold">Total</span>
        <span className="text-lg font-semibold">
          ${finalTotal.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
