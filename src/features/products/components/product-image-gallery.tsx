"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/shared/lib/utils";

interface ProductMainImageProps {
  src: string;
  name: string;
  index: number;
}

export function ProductMainImage({ src, name, index }: ProductMainImageProps) {
  return (
    <div className="relative aspect-square overflow-hidden border bg-secondary">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0"
        >
          <Image
            src={src}
            alt={`${name} - imagen ${index + 1}`}
            fill
            className="object-cover"
            priority={index === 0}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

interface ProductGalleryGridProps {
  images: string[];
  name: string;
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export function ProductGalleryGrid({
  images,
  name,
  selectedIndex,
  onSelect,
}: ProductGalleryGridProps) {
  if (images.length <= 1) return null;

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {images.map((src, index) => (
        <button
          key={index}
          onClick={() => onSelect(index)}
          className={cn(
            "relative aspect-[4/3] overflow-hidden border-2 transition-all",
            index === selectedIndex
              ? "border-foreground"
              : "border-transparent opacity-60 hover:opacity-100"
          )}
        >
          <Image
            src={src}
            alt={`${name} - imagen ${index + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, 33vw"
          />
        </button>
      ))}
    </div>
  );
}
