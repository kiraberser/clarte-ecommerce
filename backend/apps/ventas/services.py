"""
Servicio de creación de ventas.
Llamado por el post_pago_service al confirmarse un pago.
"""
import logging

from django.db import transaction

from .models import Venta, ItemVenta

logger = logging.getLogger('clarte')


def crear_venta_desde_pedido(pedido):
    """
    Crea un registro de Venta + ItemVenta a partir de un pedido pagado.
    Genera también un items_snapshot JSON para auditoría.
    Idempotente: si ya existe una venta para el pedido, la retorna sin crear.
    """
    # Idempotencia
    venta_existente = Venta.objects.filter(pedido=pedido).first()
    if venta_existente:
        logger.info('Venta ya existe para pedido %s (Venta #%s).', pedido.numero_pedido, venta_existente.id)
        return venta_existente

    items_pedido = pedido.items.select_related('producto')
    snapshot = []

    with transaction.atomic():
        venta = Venta.objects.create(
            pedido=pedido,
            usuario=pedido.usuario,
            total=pedido.total,
        )

        for item in items_pedido:
            item_data = {
                'producto_id': item.producto_id,
                'nombre': item.producto.nombre,
                'sku': item.producto.sku,
                'cantidad': item.cantidad,
                'precio_unitario': str(item.precio_unitario),
                'subtotal': str(item.subtotal),
            }
            snapshot.append(item_data)

            ItemVenta.objects.create(
                venta=venta,
                producto=item.producto,
                nombre_producto=item.producto.nombre,
                sku=item.producto.sku,
                cantidad=item.cantidad,
                precio_unitario=item.precio_unitario,
                subtotal=item.subtotal,
            )

        venta.items_snapshot = snapshot
        venta.save(update_fields=['items_snapshot'])

    logger.info(
        'Venta #%s creada para pedido %s (%d items, total $%s).',
        venta.id, pedido.numero_pedido, len(snapshot), venta.total,
    )
    return venta
