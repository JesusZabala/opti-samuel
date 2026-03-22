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
        # Si estamos editando (self.instance existe), excluimos al cliente actual de la búsqueda
        instance_id = self.instance.id if self.instance else None
        if Cliente.objects.filter(identificacion=value).exclude(id=instance_id).exists():
            raise serializers.ValidationError("Ya la identificación está registrada")
        return value

    def validate_email(self, value):
        instance_id = self.instance.id if self.instance else None
        if Cliente.objects.filter(email=value).exclude(id=instance_id).exists():
            raise serializers.ValidationError("Este correo ya está registrado")
        return value

    def create(self, validated_data):
        cliente = Cliente.objects.create(**validated_data)
        return cliente

    
    
        

        


   

        