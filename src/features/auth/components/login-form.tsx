"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { useAuth } from "@/shared/lib/auth-context";
import { ApiError } from "@/shared/lib/api";

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login({ username, password });
      router.push("/");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.data.message || "Credenciales inválidas.");
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
        <h1 className="text-2xl font-semibold tracking-tight">Bienvenido de nuevo</h1>
        <p className="text-sm text-muted-foreground">
          Inicia sesión en tu cuenta
        </p>
      </div>

      <Separator />

      {error && (
        <p className="text-sm text-destructive text-center">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="username" className="text-sm font-medium">
            Usuario o correo electrónico
          </label>
          <Input
            id="username"
            type="text"
            placeholder="tu_usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Contraseña
          </label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <Button className="w-full" disabled={loading}>
          {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
        </Button>
      </form>

      <p className="text-center text-xs text-muted-foreground">
        ¿No tienes cuenta?{" "}
        <Link href="/register" className="underline underline-offset-4 hover:text-foreground">
          Crear una
        </Link>
      </p>
    </div>
  );
}
