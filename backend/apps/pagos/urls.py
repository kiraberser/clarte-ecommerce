"""
URLs de la app de pagos.
Endpoints bajo api/v1/pagos/
"""
from django.urls import path

from . import views

urlpatterns = [
    path('admin/', views.AdminPagosListView.as_view(), name='pago-admin-list'),
    path('admin/<int:pk>/', views.AdminPagoDetailView.as_view(), name='pago-admin-detail'),
    path('crear-preferencia/', views.CrearPreferenciaPagoView.as_view(), name='pago-crear-preferencia'),
    path('procesar-card/', views.ProcesarPagoCardView.as_view(), name='pago-procesar-card'),
    path('webhook/', views.WebhookView.as_view(), name='pago-webhook'),
    path('<int:pago_id>/', views.ConsultarPagoView.as_view(), name='pago-consultar'),
]
