from rest_framework import serializers
from .models import Cliente, TipoCliente, EstadoCliente, Genero

class TipoClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoCliente
        fields = ['id','descripcion','alias']
        read_only_fields = ('id',)

class EstadoClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = EstadoCliente
        fields = ['id','descripcion','alias']
        read_only_fields = ('id',)

class GeneroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genero
        fields = ['id','descripcion','alias']
        read_only_fields = ('id',)

class ClienteSerializer(serializers.ModelSerializer):
    tipo_cliente_data = TipoClienteSerializer(source="tipo_cliente", read_only=True)
    estado_cliente_data = EstadoClienteSerializer(source="estado_cliente", read_only=True)
    genero_data = GeneroSerializer(source="genero", read_only=True)
    class Meta:
        model = Cliente
        fields = ['id','nombre','apellido','identificacion','email','telefono',
                  'tipo_cliente','estado_cliente','genero','tipo_cliente_data','estado_cliente_data',
                  'genero_data','registered_at']
        read_only_fields = ('id','registered_at',)


        