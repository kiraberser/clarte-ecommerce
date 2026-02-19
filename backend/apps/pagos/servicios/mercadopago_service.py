"""
Servicio de integración con Mercado Pago.
Encapsula la creación de preferencias y el procesamiento de webhooks.
Toda la lógica de MP vive aquí, NO en las views.
"""
import hashlib
import hmac
import logging

import mercadopago
from django.conf import settings
from django.db import transaction

from apps.pagos.models import Pago
from apps.pedidos.models import Pedido

logger = logging.getLogger('clarte')

# Mapeo de estados de Mercado Pago a estados internos
MP_STATUS_MAP = {
    'approved': Pago.EstadoChoices.APROBADO,
    'rejected': Pago.EstadoChoices.RECHAZADO,
    'cancelled': Pago.EstadoChoices.CANCELADO,
    'refunded': Pago.EstadoChoices.REEMBOLSADO,
    'in_process': Pago.EstadoChoices.PENDIENTE,
    'pending': Pago.EstadoChoices.PENDIENTE,
}


def _get_sdk():
    """Retorna una instancia del SDK de Mercado Pago."""
    access_token = settings.MERCADOPAGO_ACCESS_TOKEN
    if not access_token:
        raise ValueError('MERCADOPAGO_ACCESS_TOKEN no configurado.')
    return mercadopago.SDK(access_token)


def crear_preferencia(pedido, usuario):
    """
    Crea una preferencia de pago en Mercado Pago para un pedido.

    Flujo:
      1. Crear registro de Pago local (estado pendiente).
      2. Construir items y datos del pagador.
      3. Llamar a la API de MP para crear la preferencia.
      4. Guardar el preference_id en el Pago local.

    Retorna dict con preference_id, init_point y pago_id.
    Lanza ValueError si el pedido no es válido para pago.
    """
    if pedido.estado != Pedido.EstadoChoices.PENDIENTE:
        raise ValueError(
            f'El pedido {pedido.numero_pedido} no está disponible para pago. '
            f'Estado actual: {pedido.get_estado_display()}'
        )

    sdk = _get_sdk()

    # 1. Crear registro de Pago local
    pago = Pago.objects.create(
        pedido=pedido,
        usuario=usuario,
        monto=pedido.total,
        estado=Pago.EstadoChoices.PENDIENTE,
    )

    # 2. Construir items para MP
    items_mp = []
    for item in pedido.items.select_related('producto'):
        items_mp.append({
            'title': item.producto.nombre[:250],
            'quantity': int(item.cantidad),
            'unit_price': float(item.precio_unitario),
            'currency_id': 'MXN',
        })

    # 3. Construir datos de preferencia
    preference_data = {
        'items': items_mp,
        'payer': {
            'name': usuario.first_name or 'Cliente',
            'surname': usuario.last_name or 'Ocaso',
            'email': usuario.email,
        },
        'back_urls': {
            'success': f'{settings.FRONTEND_URL}/pago/exito',
            'failure': f'{settings.FRONTEND_URL}/pago/fallo',
            'pending': f'{settings.FRONTEND_URL}/pago/pendiente',
        },
        'auto_return': 'approved',
        'external_reference': str(pago.id),
        'notification_url': f'{settings.BACKEND_URL}/api/v1/pagos/webhook/',
        'expires': True,
    }

    # 4. Crear preferencia en MP
    response = sdk.preference().create(preference_data)

    if response['status'] not in [200, 201]:
        pago.delete()
        logger.error('Error al crear preferencia en MP: %s', response)
        raise ValueError('Error al crear preferencia de pago en Mercado Pago.')

    preference = response['response']

    # 5. Actualizar el Pago local con datos de MP
    pago.mercadopago_preference_id = preference['id']
    pago.raw_response = preference
    pago.save(update_fields=['mercadopago_preference_id', 'raw_response'])

    logger.info(
        'Preferencia MP creada: %s para pedido %s',
        preference['id'], pedido.numero_pedido,
    )

    return {
        'preference_id': preference['id'],
        'init_point': preference['init_point'],
        'pago_id': pago.id,
    }


def procesar_pago_card(pedido, usuario, card_data):
    """
    Procesa un pago con tarjeta usando los datos del Card Payment Brick.

    card_data debe contener: token, payment_method_id, issuer_id,
    installments, payer (email, identification).

    Flujo:
      1. Crear registro de Pago local (estado pendiente).
      2. Llamar a la Payment API de MP con el token del Brick.
      3. Actualizar el Pago local con la respuesta.
      4. Si es aprobado, ejecutar post-pago.

    Retorna dict con status, status_detail, pago_id.
    """
    if pedido.estado != Pedido.EstadoChoices.PENDIENTE:
        raise ValueError(
            f'El pedido {pedido.numero_pedido} no está disponible para pago. '
            f'Estado actual: {pedido.get_estado_display()}'
        )

    sdk = _get_sdk()

    # 1. Crear registro de Pago local
    pago = Pago.objects.create(
        pedido=pedido,
        usuario=usuario,
        monto=pedido.total,
        estado=Pago.EstadoChoices.PENDIENTE,
    )

    # 2. Construir payload para Payment API
    payer_data = card_data.get('payer', {})
    payer_email = payer_data.get('email') or usuario.email

    identification = payer_data.get('identification', {})
    id_type = identification.get('type', '').strip()
    id_number = identification.get('number', '').strip()

    # MP México requiere identification — usar RFC genérico como fallback
    if not id_type or not id_number:
        id_type = 'RFC'
        id_number = 'XAXX010101000'

    payer_payload = {
        'email': payer_email,
        'identification': {
            'type': id_type,
            'number': id_number,
        },
    }

    payment_data = {
        'transaction_amount': float(pedido.total),
        'token': card_data['token'],
        'installments': int(card_data['installments']),
        'payment_method_id': card_data['payment_method_id'],
        'issuer_id': str(card_data.get('issuer_id', '')),
        'payer': payer_payload,
        'external_reference': str(pago.id),
        'description': f'Pedido #{pedido.numero_pedido} - Ocaso',
    }

    # 3. Crear pago en MP (llamada directa para obtener respuesta completa)
    import requests as http_requests
    access_token = settings.MERCADOPAGO_ACCESS_TOKEN

    mp_response = http_requests.post(
        'https://api.mercadopago.com/v1/payments',
        json=payment_data,
        headers={
            'Authorization': f'Bearer {access_token}',
            'Content-Type': 'application/json',
            'X-Idempotency-Key': f'pago-{pago.id}',
        },
    )
    response_status = mp_response.status_code
    payment_response = mp_response.json()

    if response_status not in [200, 201]:
        pago.delete()
        logger.error('Error al crear pago en MP: status=%s, body=%s', response_status, payment_response)
        raise ValueError('Error al procesar el pago en Mercado Pago.')

    # 4. Actualizar Pago local
    mp_status = payment_response.get('status', '')
    nuevo_estado = MP_STATUS_MAP.get(mp_status, Pago.EstadoChoices.PENDIENTE)

    pago.mercadopago_payment_id = str(payment_response.get('id', ''))
    pago.estado = nuevo_estado
    pago.estado_detalle = payment_response.get('status_detail', '')
    pago.metodo = payment_response.get('payment_method_id', '')
    pago.raw_response = payment_response
    pago.save()

    logger.info(
        'Pago card procesado: pago_id=%s, mp_status=%s, pedido=%s',
        pago.id, mp_status, pedido.numero_pedido,
    )

    # 5. Si es aprobado, ejecutar post-pago
    if nuevo_estado == Pago.EstadoChoices.APROBADO:
        from apps.pagos.servicios.post_pago_service import procesar_post_pago
        try:
            procesar_post_pago(pago)
        except Exception as e:
            logger.error('Error en post-pago para pago %s: %s', pago.id, e, exc_info=True)

    return {
        'status': mp_status,
        'status_detail': payment_response.get('status_detail', ''),
        'pago_id': pago.id,
    }


def verificar_firma_webhook(data_id, x_signature, x_request_id):
    """
    Verifica la firma HMAC del webhook de Mercado Pago.
    Retorna True si la firma es válida o si no hay secret configurado.
    """
    webhook_secret = settings.MERCADOPAGO_WEBHOOK_SECRET
    if not webhook_secret or not x_signature or not x_request_id:
        return True  # Sin secret configurado, no se verifica

    parts = {}
    for part in x_signature.split(','):
        kv = part.split('=', 1)
        if len(kv) == 2:
            parts[kv[0].strip()] = kv[1].strip()

    ts = parts.get('ts')
    v1_hash = parts.get('v1')

    if not ts or not v1_hash:
        return True

    manifest = f'id:{data_id};request-id:{x_request_id};ts:{ts};'
    hmac_obj = hmac.new(
        webhook_secret.encode(),
        msg=manifest.encode(),
        digestmod=hashlib.sha256,
    )
    return hmac.compare_digest(hmac_obj.hexdigest(), v1_hash)


def procesar_notificacion_webhook(data_id):
    """
    Procesa una notificación de pago recibida por webhook de MP.

    Flujo:
      1. Consultar el pago en la API de MP.
      2. Buscar el Pago local por external_reference.
      3. Actualizar estado del Pago (idempotente).
      4. Si es aprobado, delegar al servicio post-pago.

    Retorna dict con resultado del procesamiento.
    """
    sdk = _get_sdk()

    # 1. Consultar pago en MP
    payment_response = sdk.payment().get(data_id)
    payment_data = payment_response.get('response')

    if not payment_data or payment_response.get('status') != 200:
        logger.error('Error consultando pago %s en MP: %s', data_id, payment_response)
        raise ValueError(f'Error al consultar pago {data_id} en Mercado Pago.')

    external_reference = payment_data.get('external_reference')
    if not external_reference:
        raise ValueError('Webhook sin external_reference.')

    mp_status = payment_data.get('status', '')
    nuevo_estado = MP_STATUS_MAP.get(mp_status, Pago.EstadoChoices.PENDIENTE)

    # 2. Actualizar Pago local (atómico + lock)
    with transaction.atomic():
        pago = Pago.objects.select_for_update().get(id=int(external_reference))

        # Actualizar datos informativos
        pago.mercadopago_payment_id = str(payment_data['id'])
        pago.estado_detalle = payment_data.get('status_detail', '')
        pago.metodo = payment_data.get('payment_method_id', '')
        pago.raw_response = payment_data

        # IDEMPOTENCIA: solo actuar si el estado cambió
        if pago.estado == nuevo_estado:
            pago.save(update_fields=[
                'mercadopago_payment_id', 'estado_detalle', 'metodo',
                'raw_response', 'updated_at',
            ])
            logger.info('Webhook idempotente: pago %s ya en estado %s', pago.id, nuevo_estado)
            return {'action': 'ignored', 'reason': 'Estado sin cambios.'}

        estado_anterior = pago.estado
        pago.estado = nuevo_estado
        pago.save()

        logger.info(
            'Pago %s actualizado: %s → %s (MP payment: %s)',
            pago.id, estado_anterior, nuevo_estado, data_id,
        )

        # 3. Si es aprobado, ejecutar procesamiento post-pago
        if nuevo_estado == Pago.EstadoChoices.APROBADO:
            from apps.pagos.servicios.post_pago_service import procesar_post_pago
            try:
                procesar_post_pago(pago)
            except ValueError as e:
                logger.warning('Error de negocio en post-pago: %s', e)
            except Exception as e:
                # No revertimos el pago (MP ya cobró), pero alertamos
                logger.error('Error crítico en post-pago para pago %s: %s', pago.id, e, exc_info=True)

    return {'action': 'updated', 'estado_anterior': estado_anterior, 'nuevo_estado': nuevo_estado}
