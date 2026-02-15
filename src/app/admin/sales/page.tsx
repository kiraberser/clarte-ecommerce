"use client";

import { useState, useCallback } from "react";
import useSWR from "swr";
import { swrFetcher } from "@/shared/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import {
  AdminDataTable,
  type Column,
} from "@/features/admin/components/admin-data-table";
import { AdminToolbar } from "@/features/admin/components/admin-toolbar";
import { getAdminSale } from "@/shared/lib/services/admin";
import type {
  ApiResponse,
  PaginatedData,
  Sale,
  SaleDetail,
} from "@/shared/types/api";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(value);
}

export default function AdminSalesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [detail, setDetail] = useState<SaleDetail | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const params = new URLSearchParams();
  params.set("page", String(page));
  if (search) params.set("search", search);

  const { data, isLoading } = useSWR<ApiResponse<PaginatedData<Sale>>>(
    `/ventas/?${params.toString()}`,
    swrFetcher,
  );

  const sales = data?.data?.results ?? [];
  const totalPages = data?.data?.total_pages ?? 1;

  const handleSearch = useCallback((q: string) => {
    setSearch(q);
    setPage(1);
  }, []);

  const handleRowClick = async (row: Sale) => {
    const res = await getAdminSale(row.id);
    setDetail(res.data);
    setDetailOpen(true);
  };

  const columns: Column<Sale>[] = [
    {
      header: "Pedido",
      accessor: "numero_pedido",
      className: "font-mono text-xs",
    },
    { header: "Email", accessor: "usuario_email" },
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
      accessor: "fecha_venta",
      render: (row) =>
        new Date(row.fecha_venta).toLocaleDateString("es-MX"),
    },
  ];

  return (
    <div className="space-y-4">
      <AdminToolbar
        searchPlaceholder="Buscar por pedido o email..."
        onSearch={handleSearch}
      />

      <AdminDataTable
        columns={columns}
        data={sales}
        isLoading={isLoading}
        onRowClick={handleRowClick}
        pagination={{ page, totalPages, onPageChange: setPage }}
      />

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto border-[hsl(0_0%_16%)] bg-[hsl(0_0%_9%)] text-[hsl(0_0%_93%)] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              Venta — {detail?.numero_pedido}
            </DialogTitle>
          </DialogHeader>
          {detail && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-[hsl(0_0%_55%)]">Email</p>
                  <p>{detail.usuario_email}</p>
                </div>
                <div>
                  <p className="text-xs text-[hsl(0_0%_55%)]">Total</p>
                  <p className="font-mono">{formatCurrency(detail.total)}</p>
                </div>
                <div>
                  <p className="text-xs text-[hsl(0_0%_55%)]">Fecha</p>
                  <p>
                    {new Date(detail.fecha_venta).toLocaleDateString("es-MX")}
                  </p>
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-[hsl(0_0%_55%)]">
                  Items
                </p>
                <div className="space-y-2">
                  {detail.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-sm border border-[hsl(0_0%_16%)] px-3 py-2 text-sm"
                    >
                      <div>
                        <p>{item.nombre_producto}</p>
                        <p className="text-xs text-[hsl(0_0%_55%)]">
                          SKU: {item.sku} &middot; x{item.cantidad}
                        </p>
                      </div>
                      <span className="font-mono">
                        {formatCurrency(item.subtotal)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  variant="outline"
                  onClick={() => setDetailOpen(false)}
                  className="border-[hsl(0_0%_16%)] bg-transparent text-[hsl(0_0%_93%)] hover:bg-[hsl(0_0%_14%)]"
                >
                  Cerrar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
