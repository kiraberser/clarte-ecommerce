import { apiPost } from "@/shared/lib/api";
import type { ApiResponse, Contact } from "@/shared/types/api";

export interface ContactFormData {
  nombre: string;
  email: string;
  telefono?: string;
  asunto: string;
  mensaje: string;
}

export function submitContactForm(data: ContactFormData) {
  return apiPost<ApiResponse<Contact>>("/contacto/", data);
}
