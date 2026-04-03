from django.shortcuts import render
from .serializers import AuditoriaSerializer
from .models import Auditoria
from rest_framework import viewsets
from authapp.permissions import HasRole

# Create your views here.

class AuditoriaViewSet(viewsets.ModelViewSet):
    permission_classes = [HasRole]
    required_roles = ["superadmin"]
    queryset = Auditoria.objects.all()
    serializer_class = AuditoriaSerializer

