from django.db import models
from django.conf import settings

# Create your models here.
class Auditoria(models.Model):

    class Accion(models.TextChoices):
        CREATE = 'C', 'Create'
        UPDATE = 'U', 'Update'
        DELETE = 'D', 'Delete'

    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    accion = models.CharField(max_length=1, choices=Accion.choices)
    modulo = models.CharField(max_length=100) # Ej: Cliente, Cita
    objeto_anterior = models.JSONField(null=True, blank=True)
    objeto_nuevo = models.JSONField(null=True, blank=True)
    fecha_sistema = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Auditorías"
        ordering = ['-fecha_sistema']