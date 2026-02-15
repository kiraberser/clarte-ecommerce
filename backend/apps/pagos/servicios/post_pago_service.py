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

    # 2. Crear registro de venta (se activa cuando se implemente app ventas)
    try:
        from apps.ventas.services import crear_venta_desde_pedido
        crear_venta_desde_pedido(pedido)
    except ImportError:
        logger.debug('App ventas aún no implementada. Omitiendo creación de venta.')
    except Exception as e:
        logger.error('Error al crear venta para pedido %s: %s', pedido.numero_pedido, e)

    # 3. Email de confirmación (Brevo pendiente de integrar)
    logger.info(
        'Email de confirmación pendiente (Brevo no integrado) para pedido %s, pago %s',
        pedido.numero_pedido, pago.id,
    )
