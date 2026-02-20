"""
URLs de la app common.
Endpoints bajo api/v1/contacto/
"""
from django.urls import path

from . import views

urlpatterns = [
    # Endpoints públicos
    path('', views.ContactoCreateView.as_view(), name='contacto-crear'),
    path('newsletter/', views.NewsletterSuscribirView.as_view(), name='newsletter-suscribir'),

    # Endpoints admin
    path('admin/', views.AdminContactoListView.as_view(), name='admin-contacto-list'),
    path('admin/<int:pk>/estado/', views.AdminContactoActualizarEstadoView.as_view(), name='admin-contacto-estado'),
    path('admin/newsletter/', views.AdminSuscripcionesListView.as_view(), name='admin-newsletter-list'),
]
