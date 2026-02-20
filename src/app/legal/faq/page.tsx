import type { Metadata } from "next";
import { PolicyHeader } from "@/features/legal/components/policy-header";
import { FaqAccordion } from "@/features/legal/components/faq-accordion";

export const metadata: Metadata = {
  title: "Preguntas Frecuentes | Ocaso",
  description: "Respuestas a las preguntas más comunes sobre pedidos, envíos, devoluciones y productos Ocaso.",
};

const faqs = [
  {
    question: "¿Cómo hago un pedido?",
    answer:
      "Navega por nuestra colección, selecciona el producto que deseas y agrégalo al carrito. Al finalizar, dirígete al checkout, ingresa tus datos de envío y elige tu método de pago. Recibirás un correo de confirmación con los detalles de tu pedido.",
  },
  {
    question: "¿Cuáles son los métodos de pago disponibles?",
    answer:
      "Aceptamos tarjetas de crédito y débito (Visa, Mastercard, American Express) y otros métodos disponibles a través de Mercado Pago. Todos los pagos son procesados de forma segura.",
  },
  {
    question: "¿Cuánto tarda el envío?",
    answer:
      "Los pedidos se procesan en 1–2 días hábiles. El tiempo de entrega varía según tu ubicación: zonas metropolitanas de 3–5 días hábiles, interior de la república de 5–8 días hábiles. Consulta nuestra Política de Envío para más detalles.",
  },
  {
    question: "¿Puedo personalizar una lámpara?",
    answer:
      "Sí, ofrecemos proyectos de personalización para diseño de interiores y pedidos especiales. Contáctanos directamente a través de nuestro formulario de contacto describiendo tu proyecto y te responderemos a la brevedad.",
  },
  {
    question: "¿Qué materiales utilizan en sus productos?",
    answer:
      "Nuestras lámparas están fabricadas con PLA, un material ecológico y biodegradable derivado del maíz. Cada pieza pasa por un proceso de impresión 3D de precisión y recibe un acabado artesanal a mano para garantizar su calidad.",
  },
  {
    question: "¿Cómo hago una devolución?",
    answer:
      "Tienes 30 días naturales desde la recepción de tu pedido para solicitar una devolución. El producto debe estar en su estado original, sin uso y con su empaque. Consulta nuestra Política de Devoluciones para iniciar el proceso.",
  },
  {
    question: "¿Los productos tienen garantía?",
    answer:
      "Sí, todos nuestros productos tienen una garantía de 6 meses contra defectos de fabricación. Si tu producto presenta algún problema, contáctanos y lo resolveremos sin costo adicional.",
  },
  {
    question: "¿Puedo rastrear mi pedido?",
    answer:
      "Sí. Una vez que tu pedido sea enviado, recibirás un correo con el número de guía para rastrearlo. También puedes consultar el estado de tu pedido desde la sección \"Mis Pedidos\" en tu cuenta.",
  },
  {
    question: "¿Realizan envíos internacionales?",
    answer:
      "Por el momento solo realizamos envíos dentro de la República Mexicana. Si te encuentras fuera del país y estás interesado en nuestros productos, contáctanos para explorar opciones.",
  },
  {
    question: "¿Cómo puedo contactar al equipo de soporte?",
    answer:
      "Puedes escribirnos a ocaso.lamp@ocaso.com.mx, llamarnos al +52 2321479161, o usar nuestro formulario de contacto. Respondemos todos los mensajes en un plazo de 24 a 48 horas hábiles.",
  },
];

export default function FaqPage() {
  return (
    <>
      <PolicyHeader
        title="Preguntas Frecuentes"
        description="Todo lo que necesitas saber sobre nuestros productos, pedidos y políticas."
        updatedAt="Enero 2025"
      />
      <FaqAccordion items={faqs} />
    </>
  );
}
