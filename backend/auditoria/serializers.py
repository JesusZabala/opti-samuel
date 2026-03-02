from rest_framework import serializers
from .models import Auditoria, Accion

class AccionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Accion
        fields = ['id','descripcion','alias']
        read_only_fields = ('id',)

class AuditoriaSerializer(serializers.ModelSerializer):
    accion_data = AccionSerializer(source='accion', read_only=True)

    class Meta:
        model = Auditoria
        fields = ['id','accion','accion_data','fecha','modulo','objeto_anterior','objeto_nuevo','fecha_sistema']
        read_only_fields = ('id', 'fecha_sistema')