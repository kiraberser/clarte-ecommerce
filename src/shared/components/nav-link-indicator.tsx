"use client";

import { useLinkStatus } from "next/link";

export function NavLinkIndicator() {
  const { pending } = useLinkStatus();

  return (
    <span
      aria-hidden
      className="inline-block h-1 w-1 rounded-full bg-current transition-opacity duration-150"
      style={{
        opacity: pending ? 0.4 : 0,
        transitionDelay: pending ? "100ms" : "0ms",
      }}
    />
  );
}
