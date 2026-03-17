from django.conf import settings
from django.core.mail import send_mail


def enviar_confirmacion_pedido(email_cliente, nombre_cliente, tipo_pedido, descripcion):
    subject = 'Confirmacion de Pedido - Optica'
    tipos = {
        'SL': 'Solo Lente',
        'SM': 'Solo Montura',
        'C': 'Pedido Completo'
    }
    tipo_texto = tipos.get(tipo_pedido, 'Pedido')

    message = f"Hola {nombre_cliente}, hemos registrado tu {tipo_texto}: {descripcion}."

    html_message = f"""
        <div style="font-family: Arial, sans-serif; color: #333;">
            <h1 style="color: #2c3e50;">¡Gracias por tu compra, {nombre_cliente}!</h1>
            <p>Hemos registrado tu pedido con éxito en nuestro sistema.</p>
            <hr>
            <p><strong>Tipo de Pedido:</strong> {tipo_texto}</p>
            <p><strong>Detalle:</strong> {descripcion}</p>
            <br>
            <p style="font-size: 0.9em; color: #7f8c8d;">Te avisaremos por este medio cuando tu pedido esté listo para ser retirado.</p>
        </div>
    """

    try:
        send_mail(
            subject,
            message,
            settings.EMAIL_HOST_USER,
            [email_cliente],
            fail_silently=False,
            html_message=html_message
        )
    except Exception as e:
        print(f"Error al enviar correo de pedido: {e}")