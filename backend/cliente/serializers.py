from rest_framework import serializers
from .models import Cliente
class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = ['id','nombre','apellido','identificacion','email','telefono',
                  'tipo_cliente','estado_cliente','genero','registered_at']
        read_only_fields = ('id', 'registered_at')

    def validate_identificacion(self, value):
        
        instance_id = self.instance.id if self.instance else None
        if Cliente.objects.filter(identificacion=value).exclude(id=instance_id).exists():
            raise serializers.ValidationError("Ya la identificación está registrada")
        return value

    # def validate_email(self, value):
    #     instance_id = self.instance.id if self.instance else None
    #     if Cliente.objects.filter(email=value).exclude(id=instance_id).exists():
    #         raise serializers.ValidationError("Este correo ya está registrado")
    #     return value

    def validate_email(self, value):
        # 1. Si el valor viene vacío, nulo o solo espacios, no validamos duplicados
        if not value or value.strip() == "":
            return None  # O puedes retornar "" si tu base de datos no acepta nulls

        # 2. Obtenemos el ID de la instancia actual si estamos editando
        instance_id = self.instance.id if self.instance else None

        # 3. Buscamos duplicados solo si hay un correo válido escrito
        if Cliente.objects.filter(email=value).exclude(id=instance_id).exists():
            raise serializers.ValidationError("Este correo ya está registrado")
            
        return value

    def create(self, validated_data):
        cliente = Cliente.objects.create(**validated_data)
        return cliente

    
    
        

        


   

        