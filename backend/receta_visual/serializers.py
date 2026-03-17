from rest_framework import serializers
from .models import RecetaVisual, RecetaVisualDetalle, Oculus
from django.db import transaction
from cita.serializers import CitaSerializer
from cliente.serializers import ClienteSerializer
class OculusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Oculus
        fields = ['id', 'descripcion', 'alias', 'esfera', 'cilindro', 'eje']
        extra_kwargs = {'id': {'read_only': True}}

class RecetaVisualDetalleSerializer(serializers.ModelSerializer):
    oculus = OculusSerializer()
    class Meta:
        model = RecetaVisualDetalle
        fields = ['id', 'oculus', 'adicion', 'distancia_pupilar']
        read_only_fields = ('id',)


class RecetaVisualSerializer(serializers.ModelSerializer):
    rv_detalle_data = RecetaVisualDetalleSerializer(many=True)
    cita_data = CitaSerializer(source='cita', read_only=True)
    cliente_data = ClienteSerializer(source='cliente', read_only=True)
    class Meta:
        model = RecetaVisual
        fields = ['id', 'cita','cita_data', 'cliente', 'cliente_data','rv_detalle_data', 'observaciones', 'fecha_sistema', 'fecha_creacion']

    def create(self, validated_data):
        # Extraemos los datos anidados de los detalles
        detalles_data = validated_data.pop('rv_detalle_data')
        
        # Obtenemos los IDs que vienen del formulario (React)
        cita = validated_data.get('cita')
        cliente_directo = validated_data.get('cliente')

        with transaction.atomic():
            # LÓGICA DE ASIGNACIÓN:
            if cita:
                # CASO 1: Viene de una cita. 
                # Tomamos el cliente vinculado a esa cita y lo asignamos a la receta.
                validated_data['cliente'] = cita.cliente
            else:
                # CASO 2: Registro directo por cliente (Receta externa).
                # Usamos el cliente que viene en el formulario.
                # 'cita' se quedará como null automáticamente si no viene en validated_data.
                validated_data['cliente'] = cliente_directo

            # Creamos la instancia de RecetaVisual con el cliente ya resuelto
            receta = RecetaVisual.objects.create(**validated_data)

            # Si existía una cita, actualizamos su estado a 'Realizada' (RR)
            if cita:
                cita.estado_cita = 'RR'
                cita.save()

            # Registro de la parte técnica (Oculus y Detalle)
            for detalle in detalles_data:
                oculus_info = detalle.pop('oculus')
                # Creamos los valores de esfera, cilindro, etc.
                nuevo_oculus = Oculus.objects.create(**oculus_info)

                # Vinculamos el oculus con el detalle de la receta
                RecetaVisualDetalle.objects.create(
                    receta=receta,
                    oculus=nuevo_oculus,
                    **detalle
                )

        return receta
