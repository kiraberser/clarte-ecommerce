"""
Vistas de la app de pedidos.
Endpoints de usuario (mis pedidos) y endpoints admin (gestión).
"""
import logging

from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.usuarios.permissions import IsOwner
from .models import Pedido
from .serializers import (
    PedidoSerializer,
    PedidoListSerializer,
    AdminPedidoListSerializer,
    CrearPedidoSerializer,
    ActualizarEstadoPedidoSerializer,
)

logger = logging.getLogger('clarte')


# ──────────────────────────────────────────────
# ENDPOINTS DE USUARIO
# ──────────────────────────────────────────────

class CrearPedidoView(generics.CreateAPIView):
    """
    POST /api/v1/pedidos/
    Crea un nuevo pedido para el usuario autenticado.
    """
    serializer_class = CrearPedidoSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        pedido = serializer.save()

        user_id = request.user.id if request.user.is_authenticated else 'guest'
        logger.info('Pedido creado: %s por usuario %s', pedido.numero_pedido, user_id)

        return Response(
            {
                'success': True,
                'message': 'Pedido creado exitosamente.',
                'data': PedidoSerializer(pedido).data,
                'errors': None,
            },
            status=status.HTTP_201_CREATED,
        )


class MisPedidosListView(generics.ListAPIView):
    """
    GET /api/v1/pedidos/
    Lista los pedidos del usuario autenticado.
    Soporta filtro por estado: ?estado=entregado
    """
    serializer_class = PedidoListSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['estado']

    def get_queryset(self):
        return (
            Pedido.objects
            .filter(usuario=self.request.user)
            .prefetch_related('items')
            .order_by('-created_at')
        )


class PedidoDetailView(generics.RetrieveAPIView):
    """
    GET /api/v1/pedidos/<numero_pedido>/
    Detalle de un pedido propio.
    """
    serializer_class = PedidoSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]
    lookup_field = 'numero_pedido'

    def get_queryset(self):
        return (
            Pedido.objects
            .filter(usuario=self.request.user)
            .select_related('usuario')
            .prefetch_related('items__producto')
        )

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response({
            'success': True,
            'message': 'OK',
            'data': serializer.data,
            'errors': None,
        })


class CancelarPedidoView(APIView):
    """
    POST /api/v1/pedidos/<numero_pedido>/cancelar/
    Cancela un pedido propio (solo si estado == pendiente).
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, numero_pedido):
        try:
            pedido = Pedido.objects.get(
                numero_pedido=numero_pedido,
                usuario=request.user,
            )
        except Pedido.DoesNotExist:
            return Response(
                {
                    'success': False,
                    'message': 'Pedido no encontrado.',
                    'data': None,
                    'errors': None,
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        if pedido.estado != Pedido.EstadoChoices.PENDIENTE:
            return Response(
                {
                    'success': False,
                    'message': 'Solo se pueden cancelar pedidos en estado pendiente.',
                    'data': None,
                    'errors': {'estado': f'Estado actual: {pedido.get_estado_display()}'},
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        pedido.cambiar_estado(Pedido.EstadoChoices.CANCELADO)
        logger.info('Pedido %s cancelado por usuario %s', numero_pedido, request.user.id)

        return Response(
            {
                'success': True,
                'message': 'Pedido cancelado exitosamente.',
                'data': PedidoSerializer(pedido).data,
                'errors': None,
            },
            status=status.HTTP_200_OK,
        )


# ──────────────────────────────────────────────
# ENDPOINTS ADMIN
# ──────────────────────────────────────────────

class AdminPedidosListView(generics.ListAPIView):
    """
    GET /api/v1/pedidos/admin/
    Lista todos los pedidos (solo admin).
    """
    serializer_class = AdminPedidoListSerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = Pedido.objects.select_related('usuario').prefetch_related('items')
    search_fields = ['numero_pedido', 'usuario__email']
    filterset_fields = ['estado']
    ordering_fields = ['created_at', 'total']
    ordering = ['-created_at']


class AdminPedidoDetailView(generics.RetrieveAPIView):
    """
    GET /api/v1/pedidos/admin/<numero_pedido>/
    Detalle de cualquier pedido (solo admin).
    """
    serializer_class = PedidoSerializer
    permission_classes = [permissions.IsAdminUser]
    lookup_field = 'numero_pedido'
    queryset = (
        Pedido.objects
        .select_related('usuario')
        .prefetch_related('items__producto')
    )

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response({
            'success': True,
            'message': 'OK',
            'data': serializer.data,
            'errors': None,
        })


class AdminActualizarEstadoView(APIView):
    """
    PATCH /api/v1/pedidos/admin/<numero_pedido>/estado/
    Actualiza el estado de un pedido (solo admin).
    Valida transiciones de estado permitidas.
    """
    permission_classes = [permissions.IsAdminUser]

    def patch(self, request, numero_pedido):
        try:
            pedido = Pedido.objects.get(numero_pedido=numero_pedido)
        except Pedido.DoesNotExist:
            return Response(
                {
                    'success': False,
                    'message': 'Pedido no encontrado.',
                    'data': None,
                    'errors': None,
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = ActualizarEstadoPedidoSerializer(
            data=request.data,
            context={'pedido': pedido},
        )
        serializer.is_valid(raise_exception=True)

        pedido.cambiar_estado(serializer.validated_data['estado'])

        return Response(
            {
                'success': True,
                'message': f'Estado actualizado a: {pedido.get_estado_display()}.',
                'data': PedidoSerializer(pedido).data,
                'errors': None,
            },
            status=status.HTTP_200_OK,
        )
