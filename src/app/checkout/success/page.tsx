import { CheckoutSuccess } from "@/features/checkout/components/checkout-success";

export const metadata = {
  title: "Pedido Confirmado — Ocaso",
};

export default function CheckoutSuccessPage() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-6 py-16 lg:px-8">
      <CheckoutSuccess />
    </section>
  );
}
