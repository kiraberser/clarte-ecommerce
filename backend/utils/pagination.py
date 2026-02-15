"""
Paginación personalizada para la API de Clarté.
"""
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class StandardResultsPagination(PageNumberPagination):
    """
    Paginador estándar con 12 elementos por página.
    Permite que el cliente solicite un tamaño diferente vía query param `page_size`.
    Máximo permitido: 100 elementos por página.
    """
    page_size = 12
    page_size_query_param = 'page_size'
    max_page_size = 100

    def get_paginated_response(self, data):
        return Response({
            'success': True,
            'message': 'OK',
            'data': {
                'count': self.page.paginator.count,
                'total_pages': self.page.paginator.num_pages,
                'current_page': self.page.number,
                'next': self.get_next_link(),
                'previous': self.get_previous_link(),
                'results': data,
            },
            'errors': None,
        })
