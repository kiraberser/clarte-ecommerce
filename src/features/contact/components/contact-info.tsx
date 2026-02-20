"use client";

import { Mail, Phone } from "lucide-react";

function InfoRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center border">
        {icon}
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-1">{label}</p>
        <p className="text-sm">{children}</p>
      </div>
    </div>
  );
}

export function ContactInfo() {
  return (
    <div className="space-y-10">
      <div>
        <h2 className="mb-6 text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Información de contacto
        </h2>
        <div className="space-y-5">
          <InfoRow icon={<Mail className="h-3.5 w-3.5" />} label="Correo">
            ocaso.lamp@ocaso.com.mx
          </InfoRow>
          <InfoRow icon={<Phone className="h-3.5 w-3.5" />} label="Teléfono">
            +52 2321479161
          </InfoRow>
        </div>
      </div>

      <div className="border-t pt-10">
        <h2 className="mb-4 text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Tiempo de respuesta
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Respondemos todos los mensajes en un plazo de{" "}
          <span className="text-foreground">24 a 48 horas hábiles</span>.
          Para proyectos de diseño de interiores o pedidos mayoristas,
          incluye los detalles en tu mensaje.
        </p>
      </div>
    </div>
  );
}
