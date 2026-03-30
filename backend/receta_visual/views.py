from rest_framework import viewsets, permissions
from rest_framework.response import Response 
from .models import RecetaVisual
from .serializers import RecetaVisualSerializer
from enum import Enum
from authapp.permissions import HasRole
from rest_framework import status
from rest_framework import filters

# Create your views here.
class RecetaVisualViewSet(viewsets.ModelViewSet):
    # permission_classes = [HasRole]
    # required_roles = ["Admin","optometrista"]
    queryset = RecetaVisual.objects.all()
    serializer_class = RecetaVisualSerializer

    filter_backends = [filters.SearchFilter]
    search_fields = ['cliente__nombre', 'cliente__apellido', 'cliente__identificacion']
    

    def create(self,request):
        serializer = RecetaVisualSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        receta_visual = serializer.save()

        return Response({
            "mensaje": "Receta visual registrada correctamente",
            "Cita": RecetaVisualSerializer(receta_visual).data
        }, status=status.HTTP_201_CREATED)
