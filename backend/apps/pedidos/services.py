"""
Servicios de lógica de negocio para pedidos.
Desacoplado de las views. Usado por la app de pagos al confirmar un pago.
"""
import logging

from django.db import transaction

from .models import Pedido

logger = logging.getLogger('clarte')


def procesar_pedido_pagado(pedido_id):
    """
    Procesa un pedido tras confirmarse el pago.
    Ejecuta dentro de una transacción atómica:
      1. Marca el pedido como 'pagado'.
      2. Decrementa stock de cada producto (atómico con F()).
      3. Retorna resultado para que pagos/ventas lo usen.

    Lanza ValueError si el pedido no existe, ya fue procesado,
    o no hay stock suficiente.
    """
    with transaction.atomic():
        try:
            pedido = Pedido.objects.select_for_update().get(id=pedido_id)
        except Pedido.DoesNotExist:
            raise ValueError(f'Pedido con ID {pedido_id} no encontrado.')

        # Idempotencia: si ya está pagado, no reprocesar
        if pedido.estado == Pedido.EstadoChoices.PAGADO:
            logger.warning('Pedido %s ya fue procesado como pagado.', pedido.numero_pedido)
            return {'success': True, 'message': 'Pedido ya procesado.', 'pedido': pedido}

        if pedido.estado != Pedido.EstadoChoices.PENDIENTE:
            raise ValueError(
                f'Pedido {pedido.numero_pedido} no se puede marcar como pagado. '
                f'Estado actual: {pedido.get_estado_display()}'
            )

        # Decrementar stock de cada item
        for item in pedido.items.select_related('producto'):
            exito = item.producto.decrementar_stock(item.cantidad)
            if not exito:
                raise ValueError(
                    f'Stock insuficiente para "{item.producto.nombre}" '
                    f'(SKU: {item.producto.sku}). '
                    f'Solicitado: {item.cantidad}, disponible: {item.producto.stock}.'
                )

        # Cambiar estado del pedido
        pedido.estado = Pedido.EstadoChoices.PAGADO
        pedido.save(update_fields=['estado', 'updated_at'])

        logger.info(
            'Pedido %s procesado como pagado. Stock decrementado para %d items.',
            pedido.numero_pedido,
            pedido.items.count(),
        )

        return {
            'success': True,
            'message': f'Pedido {pedido.numero_pedido} procesado exitosamente.',
            'pedido': pedido,
        }
