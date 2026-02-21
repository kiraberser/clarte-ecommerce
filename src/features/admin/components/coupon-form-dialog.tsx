"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Switch } from "@/shared/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import type { AdminCoupon } from "@/shared/types/api";

interface CouponFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coupon?: AdminCoupon | null;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
}

export function CouponFormDialog({
  open,
  onOpenChange,
  coupon,
  onSubmit,
}: CouponFormDialogProps) {
  const isEditing = !!coupon;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    codigo: "",
    nombre: "",
    tipo_descuento: "porcentaje" as "porcentaje" | "monto_fijo",
    valor_descuento: "",
    minimo_compra: "0",
    maximo_usos: "",
    fecha_inicio: "",
    fecha_fin: "",
    activo: true,
  });

  useEffect(() => {
    if (coupon) {
      setForm({
        codigo: coupon.codigo,
        nombre: coupon.nombre,
        tipo_descuento: coupon.tipo_descuento,
        valor_descuento: coupon.valor_descuento,
        minimo_compra: coupon.minimo_compra,
        maximo_usos: coupon.maximo_usos != null ? String(coupon.maximo_usos) : "",
        fecha_inicio: coupon.fecha_inicio
          ? coupon.fecha_inicio.slice(0, 16)
          : "",
        fecha_fin: coupon.fecha_fin ? coupon.fecha_fin.slice(0, 16) : "",
        activo: coupon.activo,
      });
    } else {
      setForm({
        codigo: "",
        nombre: "",
        tipo_descuento: "porcentaje",
        valor_descuento: "",
        minimo_compra: "0",
        maximo_usos: "",
        fecha_inicio: "",
        fecha_fin: "",
        activo: true,
      });
    }
  }, [coupon, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({
        codigo: form.codigo,
        nombre: form.nombre,
        tipo_descuento: form.tipo_descuento,
        valor_descuento: form.valor_descuento,
        minimo_compra: form.minimo_compra || "0",
        maximo_usos: form.maximo_usos !== "" ? Number(form.maximo_usos) : null,
        fecha_inicio: form.fecha_inicio || null,
        fecha_fin: form.fecha_fin || null,
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
            {isEditing ? "Editar cupón" : "Nuevo cupón"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cup-codigo">Código</Label>
              <Input
                id="cup-codigo"
                value={form.codigo}
                onChange={(e) =>
                  setForm({ ...form, codigo: e.target.value.toUpperCase() })
                }
                required
                className="border-[hsl(0_0%_16%)] bg-[hsl(0_0%_12%)] font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cup-nombre">Nombre</Label>
              <Input
                id="cup-nombre"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                required
                className="border-[hsl(0_0%_16%)] bg-[hsl(0_0%_12%)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tipo de descuento</Label>
              <Select
                value={form.tipo_descuento}
                onValueChange={(v) =>
                  setForm({
                    ...form,
                    tipo_descuento: v as "porcentaje" | "monto_fijo",
                  })
                }
              >
                <SelectTrigger className="border-[hsl(0_0%_16%)] bg-[hsl(0_0%_12%)]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-[hsl(0_0%_16%)] bg-[hsl(0_0%_12%)]">
                  <SelectItem value="porcentaje">% Porcentaje</SelectItem>
                  <SelectItem value="monto_fijo">$ Monto Fijo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cup-valor">
                Valor{" "}
                <span className="text-[hsl(0_0%_40%)]">
                  ({form.tipo_descuento === "porcentaje" ? "%" : "$"})
                </span>
              </Label>
              <Input
                id="cup-valor"
                type="number"
                step="0.01"
                min="0"
                value={form.valor_descuento}
                onChange={(e) =>
                  setForm({ ...form, valor_descuento: e.target.value })
                }
                required
                className="border-[hsl(0_0%_16%)] bg-[hsl(0_0%_12%)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cup-minimo">Mínimo de compra ($)</Label>
              <Input
                id="cup-minimo"
                type="number"
                step="0.01"
                min="0"
                value={form.minimo_compra}
                onChange={(e) =>
                  setForm({ ...form, minimo_compra: e.target.value })
                }
                className="border-[hsl(0_0%_16%)] bg-[hsl(0_0%_12%)]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cup-usos">Máx. usos</Label>
              <Input
                id="cup-usos"
                type="number"
                min="1"
                placeholder="Ilimitado"
                value={form.maximo_usos}
                onChange={(e) =>
                  setForm({ ...form, maximo_usos: e.target.value })
                }
                className="border-[hsl(0_0%_16%)] bg-[hsl(0_0%_12%)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cup-inicio">Fecha inicio</Label>
              <Input
                id="cup-inicio"
                type="datetime-local"
                value={form.fecha_inicio}
                onChange={(e) =>
                  setForm({ ...form, fecha_inicio: e.target.value })
                }
                className="border-[hsl(0_0%_16%)] bg-[hsl(0_0%_12%)]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cup-fin">Fecha fin</Label>
              <Input
                id="cup-fin"
                type="datetime-local"
                value={form.fecha_fin}
                onChange={(e) =>
                  setForm({ ...form, fecha_fin: e.target.value })
                }
                className="border-[hsl(0_0%_16%)] bg-[hsl(0_0%_12%)]"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              checked={form.activo}
              onCheckedChange={(v) => setForm({ ...form, activo: v })}
            />
            <Label>Activo</Label>
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
