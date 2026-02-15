"use client";

import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/shared/components/ui/sheet";
import { Separator } from "@/shared/components/ui/separator";
import { Button } from "@/shared/components/ui/button";
import { useCartStore } from "@/features/cart/store/use-cart-store";
import { CartItem } from "@/features/cart/components/cart-item";

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartSheet({ open, onOpenChange }: CartSheetProps) {
  const items = useCartStore((s) => s.items);
  const totalPrice = useCartStore((s) => s.totalPrice);
  const clearCart = useCartStore((s) => s.clearCart);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Carrito</SheetTitle>
          <SheetDescription>
            {items.length === 0
              ? "Tu carrito está vacío."
              : `${items.length} artículo${items.length > 1 ? "s" : ""} en tu carrito.`}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          {items.map((item) => (
            <div key={item.product.id}>
              <CartItem item={item} />
              <Separator />
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <div className="space-y-4 pt-4">
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total</span>
              <span className="text-sm font-semibold">
                ${totalPrice().toLocaleString()}
              </span>
            </div>
            <Button asChild className="w-full">
              <Link
                href="/checkout"
                onClick={() => onOpenChange(false)}
              >
                Finalizar Compra
              </Link>
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={clearCart}
            >
              Vaciar Carrito
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
