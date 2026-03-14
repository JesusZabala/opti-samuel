from rest_framework import serializers
from .models import *
from receta_visual.models import RecetaVisual
from receta_visual.serializers import RecetaVisualSerializer
from cliente.serializers import ClienteSerializer
from django.db import transaction
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

class DetallePedidoSerializer(serializers.ModelSerializer):
    montura_data = MonturaSerializer(source='montura', read_only=True)
    lente_data = LenteSerializer(source='lente', read_only=True)

    class Meta:
        model = DetallePedido
        fields = [
            'id', 'pedido', 'montura', 'lente', 'montura_data', 
            'lente_data', 'fecha_sistema', 'fecha_completado'
        ]
        read_only_fields = ('id', 'pedido')

class PedidoSerializer(serializers.ModelSerializer):
    detalle = DetallePedidoSerializer(write_only=True)
    
    receta_visual_data = RecetaVisualSerializer(source='receta_visual', read_only=True)
    cliente_data = ClienteSerializer(source='id_cliente', read_only=True)

    class Meta:
        model = Pedido
        fields = [
            'id', 'tipo_pedido', 'estado_pedido', 'receta_visual', 'receta_visual_data',
            'id_cliente', 'cliente_data', 'fecha_emision', 'fecha_sistema', 
            'descripcion', 'observacion', 'fecha_entrega', 'fecha_completado', 
            'fecha_entregado', 'detalle'
        ]
        read_only_fields = ('id', 'fecha_sistema')

    def validate(self, data):
        tipo = data.get('tipo_pedido')
        detalle = data.get('detalle')
        receta = data.get('receta_visual')

        if not detalle:
            raise serializers.ValidationError({"detalle": "Faltan los datos del producto (montura/lente)."})

        montura = detalle.get('montura')
        lente = detalle.get('lente')

        if tipo == 'SL': 
            if not receta:
                raise serializers.ValidationError({"receta_visual": "Para Solo Lente es obligatoria la receta."})
            if montura:
                raise serializers.ValidationError({"detalle": "Un pedido Solo Lente no debe llevar montura."})
            if not lente:
                raise serializers.ValidationError({"detalle": "Debe seleccionar un lente."})

        elif tipo == 'SM': 
            if lente:
                raise serializers.ValidationError({"detalle": "Un pedido Solo Montura no debe llevar lentes."})
            if not montura:
                raise serializers.ValidationError({"detalle": "Debe seleccionar una montura."})
            if not data.get('id_cliente'):
                raise serializers.ValidationError({"id_cliente": "Para Solo Montura debe especificar el cliente."})

        elif tipo == 'C': 
            if not receta:
                raise serializers.ValidationError({"receta_visual": "Para un pedido completo es obligatoria la receta."})
            if not montura or not lente:
                raise serializers.ValidationError({"detalle": "Debe incluir tanto montura como lente."})

        return data

    def create(self, validated_data):
        
        detalle_data = validated_data.pop('detalle')

        if not validated_data.get('id_cliente') and validated_data.get('receta_visual'):
            receta = validated_data.get('receta_visual')
            cliente_de_la_cita = receta.cita.cliente

            validated_data['id_cliente'] = cliente_de_la_cita

        with transaction.atomic():
            pedido = Pedido.objects.create(**validated_data)

            DetallePedido.objects.create(
                pedido=pedido,
                **detalle_data
            )

        return pedido