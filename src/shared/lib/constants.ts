export const SITE_NAME = "Ocaso";

export const NAV_LINKS = [
  { label: "Inicio", href: "/" },
  { label: "Colección", href: "/collection" },
  { label: "Nosotros", href: "/about" },
] as const;

// ──────────────────────────────────────────────
// Status labels — centralized to avoid duplication
// ──────────────────────────────────────────────

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pendiente: "Pendiente",
  pagado: "Pagado",
  enviado: "Enviado",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  pendiente: "Pendiente",
  aprobado: "Aprobado",
  rechazado: "Rechazado",
  cancelado: "Cancelado",
  reembolsado: "Reembolsado",
};
