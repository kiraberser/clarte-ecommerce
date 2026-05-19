import Link from "next/link";
import { Instagram, Facebook, Youtube, Twitter } from "lucide-react";
import { Separator } from "@/shared/components/ui/separator";
import { NewsletterForm } from "@/features/newsletter/components/newsletter-form";

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
    { label: "Contáctanos", href: "/contact" },
    { label: "Preguntas Frecuentes", href: "/legal/faq" },
    { label: "Envíos", href: "/legal/politica-envio" },
    { label: "Devoluciones", href: "/legal/politica-devoluciones" },
    { label: "Política de Cookies", href: "/legal/politica-cookies" },
    { label: "Política de Privacidad", href: "/legal/politica-privacidad" },
    { label: "Términos de Servicio", href: "/legal/terminos-servicio" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-foreground">
              Nosotros
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.nosotros.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="animated-underline text-sm text-foreground/50 transition-colors hover:text-sunset"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-foreground">
              Tienda
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.tienda.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="animated-underline text-sm text-foreground/50 transition-colors hover:text-sunset"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-foreground">
              Soporte
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.soporte.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="animated-underline text-sm text-foreground/50 transition-colors hover:text-sunset"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-foreground">
              Boletín
            </h3>
            <p className="mt-4 text-sm text-foreground/50">
              Suscríbete para novedades y ofertas exclusivas.
            </p>
            <div className="mt-4">
              <NewsletterForm variant="light" />
            </div>
          </div>
        </div>

        <Separator className="my-12 bg-border" />

        {/* Decorative sunburst divider */}
        <div className="mb-8 flex items-center justify-center gap-3">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-sunset/40" />
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5 text-sunset/60"
            fill="currentColor"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="4" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
              <line
                key={angle}
                x1="12"
                y1="12"
                x2={12 + 8 * Math.cos((angle * Math.PI) / 180)}
                y2={12 + 8 * Math.sin((angle * Math.PI) / 180)}
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
              />
            ))}
          </svg>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-sunset/40" />
        </div>

        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <span className="font-logo text-2xl tracking-[0.2em] text-sunset">
            OCASO
          </span>
          <div className="flex items-center gap-4">
            <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <Instagram className="h-4 w-4 text-foreground/30 transition-colors hover:text-sunset" />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <Facebook className="h-4 w-4 text-foreground/30 transition-colors hover:text-sunset" />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <Youtube className="h-4 w-4 text-foreground/30 transition-colors hover:text-sunset" />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Twitter / X">
              <Twitter className="h-4 w-4 text-foreground/30 transition-colors hover:text-sunset" />
            </a>
          </div>
        </div>

        <Separator className="my-4 bg-border" />

        <p className="text-center text-xs text-foreground/30 sm:text-left">
          © {new Date().getFullYear()} Ocaso · Iluminación de Autor
        </p>
      </div>
    </footer>
  );
}
