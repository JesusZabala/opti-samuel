from django_rest_passwordreset.signals import reset_password_token_created
from django.dispatch import receiver
from pedido.utils.EmailUtils import _base_html_header, _base_html_footer, _greeting, _send_email_with_logo


@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, *args, **kwargs):
    context = {
        'current_user': reset_password_token.user,
        'first_name': reset_password_token.user.first_name,
        'email': reset_password_token.user.email,
        'reset_password_url': f"http://localhost:5173/reset-password?token={reset_password_token.key}",
        'token': reset_password_token.key
    }

    text_message = f"""
Hola {context['first_name']},

Has solicitado restablecer la contraseña de tu cuenta en Opti Samuel.

Copia y pega el siguiente código en el sistema:

TOKEN: {context['token']}

Si no solicitaste este cambio, por favor ignora este correo.
"""

    html_message = _base_html_header()
    html_message += _greeting(context['first_name'])
    html_message += f"""
    <p style="font-size: 14px; color: #1a4731; font-weight: 600; background-color: #e8f5ee; padding: 12px 18px; border-radius: 10px; margin: 16px 0;">
        Has solicitado restablecer la contrase&ntilde;a de tu cuenta en <strong>Opti Samuel</strong>.
    </p>
    <div style="background-color: #fff8e1; border: 2px solid #f59e0b; border-radius: 12px; padding: 20px; text-align: center; margin: 20px 0;">
        <p style="margin: 0 0 8px; font-size: 12px; color: #666; font-weight: 600;">Tu c&oacute;digo de recuperaci&oacute;n es:</p>
        <p style="margin: 0; font-size: 22px; font-weight: 800; color: #1a4731; letter-spacing: 4px; font-family: monospace;">{context['token']}</p>
        <p style="margin: 8px 0 0; font-size: 11px; color: #999;">Este c&oacute;digo expirar&aacute; en unos minutos.</p>
    </div>
    <p style="font-size: 13px; color: #555; line-height: 1.5;">Si no solicitaste este cambio, por favor ignora este correo.</p>
    <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;">
"""
    html_message += _base_html_footer()

    _send_email_with_logo(
        "Recuperacion de Contrasena - Opti Samuel",
        text_message,
        html_message,
        reset_password_token.user.email,
    )
