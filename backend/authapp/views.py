from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status, viewsets
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView as SimpleJWTTokenRefreshView
from django.contrib.auth.models import User
from .serializers import LoginSerializer, get_user_role 
from rest_framework import generics
from .serializers import UserListSerializer, EmployeeCreateUpdateSerializer
from .permissions import HasRole


class EmpleadoViewSet(viewsets.ModelViewSet):
    permission_classes = [HasRole]
    required_roles = ["superadmin"]

    queryset = User.objects.all()
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return EmployeeCreateUpdateSerializer
        return UserListSerializer

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]

        refresh = RefreshToken.for_user(user)
        role = get_user_role(user)

        return Response(
            {
                "access_token": str(refresh.access_token),
                "refresh_token": str(refresh),
                "user": user.get_username(),
                "email": getattr(user, "email", "") or "",
                "rol": role,
            },
            status=status.HTTP_200_OK,
        )

class OptometristaListView(generics.ListAPIView):
    permission_classes = [HasRole]
    required_roles = ["superadmin", "recepcionista", "optometrista"]
    queryset = User.objects.filter(groups__name='optometrista')
    serializer_class = UserListSerializer


class TokenRefreshView(SimpleJWTTokenRefreshView):
    """Renueva access; el refresh va en el body (no requiere Bearer)."""
    permission_classes = [AllowAny]

