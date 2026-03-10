from django.db import models
from django.conf import settings

# Create your models here.
class Auditoria(models.Model):

    class Accion(models.TextChoices):
        CREATE = 'C', 'Create'
        READ = 'R', 'Read'
        UPDATE = 'U', 'Update'
        DELETE = 'D', 'Delete'

    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='auditorias')
    accion = models.CharField(max_length=1, choices=Accion.choices, blank=False, null=False)
    fecha = models.DateTimeField()
    modulo = models.TextField()
    objeto_anterior = models.TextField()
    objeto_nuevo = models.TextField()
    fecha_sistema = models.DateTimeField(auto_now_add=True) 
     
