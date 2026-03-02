from django.db import models
from django.conf import settings

# Create your models here.

class Accion(models.Model):
    descripcion = models.CharField(max_length=255, blank=False, null=False)
    alias = models.CharField(max_length=255, blank=False, null=False)

class Auditoria(models.Model):
    accion = models.ForeignKey(Accion, on_delete=models.CASCADE, related_name='accion')
    fecha = models.DateTimeField()
    modulo = models.TextField()
    objeto_anterior = models.TextField()
    objeto_nuevo = models.TextField()
    fecha_sistema = models.DateTimeField(auto_now_add=True) 
     
