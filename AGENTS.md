# Opti Samuel — Guía para OpenCode

Sistema de gestión para una óptica. Monorepo con backend Django + DRF y frontend React/Vite.

## Estructura

```
/ (raíz)
├── backend/                     # Django 6.0.2, DRF, PostgreSQL
│   ├── .env                     # DB y EMAIL_HOST_PASSWORD (no commit)
│   ├── manage.py
│   ├── optisamuel/              # settings.py, urls.py, logo_data.py
│   ├── authapp/                 # Login, JWT, empleados, permisos por grupo
│   ├── cliente/                 # API de clientes
│   ├── cita/                    # API de citas
│   ├── receta_visual/           # API de recetas
│   ├── pedido/                  # API de pedidos + PDFs + emails
│   │   ├── templates/
│   │   │   ├── pdf/pedido_detalle.html        # PDF de un solo pedido
│   │   │   └── reportes/pedidos_reporte.html # PDF del reporte
│   │   └── utils/{PdfUtils.py, EmailUtils.py}
│   └── auditoria/               # Middleware + endpoints
└── optica-system/               # React 19 + Vite 7 + TS 5.9 + Tailwind v4
    └── src/
        ├── assets/              # Logo.png, fotos landing
        ├── auth/                # authStorage, routeAccess, mapRole, authEvents
        ├── context/             # ThemeContext, NotificationContext
        ├── layout/              # Sidebar, DashboardLayout, Header
        ├── pages/dashboard/     # DashboardHome (calendario + agenda)
        ├── modules/             # auth, citas, clientes, recetas, pedidos,
        │                          empleados, auditoria, reportes
        ├── services/            # Capa Axios por dominio
        └── api/axiosConfig.ts   # Instancia Axios + interceptor 401
```

`optica-system/src/routes/AppRouter.tsx` está **hardcodeado a `Role.RECEPCIONISTA`** y **no se usa**; el enrutado real vive en `App.tsx` (`AuthenticatedApp`). No lo "arregles" sin más contexto.

## Comandos

```sh
# Backend (desde backend/, venv activado)
python manage.py runserver
python manage.py migrate

# Frontend (desde optica-system/)
npm run dev            # Vite dev server :5173
npm run build          # tsc -b && vite build
npm run lint           # ESLint
npx tsc -b --noEmit    # Solo typecheck (rápido)
```

## Stack

- Frontend: React 19, Vite 7, TypeScript 5.9, Tailwind v4, Axios, React Router v7, Radix UI, shadcn/ui, Sonner (toasts), Recharts, Framer Motion, lucide-react.
- Backend: Django 6.0.2, DRF 3.16, `djangorestframework_simplejwt`, `django_rest_passwordreset` (token de 6 dígitos), `xhtml2pdf` 0.2.17 (PDFs), `reportlab` 4.4.10, `Pillow`, psycopg2-binary.
- Path aliases TS: `@/` → `src/`, `@modules/` → `src/modules/`, `@core/` → `src/modules/core/`.

## Roles y permisos

Los roles son **grupos de Django** (tabla `auth_group`). El nombre del grupo se devuelve en el login como `rol` y se mapea en frontend con `src/auth/mapRole.ts`.

| Grupo Django | `Role` enum (frontend) | Acceso |
|---|---|---|
| `superadmin` | `ADMINISTRADOR` | Todo + Empleados + Reportes + Auditoría |
| `optometrista` | `OPTOMETRISTA` | Citas (consultar/editar) + Recetas + Pedidos |
| `recepcionista` | `RECEPCIONISTA` | Clientes + Citas + **Pedidos** |

Backend: `authapp/permissions.py` define `HasRole`; cada `ViewSet` declara `required_roles = [...]`.
Frontend: `src/auth/routeAccess.ts` decide qué rutas puede ver cada rol; `Sidebar.tsx` arma el menú acordeón según rol.

Si una recepcionista debe ver un módulo nuevo, hay que tocar **dos** lugares: `routeAccess.ts` y `Sidebar.tsx` (la API del backend usualmente ya lo permite).

## API y autenticación

- Base URL frontend: `import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000/api/'`.
- CORS: solo `http://localhost:5173` y `http://127.0.0.1:5173` (`settings.py:69`).
- JWT: access 30 min, refresh 7 días. Refresh automático en 401 vía interceptor en `api/axiosConfig.ts`.
- Login: `POST /api/auth/login/` → `{ access_token, refresh_token, user, email, rol }`. Guardar tokens con `authStorage.setSession(...)`.
- 401 desautorizado: `setUnauthorizedHandler(...)` desde `App.tsx` cierra sesión y vuelve a landing.
- Recuperación de password: `password_reset/` y `password_reset/confirm/` (token de **6 dígitos**, ver `DJANGO_REST_PASSWORDRESET_TOKEN_CONFIG`).

## Colores corporativos (no inventar otros)

- `#163d2a` (verde muy oscuro, header del Sidebar)
- `#1a4731` (verde oscuro, primario)
- `#a3d4b0` (verde claro para subtítulos sobre verde oscuro)
- `emerald` (variantes Tailwind para acentos)
- Dorado `#c5a47e` aparece solo en barras decorativas de páginas (p.ej. `Clientes.tsx`).

## PDFs (`xhtml2pdf` — no es Chromium)

`xhtml2pdf` usa reportlab por debajo. **Limitaciones reales** que hay que respetar:

- No soporta flexbox ni grid. **No** usar `display: flex`. Usar `<table>` con `vertical-align: middle`, o `display: inline-block` para bloques chicos.
- **No** usar `transform: translate(...)` (no funciona).
- `position: fixed` es **limitado y propenso a duplicar el bloque en página 2** si el contenido empuja. **Las plantillas actuales NO usan `position: fixed`**: el header y el footer son `<table>`s en flujo normal del `<body>`, al inicio y al final del contenido. Esto garantiza 1 página y cero duplicaciones. **No "arregles" esto volviendo a `position: fixed`** — está así a propósito.
- `@page` solo con `size: letter | A4` (sin unidades raras) y `margin: 0`.
- Las imágenes deben ser **data URI base64** — **no** soporta `file:///` en Windows ni rutas relativas.
- El logo se lee dinámicamente cada generación: `PdfUtils.py:_get_logo_base64()` lee `Logo.png` del frontend, convierte RGBA→RGB, e inyecta como `logo_base64` en el contexto. **Importante**: xhtml2pdf 0.2.17 NO renderiza correctamente PNG en modo **RGBA** (con canal alpha). El logo se convierte a **RGB** (fondo blanco sólido) al generarse.
- `PdfUtils.py:render_to_pdf()` ya añade `logo_base64` al contexto automáticamente; no lo vuelvas a inyectar en la vista si usas esa utilidad. (La vista `descargar_reporte` en `views.py` importa `LOGO_BASE64` de `optisamuel/logo_data.py`, que también lee `Logo.png` dinámicamente al importar el módulo.)
- Las dos plantillas (`pedido_detalle.html` y `pedidos_reporte.html`) comparten el mismo diseño corporativo: header de 3 columnas (logo + nombre empresa + título) y footer de una sola línea centrada (empresa, RIF, teléfono, email, lema), implementados con `<table>`s de fondo `#1a4731` en flujo normal. Si agregás una tercera plantilla PDF, **replica ese patrón de tabla verde**, no un `position: fixed`.
- La plantilla del **reporte** usa 6 columnas en la tabla principal: Fecha(9%) | Cliente(16%) | Tipo(9%) | Estado(9%) | Detalle(27%) | Observación(30%).
- `page-break-inside: avoid` en filas de tablas principales (`<tr style="page-break-inside: avoid;">`).
- `border-radius` no es confiable en xhtml2pdf — usar bordes rectos cuando haga falta.
- `tbody tr:nth-child(even) td` para filas alternadas **sí funciona**.
- Sin watermarks ni opacidades en ninguna plantilla.

### Tamaños acordados (vigentes)
- Header: 3 columnas, alto **45 px** (ambas plantillas). Columna logo con padding izquierdo de 30px.
- Logo: **85 px** ancho (ambas plantillas), alto auto, sin deformación.
- Footer: **26 px** de alto, una sola fila centrada, fondo `#1a4731`.
- Padding del contenido: `6px 25px 8px` (ambas plantillas).
- Section-titles: `padding: 3px 8px; margin: 5px 0 3px; font-size: 8pt`.
- Tablas de datos: `th/td padding: 3px 4-5px; font-size: 7pt`.
- Info del paciente (pedido_detalle): sin bordes, `font-size: 8pt`.
- Caja de observaciones: `border: 1px solid #ccc; background: #fafcfa; font-size: 8pt`.
- Líneas de firma: `border-top: 1px solid #333; width: 70%`.

## Emails (logo)

- El logo va **embebido como data URI base64** en `<img src="data:image/png;base64,...">`, **no** como adjunto. Gmail y la mayoría de clientes lo renderizan así sin problemas.
- En `pedido/utils/EmailUtils.py` había una variable `LOGO_PATH` (ruta al `Logo.png` del frontend) que **nunca se usaba** — ya se eliminó por ser código muerto/confuso. **No la reviertas**: `xhtml2pdf`/`Django EmailMultiAlternatives` no resuelven rutas relativas a la raíz del repo.
- Si querés cambiar el logo, regenera `optisamuel/logo_data.py` (es un string base64) o sirve el PNG por el backend y embébelo en el HTML en el momento de enviar.

## Estados del dominio

- **Cita**: `A` (Agendada), `C` (Cancelada), `COM` (Completada), `RR` (Receta Registrada), `NA` (No Asistió).
- **Pedido**: `E` (Enviado), `L` (Listo), `EN` (Entregado). Transición `E→L` dispara email "listo"; `L→EN` dispara email "retirado".
- **Tipo de pedido**: `SL` (Solo Lente), `SM` (Solo Montura), `C` (Completo).
- **Receta**: `SP` (Sin Procesar) → al crear pedido con receta pasa a `CP` (Completada). El frontend filtra por `SP` para mostrar recetas disponibles.

## Frontend — convenciones

- UI en español. Idioma de la app: `LANGUAGE_CODE = 'es-es'`, zona horaria `America/Caracas`.
- Notificaciones: `sonner` `toast.custom()` con el logo de Opti-Samuel (`src/assets/Logo.png`); `<Toaster>` se monta una sola vez en `App.tsx` (no en `main.tsx`), `position: "top-center"`, `duration: 5000`.
- Toggle de modo oscuro: **NO** está en el Sidebar; está en el header del Dashboard. Usar `useTheme()` (`src/context/ThemeContext.tsx`).
- Mapeo dark mode (resumen):
  - `bg-[#1a4731]` (headers) → `dark:text-emerald-100`
  - `bg-white` → `dark:bg-[#1a2a20]`
  - `border-gray-100` → `dark:border-white/10`
  - Scrollbar custom en `index.css` (6 px, thumb `#1a4731`, dark `#2a5a3a`).
- Sidebar: el badge de rol se renderiza con gradiente (admin emerald, optometrista blue-cyan, recepcionista amber-orange).
- Path aliases: usar siempre `@/...` o `@modules/...`; evitar `../../` largos.

## Verificación antes de cerrar un cambio

1. `npx tsc -b --noEmit` (en `optica-system/`) — typecheck rápido.
2. `npm run build` — build de producción.
3. Si tocas un PDF: generar uno real desde la app y abrirlo (no fiarte solo de la vista web).
4. Si tocas emails: revisar el HTML en un cliente real (Gmail); los data URI a veces los cortan clientes corporativos.
5. Si tocas permisos/roles: verificar con login de cada rol, no solo del tuyo.
