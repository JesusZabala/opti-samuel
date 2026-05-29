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


def enviar_confirmacion_listo(cliente_email, nombre_cliente, pedido_id):
    subject = 'Tu pedido esta listo! - Optica OptiSamuel C.A.'

    message = f"Hola {nombre_cliente}, buenas noticias! Tu pedido #{pedido_id} ya esta listo para ser retirado en nuestra optica"

    html_message = f"""
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; max-width: 600px; border: 1px solid #e0e0e0; border-radius: 10px; padding: 20px;">
            <h1 style="color: #27ae60; text-align: center;">¡Tus lentes están listos! 👓✨</h1>
            <p style="font-size: 1.1em;">Hola <strong>{nombre_cliente}</strong>,</p>
            <p>Nos complace informarte que el proceso de laboratorio ha terminado y tu <strong>Pedido #{pedido_id}</strong> ya se encuentra en nuestra óptica.</p>
            
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; text-align: center; border-left: 5px solid #27ae60;">
                <p style="margin: 0; font-weight: bold; color: #2c3e50;">¡Ya puedes pasar a retirarlos!</p>
            </div>

            <p style="margin-top: 20px;">Recuerda traer tu comprobante (físico o digital) al momento del retiro.</p>
            
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 0.85em; color: #7f8c8d; text-align: center;">
                Gracias por confiar en <strong>Opti-Samuel</strong>.<br>
                Si tienes alguna duda, puedes contactarnos respondiendo a este correo.
            </p>
        </div>
    """

    try:
        send_mail(
            subject,
            message,
            settings.EMAIL_HOST_USER,
            [cliente_email],
            fail_silently=False,
            html_message=html_message
        )
        print(f"Notificacion de listo enviada a: {cliente_email}")
    except Exception as e:
        print(f"Error al enviar correo de pedido listo: {e}")


def enviar_agradecimiento_entrega(cliente_email, nombre_cliente):
    subject = '¡Gracias por tu compra! - Óptica Opti-Samuel'

    message = f"Hola {nombre_cliente}, ¡gracias por confiar en nosotros! Tu pedido ha sido entregado con éxito."

    html_message = f"""
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; max-width: 600px; border: 1px solid #e0e0e0; border-radius: 10px; padding: 20px;">
            <h1 style="color: #2980b6; text-align: center;">¡Disfruta tu nueva visión! 👓🎉</h1>
            <p style="font-size: 1.1em;">Hola <strong>{nombre_cliente}</strong>,</p>
            <p>Queremos agradecerte formalmente por haber elegido a <strong>Opti-Samuel</strong> para cuidar de tu salud visual. Confirmamos que tus lentes han sido entregados con éxito el día de hoy.</p>
            
            <div style="background-color: #f4f9fc; padding: 15px; border-radius: 5px; text-align: center; border-left: 5px solid #2980b6; margin: 20px 0;">
                <p style="margin: 0; font-weight: bold; color: #2c3e50;">Tu satisfacción es nuestro motor diario.</p>
            </div>

            <p>Recuerda que tus cristales y monturas cuentan con nuestro respaldo y garantía de adaptación. Te recomendamos limpiar tus lentes siempre con su paño de microfibra para mantenerlos impecables.</p>
            
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 0.85em; color: #7f8c8d; text-align: center;">
                <strong>Opti-Samuel C.A.</strong><br>
                "Tu visión es nuestra prioridad"<br>
                <span style="font-size: 0.9em;">Si tienes comentarios sobre tu experiencia, ¡nos encantaría escucharte respondiendo a este correo!</span>
            </p>
        </div>
    """

    try:
        send_mail(
            subject,
            message,
            settings.EMAIL_HOST_USER,
            [cliente_email],
            fail_silently=False,
            html_message=html_message
        )
        print(f"Correo de agradecimiento enviado a: {cliente_email}")
    except Exception as e:
        print(f"Error al enviar correo de agradecimiento: {e}")