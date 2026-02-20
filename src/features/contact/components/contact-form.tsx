"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { submitContactForm } from "@/shared/lib/services/contact";

interface FormState {
  nombre: string;
  email: string;
  telefono: string;
  asunto: string;
  mensaje: string;
}

interface FormErrors {
  nombre?: string;
  email?: string;
  asunto?: string;
  mensaje?: string;
}

const EMPTY: FormState = {
  nombre: "",
  email: "",
  telefono: "",
  asunto: "",
  mensaje: "",
};

const inputCls =
  "w-full border bg-background px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-foreground";

const errCls = "border-destructive focus:border-destructive";

function validate(f: FormState): FormErrors {
  const e: FormErrors = {};
  if (!f.nombre.trim()) e.nombre = "Campo obligatorio";
  if (!f.email.trim()) e.email = "Campo obligatorio";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = "Correo inválido";
  if (!f.asunto.trim()) e.asunto = "Campo obligatorio";
  if (!f.mensaje.trim()) e.mensaje = "Campo obligatorio";
  else if (f.mensaje.trim().length < 10) e.mensaje = "Mínimo 10 caracteres";
  return e;
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export function ContactForm() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<FormErrors>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  function set(field: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field as keyof FormErrors]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSending(true);
    try {
      const res = await submitContactForm({
        nombre: form.nombre,
        email: form.email,
        telefono: form.telefono || undefined,
        asunto: form.asunto,
        mensaje: form.mensaje,
      });
      if (res.success) {
        setSent(true);
        setForm(EMPTY);
        toast.success("Mensaje enviado", {
          description: "Te responderemos a la brevedad.",
        });
      } else {
        toast.error("No se pudo enviar el mensaje. Intenta de nuevo.");
      }
    } catch {
      toast.error("Error de conexión. Intenta de nuevo.");
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div className="flex min-h-[320px] flex-col items-start justify-center space-y-4 border p-10">
        <div className="flex h-10 w-10 items-center justify-center border">
          <Send className="h-4 w-4" />
        </div>
        <h3 className="text-xl font-semibold">Mensaje enviado</h3>
        <p className="max-w-xs text-sm text-muted-foreground leading-relaxed">
          Hemos recibido tu mensaje y te responderemos a la brevedad.
          Revisa tu bandeja de entrada — te enviamos una confirmación.
        </p>
        <button
          onClick={() => setSent(false)}
          className="mt-2 text-sm underline underline-offset-4 text-muted-foreground transition-colors hover:text-foreground"
        >
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Nombre" error={errors.nombre}>
          <input
            value={form.nombre}
            onChange={set("nombre")}
            placeholder="Tu nombre"
            className={cn(inputCls, errors.nombre && errCls)}
          />
        </Field>
        <Field label="Correo electrónico" error={errors.email}>
          <input
            type="email"
            value={form.email}
            onChange={set("email")}
            placeholder="tu@correo.com"
            className={cn(inputCls, errors.email && errCls)}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Teléfono (opcional)">
          <input
            type="tel"
            value={form.telefono}
            onChange={set("telefono")}
            placeholder="+52 55 0000 0000"
            className={inputCls}
          />
        </Field>
        <Field label="Asunto" error={errors.asunto}>
          <input
            value={form.asunto}
            onChange={set("asunto")}
            placeholder="¿En qué podemos ayudarte?"
            className={cn(inputCls, errors.asunto && errCls)}
          />
        </Field>
      </div>

      <Field label="Mensaje" error={errors.mensaje}>
        <textarea
          value={form.mensaje}
          onChange={set("mensaje")}
          rows={6}
          placeholder="Cuéntanos más sobre tu consulta..."
          className={cn(inputCls, "resize-none", errors.mensaje && errCls)}
        />
      </Field>

      <Button
        type="submit"
        size="lg"
        disabled={sending}
        className="w-full sm:w-auto"
      >
        {sending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Enviando…
          </>
        ) : (
          "Enviar mensaje"
        )}
      </Button>
    </form>
  );
}
