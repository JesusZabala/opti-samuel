from django.db import models
from receta_visual.models import RecetaVisual
from cliente.models import Cliente

# Create your models here.
class TipoLente(models.Model):
    descripcion = models.CharField(max_length=255, blank=False, null=False)
    alias = models.CharField(max_length=255, blank=False, null=False)


    def __str__(self):
        return self.descripcion

class TipoTratamiento(models.Model):
    descripcion = models.CharField(max_length=255, blank=False, null=False)
    alias = models.CharField(max_length=255, blank=False, null=False)

    def __str__(self):
        return self.descripcion

class Lente(models.Model):
    tipo_lente = models.ForeignKey(TipoLente, on_delete=models.CASCADE, related_name='tipo_lente')
    tipo_tratamiento = models.ForeignKey(TipoTratamiento, on_delete=models.CASCADE, related_name='tipo_tratamiento')
    
class ModeloMontura(models.Model):
    descripcion = models.CharField(max_length=255, blank=False, null=False)
    alias = models.CharField(max_length=255, blank=False, null=False)

    def __str__(self):
        return self.descripcion

class ColorMontura(models.Model):
    descripcion = models.CharField(max_length=255, blank=False, null=False)
    alias = models.CharField(max_length=255, blank=False, null=False)

    def __str__(self):
        return self.descripcion

class MarcaMontura(models.Model):
    descripcion = models.CharField(max_length=255, blank=False, null=False)
    alias = models.CharField(max_length=255, blank=False, null=False)

    def __str__(self):
        return self.descripcion

# class MedidasMontura(models.Model):
#     sku_monturas = models.CharField(max_length=255, blank=False, null=False)
#     largo = models.DecimalField(max_digits=10, decimal_places=2, blank=False, null=False)
#     ancho = models.DecimalField(max_digits=10, decimal_places=2, blank=False, null=False)

#     def __str__(self):
#         return f"{self.sku_monturas} ({self.ancho} x {self.largo})"

class Montura(models.Model):
    modelo = models.ForeignKey(ModeloMontura, on_delete=models.CASCADE, related_name='modelo')
    marca = models.ForeignKey(MarcaMontura, on_delete=models.CASCADE, related_name='marca')
    color = models.ForeignKey(ColorMontura, on_delete=models.CASCADE, related_name='color')
    # medidas = models.ForeignKey(MedidasMontura, on_delete=models.CASCADE, related_name='medida')
    material = models.CharField(max_length=255, blank=False, null=False)
    fecha_registro = models.DateField(auto_now_add=True)

class Pedido(models.Model):

    class EstadoPedido(models.TextChoices):
        ENVIADO = 'E', 'Enviado'
        LISTO = 'L','Listo'
        ENTREGADO = 'EN', 'Entregado'

    class TipoPedido(models.TextChoices):
        SOLO_LENTE = 'SL', 'Solo Lente'
        SOLO_MONTURA = 'SM', 'Solo Montura'
        COMPLETO = 'C', 'Completo'


    tipo_pedido = models.CharField(max_length=2, choices=TipoPedido.choices, blank=False, null=False)
    estado_pedido = models.CharField(max_length=2, choices=EstadoPedido.choices, default=EstadoPedido.ENVIADO, blank=False, null=False)
    receta_visual = models.ForeignKey(RecetaVisual, on_delete=models.CASCADE, related_name='receta', blank=True, null=True)
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE, null=True, blank=True, related_name="pedidos_cliente")
    fecha_emision = models.DateTimeField(blank=True, null=True,auto_now_add=True)
    fecha_sistema = models.DateTimeField(auto_now_add=True,blank=True, null=True)
    descripcion = models.CharField(max_length=255, blank=False, null=False)
    observacion = models.CharField(max_length=255, blank=False, null=False)
    fecha_entrega = models.DateTimeField(blank=True, null=True)
    fecha_completado = models.DateTimeField(blank=True, null=True)
    fecha_entregado = models.DateTimeField(blank=True, null=True)

class DetallePedido(models.Model):
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE, related_name='detalles')
    montura = models.ForeignKey(Montura, on_delete=models.CASCADE, related_name='montura', null=True, blank=True)
    lente = models.ForeignKey(Lente, on_delete=models.CASCADE, related_name='lente', null=True, blank=True)
    medida = models.CharField(max_length=255, blank=True, null=True)
    fecha_sistema = models.DateTimeField(auto_now_add=True)
    fecha_completado = models.DateTimeField(null=True, blank=True)
    