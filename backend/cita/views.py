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
from rest_framework.response import Response
from rest_framework.decorators import action
from django.http import HttpResponse
from django.template.loader import render_to_string
from xhtml2pdf import pisa

# Create your views here.

class CitaViewSet(viewsets.ModelViewSet):
    permission_classes = [HasRole]
    required_roles = ["superadmin", "recepcionista", "optometrista"]
    queryset = Cita.objects.all()
    serializer_class = CitaSerializer

    def create(self,request):
        serializer = CitaSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        cita = serializer.save()

        # cita = fecha -> hoy 10 am objeto anterior
        # cita = fecha -> hoy 2 pm objeto nuevo

        # selected_cita = Cita.objects.filter(id = 1) # objeto anterior
        # selected_cita.fecha = date()
        # current_cita = selected_cita.save() # objeto nuevo

        # prepararAuditoria o guardarAuditoria

        return Response({
            "mensaje": "Cita registrada correctamente",
            "Cita": CitaSerializer(cita).data
        }, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['get'], permission_classes=[HasRole], required_roles=["superadmin", "recepcionista", "optometrista"])
    def obtener_dashboard_stats_global(self, request):
        hoy = timezone.localdate() # Fecha local correcta
        
        # 1. Cards (Superior)
        citas_hoy_count = Cita.objects.filter(fecha__date=hoy, estado_cita='A').count()
        
        # Pacientes totales (o del mes si prefieres)
        total_pacientes = Cliente.objects.count() 
        
        # Pedidos con estado 'E' (Entregado/Espera - revisa tu lógica de iniciales)
        pedidos_pendientes = Pedido.objects.filter(estado_pedido='E').count()

        # 2. Citas del día (Centro) - select_related evita 50 consultas a la DB
        citas_hoy_qs = Cita.objects.filter(fecha__date=hoy).select_related('cliente').order_by('fecha')

        lista_citas = [{
            "paciente": f"{c.cliente.nombre} {c.cliente.apellido}" if c.cliente else "N/A",
            "motivo": c.motivo,
            "hora": c.fecha.strftime("%I:%M %p"),
            "estado": c.get_estado_cita_display() 
        } for c in citas_hoy_qs]

        # 3. Órdenes Recientes (Derecha)
        pedidos_qs = Pedido.objects.select_related('cliente').order_by('-fecha_emision')[:5]

        lista_pedidos = [{
            "nro_pedido": p.id,
            "cliente": f"{p.cliente.nombre} {p.cliente.apellido}" if p.cliente else "N/A",
            "tipo": p.get_tipo_pedido_display(),
            "estado": p.get_estado_pedido_display()
        } for p in pedidos_qs]

        return Response({
            "cards": {
                "citas": citas_hoy_count,
                "pacientes": total_pacientes,
                "pedidos": pedidos_pendientes
            },
            "citas_detalladas": lista_citas,
            "pedidos_recientes": lista_pedidos
        })
        hoy = timezone.localdate()
        
        # --- 1. CONTEOS PARA LAS CARDS (SUPERIOR) ---
        citas_hoy_count = Cita.objects.filter(
            fecha__date=hoy, 
            estado_cita='A' 
        ).count()

        
        nuevos_pacientes = Cliente.objects.filter(
            id__gt=0 
        ).count() 

        pedidos_pendientes = Pedido.objects.filter(
            estado_pedido='E' 
        ).count()

        # --- 2. LISTADO "HOY: CITAS" (CENTRO) ---
        citas_hoy_qs = Cita.objects.filter(
            fecha__date=hoy
        ).select_related('cliente').order_by('fecha')

        lista_citas = [{
            "paciente": f"{c.cliente.nombre} {c.cliente.apellido}",
            "motivo": c.motivo,
            "hora": c.fecha.strftime("%I:%M %p"),
            "estado": c.get_estado_cita_display() 
        } for c in citas_hoy_qs]

        # --- 3. LISTADO "ÓRDENES RECIENTES" (DERECHA) ---
        pedidos_qs = Pedido.objects.select_related('cliente').order_by('-fecha_emision')[:5]

        lista_pedidos = [{
            "nro_pedido": p.id,
            "cliente": f"{p.cliente.nombre} {p.cliente.apellido}",
            "tipo": p.get_tipo_pedido_display(),
            "estado": p.get_estado_pedido_display()
        } for p in pedidos_qs]

        return Response({
            "cards": {
                "citas": citas_hoy_count,
                "pacientes": nuevos_pacientes,
                "pedidos": pedidos_pendientes
            },
            "citas_detalladas": lista_citas,
            "pedidos_recientes": lista_pedidos
        })

    @action(detail=False, methods=['get'])
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
    
    @action(detail=False, methods=['get'])
    def lista_optometrista(self, request):
        optos = User.objects.filter(groups__name='optometrista')
        data = [{
            "id": u.id,
            "nombre": f"{u.first_name} {u.last_name}" or u.username
        } for u in optos]

        return Response(data)

    @action(detail=False, methods=['get'])
    def descargar_reporte(self, request):
        desde = request.query_params.get('desde')
        hasta = request.query_params.get('hasta')

        if not desde or not hasta:
            return Response({"error": "Faltan las fechas desde/hasta"}, status=400)

        citas = self.get_queryset().filter(fecha_creacion__date__range=[desde, hasta]).select_related('cliente').order_by('fecha_creacion')

        context = {
            'citas': citas,
            'desde': desde,
            'hasta': hasta,
            'tipo_reporte': 'Registros de Citas',
            'fecha_actual': datetime.now()
        }

        html_string = render_to_string('reportes/citas_reporte.html', context)

        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="reporte_citas_{desde}.pdf"'
        
        pisa_status = pisa.CreatePDF(html_string, dest=response)

        if pisa_status.err:
            return Response({"error": "Error al generar PDF"}, status=500)
            
        return response


