"""
Filtros para la app de inventario.
Permite filtrar productos por categoría, rango de precio, destacado y búsqueda.
"""
from django_filters import rest_framework as filters

from .models import Producto


class ProductoFilter(filters.FilterSet):
    """
    Filtro avanzado para productos.
    Uso en query params:
      ?categoria=<id>
      ?categoria_slug=lamparas-de-techo
      ?precio_min=500&precio_max=5000
      ?destacado=true
      ?en_stock=true
    """
    categoria_slug = filters.CharFilter(
        field_name='categoria__slug',
        lookup_expr='exact',
    )
    precio_min = filters.NumberFilter(
        field_name='precio',
        lookup_expr='gte',
    )
    precio_max = filters.NumberFilter(
        field_name='precio',
        lookup_expr='lte',
    )
    en_stock = filters.BooleanFilter(
        method='filtrar_en_stock',
    )

    class Meta:
        model = Producto
        fields = ['categoria', 'destacado']

    def filtrar_en_stock(self, queryset, name, value):
        if value:
            return queryset.filter(stock__gt=0)
        return queryset.filter(stock=0)
