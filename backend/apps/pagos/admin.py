"""
Configuración del admin de Django para el modelo Pago.
"""
from django.contrib import admin

from .models import Pago


@admin.register(Pago)
class PagoAdmin(admin.ModelAdmin):
    list_display = [
        'id', 'pedido', 'usuario', 'estado', 'monto',
        'metodo', 'mercadopago_payment_id', 'created_at',
    ]
    list_filter = ['estado', 'metodo', 'created_at']
    search_fields = [
        'mercadopago_preference_id', 'mercadopago_payment_id',
        'pedido__numero_pedido', 'usuario__email',
    ]
    readonly_fields = [
        'mercadopago_preference_id', 'mercadopago_payment_id',
        'estado_detalle', 'raw_response', 'created_at', 'updated_at',
    ]
    ordering = ['-created_at']

    fieldsets = (
        ('Relaciones', {
            'fields': ('pedido', 'usuario'),
        }),
        ('Estado y monto', {
            'fields': ('estado', 'estado_detalle', 'monto', 'metodo'),
        }),
        ('Mercado Pago', {
            'fields': ('mercadopago_preference_id', 'mercadopago_payment_id'),
        }),
        ('Datos crudos', {
            'classes': ('collapse',),
            'fields': ('raw_response',),
        }),
        ('Fechas', {
            'fields': ('created_at', 'updated_at'),
        }),
    )
