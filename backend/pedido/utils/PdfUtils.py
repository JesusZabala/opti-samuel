import os
import base64
from io import BytesIO
from django.template.loader import get_template
from django.conf import settings
from xhtml2pdf import pisa
from PIL import Image


LOGO_PATH = os.path.join(
    settings.BASE_DIR, '..', 'optica-system', 'src', 'assets', 'Logo.png'
)


def _get_logo_base64():
    """Lee Logo.png del frontend, convierte RGBA→RGB y devuelve data URI base64."""
    img = Image.open(LOGO_PATH)
    if img.mode == 'RGBA':
        bg = Image.new('RGB', img.size, (26, 71, 49))
        bg.paste(img, mask=img.split()[3])
        img = bg
    buf = BytesIO()
    img.save(buf, format='PNG')
    b64 = base64.b64encode(buf.getvalue()).decode('ascii')
    return f"data:image/png;base64,{b64}"


def render_to_pdf(template_src, context_dict=None):
    if context_dict is None:
        context_dict = {}
    context_dict['logo_base64'] = _get_logo_base64()

    try:
        template = get_template(template_src)
        html = template.render(context_dict)
        result = BytesIO()

        pdf = pisa.pisaDocument(
            src=BytesIO(html.encode("UTF-8")),
            dest=result,
            encoding='UTF-8'
        )

        if not pdf.err:
            return result.getvalue()

        print(f"Error en pisa: {pdf.err}")
        return None

    except Exception as e:
        print(f"Error renderizando PDF: {e}")
        return None
