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
import { PAYMENT_STATUS_LABELS } from "@/shared/lib/constants";
import type { ApiResponse, PaginatedData, AdminPayment } from "@/shared/types/api";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(value);
}

export default function AdminPaymentsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const params = new URLSearchParams();
  params.set("page", String(page));
  if (search) params.set("search", search);
  if (statusFilter) params.set("estado", statusFilter);

  const { data, isLoading } = useSWR<ApiResponse<PaginatedData<AdminPayment>>>(
    `/pagos/admin/?${params.toString()}`,
    swrFetcher,
  );

  const payments = data?.data?.results ?? [];
  const totalPages = data?.data?.total_pages ?? 1;

  const handleSearch = useCallback((q: string) => {
    setSearch(q);
    setPage(1);
  }, []);

  const columns: Column<AdminPayment>[] = [
    {
      header: "ID",
      accessor: "id",
      className: "w-16 font-mono text-xs",
    },
    {
      header: "Pedido",
      accessor: "numero_pedido",
      className: "font-mono text-xs",
      render: (row) => row.numero_pedido || "—",
    },
    { header: "Email", accessor: "usuario_email" },
    {
      header: "Estado",
      accessor: "estado",
      render: (row) => (
        <StatusBadge status={row.estado} />
      ),
    },
    {
      header: "Método",
      accessor: "metodo",
      render: (row) => (
        <span className="font-mono text-xs uppercase">
          {row.metodo || "—"}
        </span>
      ),
    },
    {
      header: "Monto",
      accessor: "monto",
      render: (row) => (
        <span className="font-mono">{formatCurrency(Number(row.monto))}</span>
      ),
    },
    {
      header: "MP Payment ID",
      accessor: "mercadopago_payment_id",
      className: "font-mono text-xs",
      render: (row) => (
        <span className="text-[hsl(0_0%_45%)]">
          {row.mercadopago_payment_id
            ? `...${row.mercadopago_payment_id.slice(-8)}`
            : "—"}
        </span>
      ),
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
        searchPlaceholder="Buscar por email, pedido o MP ID..."
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
            {Object.entries(PAYMENT_STATUS_LABELS).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </AdminToolbar>

      <AdminDataTable
        columns={columns}
        data={payments}
        isLoading={isLoading}
        pagination={{ page, totalPages, onPageChange: setPage }}
      />
    </div>
  );
}
