from rest_framework import serializers
from .models import Cliente
class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = ['id','nombre','apellido','identificacion','email','telefono',
                  'tipo_cliente','estado_cliente','genero','registered_at']
        read_only_fields = ('id','registered_at',)


        