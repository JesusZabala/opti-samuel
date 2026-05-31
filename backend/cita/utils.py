from django.conf import settings
from pedido.utils.EmailUtils import _base_html_header, _base_html_footer, _greeting, _send_email_with_logo


def enviar_confirmacion_cita(email_cliente, nombre_cliente, fecha_cita):
    subject = 'Cita Agendada Exitosamente - Opti Samuel'
    text_message = f'Hola {nombre_cliente}, tu cita ha sido agendada para el {fecha_cita}.'

    html_message = _base_html_header()
    html_message += _greeting(nombre_cliente)
    html_message += f"""
    <p style="font-size: 14px; color: #1a4731; font-weight: 600; background-color: #e8f5ee; padding: 12px 18px; border-radius: 10px; margin: 16px 0;">
        Nos complace anunciarte que tu cita fue registrada exitosamente en nuestro sistema.
    </p>
    <div style="background-color: #f9fafb; border-radius: 12px; padding: 20px; margin: 16px 0; border: 1px solid #e5e7eb;">
        <p style="margin: 6px 0; font-size: 14px; color: #333;"><strong>Fecha y Hora:</strong> {fecha_cita}</p>
    </div>
    <p style="font-size: 13px; color: #555; line-height: 1.5;">Te esperamos en nuestra &oacute;ptica. Recuerda llegar 10 minutos antes de tu hora asignada.</p>
    <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;">
"""
    html_message += _base_html_footer()

    _send_email_with_logo(subject, text_message, html_message, email_cliente)
