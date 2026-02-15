"""
Permisos personalizados para la app de usuarios.
Reutilizables por otras apps (pedidos, ventas, etc.).
"""
from rest_framework.permissions import BasePermission


class IsOwner(BasePermission):
    """
    Permite acceso solo al propietario del objeto.
    El objeto debe tener un atributo `usuario` que apunte al User.
    """
    message = 'No tienes permisos para acceder a este recurso.'

    def has_object_permission(self, request, view, obj):
        return obj.usuario == request.user


class IsOwnerOrAdmin(BasePermission):
    """
    Permite acceso al propietario del objeto o a un admin.
    """
    message = 'No tienes permisos para acceder a este recurso.'

    def has_object_permission(self, request, view, obj):
        return obj.usuario == request.user or request.user.is_staff
