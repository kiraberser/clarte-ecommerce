"""
Mixin para envolver respuestas de ViewSets en la estructura estándar:
{success: bool, message: str, data: ..., errors: null}
"""
from rest_framework.response import Response


class StandardResponseMixin:
    """
    Wraps create, update, partial_update, retrieve and destroy
    responses in the standard API envelope.
    The list action is handled by the paginator (paginated)
    or by finalize_response (non-paginated).
    """

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        response.data = {
            'success': True,
            'message': 'Creado exitosamente.',
            'data': response.data,
            'errors': None,
        }
        return response

    def retrieve(self, request, *args, **kwargs):
        response = super().retrieve(request, *args, **kwargs)
        response.data = {
            'success': True,
            'message': 'OK',
            'data': response.data,
            'errors': None,
        }
        return response

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        response.data = {
            'success': True,
            'message': 'Actualizado exitosamente.',
            'data': response.data,
            'errors': None,
        }
        return response

    def partial_update(self, request, *args, **kwargs):
        response = super().partial_update(request, *args, **kwargs)
        response.data = {
            'success': True,
            'message': 'Actualizado exitosamente.',
            'data': response.data,
            'errors': None,
        }
        return response

    def destroy(self, request, *args, **kwargs):
        super().destroy(request, *args, **kwargs)
        return Response({
            'success': True,
            'message': 'Eliminado exitosamente.',
            'data': None,
            'errors': None,
        })

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        # If not paginated (pagination_class = None), wrap manually
        if self.pagination_class is None or self.paginator is None:
            response.data = {
                'success': True,
                'message': 'OK',
                'data': response.data,
                'errors': None,
            }
        # If paginated, the paginator already wraps the response
        return response
