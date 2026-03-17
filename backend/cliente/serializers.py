from rest_framework import serializers
from .models import Cliente
class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = ['id','nombre','apellido','identificacion','email','telefono',
                  'tipo_cliente','estado_cliente','genero','registered_at']
        # Quitamos read_only de nombre e identificación para permitir el registro
        read_only_fields = ('id', 'registered_at')

    def validate_identificacion(self, value):
        if Cliente.objects.filter(identificacion=value).exists(): # Corregido exists()
            raise serializers.ValidationError("Ya la identificación está registrada")
        return value

    def validate_email(self, value): # Cambiado de validate_gmail a validate_email por estándar
        if Cliente.objects.filter(email=value).exists():
            raise serializers.ValidationError("Este correo ya está registrado")
        return value

    def create(self, validated_data):
        cliente = Cliente.objects.create(**validated_data)
        return cliente

    
    
        

        


   

        