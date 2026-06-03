from rest_framework import serializers
from .models import *
from receta_visual.models import RecetaVisual
from receta_visual.serializers import RecetaVisualSerializer
from cliente.serializers import ClienteSerializer
from django.db import transaction
from .utils.EmailUtils import enviar_confirmacion_pedido, enviar_confirmacion_retiro, enviar_confirmacion_listo
from datetime import timedelta
from django.utils import timezone


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
        fields = ['id', 'tipo_lente','tipo_tratamiento','tipo_lente_data','tipo_tratamiento_data'
                ]
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

# class MedidasMonturaSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = MedidasMontura
#         fields = ['id','sku_monturas','largo','ancho']
#         read_only_fields = ('id',)

class MonturaSerializer(serializers.ModelSerializer):
    modelo_data = ModeloMonturaSerializer(source='modelo', read_only=True)
    marca_data = MarcaMonturaSerializer(source='marca', read_only=True)
    color_data = ColorMonturaSerializer(source='color', read_only=True)
    # medidas_data = MedidasMonturaSerializer(source='medidas',read_only=True)

    class Meta:
        model = Montura
        fields = ['id','modelo','marca','color','modelo_data','marca_data',
                  'color_data','material','fecha_registro']
        read_only_fields = ('id',)

class DetallePedidoSerializer(serializers.ModelSerializer):
    montura_data = MonturaSerializer(source='montura', read_only=True)
    lente_data = LenteSerializer(source='lente', read_only=True)

    class Meta:
        model = DetallePedido
        fields = [
            'id', 'pedido', 'montura', 'lente', 'montura_data', 
            'lente_data','medida', 'fecha_sistema', 'fecha_completado'
        ]#agregar medida
        read_only_fields = ('id', 'pedido')

class PedidoSerializer(serializers.ModelSerializer):
    detalle = serializers.JSONField(write_only=True)
    info_detalle = DetallePedidoSerializer(source='detalles', many=True, read_only=True)
    receta_visual_data = RecetaVisualSerializer(source='receta_visual', read_only=True)
    cliente_data = ClienteSerializer(source='cliente', read_only=True)

    class Meta:
        model = Pedido
        fields = [
            'id', 'tipo_pedido', 'estado_pedido', 'receta_visual', 'receta_visual_data',
            'cliente', 'cliente_data', 'fecha_emision', 'fecha_sistema', 
            'descripcion', 'observacion', 'fecha_entrega', 'fecha_completado', 
            'fecha_entregado', 'detalle','info_detalle'
        ]
        read_only_fields = ('id', 'fecha_sistema')

    # def validate(self, data):
    #     tipo = data.get('tipo_pedido')
    #     detalle = data.get('detalle')
    #     receta = data.get('receta_visual')
    #     cliente = data.get('cliente')

    #     if not detalle:
    #         raise serializers.ValidationError({"detalle": "Faltan los datos del producto (montura/lente)."})

    #     montura = detalle.get('montura')
    #     lente = detalle.get('lente')

    #     # Lógica Solo Lente (SL): Receta + Lente
    #     if tipo == 'SL': 
    #         if not receta:
    #             raise serializers.ValidationError({"receta_visual": "Para Solo Lente es obligatoria la receta."})
    #         if not lente:
    #             raise serializers.ValidationError({"detalle": "Debe seleccionar un lente."})
    #         if montura:
    #             raise serializers.ValidationError({"detalle": "Un pedido Solo Lente no debe llevar montura."})

    #     # Lógica Solo Montura (SM): Cliente + Montura
    #     elif tipo == 'SM': 
    #         if not cliente and not receta:
    #             raise serializers.ValidationError({"cliente": "Para Solo Montura debe especificar el cliente."})
    #         if not montura:
    #             raise serializers.ValidationError({"detalle": "Debe seleccionar una montura."})
    #         if lente:
    #             raise serializers.ValidationError({"detalle": "Un pedido Solo Montura no debe llevar lentes."})

    #     # Lógica Pedido Completo (C): Receta + Montura + Lente
    #     elif tipo == 'C': 
    #         if not receta:
    #             raise serializers.ValidationError({"receta_visual": "Para un pedido completo es obligatoria la receta."})
    #         if not montura or not lente:
    #             raise serializers.ValidationError({"detalle": "Debe incluir tanto montura como lente."})

    #     return data

    def validate(self, data):
        # Si la petición es un PATCH que solo actualiza el estado, omitimos estas validaciones
        if self.partial and 'estado_pedido' in data and len(data) == 1:
            return data

        tipo = data.get('tipo_pedido', getattr(self.instance, 'tipo_pedido', None))
        detalle = data.get('detalle')
        receta = data.get('receta_visual', getattr(self.instance, 'receta_visual', None))
        cliente = data.get('cliente', getattr(self.instance, 'cliente', None))

        # Solo exigir 'detalle' si se está enviando en la petición o si es una creación
        if not self.partial and not detalle:
            raise serializers.ValidationError({"detalle": "Faltan los datos del producto (montura/lente)."})

        if detalle:
            montura = detalle.get('montura')
            lente = detalle.get('lente')

            # Lógica Solo Lente (SL): Receta + Lente
            if tipo == 'SL': 
                if not receta:
                    raise serializers.ValidationError({"receta_visual": "Para Solo Lente es obligatoria la receta."})
                if not lente:
                    raise serializers.ValidationError({"detalle": "Debe seleccionar un lente."})
                if montura:
                    raise serializers.ValidationError({"detalle": "Un pedido Solo Lente no debe llevar montura."})

            # Lógica Solo Montura (SM): Cliente + Montura
            elif tipo == 'SM': 
                if not cliente and not receta:
                    raise serializers.ValidationError({"cliente": "Para Solo Montura debe especificar el cliente."})
                if not montura:
                    raise serializers.ValidationError({"detalle": "Debe seleccionar una montura."})
                if lente:
                    raise serializers.ValidationError({"detalle": "Un pedido Solo Montura no debe llevar lentes."})

            # Lógica Pedido Completo (C): Receta + Montura + Lente
            elif tipo == 'C': 
                if not receta:
                    raise serializers.ValidationError({"receta_visual": "Para un pedido completo es obligatoria la receta."})
                if not montura or not lente:
                    raise serializers.ValidationError({"detalle": "Debe incluir tanto montura como lente."})

        return data

    # def create(self, validated_data):
    #     detalle_data = validated_data.pop('detalle')
    #     receta = validated_data.get('receta_visual')

    #     if not self.validated_data.get('fecha_entrega'):
    #         validated_data['fecha_entrega'] = timezone.now() + timedelta(hours=48)


    #     if receta:
    #         validated_data['cliente'] = receta.cliente

    #     with transaction.atomic():
    #         pedido = Pedido.objects.create(**validated_data)

    #         DetallePedido.objects.create(
    #             pedido=pedido,
    #             **detalle_data
    #         )
        
    #     if pedido.cliente and pedido.cliente.email:
            
    #         enviar_confirmacion_pedido(
    #             pedido.cliente.email,
    #             pedido.cliente.nombre,
    #             pedido.tipo_pedido,
    #             pedido.descripcion
    #         )

    #     return pedido

    def create(self, validated_data):
        detalle_data = validated_data.pop('detalle')
        receta = validated_data.get('receta_visual')
        
        if receta:
            validated_data['cliente'] = receta.cliente

        if not validated_data.get('fecha_entrega'):
            validated_data['fecha_entrega'] = timezone.now() + timedelta(hours=48)

        with transaction.atomic():

            if receta:
                receta.estado_receta = 'CP'
                receta.save()

            pedido = Pedido.objects.create(**validated_data)

            montura_obj = None
            if 'montura' in detalle_data and detalle_data['montura']:
                m_data = detalle_data['montura']
                montura_params = {
                    'modelo_id': m_data.get('modelo'),
                    'marca_id': m_data.get('marca'),
                    'color_id': m_data.get('color'),
                    # 'medidas_id': m_data.get('medidas'),
                    'material': m_data.get('material', '')
                }
                montura_obj, _ = Montura.objects.get_or_create(**montura_params)

            lente_obj = None
            if 'lente' in detalle_data and detalle_data['lente']:
                l_data = detalle_data['lente']
                lente_params = {
                    'tipo_lente_id': l_data.get('tipo_lente'),
                    'tipo_tratamiento_id': l_data.get('tipo_tratamiento')
                }
                lente_obj, _ = Lente.objects.get_or_create(**lente_params)
            
            medida_manual = detalle_data.get('medida')
            if not medida_manual and 'montura' in detalle_data and isinstance(detalle_data['montura'], dict):
                medida_manual = detalle_data['montura'].get('medida')
                
            DetallePedido.objects.create(
                pedido=pedido,
                montura=montura_obj,
                lente=lente_obj,
                medida=medida_manual
            )

        if pedido.cliente and pedido.cliente.email:
            try:
                enviar_confirmacion_pedido(
                    pedido.cliente.email, pedido.cliente.nombre, 
                    pedido.tipo_pedido, pedido.descripcion
                )
            except Exception as e:
                print(f"Error enviando email: {e}")

        return pedido

    def update(self, instance, validated_data):
        # Capturamos el estado original antes de guardar los cambios
        estado_anterior = instance.estado_pedido
        nuevo_estado = validated_data.get('estado_pedido', estado_anterior)

        with transaction.atomic():
            # Actualizamos y guardamos el pedido de forma normal
            instance = super().update(instance, validated_data)

        # LÓGICA DE ENVÍO DE CORREOS SEGÚN EL FLUJO DE ESTADOS
        if instance.cliente and instance.cliente.email:
            try:
                # 1. Si pasa de 'Enviado' (E) a 'Listo en tienda' (L)
                if estado_anterior == 'E' and nuevo_estado == 'L':
                    enviar_confirmacion_listo(
                        cliente_email=instance.cliente.email,
                        nombre_cliente=instance.cliente.nombre,
                        pedido_id=instance.id
                    )

                # 2. Si pasa de 'Listo' (L) a 'Entregado' (EN)
                elif estado_anterior == 'L' and nuevo_estado == 'EN':
                    enviar_confirmacion_retiro(
                        cliente_email=instance.cliente.email,
                        nombre_cliente=instance.cliente.nombre,
                        pedido_id=instance.id
                    )
            except Exception as e:
                # Evita que falle la respuesta HTTP si el servicio de correo tiene un problema
                print(f"Error enviando correo de transición de estado: {e}")

        return instance
            
    