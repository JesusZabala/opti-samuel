import base64
import re

from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from email.mime.image import MIMEImage

from optisamuel.logo_data import LOGO_BASE64


# NOTA SOBRE EL LOGO EN CORREOS:
# - El logo se embebe como parte MIME "related" con Content-ID <logo@optisamuel>,
#   referenciado en el HTML como <img src="cid:logo@optisamuel">.
# - NO es un adjunto descargable: el cliente de correo NO lo lista como archivo
#   adjunto, NO se puede descargar desde la UI. Solo se renderiza inline.
# - Esto es lo que usa Gmail/Outlook/Mailchimp para sus logos; el data URI
#   base64 y las rutas remotas se rompen o son bloqueadas por muchos clientes.
# - Si querés cambiar el logo, regenerá `optisamuel/logo_data.py` (string base64).

LOGO_CID = "logo@optisamuel"


def _decode_logo_png():
    """Devuelve los bytes binarios del PNG a partir de LOGO_BASE64."""
    # LOGO_BASE64 viene como 'data:image/png;base64,<...>'. Nos quedamos con la parte base64.
    match = re.match(r"data:image/\w+;base64,(.*)", LOGO_BASE64, flags=re.DOTALL)
    payload = match.group(1) if match else LOGO_BASE64
    return base64.b64decode(payload)


def _send_email_with_logo(subject, text_message, html_message, to_email):
    msg = EmailMultiAlternatives(
        subject=subject,
        body=text_message,
        from_email=settings.EMAIL_HOST_USER,
        to=[to_email],
    )
    msg.attach_alternative(html_message, "text/html")

    # Adjunto MIME inline (NO descargable) con Content-ID para que el <img src="cid:...">
    # del HTML lo encuentre. Content-Disposition: inline garantiza que el cliente
    # de correo no lo muestre en la lista de adjuntos.
    logo_mime = MIMEImage(_decode_logo_png(), _subtype="png")
    logo_mime.add_header("Content-ID", f"<{LOGO_CID}>")
    logo_mime.add_header("Content-Disposition", "inline", filename="logo.png")
    msg.attach(logo_mime)

    try:
        msg.send(fail_silently=False)
        print(f"Correo enviado a: {to_email}")
    except Exception as e:
        print(f"Error al enviar correo: {e}")


def _base_html_header():
    return f"""
<div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); font-family: 'Segoe UI', Arial, sans-serif;">
    <div style="background: linear-gradient(135deg, #1a4731 0%, #256046 100%); padding: 30px 40px; text-align: center;">
        <img src="cid:{LOGO_CID}" alt="Opti-Samuel" style="width: 100px; height: auto; margin-bottom: 10px;" />
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
    <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;">
    <p style="font-size: 12px; color: #777; line-height: 1.5;">Gracias por confiar en <strong>Opti-Samuel</strong>.<br>Si tienes alguna duda, puedes contactarnos respondiendo a este correo.</p>
"""
    html_message += _base_html_footer()

    _send_email_with_logo(subject, text_message, html_message, cliente_email)


def enviar_confirmacion_retiro(cliente_email, nombre_cliente, pedido_id):
    subject = 'Pedido Retirado - Optica Opti-Samuel'

    text_message = f"Hola {nombre_cliente}, te confirmamos que tu pedido #{pedido_id} ha sido retirado exitosamente."

    html_message = _base_html_header()
    html_message += _greeting(nombre_cliente)
    html_message += f"""
    <p style="font-size: 14px; color: #1a4731; font-weight: 600; background-color: #e8f5ee; padding: 12px 18px; border-radius: 10px; margin: 16px 0;">
        Te confirmamos que tu <strong>Pedido #{pedido_id}</strong> ha sido retirado exitosamente de nuestra &oacute;ptica.
    </p>
    <div style="background-color: #f0fdf4; border: 2px solid #22c55e; border-radius: 12px; padding: 20px; text-align: center; margin: 20px 0;">
        <p style="margin: 0; font-size: 16px; font-weight: 700; color: #1a4731;">&iexcl;Gracias por tu visita!</p>
    </div>
    <p style="font-size: 13px; color: #555; line-height: 1.5;">Esperamos que disfrutes de tus nuevos lentes. Recuerda que cuentas con nuestra garant&iacute;a de adaptaci&oacute;n y servicio post-venta.</p>
    <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;">
    <p style="font-size: 12px; color: #777; line-height: 1.5;">Gracias por confiar en <strong>Opti-Samuel</strong>.<br>Si tienes alguna duda o comentario, no dudes en contactarnos respondiendo a este correo.</p>
"""
    html_message += _base_html_footer()

    _send_email_with_logo(subject, text_message, html_message, cliente_email)
