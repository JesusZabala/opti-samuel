from django.db import models

# Create your models here.
class Cliente(models.Model):
    class Genero(models.TextChoices):
        MASCULINO = 'M', 'Masculino'
        FEMENINO = 'F', 'Femenino'

    class TipoCliente(models.TextChoices):
        VENEZOLANO = 'V', 'Venezolano'
        EXTRANJERO = 'E', 'Extranjero'
        JURIDICO = 'J', 'Juridico'

    class EstadoCliente(models.TextChoices):
        ACTIVO = 'A', 'Activo'
        INACTIVO = 'I', 'Inactivo'
        
    nombre = models.CharField(max_length=255, null=False, blank=False)
    apellido = models.CharField(max_length=255, null=False, blank=False)
    identificacion = models.CharField(max_length=20, null=False, blank=False)
    email = models.CharField(max_length=45, null=False, blank=False)
    telefono = models.CharField(max_length=45, null=False, blank=False)
    tipo_cliente = models.CharField(max_length=1, choices=TipoCliente.choices, blank=False, null=False)
    estado_cliente = models.CharField(max_length=1, choices=EstadoCliente.choices, blank=False, null=False)
    genero = models.CharField(max_length=1, choices=Genero.choices, blank=False, null=False)
    registered_at = models.DateField(auto_now_add=True)
