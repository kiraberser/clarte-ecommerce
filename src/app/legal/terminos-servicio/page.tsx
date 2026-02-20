import type { Metadata } from "next";
import { PolicyHeader } from "@/features/legal/components/policy-header";
import { PolicySection } from "@/features/legal/components/policy-section";

export const metadata: Metadata = {
  title: "Términos de Servicio | Ocaso",
  description: "Términos y condiciones de uso del sitio web y servicios de Ocaso.",
};

export default function TerminosServicioPage() {
  return (
    <>
      <PolicyHeader
        title="Términos de Servicio"
        description="Al usar nuestro sitio web y realizar compras en Ocaso, aceptas los siguientes términos y condiciones."
        updatedAt="Enero 2025"
      />

      <PolicySection title="1. Aceptación de los términos">
        <p>
          Al acceder y utilizar el sitio web de Ocaso (ocaso.com.mx), aceptas quedar vinculado por estos
          Términos de Servicio. Si no estás de acuerdo con alguno de estos términos, no debes utilizar
          nuestro sitio.
        </p>
      </PolicySection>

      <PolicySection title="2. Descripción del servicio">
        <p>
          Ocaso es una tienda en línea especializada en luminarias de diseño fabricadas con impresión 3D
          y acabados artesanales. Ofrecemos productos para uso residencial y proyectos de diseño de interiores
          dentro de la República Mexicana.
        </p>
      </PolicySection>

      <PolicySection title="3. Registro y cuenta de usuario">
        <p>
          Para realizar una compra puedes crear una cuenta o continuar como invitado. Al registrarte,
          eres responsable de mantener la confidencialidad de tu contraseña y de todas las actividades
          que ocurran en tu cuenta. Notifícanos de inmediato cualquier uso no autorizado.
        </p>
        <p>
          Debes proporcionar información veraz, actualizada y completa durante el registro. Nos reservamos
          el derecho de suspender cuentas que violen estos términos.
        </p>
      </PolicySection>

      <PolicySection title="4. Precios y disponibilidad">
        <p>
          Todos los precios están expresados en pesos mexicanos (MXN) e incluyen IVA. Nos reservamos el
          derecho de modificar precios en cualquier momento sin previo aviso. El precio aplicable es el
          vigente al momento de confirmar tu pedido.
        </p>
        <p>
          La disponibilidad de productos está sujeta a existencias. En caso de que un producto no esté
          disponible después de realizar tu pedido, te notificaremos y ofreceremos una alternativa o
          reembolso completo.
        </p>
      </PolicySection>

      <PolicySection title="5. Proceso de compra">
        <p>
          Un pedido se considera confirmado una vez que recibas el correo de confirmación con tu número
          de pedido. Nos reservamos el derecho de cancelar pedidos en casos de error de precio, fraude
          sospechoso o imposibilidad de entrega.
        </p>
      </PolicySection>

      <PolicySection title="6. Propiedad intelectual">
        <p>
          Todo el contenido del sitio web, incluyendo diseños, fotografías, textos, logotipos y modelos
          3D, es propiedad de Ocaso y está protegido por las leyes de propiedad intelectual aplicables.
          Queda prohibida su reproducción, distribución o uso comercial sin autorización expresa.
        </p>
      </PolicySection>

      <PolicySection title="7. Limitación de responsabilidad">
        <p>
          Ocaso no será responsable por daños indirectos, incidentales o consecuentes derivados del uso
          de nuestros productos o del sitio web. Nuestra responsabilidad máxima se limita al valor del
          pedido en cuestión.
        </p>
      </PolicySection>

      <PolicySection title="8. Ley aplicable">
        <p>
          Estos términos se rigen por las leyes de los Estados Unidos Mexicanos. Cualquier controversia
          será sometida a la jurisdicción de los tribunales competentes de la Ciudad de México.
        </p>
      </PolicySection>

      <PolicySection title="9. Cambios a estos términos">
        <p>
          Podemos actualizar estos Términos de Servicio en cualquier momento. Los cambios entran en vigor
          al publicarse en esta página. El uso continuado del sitio después de dichos cambios constituye
          aceptación de los nuevos términos. Para dudas, contáctanos en{" "}
          <a
            href="mailto:ocaso.lamp@ocaso.com.mx"
            className="text-foreground underline underline-offset-4"
          >
            ocaso.lamp@ocaso.com.mx
          </a>
          .
        </p>
      </PolicySection>
    </>
  );
}
