from rest_framework import serializers
from .models import Auditoria

class AuditoriaSerializer(serializers.ModelSerializer):
    usuario_nombre = serializers.ReadOnlyField(source='usuario.username')
    accion_display = serializers.CharField(source='get_accion_display', read_only=True)
    class Meta:
        model = Auditoria
        fields = [
            'id', 'usuario', 'usuario_nombre', 'accion', 'accion_display', 
            'modulo', 'objeto_anterior', 'objeto_nuevo', 'fecha_sistema'
        ]
        