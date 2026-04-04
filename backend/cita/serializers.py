from rest_framework import serializers
from .models import Cita
from cliente.serializers import ClienteSerializer
from .utils import enviar_confirmacion_cita
from authapp.serializers import get_user_role
from django.contrib.auth.models import User

class OptometristaCitaSerializer(serializers.ModelSerializer):
    rol = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'rol']

    def get_rol(self, obj):
        return get_user_role(obj)


class CitaSerializer(serializers.ModelSerializer):
    cliente_data = ClienteSerializer(source='cliente', read_only=True)
    usuario_data = OptometristaCitaSerializer(source='usuario', read_only=True)
    class Meta:
        model = Cita
        fields = ['id','fecha','motivo','motivo_cancelacion','estado_cita',
                  'cliente','cliente_data','usuario','usuario_data','fecha_creacion']
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
        
        if cita.cliente and cita.cliente.email:
            try:
                fecha_formateada = cita.fecha.strftime('%d/%m/%Y %I:%M %p')
                enviar_confirmacion_cita(
                    cita.cliente.email,
                    cita.cliente.nombre,
                    fecha_formateada
                )
            except Exception as e:
                print(f"No se pudo enviar el correo: {e}")
        return cita

    