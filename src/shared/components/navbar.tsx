"use client";

import Link from "next/link";
import {
  Search,
  User,
  ShoppingBag,
  Menu,
  LogOut,
  Package,
  Receipt,
  UserCog,
  LayoutDashboard,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { SITE_NAME, NAV_LINKS } from "@/shared/lib/constants";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Separator } from "@/shared/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/shared/components/ui/sheet";
import { useCartStore } from "@/features/cart/store/use-cart-store";
import { useMounted } from "@/shared/hooks/use-mounted";
import { CartSheet } from "@/features/cart/components/cart-sheet";
import { SearchBar } from "@/features/search/components/search-bar";
import { useAuth } from "@/shared/lib/auth-context";
import { NavLinkIndicator } from "@/shared/components/nav-link-indicator";

export function Navbar() {
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mounted = useMounted();
  const totalItems = useCartStore((s) =>
    s.items.reduce((sum, item) => sum + item.quantity, 0),
  );
  const { user, isAuthenticated, logout } = useAuth();

  const displayName = user?.first_name || user?.username || "";

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Menú"
            >
              <Menu className="h-5 w-5" />
            </Button>

            <Link
              href="/"
              className="text-lg font-semibold uppercase tracking-widest"
            >
              {SITE_NAME}
            </Link>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
                <NavLinkIndicator />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(true)}
              aria-label="Buscar"
            >
              <Search className="h-4 w-4" />
            </Button>

            {mounted && isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="hidden gap-1.5 text-sm md:inline-flex"
                  >
                    <User className="h-4 w-4" />
                    <span className="max-w-[100px] truncate">
                      {displayName}
                    </span>
                    <ChevronDown className="h-3 w-3 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>
                    Hola, {displayName}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/account">
                      <UserCog className="h-4 w-4" />
                      Mi Cuenta
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders">
                      <Package className="h-4 w-4" />
                      Mis Pedidos
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/purchases">
                      <Receipt className="h-4 w-4" />
                      Mis Compras
                    </Link>
                  </DropdownMenuItem>
                  {user?.is_staff && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/admin">
                          <LayoutDashboard className="h-4 w-4" />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => logout()}
                    className="text-destructive focus:text-destructive"
                  >
                    <LogOut className="h-4 w-4" />
                    Cerrar sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="hidden md:inline-flex"
              >
                <Link href="/login" aria-label="Cuenta">
                  <User className="h-4 w-4" />
                </Link>
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setCartOpen(true)}
              aria-label="Carrito"
            >
              <ShoppingBag className="h-4 w-4" />
              {mounted && totalItems > 0 && (
                <Badge className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center p-0 text-[10px]">
                  {totalItems}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle className="text-lg uppercase tracking-widest">
              {SITE_NAME}
            </SheetTitle>
          </SheetHeader>
          <nav className="mt-8 flex flex-col gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center gap-1.5 text-base font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
                <NavLinkIndicator />
              </Link>
            ))}

            <Separator />

            {mounted && isAuthenticated ? (
              <>
                <span className="text-sm text-muted-foreground">
                  Hola, {displayName}
                </span>
                <Link
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-base font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  <UserCog className="h-4 w-4" />
                  Mi Cuenta
                </Link>
                <Link
                  href="/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-base font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Package className="h-4 w-4" />
                  Mis Pedidos
                </Link>
                <Link
                  href="/purchases"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-base font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Receipt className="h-4 w-4" />
                  Mis Compras
                </Link>
                {user?.is_staff && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-base font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                )}
                <Separator />
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 text-base font-medium text-destructive transition-colors hover:text-destructive/80"
                >
                  <LogOut className="h-4 w-4" />
                  Cerrar sesión
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-base font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <User className="h-4 w-4" />
                Iniciar sesión
              </Link>
            )}
          </nav>
        </SheetContent>
      </Sheet>

      <CartSheet open={cartOpen} onOpenChange={setCartOpen} />
      <SearchBar open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
