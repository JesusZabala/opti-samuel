from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, action
from django.http import HttpResponse
from rest_framework.decorators import action
from xhtml2pdf import pisa
from django.template.loader import render_to_string
from optisamuel.logo_data import LOGO_BASE64
from datetime import datetime
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
    permission_classes = [HasRole]
    required_roles = ["superadmin", "optometrista","recepcionista"]
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
    
    # @action(detail=True, methods=['get'])
    # def descargar_pdf(self, request, pk=None):
    #     try:
            
    #         pedido = Pedido.objects.select_related('cliente', 'receta_visual').prefetch_related(
    #             'detalles__montura__marca',
    #             'detalles__montura__modelo',
    #             'detalles__montura__color',
    #             # 'detalles__montura__medidas',  
    #             'detalles__lente__tipo_lente',
    #             'detalles__lente__tipo_tratamiento',
    #             'receta_visual__rv_detalle__oculus'
    #         ).get(pk=pk)
            
    #     except Pedido.DoesNotExist:
    #         return Response({"error": "Pedido no encontrado"}, status=status.HTTP_404_NOT_FOUND)
    #     except Exception as e:
    #         return Response({"error": f"Error de base de datos: {str(e)}"}, status=500)

    #     # 2. Preparamos el contexto
    #     context = {'pedido': pedido}
        
    #     # 3. Generamos el binario del PDF
    #     pdf_content = render_to_pdf('pdf/pedido_detalle.html', context)
        
    #     if pdf_content:
    #         filename = f"Pedido_{pedido.id}_{pedido.cliente.identificacion}.pdf"
            
    #         response = HttpResponse(pdf_content, content_type='application/pdf')
    #         response['Content-Disposition'] = f'attachment; filename="{filename}"'
    #         return response
        
    #     return Response({"error": "No se pudo generar el archivo PDF"}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def descargar_pdf(self, request, pk=None):
        try:
            # Traemos el pedido optimizando las consultas con select_related y prefetch_related
            pedido = Pedido.objects.select_related('cliente', 'receta_visual').prefetch_related(
                'detalles__montura__marca',
                'detalles__montura__modelo',
                'detalles__montura__color',
                'detalles__lente__tipo_lente',
                'detalles__lente__tipo_tratamiento',
                'receta_visual__rv_detalle'  # 👈 Corregido: Se detiene aquí porque los campos son directos
            ).get(pk=pk)
            
        except Pedido.DoesNotExist:
            return Response({"error": "Pedido no encontrado"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": f"Error al consultar el pedido: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # 2. Preparamos el contexto para el HTML
        context = {'pedido': pedido}
        
        # 3. Generamos el binario del PDF usando tu utilidad
        pdf_content = render_to_pdf('pdf/pedido_detalle.html', context)
        
        if pdf_content:
            # Nombre dinámico limpio usando la identificación del cliente
            filename = f"Pedido_{pedido.id}_{pedido.cliente.identificacion}.pdf"
            
            response = HttpResponse(pdf_content, content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="{filename}"'
            return response
        
        return Response({"error": "No se pudo generar el archivo PDF"}, status=status.HTTP_400_BAD_REQUEST)
        
    @action(detail=False, methods=['get'])
    def obtener_catalogos(self, request):
        
        modelos = ModeloMontura.objects.all().values('id', 'descripcion')
        colores = ColorMontura.objects.all().values('id', 'descripcion')
        marcas = MarcaMontura.objects.all().values('id', 'descripcion')
        # medidas = MedidasMontura.objects.all().values('id', 'sku_monturas', 'largo', 'ancho')
        
        # Lentes
        tipos_lente = TipoLente.objects.all().values('id', 'descripcion')
        tratamientos = TipoTratamiento.objects.all().values('id', 'descripcion')

        return Response({
            "monturas": {
                "modelos": list(modelos),
                "colores": list(colores),
                "marcas": list(marcas)
                # "medidas": list(medidas)
            },
            "lentes": {
                "tipos": list(tipos_lente),
                "tratamientos": list(tratamientos)
            }
        })

    @action(detail=False, methods=['get'])
    def descargar_reporte(self, request):
        desde = request.query_params.get('desde')
        hasta = request.query_params.get('hasta')

        if not desde or not hasta:
            return Response({"error": "Faltan las fechas desde/hasta"}, status=400)
        
        pedidos = self.get_queryset().filter(
            fecha_emision__range=[desde,hasta]
        ).select_related(
            'cliente',
            'receta_visual'
        ).prefetch_related(
            'detalles__montura__modelo',
            'detalles__montura__marca',
            'detalles__montura__color',
            # ❌ Se eliminó 'detalles__montura__medidas'
            'detalles__lente__tipo_lente',
            'detalles__lente__tipo_tratamiento'
        ).order_by('-fecha_emision')

        context = {
            'pedidos': pedidos,
            'desde': desde,
            'hasta': hasta,
            'tipo_reporte': "Reporte General de Pedidos",
            'fecha_actual': datetime.now(),
            'logo_base64': LOGO_BASE64
        }

        try:
            html_string = render_to_string('reportes/pedidos_reporte.html', context)
            response = HttpResponse(content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="reporte_pedidos_{desde}_al_{hasta}.pdf"'

            pisa_status = pisa.CreatePDF(html_string, dest=response)

            if pisa_status.err:
                return HttpResponse('Error al generar el PDF de pedidos', status=500)
            
            return response
        except Exception as e:
            print(f"Error en Reporte Pedidos: {str(e)}")
            return HttpResponse(f"Error interno: {str(e)}", status=500)

        
    
