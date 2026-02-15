"""
Configuración del admin de Django para el modelo Usuario.
"""
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import gettext_lazy as _

from .models import Usuario


@admin.register(Usuario)
class UsuarioAdmin(UserAdmin):
    """Admin personalizado con los campos adicionales de Clarté."""

    # Columnas visibles en la lista
    list_display = [
        'username',
        'email',
        'first_name',
        'last_name',
        'ciudad',
        'is_active',
        'is_staff',
        'date_joined',
    ]
    list_filter = ['is_active', 'is_staff', 'is_superuser', 'ciudad', 'estado']
    search_fields = ['username', 'email', 'first_name', 'last_name', 'telefono', 'rfc']
    ordering = ['-date_joined']

    # Fieldsets para la vista de detalle (edición)
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        (_('Información personal'), {
            'fields': ('first_name', 'last_name', 'email', 'telefono', 'rfc'),
        }),
        (_('Dirección de envío'), {
            'fields': ('direccion', 'ciudad', 'estado', 'codigo_postal'),
        }),
        (_('Permisos'), {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
        (_('Fechas importantes'), {
            'fields': ('last_login', 'date_joined'),
        }),
    )

    # Fieldsets para la vista de creación
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': (
                'username', 'email', 'first_name', 'last_name',
                'password1', 'password2',
            ),
        }),
    )
