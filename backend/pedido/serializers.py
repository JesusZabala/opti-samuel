from rest_framework import serializers
from .models import *
from receta_visual.models import RecetaVisual
from receta_visual.serializers import RecetaVisualSerializer
from cliente.serializers import ClienteSerializer
class TipoLenteSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoLente
        fields = ['id','descripcion','alias']
        read_only_fields = ('id',)


class TipoTratamientoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoTratamiento
        fields = ['id','descripcion','alias']
        read_only_fields = ('id',)


class LenteSerializer(serializers.ModelSerializer):
    tipo_lente_data = TipoLenteSerializer(source='tipo_lente', read_only=True)
    tipo_tratamiento_data = TipoTratamientoSerializer(source='tipo_tratamiento', read_only=True)

    class Meta:
        model = Lente
        fields = ['id', 'tipo_lente','tipo_tratamiento','tipo_lente_data','tipo_tratamiento_data', 
                  'sku_lente','dimension_lente']
        read_only_fields = ('id',)

class ModeloMonturaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ModeloMontura
        fields = ['id','descripcion','alias']
        read_only_fields = ('id',)

class ColorMonturaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ColorMontura
        fields = ['id','descripcion','alias']
        read_only_fields = ('id',)

class MarcaMonturaSerializer(serializers.ModelSerializer):
    class Meta:
        model = MarcaMontura
        fields = ['id','descripcion','alias']
        read_only_fields = ('id',)

class MedidasMonturaSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedidasMontura
        fields = ['id','sku_monturas','largo','ancho']
        read_only_fields = ('id',)

class MonturaSerializer(serializers.ModelSerializer):
    modelo_data = ModeloMonturaSerializer(source='modelo', read_only=True)
    marca_data = MarcaMonturaSerializer(source='marca', read_only=True)
    color_data = ColorMonturaSerializer(source='color', read_only=True)
    medidas_data = MedidasMonturaSerializer(source='medidas',read_only=True)

    class Meta:
        model = Montura
        fields = ['id','modelo','marca','color','medidas','modelo_data','marca_data',
                  'color_data','medidas_data', 'material','fecha_registro']
        read_only_fields = ('id',)

class PedidoSerializer(serializers.ModelSerializer):
    
    receta_visual_data = RecetaVisualSerializer(source='receta_visual', read_only=True)
    cliente_data = ClienteSerializer(source='cliente',read_only=True)
    class Meta:
        model = Pedido
        fields = ['id','tipo_pedido','estado_pedido','receta_visual','receta_visual_data','id_cliente','cliente_data',
                  'fecha_emision','fecha_sistema','descripcion','observacion','fecha_entrega','fecha_completado','fecha_entregado']
        read_only_fields = ('id',)

class DetallePedidoSerializer(serializers.ModelSerializer):
    pedido_data = PedidoSerializer(source='pedido',read_only=True)
    montura_data = MonturaSerializer(source='montura',read_only=True)
    lente_data = LenteSerializer(source='lente',read_only=True)

    class Meta:
        model = DetallePedido
        fields = ['id','pedido','montura','lente','pedido_data','montura_data','lente_data','fecha_sistema','fecha_completado']
        read_only_fields = ('id',)

    def validate(self,data):
        tipo = data.get('tipo_pedido')
        detalles = data.get('detalles_pedidos',[])
        receta = data.get('receta_visual')

        if tipo in ['SL','C'] and not receta:
            raise serializers.ValidationError(
                {"receta_visual": "Los pedidos de tipo Solo Lente o Completo requieren una receta visual."}
            )
        
        for detalle in detalles:
            montura = detalle.get('montura')
            lente = detalle.get('lente')

            if tipo == 'SL':
                if montura: 
                    raise serializers.ValidationError({"detalles_pedido": "No debe incluir montura para Solo Lente."})
                if not lente: 
                    raise serializers.ValidationError({"detalles_pedido": "Debe incluir un lente."})
            elif tipo == 'SM':
                if lente: 
                    raise serializers.ValidationError({"detalles_pedido": "No debe incluir lente para Solo Montura."})
                if not montura: 
                    raise serializers.ValidationError({"detalles_pedido": "Debe incluir una montura."})
            elif tipo == 'C':
                if not montura or not lente:
                    raise serializers.ValidationError({"detalles_pedido": "Debe incluir montura y lente para pedidos completos."})
        return data

