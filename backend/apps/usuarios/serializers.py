"""
Serializers para la app de usuarios.
Separados por responsabilidad: registro, perfil y cambio de contraseña.
"""
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

Usuario = get_user_model()


class RegistroSerializer(serializers.ModelSerializer):
    """
    Serializer para registro de nuevos usuarios.
    Requiere confirmación de contraseña y valida fortaleza.
    """
    password = serializers.CharField(
        write_only=True,
        min_length=8,
        style={'input_type': 'password'},
    )
    password_confirm = serializers.CharField(
        write_only=True,
        style={'input_type': 'password'},
    )

    class Meta:
        model = Usuario
        fields = [
            'username',
            'email',
            'first_name',
            'last_name',
            'telefono',
            'password',
            'password_confirm',
        ]

    def validate_email(self, value):
        """Verifica que el email no esté en uso (case-insensitive)."""
        if Usuario.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError('Ya existe una cuenta con este correo electrónico.')
        return value.lower()

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({'password_confirm': 'Las contraseñas no coinciden.'})
        # Validar fortaleza de la contraseña con los validators de Django
        validate_password(attrs['password'])
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        usuario = Usuario(**validated_data)
        usuario.set_password(password)
        usuario.save()
        return usuario


class UsuarioSerializer(serializers.ModelSerializer):
    """
    Serializer para lectura y actualización del perfil de usuario.
    Campos sensibles (email, username) son de solo lectura.
    """
    direccion_completa = serializers.CharField(
        source='get_direccion_completa',
        read_only=True,
    )

    class Meta:
        model = Usuario
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'telefono',
            'direccion',
            'ciudad',
            'estado',
            'codigo_postal',
            'rfc',
            'direccion_completa',
            'date_joined',
            'is_staff',
        ]
        read_only_fields = ['id', 'username', 'email', 'date_joined', 'is_staff']


class CambioPasswordSerializer(serializers.Serializer):
    """
    Serializer para cambio de contraseña.
    Requiere la contraseña actual para validar identidad.
    """
    password_actual = serializers.CharField(
        write_only=True,
        style={'input_type': 'password'},
    )
    password_nuevo = serializers.CharField(
        write_only=True,
        min_length=8,
        style={'input_type': 'password'},
    )
    password_nuevo_confirm = serializers.CharField(
        write_only=True,
        style={'input_type': 'password'},
    )

    def validate_password_actual(self, value):
        """Verifica que la contraseña actual sea correcta."""
        usuario = self.context['request'].user
        if not usuario.check_password(value):
            raise serializers.ValidationError('La contraseña actual es incorrecta.')
        return value

    def validate(self, attrs):
        if attrs['password_nuevo'] != attrs['password_nuevo_confirm']:
            raise serializers.ValidationError(
                {'password_nuevo_confirm': 'Las contraseñas nuevas no coinciden.'}
            )
        validate_password(attrs['password_nuevo'], self.context['request'].user)
        return attrs

    def save(self, **kwargs):
        usuario = self.context['request'].user
        usuario.set_password(self.validated_data['password_nuevo'])
        usuario.save()
        return usuario
