"""
URLs principales de Clarté Backend.
Todos los endpoints de la API bajo el prefijo api/v1/
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from apps.usuarios.urls import auth_urlpatterns, usuarios_urlpatterns

urlpatterns = [
    path('admin/', admin.site.urls),

    # ── API v1 ──
    path('api/v1/auth/', include((auth_urlpatterns, 'auth'))),
    path('api/v1/usuarios/', include((usuarios_urlpatterns, 'usuarios'))),
    path('api/v1/productos/', include('apps.inventario.urls')),
    path('api/v1/pedidos/', include('apps.pedidos.urls')),
    path('api/v1/pagos/', include('apps.pagos.urls')),
    path('api/v1/ventas/', include('apps.ventas.urls')),
    path('api/v1/contacto/', include('apps.common.urls')),
]

# Servir archivos media en desarrollo
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
