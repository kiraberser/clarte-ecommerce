"""
Modelos de inventario: Categoría y Producto.
Incluye soft delete (campo activo), slug auto-generado
y operaciones atómicas de stock con F() expressions.
"""
import logging

from django.db import models
from django.utils.text import slugify
from django.utils.translation import gettext_lazy as _
from django.db.models import F

logger = logging.getLogger('clarte')


class Categoria(models.Model):
    """Categoría de productos (ej: Lámparas de techo, Lámparas de mesa)."""

    nombre = models.CharField(_('nombre'), max_length=200)
    slug = models.SlugField(_('slug'), max_length=220, unique=True, blank=True)
    descripcion = models.TextField(_('descripción'), blank=True, default='')
    imagen = models.URLField(
        _('imagen'),
        max_length=500,
        blank=True,
        default='',
    )
    activo = models.BooleanField(_('activo'), default=True)
    orden = models.PositiveIntegerField(_('orden'), default=0)

    class Meta:
        verbose_name = _('categoría')
        verbose_name_plural = _('categorías')
        ordering = ['orden', 'nombre']

    def __str__(self):
        return self.nombre

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.nombre)
            # Garantizar unicidad del slug
            original_slug = self.slug
            counter = 1
            while Categoria.objects.filter(slug=self.slug).exclude(pk=self.pk).exists():
                self.slug = f'{original_slug}-{counter}'
                counter += 1
        super().save(*args, **kwargs)


class ProductoQuerySet(models.QuerySet):
    """QuerySet personalizado para filtrar productos activos por defecto."""

    def activos(self):
        return self.filter(activo=True)

    def destacados(self):
        return self.filter(activo=True, destacado=True)


class ProductoManager(models.Manager):
    """Manager que expone el QuerySet personalizado."""

    def get_queryset(self):
        return ProductoQuerySet(self.model, using=self._db)

    def activos(self):
        return self.get_queryset().activos()

    def destacados(self):
        return self.get_queryset().destacados()


class Producto(models.Model):
    """
    Producto del catálogo de lámparas.
    Usa soft delete (campo activo) — nunca se borran productos.
    """

    nombre = models.CharField(_('nombre'), max_length=300)
    slug = models.SlugField(_('slug'), max_length=320, unique=True, blank=True)
    descripcion = models.TextField(_('descripción'), blank=True, default='')
    precio = models.DecimalField(_('precio'), max_digits=10, decimal_places=2)
    precio_oferta = models.DecimalField(
        _('precio de oferta'),
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
    )
    sku = models.CharField(_('SKU'), max_length=50, unique=True)
    imagen_principal = models.URLField(
        _('imagen principal'),
        max_length=500,
        blank=True,
        default='',
    )
    imagenes = models.JSONField(
        _('imágenes adicionales'),
        default=list,
        blank=True,
        help_text=_('Lista de URLs de imágenes adicionales.'),
    )
    dimensiones = models.JSONField(
        _('dimensiones'),
        default=dict,
        blank=True,
        help_text=_('Dimensiones del producto. Ej: {"alto": "31.7 cm", "diámetro": "25.4 cm"}'),
    )
    detalles_tecnicos = models.JSONField(
        _('detalles técnicos'),
        default=dict,
        blank=True,
        help_text=_('Detalles técnicos. Ej: {"switch": "E27", "voltaje": "220-240V"}'),
    )
    materiales = models.JSONField(
        _('materiales'),
        default=list,
        blank=True,
        help_text=_('Lista de materiales. Ej: ["Polímero biodegradable", "Acero inoxidable"]'),
    )
    categoria = models.ForeignKey(
        Categoria,
        on_delete=models.PROTECT,
        related_name='productos',
        verbose_name=_('categoría'),
    )
    stock = models.PositiveIntegerField(_('stock'), default=0)
    activo = models.BooleanField(_('activo'), default=True)
    destacado = models.BooleanField(_('destacado'), default=False)
    created_at = models.DateTimeField(_('fecha de creación'), auto_now_add=True)
    updated_at = models.DateTimeField(_('fecha de actualización'), auto_now=True)

    objects = ProductoManager()

    class Meta:
        verbose_name = _('producto')
        verbose_name_plural = _('productos')
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['sku']),
            models.Index(fields=['activo', 'destacado']),
            models.Index(fields=['categoria', 'activo']),
        ]

    def __str__(self):
        return self.nombre

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.nombre)
            original_slug = self.slug
            counter = 1
            while Producto.objects.filter(slug=self.slug).exclude(pk=self.pk).exists():
                self.slug = f'{original_slug}-{counter}'
                counter += 1
        super().save(*args, **kwargs)

    @property
    def precio_final(self):
        """Retorna el precio de oferta si existe, de lo contrario el precio normal."""
        if self.precio_oferta is not None:
            return self.precio_oferta
        return self.precio

    @property
    def en_stock(self):
        return self.stock > 0

    def verificar_stock(self, cantidad):
        """Verifica si hay suficiente stock para la cantidad solicitada."""
        return self.stock >= cantidad

    def decrementar_stock(self, cantidad):
        """
        Decrementa el stock de forma atómica usando F() expressions.
        Previene race conditions en operaciones concurrentes.
        Retorna True si el decremento fue exitoso, False si no hay stock.
        """
        filas_actualizadas = Producto.objects.filter(
            pk=self.pk,
            stock__gte=cantidad,
        ).update(stock=F('stock') - cantidad)

        if filas_actualizadas == 0:
            logger.warning(
                'Stock insuficiente para producto %s (SKU: %s). '
                'Solicitado: %d, Disponible: %d',
                self.nombre, self.sku, cantidad, self.stock,
            )
            return False

        # Refrescar el objeto en memoria con el valor actualizado
        self.refresh_from_db(fields=['stock'])
        logger.info(
            'Stock decrementado: producto %s (SKU: %s), cantidad: %d, stock restante: %d',
            self.nombre, self.sku, cantidad, self.stock,
        )
        return True

    def incrementar_stock(self, cantidad):
        """Incrementa el stock de forma atómica (para cancelaciones/devoluciones)."""
        Producto.objects.filter(pk=self.pk).update(stock=F('stock') + cantidad)
        self.refresh_from_db(fields=['stock'])
        logger.info(
            'Stock incrementado: producto %s (SKU: %s), cantidad: %d, stock actual: %d',
            self.nombre, self.sku, cantidad, self.stock,
        )
