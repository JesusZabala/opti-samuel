from rest_framework import serializers
from .models import Auditoria

class AuditoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Auditoria
        fields = ['id','accion','fecha','modulo','objeto_anterior','objeto_nuevo','fecha_sistema']
        read_only_fields = ('id', 'fecha_sistema')
        