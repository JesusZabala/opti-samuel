from django.conf import settings
from django.core.mail import EmailMultiAlternatives
import os
from optisamuel.logo_data import LOGO_BASE64


# Ruta absoluta al logo desde el frontend
LOGO_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))), 'optica-system', 'src', 'assets', 'Logo.png')


def _send_email_with_logo(subject, text_message, html_message, to_email):
    msg = EmailMultiAlternatives(
        subject=subject,
        body=text_message,
        from_email=settings.EMAIL_HOST_USER,
        to=[to_email],
    )
    msg.attach_alternative(html_message, "text/html")

    try:
        msg.send(fail_silently=False)
        print(f"Correo enviado a: {to_email}")
    except Exception as e:
        print(f"Error al enviar correo: {e}")


def _base_html_header():
    return f"""
<div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); font-family: 'Segoe UI', Arial, sans-serif;">
    <div style="background: linear-gradient(135deg, #1a4731 0%, #256046 100%); padding: 30px 40px; text-align: center;">
        <img src="{LOGO_BASE64}" alt="Opti-Samuel" style="width: 100px; height: auto; margin-bottom: 10px;" />
        <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase;">Opti-Samuel</h1>
        <p style="color: #a3d4b0; margin: 4px 0 0; font-size: 12px; font-weight: 600; letter-spacing: 1px;">Tu visi&oacute;n es nuestra prioridad</p>
    </div>
    <div style="padding: 30px 40px;">
"""


def _base_html_footer():
    return """
    </div>
    <div style="background-color: #f0f7f3; padding: 20px 40px; text-align: center; border-top: 2px solid #1a4731;">
        <p style="margin: 0; color: #1a4731; font-size: 14px; font-weight: 700;">Gracias por confiar en Opti-Samuel</p>
        <p style="margin: 4px 0 0; color: #666; font-size: 11px;">&ldquo;Tu visi&oacute;n es nuestra prioridad&rdquo;</p>
        <p style="margin: 12px 0 0; color: #999; font-size: 10px;">
            Opti-Samuel C.A. &bull; Rif: J-12345678-9 &bull; Tel: 0412-1234567<br>
            Si tienes alguna duda, responde a este correo.
        </p>
    </div>
</div>
"""


def _greeting(nombre_cliente):
    return f"""
    <p style="font-size: 16px; color: #333; line-height: 1.6;">Hola <strong style="color: #1a4731;">{nombre_cliente}</strong>,</p>
    <p style="font-size: 14px; color: #555; line-height: 1.6;">De parte de todo el equipo de <strong>Opti Samuel</strong>, recibe un cordial saludo.</p>
"""


def enviar_confirmacion_pedido(email_cliente, nombre_cliente, tipo_pedido, descripcion):
    subject = 'Confirmacion de Pedido - Optica'
    tipos = {
        'SL': 'Solo Lente',
        'SM': 'Solo Montura',
        'C': 'Pedido Completo'
    }
    tipo_texto = tipos.get(tipo_pedido, 'Pedido')

    text_message = f"Hola {nombre_cliente}, hemos registrado tu {tipo_texto}: {descripcion}."

    html_message = _base_html_header()
    html_message += _greeting(nombre_cliente)
    html_message += f"""
    <p style="font-size: 14px; color: #1a4731; font-weight: 600; background-color: #e8f5ee; padding: 12px 18px; border-radius: 10px; margin: 16px 0;">
        Nos complace anunciarte que tu pedido fue registrado exitosamente en nuestro sistema.
    </p>
    <div style="background-color: #f9fafb; border-radius: 12px; padding: 20px; margin: 16px 0; border: 1px solid #e5e7eb;">
        <p style="margin: 6px 0; font-size: 14px; color: #333;"><strong>Tipo de Pedido:</strong> {tipo_texto}</p>
        <p style="margin: 6px 0; font-size: 14px; color: #333;"><strong>Detalle:</strong> {descripcion}</p>
    </div>
    <p style="font-size: 13px; color: #777; line-height: 1.5;">Te avisaremos por este medio cuando tu pedido est&eacute; listo para ser retirado.</p>
    <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;">
"""
    html_message += _base_html_footer()

    _send_email_with_logo(subject, text_message, html_message, email_cliente)


def enviar_confirmacion_listo(cliente_email, nombre_cliente, pedido_id):
    subject = 'Tu pedido esta listo! - Optica OptiSamuel C.A.'

    text_message = f"Hola {nombre_cliente}, buenas noticias! Tu pedido #{pedido_id} ya esta listo para ser retirado en nuestra optica"

    html_message = _base_html_header()
    html_message += _greeting(nombre_cliente)
    html_message += f"""
    <p style="font-size: 14px; color: #1a4731; font-weight: 600; background-color: #e8f5ee; padding: 12px 18px; border-radius: 10px; margin: 16px 0;">
        Nos complace informarte que el proceso de laboratorio ha terminado y tu <strong>Pedido #{pedido_id}</strong> ya se encuentra en nuestra &oacute;ptica.
    </p>
    <div style="background-color: #f0fdf4; border: 2px solid #22c55e; border-radius: 12px; padding: 20px; text-align: center; margin: 20px 0;">
        <p style="margin: 0; font-size: 16px; font-weight: 700; color: #1a4731;">&iexcl;Ya puedes pasar a retirarlos!</p>
    </div>
    <p style="font-size: 13px; color: #555; line-height: 1.5;">Recuerda traer tu comprobante (f&iacute;sico o digital) al momento del retiro.</p>
    <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;">
    <p style="font-size: 12px; color: #777; line-height: 1.5;">Gracias por confiar en <strong>Opti-Samuel</strong>.<br>Si tienes alguna duda, puedes contactarnos respondiendo a este correo.</p>
"""
    html_message += _base_html_footer()

    _send_email_with_logo(subject, text_message, html_message, cliente_email)


def enviar_agradecimiento_entrega(cliente_email, nombre_cliente):
    subject = 'Gracias por tu compra! - Optica Opti-Samuel'

    text_message = f"Hola {nombre_cliente}, gracias por confiar en nosotros! Tu pedido ha sido entregado con exito."

    html_message = _base_html_header()
    html_message += _greeting(nombre_cliente)
    html_message += f"""
    <p style="font-size: 14px; color: #1a4731; font-weight: 600; background-color: #e8f5ee; padding: 12px 18px; border-radius: 10px; margin: 16px 0;">
        Queremos agradecerte formalmente por haber elegido a <strong>Opti-Samuel</strong> para cuidar de tu salud visual. Confirmamos que tus lentes han sido entregados con &eacute;xito el d&iacute;a de hoy.
    </p>
    <div style="background-color: #f0fdf4; border: 2px solid #22c55e; border-radius: 12px; padding: 20px; text-align: center; margin: 20px 0;">
        <p style="margin: 0; font-size: 14px; font-weight: 700; color: #1a4731;">&iexcl;Disfruta tu nueva visi&oacute;n!</p>
        <p style="margin: 6px 0 0; font-size: 12px; color: #555;">Tu satisfacci&oacute;n es nuestro motor diario.</p>
    </div>
    <p style="font-size: 13px; color: #555; line-height: 1.5;">Recuerda que tus cristales y monturas cuentan con nuestro respaldo y garant&iacute;a de adaptaci&oacute;n. Te recomendamos limpiar tus lentes siempre con su pa&ntilde;o de microfibra para mantenerlos impecables.</p>
    <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;">
    <p style="font-size: 12px; color: #777; line-height: 1.5;">
        <strong>Opti-Samuel C.A.</strong><br>
        &ldquo;Tu visi&oacute;n es nuestra prioridad&rdquo;<br>
        Si tienes comentarios sobre tu experiencia, nos encantar&iacute;a escucharte respondiendo a este correo.
    </p>
"""
    html_message += _base_html_footer()

    _send_email_with_logo(subject, text_message, html_message, cliente_email)
