"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import type { Contact } from "@/shared/types/api";

interface ContactDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contact: Contact | null;
  onMarkRead: (id: number) => Promise<void>;
}

export function ContactDetailDialog({
  open,
  onOpenChange,
  contact,
  onMarkRead,
}: ContactDetailDialogProps) {
  if (!contact) return null;

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

          <div className="flex justify-end gap-2 pt-2">
            {!contact.leido && (
              <Button
                onClick={() => onMarkRead(contact.id)}
                size="sm"
              >
                Marcar como leído
              </Button>
            )}
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
