from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from cita.models import Cita 

class Command(BaseCommand):
    help = 'Marca como No Asistio las citas que superaron su bloque de 30 min'

    def handle(self, *args, **options):

        ahora = timezone.now()

        limite_bloque = ahora - timedelta(minutes=30)

        citas_vencidas = Cita.objects.filter(
            fecha__lt=limite_bloque,
            estado_cita=Cita.EstadoCita.AGENDADA
        )

        cantidad = citas_vencidas.count()

        if cantidad > 0:
            citas_vencidas.update(estado_cita=Cita.EstadoCita.NO_ASISTIO)
            self.stdout.write(self.style.SUCCESS(f'Éxito: {cantidad} citas pasaron a "No Asistió".'))
        else:
            self.stdout.write(self.style.WARNING('No hay citas vencidas en este bloque.'))