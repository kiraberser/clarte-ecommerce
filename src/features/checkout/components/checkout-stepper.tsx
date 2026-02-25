"use client";

import { Check } from "lucide-react";
import { cn } from "@/shared/lib/utils";

const STEPS = ["Dirección", "Pago", "Confirmado"];

interface CheckoutStepperProps {
  currentStep: 1 | 2 | 3;
}

export function CheckoutStepper({ currentStep }: CheckoutStepperProps) {
  return (
    <nav className="flex items-center justify-center gap-0 mb-10">
      {STEPS.map((label, index) => {
        const step = index + 1;
        const isDone = step < currentStep;
        const isActive = step === currentStep;
        return (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full border text-xs font-medium transition-colors",
                  isDone && "border-foreground bg-foreground text-background",
                  isActive && "border-foreground text-foreground",
                  !isDone && !isActive && "border-muted-foreground/30 text-muted-foreground/50"
                )}
              >
                {isDone ? <Check className="h-3.5 w-3.5" /> : step}
              </div>
              <span
                className={cn(
                  "text-xs tracking-wide",
                  isActive ? "text-foreground font-medium" : "text-muted-foreground/50"
                )}
              >
                {label}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={cn(
                  "mx-3 mb-5 h-px w-16 transition-colors",
                  step < currentStep ? "bg-foreground" : "bg-muted-foreground/20"
                )}
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}
