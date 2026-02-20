import type { Metadata } from "next";
import { PolicyHeader } from "@/features/legal/components/policy-header";
import { PolicySection } from "@/features/legal/components/policy-section";

export const metadata: Metadata = {
  title: "Política de Cookies | Ocaso",
  description: "Información sobre el uso de cookies en el sitio web de Ocaso.",
};

export default function PoliticaCookiesPage() {
  return (
    <>
      <PolicyHeader
        title="Política de Cookies"
        description="Información sobre cómo utilizamos cookies y tecnologías similares para mejorar tu experiencia en nuestro sitio."
        updatedAt="Enero 2025"
      />

      <PolicySection title="¿Qué son las cookies?">
        <p>
          Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo (computadora, tablet o
          teléfono) cuando visitas un sitio web. Nos permiten recordar tus preferencias, analizar el tráfico
          del sitio y mejorar tu experiencia de compra.
        </p>
      </PolicySection>

      <PolicySection title="Tipos de cookies que utilizamos">
        <p>
          <strong className="text-foreground">Cookies esenciales:</strong> Necesarias para el funcionamiento
          básico del sitio, como mantener tu sesión iniciada y conservar los artículos en tu carrito. No pueden
          desactivarse.
        </p>
        <p>
          <strong className="text-foreground">Cookies de rendimiento:</strong> Recopilan información anónima
          sobre cómo los visitantes usan el sitio (páginas más visitadas, errores, etc.) para ayudarnos a
          mejorar su funcionamiento.
        </p>
        <p>
          <strong className="text-foreground">Cookies de preferencias:</strong> Recuerdan tus configuraciones
          y preferencias para personalizar tu visita (por ejemplo, el idioma o la región).
        </p>
        <p>
          <strong className="text-foreground">Cookies de terceros:</strong> Algunos servicios integrados en
          nuestro sitio (como Mercado Pago para pagos) pueden establecer sus propias cookies. Estas están
          sujetas a las políticas de privacidad de dichos terceros.
        </p>
      </PolicySection>

      <PolicySection title="¿Cómo gestionar las cookies?">
        <p>
          Puedes controlar y eliminar las cookies a través de la configuración de tu navegador. Ten en cuenta
          que deshabilitar ciertas cookies puede afectar el funcionamiento del sitio:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Google Chrome: Configuración → Privacidad y seguridad → Cookies</li>
          <li>Mozilla Firefox: Opciones → Privacidad y seguridad</li>
          <li>Safari: Preferencias → Privacidad</li>
          <li>Microsoft Edge: Configuración → Privacidad, búsqueda y servicios</li>
        </ul>
      </PolicySection>

      <PolicySection title="Almacenamiento local">
        <p>
          Además de cookies, utilizamos el almacenamiento local del navegador (localStorage) para guardar
          información como tu carrito de compras y lista de favoritos. Esta información permanece en tu
          dispositivo y no se envía a nuestros servidores automáticamente.
        </p>
      </PolicySection>

      <PolicySection title="Cambios a esta política">
        <p>
          Podemos actualizar esta política de cookies ocasionalmente. Te notificaremos de cualquier cambio
          significativo publicando la nueva versión en esta página. Si tienes preguntas, contáctanos en{" "}
          <a href="mailto:ocaso.lamp@ocaso.com.mx" className="text-foreground underline underline-offset-4">
            ocaso.lamp@ocaso.com.mx
          </a>
          .
        </p>
      </PolicySection>
    </>
  );
}
