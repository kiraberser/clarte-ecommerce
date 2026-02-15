"use client";

import useSWR from "swr";
import { DollarSign, Hash, Crown, ShoppingCart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { MetricCard } from "@/features/admin/components/metric-card";
import { SalesChart } from "@/features/admin/components/sales-chart";
import { StatusBadge } from "@/features/admin/components/status-badge";
import { swrFetcher } from "@/shared/lib/api";
import type { ApiResponse, SalesSummary, PaginatedData, AdminOrderListItem } from "@/shared/types/api";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(value);
}

export default function AdminDashboardPage() {
  const { data: summaryRes, isLoading: summaryLoading } = useSWR<ApiResponse<SalesSummary>>(
    "/ventas/resumen/",
    swrFetcher,
  );
  const { data: ordersRes, isLoading: ordersLoading } = useSWR<ApiResponse<PaginatedData<AdminOrderListItem>>>(
    "/pedidos/admin/?page_size=5",
    swrFetcher,
  );
  const { data: pendingRes } = useSWR<ApiResponse<PaginatedData<AdminOrderListItem>>>(
    "/pedidos/admin/?estado=pendiente&page_size=1",
    swrFetcher,
  );

  const summary = summaryRes?.data;
  const recentOrders = ordersRes?.data?.results ?? [];
  const pendingCount = pendingRes?.data?.count ?? 0;

  const dailyData = (summary?.ventas_por_dia ?? []).map((d) => ({
    time: d.dia,
    value: d.total,
  }));

  const monthlyData = (summary?.ventas_por_mes ?? []).map((m) => ({
    time: m.mes,
    value: m.total,
  }));

  return (
    <div className="space-y-6">
      {/* Metrics */}
      {summaryLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="border-[hsl(0_0%_16%)] bg-[hsl(0_0%_9%)]">
              <CardContent className="p-5">
                <Skeleton className="h-4 w-20 bg-[hsl(0_0%_14%)]" />
                <Skeleton className="mt-2 h-7 w-32 bg-[hsl(0_0%_14%)]" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            label="Ingresos totales"
            value={formatCurrency(summary?.total_ventas ?? 0)}
            icon={DollarSign}
          />
          <MetricCard
            label="Total ventas"
            value={String(summary?.cantidad_ventas ?? 0)}
            icon={Hash}
          />
          <MetricCard
            label="Más vendido"
            value={summary?.producto_mas_vendido?.nombre_producto ?? "—"}
            icon={Crown}
          />
          <MetricCard
            label="Pedidos pendientes"
            value={String(pendingCount)}
            icon={ShoppingCart}
          />
        </div>
      )}

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-[hsl(0_0%_16%)] bg-[hsl(0_0%_9%)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[hsl(0_0%_55%)]">
              Ventas diarias (últimos 30 días)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {summaryLoading ? (
              <Skeleton className="h-[300px] w-full bg-[hsl(0_0%_14%)]" />
            ) : (
              <SalesChart data={dailyData} type="area" height={300} />
            )}
          </CardContent>
        </Card>

        <Card className="border-[hsl(0_0%_16%)] bg-[hsl(0_0%_9%)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[hsl(0_0%_55%)]">
              Ventas mensuales
            </CardTitle>
          </CardHeader>
          <CardContent>
            {summaryLoading ? (
              <Skeleton className="h-[300px] w-full bg-[hsl(0_0%_14%)]" />
            ) : (
              <SalesChart data={monthlyData} type="histogram" height={300} />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent orders */}
      <Card className="border-[hsl(0_0%_16%)] bg-[hsl(0_0%_9%)]">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-[hsl(0_0%_55%)]">
            Últimos pedidos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {ordersLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full bg-[hsl(0_0%_14%)]" />
              ))}
            </div>
          ) : recentOrders.length === 0 ? (
            <p className="text-sm text-[hsl(0_0%_40%)]">Sin pedidos recientes</p>
          ) : (
            <div className="space-y-2">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between rounded-sm border border-[hsl(0_0%_16%)] px-4 py-2.5"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-sm text-[hsl(0_0%_85%)]">
                      {order.numero_pedido}
                    </span>
                    <span className="text-xs text-[hsl(0_0%_55%)]">
                      {order.usuario_email}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <StatusBadge status={order.estado} />
                    <span className="font-mono text-sm">
                      {formatCurrency(order.total)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
