import Link from "next/link";
import { Separator } from "@/shared/components/ui/separator";
import { NewsletterForm } from "@/features/newsletter/components/newsletter-form";
import GetYear from "./ui/year";

const footerLinks = {
  nosotros: [
    { label: "Nuestra Historia", href: "/about" },
    { label: "Artesanía", href: "/about" },
    { label: "Sostenibilidad", href: "/about" },
  ],
  tienda: [
    { label: "Toda la Colección", href: "/collection" },
    { label: "Lámparas de Pie", href: "/collection?category=floor-lamps" },
    { label: "Colgantes", href: "/collection?category=pendants" },
    { label: "Apliques de Pared", href: "/collection?category=wall-sconces" },
  ],
  soporte: [
    { label: "Contáctanos", href: "/about" },
    { label: "Envíos", href: "/about" },
    { label: "Devoluciones", href: "/about" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest">
              Nosotros
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.nosotros.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest">
              Tienda
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.tienda.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest">
              Soporte
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.soporte.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest">
              Boletín
            </h3>
            <p className="mt-4 text-sm text-muted-foreground">
              Suscríbete para novedades y ofertas exclusivas.
            </p>
            <div className="mt-4">
              <NewsletterForm />
            </div>
          </div>
        </div>

        <Separator className="my-12" />
        
        <GetYear />
      </div>
    </footer>
  );
}
