from rest_framework import serializers
from .models import Cliente
class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = ['id','nombre','apellido','identificacion','email','telefono',
                  'tipo_cliente','estado_cliente','genero','registered_at']
        read_only_fields = ('identificacion','nombre')

    def validate_identificacion(self, value):
        if Cliente.objects.filter(identificacion=value).exist():
            raise serializers.ValidationError("Ya la identificacion esta registrada")

        return value

    def validate_gmail(self,value):
        if Cliente.objects.filter(email=value).exists():
            raise serializers.ValidationError("Ya este gmail esta registrado")

        return value

    def create(self, validated_data):
        cliente = Cliente.objects.create(**validated_data)
        return cliente

    
    
        

        


   

        