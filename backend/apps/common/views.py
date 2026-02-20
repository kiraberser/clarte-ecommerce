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

        # Enviar notificación al admin + confirmación al usuario
        try:
            from .servicios.brevo_service import (
                enviar_notificacion_contacto,
                enviar_confirmacion_contacto,
            )
            enviar_notificacion_contacto(contacto)
            enviar_confirmacion_contacto(contacto)
        except Exception as e:
            logger.error('Error al enviar emails de contacto: %s', e)

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
            agregar_contacto_newsletter(suscripcion.email, suscripcion.nombre)
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
    filterset_fields = ['estado']
    search_fields = ['nombre', 'email', 'asunto']
    ordering = ['-created_at']


class AdminContactoActualizarEstadoView(generics.UpdateAPIView):
    """
    PATCH /api/v1/contacto/admin/<int:pk>/estado/
    Actualiza el estado de un contacto: pendiente | leido | respondido (solo admin).
    """
    serializer_class = ContactoAdminSerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = Contacto.objects.all()

    def patch(self, request, *args, **kwargs):
        contacto = self.get_object()
        nuevo_estado = request.data.get('estado')

        estados_validos = [c[0] for c in Contacto.EstadoChoices.choices]
        if nuevo_estado not in estados_validos:
            return Response(
                {
                    'success': False,
                    'message': f'Estado inválido. Opciones: {", ".join(estados_validos)}.',
                    'data': None,
                    'errors': {'estado': [f'Debe ser uno de: {", ".join(estados_validos)}']},
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        contacto.estado = nuevo_estado
        contacto.save(update_fields=['estado'])
        return Response(
            {
                'success': True,
                'message': f'Estado actualizado a "{nuevo_estado}".',
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
