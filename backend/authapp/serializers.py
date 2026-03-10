from django.contrib.auth import authenticate
from rest_framework import serializers


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

