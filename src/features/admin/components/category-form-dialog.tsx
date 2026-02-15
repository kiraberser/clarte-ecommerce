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
import { Upload, X, Loader2 } from "lucide-react";
import { uploadImage } from "@/shared/lib/services/admin";
import type { AdminCategory } from "@/shared/types/api";

interface CategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: AdminCategory | null;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
}

export function CategoryFormDialog({
  open,
  onOpenChange,
  category,
  onSubmit,
}: CategoryFormDialogProps) {
  const isEditing = !!category;
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    orden: "0",
    activo: true,
  });

  useEffect(() => {
    if (category) {
      setForm({
        nombre: category.nombre,
        descripcion: category.descripcion,
        orden: String(category.orden),
        activo: category.activo,
      });
      setImageUrl(category.imagen || null);
    } else {
      setForm({
        nombre: "",
        descripcion: "",
        orden: "0",
        activo: true,
      });
      setImageUrl(null);
    }
  }, [category, open]);

  const handleUpload = useCallback(async (file: File) => {
    setUploading(true);
    try {
      const result = await uploadImage(file);
      setImageUrl(result.url);
    } catch {
      alert("Error al subir la imagen.");
    } finally {
      setUploading(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleUpload(file);
    },
    [handleUpload],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({
        nombre: form.nombre,
        descripcion: form.descripcion,
        imagen: imageUrl || "",
        orden: Number(form.orden),
        activo: form.activo,
      });
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-[hsl(0_0%_16%)] bg-[hsl(0_0%_9%)] text-[hsl(0_0%_93%)] sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar categoría" : "Nueva categoría"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cat-nombre">Nombre</Label>
            <Input
              id="cat-nombre"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              required
              className="border-[hsl(0_0%_16%)] bg-[hsl(0_0%_12%)]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cat-descripcion">Descripción</Label>
            <Textarea
              id="cat-descripcion"
              value={form.descripcion}
              onChange={(e) =>
                setForm({ ...form, descripcion: e.target.value })
              }
              rows={3}
              className="border-[hsl(0_0%_16%)] bg-[hsl(0_0%_12%)]"
            />
          </div>

          {/* Imagen con drag and drop */}
          <div className="space-y-2">
            <Label>Imagen</Label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUpload(file);
                e.target.value = "";
              }}
            />
            {imageUrl ? (
              <div className="relative rounded-md border border-[hsl(0_0%_16%)] bg-[hsl(0_0%_12%)] p-2">
                <img
                  src={imageUrl}
                  alt="Categoría"
                  className="mx-auto max-h-32 rounded object-contain"
                />
                <button
                  type="button"
                  onClick={() => setImageUrl(null)}
                  className="absolute right-2 top-2 rounded-full bg-black/70 p-1 text-white hover:bg-black"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                disabled={uploading}
                className="flex w-full flex-col items-center gap-2 rounded-md border border-dashed border-[hsl(0_0%_25%)] bg-[hsl(0_0%_12%)] px-4 py-6 text-sm text-[hsl(0_0%_55%)] transition-colors hover:border-[hsl(0_0%_40%)] hover:text-[hsl(0_0%_70%)] disabled:opacity-50"
              >
                {uploading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <Upload className="h-6 w-6" />
                )}
                {uploading ? "Subiendo..." : "Click o arrastra una imagen"}
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cat-orden">Orden</Label>
              <Input
                id="cat-orden"
                type="number"
                value={form.orden}
                onChange={(e) => setForm({ ...form, orden: e.target.value })}
                className="border-[hsl(0_0%_16%)] bg-[hsl(0_0%_12%)]"
              />
            </div>
            <div className="flex items-end pb-1">
              <div className="flex items-center gap-2">
                <Switch
                  checked={form.activo}
                  onCheckedChange={(v) => setForm({ ...form, activo: v })}
                />
                <Label>Activo</Label>
              </div>
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
