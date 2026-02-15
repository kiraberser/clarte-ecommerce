"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Switch } from "@/shared/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Upload, X, Loader2 } from "lucide-react";
import { uploadImage } from "@/shared/lib/services/admin";
import type { AdminProduct, AdminCategory } from "@/shared/types/api";

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: AdminProduct | null;
  categories: AdminCategory[];
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
}

interface UploadedImage {
  name: string;
  url: string;
}

export function ProductFormDialog({
  open,
  onOpenChange,
  product,
  categories,
  onSubmit,
}: ProductFormDialogProps) {
  const isEditing = !!product;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    precio_oferta: "",
    sku: "",
    categoria: "",
    stock: "0",
    activo: true,
    destacado: false,
  });

  // Image state
  const [mainImage, setMainImage] = useState<UploadedImage | null>(null);
  const [additionalImages, setAdditionalImages] = useState<UploadedImage[]>([]);
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingAdditional, setUploadingAdditional] = useState(false);

  const mainInputRef = useRef<HTMLInputElement>(null);
  const additionalInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (product) {
      setForm({
        nombre: product.nombre,
        descripcion: product.descripcion,
        precio: String(product.precio),
        precio_oferta: product.precio_oferta ?? "",
        sku: product.sku,
        categoria: String(product.categoria),
        stock: String(product.stock),
        activo: product.activo,
        destacado: product.destacado,
      });
      if (product.imagen_principal) {
        setMainImage({
          name: product.imagen_principal,
          url: product.imagen_principal,
        });
      } else {
        setMainImage(null);
      }
      if (product.imagenes?.length) {
        setAdditionalImages(
          product.imagenes.map((url) => ({ name: url, url })),
        );
      } else {
        setAdditionalImages([]);
      }
    } else {
      setForm({
        nombre: "",
        descripcion: "",
        precio: "",
        precio_oferta: "",
        sku: "",
        categoria: "",
        stock: "0",
        activo: true,
        destacado: false,
      });
      setMainImage(null);
      setAdditionalImages([]);
    }
  }, [product, open]);

  const handleMainUpload = useCallback(async (file: File) => {
    setUploadingMain(true);
    try {
      const result = await uploadImage(file);
      setMainImage({ name: result.url, url: result.url });
    } catch {
      alert("Error al subir la imagen.");
    } finally {
      setUploadingMain(false);
    }
  }, []);

  const handleAdditionalUpload = useCallback(async (files: FileList) => {
    setUploadingAdditional(true);
    try {
      const uploads = await Promise.all(
        Array.from(files).map((f) => uploadImage(f)),
      );
      setAdditionalImages((prev) => [
        ...prev,
        ...uploads.map((r) => ({ name: r.url, url: r.url })),
      ]);
    } catch {
      alert("Error al subir las imágenes.");
    } finally {
      setUploadingAdditional(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, type: "main" | "additional") => {
      e.preventDefault();
      const files = e.dataTransfer.files;
      if (!files.length) return;
      if (type === "main") {
        handleMainUpload(files[0]);
      } else {
        handleAdditionalUpload(files);
      }
    },
    [handleMainUpload, handleAdditionalUpload],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload: Record<string, unknown> = {
        nombre: form.nombre,
        descripcion: form.descripcion,
        precio: form.precio,
        sku: form.sku,
        categoria: Number(form.categoria),
        stock: Number(form.stock),
        imagen_principal: mainImage?.name || "",
        activo: form.activo,
        destacado: form.destacado,
      };
      if (form.precio_oferta) {
        payload.precio_oferta = form.precio_oferta;
      }
      if (additionalImages.length) {
        payload.imagenes = additionalImages.map((img) => img.url);
      }
      await onSubmit(payload);
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-[hsl(0_0%_16%)] bg-[hsl(0_0%_9%)] text-[hsl(0_0%_93%)] sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar producto" : "Nuevo producto"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              id="nombre"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              required
              className="border-[hsl(0_0%_16%)] bg-[hsl(0_0%_12%)]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              value={form.descripcion}
              onChange={(e) =>
                setForm({ ...form, descripcion: e.target.value })
              }
              rows={3}
              className="border-[hsl(0_0%_16%)] bg-[hsl(0_0%_12%)]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="precio">Precio</Label>
              <Input
                id="precio"
                value={form.precio}
                onChange={(e) => setForm({ ...form, precio: e.target.value })}
                required
                className="border-[hsl(0_0%_16%)] bg-[hsl(0_0%_12%)]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="precio_oferta">Precio oferta</Label>
              <Input
                id="precio_oferta"
                value={form.precio_oferta}
                onChange={(e) =>
                  setForm({ ...form, precio_oferta: e.target.value })
                }
                placeholder="Opcional"
                className="border-[hsl(0_0%_16%)] bg-[hsl(0_0%_12%)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                value={form.sku}
                onChange={(e) => setForm({ ...form, sku: e.target.value })}
                required
                className="border-[hsl(0_0%_16%)] bg-[hsl(0_0%_12%)]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="border-[hsl(0_0%_16%)] bg-[hsl(0_0%_12%)]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Categoría</Label>
            <Select
              value={form.categoria}
              onValueChange={(v) => setForm({ ...form, categoria: v })}
            >
              <SelectTrigger className="border-[hsl(0_0%_16%)] bg-[hsl(0_0%_12%)]">
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent className="border-[hsl(0_0%_16%)] bg-[hsl(0_0%_9%)]">
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={String(cat.id)}>
                    {cat.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Imagen principal */}
          <div className="space-y-2">
            <Label>Imagen principal</Label>
            <input
              ref={mainInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleMainUpload(file);
                e.target.value = "";
              }}
            />
            {mainImage ? (
              <div className="relative rounded-md border border-[hsl(0_0%_16%)] bg-[hsl(0_0%_12%)] p-2">
                <img
                  src={mainImage.url}
                  alt="Principal"
                  className="mx-auto max-h-40 rounded object-contain"
                />
                <button
                  type="button"
                  onClick={() => setMainImage(null)}
                  className="absolute right-2 top-2 rounded-full bg-black/70 p-1 text-white hover:bg-black"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => mainInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, "main")}
                disabled={uploadingMain}
                className="flex w-full flex-col items-center gap-2 rounded-md border border-dashed border-[hsl(0_0%_25%)] bg-[hsl(0_0%_12%)] px-4 py-6 text-sm text-[hsl(0_0%_55%)] transition-colors hover:border-[hsl(0_0%_40%)] hover:text-[hsl(0_0%_70%)] disabled:opacity-50"
              >
                {uploadingMain ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <Upload className="h-6 w-6" />
                )}
                {uploadingMain
                  ? "Subiendo..."
                  : "Click o arrastra una imagen"}
              </button>
            )}
          </div>

          {/* Imágenes adicionales */}
          <div className="space-y-2">
            <Label>Imágenes adicionales</Label>
            <input
              ref={additionalInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                const files = e.target.files;
                if (files?.length) handleAdditionalUpload(files);
                e.target.value = "";
              }}
            />
            {additionalImages.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {additionalImages.map((img, i) => (
                  <div
                    key={i}
                    className="relative rounded-md border border-[hsl(0_0%_16%)] bg-[hsl(0_0%_12%)] p-1"
                  >
                    <img
                      src={img.url}
                      alt={`Adicional ${i + 1}`}
                      className="h-20 w-full rounded object-contain"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setAdditionalImages((prev) =>
                          prev.filter((_, idx) => idx !== i),
                        )
                      }
                      className="absolute right-1 top-1 rounded-full bg-black/70 p-0.5 text-white hover:bg-black"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <button
              type="button"
              onClick={() => additionalInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, "additional")}
              disabled={uploadingAdditional}
              className="flex w-full flex-col items-center gap-2 rounded-md border border-dashed border-[hsl(0_0%_25%)] bg-[hsl(0_0%_12%)] px-4 py-4 text-sm text-[hsl(0_0%_55%)] transition-colors hover:border-[hsl(0_0%_40%)] hover:text-[hsl(0_0%_70%)] disabled:opacity-50"
            >
              {uploadingAdditional ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Upload className="h-5 w-5" />
              )}
              {uploadingAdditional
                ? "Subiendo..."
                : "Click o arrastra imágenes"}
            </button>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Switch
                checked={form.activo}
                onCheckedChange={(v) => setForm({ ...form, activo: v })}
              />
              <Label>Activo</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={form.destacado}
                onCheckedChange={(v) => setForm({ ...form, destacado: v })}
              />
              <Label>Destacado</Label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-[hsl(0_0%_16%)] bg-transparent text-[hsl(0_0%_93%)] hover:bg-[hsl(0_0%_14%)]"
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : isEditing ? "Guardar" : "Crear"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
