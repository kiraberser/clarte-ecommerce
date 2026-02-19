"use client";

import { useState, useCallback } from "react";
import useSWR from "swr";
import { toast } from "sonner";
import { swrFetcher } from "@/shared/lib/api";
import {
  AdminDataTable,
  type Column,
} from "@/features/admin/components/admin-data-table";
import { AdminToolbar } from "@/features/admin/components/admin-toolbar";
import { updateAdminUser } from "@/shared/lib/services/admin";
import { Switch } from "@/shared/components/ui/switch";
import type { ApiResponse, PaginatedData, AdminUser } from "@/shared/types/api";

export default function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const params = new URLSearchParams();
  params.set("page", String(page));
  if (search) params.set("search", search);

  const { data, isLoading, mutate } = useSWR<ApiResponse<PaginatedData<AdminUser>>>(
    `/usuarios/admin/?${params.toString()}`,
    swrFetcher,
  );

  const users = data?.data?.results ?? [];
  const totalPages = data?.data?.total_pages ?? 1;

  const handleSearch = useCallback((q: string) => {
    setSearch(q);
    setPage(1);
  }, []);

  const handleToggleActive = async (user: AdminUser) => {
    try {
      await updateAdminUser(user.id, { is_active: !user.is_active });
      mutate();
      toast.success(
        `${user.email} ${!user.is_active ? "activado" : "desactivado"}`,
      );
    } catch {
      toast.error("Error al actualizar el usuario.");
    }
  };

  const columns: Column<AdminUser>[] = [
    {
      header: "Email",
      accessor: "email",
      render: (row) => (
        <div>
          <p className="font-medium">{row.email}</p>
          <p className="text-xs text-[hsl(0_0%_45%)]">@{row.username}</p>
        </div>
      ),
    },
    {
      header: "Nombre",
      accessor: "first_name",
      render: (row) =>
        `${row.first_name} ${row.last_name}`.trim() || "—",
    },
    { header: "Teléfono", accessor: "telefono", render: (row) => row.telefono || "—" },
    {
      header: "Staff",
      accessor: "is_staff",
      className: "w-16 text-center",
      render: (row) =>
        row.is_staff ? (
          <span className="text-xs text-yellow-400">Admin</span>
        ) : (
          <span className="text-xs text-[hsl(0_0%_40%)]">—</span>
        ),
    },
    {
      header: "Activo",
      accessor: "is_active",
      className: "w-20",
      render: (row) => (
        <Switch
          checked={row.is_active}
          onCheckedChange={() => handleToggleActive(row)}
          aria-label={`Activar/desactivar ${row.email}`}
        />
      ),
    },
    {
      header: "Registro",
      accessor: "date_joined",
      render: (row) =>
        new Date(row.date_joined).toLocaleDateString("es-MX"),
    },
  ];

  return (
    <div className="space-y-4">
      <AdminToolbar
        searchPlaceholder="Buscar por email, nombre o usuario..."
        onSearch={handleSearch}
      />

      <AdminDataTable
        columns={columns}
        data={users}
        isLoading={isLoading}
        pagination={{ page, totalPages, onPageChange: setPage }}
      />
    </div>
  );
}
