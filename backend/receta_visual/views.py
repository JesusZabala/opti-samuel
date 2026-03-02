from rest_framework import viewsets, permissions
from .models import RecetaVisual
from .serializers import RecetaVisualSerializer
from enum import Enum

# Enum class de ejemplo
class Accion(Enum):
    CREAR = "crear"
    ACTUALIZAR = "actualizar"
    BORRAR = "borrar"

    def __str__(self):
        return self.value
    

# Create your views here.
class RecetaVisualViewSet(viewsets.ModelViewSet):
    queryset = RecetaVisual.objects.all()
    serializer_class = RecetaVisualSerializer
    permission_classes = [permissions.AllowAny]

    # Ver como declarar estos metodos para ser llamados en la URL de la API
    def create():
        pass

    def update():
        pass

    def select_by_id():
        pass

    def select_by_name():
        pass

    # Ver como preparar la auditoria para cada una de las acciones