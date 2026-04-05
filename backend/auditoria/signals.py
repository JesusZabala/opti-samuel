from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.forms.models import model_to_dict
from .models import Auditoria
from .middleware import get_current_user

MODELS_TO_AUDIT = ['Cliente', 'Cita', 'Pedido', 'RecetaVisual']

_estado_previo = {}

@receiver(pre_save)
def capturar_estado_anterior(sender, instance, **kwargs):
    if sender.__name__ not in MODELS_TO_AUDIT or not instance.pk:
        return

    try:
        obj_db = sender.objects.get(pk=instance.pk)
        data = model_to_dict(obj_db)
        _estado_previo[instance.pk] = {k: str(v) for k, v in data.items()}
    except sender.DoesNotExist:
        _estado_previo[instance.pk] = None

@receiver(post_save)
def auditar_cambios(sender, instance, created, **kwargs):
    if sender.__name__ not in MODELS_TO_AUDIT:
        return 
    
    usuario = get_current_user()
    if usuario and not usuario.is_authenticated:
        usuario = None
    accion = Auditoria.Accion.CREATE if created else Auditoria.Accion.UPDATE
    modulo = sender.__name__

    nuevo_dict = model_to_dict(instance)
    nuevo_data = {k: str(v) for k, v in nuevo_dict.items()}

    anterior_data = _estado_previo.pop(instance.pk, None)

    if not created and anterior_data == nuevo_data:
        return
    Auditoria.objects.create(
        usuario=usuario,
        accion=accion,
        modulo=modulo,
        objeto_anterior=anterior_data if not created else None,
        objeto_nuevo=nuevo_data
    )