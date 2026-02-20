from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import CuponAdminViewSet, ValidarCuponView

router = DefaultRouter()
router.register('admin', CuponAdminViewSet, basename='cupon-admin')

urlpatterns = [
    path('validar/', ValidarCuponView.as_view(), name='validar-cupon'),
    path('', include(router.urls)),
]
