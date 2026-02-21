"""
Servicio post-pago.
Se ejecuta tras confirmar un pago aprobado en Mercado Pago.
Responsabilidades:
  1. Decrementar inventario (vía servicio de pedidos).
  2. Crear registro de Venta (snapshot).
  3. Enviar email de confirmación vía Brevo.
"""
import logging

from apps.pedidos.services import procesar_pedido_pagado

logger = logging.getLogger('clarte')


def procesar_post_pago(pago):
    """
    Orquesta las acciones posteriores a un pago aprobado.
    Recibe la instancia de Pago ya actualizada como aprobado.

    Pasos:
      1. Procesar pedido pagado (decrementa stock, cambia estado).
      2. Crear registro de venta (se implementará en app ventas).
      3. Enviar email de confirmación (se implementará en app common).
    """
    pedido = pago.pedido
    if not pedido:
        logger.error('Pago %s aprobado pero sin pedido asociado.', pago.id)
        return

    # 1. Decrementar inventario y marcar pedido como pagado
    resultado = procesar_pedido_pagado(pedido.id)
    logger.info(
        'Post-pago completado para pedido %s: %s',
        pedido.numero_pedido, resultado.get('message', ''),
    )

    # 2. Crear registro de venta
    try:
        from apps.ventas.services import crear_venta_desde_pedido
        crear_venta_desde_pedido(pedido)
    except Exception as e:
        logger.error('Error al crear venta para pedido %s: %s', pedido.numero_pedido, e)

    # 3. Email de confirmación de pedido
    try:
        from apps.common.servicios.brevo_service import enviar_confirmacion_pedido
        enviar_confirmacion_pedido(pedido, pago)
        logger.info('Email de confirmación enviado para pedido %s', pedido.numero_pedido)
    except Exception as e:
        logger.error('Error al enviar email de confirmación para pedido %s: %s', pedido.numero_pedido, e)
