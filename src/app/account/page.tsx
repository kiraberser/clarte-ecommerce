"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Separator } from "@/shared/components/ui/separator";
import { useAuth } from "@/shared/lib/auth-context";
import { updateProfile } from "@/shared/lib/services/auth";

interface ProfileForm {
  first_name: string;
  last_name: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  estado: string;
  codigo_postal: string;
}

export default function AccountPage() {
  const { user, isAuthenticated, isLoading, refreshUser } = useAuth();
  const [form, setForm] = useState<ProfileForm>({
    first_name: "",
    last_name: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    estado: "",
    codigo_postal: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setForm({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        telefono: user.telefono || "",
        direccion: user.direccion || "",
        ciudad: user.ciudad || "",
        estado: user.estado || "",
        codigo_postal: user.codigo_postal || "",
      });
    }
  }, [user]);

  const handleChange = (field: keyof ProfileForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.first_name.trim()) {
      setError("El nombre es requerido.");
      return;
    }
    setSaving(true);
    setError(null);

    try {
      await updateProfile(form);
      toast.success("Perfil actualizado correctamente.");
      refreshUser().catch(() => {});
    } catch {
      setError("Error al actualizar el perfil.");
      toast.error("Error al actualizar el perfil.");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <section className="mx-auto max-w-2xl px-6 py-16 lg:px-8">
        <div className="h-8 w-48 animate-pulse bg-secondary" />
      </section>
    );
  }

  if (!isAuthenticated) {
    return (
      <section className="mx-auto max-w-2xl px-6 py-16 lg:px-8 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Mi Cuenta</h1>
        <p className="mt-4 text-muted-foreground">
          Inicia sesión para ver tu cuenta.
        </p>
        <Link href="/login">
          <Button className="mt-6">Iniciar Sesión</Button>
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-2xl px-6 py-16 lg:px-8">
      <h1 className="text-2xl font-semibold tracking-tight">Mi Cuenta</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Administra tu información personal y dirección de envío.
      </p>

      <Separator className="mt-6" />

      <form onSubmit={handleSubmit} className="mt-8 space-y-8">
        {/* Personal info */}
        <div>
          <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Información Personal
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="first_name">Nombre</Label>
              <Input
                id="first_name"
                value={form.first_name}
                onChange={(e) => handleChange("first_name", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Apellido</Label>
              <Input
                id="last_name"
                value={form.last_name}
                onChange={(e) => handleChange("last_name", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={user?.email || ""} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                value={form.telefono}
                onChange={(e) => handleChange("telefono", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Address */}
        <div>
          <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Dirección de Envío
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="direccion">Dirección</Label>
              <Input
                id="direccion"
                value={form.direccion}
                onChange={(e) => handleChange("direccion", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ciudad">Ciudad</Label>
              <Input
                id="ciudad"
                value={form.ciudad}
                onChange={(e) => handleChange("ciudad", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <Input
                id="estado"
                value={form.estado}
                onChange={(e) => handleChange("estado", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="codigo_postal">Código Postal</Label>
              <Input
                id="codigo_postal"
                value={form.codigo_postal}
                onChange={(e) => handleChange("codigo_postal", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Account info (read-only) */}
        <div>
          <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Información de Cuenta
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="username">Usuario</Label>
              <Input id="username" value={user?.username || ""} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date_joined">Miembro desde</Label>
              <Input
                id="date_joined"
                value={
                  user?.date_joined
                    ? new Date(user.date_joined).toLocaleDateString("es-MX", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : ""
                }
                disabled
              />
            </div>
          </div>
        </div>

        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        <Button type="submit" disabled={saving}>
          {saving ? "Guardando..." : "Guardar Cambios"}
        </Button>
      </form>
    </section>
  );
}
