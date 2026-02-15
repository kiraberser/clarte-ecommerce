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
import type { ApiResponse, PaginatedData, NewsletterAdmin } from "@/shared/types/api";

export default function AdminNewsletterPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("");

  const params = new URLSearchParams();
  params.set("page", String(page));
  if (search) params.set("search", search);
  if (activeFilter) params.set("activo", activeFilter);

  const { data, isLoading } = useSWR<ApiResponse<PaginatedData<NewsletterAdmin>>>(
    `/contacto/admin/newsletter/?${params.toString()}`,
    swrFetcher,
  );

  const subscriptions = data?.data?.results ?? [];
  const totalPages = data?.data?.total_pages ?? 1;

  const handleSearch = useCallback((q: string) => {
    setSearch(q);
    setPage(1);
  }, []);

  const columns: Column<NewsletterAdmin>[] = [
    { header: "Email", accessor: "email" },
    {
      header: "Estado",
      accessor: "activo",
      render: (row) => (
        <span
          className={`inline-flex items-center rounded-sm border px-2 py-0.5 text-xs ${
            row.activo
              ? "border-green-500/40 text-green-400"
              : "border-red-500/40 text-red-400"
          }`}
        >
          {row.activo ? "Activo" : "Inactivo"}
        </span>
      ),
    },
    {
      header: "Fecha suscripción",
      accessor: "created_at",
      render: (row) =>
        new Date(row.created_at).toLocaleDateString("es-MX"),
    },
  ];

  return (
    <div className="space-y-4">
      <AdminToolbar
        searchPlaceholder="Buscar por email..."
        onSearch={handleSearch}
      >
        <Select
          value={activeFilter || "all"}
          onValueChange={(v) => {
            setActiveFilter(v === "all" ? "" : v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-36 border-[hsl(0_0%_16%)] bg-[hsl(0_0%_9%)]">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent className="border-[hsl(0_0%_16%)] bg-[hsl(0_0%_9%)]">
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="true">Activos</SelectItem>
            <SelectItem value="false">Inactivos</SelectItem>
          </SelectContent>
        </Select>
      </AdminToolbar>

      <AdminDataTable
        columns={columns}
        data={subscriptions}
        isLoading={isLoading}
        pagination={{ page, totalPages, onPageChange: setPage }}
      />
    </div>
  );
}
