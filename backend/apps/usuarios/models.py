"""
Modelo de Usuario personalizado para Clarté.
Extiende AbstractUser con campos adicionales de perfil y dirección.
"""
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _


class Usuario(AbstractUser):
    """
    Usuario personalizado. Usa email como identificador visual,
    pero mantiene username como campo de login por compatibilidad con Django.
    """
    email = models.EmailField(_('correo electrónico'), unique=True)

    # Datos de contacto y envío
    telefono = models.CharField(
        _('teléfono'),
        max_length=20,
        blank=True,
        default='',
    )
    direccion = models.CharField(
        _('dirección'),
        max_length=255,
        blank=True,
        default='',
    )
    ciudad = models.CharField(
        _('ciudad'),
        max_length=100,
        blank=True,
        default='',
    )
    estado = models.CharField(
        _('estado'),
        max_length=100,
        blank=True,
        default='',
    )
    codigo_postal = models.CharField(
        _('código postal'),
        max_length=10,
        blank=True,
        default='',
    )
    rfc = models.CharField(
        _('RFC'),
        max_length=13,
        blank=True,
        default='',
        help_text=_('Registro Federal de Contribuyentes (opcional).'),
    )

    class Meta:
        verbose_name = _('usuario')
        verbose_name_plural = _('usuarios')
        ordering = ['-date_joined']

    def __str__(self):
        return self.email or self.username

    def get_direccion_completa(self):
        """Retorna la dirección formateada en una sola línea."""
        partes = filter(None, [
            self.direccion,
            self.ciudad,
            self.estado,
            self.codigo_postal,
        ])
        return ', '.join(partes)
