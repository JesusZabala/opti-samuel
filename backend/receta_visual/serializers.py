from rest_framework import serializers
from .models import RecetaVisual, RecetaVisualDetalle, Oculus
from django.db import transaction
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
    rv_detalle_data = RecetaVisualDetalleSerializer(many=True)
    class Meta:
        model = RecetaVisual
        fields = ['id', 'cita', 'rv_detalle_data', 'observaciones', 'fecha_sistema', 'fecha_creacion']

    def create(self, validated_data):
        detalles_data = validated_data.pop('rv_detalle_data')

        with transaction.atomic():

            receta = RecetaVisual.objects.create(**validated_data)

            cita = receta.cita
            cita.estado_cita = 'RR'
            cita.save()

            for detalle in detalles_data:
                oculus_info = detalle.pop('oculus')

                nuevo_oculus = Oculus.objects.create(**oculus_info)

                RecetaVisualDetalle.objects.create(
                    receta=receta,
                    oculus=nuevo_oculus,
                    **detalle
                )

        return receta
