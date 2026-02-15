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
import { ContactDetailDialog } from "@/features/admin/components/contact-detail-dialog";
import { markContactRead } from "@/shared/lib/services/admin";
import type { ApiResponse, PaginatedData, Contact } from "@/shared/types/api";

export default function AdminContactsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [readFilter, setReadFilter] = useState("");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const params = new URLSearchParams();
  params.set("page", String(page));
  if (search) params.set("search", search);
  if (readFilter) params.set("leido", readFilter);

  const { data, isLoading, mutate } = useSWR<ApiResponse<PaginatedData<Contact>>>(
    `/contacto/admin/?${params.toString()}`,
    swrFetcher,
  );

  const contacts = data?.data?.results ?? [];
  const totalPages = data?.data?.total_pages ?? 1;

  const handleSearch = useCallback((q: string) => {
    setSearch(q);
    setPage(1);
  }, []);

  const handleMarkRead = async (id: number) => {
    await markContactRead(id);
    mutate();
    setSelectedContact((prev) => (prev ? { ...prev, leido: true } : null));
  };

  const columns: Column<Contact>[] = [
    { header: "Nombre", accessor: "nombre" },
    { header: "Email", accessor: "email" },
    {
      header: "Asunto",
      accessor: "asunto",
      render: (row) => (
        <span className="truncate max-w-[200px] block">{row.asunto}</span>
      ),
    },
    {
      header: "Fecha",
      accessor: "created_at",
      render: (row) =>
        new Date(row.created_at).toLocaleDateString("es-MX"),
    },
    {
      header: "Estado",
      accessor: "leido",
      render: (row) => (
        <span
          className={`inline-flex items-center rounded-sm border px-2 py-0.5 text-xs ${
            row.leido
              ? "border-[hsl(0_0%_25%)] text-[hsl(0_0%_55%)]"
              : "border-white/40 text-white font-medium"
          }`}
        >
          {row.leido ? "Leído" : "Nuevo"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <AdminToolbar
        searchPlaceholder="Buscar por nombre o email..."
        onSearch={handleSearch}
      >
        <Select
          value={readFilter || "all"}
          onValueChange={(v) => {
            setReadFilter(v === "all" ? "" : v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-36 border-[hsl(0_0%_16%)] bg-[hsl(0_0%_9%)]">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent className="border-[hsl(0_0%_16%)] bg-[hsl(0_0%_9%)]">
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="false">No leídos</SelectItem>
            <SelectItem value="true">Leídos</SelectItem>
          </SelectContent>
        </Select>
      </AdminToolbar>

      <AdminDataTable
        columns={columns}
        data={contacts}
        isLoading={isLoading}
        onRowClick={(row) => {
          setSelectedContact(row);
          setDetailOpen(true);
        }}
        pagination={{ page, totalPages, onPageChange: setPage }}
      />

      <ContactDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        contact={selectedContact}
        onMarkRead={handleMarkRead}
      />
    </div>
  );
}
