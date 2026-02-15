"""
URLs de la app de pedidos.
Endpoints de usuario bajo api/v1/pedidos/
Endpoints admin bajo api/v1/pedidos/admin/
"""
from django.urls import path

from . import views

urlpatterns = [
    # Endpoints de usuario autenticado
    path('', views.MisPedidosListView.as_view(), name='pedido-list'),
    path('crear/', views.CrearPedidoView.as_view(), name='pedido-crear'),

    # Endpoints admin (antes de <str:numero_pedido> para evitar colisión)
    path('admin/', views.AdminPedidosListView.as_view(), name='admin-pedido-list'),
    path('admin/<str:numero_pedido>/', views.AdminPedidoDetailView.as_view(), name='admin-pedido-detail'),
    path('admin/<str:numero_pedido>/estado/', views.AdminActualizarEstadoView.as_view(), name='admin-pedido-estado'),

    # Detalle de pedido (al final, ya que <str:> es catch-all)
    path('<str:numero_pedido>/', views.PedidoDetailView.as_view(), name='pedido-detail'),
    path('<str:numero_pedido>/cancelar/', views.CancelarPedidoView.as_view(), name='pedido-cancelar'),
]
