from django.db import models

# Create your models here.
class TipoCliente(models.Model):
    descripcion = models.CharField(max_length=255, null=False, blank=False)
    alias = models.CharField(max_length=20, null=False, blank=False)

class EstadoCliente(models.Model):
    descripcion = models.CharField(max_length=255, null=False, blank=False)
    alias = models.CharField(max_length=20, null=False, blank=False)

class Genero(models.Model):
    descripcion = models.CharField(max_length=255, null=False, blank=False)
    alias = models.CharField(max_length=20, null=False, blank=False)

class Cliente(models.Model):
    nombre = models.CharField(max_length=255, null=False, blank=False)
    apellido = models.CharField(max_length=255, null=False, blank=False)
    identificacion = models.CharField(max_length=20, null=False, blank=False)
    email = models.CharField(max_length=45, null=False, blank=False)
    telefono = models.CharField(max_length=45, null=False, blank=False)
    tipo_cliente = models.ForeignKey(TipoCliente, on_delete=models.CASCADE, related_name="tipo_cliente")
    estado_cliente = models.ForeignKey(EstadoCliente, on_delete=models.CASCADE, related_name="estado_cliente")
    genero = models.ForeignKey(Genero, on_delete=models.CASCADE, related_name="genero_cliente")
    registered_at = models.DateField(auto_now_add=True)
