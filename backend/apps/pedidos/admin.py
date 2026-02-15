"""
Configuración del admin de Django para modelos de pedidos.
"""
from django.contrib import admin

from .models import Pedido, ItemPedido


class ItemPedidoInline(admin.TabularInline):
    """Inline para ver/editar items dentro del pedido."""
    model = ItemPedido
    extra = 0
    readonly_fields = ['producto', 'cantidad', 'precio_unitario', 'subtotal']
    can_delete = False


@admin.register(Pedido)
class PedidoAdmin(admin.ModelAdmin):
    list_display = [
        'numero_pedido', 'usuario', 'estado', 'total',
        'ciudad', 'metodo_pago', 'created_at',
    ]
    list_filter = ['estado', 'created_at', 'metodo_pago']
    search_fields = ['numero_pedido', 'usuario__email', 'usuario__username']
    readonly_fields = [
        'numero_pedido', 'usuario', 'subtotal', 'total',
        'created_at', 'updated_at',
    ]
    ordering = ['-created_at']
    inlines = [ItemPedidoInline]

    fieldsets = (
        ('Pedido', {
            'fields': ('numero_pedido', 'usuario', 'estado'),
        }),
        ('Totales', {
            'fields': ('subtotal', 'total'),
        }),
        ('Dirección de envío', {
            'fields': ('direccion_envio', 'ciudad', 'estado_envio', 'codigo_postal'),
        }),
        ('Pago', {
            'fields': ('metodo_pago', 'mercadopago_payment_id'),
        }),
        ('Notas y fechas', {
            'fields': ('notas', 'created_at', 'updated_at'),
        }),
    )


@admin.register(ItemPedido)
class ItemPedidoAdmin(admin.ModelAdmin):
    list_display = ['pedido', 'producto', 'cantidad', 'precio_unitario', 'subtotal']
    list_filter = ['pedido__estado']
    search_fields = ['pedido__numero_pedido', 'producto__nombre']
    readonly_fields = ['subtotal']
