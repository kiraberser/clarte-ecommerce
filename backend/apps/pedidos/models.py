"""
Modelos de pedidos: Pedido e ItemPedido.
Incluye generación automática de numero_pedido (LP-YYYYMMDD-XXXX)
y validación de transiciones de estado.
"""
import logging
from django.conf import settings
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

logger = logging.getLogger('clarte')


class Pedido(models.Model):
    """
    Pedido de compra. Agrupa items, dirección de envío y estado del flujo.
    El numero_pedido se genera automáticamente al crear con formato LP-YYYYMMDD-XXXX.
    """

    class EstadoChoices(models.TextChoices):
        PENDIENTE = 'pendiente', _('Pendiente')
        PAGADO = 'pagado', _('Pagado')
        ENVIADO = 'enviado', _('Enviado')
        ENTREGADO = 'entregado', _('Entregado')
        CANCELADO = 'cancelado', _('Cancelado')

    # Transiciones de estado válidas
    TRANSICIONES_VALIDAS = {
        EstadoChoices.PENDIENTE: [EstadoChoices.PAGADO, EstadoChoices.CANCELADO],
        EstadoChoices.PAGADO: [EstadoChoices.ENVIADO, EstadoChoices.CANCELADO],
        EstadoChoices.ENVIADO: [EstadoChoices.ENTREGADO],
        EstadoChoices.ENTREGADO: [],
        EstadoChoices.CANCELADO: [],
    }

    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name='pedidos',
        verbose_name=_('usuario'),
    )
    numero_pedido = models.CharField(
        _('número de pedido'),
        max_length=20,
        unique=True,
        editable=False,
    )
    estado = models.CharField(
        _('estado'),
        max_length=20,
        choices=EstadoChoices.choices,
        default=EstadoChoices.PENDIENTE,
    )
    subtotal = models.DecimalField(_('subtotal'), max_digits=12, decimal_places=2, default=0)
    total = models.DecimalField(_('total'), max_digits=12, decimal_places=2, default=0)

    # Dirección de envío (snapshot al momento del pedido)
    direccion_envio = models.CharField(_('dirección de envío'), max_length=255)
    ciudad = models.CharField(_('ciudad'), max_length=100)
    estado_envio = models.CharField(_('estado (envío)'), max_length=100)
    codigo_postal = models.CharField(_('código postal'), max_length=10)

    metodo_pago = models.CharField(_('método de pago'), max_length=50, blank=True, default='')
    mercadopago_payment_id = models.CharField(
        _('Mercado Pago payment ID'),
        max_length=255,
        blank=True,
        default='',
    )
    notas = models.TextField(_('notas'), blank=True, default='')

    created_at = models.DateTimeField(_('fecha de creación'), auto_now_add=True)
    updated_at = models.DateTimeField(_('fecha de actualización'), auto_now=True)

    class Meta:
        verbose_name = _('pedido')
        verbose_name_plural = _('pedidos')
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['numero_pedido']),
            models.Index(fields=['estado']),
            models.Index(fields=['usuario', 'estado']),
        ]

    def __str__(self):
        return f'{self.numero_pedido} - {self.get_estado_display()}'

    def save(self, *args, **kwargs):
        if not self.numero_pedido:
            self.numero_pedido = self._generar_numero_pedido()
        super().save(*args, **kwargs)

    @staticmethod
    def _generar_numero_pedido():
        """
        Genera un número de pedido único con formato LP-YYYYMMDD-XXXX.
        El sufijo XXXX es un secuencial diario que se auto-incrementa.
        """
        hoy = timezone.localdate()
        prefijo = f'LP-{hoy.strftime("%Y%m%d")}-'

        ultimo = (
            Pedido.objects
            .filter(numero_pedido__startswith=prefijo)
            .order_by('-numero_pedido')
            .values_list('numero_pedido', flat=True)
            .first()
        )

        if ultimo:
            secuencial = int(ultimo.split('-')[-1]) + 1
        else:
            secuencial = 1

        return f'{prefijo}{secuencial:04d}'

    def puede_transicionar_a(self, nuevo_estado):
        """Verifica si la transición de estado es válida."""
        return nuevo_estado in self.TRANSICIONES_VALIDAS.get(self.estado, [])

    def cambiar_estado(self, nuevo_estado):
        """
        Cambia el estado del pedido validando la transición.
        Lanza ValueError si la transición no es válida.
        """
        if not self.puede_transicionar_a(nuevo_estado):
            raise ValueError(
                f'Transición inválida: {self.estado} → {nuevo_estado}. '
                f'Transiciones permitidas: {self.TRANSICIONES_VALIDAS.get(self.estado, [])}'
            )
        estado_anterior = self.estado
        self.estado = nuevo_estado
        self.save(update_fields=['estado', 'updated_at'])
        logger.info(
            'Pedido %s cambió de estado: %s → %s',
            self.numero_pedido, estado_anterior, nuevo_estado,
        )

    def calcular_totales(self):
        """Recalcula subtotal y total a partir de los items."""
        self.subtotal = sum(item.subtotal for item in self.items.all())
        self.total = self.subtotal  # Aquí se podrían agregar impuestos/envío
        self.save(update_fields=['subtotal', 'total', 'updated_at'])


class ItemPedido(models.Model):
    """Item individual dentro de un pedido."""

    pedido = models.ForeignKey(
        Pedido,
        on_delete=models.CASCADE,
        related_name='items',
        verbose_name=_('pedido'),
    )
    producto = models.ForeignKey(
        'inventario.Producto',
        on_delete=models.PROTECT,
        related_name='items_pedido',
        verbose_name=_('producto'),
    )
    cantidad = models.PositiveIntegerField(_('cantidad'), default=1)
    precio_unitario = models.DecimalField(_('precio unitario'), max_digits=10, decimal_places=2)
    subtotal = models.DecimalField(_('subtotal'), max_digits=12, decimal_places=2)

    class Meta:
        verbose_name = _('item de pedido')
        verbose_name_plural = _('items de pedido')

    def __str__(self):
        return f'{self.producto.nombre} x{self.cantidad}'

    def save(self, *args, **kwargs):
        self.subtotal = self.precio_unitario * self.cantidad
        super().save(*args, **kwargs)
