"""
Modelos comunes: Contacto y SuscripcionNewsletter.
Funcionalidades públicas sin autenticación.
"""
from django.db import models
from django.utils.translation import gettext_lazy as _


class Contacto(models.Model):
    """Mensaje de contacto enviado desde el formulario público."""

    nombre = models.CharField(_('nombre'), max_length=200)
    email = models.EmailField(_('correo electrónico'))
    telefono = models.CharField(_('teléfono'), max_length=20, blank=True, default='')
    asunto = models.CharField(_('asunto'), max_length=300)
    mensaje = models.TextField(_('mensaje'))
    leido = models.BooleanField(_('leído'), default=False)
    created_at = models.DateTimeField(_('fecha de envío'), auto_now_add=True)

    class Meta:
        verbose_name = _('contacto')
        verbose_name_plural = _('contactos')
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.nombre} — {self.asunto}'


class SuscripcionNewsletter(models.Model):
    """Suscripción al newsletter de Ocaso."""

    nombre = models.CharField(_('nombre'), max_length=200, blank=True, default='')
    email = models.EmailField(_('correo electrónico'), unique=True)
    activo = models.BooleanField(_('activo'), default=True)
    created_at = models.DateTimeField(_('fecha de suscripción'), auto_now_add=True)

    class Meta:
        verbose_name = _('suscripción newsletter')
        verbose_name_plural = _('suscripciones newsletter')
        ordering = ['-created_at']

    def __str__(self):
        return self.email
