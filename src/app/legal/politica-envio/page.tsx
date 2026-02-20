import type { Metadata } from "next";
import { PolicyHeader } from "@/features/legal/components/policy-header";
import { PolicySection } from "@/features/legal/components/policy-section";

export const metadata: Metadata = {
  title: "Política de Envío | Ocaso",
  description: "Información sobre tiempos de entrega, zonas de envío y costos de Ocaso.",
};

export default function PoliticaEnvioPage() {
  return (
    <>
      <PolicyHeader
        title="Política de Envío"
        description="Todo lo que necesitas saber sobre cómo y cuándo recibirás tu pedido."
        updatedAt="Enero 2025"
      />

      <PolicySection title="Procesamiento del pedido">
        <p>
          Una vez confirmado tu pago, procesamos tu pedido en un plazo de{" "}
          <strong className="text-foreground">1 a 2 días hábiles</strong>. Recibirás un correo
          de confirmación con el número de guía para rastrear tu envío.
        </p>
      </PolicySection>

      <PolicySection title="Tiempos de entrega">
        <p>Los tiempos de entrega aproximados una vez enviado el paquete son:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong className="text-foreground">Zona metropolitana</strong> (CDMX, GDL, MTY): 3–5 días hábiles
          </li>
          <li>
            <strong className="text-foreground">Interior de la república:</strong> 5–8 días hábiles
          </li>
          <li>
            <strong className="text-foreground">Zonas rurales o de difícil acceso:</strong> 8–12 días hábiles
          </li>
        </ul>
        <p>
          Los tiempos son estimados y pueden variar por factores ajenos a nuestro control (clima, días festivos,
          situaciones extraordinarias del servicio de paquetería).
        </p>
      </PolicySection>

      <PolicySection title="Costos de envío">
        <p>
          El costo de envío se calcula automáticamente al momento del checkout según tu código postal y el
          peso del pedido. Los pedidos que superen{" "}
          <strong className="text-foreground">$2,000 MXN</strong> califican para{" "}
          <strong className="text-foreground">envío gratuito</strong> a todo el territorio nacional.
        </p>
      </PolicySection>

      <PolicySection title="Cobertura geográfica">
        <p>
          Realizamos envíos a toda la República Mexicana. Por el momento no contamos con envíos internacionales.
          Si te encuentras fuera del país, contáctanos para explorar opciones.
        </p>
      </PolicySection>

      <PolicySection title="Seguimiento de tu pedido">
        <p>
          Una vez generada la guía de envío, recibirás un correo con el número de rastreo. También puedes
          consultar el estado de tu pedido desde la sección{" "}
          <strong className="text-foreground">Mis Pedidos</strong> en tu cuenta.
        </p>
      </PolicySection>

      <PolicySection title="Pedidos dañados o perdidos">
        <p>
          Si tu pedido llega dañado o no lo recibes en el tiempo estimado, contáctanos a{" "}
          <a href="mailto:ocaso.lamp@ocaso.com.mx" className="text-foreground underline underline-offset-4">
            ocaso.lamp@ocaso.com.mx
          </a>{" "}
          con tu número de pedido. Investigaremos y te daremos una solución en el menor tiempo posible.
        </p>
      </PolicySection>
    </>
  );
}
