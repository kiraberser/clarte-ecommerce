import { CheckoutForm } from "@/features/checkout/components/checkout-form";
import { CheckoutSummary } from "@/features/checkout/components/checkout-summary";

export const metadata = {
  title: "Checkout — Clarté",
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

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <CheckoutForm />
        </div>
        <div className="lg:col-span-2">
          <div className="sticky top-24 border p-6">
            <CheckoutSummary />
          </div>
        </div>
      </div>
    </section>
  );
}
