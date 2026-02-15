"""
Serializers para la app de pagos.
"""
from rest_framework import serializers

from .models import Pago


class PagoSerializer(serializers.ModelSerializer):
    """Serializer de lectura para información de pago."""
    estado_display = serializers.CharField(source='get_estado_display', read_only=True)
    numero_pedido = serializers.CharField(source='pedido.numero_pedido', read_only=True)

    class Meta:
        model = Pago
        fields = [
            'id', 'numero_pedido',
            'mercadopago_preference_id', 'mercadopago_payment_id',
            'estado', 'estado_display', 'estado_detalle',
            'monto', 'metodo',
            'created_at', 'updated_at',
        ]
        read_only_fields = fields


class CrearPreferenciaSerializer(serializers.Serializer):
    """Serializer de entrada para crear una preferencia de pago."""
    pedido_id = serializers.IntegerField()


class PayerIdentificationSerializer(serializers.Serializer):
    """Identificación del pagador (DNI, CURP, etc.)."""
    type = serializers.CharField(required=False, allow_blank=True, default='')
    number = serializers.CharField(required=False, allow_blank=True, default='')


class PayerSerializer(serializers.Serializer):
    """Datos del pagador del Card Brick."""
    email = serializers.EmailField(required=False, allow_blank=True)
    identification = PayerIdentificationSerializer(required=False)


class ProcesarPagoCardSerializer(serializers.Serializer):
    """Serializer de entrada para procesar pago con Card Payment Brick."""
    pedido_id = serializers.IntegerField()
    token = serializers.CharField()
    payment_method_id = serializers.CharField()
    issuer_id = serializers.CharField(required=False, default='', allow_blank=True)
    installments = serializers.IntegerField(min_value=1)
    payer = PayerSerializer()
