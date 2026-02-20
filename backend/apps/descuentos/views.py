"""
Vistas del sistema de cupones.
ValidarCuponView: POST público (autenticado) para validar un código.
CuponAdminViewSet: CRUD de cupones para el panel admin.
"""
import logging

from rest_framework import permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Cupon
from .serializers import CuponAdminSerializer, ValidarCuponSerializer

logger = logging.getLogger('clarte')


class ValidarCuponView(APIView):
    """
    POST /api/v1/descuentos/validar/
    Valida un código de cupón contra un subtotal.
    Devuelve { valido, descuento_monto, mensaje }.
    Requiere autenticación.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ValidarCuponSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        codigo = serializer.validated_data['codigo'].upper().strip()
        subtotal = serializer.validated_data['subtotal']

        try:
            cupon = Cupon.objects.get(codigo=codigo)
        except Cupon.DoesNotExist:
            return Response(
                {
                    'success': True,
                    'message': 'Cupón no encontrado.',
                    'data': {
                        'valido': False,
                        'descuento_monto': 0,
                        'mensaje': 'Código de cupón no válido.',
                    },
                    'errors': None,
                },
                status=status.HTTP_200_OK,
            )

        valido, mensaje = cupon.es_valido(subtotal)
        descuento_monto = float(cupon.calcular_descuento(subtotal)) if valido else 0

        logger.info(
            'Cupón %s validado por usuario %s: valido=%s, descuento=%s',
            codigo, request.user.id, valido, descuento_monto,
        )

        return Response(
            {
                'success': True,
                'message': 'OK',
                'data': {
                    'valido': valido,
                    'descuento_monto': descuento_monto,
                    'mensaje': mensaje if not valido else f'Cupón aplicado — {cupon.nombre}',
                },
                'errors': None,
            },
            status=status.HTTP_200_OK,
        )


class CuponAdminViewSet(viewsets.ModelViewSet):
    """
    CRUD /api/v1/descuentos/admin/
    Administración de cupones (solo admin).
    """
    serializer_class = CuponAdminSerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = Cupon.objects.all()
    search_fields = ['codigo', 'nombre']
    filterset_fields = ['activo', 'tipo_descuento']
    ordering_fields = ['created_at', 'usos_actuales']
    ordering = ['-created_at']
