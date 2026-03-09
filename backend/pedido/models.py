from django.db import models
from receta_visual.models import RecetaVisual
from cliente.models import Cliente

# Create your models here.
class TipoLente(models.Model):
    descripcion = models.CharField(max_length=255, blank=False, null=False)
    alias = models.CharField(max_length=255, blank=False, null=False)

class TipoTratamiento(models.Model):
    descripcion = models.CharField(max_length=255, blank=False, null=False)
    alias = models.CharField(max_length=255, blank=False, null=False)

class Lente(models.Model):
    tipo_lente = models.ForeignKey(TipoLente, on_delete=models.CASCADE, related_name='tipo_lente')
    tipo_tratamiento = models.ForeignKey(TipoTratamiento, on_delete=models.CASCADE, related_name='tipo_tratamiento')
    sku_lente = models.CharField(max_length=255, blank=False, null=False)
    dimension_lente = models.CharField(max_length=255, blank=False, null=False)

class ModeloMontura(models.Model):
    descripcion = models.CharField(max_length=255, blank=False, null=False)
    alias = models.CharField(max_length=255, blank=False, null=False)

class ColorMontura(models.Model):
    descripcion = models.CharField(max_length=255, blank=False, null=False)
    alias = models.CharField(max_length=255, blank=False, null=False)

class MarcaMontura(models.Model):
    descripcion = models.CharField(max_length=255, blank=False, null=False)
    alias = models.CharField(max_length=255, blank=False, null=False)

class MedidasMontura(models.Model):
    sku_monturas = models.CharField(max_length=255, blank=False, null=False)
    largo = models.DecimalField(max_digits=10, decimal_places=2, blank=False, null=False)
    ancho = models.DecimalField(max_digits=10, decimal_places=2, blank=False, null=False)

class Montura(models.Model):
    modelo = models.ForeignKey(ModeloMontura, on_delete=models.CASCADE, related_name='modelo')
    marca = models.ForeignKey(MarcaMontura, on_delete=models.CASCADE, related_name='marca')
    color = models.ForeignKey(ColorMontura, on_delete=models.CASCADE, related_name='color')
    medidas = models.ForeignKey(MedidasMontura, on_delete=models.CASCADE, related_name='medida')
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
    id_cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE, null=True, blank=True)
    fecha_emision = models.DateTimeField()
    fecha_sistema = models.DateTimeField(auto_now_add=True)
    descripcion = models.CharField(max_length=255, blank=False, null=False)
    observacion = models.CharField(max_length=255, blank=False, null=False)
    fecha_entrega = models.DateTimeField()
    fecha_completado = models.DateTimeField()
    fecha_entregado = models.DateTimeField()

class DetallePedido(models.Model):
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE, related_name='pedido')
    montura = models.ForeignKey(Montura, on_delete=models.CASCADE, related_name='montura', null=True, blank=True)
    lente = models.ForeignKey(Lente, on_delete=models.CASCADE, related_name='lente', null=True, blank=True)
    fecha_sistema = models.DateTimeField()
    fecha_completado = models.DateTimeField()
    
    

    



    

    
