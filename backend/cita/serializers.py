from rest_framework import serializers
from .models import EstadoCita, Cita
from cliente.serializers import ClienteSerializer
class EstadoCitaSerializer(serializers.ModelSerializer):
    class Meta:
        model = EstadoCita
        fields = ['id','descripcion','alias']
        read_only_fields = ('id',)

class CitaSerializer(serializers.ModelSerializer):
    estado_cita_data = EstadoCitaSerializer(source='estado_cita', read_only=True)
    cliente_data = ClienteSerializer(source='cliente', read_only=True)
    class Meta:
        model = Cita
        fields = ['id','fecha','motivo','estado_cita', 'cliente','estado_cita_data','cliente_data','usuario','fecha_creacion']
        read_only_fields = ('id','fecha_creacion',)