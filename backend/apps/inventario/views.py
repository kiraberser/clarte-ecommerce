"""
Vistas de la app de inventario.
Endpoints públicos (solo lectura) y endpoints admin (CRUD completo).
"""
from django.db.models import Count, Q
from rest_framework import generics, viewsets, permissions

from .models import Categoria, Producto
from .serializers import (
    CategoriaSerializer,
    CategoriaAdminSerializer,
    ProductoListSerializer,
    ProductoDetailSerializer,
    ProductoAdminSerializer,
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
