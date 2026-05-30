# Opti Samuel — Guía para OpenCode

## Estructura del proyecto

```
/ (raíz)
├── backend/          # Django 6.0.2, DRF, PostgreSQL
│   ├── .env          # DB creds (no commit)
│   ├── manage.py     # python manage.py runserver
│   ├── requirements.txt
│   └── optisamuel/settings.py
└── optica-system/    # React 19 + Vite 7 + TypeScript 5.9 + Tailwind v4
    └── src/
        ├── assets/
        ├── context/          # ThemeContext, NotificationContext
        ├── layout/           # Sidebar
        ├── pages/dashboard/  # DashboardHome (calendario, agenda)
        ├── modules/
        │   ├── auth/
        │   ├── citas/
        │   ├── clientes/
        │   ├── recetas/
        │   ├── pedidos/
        │   ├── empleados/
        │   ├── auditoria/
        │   └── reportes/
        ├── services/         # Llamadas API (Axios)
        └── api/              # Axios config + interceptors
```

## Comandos principales

```sh
# Backend (desde backend/)
python manage.py runserver
python manage.py migrate

# Frontend (desde optica-system/)
npm run dev           # Vite dev server :5173
npm run build         # tsc -b && vite build (producción)
npm run lint          # ESLint
npx tsc -b --noEmit   # Solo typecheck (rápido)
```

## Stack frontend

React 19, Vite 7, TypeScript 5.9, Tailwind CSS v4, Axios, React Router v7, Radix UI, shadcn/ui, **Sonner** (toasts), Recharts, Framer Motion, Lucide icons.

Tailwind v4 vía CSS (`@import "tailwindcss"` + `@custom-variant dark`). Path aliases: `@/` → `src/`, `@modules/` → `src/modules/`, `@core/` → `src/modules/core/`.

## Modo oscuro

- `src/context/ThemeContext.tsx` — `ThemeProvider` aplica `.dark` class en `<html>` según `localStorage`. Usar `useTheme()` para toggle.
- Toggle button (Sun/Moon) en el **header del Dashboard** (donde estaba la lupa de búsqueda). No está en el Sidebar.
- Todas las páginas de formularios y módulos tienen clases `dark:` aplicadas.
- Reglas de mapeo:
  - Outer wrapper → `dark:bg-[#0a0f0a]`
  - Card/container → `dark:bg-[#1a2a20]`
  - Headers/text-[#1a4731] → `dark:text-emerald-100`
  - `border-gray-100` → `dark:border-white/10`; `border-gray-200` → `dark:border-gray-700`
  - `bg-green-50` → `dark:bg-emerald-900/20`; `bg-blue-50` → `dark:bg-blue-900/10`; `bg-gray-50` → `dark:bg-[#0f1a14]`
  - `text-gray-*` → `dark:text-gray-*` variants
  - `bg-white` → `dark:bg-[#1a2a20]`
- Scrollbar personalizada en `index.css` (6px, `#1a4731` thumb, dark variant `#2a5a3a`).

## Calendario del Dashboard

`src/pages/dashboard/DashboardHome.tsx`:
- Calendario HTML puro (sin librerías).
- Navegación mensual con ChevronLeft/ChevronRight + botón "Hoy".
- Días con citas tienen un punto verde indicador.
- Click en un día → **floating popup** con las citas de ese día (se cierra al hacer click fuera o en ✕).
- Panel inferior "Agenda de hoy" siempre muestra SOLO las citas de hoy.
- Estado: `calDate` (mes/año), `selectedDay` (día clickeado), `showDayPopup` (popup visible).

## Flujo de completar cita

`src/modules/citas/components/CitasEditar.tsx`:
- Al hacer clic "Completar", verifica via `obtenerTodasLasRecetas()` si la cita tiene receta.
- Si NO hay receta: modal con botón "Ir a Registrar Receta" (redirige a `/recetas/registrar?cita={id}`).
- Si SÍ hay receta: ejecuta `actualizarEstadoCita(id, { estado_cita: "COM" })`.

## Notificaciones

`src/context/NotificationContext.tsx`:
- Usa Sonner `toast.custom()` con un componente personalizado que incluye el **Logo de Opti-Samuel** (`src/assets/Logo.png`).
- Aparecen centradas (`position: "top-center"`), duran 5 segundos.
- `<Toaster>` se renderiza UNA sola vez en `App.tsx` (no en `main.tsx`).
- También guarda en un array `notifications` para el panel de campana en el Dashboard.

## Sidebar

`src/layout/Sidebar.tsx`:
- Role badge con gradiente por rol (admin: emerald, optometrista: blue-cyan, recepcionista: amber-orange).
- Sin toggle de modo oscuro (movido al Dashboard).

## API y autenticación

- Base URL: `import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000/api/'`
- JWT: access_token (30 min) + refresh_token (7 días). Refresh automático en 401 vía interceptor Axios.
- CORS: `http://localhost:5173` y `http://127.0.0.1:5173`.

## Roles

| Role | Sidebar access |
|------|---------------|
| Recepcionista | Clientes + Citas |
| Optometrista | Citas + Recetas + Pedidos |
| Administrador | Todo + Empleados + Reportes + Auditoría |

## Servicios principales

`src/services/` — `citaService.ts`, `clienteService.ts`, `recetaService.ts`, `pedidoService.ts`, `authService.ts`, `reporteService.ts`, `auditoriaService.ts`, `dashboardService.ts`.

Todos usan la instancia `api` de `src/api/axiosConfig.ts`.

## Estados de cita

`A` (Agendada), `C` (Cancelada), `COM` (Completada), `RR` (Receta Registrada), `NA` (No Asistió).

## Convenciones

- UI en español. Colores corporativos: `#163d2a`, `#1a4731`, emerald.
- Solo modificar archivos dentro de `optica-system/` para cambios frontend. No tocar `backend/` sin permiso explícito.
- Preferir `toast.custom()` de Sonner para notificaciones con logo.
- Al añadir dark mode, seguir las reglas de mapeo listadas arriba. No modificar lógica.
- Todos los cambios pasan por `npx tsc -b --noEmit` y `npm run build` antes de considerar completados.
