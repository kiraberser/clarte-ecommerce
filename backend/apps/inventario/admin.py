"""
Configuración del admin de Django para modelos de inventario.
"""
from django.contrib import admin
from django.utils.html import format_html

from .models import Categoria, Producto


@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'slug', 'activo', 'orden', 'productos_count']
    list_filter = ['activo']
    search_fields = ['nombre']
    prepopulated_fields = {'slug': ('nombre',)}
    list_editable = ['orden', 'activo']
    ordering = ['orden', 'nombre']

    def productos_count(self, obj):
        return obj.productos.filter(activo=True).count()
    productos_count.short_description = 'Productos activos'


@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display = [
        'nombre', 'sku', 'categoria', 'precio',
        'precio_oferta', 'stock', 'activo', 'destacado', 'created_at',
    ]
    list_filter = ['activo', 'destacado', 'categoria', 'created_at']
    search_fields = ['nombre', 'sku', 'descripcion']
    prepopulated_fields = {'slug': ('nombre',)}
    list_editable = ['precio', 'precio_oferta', 'stock', 'activo', 'destacado']
    readonly_fields = ['created_at', 'updated_at']
    ordering = ['-created_at']

    fieldsets = (
        (None, {
            'fields': ('nombre', 'slug', 'descripcion', 'categoria'),
        }),
        ('Precios', {
            'fields': ('precio', 'precio_oferta', 'sku'),
        }),
        ('Imágenes', {
            'fields': ('imagen_principal', 'imagenes'),
        }),
        ('Inventario y estado', {
            'fields': ('stock', 'activo', 'destacado'),
        }),
        ('Fechas', {
            'fields': ('created_at', 'updated_at'),
        }),
    )
