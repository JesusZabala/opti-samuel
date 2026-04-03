from django.contrib.auth import authenticate
from rest_framework import serializers

from django.contrib.auth.models import User, Group
def get_user_role(user) -> str:
    """
    Rol/perfil basado en el sistema por defecto de Django:
    - Superusuario: 'superadmin'
    - Staff: 'staff' (si no tiene grupos)
    - Si pertenece a uno o más grupos: se retorna el primer grupo por nombre
    - Default: 'user'
    """
    if getattr(user, "is_superuser", False):
        return "superadmin"

    # Grupos = roles
    try:
        groups_qs = user.groups.all().order_by("name")
        first_group = groups_qs.first()
        if first_group:
            return first_group.name
    except Exception:
        # En caso de que el user no tenga relación groups por alguna razón
        pass

    if getattr(user, "is_staff", False):
        return "staff"
    return "user"


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True, trim_whitespace=True)
    password = serializers.CharField(required=True, trim_whitespace=False, write_only=True)

    def validate(self, attrs):
        username = attrs.get("username")
        password = attrs.get("password")
        request = self.context.get("request")

        user = authenticate(request=request, username=username, password=password)
        if not user:
            raise serializers.ValidationError("Credenciales inválidas.")
        if not user.is_active:
            raise serializers.ValidationError("Usuario inactivo.")

        attrs["user"] = user
        return attrs

class UserListSerializer(serializers.ModelSerializer):
    rol = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'rol','is_active','email']

    def get_rol(self, obj):
        return get_user_role(obj)

class EmployeeCreateUpdateSerializer(serializers.ModelSerializer):
    rol = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True, required=False)

    username = serializers.CharField(min_length=4, max_length=20, required=True)

    class Meta:
        model = User
        fields = ['id','username','password','first_name','last_name','email','rol','is_active']

    def create(self, validated_data):
        rol_name = validated_data.pop('rol')
        password = validated_data.pop('password', None)

        #1. Crear usuario
        user = User.objects.create_user(**validated_data)
        
        if password:
            user.set_password(password)
            user.save()

        # 2 asignar el rol
        grupo, _ = Group.objects.get_or_create(name=rol_name)
        user.groups.add(grupo)

        return user

    def update(self, instance, validated_data):
        rol_name = validated_data.pop('rol', None)
        password = validated_data.pop('password', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if password:
            instance.set_password(password)
        
        instance.save()

        if rol_name:
            instance.groups.clear() # Quitamos roles anteriores
            grupo, _ = Group.objects.get_or_create(name=rol_name)
            instance.groups.add(grupo)

        return instance
