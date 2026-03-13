from rest_framework import serializers
from .models import Cita
from cliente.serializers import ClienteSerializer

class CitaSerializer(serializers.ModelSerializer):
    cliente_data = ClienteSerializer(source='cliente', read_only=True)
    class Meta:
        model = Cita
        fields = ['id','fecha','motivo','motivo_cancelacion','estado_cita',
                  'cliente','cliente_data','usuario','fecha_creacion']
        read_only_fields = ('id','fecha_creacion',)

    def validate_fecha(self, value):
        qs = Cita.objects.filter(fecha=value).exclude(estado_cita=Cita.EstadoCita.CANCELADA)

        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)

        if qs.exists():
            raise serializers.ValidationError("Esta hora ya está ocupada por otra cita activa.")
        
        return value

    def create(self, validated_data):
        cita = Cita.objects.create(**validated_data)
        return cita

    