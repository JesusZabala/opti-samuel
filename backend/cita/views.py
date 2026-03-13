from django.shortcuts import render
from rest_framework import viewsets, permissions
from .models import Cita
from .serializers import CitaSerializer
from authapp.permissions import HasRole
from rest_framework.response import Response
from rest_framework import status
# Create your views here.

class CitaViewSet(viewsets.ModelViewSet):
    permission_classes = [HasRole]
    required_roles = ["Admin","recepcionista"]
    queryset = Cita.objects.all()
    serializer_class = CitaSerializer

    def post(self,request):
        serializer = CitaSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        cita = serializer.save()

        return Response({
            "mensaje": "Cita registrada correctamente",
            "Cita": CitaSerializer(cita).data
        }, status=status.HTTP_201_CREATED)
        
