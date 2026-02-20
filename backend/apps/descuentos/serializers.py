from decimal import Decimal

from rest_framework import serializers

from .models import Cupon


class ValidarCuponSerializer(serializers.Serializer):
    """Valida un código de cupón contra un subtotal."""
    codigo = serializers.CharField(max_length=50)
    subtotal = serializers.DecimalField(max_digits=12, decimal_places=2, min_value=Decimal('0'))


class CuponAdminSerializer(serializers.ModelSerializer):
    """Serializer CRUD completo para administrar cupones (solo admin)."""

    class Meta:
        model = Cupon
        fields = [
            'id', 'codigo', 'nombre', 'tipo_descuento', 'valor_descuento',
            'minimo_compra', 'maximo_usos', 'usos_actuales', 'activo',
            'fecha_inicio', 'fecha_fin', 'created_at',
        ]
        read_only_fields = ['id', 'usos_actuales', 'created_at']
