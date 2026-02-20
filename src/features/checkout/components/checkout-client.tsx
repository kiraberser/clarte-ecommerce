"use client";

import { useState } from "react";
import { CheckoutForm } from "@/features/checkout/components/checkout-form";
import { CheckoutSummary } from "@/features/checkout/components/checkout-summary";

export function CheckoutClient() {
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);

  function handleCouponApplied(code: string, discount: number) {
    setCouponCode(code);
    setCouponDiscount(discount);
  }

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
      <div className="lg:col-span-3">
        <CheckoutForm onCouponApplied={handleCouponApplied} />
      </div>
      <div className="lg:col-span-2">
        <div className="sticky top-24 border p-6">
          <CheckoutSummary couponCode={couponCode} couponDiscount={couponDiscount} />
        </div>
      </div>
    </div>
  );
}
