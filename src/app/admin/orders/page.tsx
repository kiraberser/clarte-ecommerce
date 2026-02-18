"use client";

import { useState, useCallback } from "react";
import useSWR from "swr";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { swrFetcher } from "@/shared/lib/api";
import {
  AdminDataTable,
  type Column,
} from "@/features/admin/components/admin-data-table";
import { AdminToolbar } from "@/features/admin/components/admin-toolbar";
import { StatusBadge } from "@/features/admin/components/status-badge";
import { OrderDetailDialog } from "@/features/admin/components/order-detail-dialog";
import { getAdminOrder, updateOrderStatus } from "@/shared/lib/services/admin";
import type {
  ApiResponse,
  PaginatedData,
  AdminOrderListItem,
  AdminOrder,
} from "@/shared/types/api";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(value);
}

export default function AdminOrdersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [detailOrder, setDetailOrder] = useState<AdminOrder | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const params = new URLSearchParams();
  params.set("page", String(page));
  if (search) params.set("search", search);
  if (statusFilter) params.set("estado", statusFilter);

  const { data, isLoading, mutate } = useSWR<ApiResponse<PaginatedData<AdminOrderListItem>>>(
    `/pedidos/admin/?${params.toString()}`,
    swrFetcher,
  );

  const orders = data?.data?.results ?? [];
  const totalPages = data?.data?.total_pages ?? 1;

  const handleSearch = useCallback((q: string) => {
    setSearch(q);
    setPage(1);
  }, []);

  const handleRowClick = async (row: AdminOrderListItem) => {
    try {
      const res = await getAdminOrder(row.numero_pedido);
      setDetailOrder(res.data);
      setDetailOpen(true);
    } catch {
      // silently fail
    }
  };

  const handleStatusChange = async (numeroPedido: string, estado: string) => {
    try {
      const res = await updateOrderStatus(numeroPedido, estado);
      setDetailOrder(res.data);
      mutate();
    } catch {
      // silently fail
    }
  };

  const columns: Column<AdminOrderListItem>[] = [
    {
      header: "Pedido",
      accessor: "numero_pedido",
      className: "font-mono text-xs",
    },
    { header: "Email", accessor: "usuario_email" },
    {
      header: "Estado",
      accessor: "estado",
      render: (row) => <StatusBadge status={row.estado} />,
    },
    {
      header: "Total",
      accessor: "total",
      render: (row) => (
        <span className="font-mono">{formatCurrency(row.total)}</span>
      ),
    },
    {
      header: "Items",
      accessor: "items_count",
      className: "w-16 text-center",
    },
    {
      header: "Fecha",
      accessor: "created_at",
      render: (row) =>
        new Date(row.created_at).toLocaleDateString("es-MX"),
    },
  ];

  return (
    <div className="space-y-4">
      <AdminToolbar
        searchPlaceholder="Buscar por pedido o email..."
        onSearch={handleSearch}
      >
        <Select
          value={statusFilter || "all"}
          onValueChange={(v) => {
            setStatusFilter(v === "all" ? "" : v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-40 border-[hsl(0_0%_16%)] bg-[hsl(0_0%_9%)]">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent className="border-[hsl(0_0%_16%)] bg-[hsl(0_0%_9%)] text-white">
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="pendiente">Pendiente</SelectItem>
            <SelectItem value="pagado">Pagado</SelectItem>
            <SelectItem value="enviado">Enviado</SelectItem>
            <SelectItem value="entregado">Entregado</SelectItem>
            <SelectItem value="cancelado">Cancelado</SelectItem>
          </SelectContent>
        </Select>
      </AdminToolbar>

      <AdminDataTable
        columns={columns}
        data={orders}
        isLoading={isLoading}
        onRowClick={handleRowClick}
        pagination={{ page, totalPages, onPageChange: setPage }}
      />

      <OrderDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        order={detailOrder}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
