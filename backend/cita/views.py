from django.shortcuts import render
from rest_framework import viewsets, permissions
from .models import Cita
from .serializers import CitaSerializer
from authapp.permissions import HasRole
# Create your views here.

class CitaViewSet(viewsets.ModelViewSet):
    permission_classes = [HasRole]
    required_roles = ["Admin","recepcionista"]
    queryset = Cita.objects.all()
    serializer_class = CitaSerializer