from io import BytesIO
from django.template.loader import get_template
from xhtml2pdf import pisa
from django.http import HttpResponse
from optisamuel.logo_data import LOGO_BASE64


def render_to_pdf(template_src, context_dict=None):
    if context_dict is None:
        context_dict = {}
    context_dict['logo_base64'] = LOGO_BASE64

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
