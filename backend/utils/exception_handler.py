"""
Handler de excepciones personalizado para DRF.
Retorna respuestas JSON con estructura consistente:
{success, message, data, errors}
"""
import logging

from rest_framework.views import exception_handler
from rest_framework import status
from django.http import Http404
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework.exceptions import (
    ValidationError as DRFValidationError,
    AuthenticationFailed,
    NotAuthenticated,
    PermissionDenied,
)

logger = logging.getLogger('clarte')


def custom_exception_handler(exc, context):
    """
    Intercepta excepciones de DRF y las formatea en una estructura uniforme.
    Estructura: {success: bool, message: str, data: null, errors: dict|list|null}
    """
    # Convertir ValidationError de Django a DRF para que el handler lo procese
    if isinstance(exc, DjangoValidationError):
        exc = DRFValidationError(detail=exc.message_dict if hasattr(exc, 'message_dict') else exc.messages)

    response = exception_handler(exc, context)

    if response is None:
        # Excepción no manejada por DRF (error 500)
        logger.error(
            'Error no manejado: %s',
            str(exc),
            exc_info=True,
            extra={'context': str(context.get('view', ''))}
        )
        return None

    # Determinar mensaje legible según el tipo de excepción
    if isinstance(exc, AuthenticationFailed):
        message = 'Credenciales inválidas.'
    elif isinstance(exc, NotAuthenticated):
        message = 'Autenticación requerida.'
    elif isinstance(exc, PermissionDenied):
        message = 'No tienes permisos para realizar esta acción.'
    elif isinstance(exc, Http404):
        message = 'Recurso no encontrado.'
    elif isinstance(exc, DRFValidationError):
        message = 'Error de validación.'
    else:
        message = 'Ha ocurrido un error.'

    # Extraer errores del response original
    errors = response.data if isinstance(response.data, (dict, list)) else {'detail': response.data}

    response.data = {
        'success': False,
        'message': message,
        'data': None,
        'errors': errors,
    }

    return response
