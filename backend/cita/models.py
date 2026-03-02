from django.db import models
from cliente.models import Cliente
from django.conf import settings
# Create your models here.

class EstadoCita(models.Model):
    descripcion = models.CharField(max_length=255, blank=False, null=False)
    alias = models.CharField(max_length=255, blank=False, null=False)

class Cita(models.Model):
    fecha = models.DateTimeField()
    motivo = models.CharField(max_length=255, blank=False, null=False)
    estado_cita = models.ForeignKey(EstadoCita, on_delete=models.CASCADE, related_name="estado")
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE, related_name="cliente")
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="usuario", null=True, blank=True)
    fecha_creacion = models.DateField(auto_now_add=True)


