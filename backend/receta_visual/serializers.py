from rest_framework import serializers
from .models import RecetaVisual, RecetaVisualDetalle, Oculus

class OculusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Oculus
        fields = ['id', 'descripcion', 'alias', 'esfera', 'cilindro', 'eje']
        read_only_fields = ('id',)

class RecetaVisualDetalleSerializer(serializers.ModelSerializer):
    oculus_data = OculusSerializer(source="oculus", read_only=True)
    class Meta:
        model = RecetaVisualDetalle
        fields = ['id', 'oculus', 'oculus_data', 'adicion', 'distancia_pupilar']
        read_only_fields = ('id',)


class RecetaVisualSerializer(serializers.ModelSerializer):
    rv_detalle_data = RecetaVisualDetalleSerializer(many=True)
    class Meta:
        model = RecetaVisual
        fields = ['id', 'cita', 'rv_detalle_data', 'observaciones', 'fecha_sistema', 'fecha_creacion']