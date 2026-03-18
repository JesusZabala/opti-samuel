from django.contrib import admin
from .models import (
    TipoLente, TipoTratamiento, Lente, 
    ModeloMontura, ColorMontura, MarcaMontura, 
    MedidasMontura, Montura, Pedido, DetallePedido
)

# 1. Tablas Maestras (Las que alimentas primero)
@admin.register(TipoLente)
class TipoLenteAdmin(admin.ModelAdmin):
    list_display = ('descripcion', 'alias') # Para que veas las columnas en la lista

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
admin.site.register(MedidasMontura)

# 3. Tablas Principales (Los productos y ventas)
@admin.register(Montura)
class MonturaAdmin(admin.ModelAdmin):
    list_display = ('marca', 'modelo', 'color', 'material', 'fecha_registro')
    list_filter = ('marca', 'color') # Filtros laterales para buscar rápido

@admin.register(Lente)
class LenteAdmin(admin.ModelAdmin):
    list_display = ('tipo_lente', 'tipo_tratamiento')

@admin.register(Pedido)
class PedidoAdmin(admin.ModelAdmin):
    list_display = ('cliente', 'tipo_pedido', 'estado_pedido', 'fecha_emision')
    list_editable = ('estado_pedido',) # ¡Truco GOAT! Cambia el estado sin entrar al registro

admin.site.register(DetallePedido)