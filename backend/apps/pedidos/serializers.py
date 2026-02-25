"""
Serializers de pedidos.
Separados por responsabilidad: creación, listado y detalle.
"""
from decimal import Decimal

from django.db import transaction
from rest_framework import serializers

from apps.inventario.models import Producto
from .models import Pedido, ItemPedido


# ──────────────────────────────────────────────
# ITEM SERIALIZERS
# ──────────────────────────────────────────────

class ItemPedidoSerializer(serializers.ModelSerializer):
    """Serializer de lectura para items de un pedido (nested en detalle)."""
    producto_nombre = serializers.CharField(source='producto.nombre', read_only=True)
    producto_slug = serializers.CharField(source='producto.slug', read_only=True)
    producto_imagen = serializers.ImageField(source='producto.imagen_principal', read_only=True)

    class Meta:
        model = ItemPedido
        fields = [
            'id', 'producto', 'producto_nombre', 'producto_slug',
            'producto_imagen', 'cantidad', 'precio_unitario', 'subtotal',
        ]


class ItemPedidoCrearSerializer(serializers.Serializer):
    """Serializer para cada item al crear un pedido."""
    producto_id = serializers.IntegerField()
    cantidad = serializers.IntegerField(min_value=1)


# ──────────────────────────────────────────────
# PEDIDO SERIALIZERS
# ──────────────────────────────────────────────

class PedidoListSerializer(serializers.ModelSerializer):
    """Serializer resumido para listado de pedidos."""
    items_count = serializers.SerializerMethodField()

    class Meta:
        model = Pedido
        fields = [
            'id', 'numero_pedido', 'estado', 'total',
            'items_count', 'created_at',
        ]

    def get_items_count(self, obj):
        return obj.items.count()


class AdminPedidoListSerializer(PedidoListSerializer):
    """Serializer para listado de pedidos en el panel admin (incluye email)."""
    usuario_email = serializers.SerializerMethodField()

    class Meta(PedidoListSerializer.Meta):
        fields = PedidoListSerializer.Meta.fields + ['usuario_email']

    def get_usuario_email(self, obj):
        if obj.usuario_id:
            return obj.usuario.email
        return obj.guest_email or '(invitado)'


class PedidoSerializer(serializers.ModelSerializer):
    """Serializer completo con items nested (detalle de pedido)."""
    items = ItemPedidoSerializer(many=True, read_only=True)
    usuario_email = serializers.SerializerMethodField()
    usuario_nombre = serializers.SerializerMethodField()
    usuario_telefono = serializers.SerializerMethodField()

    cupon_codigo = serializers.CharField(source='cupon.codigo', read_only=True, default=None)

    class Meta:
        model = Pedido
        fields = [
            'id', 'numero_pedido', 'usuario', 'usuario_email',
            'usuario_nombre', 'usuario_telefono',
            'estado', 'subtotal', 'descuento_monto', 'total', 'cupon_codigo',
            'direccion_envio', 'ciudad', 'estado_envio', 'codigo_postal',
            'metodo_pago', 'notas', 'items',
            'created_at', 'updated_at',
        ]
        read_only_fields = [
            'id', 'numero_pedido', 'usuario', 'estado',
            'subtotal', 'total', 'created_at', 'updated_at',
        ]

    def get_usuario_email(self, obj):
        if obj.usuario_id:
            return obj.usuario.email
        return obj.guest_email

    def get_usuario_nombre(self, obj):
        if obj.usuario_id:
            u = obj.usuario
            nombre = f'{u.first_name} {u.last_name}'.strip()
            return nombre or u.username
        return obj.guest_nombre or 'Invitado'

    def get_usuario_telefono(self, obj):
        if obj.usuario_id:
            return obj.usuario.telefono
        return obj.guest_telefono


class CrearPedidoSerializer(serializers.Serializer):
    """
    Serializer para crear un pedido.
    Valida stock disponible de cada producto antes de crear.
    La creación es atómica (transaction.atomic).
    """
    direccion_envio = serializers.CharField(max_length=255)
    ciudad = serializers.CharField(max_length=100)
    estado_envio = serializers.CharField(max_length=100)
    codigo_postal = serializers.CharField(max_length=10)
    notas = serializers.CharField(required=False, default='', allow_blank=True)
    codigo_cupon = serializers.CharField(required=False, allow_blank=True, default='')
    items = ItemPedidoCrearSerializer(many=True, min_length=1)
    guest_nombre = serializers.CharField(max_length=150, required=False, allow_blank=True, default='')
    guest_email = serializers.EmailField(required=False, allow_blank=True, default='')
    guest_telefono = serializers.CharField(max_length=30, required=False, allow_blank=True, default='')

    def validate_items(self, items):
        """Valida que los productos existan, estén activos y tengan stock."""
        producto_ids = [item['producto_id'] for item in items]

        # Verificar duplicados
        if len(producto_ids) != len(set(producto_ids)):
            raise serializers.ValidationError('No se permiten productos duplicados en el pedido.')

        # Obtener productos activos
        productos = Producto.objects.activos().filter(id__in=producto_ids)
        productos_dict = {p.id: p for p in productos}

        errores = []
        for item in items:
            producto = productos_dict.get(item['producto_id'])
            if not producto:
                errores.append(f'Producto con ID {item["producto_id"]} no encontrado o no disponible.')
                continue
            if not producto.verificar_stock(item['cantidad']):
                errores.append(
                    f'Stock insuficiente para "{producto.nombre}". '
                    f'Disponible: {producto.stock}, solicitado: {item["cantidad"]}.'
                )

        if errores:
            raise serializers.ValidationError(errores)

        return items

    def validate(self, attrs):
        """Valida campos de invitado (si no autenticado) y el cupón."""
        request = self.context['request']
        if not request.user.is_authenticated:
            errors = {}
            if not attrs.get('guest_nombre', '').strip():
                errors['guest_nombre'] = 'El nombre es requerido para compras como invitado.'
            if not attrs.get('guest_email', '').strip():
                errors['guest_email'] = 'El email es requerido para compras como invitado.'
            if not attrs.get('guest_telefono', '').strip():
                errors['guest_telefono'] = 'El teléfono es requerido para compras como invitado.'
            if errors:
                raise serializers.ValidationError(errors)

        codigo_cupon = attrs.get('codigo_cupon', '').strip().upper()
        if codigo_cupon:
            from apps.descuentos.models import Cupon
            try:
                cupon = Cupon.objects.get(codigo=codigo_cupon)
            except Cupon.DoesNotExist:
                raise serializers.ValidationError({'codigo_cupon': 'Código de cupón no válido.'})

            # Calcular subtotal proyectado desde los items ya validados
            subtotal_proyectado = sum(
                Decimal(str(Producto.objects.get(id=item['producto_id']).precio_final)) * item['cantidad']
                for item in attrs.get('items', [])
            )

            valido, mensaje = cupon.es_valido(subtotal_proyectado)
            if not valido:
                raise serializers.ValidationError({'codigo_cupon': mensaje})

            attrs['_cupon'] = cupon

        return attrs

    def create(self, validated_data):
        """Crea pedido + items dentro de una transacción atómica."""
        items_data = validated_data.pop('items')
        cupon = validated_data.pop('_cupon', None)
        validated_data.pop('codigo_cupon', None)
        request = self.context['request']
        usuario = request.user if request.user.is_authenticated else None
        guest_nombre = validated_data.pop('guest_nombre', '')
        guest_email = validated_data.pop('guest_email', '')
        guest_telefono = validated_data.pop('guest_telefono', '')

        with transaction.atomic():
            # Crear pedido
            pedido = Pedido.objects.create(
                usuario=usuario,
                guest_nombre=guest_nombre,
                guest_email=guest_email,
                guest_telefono=guest_telefono,
                cupon=cupon,
                direccion_envio=validated_data['direccion_envio'],
                ciudad=validated_data['ciudad'],
                estado_envio=validated_data['estado_envio'],
                codigo_postal=validated_data['codigo_postal'],
                notas=validated_data.get('notas', ''),
            )

            # Crear items con precio al momento de la compra
            for item_data in items_data:
                producto = Producto.objects.select_for_update().get(id=item_data['producto_id'])
                ItemPedido.objects.create(
                    pedido=pedido,
                    producto=producto,
                    cantidad=item_data['cantidad'],
                    precio_unitario=producto.precio_final,
                )

            # Calcular totales
            pedido.calcular_totales()

        return pedido


class ActualizarEstadoPedidoSerializer(serializers.Serializer):
    """Serializer para que el admin actualice el estado de un pedido."""
    estado = serializers.ChoiceField(choices=Pedido.EstadoChoices.choices)

    def validate_estado(self, nuevo_estado):
        pedido = self.context['pedido']
        if not pedido.puede_transicionar_a(nuevo_estado):
            raise serializers.ValidationError(
                f'Transición inválida: {pedido.get_estado_display()} → {nuevo_estado}. '
                f'Estados permitidos: {pedido.TRANSICIONES_VALIDAS.get(pedido.estado, [])}'
            )
        return nuevo_estado
