"""
Configuración del admin de Django para modelos de ventas.
"""
from django.contrib import admin

from .models import Venta, ItemVenta


class ItemVentaInline(admin.TabularInline):
    model = ItemVenta
    extra = 0
    readonly_fields = [
        'producto', 'nombre_producto', 'sku',
        'cantidad', 'precio_unitario', 'subtotal',
    ]
    can_delete = False


@admin.register(Venta)
class VentaAdmin(admin.ModelAdmin):
    list_display = ['id', 'pedido', 'usuario', 'total', 'fecha_venta']
    list_filter = ['fecha_venta']
    search_fields = ['pedido__numero_pedido', 'usuario__email']
    readonly_fields = ['pedido', 'usuario', 'total', 'fecha_venta', 'items_snapshot']
    ordering = ['-fecha_venta']
    inlines = [ItemVentaInline]

    fieldsets = (
        (None, {
            'fields': ('pedido', 'usuario', 'total', 'fecha_venta'),
        }),
        ('Snapshot JSON', {
            'classes': ('collapse',),
            'fields': ('items_snapshot',),
        }),
    )


@admin.register(ItemVenta)
class ItemVentaAdmin(admin.ModelAdmin):
    list_display = ['venta', 'nombre_producto', 'sku', 'cantidad', 'precio_unitario', 'subtotal']
    search_fields = ['nombre_producto', 'sku', 'venta__pedido__numero_pedido']
    readonly_fields = ['subtotal']
