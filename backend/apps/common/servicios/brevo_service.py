"""
Servicio reutilizable de Brevo (ex-Sendinblue).
Responsabilidades:
  - Enviar emails transaccionales (registro, confirmación de pedido, contacto).
  - Gestionar contactos en listas de Brevo (newsletter).

Usa templates de Brevo (por ID) para registro, pedido y newsletter.
Usa HTML inline solo para notificaciones internas (contacto → admin).

Usado por: common (contacto, newsletter), usuarios (registro), pagos (pedido).
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


def _sender():
    """Retorna el dict de sender para los emails."""
    return {
        'email': settings.BREVO_SENDER_EMAIL,
        'name': settings.BREVO_SENDER_NAME,
    }


# ──────────────────────────────────────────────
# Envío genérico con HTML inline (para emails internos)
# ──────────────────────────────────────────────

def enviar_email_transaccional(destinatario_email, destinatario_nombre, asunto, contenido_html):
    """
    Envía un email transaccional con HTML inline vía Brevo.
    Usado para notificaciones internas (contacto → admin).
    """
    import sib_api_v3_sdk

    try:
        api = _get_api_instance()
        email = sib_api_v3_sdk.SendSmtpEmail(
            to=[{'email': destinatario_email, 'name': destinatario_nombre}],
            sender=_sender(),
            subject=asunto,
            html_content=contenido_html,
        )
        response = api.send_transac_email(email)
        logger.info('Email enviado a %s: %s (message_id: %s)', destinatario_email, asunto, response.message_id)
        return response
    except Exception as e:
        logger.error('Error al enviar email a %s: %s', destinatario_email, e)
        raise


# ──────────────────────────────────────────────
# Envío con template de Brevo (por ID + params)
# ──────────────────────────────────────────────

def _enviar_con_template(template_id, destinatario_email, destinatario_nombre, params=None):
    """
    Envía un email usando un template de Brevo.

    Args:
        template_id: ID del template en Brevo.
        destinatario_email: Email del destinatario.
        destinatario_nombre: Nombre del destinatario.
        params: Dict de variables dinámicas para el template.
    """
    import sib_api_v3_sdk

    if not template_id:
        raise ValueError('Template ID de Brevo no configurado.')

    try:
        api = _get_api_instance()
        email = sib_api_v3_sdk.SendSmtpEmail(
            to=[{'email': destinatario_email, 'name': destinatario_nombre}],
            sender=_sender(),
            template_id=template_id,
            params=params or {},
        )
        response = api.send_transac_email(email)
        logger.info(
            'Email template %s enviado a %s (message_id: %s)',
            template_id, destinatario_email, response.message_id,
        )
        return response
    except Exception as e:
        logger.error('Error al enviar email template %s a %s: %s', template_id, destinatario_email, e)
        raise


# ──────────────────────────────────────────────
# Contacto (notificación interna al admin + confirmación al usuario)
# ──────────────────────────────────────────────

def enviar_notificacion_contacto(contacto):
    """
    Envía email de notificación al admin cuando se recibe un formulario de contacto.

    Args:
        contacto: Instancia del modelo Contacto.
    """
    admin_email = settings.BREVO_SENDER_EMAIL
    if not admin_email:
        logger.warning('BREVO_SENDER_EMAIL no configurado. No se envió notificación de contacto.')
        return

    contenido = f"""
    <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; padding: 32px;">
      <h2 style="font-size: 18px; font-weight: 600; margin-bottom: 16px;">
        Nuevo mensaje de contacto — Ocaso
      </h2>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #333;">
        <tr><td style="padding: 6px 0; color: #888;">Nombre</td><td style="padding: 6px 0;">{contacto.nombre}</td></tr>
        <tr><td style="padding: 6px 0; color: #888;">Email</td><td style="padding: 6px 0;">{contacto.email}</td></tr>
        <tr><td style="padding: 6px 0; color: #888;">Teléfono</td><td style="padding: 6px 0;">{contacto.telefono or 'No proporcionado'}</td></tr>
        <tr><td style="padding: 6px 0; color: #888;">Asunto</td><td style="padding: 6px 0;">{contacto.asunto}</td></tr>
      </table>
      <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e5e5;">
      <p style="font-size: 14px; color: #333; white-space: pre-wrap; line-height: 1.6;">{contacto.mensaje}</p>
    </div>
    """

    enviar_email_transaccional(
        destinatario_email=admin_email,
        destinatario_nombre='Admin Ocaso',
        asunto=f'[Contacto] {contacto.asunto}',
        contenido_html=contenido,
    )


def enviar_confirmacion_contacto(contacto):
    """
    Envía email de confirmación al usuario que envió el formulario de contacto,
    informándole que su mensaje fue recibido y será atendido a la brevedad.

    Args:
        contacto: Instancia del modelo Contacto.
    """
    nombre = contacto.nombre.split()[0] if contacto.nombre else 'Cliente'

    contenido = f"""
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 32px;">
      <p style="font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #888; margin-bottom: 24px;">
        Ocaso
      </p>
      <h2 style="font-size: 22px; font-weight: 600; color: #111; margin-bottom: 8px;">
        Hemos recibido tu mensaje
      </h2>
      <p style="font-size: 15px; color: #555; line-height: 1.6; margin-bottom: 24px;">
        Hola {nombre}, gracias por ponerte en contacto con nosotros.
        Tu mensaje sobre <strong style="color: #111;">"{contacto.asunto}"</strong>
        ha sido recibido y lo atenderemos a la brevedad.
      </p>
      <div style="border-left: 2px solid #e5e5e5; padding: 12px 16px; margin-bottom: 24px;">
        <p style="font-size: 13px; color: #888; margin: 0 0 4px;">Tu mensaje</p>
        <p style="font-size: 14px; color: #333; margin: 0; white-space: pre-wrap; line-height: 1.5;">{contacto.mensaje[:300]}{"..." if len(contacto.mensaje) > 300 else ""}</p>
      </div>
      <p style="font-size: 13px; color: #888; line-height: 1.6; margin-bottom: 0;">
        Tiempo de respuesta habitual: 24–48 horas hábiles.<br>
        Si tu consulta es urgente, responde directamente a este correo.
      </p>
      <hr style="margin: 32px 0; border: none; border-top: 1px solid #f0f0f0;">
      <p style="font-size: 11px; color: #bbb; margin: 0;">
        Ocaso — Iluminación de diseño
      </p>
    </div>
    """

    enviar_email_transaccional(
        destinatario_email=contacto.email,
        destinatario_nombre=contacto.nombre,
        asunto='Hemos recibido tu mensaje — Ocaso',
        contenido_html=contenido,
    )


# ──────────────────────────────────────────────
# Registro — Template Brevo #8
# ──────────────────────────────────────────────

def enviar_email_registro(usuario):
    """
    Envía email de bienvenida al usuario tras registrarse.
    Usa template de Brevo con params: nombre, email, frontend_url.

    Args:
        usuario: Instancia del modelo Usuario.
    """
    _enviar_con_template(
        template_id=settings.BREVO_TEMPLATE_REGISTRO,
        destinatario_email=usuario.email,
        destinatario_nombre=usuario.first_name or usuario.username,
        params={
            'nombre': usuario.first_name or usuario.username,
            'email': usuario.email,
            'frontend_url': settings.FRONTEND_URL,
        },
    )


# ──────────────────────────────────────────────
# Confirmación de pedido — Template Brevo #7
# ──────────────────────────────────────────────

def enviar_confirmacion_pedido(pedido, pago):
    """
    Envía email de confirmación de compra al usuario.
    Usa template de Brevo con params: nombre, numero_pedido, items, total, dirección.

    Args:
        pedido: Instancia del modelo Pedido.
        pago: Instancia del modelo Pago.
    """
    usuario = pedido.usuario

    # Construir lista de items para el template
    items = []
    for item in pedido.items.select_related('producto'):
        items.append({
            'nombre': item.producto.nombre,
            'cantidad': int(item.cantidad),
            'precio_unitario': f'${item.precio_unitario}',
            'subtotal': f'${item.subtotal}',
        })

    _enviar_con_template(
        template_id=settings.BREVO_TEMPLATE_PEDIDO,
        destinatario_email=usuario.email,
        destinatario_nombre=usuario.first_name or usuario.username,
        params={
            'nombre': usuario.first_name or usuario.username,
            'numero_pedido': pedido.numero_pedido,
            'items': items,
            'total': f'${pedido.total}',
            'direccion': pedido.direccion_envio,
            'ciudad': pedido.ciudad,
            'estado_envio': pedido.estado_envio,
            'codigo_postal': pedido.codigo_postal,
        },
    )


# ──────────────────────────────────────────────
# Reset de contraseña — HTML inline
# ──────────────────────────────────────────────

def enviar_reset_password(usuario, reset_url):
    """
    Envía email con enlace para restablecer la contraseña.
    Usa HTML inline porque no hay template específico en Brevo para esto.

    Args:
        usuario: Instancia del modelo Usuario.
        reset_url: URL completa del frontend para restablecer la contraseña.
    """
    nombre = usuario.first_name or usuario.username

    contenido = f"""
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
      <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 8px;">Restablecer contraseña</h2>
      <p style="color: #555; margin-bottom: 24px;">
        Hola {nombre}, recibimos una solicitud para restablecer la contraseña de tu cuenta en Ocaso.
        Si no la realizaste, puedes ignorar este correo.
      </p>
      <a href="{reset_url}"
         style="display: inline-block; background: #000; color: #fff; padding: 12px 24px;
                text-decoration: none; font-size: 14px; font-weight: 500;">
        Restablecer contraseña
      </a>
      <p style="color: #888; font-size: 12px; margin-top: 24px;">
        Este enlace expira en 24 horas.<br>
        Si el botón no funciona, copia y pega esta URL en tu navegador:<br>
        <span style="word-break: break-all;">{reset_url}</span>
      </p>
    </div>
    """

    enviar_email_transaccional(
        destinatario_email=usuario.email,
        destinatario_nombre=nombre,
        asunto='Restablece tu contraseña — Ocaso',
        contenido_html=contenido,
    )


# ──────────────────────────────────────────────
# Newsletter — Agrega contacto + envía template Brevo #6
# ──────────────────────────────────────────────

def agregar_contacto_newsletter(email, nombre=''):
    """
    Agrega un contacto a la lista de newsletter en Brevo
    y envía email de confirmación con template.

    Args:
        email: Email del suscriptor.
        nombre: Nombre del suscriptor.
    """
    import sib_api_v3_sdk

    try:
        api = _get_contacts_api()
        contact = sib_api_v3_sdk.CreateContact(
            email=email,
            update_enabled=True,
            attributes={'FIRSTNAME': nombre} if nombre else None,
        )
        api.create_contact(contact)
        logger.info('Contacto agregado a Brevo newsletter: %s (%s)', email, nombre)
    except Exception as e:
        error_msg = str(e)
        if 'duplicate' in error_msg.lower() or 'already exist' in error_msg.lower():
            logger.info('Contacto ya existe en Brevo: %s', email)
        else:
            logger.error('Error al agregar contacto a Brevo: %s — %s', email, e)
            raise

    # Enviar email de confirmación de suscripción
    template_id = settings.BREVO_TEMPLATE_NEWSLETTER_CONFIRM
    if template_id:
        try:
            _enviar_con_template(
                template_id=template_id,
                destinatario_email=email,
                destinatario_nombre=nombre or 'Suscriptor',
                params={'nombre': nombre, 'email': email},
            )
        except Exception as e:
            logger.error('Error al enviar confirmación de newsletter a %s: %s', email, e)
