"use client";

import { useState } from "react";
import type { Order } from "@/shared/types/api";
import { CheckoutStepper } from "@/features/checkout/components/checkout-stepper";
import { CheckoutForm } from "@/features/checkout/components/checkout-form";
import { CheckoutSummary } from "@/features/checkout/components/checkout-summary";
import { CheckoutSuccess } from "@/features/checkout/components/checkout-success";

export function CheckoutClient() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [order, setOrder] = useState<Order | null>(null);

  function handleCouponApplied(code: string, discount: number) {
    setCouponCode(code);
    setCouponDiscount(discount);
  }

  function handleOrderCreated(createdOrder: Order) {
    setOrder(createdOrder);
    sessionStorage.setItem("ocaso-last-order", JSON.stringify(createdOrder));
  }

  function handlePaymentSuccess() {
    setStep(3);
  }

  if (step === 3) {
    return (
      <div>
        <CheckoutStepper currentStep={3} />
        <CheckoutSuccess order={order} />
      </div>
    );
  }

  return (
    <div>
      <CheckoutStepper currentStep={step} />
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <CheckoutForm
            step={step}
            onStepChange={setStep}
            onOrderCreated={handleOrderCreated}
            onCouponApplied={handleCouponApplied}
            onPaymentSuccess={handlePaymentSuccess}
          />
        </div>
        <div className="lg:col-span-2">
          <div className="sticky top-24 border p-6">
            <CheckoutSummary
              couponCode={couponCode}
              couponDiscount={couponDiscount}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
