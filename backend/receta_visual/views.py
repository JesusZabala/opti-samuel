from rest_framework import viewsets, permissions
from rest_framework.response import Response 
from .models import RecetaVisual
from .serializers import RecetaVisualSerializer
from enum import Enum
from authapp.permissions import HasRole
from rest_framework import status

# # Enum class de ejemplo
# class Accion(Enum):
#     CREAR = "crear"
#     ACTUALIZAR = "actualizar"
#     BORRAR = "borrar"

#     def __str__(self):
#         return self.value
    

# Create your views here.
class RecetaVisualViewSet(viewsets.ModelViewSet):
    permission_classes = [HasRole]
    required_roles = ["Admin","optometrista"]
    queryset = RecetaVisual.objects.all()
    serializer_class = RecetaVisualSerializer
    

    def create(self,request):
        serializer = RecetaVisualSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        receta_visual = serializer.save()

        return Response({
            "mensaje": "Receta visual registrada correctamente",
            "Cita": RecetaVisualSerializer(receta_visual).data
        }, status=status.HTTP_201_CREATED)
