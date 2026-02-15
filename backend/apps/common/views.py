"""
Vistas de la app common.
Endpoints públicos: contacto y newsletter.
Endpoints admin: listar contactos/suscriptores, marcar como leído.
"""
import logging

from rest_framework import generics, status, permissions
from rest_framework.response import Response

from .models import Contacto, SuscripcionNewsletter
from .serializers import (
    ContactoSerializer,
    ContactoAdminSerializer,
    SuscripcionNewsletterSerializer,
    SuscripcionAdminSerializer,
)

logger = logging.getLogger('clarte')


# ──────────────────────────────────────────────
# ENDPOINTS PÚBLICOS
# ──────────────────────────────────────────────

class ContactoCreateView(generics.CreateAPIView):
    """
    POST /api/v1/contacto/
    Envía un mensaje de contacto (público).
    Dispara notificación al admin vía Brevo.
    """
    serializer_class = ContactoSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        contacto = serializer.save()

        # Enviar notificación al admin (async-safe: no bloquea si falla)
        try:
            from .servicios.brevo_service import enviar_notificacion_contacto
            enviar_notificacion_contacto(contacto)
        except Exception as e:
            logger.error('Error al enviar notificación de contacto: %s', e)

        return Response(
            {
                'success': True,
                'message': 'Mensaje enviado exitosamente. Nos pondremos en contacto contigo pronto.',
                'data': serializer.data,
                'errors': None,
            },
            status=status.HTTP_201_CREATED,
        )


class NewsletterSuscribirView(generics.CreateAPIView):
    """
    POST /api/v1/contacto/newsletter/
    Suscribirse al newsletter (público).
    Agrega contacto a lista de Brevo.
    """
    serializer_class = SuscripcionNewsletterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        suscripcion = serializer.save()

        # Agregar a lista de Brevo
        try:
            from .servicios.brevo_service import agregar_contacto_newsletter
            agregar_contacto_newsletter(suscripcion.email)
        except Exception as e:
            logger.error('Error al agregar contacto a Brevo: %s', e)

        return Response(
            {
                'success': True,
                'message': 'Suscripción al newsletter exitosa.',
                'data': {'email': suscripcion.email},
                'errors': None,
            },
            status=status.HTTP_201_CREATED,
        )


# ──────────────────────────────────────────────
# ENDPOINTS ADMIN
# ──────────────────────────────────────────────

class AdminContactoListView(generics.ListAPIView):
    """
    GET /api/v1/contacto/admin/
    Lista todos los mensajes de contacto (solo admin).
    """
    serializer_class = ContactoAdminSerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = Contacto.objects.all()
    filterset_fields = ['leido']
    search_fields = ['nombre', 'email', 'asunto']
    ordering = ['-created_at']


class AdminContactoMarcarLeidoView(generics.UpdateAPIView):
    """
    PATCH /api/v1/contacto/admin/<int:pk>/leido/
    Marca un contacto como leído (solo admin).
    """
    serializer_class = ContactoAdminSerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = Contacto.objects.all()

    def patch(self, request, *args, **kwargs):
        contacto = self.get_object()
        contacto.leido = True
        contacto.save(update_fields=['leido'])
        return Response(
            {
                'success': True,
                'message': 'Contacto marcado como leído.',
                'data': ContactoAdminSerializer(contacto).data,
                'errors': None,
            },
            status=status.HTTP_200_OK,
        )


class AdminSuscripcionesListView(generics.ListAPIView):
    """
    GET /api/v1/contacto/admin/newsletter/
    Lista todas las suscripciones al newsletter (solo admin).
    """
    serializer_class = SuscripcionAdminSerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = SuscripcionNewsletter.objects.all()
    filterset_fields = ['activo']
    search_fields = ['email']
    ordering = ['-created_at']
