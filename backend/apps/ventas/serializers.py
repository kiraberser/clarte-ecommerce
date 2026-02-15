"""
Serializers para la app de ventas (solo admin).
"""
from django.db.models import Sum, Count
from django.db.models.functions import TruncDate, TruncMonth
from rest_framework import serializers

from .models import Venta, ItemVenta


class ItemVentaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemVenta
        fields = [
            'id', 'producto', 'nombre_producto', 'sku',
            'cantidad', 'precio_unitario', 'subtotal',
        ]


class VentaListSerializer(serializers.ModelSerializer):
    """Serializer resumido para listado de ventas."""
    numero_pedido = serializers.CharField(source='pedido.numero_pedido', read_only=True)
    usuario_email = serializers.CharField(source='usuario.email', read_only=True)
    items_count = serializers.SerializerMethodField()

    class Meta:
        model = Venta
        fields = [
            'id', 'numero_pedido', 'usuario_email',
            'total', 'items_count', 'fecha_venta',
        ]

    def get_items_count(self, obj):
        return obj.items.count()


class VentaDetailSerializer(serializers.ModelSerializer):
    """Serializer completo con items nested."""
    numero_pedido = serializers.CharField(source='pedido.numero_pedido', read_only=True)
    usuario_email = serializers.CharField(source='usuario.email', read_only=True)
    items = ItemVentaSerializer(many=True, read_only=True)

    class Meta:
        model = Venta
        fields = [
            'id', 'numero_pedido', 'usuario', 'usuario_email',
            'total', 'fecha_venta', 'items_snapshot', 'items',
        ]


class ResumenVentasSerializer(serializers.Serializer):
    """Serializer para estadísticas de ventas."""
    total_ventas = serializers.DecimalField(max_digits=14, decimal_places=2)
    cantidad_ventas = serializers.IntegerField()
    ventas_por_dia = serializers.ListField(child=serializers.DictField())
    ventas_por_mes = serializers.ListField(child=serializers.DictField())
    producto_mas_vendido = serializers.DictField(allow_null=True)
