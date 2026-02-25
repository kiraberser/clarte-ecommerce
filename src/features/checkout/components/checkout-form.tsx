"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { useCartStore } from "@/features/cart/store/use-cart-store";
import { useAuth } from "@/shared/lib/auth-context";
import { createOrder, validateCoupon } from "@/shared/lib/services/orders";
import { ApiError } from "@/shared/lib/api";
import { CardPaymentBrick } from "@/features/checkout/components/card-payment";
import type { Order } from "@/shared/types/api";

interface CheckoutFormProps {
  step: 1 | 2;
  onStepChange: (s: 1 | 2 | 3) => void;
  onOrderCreated: (order: Order) => void;
  onCouponApplied?: (code: string, discount: number) => void;
  onPaymentSuccess: () => void;
}

export function CheckoutForm({
  step,
  onStepChange,
  onOrderCreated,
  onCouponApplied,
  onPaymentSuccess,
}: CheckoutFormProps) {
  const items = useCartStore((s) => s.items);
  const totalPrice = useCartStore((s) => s.totalPrice);
  const clearCart = useCartStore((s) => s.clearCart);
  const { isAuthenticated, user } = useAuth();

  const [orderId, setOrderId] = useState<number | null>(null);
  const [orderTotal, setOrderTotal] = useState<number>(0);
  const [guestEmail, setGuestEmail] = useState<string>("");

  const [formData, setFormData] = useState({
    direccion_envio: "",
    ciudad: "",
    estado_envio: "",
    codigo_postal: "",
    notas: "",
    guest_nombre: "",
    guest_email: "",
    guest_telefono: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Coupon state
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [validating, setValidating] = useState(false);

  if (items.length === 0 && step === 1) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-lg text-muted-foreground">Tu carrito está vacío.</p>
        <Link href="/collection">
          <Button variant="outline" className="mt-6">
            Ver Colección
          </Button>
        </Link>
      </div>
    );
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleApplyCoupon() {
    if (!couponInput.trim()) return;
    setCouponError("");
    setValidating(true);

    try {
      const subtotal = totalPrice();
      const result = await validateCoupon(couponInput.trim(), subtotal);

      if (result.valido) {
        setAppliedCoupon(couponInput.trim().toUpperCase());
        setCouponDiscount(result.descuento_monto);
        onCouponApplied?.(couponInput.trim().toUpperCase(), result.descuento_monto);
      } else {
        setCouponError(result.mensaje);
      }
    } catch {
      setCouponError("Error al validar el cupón. Intenta de nuevo.");
    } finally {
      setValidating(false);
    }
  }

  function handleRemoveCoupon() {
    setCouponInput("");
    setAppliedCoupon("");
    setCouponDiscount(0);
    setCouponError("");
    onCouponApplied?.("", 0);
  }

  async function handleShippingSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const order = await createOrder({
        ...formData,
        ...(appliedCoupon ? { codigo_cupon: appliedCoupon } : {}),
        items: items.map((item) => ({
          producto_id: item.product.id,
          cantidad: item.quantity,
        })),
      });
      setOrderId(order.id);
      setOrderTotal(order.total);
      setGuestEmail(formData.guest_email);
      onOrderCreated(order);
      onStepChange(2);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.data.message || "Error al crear el pedido.");
      } else {
        setError("Error de conexión. Intenta de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  }

  function handlePaymentSuccess() {
    clearCart();
    onPaymentSuccess();
  }

  const isValid =
    formData.direccion_envio.trim() !== "" &&
    formData.ciudad.trim() !== "" &&
    formData.estado_envio.trim() !== "" &&
    formData.codigo_postal.trim() !== "" &&
    (isAuthenticated || (
      formData.guest_nombre.trim() !== "" &&
      formData.guest_email.trim() !== "" &&
      formData.guest_telefono.trim() !== ""
    ));

  if (step === 2 && orderId) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onStepChange(1)}
            className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors"
          >
            &larr; Volver a datos de envío
          </button>
        </div>

        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Pago con tarjeta
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Completa los datos de tu tarjeta para finalizar la compra.
          </p>
        </div>

        <CardPaymentBrick
          amount={orderTotal}
          pedidoId={orderId}
          payerEmail={user?.email ?? guestEmail}
          onSuccess={handlePaymentSuccess}
        />

        <div className="flex items-center justify-center gap-2 pt-2 text-xs text-muted-foreground">
          <Lock className="h-3.5 w-3.5" strokeWidth={1.5} />
          <span>Pago seguro con cifrado SSL/TLS · Powered by Mercado Pago</span>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleShippingSubmit} className="space-y-6">
      {error && <p className="text-sm text-destructive">{error}</p>}

      {/* Guest contact fields */}
      {!isAuthenticated && (
        <div className="space-y-4 rounded-lg border p-4">
          <p className="text-sm font-medium">Datos de contacto</p>
          <div className="space-y-2">
            <Label htmlFor="guest_nombre">Nombre completo</Label>
            <Input
              id="guest_nombre"
              name="guest_nombre"
              placeholder="María García"
              value={formData.guest_nombre}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="guest_email">Correo electrónico</Label>
            <Input
              id="guest_email"
              name="guest_email"
              type="email"
              placeholder="correo@ejemplo.com"
              value={formData.guest_email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="guest_telefono">Teléfono</Label>
            <Input
              id="guest_telefono"
              name="guest_telefono"
              type="tel"
              placeholder="+52 55 1234 5678"
              value={formData.guest_telefono}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      )}

      {/* Coupon code */}
      <div className="space-y-2">
        <Label htmlFor="coupon_input">Código de descuento</Label>
        <div className="flex gap-2">
          <Input
            id="coupon_input"
            placeholder="BIENVENIDO10"
            value={couponInput}
            onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
            disabled={!!appliedCoupon || validating}
            className="uppercase"
          />
          {appliedCoupon ? (
            <Button
              type="button"
              variant="outline"
              onClick={handleRemoveCoupon}
              className="shrink-0"
            >
              Quitar
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={handleApplyCoupon}
              disabled={!couponInput.trim() || validating}
              className="shrink-0"
            >
              {validating ? "..." : "Aplicar"}
            </Button>
          )}
        </div>
        {couponError && <p className="text-sm text-destructive">{couponError}</p>}
        {appliedCoupon && (
          <p className="text-sm text-green-600">
            Cupón <span className="font-medium">{appliedCoupon}</span> aplicado —
            descuento de ${couponDiscount.toLocaleString()}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="direccion_envio">Dirección de envío</Label>
        <Input
          id="direccion_envio"
          name="direccion_envio"
          placeholder="Calle 123, Colonia Centro"
          value={formData.direccion_envio}
          onChange={handleChange}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="ciudad">Ciudad</Label>
          <Input
            id="ciudad"
            name="ciudad"
            placeholder="Ciudad de México"
            value={formData.ciudad}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="estado_envio">Estado</Label>
          <Input
            id="estado_envio"
            name="estado_envio"
            placeholder="CDMX"
            value={formData.estado_envio}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="codigo_postal">Código postal</Label>
        <Input
          id="codigo_postal"
          name="codigo_postal"
          placeholder="06600"
          value={formData.codigo_postal}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notas">Notas (opcional)</Label>
        <Input
          id="notas"
          name="notas"
          placeholder="Instrucciones de entrega..."
          value={formData.notas}
          onChange={handleChange}
        />
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={!isValid || loading}>
        {loading ? "Creando pedido..." : "Continuar al pago"}
      </Button>
    </form>
  );
}
