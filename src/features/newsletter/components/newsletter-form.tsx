"use client";

import { useState } from "react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { apiPost, ApiError } from "@/shared/lib/api";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      await apiPost("/contacto/newsletter/", { email });
      setStatus("success");
      setMessage("Te has suscrito exitosamente.");
      setEmail("");
    } catch (err) {
      setStatus("error");
      if (err instanceof ApiError) {
        setMessage(err.data.message || "Error al suscribirse.");
      } else {
        setMessage("Error de conexión.");
      }
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="email"
          placeholder="tu@email.com"
          className="flex-1"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={status === "loading"}
        />
        <Button size="sm" disabled={status === "loading"}>
          {status === "loading" ? "..." : "Suscribirse"}
        </Button>
      </form>
      {message && (
        <p className={`mt-2 text-xs ${status === "success" ? "text-muted-foreground" : "text-destructive"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
