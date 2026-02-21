"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/shared/lib/auth-context";
import { AdminGuard } from "@/features/admin/components/admin-guard";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { NavLinkIndicator } from "@/shared/components/nav-link-indicator";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  TrendingUp,
  Mail,
  Users,
  CreditCard,
  Ticket,
  ExternalLink,
  LogOut,
  Menu,
  X,
  FolderTree,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Productos", icon: Package },
  { href: "/admin/categories", label: "Categorías", icon: FolderTree },
  { href: "/admin/orders", label: "Pedidos", icon: ShoppingCart },
  { href: "/admin/payments", label: "Pagos", icon: CreditCard },
  { href: "/admin/descuentos", label: "Cupones", icon: Ticket },
  { href: "/admin/users", label: "Usuarios", icon: Users },
  { href: "/admin/sales", label: "Ventas", icon: TrendingUp },
  { href: "/admin/contacts", label: "Contactos", icon: Mail },
  { href: "/admin/newsletter", label: "Newsletter", icon: Mail },
];

function getPageTitle(pathname: string) {
  const item = NAV_ITEMS.find((n) =>
    n.href === "/admin"
      ? pathname === "/admin"
      : pathname.startsWith(n.href),
  );
  return item?.label ?? "Admin";
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success("Sesión cerrada.");
    router.push("/login");
  };

  return (
    <AdminGuard>
      <div className="admin-dark flex h-screen bg-[hsl(0_0%_6%)] text-[hsl(0_0%_93%)]">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 flex w-60 flex-col border-r border-[hsl(0_0%_16%)] bg-[hsl(0_0%_6%)] transition-transform lg:static lg:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex h-14 items-center border-b border-[hsl(0_0%_16%)] px-5">
            <Link
              href="/"
              className="text-sm font-semibold tracking-widest uppercase hover:text-white/80 transition-colors"
            >
              Ocaso
            </Link>
            <span className="ml-2 text-xs text-[hsl(0_0%_40%)]">Admin</span>
          </div>

          <nav className="flex-1 overflow-y-auto px-3 py-4">
            <ul className="space-y-0.5">
              {NAV_ITEMS.map((item) => {
                const isActive =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-sm px-3 py-2 text-sm transition-colors",
                        isActive
                          ? "bg-[hsl(0_0%_14%)] text-white"
                          : "text-[hsl(0_0%_55%)] hover:bg-[hsl(0_0%_10%)] hover:text-[hsl(0_0%_80%)]",
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                      <NavLinkIndicator />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="border-t border-[hsl(0_0%_16%)] px-3 py-3 space-y-1">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-sm px-3 py-2 text-sm text-[hsl(0_0%_55%)] hover:bg-[hsl(0_0%_10%)] hover:text-[hsl(0_0%_80%)] transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              Volver a tienda
            </Link>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-sm px-3 py-2 text-sm text-[hsl(0_0%_55%)] hover:bg-[hsl(0_0%_10%)] hover:text-[hsl(0_0%_80%)] transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Cerrar sesión
            </button>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Header */}
          <header className="flex h-14 shrink-0 items-center gap-4 border-b border-[hsl(0_0%_16%)] px-6">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-[hsl(0_0%_55%)] hover:text-white hover:bg-[hsl(0_0%_14%)]"
              onClick={() => setSidebarOpen(true)}
            >
              {sidebarOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
            <h1 className="text-sm font-medium tracking-wide">
              {getPageTitle(pathname)}
            </h1>
            <div className="ml-auto flex items-center gap-3">
              <span className="text-xs text-[hsl(0_0%_55%)]">
                {user?.first_name} {user?.last_name}
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[hsl(0_0%_16%)] bg-[hsl(0_0%_14%)] text-xs font-medium uppercase">
                {user?.first_name?.[0] ?? "A"}
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </AdminGuard>
  );
}
