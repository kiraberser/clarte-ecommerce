"""
Modelos de ventas: Venta e ItemVenta.
Registra un snapshot inmutable de cada pedido pagado para auditoría.
"""
from django.conf import settings
from django.db import models
from django.utils.translation import gettext_lazy as _


class Venta(models.Model):
    """
    Registro de venta confirmada.
    Se crea automáticamente al aprobarse un pago.
    items_snapshot guarda el detalle completo al momento de la venta.
    """

    pedido = models.OneToOneField(
        'pedidos.Pedido',
        on_delete=models.PROTECT,
        related_name='venta',
        verbose_name=_('pedido'),
    )
    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name='ventas',
        verbose_name=_('usuario'),
    )
    total = models.DecimalField(_('total'), max_digits=12, decimal_places=2)
    fecha_venta = models.DateTimeField(_('fecha de venta'), auto_now_add=True)
    items_snapshot = models.JSONField(
        _('snapshot de items'),
        default=list,
        blank=True,
        help_text=_('Detalle de productos al momento de la venta.'),
    )

    class Meta:
        verbose_name = _('venta')
        verbose_name_plural = _('ventas')
        ordering = ['-fecha_venta']
        indexes = [
            models.Index(fields=['usuario']),
            models.Index(fields=['fecha_venta']),
        ]

    def __str__(self):
        return f'Venta #{self.id} - {self.pedido.numero_pedido} - ${self.total}'


class ItemVenta(models.Model):
    """
    Item individual de una venta.
    Mantiene referencia al producto (SET_NULL) y guarda nombre/sku
    por si el producto se elimina o modifica en el futuro.
    """

    venta = models.ForeignKey(
        Venta,
        on_delete=models.CASCADE,
        related_name='items',
        verbose_name=_('venta'),
    )
    producto = models.ForeignKey(
        'inventario.Producto',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='items_venta',
        verbose_name=_('producto'),
    )
    nombre_producto = models.CharField(_('nombre del producto'), max_length=300)
    sku = models.CharField(_('SKU'), max_length=50)
    cantidad = models.PositiveIntegerField(_('cantidad'))
    precio_unitario = models.DecimalField(_('precio unitario'), max_digits=10, decimal_places=2)
    subtotal = models.DecimalField(_('subtotal'), max_digits=12, decimal_places=2)

    class Meta:
        verbose_name = _('item de venta')
        verbose_name_plural = _('items de venta')

    def __str__(self):
        return f'{self.nombre_producto} x{self.cantidad}'
