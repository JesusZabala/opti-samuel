from django.contrib import admin
from .models import (
    TipoLente, TipoTratamiento, Lente, 
    ModeloMontura, ColorMontura, MarcaMontura, 
    Montura, Pedido, DetallePedido
) # ❌ Nos aseguramos de que MedidasMontura NO esté aquí metido

# 1. Tablas Maestras (Las que alimentas primero)
@admin.register(TipoLente)
class TipoLenteAdmin(admin.ModelAdmin):
    list_display = ('descripcion', 'alias')

@admin.register(ColorMontura)
class ColorAdmin(admin.ModelAdmin):
    list_display = ('descripcion', 'alias')

@admin.register(MarcaMontura)
class MarcaAdmin(admin.ModelAdmin):
    list_display = ('descripcion', 'alias')

@admin.register(ModeloMontura)
class ModeloAdmin(admin.ModelAdmin):
    list_display = ('descripcion', 'alias')

# 2. Tablas de Configuración Técnica
admin.site.register(TipoTratamiento)

# 3. Tablas Principales (Los productos y ventas)
@admin.register(Montura)
class MonturaAdmin(admin.ModelAdmin):
    list_display = ('marca', 'modelo', 'color', 'material', 'fecha_registro')
    list_filter = ('marca', 'color') 
    # ❌ Se eliminó cualquier referencia interna a 'medidas' si la tenías en list_display

@admin.register(Lente)
class LenteAdmin(admin.ModelAdmin):
    list_display = ('id', 'tipo_lente', 'tipo_tratamiento')

@admin.register(Pedido)
class PedidoAdmin(admin.ModelAdmin):
    list_display = ('id', 'cliente', 'tipo_pedido', 'estado_pedido', 'fecha_emision')
    list_editable = ('estado_pedido',) 
    list_filter = ('estado_pedido', 'tipo_pedido')

# 🌟 Mejoramos el registro del Detalle para que puedas ver el nuevo campo en el admin
@admin.register(DetallePedido)
class DetallePedidoAdmin(admin.ModelAdmin):
    list_display = ('id', 'pedido', 'montura', 'lente', 'medida', 'fecha_sistema') # 👈 ¡Para vigilar la medida manual!
    search_fields = ('pedido__id', 'medida')