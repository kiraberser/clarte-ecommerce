"use client";

import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/shared/components/ui/button";

export function CheckoutSuccess() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col items-center text-center"
    >
      <CheckCircle className="h-16 w-16 text-foreground" strokeWidth={1} />

      <h1 className="mt-6 text-3xl font-semibold tracking-tight">
        Pedido Confirmado
      </h1>

      <p className="mt-4 max-w-md text-muted-foreground">
        Gracias por tu compra. Recibirás un correo con los detalles de tu pedido
        y la información de seguimiento.
      </p>

      <Link href="/collection">
        <Button size="lg" className="mt-8">
          Seguir Comprando
        </Button>
      </Link>
    </motion.div>
  );
}
