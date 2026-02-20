"""
Configuración del admin de Django para modelos de common.
"""
from django.contrib import admin

from .models import Contacto, SuscripcionNewsletter


@admin.register(Contacto)
class ContactoAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'email', 'asunto', 'estado', 'created_at']
    list_filter = ['estado', 'created_at']
    search_fields = ['nombre', 'email', 'asunto', 'mensaje']
    list_editable = ['estado']
    readonly_fields = ['created_at']
    ordering = ['-created_at']

    fieldsets = (
        ('Remitente', {
            'fields': ('nombre', 'email', 'telefono'),
        }),
        ('Mensaje', {
            'fields': ('asunto', 'mensaje'),
        }),
        ('Estado', {
            'fields': ('estado', 'created_at'),
        }),
    )


@admin.register(SuscripcionNewsletter)
class SuscripcionNewsletterAdmin(admin.ModelAdmin):
    list_display = ['email', 'activo', 'created_at']
    list_filter = ['activo', 'created_at']
    search_fields = ['email']
    list_editable = ['activo']
    ordering = ['-created_at']
