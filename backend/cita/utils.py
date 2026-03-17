from django.core.mail import send_mail
from django.conf import settings 

def enviar_confirmacion_cita(email_cliente, nombre_cliente, fecha_cita):
    subject = 'Cita Agendada Exitosamente'
    message = f'Hola {nombre_cliente}, tu cita ha sido agendada para el {fecha_cita}.'
    
    html_message = f"""
        <h1>¡Hola, {nombre_cliente}!</h1>
        <p>Tu cita en la óptica ha sido registrada con éxito.</p>
        <p><strong>Fecha y Hora:</strong> {fecha_cita}</p>
        <br>
        <p>¡Te esperamos!</p>
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
        print(f"Error al enviar el correo: {e}")