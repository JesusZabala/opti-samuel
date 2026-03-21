from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from .serializers import LoginSerializer, get_user_role 
from rest_framework import generics
from .serializers import UserListSerializer

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
    # Filtramos usuarios que NO sean simples clientes (staff o con grupo)
    # O mejor aún, filtramos por el grupo específico 'Optometrista'
    queryset = User.objects.filter(groups__name='optometrista') 
    serializer_class = UserListSerializer
