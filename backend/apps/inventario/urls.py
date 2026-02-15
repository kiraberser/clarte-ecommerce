"""
URLs de la app de inventario.
Endpoints públicos bajo api/v1/productos/
Endpoints admin bajo api/v1/productos/admin/
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from . import views

# Routers para ViewSets admin
router = DefaultRouter()
router.register('categorias', views.CategoriaAdminViewSet, basename='admin-categoria')
router.register('productos', views.ProductoAdminViewSet, basename='admin-producto')

urlpatterns = [
    # Endpoints públicos (solo lectura)
    path('', views.ProductoListView.as_view(), name='producto-list'),
    path('destacados/', views.ProductoDestacadosView.as_view(), name='producto-destacados'),
    path('categorias/', views.CategoriaListView.as_view(), name='categoria-list'),
    path('<slug:slug>/', views.ProductoDetailView.as_view(), name='producto-detail'),

    # Endpoints admin (CRUD completo)
    path('admin/', include(router.urls)),
]
