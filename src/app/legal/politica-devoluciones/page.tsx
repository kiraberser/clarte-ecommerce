import type { Metadata } from "next";
import { PolicyHeader } from "@/features/legal/components/policy-header";
import { PolicySection } from "@/features/legal/components/policy-section";

export const metadata: Metadata = {
  title: "Política de Devoluciones | Ocaso",
  description: "Conoce nuestro proceso de devoluciones y reembolsos en Ocaso.",
};

export default function PoliticaDevolucionesPage() {
  return (
    <>
      <PolicyHeader
        title="Política de Devoluciones"
        description="Tu satisfacción es nuestra prioridad. Si no estás completamente satisfecho con tu compra, estamos aquí para ayudarte."
        updatedAt="Enero 2025"
      />

      <PolicySection title="Plazo para devoluciones">
        <p>
          Tienes <strong className="text-foreground">30 días naturales</strong> a partir de la fecha de
          recepción de tu pedido para solicitar una devolución o cambio.
        </p>
      </PolicySection>

      <PolicySection title="Condiciones del producto">
        <p>Para que la devolución sea aceptada, el producto debe cumplir las siguientes condiciones:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Estar en su estado original, sin haber sido usado ni instalado.</li>
          <li>Conservar su empaque original en buen estado.</li>
          <li>Incluir todos los accesorios y componentes con los que fue entregado.</li>
          <li>Presentar el comprobante de compra (número de pedido o correo de confirmación).</li>
        </ul>
        <p>
          No se aceptan devoluciones de productos personalizados, bajo pedido especial, ni aquellos
          que muestren signos de uso, daño por el cliente o manipulación indebida.
        </p>
      </PolicySection>

      <PolicySection title="Proceso de devolución">
        <p>Para iniciar una devolución, sigue estos pasos:</p>
        <ol className="list-decimal pl-5 space-y-1">
          <li>
            Contáctanos a{" "}
            <a href="mailto:ocaso.lamp@ocaso.com.mx" className="text-foreground underline underline-offset-4">
              ocaso.lamp@ocaso.com.mx
            </a>{" "}
            indicando tu número de pedido y el motivo de la devolución.
          </li>
          <li>
            Nuestro equipo revisará tu solicitud y te enviará las instrucciones de envío en un plazo de
            2 días hábiles.
          </li>
          <li>Empaca el producto de forma segura con su empaque original.</li>
          <li>Envía el paquete a la dirección que te proporcionemos.</li>
        </ol>
      </PolicySection>

      <PolicySection title="Costos de devolución">
        <p>
          Si la devolución es por un <strong className="text-foreground">defecto de fabricación</strong> o
          un <strong className="text-foreground">error de nuestra parte</strong>, cubrimos el costo del
          envío de regreso.
        </p>
        <p>
          Si la devolución es por cambio de opinión u otro motivo personal, el costo del envío de regreso
          corre a cargo del cliente.
        </p>
      </PolicySection>

      <PolicySection title="Reembolsos">
        <p>
          Una vez recibido e inspeccionado el producto, procesamos el reembolso en un plazo de{" "}
          <strong className="text-foreground">5 a 10 días hábiles</strong>. El reembolso se realiza
          al mismo método de pago utilizado en la compra original.
        </p>
        <p>
          Recibirás un correo de confirmación cuando el reembolso haya sido procesado. El tiempo en que
          el monto aparezca reflejado en tu cuenta puede variar según tu banco o institución financiera.
        </p>
      </PolicySection>

      <PolicySection title="Garantía del producto">
        <p>
          Todos nuestros productos cuentan con una garantía de{" "}
          <strong className="text-foreground">6 meses</strong> contra defectos de fabricación. Si tu
          producto presenta algún defecto dentro de este período, lo reemplazamos o reparamos sin costo
          adicional. Contáctanos con fotos del defecto y tu número de pedido.
        </p>
      </PolicySection>
    </>
  );
}
