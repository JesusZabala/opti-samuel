from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.http import HttpResponse

from .models import Pedido
from .serializers import PedidoSerializer
from authapp.permissions import HasRole
from .utils.PdfUtils import render_to_pdf

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