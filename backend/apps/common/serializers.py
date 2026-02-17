"""
Serializers para la app common (contacto y newsletter).
"""
from rest_framework import serializers

from .models import Contacto, SuscripcionNewsletter


class ContactoSerializer(serializers.ModelSerializer):
    """Serializer para crear mensajes de contacto (público)."""

    class Meta:
        model = Contacto
        fields = ['id', 'nombre', 'email', 'telefono', 'asunto', 'mensaje', 'created_at']
        read_only_fields = ['id', 'created_at']


class ContactoAdminSerializer(serializers.ModelSerializer):
    """Serializer admin para contactos (incluye campo leído)."""

    class Meta:
        model = Contacto
        fields = ['id', 'nombre', 'email', 'telefono', 'asunto', 'mensaje', 'leido', 'created_at']
        read_only_fields = ['id', 'nombre', 'email', 'telefono', 'asunto', 'mensaje', 'created_at']


class SuscripcionNewsletterSerializer(serializers.ModelSerializer):
    """Serializer para suscripción al newsletter (público)."""

    class Meta:
        model = SuscripcionNewsletter
        fields = ['id', 'nombre', 'email', 'created_at']
        read_only_fields = ['id', 'created_at']

    def validate_email(self, value):
        value = value.lower()
        if SuscripcionNewsletter.objects.filter(email=value, activo=True).exists():
            raise serializers.ValidationError('Este correo ya está suscrito al newsletter.')
        return value

    def create(self, validated_data):
        """Reactiva suscripción si existía inactiva, o crea nueva."""
        email = validated_data['email']
        suscripcion, created = SuscripcionNewsletter.objects.get_or_create(
            email=email,
            defaults={'activo': True},
        )
        if not created and not suscripcion.activo:
            suscripcion.activo = True
            suscripcion.save(update_fields=['activo'])
        return suscripcion


class SuscripcionAdminSerializer(serializers.ModelSerializer):
    """Serializer admin para suscripciones."""

    class Meta:
        model = SuscripcionNewsletter
        fields = ['id', 'nombre', 'email', 'activo', 'created_at']
        read_only_fields = ['id', 'created_at']
