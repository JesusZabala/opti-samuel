from rest_framework import serializers
from .models import RecetaVisual, RecetaVisualDetalle, Oculus
from django.db import transaction
from cita.serializers import CitaSerializer
from cliente.serializers import ClienteSerializer
class OculusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Oculus
        fields = ['id', 'descripcion', 'alias', 'esfera', 'cilindro', 'eje']
        extra_kwargs = {'id': {'read_only': True}}
class RecetaVisualDetalleSerializer(serializers.ModelSerializer):
    oculus = OculusSerializer()
    class Meta:
        model = RecetaVisualDetalle
        fields = ['id', 'oculus', 'adicion', 'distancia_pupilar']
        read_only_fields = ('id',)
class RecetaVisualSerializer(serializers.ModelSerializer):
    rv_detalle_data = RecetaVisualDetalleSerializer(source='rv_detalle', many=True)
    cita_data = CitaSerializer(source='cita', read_only=True)
    cliente_data = ClienteSerializer(source='cliente', read_only=True)
    
    class Meta:
        model = RecetaVisual
        fields = ['id', 'cita','cita_data', 'cliente', 'cliente_data','rv_detalle_data', 'observaciones','estado_receta', 'fecha_sistema', 'fecha_creacion']

    def create(self, validated_data):
        detalles_data = validated_data.pop('rv_detalle')
        
        cita = validated_data.get('cita')
        cliente_directo = validated_data.get('cliente')

        with transaction.atomic():
            if cita:
                validated_data['cliente'] = cita.cliente
            else:
                validated_data['cliente'] = cliente_directo

            receta = RecetaVisual.objects.create(**validated_data)

            if cita:
                cita.estado_cita = 'RR'
                cita.save()

            for detalle in detalles_data:
                oculus_info = detalle.pop('oculus')
                nuevo_oculus = Oculus.objects.create(**oculus_info)

                RecetaVisualDetalle.objects.create(
                    receta_visual=receta,
                    oculus=nuevo_oculus,
                    **detalle
                )

        return receta

    def update(self, instance, validated_data):
        detalles_data = validated_data.pop('rv_detalle', None)

        with transaction.atomic():
            instance.observaciones = validated_data.get('observaciones', instance.observaciones)
            instance.estado_receta = validated_data.get('estado_receta', instance.estado_receta)
            instance.save()

            if detalles_data is not None:
                for detalle_item in detalles_data:
                    oculus_data = detalle_item.pop('oculus', None)
                    alias_ojo = oculus_data.get('alias') if oculus_data else None

                    if alias_ojo:
                        try:
                            detalle_obj = instance.rv_detalle.get(oculus__alias=alias_ojo)
                            
                            detalle_obj.adicion = detalle_item.get('adicion', detalle_obj.adicion)
                            detalle_obj.distancia_pupilar = detalle_item.get('distancia_pupilar', detalle_obj.distancia_pupilar)
                            detalle_obj.save()

                            if oculus_data:
                                oculus_obj = detalle_obj.oculus
                                oculus_obj.esfera = oculus_data.get('esfera', oculus_obj.esfera)
                                oculus_obj.cilindro = oculus_data.get('cilindro', oculus_obj.cilindro)
                                oculus_obj.eje = oculus_data.get('eje', oculus_obj.eje)
                                oculus_obj.save()
                                
                        except RecetaVisualDetalle.DoesNotExist:
                            pass

        return instance