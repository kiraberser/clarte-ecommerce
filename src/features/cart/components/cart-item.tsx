"use client";

import Image from "next/image";
import { Minus, Plus, X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useCartStore, type CartItem as CartItemType } from "@/features/cart/store/use-cart-store";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  return (
    <div className="flex items-center gap-4 py-4">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden border bg-secondary">
        <Image
          src={item.product.imagen_principal || "/placeholder-product.svg"}
          alt={item.product.nombre}
          fill
          className="object-cover"
          sizes="64px"
        />
      </div>

      <div className="flex flex-1 flex-col gap-1">
        <p className="text-sm font-medium">{item.product.nombre}</p>
        <p className="text-sm text-muted-foreground">
          ${Number(item.product.precio_final).toLocaleString()}
        </p>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
        >
          <Minus className="h-3 w-3" />
        </Button>
        <span className="w-6 text-center text-sm">{item.quantity}</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={() => removeItem(item.product.id)}
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
}
