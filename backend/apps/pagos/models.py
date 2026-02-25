"""
Modelo de Pago — registra cada transacción con Mercado Pago.
Vinculado 1:1 con un Pedido.
"""
from django.conf import settings
from django.db import models
from django.utils.translation import gettext_lazy as _


class Pago(models.Model):
    """Registro de pago procesado vía Mercado Pago."""

    class EstadoChoices(models.TextChoices):
        PENDIENTE = 'pendiente', _('Pendiente')
        APROBADO = 'aprobado', _('Aprobado')
        RECHAZADO = 'rechazado', _('Rechazado')
        CANCELADO = 'cancelado', _('Cancelado')
        REEMBOLSADO = 'reembolsado', _('Reembolsado')

    pedido = models.OneToOneField(
        'pedidos.Pedido',
        on_delete=models.PROTECT,
        related_name='pago',
        verbose_name=_('pedido'),
        null=True,
        blank=True,
    )
    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name='pagos',
        verbose_name=_('usuario'),
        null=True,
        blank=True,
    )

    # Identificadores de Mercado Pago
    mercadopago_preference_id = models.CharField(
        _('MP preference ID'),
        max_length=255,
        unique=True,
        null=True,
        blank=True,
    )
    mercadopago_payment_id = models.CharField(
        _('MP payment ID'),
        max_length=255,
        unique=True,
        null=True,
        blank=True,
    )

    # Estado del pago
    estado = models.CharField(
        _('estado'),
        max_length=20,
        choices=EstadoChoices.choices,
        default=EstadoChoices.PENDIENTE,
    )
    estado_detalle = models.CharField(
        _('detalle del estado'),
        max_length=255,
        blank=True,
        default='',
    )

    # Información financiera
    monto = models.DecimalField(_('monto'), max_digits=12, decimal_places=2)
    metodo = models.CharField(_('método de pago'), max_length=50, blank=True, default='')

    # Datos crudos de MP (para auditoría y debugging)
    raw_response = models.JSONField(_('respuesta cruda MP'), default=dict, blank=True)

    created_at = models.DateTimeField(_('fecha de creación'), auto_now_add=True)
    updated_at = models.DateTimeField(_('fecha de actualización'), auto_now=True)

    class Meta:
        verbose_name = _('pago')
        verbose_name_plural = _('pagos')
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['mercadopago_preference_id']),
            models.Index(fields=['mercadopago_payment_id']),
            models.Index(fields=['estado']),
        ]

    def __str__(self):
        return f'Pago {self.id} - {self.get_estado_display()} - ${self.monto}'
