from django.shortcuts import render
from rest_framework import viewsets
from .models import Pedido
from .serializers import PedidoSerializer
from authapp.permissions import HasRole
from rest_framework.response import Response
from rest_framework import status
# Create your views here.

class PedidoViewSet(viewsets.ModelViewSet):
    permission_classes = [HasRole]
    required_roles = ["Admin","optometrista"]
    queryset = Pedido.objects.all()
    serializer_class = PedidoSerializer
    
    def create(self, request):
        serializer = PedidoSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        pedido = serializer.save()

        return Response({
            "mensaje": "Pedido registrado correctamente",
            "Cita": PedidoSerializer(pedido).data
        }, status=status.HTTP_201_CREATED)