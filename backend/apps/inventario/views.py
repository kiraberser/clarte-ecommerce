"""
Vistas de la app de inventario.
Endpoints públicos (solo lectura) y endpoints admin (CRUD completo).
"""
from django.db.models import Count, Q
from rest_framework import generics, viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Categoria, ListaDeseos, Producto, Resena
from .serializers import (
    CategoriaSerializer,
    CategoriaAdminSerializer,
    CrearResenaSerializer,
    ListaDeseosSerializer,
    ProductoListSerializer,
    ProductoDetailSerializer,
    ProductoAdminSerializer,
    ResenaSerializer,
)
from .filters import ProductoFilter
from utils.mixins import StandardResponseMixin


# ──────────────────────────────────────────────
# ENDPOINTS PÚBLICOS (solo lectura)
# ──────────────────────────────────────────────

class CategoriaListView(StandardResponseMixin, generics.ListAPIView):
    """
    GET /api/v1/productos/categorias/
    Lista todas las categorías activas con conteo de productos.
    """
    serializer_class = CategoriaSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None  # Categorías sin paginar

    def get_queryset(self):
        return (
            Categoria.objects
            .filter(activo=True)
            .annotate(productos_count=Count('productos', filter=Q(productos__activo=True)))
            .order_by('orden', 'nombre')
        )


class ProductoListView(generics.ListAPIView):
    """
    GET /api/v1/productos/
    Lista productos activos con filtros, búsqueda y paginación.
    """
    serializer_class = ProductoListSerializer
    permission_classes = [permissions.AllowAny]
    filterset_class = ProductoFilter
    search_fields = ['nombre', 'descripcion', 'sku']
    ordering_fields = ['precio', 'nombre', 'created_at']
    ordering = ['-created_at']

    def get_queryset(self):
        return Producto.objects.activos().select_related('categoria')


class ProductoDetailView(StandardResponseMixin, generics.RetrieveAPIView):
    """
    GET /api/v1/productos/<slug>/
    Detalle de un producto activo por su slug.
    """
    serializer_class = ProductoDetailSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'

    def get_queryset(self):
        return Producto.objects.activos().select_related('categoria')


class ProductoDestacadosView(StandardResponseMixin, generics.ListAPIView):
    """
    GET /api/v1/productos/destacados/
    Lista productos destacados (para homepage).
    """
    serializer_class = ProductoListSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None  # Sin paginar, son pocos

    def get_queryset(self):
        return Producto.objects.destacados().select_related('categoria')[:12]


# ──────────────────────────────────────────────
# ENDPOINTS ADMIN (CRUD completo)
# ──────────────────────────────────────────────

class CategoriaAdminViewSet(StandardResponseMixin, viewsets.ModelViewSet):
    """
    CRUD completo de categorías (solo admin).
    GET/POST      /api/v1/productos/admin/categorias/
    GET/PUT/PATCH/DELETE /api/v1/productos/admin/categorias/<pk>/
    """
    serializer_class = CategoriaAdminSerializer
    permission_classes = [permissions.IsAdminUser]
    pagination_class = None  # Categorías sin paginar (son pocas)
    queryset = Categoria.objects.all()
    search_fields = ['nombre']
    ordering = ['orden', 'nombre']


class ProductoAdminViewSet(StandardResponseMixin, viewsets.ModelViewSet):
    """
    CRUD completo de productos (solo admin).
    Soft delete: en lugar de borrar, se marca como inactivo.
    GET/POST      /api/v1/productos/admin/productos/
    GET/PUT/PATCH/DELETE /api/v1/productos/admin/productos/<pk>/
    """
    serializer_class = ProductoAdminSerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = Producto.objects.select_related('categoria').all()
    filterset_class = ProductoFilter
    search_fields = ['nombre', 'descripcion', 'sku']
    ordering_fields = ['precio', 'nombre', 'stock', 'created_at']

    def perform_destroy(self, instance):
        """Soft delete: marca como inactivo en lugar de eliminar."""
        instance.activo = False
        instance.save(update_fields=['activo'])


# ──────────────────────────────────────────────
# RESEÑAS
# ──────────────────────────────────────────────

class ProductoResenasListView(StandardResponseMixin, generics.ListAPIView):
    """
    GET /api/v1/productos/<slug>/resenas/
    Lista reseñas de un producto. Acceso público.
    """
    serializer_class = ResenaSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None

    def get_queryset(self):
        return (
            Resena.objects
            .filter(producto__slug=self.kwargs['slug'])
            .select_related('usuario')
        )


class CrearResenaView(StandardResponseMixin, generics.CreateAPIView):
    """
    POST /api/v1/productos/<slug>/resenas/crear/
    Crea una reseña para el producto. Requiere autenticación.
    """
    serializer_class = CrearResenaSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        producto = generics.get_object_or_404(
            Producto.objects.activos(), slug=self.kwargs['slug']
        )
        if Resena.objects.filter(producto=producto, usuario=self.request.user).exists():
            from rest_framework.exceptions import ValidationError
            raise ValidationError({'detail': 'Ya has reseñado este producto.'})
        serializer.save(producto=producto, usuario=self.request.user)


# ──────────────────────────────────────────────
# LISTA DE DESEOS
# ──────────────────────────────────────────────

class ListaDeseosView(APIView):
    """
    GET  /api/v1/productos/lista-deseos/  — lista favoritos del usuario
    POST /api/v1/productos/lista-deseos/  — agrega producto {"producto_id": N}
    DELETE /api/v1/productos/lista-deseos/ — elimina producto {"producto_id": N}
    """
    permission_classes = [permissions.IsAuthenticated]

    def _wrap(self, data, message='', status_code=status.HTTP_200_OK):
        return Response(
            {'success': True, 'message': message, 'data': data, 'errors': None},
            status=status_code,
        )

    def get(self, request):
        items = (
            ListaDeseos.objects
            .filter(usuario=request.user)
            .select_related('producto', 'producto__categoria')
        )
        serializer = ListaDeseosSerializer(items, many=True)
        return self._wrap(serializer.data)

    def post(self, request):
        producto_id = request.data.get('producto_id')
        if not producto_id:
            return Response(
                {'success': False, 'message': 'producto_id requerido.', 'data': None, 'errors': None},
                status=status.HTTP_400_BAD_REQUEST,
            )
        producto = generics.get_object_or_404(Producto.objects.activos(), pk=producto_id)
        item, created = ListaDeseos.objects.get_or_create(
            usuario=request.user, producto=producto
        )
        if not created:
            return Response(
                {'success': False, 'message': 'El producto ya está en tu lista de deseos.', 'data': None, 'errors': None},
                status=status.HTTP_400_BAD_REQUEST,
            )
        serializer = ListaDeseosSerializer(item)
        return self._wrap(serializer.data, 'Agregado a favoritos.', status.HTTP_201_CREATED)

    def delete(self, request):
        producto_id = request.data.get('producto_id')
        if not producto_id:
            return Response(
                {'success': False, 'message': 'producto_id requerido.', 'data': None, 'errors': None},
                status=status.HTTP_400_BAD_REQUEST,
            )
        deleted, _ = ListaDeseos.objects.filter(
            usuario=request.user, producto_id=producto_id
        ).delete()
        if not deleted:
            return Response(
                {'success': False, 'message': 'Producto no encontrado en tu lista de deseos.', 'data': None, 'errors': None},
                status=status.HTTP_404_NOT_FOUND,
            )
        return self._wrap(None, 'Eliminado de favoritos.')
