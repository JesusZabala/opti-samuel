# Logo de Opti-Samuel — se lee dinámicamente desde el PNG del frontend
# Convertido a RGB para compatibilidad con xhtml2pdf
import os, base64
from io import BytesIO
from django.conf import settings
from PIL import Image

_LOGO_PATH = os.path.join(
    settings.BASE_DIR, '..', 'optica-system', 'src', 'assets', 'Logo.png'
)

def _load_logo_base64():
    img = Image.open(_LOGO_PATH)
    if img.mode == 'RGBA':
        bg = Image.new('RGB', img.size, (26, 71, 49))
        bg.paste(img, mask=img.split()[3])
        img = bg
    buf = BytesIO()
    img.save(buf, format='PNG')
    b64 = base64.b64encode(buf.getvalue()).decode('ascii')
    return f"data:image/png;base64,{b64}"

LOGO_BASE64 = _load_logo_base64()
