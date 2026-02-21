"use client";

import { useState } from "react";
import useSWR from "swr";
import { Plus } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Switch } from "@/shared/components/ui/switch";
import { Badge } from "@/shared/components/ui/badge";
import {
  AdminDataTable,
  type Column,
} from "@/features/admin/components/admin-data-table";
import { CouponFormDialog } from "@/features/admin/components/coupon-form-dialog";
import { ConfirmDialog } from "@/features/admin/components/confirm-dialog";
import {
  getAdminCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} from "@/shared/lib/services/admin";
import type { ApiResponse, AdminCoupon } from "@/shared/types/api";

export default function AdminDescuentosPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<AdminCoupon | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminCoupon | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { data, isLoading, mutate } = useSWR<ApiResponse<AdminCoupon[]>>(
    "/descuentos/admin/",
    () => getAdminCoupons(),
  );

  const coupons = data?.data ?? [];

  const handleCreate = async (formData: Record<string, unknown>) => {
    await createCoupon(formData);
    mutate();
  };

  const handleEdit = async (formData: Record<string, unknown>) => {
    if (!editingCoupon) return;
    await updateCoupon(editingCoupon.id, formData);
    mutate();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await deleteCoupon(deleteTarget.id);
      mutate();
      setDeleteTarget(null);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleToggleActive = async (coupon: AdminCoupon) => {
    await updateCoupon(coupon.id, { activo: !coupon.activo });
    mutate();
  };

  const columns: Column<AdminCoupon>[] = [
    {
      header: "Código",
      accessor: "codigo",
      className: "font-mono text-xs",
    },
    { header: "Nombre", accessor: "nombre" },
    {
      header: "Tipo",
      accessor: "tipo_descuento",
      render: (row) => (
        <Badge
          variant="outline"
          className="border-[hsl(0_0%_25%)] text-[hsl(0_0%_70%)]"
        >
          {row.tipo_descuento === "porcentaje" ? "% Porcentaje" : "$ Monto Fijo"}
        </Badge>
      ),
    },
    {
      header: "Valor",
      accessor: "valor_descuento",
      render: (row) =>
        row.tipo_descuento === "porcentaje"
          ? `${row.valor_descuento}%`
          : `$${row.valor_descuento}`,
    },
    {
      header: "Mín. Compra",
      accessor: "minimo_compra",
      render: (row) => `$${row.minimo_compra}`,
    },
    {
      header: "Usos",
      accessor: "usos_actuales",
      render: (row) =>
        `${row.usos_actuales} / ${row.maximo_usos != null ? row.maximo_usos : "∞"}`,
    },
    {
      header: "Activo",
      accessor: "activo",
      render: (row) => (
        <Switch
          checked={row.activo}
          onCheckedChange={() => handleToggleActive(row)}
          onClick={(e) => e.stopPropagation()}
        />
      ),
    },
    {
      header: "Acciones",
      accessor: "id",
      render: (row) => (
        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setEditingCoupon(row);
              setFormOpen(true);
            }}
            className="h-7 border-[hsl(0_0%_16%)] bg-transparent text-xs text-[hsl(0_0%_55%)] hover:bg-[hsl(0_0%_14%)] hover:text-[hsl(0_0%_93%)]"
          >
            Editar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDeleteTarget(row)}
            className="h-7 border-red-900/50 bg-transparent text-xs text-red-400 hover:bg-red-950 hover:text-red-300"
          >
            Eliminar
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div />
        <Button
          onClick={() => {
            setEditingCoupon(null);
            setFormOpen(true);
          }}
          size="sm"
        >
          <Plus className="mr-1 h-4 w-4" />
          Nuevo cupón
        </Button>
      </div>

      <AdminDataTable
        columns={columns}
        data={coupons}
        isLoading={isLoading}
      />

      <CouponFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        coupon={editingCoupon}
        onSubmit={editingCoupon ? handleEdit : handleCreate}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Eliminar cupón"
        description={`¿Eliminar el cupón "${deleteTarget?.codigo}"? Esta acción no se puede deshacer.`}
        onConfirm={handleDelete}
        loading={deleteLoading}
        variant="destructive"
      />
    </div>
  );
}
