from django.core.management.base import BaseCommand
from django.utils import timezone
from pedido.models import Pedido
from backend.pedido.utils.EmailUtils import enviar_confirmacion_listo

class Command(BaseCommand):
    help = 'Cambia el estado de los pedidos a LISTO cuando llega su fecha de entrega'

    def handle(self, *args, **options):
        ahora = timezone.now()

        pedidos_a_finalizar = Pedido.objects.filter(
            estado_pedido='E',
            fecha_entrega__lte=ahora
        )

        cantidad = pedidos_a_finalizar.count()

        if cantidad > 0:
            for pedido in pedidos_a_finalizar:
                pedido.estado_pedido = "L"
                pedido.save()

                if pedido.cliente and pedido.cliente.email:
                    enviar_confirmacion_listo(
                        pedido.cliente.email,
                        pedido.cliente.nombre,
                        pedido.pk
                    )

                    self.stdout.write(self.style.SUCCESS(f'Correo enviado a {pedido.cliente.email}'))
                    
            
                self.stdout.write(self.style.SUCCESS(f'Éxito: {cantidad} pedidos marcados como LISTO.'))
        
            self.stdout.write(
                self.style.SUCCESS(f'✅ Proceso terminado: {cantidad} pedidos actualizados.')
            )
        else:
            self.stdout.write(self.style.WARNING('No hay pedidos pendientes por finalizar.'))
