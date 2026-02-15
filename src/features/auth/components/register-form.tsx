"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { useAuth } from "@/shared/lib/auth-context";
import { ApiError } from "@/shared/lib/api";

export function RegisterForm() {
  const router = useRouter();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    password_confirm: "",
  });
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    setLoading(true);

    try {
      await register(formData);
      router.push("/");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.data.message || "Error al crear la cuenta.");
        if (err.data.errors) {
          setFieldErrors(err.data.errors);
        }
      } else {
        setError("Error de conexión. Intenta de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-sm space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Crear Cuenta</h1>
        <p className="text-sm text-muted-foreground">
          Regístrate para comenzar a comprar
        </p>
      </div>

      <Separator />

      {error && (
        <p className="text-sm text-destructive text-center">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="first_name" className="text-sm font-medium">
              Nombre
            </label>
            <Input
              id="first_name"
              name="first_name"
              placeholder="Juan"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
            {fieldErrors.first_name && (
              <p className="text-xs text-destructive">{fieldErrors.first_name[0]}</p>
            )}
          </div>
          <div className="space-y-2">
            <label htmlFor="last_name" className="text-sm font-medium">
              Apellido
            </label>
            <Input
              id="last_name"
              name="last_name"
              placeholder="Pérez"
              value={formData.last_name}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="username" className="text-sm font-medium">
            Usuario
          </label>
          <Input
            id="username"
            name="username"
            placeholder="juanperez"
            value={formData.username}
            onChange={handleChange}
            required
          />
          {fieldErrors.username && (
            <p className="text-xs text-destructive">{fieldErrors.username[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Correo electrónico
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="juan@ejemplo.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {fieldErrors.email && (
            <p className="text-xs text-destructive">{fieldErrors.email[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Contraseña
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={8}
          />
          {fieldErrors.password && (
            <p className="text-xs text-destructive">{fieldErrors.password[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="password_confirm" className="text-sm font-medium">
            Confirmar contraseña
          </label>
          <Input
            id="password_confirm"
            name="password_confirm"
            type="password"
            placeholder="••••••••"
            value={formData.password_confirm}
            onChange={handleChange}
            required
            minLength={8}
          />
          {fieldErrors.password_confirm && (
            <p className="text-xs text-destructive">{fieldErrors.password_confirm[0]}</p>
          )}
        </div>

        <Button className="w-full" disabled={loading}>
          {loading ? "Creando cuenta..." : "Crear Cuenta"}
        </Button>
      </form>

      <p className="text-center text-xs text-muted-foreground">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="underline underline-offset-4 hover:text-foreground">
          Iniciar sesión
        </Link>
      </p>
    </div>
  );
}
