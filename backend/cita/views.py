from django.shortcuts import render
from rest_framework import viewsets, permissions
from .models import Cita
from .serializers import CitaSerializer

# Create your views here.

class CitaViewSet(viewsets.ModelViewSet):
    queryset = Cita.objects.all()
    serializer_class = CitaSerializer