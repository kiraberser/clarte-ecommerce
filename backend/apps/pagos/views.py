"""
Vistas de la app de pagos.
Views ligeras — la lógica de negocio vive en servicios/.
"""
import logging

from django.shortcuts import get_object_or_404
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status, permissions
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from rest_framework import generics
from apps.pedidos.models import Pedido
from .models import Pago
from .serializers import PagoSerializer, AdminPagoSerializer, CrearPreferenciaSerializer, ProcesarPagoCardSerializer
from .servicios.mercadopago_service import (
    crear_preferencia,
    procesar_pago_card,
    verificar_firma_webhook,
    procesar_notificacion_webhook,
)

logger = logging.getLogger('clarte')


class CrearPreferenciaPagoView(APIView):
    """
    POST /api/v1/pagos/crear-preferencia/
    Crea una preferencia de pago en Mercado Pago para un pedido.
    Espera: {"pedido_id": <int>}
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = CrearPreferenciaSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        pedido = get_object_or_404(
            Pedido,
            id=serializer.validated_data['pedido_id'],
            usuario=request.user,
        )

        try:
            resultado = crear_preferencia(pedido, request.user)
        except ValueError as e:
            return Response(
                {
                    'success': False,
                    'message': str(e),
                    'data': None,
                    'errors': None,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {
                'success': True,
                'message': 'Preferencia de pago creada.',
                'data': resultado,
                'errors': None,
            },
            status=status.HTTP_201_CREATED,
        )


class ProcesarPagoCardView(APIView):
    """
    POST /api/v1/pagos/procesar-card/
    Procesa un pago con tarjeta usando datos del Card Payment Brick.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        logger.info('ProcesarPagoCard request.data: %s', request.data)
        serializer = ProcesarPagoCardSerializer(data=request.data)
        if not serializer.is_valid():
            logger.warning('ProcesarPagoCard validation errors: %s', serializer.errors)
            return Response(
                {
                    'success': False,
                    'message': 'Datos de pago inválidos.',
                    'data': None,
                    'errors': serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        pedido_id = serializer.validated_data['pedido_id']
        if request.user.is_authenticated:
            pedido = get_object_or_404(Pedido, id=pedido_id, usuario=request.user)
        else:
            pedido = get_object_or_404(Pedido, id=pedido_id, usuario__isnull=True)

        try:
            resultado = procesar_pago_card(
                pedido,
                request.user if request.user.is_authenticated else None,
                serializer.validated_data,
            )
        except ValueError as e:
            return Response(
                {
                    'success': False,
                    'message': str(e),
                    'data': None,
                    'errors': None,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {
                'success': True,
                'message': 'Pago procesado.',
                'data': resultado,
                'errors': None,
            },
            status=status.HTTP_200_OK,
        )


@method_decorator(csrf_exempt, name='dispatch')
class WebhookView(APIView):
    """
    POST /api/v1/pagos/webhook/
    Recibe notificaciones IPN de Mercado Pago.
    CSRF exempt, AllowAny — autenticado por firma HMAC.
    Idempotente: verifica si el pago ya fue procesado.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        # 1. Extraer data_id y topic del request
        topic = request.GET.get('topic') or request.GET.get('type')
        data_id = request.GET.get('data.id') or request.GET.get('id')

        if not data_id:
            body = request.data
            topic = body.get('type', topic)
            data_id = body.get('data', {}).get('id')

        # Solo procesar notificaciones de tipo payment
        if topic != 'payment':
            return Response({'status': 'ignored'}, status=status.HTTP_200_OK)

        # 2. Verificar firma HMAC
        x_signature = request.headers.get('x-signature', '')
        x_request_id = request.headers.get('x-request-id', '')

        if not verificar_firma_webhook(data_id, x_signature, x_request_id):
            logger.warning('Webhook con firma inválida rechazado. data_id=%s', data_id)
            return Response(
                {'error': 'Firma inválida.'},
                status=status.HTTP_403_FORBIDDEN,
            )

        # 3. Procesar la notificación
        try:
            resultado = procesar_notificacion_webhook(data_id)
            logger.info('Webhook procesado: data_id=%s, resultado=%s', data_id, resultado)
        except Pago.DoesNotExist:
            logger.warning('Webhook: pago local no encontrado para data_id=%s', data_id)
            return Response({'error': 'Pago no encontrado.'}, status=status.HTTP_404_NOT_FOUND)
        except ValueError as e:
            logger.warning('Webhook error de validación: %s', e)
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error('Webhook error crítico: %s', e, exc_info=True)
            return Response(
                {'error': 'Error interno.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        return Response({'status': 'ok'}, status=status.HTTP_200_OK)


class AdminPagosListView(generics.ListAPIView):
    """
    GET /api/v1/pagos/admin/
    Lista todos los pagos (solo admin). Soporta búsqueda y filtro por estado.
    """
    serializer_class = AdminPagoSerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = Pago.objects.select_related('pedido', 'usuario').all()
    search_fields = ['usuario__email', 'pedido__numero_pedido', 'mercadopago_payment_id']
    filterset_fields = ['estado']
    ordering_fields = ['created_at', 'monto']
    ordering = ['-created_at']


class AdminPagoDetailView(generics.RetrieveAPIView):
    """
    GET /api/v1/pagos/admin/<pago_id>/
    Detalle de un pago (solo admin).
    """
    serializer_class = AdminPagoSerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = Pago.objects.select_related('pedido', 'usuario').all()

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response({
            'success': True,
            'message': 'OK',
            'data': serializer.data,
            'errors': None,
        })


class ConsultarPagoView(APIView):
    """
    GET /api/v1/pagos/<int:pago_id>/
    Consulta el estado de un pago del usuario autenticado.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pago_id):
        pago = get_object_or_404(Pago, id=pago_id, usuario=request.user)
        serializer = PagoSerializer(pago)
        return Response(
            {
                'success': True,
                'message': 'OK',
                'data': serializer.data,
                'errors': None,
            },
            status=status.HTTP_200_OK,
        )
