"""
Servicio reutilizable de Brevo (ex-Sendinblue).
Responsabilidades:
  - Enviar emails transaccionales (confirmación de pedido, contacto).
  - Gestionar contactos en listas de Brevo (newsletter).

Usado por: common (contacto, newsletter) y pagos (confirmación de pedido).
"""
import logging

from django.conf import settings

logger = logging.getLogger('clarte')


def _get_api_instance():
    """Retorna la instancia de la API transaccional de Brevo."""
    import sib_api_v3_sdk

    api_key = settings.BREVO_API_KEY
    if not api_key:
        raise ValueError('BREVO_API_KEY no configurado.')

    configuration = sib_api_v3_sdk.Configuration()
    configuration.api_key['api-key'] = api_key
    return sib_api_v3_sdk.TransactionalEmailsApi(
        sib_api_v3_sdk.ApiClient(configuration)
    )


def _get_contacts_api():
    """Retorna la instancia de la API de contactos de Brevo."""
    import sib_api_v3_sdk

    api_key = settings.BREVO_API_KEY
    if not api_key:
        raise ValueError('BREVO_API_KEY no configurado.')

    configuration = sib_api_v3_sdk.Configuration()
    configuration.api_key['api-key'] = api_key
    return sib_api_v3_sdk.ContactsApi(
        sib_api_v3_sdk.ApiClient(configuration)
    )


def enviar_email_transaccional(destinatario_email, destinatario_nombre, asunto, contenido_html):
    """
    Envía un email transaccional genérico vía Brevo.

    Args:
        destinatario_email: Email del destinatario.
        destinatario_nombre: Nombre del destinatario.
        asunto: Asunto del email.
        contenido_html: Contenido HTML del email.
    """
    import sib_api_v3_sdk

    try:
        api = _get_api_instance()
        email = sib_api_v3_sdk.SendSmtpEmail(
            to=[{'email': destinatario_email, 'name': destinatario_nombre}],
            sender={
                'email': settings.BREVO_SENDER_EMAIL,
                'name': settings.BREVO_SENDER_NAME,
            },
            subject=asunto,
            html_content=contenido_html,
        )
        response = api.send_transac_email(email)
        logger.info('Email enviado a %s: %s (message_id: %s)', destinatario_email, asunto, response.message_id)
        return response
    except Exception as e:
        logger.error('Error al enviar email a %s: %s', destinatario_email, e)
        raise


def enviar_notificacion_contacto(contacto):
    """
    Envía un email de notificación al admin cuando se recibe un formulario de contacto.

    Args:
        contacto: Instancia del modelo Contacto.
    """
    admin_email = settings.BREVO_SENDER_EMAIL
    if not admin_email:
        logger.warning('BREVO_SENDER_EMAIL no configurado. No se envió notificación de contacto.')
        return

    contenido = f"""
    <h2>Nuevo mensaje de contacto en Clarté</h2>
    <p><strong>Nombre:</strong> {contacto.nombre}</p>
    <p><strong>Email:</strong> {contacto.email}</p>
    <p><strong>Teléfono:</strong> {contacto.telefono or 'No proporcionado'}</p>
    <p><strong>Asunto:</strong> {contacto.asunto}</p>
    <hr>
    <p>{contacto.mensaje}</p>
    """

    enviar_email_transaccional(
        destinatario_email=admin_email,
        destinatario_nombre='Admin Clarté',
        asunto=f'[Contacto] {contacto.asunto}',
        contenido_html=contenido,
    )


def enviar_confirmacion_pedido(pedido, pago):
    """
    Envía email de confirmación de compra al usuario.

    Args:
        pedido: Instancia del modelo Pedido.
        pago: Instancia del modelo Pago.
    """
    usuario = pedido.usuario

    # Construir tabla de items
    items_html = ''
    for item in pedido.items.select_related('producto'):
        items_html += f"""
        <tr>
            <td>{item.producto.nombre}</td>
            <td>{item.cantidad}</td>
            <td>${item.precio_unitario}</td>
            <td>${item.subtotal}</td>
        </tr>
        """

    contenido = f"""
    <h2>¡Gracias por tu compra en Clarté!</h2>
    <p>Hola {usuario.first_name or usuario.username},</p>
    <p>Tu pedido <strong>{pedido.numero_pedido}</strong> ha sido confirmado.</p>

    <h3>Detalle del pedido</h3>
    <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse;">
        <thead>
            <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Subtotal</th>
            </tr>
        </thead>
        <tbody>
            {items_html}
        </tbody>
    </table>

    <p><strong>Total: ${pedido.total}</strong></p>

    <h3>Dirección de envío</h3>
    <p>{pedido.direccion_envio}, {pedido.ciudad}, {pedido.estado_envio} {pedido.codigo_postal}</p>

    <p>Te notificaremos cuando tu pedido sea enviado.</p>
    <p>— Equipo Clarté</p>
    """

    enviar_email_transaccional(
        destinatario_email=usuario.email,
        destinatario_nombre=usuario.first_name or usuario.username,
        asunto=f'Confirmación de pedido {pedido.numero_pedido}',
        contenido_html=contenido,
    )


def agregar_contacto_newsletter(email):
    """
    Agrega un contacto a la lista de newsletter en Brevo.

    Args:
        email: Email del suscriptor.
    """
    import sib_api_v3_sdk

    try:
        api = _get_contacts_api()
        contact = sib_api_v3_sdk.CreateContact(
            email=email,
            update_enabled=True,
        )
        api.create_contact(contact)
        logger.info('Contacto agregado a Brevo newsletter: %s', email)
    except Exception as e:
        # Si el contacto ya existe, Brevo lanza excepción pero no es un error real
        error_msg = str(e)
        if 'duplicate' in error_msg.lower() or 'already exist' in error_msg.lower():
            logger.info('Contacto ya existe en Brevo: %s', email)
        else:
            logger.error('Error al agregar contacto a Brevo: %s — %s', email, e)
            raise
