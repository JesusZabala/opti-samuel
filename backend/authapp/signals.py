from django_rest_passwordreset.signals import reset_password_token_created
from django.core.mail import send_mail
from django.dispatch import receiver
from django.template.loader import render_to_string
from django.conf import settings
@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, *args, **kwargs):
    context = {
        'current_user': reset_password_token.user,
        'first_name': reset_password_token.user.first_name,
        'email': reset_password_token.user.email,
        'reset_password_url': f"http://localhost:5173/reset-password?token={reset_password_token.key}",
        'token': reset_password_token.key
    }

    # Mensaje simple en texto plano
    email_html_message = f"""
    Hola {context['first_name']},
    
    Has solicitado restablecer la contraseña de tu cuenta en Opti Samuel.
    Copia y pega el siguiente código en el sistema:
    
    TOKEN: {context['token']}
    
    Si no solicitaste este cambio, por favor ignora este correo.
    """

    send_mail(
        "Recuperación de Contraseña - Opti Samuel",
        email_html_message,
        settings.EMAIL_HOST_USER,
        [reset_password_token.user.email],
        fail_silently=False,
    )

