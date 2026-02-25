import type { Metadata } from "next";
import { PolicyHeader } from "@/features/legal/components/policy-header";
import { PolicySection } from "@/features/legal/components/policy-section";

export const metadata: Metadata = {
  title: "Política de Privacidad | Ocaso",
  description: "Cómo Ocaso recopila, usa y protege tu información personal.",
};

export default function PoliticaPrivacidadPage() {
  return (
    <>
      <PolicyHeader
        title="Política de Privacidad"
        description="Tu privacidad es importante para nosotros. Esta política explica cómo recopilamos, usamos y protegemos tu información personal."
        updatedAt="Febrero 2025"
      />

      <PolicySection title="1. Responsable del tratamiento">
        <p>
          Ocaso es responsable del tratamiento de tus datos personales. Puedes contactarnos en{" "}
          <a
            href="mailto:ocaso.lamp@ocaso.com.mx"
            className="text-foreground underline underline-offset-4"
          >
            ocaso.lamp@ocaso.com.mx
          </a>{" "}
          para cualquier consulta relacionada con esta política.
        </p>
      </PolicySection>

      <PolicySection title="2. Información que recopilamos">
        <p>Recopilamos la siguiente información cuando usas nuestros servicios:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong className="text-foreground">Información de cuenta:</strong> nombre, correo
            electrónico y contraseña al registrarte directamente en Ocaso.
          </li>
          <li>
            <strong className="text-foreground">Inicio de sesión con Google:</strong> cuando
            inicias sesión con tu cuenta de Google, recopilamos tu nombre completo, correo
            electrónico, foto de perfil y demás datos que Google comparte a través de su API de
            autenticación (como el identificador único de tu cuenta).
          </li>
          <li>
            <strong className="text-foreground">Inicio de sesión con Facebook:</strong> cuando
            inicias sesión con tu cuenta de Facebook, recopilamos tu nombre completo, correo
            electrónico, género, fecha de cumpleaños y edad, de acuerdo con los permisos que
            otorgues al momento de autorizar el acceso.
          </li>
          <li>
            <strong className="text-foreground">Información de compra:</strong> dirección de envío,
            datos de facturación e historial de pedidos.
          </li>
          <li>
            <strong className="text-foreground">Información de pago:</strong> procesada de forma segura
            por Mercado Pago. No almacenamos datos de tarjetas.
          </li>
          <li>
            <strong className="text-foreground">Datos de navegación:</strong> páginas visitadas, tiempo
            de sesión y preferencias, a través de cookies y almacenamiento local.
          </li>
          <li>
            <strong className="text-foreground">Comunicaciones:</strong> mensajes enviados a través del
            formulario de contacto o correo electrónico.
          </li>
        </ul>
      </PolicySection>

      <PolicySection title="3. Cómo usamos tu información">
        <p>Utilizamos tu información para:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Procesar y gestionar tus pedidos y pagos.</li>
          <li>Enviarte confirmaciones de pedido y actualizaciones de envío.</li>
          <li>Responder tus consultas y brindarte soporte.</li>
          <li>Enviarte comunicaciones de marketing si diste tu consentimiento (boletín).</li>
          <li>Mejorar nuestro sitio web y personalizar tu experiencia.</li>
          <li>Cumplir con obligaciones legales y fiscales.</li>
        </ul>
      </PolicySection>

      <PolicySection title="4. Base legal del tratamiento">
        <p>Tratamos tus datos en base a:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong className="text-foreground">Ejecución de contrato:</strong> para procesar tus
            pedidos y gestionar tu cuenta.
          </li>
          <li>
            <strong className="text-foreground">Consentimiento:</strong> para el envío de boletines,
            comunicaciones de marketing e inicio de sesión con servicios de terceros (Google,
            Facebook).
          </li>
          <li>
            <strong className="text-foreground">Interés legítimo:</strong> para mejorar nuestros
            servicios y prevenir fraudes.
          </li>
          <li>
            <strong className="text-foreground">Obligación legal:</strong> para cumplir con
            requerimientos fiscales y legales.
          </li>
        </ul>
      </PolicySection>

      <PolicySection title="5. Compartir información con terceros">
        <p>
          No vendemos ni alquilamos tu información personal. Compartimos datos únicamente con:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong className="text-foreground">Google (Sign In with Google):</strong> utilizamos la
            API de autenticación de Google para verificar tu identidad cuando inicias sesión con
            Google. Consulta la{" "}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline underline-offset-4"
            >
              Política de Privacidad de Google
            </a>
            .
          </li>
          <li>
            <strong className="text-foreground">Facebook Login:</strong> utilizamos la API de
            Facebook para verificar tu identidad cuando inicias sesión con Facebook. Consulta la{" "}
            <a
              href="https://www.facebook.com/policy.php"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline underline-offset-4"
            >
              Política de Privacidad de Facebook
            </a>
            .
          </li>
          <li>
            <strong className="text-foreground">Mercado Pago:</strong> para procesar pagos de forma
            segura.
          </li>
          <li>
            <strong className="text-foreground">Paquetería:</strong> para gestionar la entrega de
            tus pedidos.
          </li>
          <li>
            <strong className="text-foreground">Brevo:</strong> para el envío de correos
            transaccionales y boletines.
          </li>
          <li>
            <strong className="text-foreground">Cloudinary:</strong> para el almacenamiento de
            imágenes de productos.
          </li>
        </ul>
        <p>
          Todos nuestros proveedores cuentan con políticas de privacidad propias y tratan los datos
          bajo acuerdos de confidencialidad.
        </p>
      </PolicySection>

      <PolicySection title="6. Eliminación de datos" id="eliminacion-de-datos">
        <p>
          De acuerdo con los requerimientos de las plataformas de inicio de sesión social (Facebook,
          Google) y la normativa aplicable, tienes derecho a solicitar la eliminación de todos los
          datos que Ocaso ha recopilado a través de estas integraciones.
        </p>
        <p className="mt-2">
          <strong className="text-foreground">¿Cómo solicitar la eliminación de tus datos?</strong>
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-1">
          <li>
            Envía un correo a{" "}
            <a
              href="mailto:ocaso.lamp@ocaso.com.mx"
              className="text-foreground underline underline-offset-4"
            >
              ocaso.lamp@ocaso.com.mx
            </a>{" "}
            con el asunto <strong>&ldquo;Solicitud de eliminación de datos&rdquo;</strong> e indica
            el correo electrónico asociado a tu cuenta.
          </li>
          <li>
            Una vez verificada tu identidad, procederemos a eliminar tu cuenta y todos los datos
            asociados en un plazo máximo de <strong>30 días hábiles</strong>.
          </li>
          <li>
            Ten en cuenta que algunos datos podrán conservarse por el tiempo que sea necesario para
            cumplir con obligaciones legales o fiscales.
          </li>
        </ul>
        <p className="mt-2">
          Si iniciaste sesión con Facebook, también puedes revocar el acceso de la aplicación Ocaso
          desde tu configuración de Facebook:{" "}
          <strong>Configuración &gt; Seguridad e inicio de sesión &gt; Apps y sitios web</strong>.
          Sin embargo, esto no elimina automáticamente los datos ya recopilados en nuestros
          sistemas, por lo que debes contactarnos por correo si deseas su eliminación completa.
        </p>
      </PolicySection>

      <PolicySection title="7. Retención de datos">
        <p>
          Conservamos tu información personal mientras mantengas una cuenta activa o según sea
          necesario para cumplir nuestras obligaciones legales. Puedes solicitar la eliminación de tu
          cuenta y datos en cualquier momento escribiéndonos a{" "}
          <a
            href="mailto:ocaso.lamp@ocaso.com.mx"
            className="text-foreground underline underline-offset-4"
          >
            ocaso.lamp@ocaso.com.mx
          </a>
          .
        </p>
      </PolicySection>

      <PolicySection title="8. Tus derechos">
        <p>
          De acuerdo con la Ley Federal de Protección de Datos Personales en Posesión de los
          Particulares (LFPDPPP), tienes derecho a:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong className="text-foreground">Acceso:</strong> conocer qué datos tenemos sobre ti.
          </li>
          <li>
            <strong className="text-foreground">Rectificación:</strong> corregir datos inexactos.
          </li>
          <li>
            <strong className="text-foreground">Cancelación:</strong> solicitar la eliminación de
            tus datos.
          </li>
          <li>
            <strong className="text-foreground">Oposición:</strong> oponerte al tratamiento de tus
            datos para fines específicos.
          </li>
          <li>
            <strong className="text-foreground">Portabilidad:</strong> recibir tus datos en formato
            estructurado.
          </li>
        </ul>
        <p>
          Para ejercer tus derechos, escríbenos a{" "}
          <a
            href="mailto:ocaso.lamp@ocaso.com.mx"
            className="text-foreground underline underline-offset-4"
          >
            ocaso.lamp@ocaso.com.mx
          </a>
          . Respondemos en un plazo máximo de 20 días hábiles.
        </p>
      </PolicySection>

      <PolicySection title="9. Seguridad">
        <p>
          Implementamos medidas de seguridad técnicas y organizativas para proteger tu información
          contra acceso no autorizado, pérdida o divulgación. Los pagos se procesan mediante
          conexiones cifradas (HTTPS/TLS).
        </p>
      </PolicySection>

      <PolicySection title="10. Cookies">
        <p>
          Utilizamos cookies y tecnologías similares para mejorar tu experiencia. Consulta nuestra{" "}
          <a href="/legal/politica-cookies" className="text-foreground underline underline-offset-4">
            Política de Cookies
          </a>{" "}
          para más información.
        </p>
      </PolicySection>

      <PolicySection title="11. Cambios a esta política">
        <p>
          Podemos actualizar esta política ocasionalmente. Te notificaremos de cambios significativos
          por correo electrónico o mediante un aviso visible en el sitio.
        </p>
      </PolicySection>
    </>
  );
}
