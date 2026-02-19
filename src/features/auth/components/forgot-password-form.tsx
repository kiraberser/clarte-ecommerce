"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { requestPasswordReset } from "@/shared/lib/services/auth";
import { ApiError } from "@/shared/lib/api";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await requestPasswordReset(email.trim());
      setSubmitted(true);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.data.message || "Error al procesar la solicitud.");
      } else {
        setError("Error de conexión. Intenta de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="mx-auto w-full max-w-sm space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">Revisa tu correo</h1>
          <p className="text-sm text-muted-foreground">
            Si existe una cuenta asociada a{" "}
            <span className="font-medium text-foreground">{email}</span>, recibirás
            un enlace para restablecer tu contraseña en los próximos minutos.
          </p>
        </div>

        <Separator />

        <p className="text-xs text-muted-foreground">
          ¿No recibiste el correo? Revisa tu carpeta de spam o{" "}
          <button
            onClick={() => { setSubmitted(false); setEmail(""); }}
            className="underline underline-offset-4 hover:text-foreground"
          >
            intenta de nuevo
          </button>
          .
        </p>

        <p className="text-xs text-muted-foreground">
          <Link href="/login" className="underline underline-offset-4 hover:text-foreground">
            Volver al inicio de sesión
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-sm space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">¿Olvidaste tu contraseña?</h1>
        <p className="text-sm text-muted-foreground">
          Ingresa tu correo y te enviaremos un enlace para restablecerla.
        </p>
      </div>

      <Separator />

      {error && (
        <p className="text-sm text-destructive text-center">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Correo electrónico
          </label>
          <Input
            id="email"
            type="email"
            placeholder="juan@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />
        </div>

        <Button className="w-full" disabled={loading}>
          {loading ? "Enviando..." : "Enviar enlace"}
        </Button>
      </form>

      <p className="text-center text-xs text-muted-foreground">
        <Link href="/login" className="underline underline-offset-4 hover:text-foreground">
          Volver al inicio de sesión
        </Link>
      </p>
    </div>
  );
}
