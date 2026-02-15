"""
URLs de la app de ventas (solo admin).
Endpoints bajo api/v1/ventas/
"""
from django.urls import path

from . import views

urlpatterns = [
    path('', views.VentaListView.as_view(), name='venta-list'),
    path('resumen/', views.ResumenVentasView.as_view(), name='venta-resumen'),
    path('<int:pk>/', views.VentaDetailView.as_view(), name='venta-detail'),
]
