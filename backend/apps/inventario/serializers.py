"""
Serializers para la app de inventario.
Serializers separados para listado (ligero) y detalle (completo).
Admin usa serializers con todos los campos editables.
"""
from rest_framework import serializers

from .models import Categoria, ListaDeseos, Producto, Resena


# ──────────────────────────────────────────────
# CATEGORÍAS
# ──────────────────────────────────────────────

class CategoriaSerializer(serializers.ModelSerializer):
    """Serializer público de categorías (solo lectura)."""
    productos_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Categoria
        fields = [
            'id', 'nombre', 'slug', 'descripcion',
            'imagen', 'orden', 'productos_count',
        ]


class CategoriaAdminSerializer(serializers.ModelSerializer):
    """Serializer admin de categorías (CRUD completo)."""
    imagen = serializers.CharField(required=False, allow_blank=True, allow_null=True)

    class Meta:
        model = Categoria
        fields = [
            'id', 'nombre', 'slug', 'descripcion',
            'imagen', 'activo', 'orden',
        ]
        read_only_fields = ['id']


# ──────────────────────────────────────────────
# PRODUCTOS
# ──────────────────────────────────────────────

class ProductoListSerializer(serializers.ModelSerializer):
    """Serializer ligero para listado de productos (público)."""
    categoria_nombre = serializers.CharField(source='categoria.nombre', read_only=True)
    precio_final = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    en_stock = serializers.BooleanField(read_only=True)

    class Meta:
        model = Producto
        fields = [
            'id', 'nombre', 'slug', 'precio', 'precio_oferta',
            'precio_final', 'imagen_principal', 'categoria',
            'categoria_nombre', 'en_stock', 'destacado',
        ]


class ProductoDetailSerializer(serializers.ModelSerializer):
    """Serializer completo para detalle de producto (público)."""
    categoria_nombre = serializers.CharField(source='categoria.nombre', read_only=True)
    categoria_slug = serializers.CharField(source='categoria.slug', read_only=True)
    precio_final = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    en_stock = serializers.BooleanField(read_only=True)

    class Meta:
        model = Producto
        fields = [
            'id', 'nombre', 'slug', 'descripcion', 'precio',
            'precio_oferta', 'precio_final', 'sku',
            'imagen_principal', 'imagenes', 'categoria',
            'categoria_nombre', 'categoria_slug',
            'stock', 'en_stock', 'destacado',
            'dimensiones', 'detalles_tecnicos', 'materiales',
            'created_at', 'updated_at',
        ]


class ProductoAdminSerializer(serializers.ModelSerializer):
    """Serializer admin de productos (CRUD completo)."""
    imagen_principal = serializers.CharField(required=False, allow_blank=True, allow_null=True)

    class Meta:

        model = Producto
        fields = [
            'id', 'nombre', 'slug', 'descripcion', 'precio',
            'precio_oferta', 'sku', 'imagen_principal', 'imagenes',
            'categoria', 'stock', 'activo', 'destacado',
            'dimensiones', 'detalles_tecnicos', 'materiales',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_precio(self, value):
        if value <= 0:
            raise serializers.ValidationError('El precio debe ser mayor a cero.')
        return value

    def validate_precio_oferta(self, value):
        if value is not None and value <= 0:
            raise serializers.ValidationError('El precio de oferta debe ser mayor a cero.')
        return value

    def validate(self, attrs):
        precio = attrs.get('precio', getattr(self.instance, 'precio', None))
        precio_oferta = attrs.get('precio_oferta')
        if precio_oferta is not None and precio is not None and precio_oferta >= precio:
            raise serializers.ValidationError(
                {'precio_oferta': 'El precio de oferta debe ser menor al precio normal.'}
            )
        return attrs


# ──────────────────────────────────────────────
# RESEÑAS
# ──────────────────────────────────────────────

class ResenaSerializer(serializers.ModelSerializer):
    """Serializer de lectura para reseñas."""
    usuario_nombre = serializers.SerializerMethodField()

    class Meta:
        model = Resena
        fields = ['id', 'usuario_nombre', 'rating', 'comentario', 'created_at']

    def get_usuario_nombre(self, obj):
        full_name = obj.usuario.get_full_name()
        return full_name if full_name.strip() else obj.usuario.username


class CrearResenaSerializer(serializers.ModelSerializer):
    """Serializer de escritura para crear una reseña."""

    class Meta:
        model = Resena
        fields = ['rating', 'comentario']

    def validate_rating(self, value):
        if not (1 <= value <= 5):
            raise serializers.ValidationError('La calificación debe estar entre 1 y 5.')
        return value


# ──────────────────────────────────────────────
# LISTA DE DESEOS
# ──────────────────────────────────────────────

class ListaDeseosSerializer(serializers.ModelSerializer):
    """Serializer para items de la lista de deseos."""
    producto = ProductoListSerializer(read_only=True)

    class Meta:
        model = ListaDeseos
        fields = ['id', 'producto', 'created_at']
