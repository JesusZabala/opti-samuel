from django.shortcuts import render
from .serializers import AuditoriaSerializer
from .models import Auditoria
from rest_framework import viewsets

# Create your views here.

class AuditoriaViewSet(viewsets.ModelViewSet):
    queryset = Auditoria.objects.all()
    serializer_class = AuditoriaSerializer

