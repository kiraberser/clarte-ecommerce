"""
URLs de la app de usuarios.

Se dividen en dos prefijos:
  - api/v1/auth/     → registro, login, refresh, logout
  - api/v1/usuarios/ → perfil, cambio de contraseña
"""
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from . import views

# Rutas de autenticación (api/v1/auth/)
auth_urlpatterns = [
    path('registro/', views.RegistroView.as_view(), name='auth-registro'),
    path('login/', TokenObtainPairView.as_view(), name='auth-login'),
    path('refresh/', TokenRefreshView.as_view(), name='auth-refresh'),
    path('logout/', views.LogoutView.as_view(), name='auth-logout'),
    path('solicitar-reset/', views.SolicitarResetPasswordView.as_view(), name='auth-solicitar-reset'),
    path('reset-password/', views.ResetPasswordView.as_view(), name='auth-reset-password'),
]

# Rutas de usuario (api/v1/usuarios/)
usuarios_urlpatterns = [
    path('perfil/', views.PerfilView.as_view(), name='usuario-perfil'),
    path('cambiar-password/', views.CambioPasswordView.as_view(), name='usuario-cambiar-password'),
    path('admin/', views.AdminUsuariosListView.as_view(), name='usuario-admin-list'),
    path('admin/<int:pk>/', views.AdminUsuarioDetailView.as_view(), name='usuario-admin-detail'),
]
