from django.shortcuts import render
from rest_framework import viewsets, permissions, filters, status
from .models import Cliente
from .serializers import ClienteSerializer
from authapp.permissions import HasRole
from rest_framework.response import Response
from datetime import datetime
from rest_framework.decorators import action
from django.http import HttpResponse
from django.template.loader import render_to_string

from xhtml2pdf import pisa
# Create your views here.
class ClienteViewSet(viewsets.ModelViewSet):
    permission_classes = [HasRole]
    required_roles = ["superadmin", "recepcionista"]
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer
    # lookup_field = 'identificacion'
    filter_backends = [filters.SearchFilter]
    search_fields = ['^nombre', 'apellido', 'identificacion']

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        headers = self.get_success_headers(serializer.data)
        return Response({
            "mensaje": "Cliente registrado correctamente",
            "Cliente": serializer.data
        }, status=status.HTTP_201_CREATED, headers=headers)
    
    @action(detail=False, methods=['get'])
    def descargar_reporte(self, request):
        desde = request.query_params.get('desde')
        hasta = request.query_params.get('hasta')

        # 1. Validación (Si faltan fechas, sale de la función aquí)
        if not desde or not hasta:
            return Response({"error": "Faltan las fechas desde/hasta"}, status=400)

        # 2. El resto del código debe estar FUERA del bloque IF (misma sangría que el IF)
        clientes = Cliente.objects.filter(registered_at__range=[desde, hasta])

        context = {
            'clientes': clientes,
            'desde': desde,
            'hasta': hasta,
            'fecha_actual': datetime.now()
        }

        html_string = render_to_string('reportes/clientes_reporte.html', context)

        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="reporte_clientes_{desde}.pdf"'
        
        pisa_status = pisa.CreatePDF(html_string, dest=response)

        if pisa_status.err:
            return Response({"error": "Error al generar PDF"}, status=500)
            
        # 3. Este return debe estar al final de la función para devolver el PDF
        return response
        