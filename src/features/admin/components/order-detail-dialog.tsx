"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { StatusBadge } from "@/features/admin/components/status-badge";
import type { AdminOrder } from "@/shared/types/api";

const VALID_TRANSITIONS: Record<string, string[]> = {
  pendiente: ["pagado", "cancelado"],
  pagado: ["enviado", "cancelado"],
  enviado: ["entregado"],
  entregado: [],
  cancelado: [],
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(value);
}

interface OrderDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: AdminOrder | null;
  onStatusChange: (numeroPedido: string, estado: string) => Promise<void>;
}

export function OrderDetailDialog({
  open,
  onOpenChange,
  order,
  onStatusChange,
}: OrderDetailDialogProps) {
  const [loading, setLoading] = useState(false);

  if (!order) return null;

  const transitions = VALID_TRANSITIONS[order.estado] ?? [];

  const handleStatusChange = async (estado: string) => {
    setLoading(true);
    try {
      await onStatusChange(order.numero_pedido, estado);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-[hsl(0_0%_16%)] bg-[hsl(0_0%_9%)] text-[hsl(0_0%_93%)] sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            Pedido {order.numero_pedido}
            <StatusBadge status={order.estado} />
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Cliente */}
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-[hsl(0_0%_55%)]">
              Cliente
            </p>
            <div className="grid grid-cols-2 gap-3 rounded-sm border border-[hsl(0_0%_16%)] px-3 py-3 text-sm">
              <div>
                <p className="text-xs text-[hsl(0_0%_55%)]">Nombre</p>
                <p>{order.usuario_nombre}</p>
              </div>
              <div>
                <p className="text-xs text-[hsl(0_0%_55%)]">Email</p>
                <p>{order.usuario_email}</p>
              </div>
              <div>
                <p className="text-xs text-[hsl(0_0%_55%)]">Teléfono</p>
                <p>{order.usuario_telefono || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-[hsl(0_0%_55%)]">Método de pago</p>
                <p>{order.metodo_pago || "—"}</p>
              </div>
            </div>
          </div>

          {/* Envío */}
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-[hsl(0_0%_55%)]">
              Dirección de envío
            </p>
            <div className="rounded-sm border border-[hsl(0_0%_16%)] px-3 py-3 text-sm space-y-1">
              <p>{order.direccion_envio}</p>
              <p className="text-[hsl(0_0%_70%)]">
                {order.ciudad}, {order.estado_envio} C.P. {order.codigo_postal}
              </p>
            </div>
          </div>

          {/* Totales */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-[hsl(0_0%_55%)]">Subtotal</p>
              <p className="font-mono">{formatCurrency(order.subtotal)}</p>
            </div>
            <div>
              <p className="text-xs text-[hsl(0_0%_55%)]">Total</p>
              <p className="font-mono font-medium">{formatCurrency(order.total)}</p>
            </div>
            {order.notas && (
              <div className="col-span-2">
                <p className="text-xs text-[hsl(0_0%_55%)]">Notas</p>
                <p>{order.notas}</p>
              </div>
            )}
          </div>

          {/* Items */}
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-[hsl(0_0%_55%)]">
              Items
            </p>
            <div className="space-y-2">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-sm border border-[hsl(0_0%_16%)] px-3 py-2"
                >
                  <div className="flex items-center gap-3">
                    {item.producto_imagen && (
                      <img
                        src={item.producto_imagen}
                        alt={item.producto_nombre}
                        className="h-8 w-8 rounded-sm object-cover"
                      />
                    )}
                    <div>
                      <p className="text-sm">{item.producto_nombre}</p>
                      <p className="text-xs text-[hsl(0_0%_55%)]">
                        x{item.cantidad}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-sm">
                    {formatCurrency(item.subtotal)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Change status */}
          {transitions.length > 0 && (
            <div className="flex items-center gap-3 border-t border-[hsl(0_0%_16%)] pt-4">
              <span className="text-sm text-[hsl(0_0%_55%)]">
                Cambiar estado:
              </span>
              <Select onValueChange={handleStatusChange} disabled={loading}>
                <SelectTrigger className="w-40 border-[hsl(0_0%_16%)] bg-[hsl(0_0%_12%)]">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent className="border-[hsl(0_0%_16%)] bg-[hsl(0_0%_9%)]">
                  {transitions.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {loading && (
                <span className="text-xs text-[hsl(0_0%_55%)]">
                  Actualizando...
                </span>
              )}
            </div>
          )}

          <div className="flex justify-end pt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-[hsl(0_0%_16%)] bg-transparent text-[hsl(0_0%_93%)] hover:bg-[hsl(0_0%_14%)]"
            >
              Cerrar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
