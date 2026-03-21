from django.shortcuts import render
from rest_framework import viewsets, permissions
from .models import Cliente
from .serializers import ClienteSerializer
from authapp.permissions import HasRole
from rest_framework.response import Response
from rest_framework import status
# Create your views here.
class ClienteViewSet(viewsets.ModelViewSet):
    # permission_classes = [HasRole]
    # required_roles = ["Admin","recepcionista"]
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer
    lookup_field = 'identificacion'

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        headers = self.get_success_headers(serializer.data)
        return Response({
            "mensaje": "Cliente registrado correctamente",
            "Cliente": serializer.data
        }, status=status.HTTP_201_CREATED, headers=headers)
    
    