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
import type { Contact, ContactEstado } from "@/shared/types/api";

interface ContactDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contact: Contact | null;
  onUpdateEstado: (id: number, estado: ContactEstado) => Promise<void>;
}

const ESTADO_OPTIONS: { value: ContactEstado; label: string }[] = [
  { value: "pendiente", label: "Pendiente" },
  { value: "leido", label: "Leído" },
  { value: "respondido", label: "Respondido" },
];

export function ContactDetailDialog({
  open,
  onOpenChange,
  contact,
  onUpdateEstado,
}: ContactDetailDialogProps) {
  const [saving, setSaving] = useState(false);

  if (!contact) return null;

  async function handleEstadoChange(estado: ContactEstado) {
    if (!contact || estado === contact.estado) return;
    setSaving(true);
    await onUpdateEstado(contact.id, estado).finally(() => setSaving(false));
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-[hsl(0_0%_16%)] bg-[hsl(0_0%_9%)] text-[hsl(0_0%_93%)] sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{contact.asunto}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-[hsl(0_0%_55%)]">Nombre</p>
              <p>{contact.nombre}</p>
            </div>
            <div>
              <p className="text-xs text-[hsl(0_0%_55%)]">Email</p>
              <p>{contact.email}</p>
            </div>
            {contact.telefono && (
              <div>
                <p className="text-xs text-[hsl(0_0%_55%)]">Teléfono</p>
                <p>{contact.telefono}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-[hsl(0_0%_55%)]">Fecha</p>
              <p>{new Date(contact.created_at).toLocaleDateString("es-MX")}</p>
            </div>
          </div>

          <div>
            <p className="mb-1 text-xs text-[hsl(0_0%_55%)]">Mensaje</p>
            <div className="rounded-sm border border-[hsl(0_0%_16%)] bg-[hsl(0_0%_7%)] p-3 text-sm leading-relaxed whitespace-pre-wrap">
              {contact.mensaje}
            </div>
          </div>

          {/* Estado selector */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-3">
              <p className="text-xs text-[hsl(0_0%_55%)]">Estado</p>
              <Select
                value={contact.estado}
                onValueChange={(v) => handleEstadoChange(v as ContactEstado)}
                disabled={saving}
              >
                <SelectTrigger className="h-8 w-36 border-[hsl(0_0%_16%)] bg-[hsl(0_0%_12%)] text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-[hsl(0_0%_16%)] bg-[hsl(0_0%_9%)]">
                  {ESTADO_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value} className="text-xs">
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              size="sm"
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
