from django.db import models
from cita.models import Cita
from cliente.models import Cliente


class RecetaVisual(models.Model):
    cita = models.ForeignKey(Cita, on_delete=models.CASCADE, related_name='cita', null=True, blank=True)
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE, related_name='recetas_del_cliente',null=True,blank=True)
    observaciones = models.CharField(max_length=255, blank=False, null=False)
    fecha_sistema = models.DateField(auto_now=True)
    fecha_creacion = models.DateField(auto_now_add=True)


class Oculus(models.Model):
    descripcion = models.CharField(max_length=255, blank=False, null=False)
    alias = models.CharField(max_length=255, blank=False, null=False)
    esfera = models.DecimalField(max_digits=10, decimal_places=2, blank=False, null=False)
    cilindro = models.DecimalField(max_digits=10, decimal_places=2, blank=False, null=False)
    eje = models.IntegerField(null=False, blank=False)


class RecetaVisualDetalle(models.Model):
    receta_visual = models.ForeignKey(RecetaVisual, on_delete=models.CASCADE, related_name="rv_detalle")
    oculus = models.ForeignKey(Oculus, on_delete=models.CASCADE, related_name='oculus')
    adicion = models.DecimalField(max_digits=10, decimal_places=2, blank=False, null=False)
    distancia_pupilar = models.DecimalField(max_digits=10, decimal_places=2, blank=False, null=False)

