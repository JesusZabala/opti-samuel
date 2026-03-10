from django.shortcuts import render
from rest_framework import viewsets
from .models import Pedido
from .serializers import PedidoSerializer
from authapp.permissions import HasRole
# Create your views here.

class PedidoViewSet(viewsets.ModelViewSet):
    permission_classes = [HasRole]
    required_roles = ["Admin","optometrista"]
    queryset = Pedido.objects.all()
    serializer_class = PedidoSerializer
    
