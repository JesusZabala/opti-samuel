# Opti Samuel — Guía para OpenCode

Sistema de gestión para una óptica. Monorepo Django 6.0.2 + DRF + React 19 / Vite 7 / TS 5.9 / Tailwind v4.

## Comandos rápidos

```
# Backend (backend/, venv activado)
python manage.py runserver 0.0.0.0:8000     # Accesible desde el móvil
python manage.py runserver                    # Solo localhost
python manage.py migrate

# Frontend (optica-system/)
npm run dev                 # Vite :5173 (vinculado a 0.0.0.0 por defecto)
npm run build               # tsc -b && vite build
npm run lint                # ESLint
npx tsc -b --noEmit         # Typecheck rápido
```

## Dev servers & mobile testing

- **API URL**: `import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000/api/'`
- Para probar en celular: crear `optica-system/.env` con:
  ```
  VITE_API_BASE_URL=http://<TU_IP>:8000/api/
  ```
- `.env` está en `.gitignore` — **no se commitea**. Si no existe, usa localhost.
- Backend ya acepta `ALLOWED_HOSTS = ["*"]` y `CORS_ALLOW_ALL_ORIGINS = True` (settings.py).
- Vite ya escucha en `0.0.0.0` (configurado en `vite.config.ts`).

## Stack y peculiaridades

- **Tailwind v4** (no v3): usa `@tailwindcss/vite` + CSS `@import "tailwindcss"`, no `tailwind.config.js`.
- **Path aliases TS**: `@/` → `src/`, `@modules/` → `src/modules/`, `@core/` → `src/modules/core/`.
- **Dark mode**: clase en `<html>`, toggle en header del Dashboard. CSS vars via `:root` / `.dark`.
- **Notificaciones**: Sonner `toast.custom()` con logo; `<Toaster>` una vez en `App.tsx`.
- **UI en español**, zona horaria `America/Caracas`.
- **JWT**: access 30 min, refresh 7 días. Refresh automático en 401 (axiosConfig.ts).

## Roles y permisos

Roles = grupos Django (`auth_group`). Backend: `authapp/permissions.py` → `HasRole` + `required_roles`.

| Grupo Django | `Role` enum (frontend) | Backend `required_roles` |
|---|---|---|
| `superadmin` | `ADMINISTRADOR` | — (todo) |
| `optometrista` | `OPTOMETRISTA` | Citas, Recetas, Pedidos |
| `recepcionista` | `RECEPCIONISTA` | Clientes, Citas, Pedidos |

Frontend: al agregar módulo a un rol, tocar `auth/routeAccess.ts` + `layout/Sidebar.tsx`.

## Estados del dominio

- **Cita**: `A` → `COM` / `RR` / `NA` / `C`
- **Pedido**: `E` (Enviado) → `L` (Listo, email) → `EN` (Entregado, email)
- **Tipo pedido**: `SL` / `SM` / `C`
- **Receta**: `SP` (Sin Procesar) → al crear pedido → `CP` (Completada)

## PDFs (xhtml2pdf 0.2.17 — no es Chromium)

- **No** flexbox, grid, `transform`, `border-radius`, `position: fixed`.
- Usar `<table>`s para maquetación. Header/footer son `<table>`s en flujo normal.
- `@page size: letter; margin: 0`.
- Imágenes como **data URI base64** (no `file:///` ni rutas relativas).
- Logo: `PdfUtils.py:_get_logo_base64()` lo inyecta como `logo_base64`. **No** lo inyectes de nuevo.
- Tamaños vigentes: header 45px, logo 85px ancho, footer 26px.

## Mobile / Responsive

- **Sidebar**: oculta en `<lg`, reemplazada por menú hamburguesa con overlay (App.tsx).
- **Landing**: carrusel full-viewport, `object-contain` en mobile, `object-cover` en desktop.
- **Formularios**: `grid-cols-1 md:grid-cols-2`, botones `w-full md:w-auto`.
- **Contenedores**: `p-3 md:p-10` o `p-4 md:p-10` según el contexto.

## Colores corporativos

- `#163d2a`, `#1a4731` (primario), `#a3d4b0` (verde claro), `#c5a47e` (dorado).
- Dark mode: `bg-white` → `dark:bg-[#1a2a20]`, `border-gray-100` → `dark:border-white/10`.

## Verificación antes de cerrar cambios

1. `npx tsc -b --noEmit` (optica-system/)
2. `npm run build`
3. Si tocas PDF: generar real desde la app y abrirlo.
4. Si tocas emails: revisar en Gmail; data URI a veces los cortan.
5. Si tocas permisos/roles: probar con login de cada rol.
