from django.db import models
from cliente.models import Cliente
from django.conf import settings
# Create your models here.
class Cita(models.Model):
    class EstadoCita(models.TextChoices):
        AGENDADA = 'A', 'Agendada'
        CANCELADA = 'C', 'Cancelada'
        COMPLETADA = 'COM', 'Completada'
        RECETA_REGISTRADA = 'RR', 'Receta Registrada'

    fecha = models.DateTimeField()
    motivo = models.CharField(max_length=255, blank=False, null=False)
    estado_cita = models.CharField(max_length=3, choices=EstadoCita.choices,default=EstadoCita.AGENDADA, blank=False, null=False)
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE, related_name="cliente")
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="usuario", null=True, blank=True)
    fecha_creacion = models.DateField(auto_now_add=True)


