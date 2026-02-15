"use client";

import { useEffect, useState } from "react";
import { Input } from "@/shared/components/ui/input";
import { Search } from "lucide-react";

interface AdminToolbarProps {
  searchPlaceholder?: string;
  onSearch: (query: string) => void;
  action?: React.ReactNode;
  children?: React.ReactNode;
}

export function AdminToolbar({
  searchPlaceholder = "Buscar...",
  onSearch,
  action,
  children,
}: AdminToolbarProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => onSearch(query), 300);
    return () => clearTimeout(timer);
  }, [query, onSearch]);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(0_0%_55%)]" />
        <Input
          placeholder={searchPlaceholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9 border-[hsl(0_0%_16%)] bg-[hsl(0_0%_9%)] text-[hsl(0_0%_93%)] placeholder:text-[hsl(0_0%_40%)]"
        />
      </div>
      {children}
      {action && <div className="ml-auto">{action}</div>}
    </div>
  );
}
