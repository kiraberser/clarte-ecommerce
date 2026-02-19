"""
Vistas de la app de usuarios.
Maneja registro, logout (blacklist JWT), perfil y cambio de contraseña.
Login y refresh de tokens los provee SimpleJWT directamente en las URLs.
"""
import logging

from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from rest_framework import status, generics, permissions
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from apps.common.servicios.brevo_service import enviar_email_registro, enviar_reset_password
from .serializers import (
    RegistroSerializer, UsuarioSerializer, AdminUsuarioSerializer,
    CambioPasswordSerializer, SolicitarResetPasswordSerializer, ResetPasswordSerializer,
)

Usuario = get_user_model()

logger = logging.getLogger('clarte')


class RegistroView(generics.CreateAPIView):
    """
    POST /api/v1/auth/registro/
    Registra un nuevo usuario y retorna sus tokens JWT.
    """
    serializer_class = RegistroSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        usuario = serializer.save()

        # Generar tokens JWT para login automático tras registro
        refresh = RefreshToken.for_user(usuario)

        logger.info('Nuevo usuario registrado: %s (ID: %s)', usuario.email, usuario.id)

        # Enviar email de bienvenida (no bloquea el registro si falla)
        try:
            enviar_email_registro(usuario)
        except Exception as e:
            logger.error('Error al enviar email de registro a %s: %s', usuario.email, e)

        return Response(
            {
                'success': True,
                'message': 'Usuario registrado exitosamente.',
                'data': {
                    'usuario': UsuarioSerializer(usuario).data,
                    'tokens': {
                        'refresh': str(refresh),
                        'access': str(refresh.access_token),
                    },
                },
                'errors': None,
            },
            status=status.HTTP_201_CREATED,
        )


class LogoutView(APIView):
    """
    POST /api/v1/auth/logout/
    Invalida el refresh token agregándolo a la blacklist.
    Espera: {"refresh": "<token>"}
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get('refresh')
        if not refresh_token:
            return Response(
                {
                    'success': False,
                    'message': 'Error de validación.',
                    'data': None,
                    'errors': {'refresh': 'El token de refresh es requerido.'},
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except Exception:
            return Response(
                {
                    'success': False,
                    'message': 'Token inválido o ya expirado.',
                    'data': None,
                    'errors': {'refresh': 'No se pudo invalidar el token.'},
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {
                'success': True,
                'message': 'Sesión cerrada exitosamente.',
                'data': None,
                'errors': None,
            },
            status=status.HTTP_200_OK,
        )


class PerfilView(generics.RetrieveUpdateAPIView):
    """
    GET  /api/v1/usuarios/perfil/  → Obtener perfil del usuario autenticado.
    PATCH /api/v1/usuarios/perfil/ → Actualizar datos de perfil.
    """
    serializer_class = UsuarioSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

    def retrieve(self, request, *args, **kwargs):
        serializer = self.get_serializer(self.get_object())
        return Response(
            {
                'success': True,
                'message': 'OK',
                'data': serializer.data,
                'errors': None,
            },
            status=status.HTTP_200_OK,
        )

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', True)  # Siempre PATCH
        serializer = self.get_serializer(self.get_object(), data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            {
                'success': True,
                'message': 'Perfil actualizado exitosamente.',
                'data': serializer.data,
                'errors': None,
            },
            status=status.HTTP_200_OK,
        )


class AdminUsuariosListView(generics.ListAPIView):
    """
    GET /api/v1/usuarios/admin/
    Lista todos los usuarios (solo admin). Soporta búsqueda.
    """
    serializer_class = AdminUsuarioSerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = Usuario.objects.all().order_by('-date_joined')
    search_fields = ['email', 'username', 'first_name', 'last_name']
    ordering_fields = ['date_joined', 'email']
    ordering = ['-date_joined']


class AdminUsuarioDetailView(generics.RetrieveUpdateAPIView):
    """
    GET  /api/v1/usuarios/admin/<id>/  → Detalle de un usuario.
    PATCH /api/v1/usuarios/admin/<id>/ → Actualizar is_active.
    """
    serializer_class = AdminUsuarioSerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = Usuario.objects.all()

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', True)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        logger.info(
            'Admin actualizó usuario %s (ID: %s): %s',
            instance.email, instance.id, request.data,
        )

        return Response({
            'success': True,
            'message': 'Usuario actualizado.',
            'data': serializer.data,
            'errors': None,
        })


class SolicitarResetPasswordView(APIView):
    """
    POST /api/v1/auth/solicitar-reset/
    Envía un email con enlace de reset si el correo existe.
    Siempre responde con éxito para evitar enumeración de emails.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = SolicitarResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']

        try:
            usuario = Usuario.objects.get(email__iexact=email)
        except Usuario.DoesNotExist:
            pass
        else:
            uid = urlsafe_base64_encode(force_bytes(usuario.pk))
            token = default_token_generator.make_token(usuario)
            reset_url = f"{settings.FRONTEND_URL}/reset-password/{uid}/{token}"
            try:
                enviar_reset_password(usuario, reset_url)
                logger.info('Reset password email enviado a %s', email)
            except Exception as e:
                logger.error('Error enviando reset password email a %s: %s', email, e)

        return Response(
            {
                'success': True,
                'message': 'Si existe una cuenta con ese correo, recibirás un enlace para restablecer tu contraseña.',
                'data': None,
                'errors': None,
            },
            status=status.HTTP_200_OK,
        )


class ResetPasswordView(APIView):
    """
    POST /api/v1/auth/reset-password/
    Valida uid + token y establece la nueva contraseña.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        uid = serializer.validated_data['uid']
        token = serializer.validated_data['token']
        password = serializer.validated_data['password']

        try:
            pk = force_str(urlsafe_base64_decode(uid))
            usuario = Usuario.objects.get(pk=pk)
        except (Usuario.DoesNotExist, ValueError, TypeError, OverflowError):
            return Response(
                {
                    'success': False,
                    'message': 'Enlace inválido o expirado.',
                    'data': None,
                    'errors': {'token': 'El enlace no es válido.'},
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not default_token_generator.check_token(usuario, token):
            return Response(
                {
                    'success': False,
                    'message': 'Enlace inválido o expirado.',
                    'data': None,
                    'errors': {'token': 'El enlace ha expirado o ya fue utilizado.'},
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        usuario.set_password(password)
        usuario.save()
        logger.info('Contraseña restablecida para usuario ID: %s', usuario.id)

        return Response(
            {
                'success': True,
                'message': 'Contraseña restablecida exitosamente. Ya puedes iniciar sesión.',
                'data': None,
                'errors': None,
            },
            status=status.HTTP_200_OK,
        )


class CambioPasswordView(APIView):
    """
    POST /api/v1/usuarios/cambiar-password/
    Cambia la contraseña del usuario autenticado.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = CambioPasswordSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()

        logger.info('Contraseña cambiada para usuario ID: %s', request.user.id)

        return Response(
            {
                'success': True,
                'message': 'Contraseña actualizada exitosamente.',
                'data': None,
                'errors': None,
            },
            status=status.HTTP_200_OK,
        )
