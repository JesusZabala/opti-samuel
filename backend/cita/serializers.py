from rest_framework import serializers
from .models import Cita
from cliente.serializers import ClienteSerializer


class CitaSerializer(serializers.ModelSerializer):
    cliente_data = ClienteSerializer(source='cliente', read_only=True)
    class Meta:
        model = Cita
        fields = ['id','fecha','motivo','motivo_cancelacion','estado_cita','cliente','cliente_data','usuario','fecha_creacion']
        read_only_fields = ('id','fecha_creacion',)