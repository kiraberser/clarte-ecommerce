"use client";

import { useState, useCallback } from "react";
import useSWR from "swr";
import { Plus } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Switch } from "@/shared/components/ui/switch";
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
import { ProductFormDialog } from "@/features/admin/components/product-form-dialog";
import { ConfirmDialog } from "@/features/admin/components/confirm-dialog";
import {
  getAdminCategories,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/shared/lib/services/admin";
import type {
  ApiResponse,
  PaginatedData,
  AdminProduct,
  AdminCategory,
} from "@/shared/types/api";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(value);
}

export default function AdminProductsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminProduct | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const params = new URLSearchParams();
  params.set("page", String(page));
  if (search) params.set("search", search);
  if (catFilter) params.set("categoria", catFilter);

  const { data, isLoading, mutate } = useSWR<ApiResponse<PaginatedData<AdminProduct>>>(
    `/productos/admin/productos/?${params.toString()}`,
    swrFetcher,
  );

  const { data: catsRes } = useSWR<ApiResponse<AdminCategory[]>>(
    "/productos/admin/categorias/",
    () => getAdminCategories(),
  );

  const categories = catsRes?.data ?? [];
  const products = data?.data?.results ?? [];
  const totalPages = data?.data?.total_pages ?? 1;

  const handleSearch = useCallback((q: string) => {
    setSearch(q);
    setPage(1);
  }, []);

  const handleCreate = async (formData: Record<string, unknown>) => {
    await createProduct(formData);
    mutate();
  };

  const handleEdit = async (formData: Record<string, unknown>) => {
    if (!editingProduct) return;
    await updateProduct(editingProduct.id, formData);
    mutate();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await deleteProduct(deleteTarget.id);
      mutate();
      setDeleteTarget(null);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleToggleActive = async (product: AdminProduct) => {
    await updateProduct(product.id, { activo: !product.activo } as Partial<AdminProduct>);
    mutate();
  };

  const columns: Column<AdminProduct>[] = [
    {
      header: "Imagen",
      accessor: "imagen_principal",
      className: "w-14",
      render: (row) => (
        <div className="h-10 w-10 overflow-hidden rounded-sm border border-[hsl(0_0%_16%)] bg-[hsl(0_0%_12%)]">
          {row.imagen_principal ? (
            <img
              src={row.imagen_principal}
              alt={row.nombre}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-[hsl(0_0%_40%)]">
              —
            </div>
          )}
        </div>
      ),
    },
    { header: "Nombre", accessor: "nombre" },
    { header: "SKU", accessor: "sku", className: "font-mono text-xs" },
    {
      header: "Precio",
      accessor: "precio_final",
      render: (row) => formatCurrency(row.precio_final),
    },
    { header: "Stock", accessor: "stock" },
    { header: "Categoría", accessor: "categoria_nombre" },
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
              setEditingProduct(row);
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
      <AdminToolbar
        searchPlaceholder="Buscar por nombre o SKU..."
        onSearch={handleSearch}
        action={
          <Button
            onClick={() => {
              setEditingProduct(null);
              setFormOpen(true);
            }}
            size="sm"
          >
            <Plus className="mr-1 h-4 w-4" />
            Nuevo producto
          </Button>
        }
      >
        <Select
          value={catFilter}
          onValueChange={(v) => {
            setCatFilter(v === "all" ? "" : v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-40 border-[hsl(0_0%_16%)] bg-[hsl(0_0%_9%)]">
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent className="border-[hsl(0_0%_16%)] bg-[hsl(0_0%_9%)]">
            <SelectItem value="all">Todas</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={String(cat.id)}>
                {cat.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </AdminToolbar>

      <AdminDataTable
        columns={columns}
        data={products}
        isLoading={isLoading}
        pagination={{ page, totalPages, onPageChange: setPage }}
      />

      <ProductFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        product={editingProduct}
        categories={categories}
        onSubmit={editingProduct ? handleEdit : handleCreate}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Eliminar producto"
        description={`¿Eliminar "${deleteTarget?.nombre}"? Esta acción no se puede deshacer.`}
        onConfirm={handleDelete}
        loading={deleteLoading}
        variant="destructive"
      />
    </div>
  );
}
