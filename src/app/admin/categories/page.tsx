"use client";

import { useState } from "react";
import useSWR from "swr";
import { Plus } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Switch } from "@/shared/components/ui/switch";
import {
  AdminDataTable,
  type Column,
} from "@/features/admin/components/admin-data-table";
import { CategoryFormDialog } from "@/features/admin/components/category-form-dialog";
import { ConfirmDialog } from "@/features/admin/components/confirm-dialog";
import {
  getAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/shared/lib/services/admin";
import type { ApiResponse, AdminCategory } from "@/shared/types/api";

export default function AdminCategoriesPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminCategory | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { data, isLoading, mutate } = useSWR<ApiResponse<AdminCategory[]>>(
    "/productos/admin/categorias/",
    () => getAdminCategories(),
  );

  const categories = data?.data ?? [];

  const handleCreate = async (formData: Record<string, unknown>) => {
    await createCategory(formData);
    mutate();
  };

  const handleEdit = async (formData: Record<string, unknown>) => {
    if (!editingCategory) return;
    await updateCategory(editingCategory.id, formData);
    mutate();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await deleteCategory(deleteTarget.id);
      mutate();
      setDeleteTarget(null);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleToggleActive = async (cat: AdminCategory) => {
    await updateCategory(cat.id, { activo: !cat.activo } as Partial<AdminCategory>);
    mutate();
  };

  const columns: Column<AdminCategory>[] = [
    { header: "Nombre", accessor: "nombre" },
    { header: "Slug", accessor: "slug", className: "font-mono text-xs" },
    { header: "Orden", accessor: "orden", className: "w-20 text-center" },
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
              setEditingCategory(row);
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
            setEditingCategory(null);
            setFormOpen(true);
          }}
          size="sm"
        >
          <Plus className="mr-1 h-4 w-4" />
          Nueva categoría
        </Button>
      </div>

      <AdminDataTable
        columns={columns}
        data={categories}
        isLoading={isLoading}
      />

      <CategoryFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        category={editingCategory}
        onSubmit={editingCategory ? handleEdit : handleCreate}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Eliminar categoría"
        description={`¿Eliminar "${deleteTarget?.nombre}"? Esta acción no se puede deshacer.`}
        onConfirm={handleDelete}
        loading={deleteLoading}
        variant="destructive"
      />
    </div>
  );
}
