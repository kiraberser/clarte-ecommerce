import { CheckoutClient } from "@/features/checkout/components/checkout-client";

export const metadata = {
  title: "Checkout — Ocaso",
};

export default function CheckoutPage() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight">Checkout</h1>
        <p className="mt-2 text-muted-foreground">
          Completa tus datos para finalizar la compra.
        </p>
      </div>

      <CheckoutClient />
    </section>
  );
}
