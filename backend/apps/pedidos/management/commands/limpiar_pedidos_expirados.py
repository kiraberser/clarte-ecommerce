"""
Management command: limpiar_pedidos_expirados

Cancela pedidos en estado PENDIENTE que lleven más de N horas sin ser pagados
y restaura el stock de cada item.

Uso:
    python manage.py limpiar_pedidos_expirados
    python manage.py limpiar_pedidos_expirados --horas 48
    python manage.py limpiar_pedidos_expirados --dry-run
"""
from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta


class Command(BaseCommand):
    help = 'Cancela pedidos PENDIENTE expirados y restaura su stock.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--horas',
            type=int,
            default=24,
            help='Antigüedad en horas para considerar un pedido expirado (default: 24).',
        )
        parser.add_argument(
            '--dry-run',
            action='store_true',
            default=False,
            help='Muestra los pedidos que serían cancelados sin realizar cambios.',
        )

    def handle(self, *args, **options):
        horas = options['horas']
        dry_run = options['dry_run']

        # Import here to avoid AppRegistryNotReady at module level
        from apps.pedidos.models import Pedido

        cutoff = timezone.now() - timedelta(hours=horas)

        pedidos = Pedido.objects.filter(
            estado='pendiente',
            created_at__lt=cutoff,
        ).prefetch_related('items__producto')

        total = pedidos.count()

        if total == 0:
            self.stdout.write(self.style.SUCCESS('No hay pedidos expirados para cancelar.'))
            return

        if dry_run:
            self.stdout.write(
                self.style.WARNING(
                    f'[DRY-RUN] Se cancelarían {total} pedido(s) con más de {horas}h en estado PENDIENTE:'
                )
            )
            for pedido in pedidos:
                self.stdout.write(f'  • {pedido.numero_pedido} — creado {pedido.created_at}')
            return

        cancelados = 0
        for pedido in pedidos:
            try:
                for item in pedido.items.all():
                    item.producto.incrementar_stock(item.cantidad)
                pedido.estado = 'cancelado'
                pedido.save(update_fields=['estado', 'updated_at'])
                cancelados += 1
                self.stdout.write(f'  Cancelado: {pedido.numero_pedido}')
            except Exception as exc:
                self.stderr.write(
                    self.style.ERROR(f'  Error al cancelar {pedido.numero_pedido}: {exc}')
                )

        self.stdout.write(
            self.style.SUCCESS(
                f'Listo: {cancelados}/{total} pedidos cancelados y stock restaurado.'
            )
        )
