"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { useAuth } from "@/shared/lib/auth-context";
import { getMyOrders } from "@/shared/lib/services/orders";
import type { OrderListItem } from "@/shared/types/api";

const ESTADO_LABELS: Record<string, string> = {
  pendiente: "Pendiente",
  pagado: "Pagado",
  enviado: "Enviado",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

export default function OrdersPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    getMyOrders()
      .then((data) =>
        setOrders(
          data.results.filter(
            (o) => ["pendiente", "pagado", "enviado"].includes(o.estado),
          ),
        ),
      )
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [isAuthenticated, isLoading]);

  if (isLoading || loading) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
        <div className="h-8 w-48 animate-pulse bg-secondary" />
      </section>
    );
  }

  if (!isAuthenticated) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-16 lg:px-8 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Mis Pedidos</h1>
        <p className="mt-4 text-muted-foreground">
          Inicia sesión para ver tus pedidos.
        </p>
        <Link href="/login">
          <Button className="mt-6">Iniciar Sesión</Button>
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
      <h1 className="text-2xl font-semibold tracking-tight">Mis Pedidos</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {orders.length} {orders.length === 1 ? "pedido en proceso" : "pedidos en proceso"}
      </p>

      <Separator className="mt-6" />

      {orders.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-muted-foreground">No tienes pedidos en proceso.</p>
          <Link href="/collection">
            <Button variant="outline" className="mt-6">
              Ver Colección
            </Button>
          </Link>
        </div>
      ) : (
        <div className="divide-y">
          {orders.map((order) => (
            <div key={order.id} className="flex items-center justify-between py-6">
              <div>
                <p className="text-sm font-medium">{order.numero_pedido}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {new Date(order.created_at).toLocaleDateString("es-MX", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="mt-1 text-xs">
                  {order.items_count} {order.items_count === 1 ? "artículo" : "artículos"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">
                  ${Number(order.total).toLocaleString()}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {ESTADO_LABELS[order.estado] ?? order.estado}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
