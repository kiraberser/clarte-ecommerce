"""
Vistas de la app de ventas (solo admin).
Listado, detalle y estadísticas.
"""
from django.db.models import Sum, Count
from django.db.models.functions import TruncDate, TruncMonth
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Venta, ItemVenta
from .serializers import VentaListSerializer, VentaDetailSerializer


class VentaListView(generics.ListAPIView):
    """
    GET /api/v1/ventas/
    Lista todas las ventas (solo admin).
    Filtros: por fecha, usuario.
    """
    serializer_class = VentaListSerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = (
        Venta.objects
        .select_related('pedido', 'usuario')
        .prefetch_related('items')
    )
    filterset_fields = ['usuario']
    search_fields = ['pedido__numero_pedido', 'usuario__email']
    ordering_fields = ['fecha_venta', 'total']
    ordering = ['-fecha_venta']


class VentaDetailView(generics.RetrieveAPIView):
    """
    GET /api/v1/ventas/<int:pk>/
    Detalle de una venta (solo admin).
    """
    serializer_class = VentaDetailSerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = (
        Venta.objects
        .select_related('pedido', 'usuario')
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


class ResumenVentasView(APIView):
    """
    GET /api/v1/ventas/resumen/
    Estadísticas de ventas (solo admin):
      - Total acumulado y cantidad de ventas.
      - Ventas agrupadas por día (últimos 30 registros).
      - Ventas agrupadas por mes (últimos 12 registros).
      - Producto más vendido.
    """
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        # Totales generales
        totales = Venta.objects.aggregate(
            total_ventas=Sum('total'),
            cantidad_ventas=Count('id'),
        )

        # Ventas por día (últimos 30 días con ventas)
        ventas_por_dia = list(
            Venta.objects
            .annotate(dia=TruncDate('fecha_venta'))
            .values('dia')
            .annotate(total=Sum('total'), cantidad=Count('id'))
            .order_by('-dia')[:30]
        )

        # Ventas por mes (últimos 12 meses con ventas)
        ventas_por_mes = list(
            Venta.objects
            .annotate(mes=TruncMonth('fecha_venta'))
            .values('mes')
            .annotate(total=Sum('total'), cantidad=Count('id'))
            .order_by('-mes')[:12]
        )

        # Producto más vendido
        top_producto = (
            ItemVenta.objects
            .values('nombre_producto', 'sku')
            .annotate(total_vendido=Sum('cantidad'), ingresos=Sum('subtotal'))
            .order_by('-total_vendido')
            .first()
        )

        return Response(
            {
                'success': True,
                'message': 'OK',
                'data': {
                    'total_ventas': totales['total_ventas'] or 0,
                    'cantidad_ventas': totales['cantidad_ventas'] or 0,
                    'ventas_por_dia': ventas_por_dia,
                    'ventas_por_mes': ventas_por_mes,
                    'producto_mas_vendido': top_producto,
                },
                'errors': None,
            },
        )
