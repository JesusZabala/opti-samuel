from rest_framework import viewsets, permissions
from rest_framework.response import Response 
from .models import RecetaVisual
from .serializers import RecetaVisualSerializer
from enum import Enum
from authapp.permissions import HasRole
from rest_framework import status
from rest_framework import filters
from xhtml2pdf import pisa
from rest_framework.decorators import action
from django.http import HttpResponse
from django.template.loader import render_to_string
from datetime import datetime


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

    from django.http import HttpResponse # Importante


    @action(detail=False, methods=['get'])
    def descargar_reporte(self, request):
        desde = request.query_params.get('desde')
        hasta = request.query_params.get('hasta')

        if not desde or not hasta:
            # Aquí sí usamos Response porque es un error en formato JSON
            return Response({"error": "Faltan las fechas desde/hasta"}, status=400)
        
        # Optimizamos la consulta trayendo también los detalles y el oculus de una vez
        recetas = self.get_queryset().filter(
            fecha_creacion__range=[desde, hasta]
        ).select_related('cita', 'cliente').prefetch_related('rv_detalle__oculus').order_by('fecha_creacion')

        context = {
            'recetas': recetas,
            'desde': desde,
            'hasta': hasta,
            'tipo_reporte': 'Registro de Recetas',
            'fecha_actual': datetime.now()
        }

        try:
            html_string = render_to_string('reportes/recetas_reporte.html', context)
            
            # Usamos HttpResponse directamente
            response = HttpResponse(content_type='application/pdf')
            # Corregido: ";" en lugar de ":"
            response['Content-Disposition'] = f'attachment; filename="reporte_recetas_{desde}.pdf"'

            pisa_status = pisa.CreatePDF(html_string, dest=response)

            if pisa_status.err:
                return HttpResponse('Error al generar el PDF', status=500)
                
            return response

        except Exception as e:
            # Esto te ayudará a ver el error real en la consola de Django
            print(f"Error en Reporte: {str(e)}")
            return HttpResponse(f"Error interno: {str(e)}", status=500)