"""
Modelos del sistema de cupones de descuento.
Cupon: define código, tipo, valor y restricciones.
CuponUso: registro de uso de un cupón tras confirmar el pago.
"""
import logging
from decimal import Decimal

from django.conf import settings
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

logger = logging.getLogger('clarte')


class Cupon(models.Model):
    TIPO_PORCENTAJE = 'porcentaje'
    TIPO_MONTO_FIJO = 'monto_fijo'
    TIPO_CHOICES = [
        (TIPO_PORCENTAJE, 'Porcentaje'),
        (TIPO_MONTO_FIJO, 'Monto Fijo'),
    ]

    codigo = models.CharField(_('código'), max_length=50, unique=True)
    nombre = models.CharField(_('nombre'), max_length=100)
    tipo_descuento = models.CharField(
        _('tipo de descuento'),
        max_length=20,
        choices=TIPO_CHOICES,
        default=TIPO_PORCENTAJE,
    )
    valor_descuento = models.DecimalField(
        _('valor del descuento'),
        max_digits=10,
        decimal_places=2,
    )
    minimo_compra = models.DecimalField(
        _('mínimo de compra'),
        max_digits=10,
        decimal_places=2,
        default=Decimal('0'),
    )
    maximo_usos = models.IntegerField(
        _('máximo de usos'),
        null=True,
        blank=True,
        help_text=_('Dejar en blanco para usos ilimitados.'),
    )
    usos_actuales = models.IntegerField(_('usos actuales'), default=0)
    activo = models.BooleanField(_('activo'), default=True)
    fecha_inicio = models.DateTimeField(_('fecha de inicio'), null=True, blank=True)
    fecha_fin = models.DateTimeField(_('fecha de fin'), null=True, blank=True)
    created_at = models.DateTimeField(_('fecha de creación'), auto_now_add=True)

    class Meta:
        verbose_name = _('cupón')
        verbose_name_plural = _('cupones')
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.codigo} ({self.nombre})'

    def calcular_descuento(self, subtotal: Decimal) -> Decimal:
        """Calcula el monto de descuento para un subtotal dado."""
        subtotal = Decimal(str(subtotal))
        if self.tipo_descuento == self.TIPO_PORCENTAJE:
            return (subtotal * self.valor_descuento / Decimal('100')).quantize(Decimal('0.01'))
        # Monto fijo: no puede superar el subtotal
        return min(self.valor_descuento, subtotal)

    def es_valido(self, subtotal: Decimal) -> tuple[bool, str]:
        """
        Valida si el cupón puede usarse con el subtotal dado.
        Retorna (True, 'OK') o (False, mensaje_error).
        """
        subtotal = Decimal(str(subtotal))

        if not self.activo:
            return False, 'El cupón no está activo.'

        ahora = timezone.now()
        if self.fecha_inicio and ahora < self.fecha_inicio:
            return False, 'El cupón aún no está vigente.'
        if self.fecha_fin and ahora > self.fecha_fin:
            return False, 'El cupón ha expirado.'

        if self.maximo_usos is not None and self.usos_actuales >= self.maximo_usos:
            return False, 'El cupón ha alcanzado su límite de usos.'

        if subtotal < self.minimo_compra:
            return False, f'El subtotal mínimo requerido es ${self.minimo_compra:,.2f}.'

        return True, 'OK'


class CuponUso(models.Model):
    """Registro de uso de un cupón en un pedido. Se crea tras confirmar el pago."""

    cupon = models.ForeignKey(
        Cupon,
        on_delete=models.PROTECT,
        related_name='usos',
        verbose_name=_('cupón'),
    )
    pedido = models.ForeignKey(
        'pedidos.Pedido',
        on_delete=models.PROTECT,
        related_name='cupon_uso',
        verbose_name=_('pedido'),
    )
    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name='cupones_usados',
        verbose_name=_('usuario'),
    )
    descuento_aplicado = models.DecimalField(
        _('descuento aplicado'),
        max_digits=12,
        decimal_places=2,
    )
    created_at = models.DateTimeField(_('fecha de uso'), auto_now_add=True)

    class Meta:
        verbose_name = _('uso de cupón')
        verbose_name_plural = _('usos de cupón')
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.cupon.codigo} — Pedido {self.pedido.numero_pedido}'
