"use client";

import Link from "next/link";
import Image from "next/image";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { useAuth } from "@/shared/lib/auth-context";
import type { Order } from "@/shared/types/api";

interface CheckoutSuccessProps {
  order?: Order | null;
}

export function CheckoutSuccess({ order: orderProp }: CheckoutSuccessProps) {
  const { isAuthenticated } = useAuth();

  const order: Order | null = orderProp ?? (() => {
    try {
      const stored = sessionStorage.getItem("ocaso-last-order");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  })();

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-muted-foreground">No se encontraron detalles del pedido.</p>
        <Link href="/collection">
          <Button variant="outline" className="mt-6">
            Ver Colección
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mx-auto max-w-2xl space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col items-center text-center">
        <CheckCircle className="h-14 w-14 text-foreground" strokeWidth={1} />
        <h1 className="mt-5 text-3xl font-semibold tracking-tight">Pedido Confirmado</h1>
        <p className="mt-2 font-mono text-sm text-muted-foreground">
          #{order.numero_pedido}
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          Hemos enviado los detalles a tu correo.
        </p>
      </div>

      <Separator />

      {/* Items */}
      <div className="space-y-4">
        {order.items.map((item) => (
          <div key={item.id} className="flex items-center gap-4">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden border bg-secondary">
              <Image
                src={item.producto_imagen || "/placeholder-product.svg"}
                alt={item.producto_nombre}
                fill
                className="object-cover"
                sizes="56px"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium">{item.producto_nombre}</p>
              <p className="text-xs text-muted-foreground">Cant. {item.cantidad}</p>
            </div>
            <p className="text-sm font-medium">
              ${Number(item.subtotal).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <Separator />

      {/* Totals */}
      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>${Number(order.subtotal).toLocaleString()}</span>
        </div>
        {Number(order.descuento_monto) > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">
              Descuento{order.cupon_codigo ? ` (${order.cupon_codigo})` : ""}
            </span>
            <span className="text-green-600">−${Number(order.descuento_monto).toLocaleString()}</span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Envío</span>
          <span>Gratis</span>
        </div>
        <Separator />
        <div className="flex items-center justify-between font-semibold">
          <span>Total</span>
          <span className="text-base">${Number(order.total).toLocaleString()}</span>
        </div>
      </div>

      <Separator />

      {/* Shipping address */}
      <div className="text-sm">
        <p className="font-medium mb-1">Dirección de envío</p>
        <p className="text-muted-foreground">{order.direccion_envio}</p>
        <p className="text-muted-foreground">
          {order.ciudad}, {order.estado_envio} {order.codigo_postal}
        </p>
      </div>

      {/* CTAs */}
      <div className="flex flex-col items-center gap-4 pt-2">
        <Link href="/collection">
          <Button size="lg">Seguir Comprando</Button>
        </Link>
        {!isAuthenticated && (
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              ¿Quieres guardar tu historial de compras?
            </p>
            <Link href="/register">
              <Button variant="outline" size="lg" className="mt-3">
                Crear una cuenta
              </Button>
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  );
}
