from django.shortcuts import render
from rest_framework import viewsets, permissions
from .models import Cliente
from .serializers import ClienteSerializer
from authapp.permissions import HasRole
# Create your views here.
class ClienteViewSet(viewsets.ModelViewSet):
    permission_classes = [HasRole]
    required_roles = ["Admin","recepcionista"]
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer