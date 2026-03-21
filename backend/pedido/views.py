from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, action
from django.http import HttpResponse

from .models import Pedido
from .serializers import PedidoSerializer
from authapp.permissions import HasRole
from .utils.PdfUtils import render_to_pdf
from django.utils import timezone
from cliente.models import Cliente
from cita.models import Cita
from .models import *
# Create your views here.

class PedidoViewSet(viewsets.ModelViewSet):
    # permission_classes = [HasRole]
    # required_roles = ["Admin","optometrista"]
    queryset = Pedido.objects.all()
    serializer_class = PedidoSerializer
    
    def create(self, request):
        serializer = PedidoSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        pedido = serializer.save()

        return Response({
            "mensaje": "Pedido registrado correctamente",
            "Cita": PedidoSerializer(pedido).data
        }, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['get'])
    def descargar_pdf(self, request, pk=None):
        try:
            pedido = Pedido.objects.select_related('cliente', 'receta_visual').prefetch_related(
                'detalles__montura__marca',
                'detalles__montura__modelo',
                'detalles__montura__color',
                'detalles__lente__tipo_lente',
                'detalles__lente__tipo_tratamiento',
                'receta_visual__rv_detalle__oculus'
            ).get(pk=pk)
        except Pedido.DoesNotExist:
            return Response({"error": "Pedido no encontrado"}, status=status.HTTP_404_NOT_FOUND)

        context = {'pedido': pedido}
        pdf = render_to_pdf('pdf/pedido_completo.html', context)
        
        if pdf:
            response = HttpResponse(pdf, content_type='application/pdf')
            filename = f"Pedido_{pedido.id}_{pedido.cliente.identificacion}.pdf"
            response['Content-Disposition'] = f"inline; filename={filename}"
            return response
        
        return Response({"error": "Error al generar el PDF"}, status=400)
    
    @action(detail=False, methods=['get'])
    def obtener_catalogos(self, request):
        
        modelos = ModeloMontura.objects.all().values('id', 'descripcion')
        colores = ColorMontura.objects.all().values('id', 'descripcion')
        marcas = MarcaMontura.objects.all().values('id', 'descripcion')
        medidas = MedidasMontura.objects.all().values('id', 'sku_monturas', 'largo', 'ancho')
        
        # Lentes
        tipos_lente = TipoLente.objects.all().values('id', 'descripcion')
        tratamientos = TipoTratamiento.objects.all().values('id', 'descripcion')

        return Response({
            "monturas": {
                "modelos": list(modelos),
                "colores": list(colores),
                "marcas": list(marcas),
                "medidas": list(medidas)
            },
            "lentes": {
                "tipos": list(tipos_lente),
                "tratamientos": list(tratamientos)
            }
        })

