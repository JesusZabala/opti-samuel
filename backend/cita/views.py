from django.shortcuts import render
from rest_framework import viewsets, permissions
from .models import Cita
from datetime import datetime
from django.contrib.auth.models import User, Group
from django.utils import timezone
from .serializers import CitaSerializer
from authapp.permissions import HasRole
from rest_framework.response import Response
from rest_framework import status
from pedido.models import Pedido
from cliente.models import Cliente
from receta_visual.models import RecetaVisual
from rest_framework.response import Response
from rest_framework.decorators import action
from django.http import HttpResponse
from django.template.loader import render_to_string
from xhtml2pdf import pisa
from optisamuel.logo_data import LOGO_BASE64

# Create your views here.

class CitaViewSet(viewsets.ModelViewSet):
    permission_classes = [HasRole]
    required_roles = ["superadmin", "recepcionista", "optometrista"]
    def get_queryset(self):
        queryset = Cita.objects.all()
        fecha_filtro = self.request.query_params.get('fecha', None)
        if fecha_filtro is not None:
            queryset = queryset.filter(fecha__date=fecha_filtro)
        return queryset
    serializer_class = CitaSerializer

    def create(self,request):
        serializer = CitaSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        cita = serializer.save()
        
        return Response({
            "mensaje": "Cita registrada correctamente",
            "Cita": CitaSerializer(cita).data
        }, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'], permission_classes=[HasRole], 
        required_roles=["superadmin", "recepcionista", "optometrista"])
    def obtener_dashboard_stats_global(self, request):
        hoy = timezone.localdate()
        
        # 1. Conteos para las Cards Superiores
        citas_hoy_count = Cita.objects.filter(fecha__date=hoy, estado_cita='A').count()
        total_pacientes = Cliente.objects.count()
        total_recetas = RecetaVisual.objects.count() 
        pedidos_pendientes = Pedido.objects.filter(estado_pedido='E').count()

        # 2. Listado "Hoy: Citas" (Centro)
        citas_hoy_qs = Cita.objects.filter(fecha__date=hoy, estado_cita='A').select_related('cliente').order_by('fecha')

        lista_citas = [{
            "name": f"{c.cliente.nombre} {c.cliente.apellido}" if c.cliente else "N/A",
            "type": c.motivo,
            "time": timezone.localtime(c.fecha).strftime("%I:%M %p"),
            "status": c.get_estado_cita_display()
        } for c in citas_hoy_qs]

        # 3. Actividad Reciente (Derecha)
        clientes_qs = Cliente.objects.order_by('-id')[:3]
        lista_clientes = [{"name": f"{cl.nombre} {cl.apellido}"} for cl in clientes_qs]

        # 4. Seguimiento de Trabajos (Lógica de pedidos)
        pedidos_qs = Pedido.objects.select_related('cliente').order_by('-fecha_emision')[:4]
        lista_pedidos = [{
            "id": p.id,
            "paciente": f"{p.cliente.nombre} {p.cliente.apellido}" if p.cliente else "N/A",
            "producto": p.get_tipo_pedido_display(),
            "estado": p.get_estado_pedido_display(),
            "codigo_estado": p.estado_pedido, 
        } for p in pedidos_qs]

        return Response({
            "stats": {
                "citas": citas_hoy_count,
                "nuevos": total_pacientes,
                "pedidos": pedidos_pendientes,
                "recetas": total_recetas 
            },
            "citasHoy": lista_citas,
            "clientesRecientes": lista_clientes,
            "pedidosRecientes": lista_pedidos
        })

    # @action(detail=False, methods=['get'])
    @action(detail=False, methods=['get'], permission_classes=[HasRole], 
            required_roles=["superadmin", "recepcionista", "optometrista"])
    def buscar_cliente(self, request):
        query = request.query_params.get('q','')
        if len(query) < 3:
            return Response([])

        clientes = Cliente.objects.filter(
            identificacion__icontain=query
        )[:10]

        data = [{
            "id": c.id,
            "text": f"{c.identificacion} - {c.nombre} {c.apellido}"   
        } for c in clientes]

        return Response(data)
    
    # @action(detail=False, methods=['get'])
    @action(detail=False, methods=['get'], permission_classes=[HasRole], 
            required_roles=["superadmin", "recepcionista", "optometrista"])
    def lista_optometrista(self, request):
        optos = User.objects.filter(groups__name='optometrista')
        data = [{
            "id": u.id,
            "nombre": f"{u.first_name} {u.last_name}" or u.username
        } for u in optos]

        return Response(data)

    # @action(detail=False, methods=['get'])
    @action(detail=False, methods=['get'], permission_classes=[HasRole], 
            required_roles=["superadmin", "recepcionista", "optometrista"])
    def descargar_reporte(self, request):
        desde = request.query_params.get('desde')
        hasta = request.query_params.get('hasta')

        if not desde or not hasta:
            return Response({"error": "Faltan las fechas desde/hasta"}, status=400)

        # citas = self.get_queryset().filter(fecha_creacion__date__range=[desde, hasta]).select_related('cliente').order_by('fecha_creacion')
        citas = Cita.objects.all().filter(fecha_creacion__date__range=[desde, hasta]).select_related('cliente').order_by('fecha_creacion')
        context = {
            'citas': citas,
            'desde': desde,
            'hasta': hasta,
            'tipo_reporte': 'Registros de Citas',
            'fecha_actual': datetime.now(),
            'logo_base64': LOGO_BASE64
        }

        html_string = render_to_string('reportes/citas_reporte.html', context)

        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="reporte_citas_{desde}.pdf"'
        
        pisa_status = pisa.CreatePDF(html_string, dest=response)

        if pisa_status.err:
            return Response({"error": "Error al generar PDF"}, status=500)
            
        return response


