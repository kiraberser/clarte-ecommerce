"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { Badge } from "@/shared/components/ui/badge";
import { useAuth } from "@/shared/lib/auth-context";
import { getOrder } from "@/shared/lib/services/orders";
import type { Order } from "@/shared/types/api";

const ESTADO_LABELS: Record<string, string> = {
  pendiente: "Pendiente",
  pagado: "Pagado",
  enviado: "Enviado",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

const ESTADO_VARIANT: Record<string, "default" | "secondary" | "outline"> = {
  pendiente: "secondary",
  pagado: "default",
  enviado: "default",
  entregado: "outline",
  cancelado: "outline",
};

export default function OrderDetailPage() {
  const { numero } = useParams<{ numero: string }>();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    getOrder(numero)
      .then((data) => setOrder(data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [numero, isAuthenticated, isLoading]);

  if (isLoading || loading) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
        <div className="space-y-4">
          <div className="h-6 w-48 animate-pulse bg-secondary" />
          <div className="h-4 w-32 animate-pulse bg-secondary" />
          <div className="mt-8 h-40 animate-pulse bg-secondary" />
        </div>
      </section>
    );
  }

  if (!isAuthenticated) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-16 lg:px-8 text-center">
        <p className="text-muted-foreground">Inicia sesión para ver este pedido.</p>
        <Link href="/login">
          <Button className="mt-4">Iniciar Sesión</Button>
        </Link>
      </section>
    );
  }

  if (error || !order) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-16 lg:px-8 text-center">
        <p className="text-muted-foreground">Pedido no encontrado.</p>
        <Button variant="outline" className="mt-4" onClick={() => router.back()}>
          Volver
        </Button>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
      <button
        onClick={() => router.back()}
        className="mb-8 flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Mis Pedidos
      </button>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            {order.numero_pedido}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {new Date(order.created_at).toLocaleDateString("es-MX", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <Badge variant={ESTADO_VARIANT[order.estado] ?? "secondary"}>
          {ESTADO_LABELS[order.estado] ?? order.estado}
        </Badge>
      </div>

      <Separator className="my-6" />

      {/* Items */}
      <div className="space-y-4">
        <h2 className="text-sm font-medium">Artículos</h2>
        <div className="divide-y border">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-4">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden bg-secondary">
                <Image
                  src={item.producto_imagen || "/placeholder-product.svg"}
                  alt={item.producto_nombre}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <Link
                  href={`/products/${item.producto_slug}`}
                  className="text-sm font-medium hover:underline underline-offset-4 line-clamp-1"
                >
                  {item.producto_nombre}
                </Link>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Cant: {item.cantidad} · ${Number(item.precio_unitario).toLocaleString()} c/u
                </p>
              </div>
              <p className="text-sm font-medium shrink-0">
                ${Number(item.subtotal).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      <Separator className="my-6" />

      {/* Totals + Address in two columns */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-3">
          <h2 className="text-sm font-medium">Dirección de envío</h2>
          <div className="text-sm text-muted-foreground space-y-0.5">
            <p>{order.direccion_envio}</p>
            <p>{order.ciudad}, {order.estado_envio}</p>
            <p>CP {order.codigo_postal}</p>
          </div>
          {order.notas && (
            <p className="text-xs text-muted-foreground italic">
              Notas: {order.notas}
            </p>
          )}
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-medium">Resumen</h2>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${Number(order.subtotal).toLocaleString()}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>${Number(order.total).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
