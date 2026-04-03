import { Role } from '@/types/roles';

const ALL = [Role.RECEPCIONISTA, Role.OPTOMETRISTA, Role.ADMINISTRADOR];

/**
 * Rutas permitidas según el mismo criterio que el Sidebar:
 * - Recepción: clientes + citas (incl. registrar cita)
 * - Optometrista: citas (solo consultar/editar), recetas, pedidos
 * - Admin: todo
 */
export function roleCanAccessPath(role: Role, pathname: string): boolean {
  const p = pathname.split('?')[0] || '/';
  if (p === '/' || p === '') return true;

  if (p.startsWith('/clientes')) {
    return role === Role.RECEPCIONISTA || role === Role.ADMINISTRADOR;
  }

  if (p.startsWith('/citas')) {
    if (p.startsWith('/citas/registrar')) {
      return role === Role.RECEPCIONISTA || role === Role.ADMINISTRADOR;
    }
    return ALL.includes(role);
  }

  if (p.startsWith('/recetas') || p.startsWith('/pedidos')) {
    return role === Role.OPTOMETRISTA || role === Role.ADMINISTRADOR;
  }

  if (p.startsWith('/empleados') || p.startsWith('/reportes')) {
    return role === Role.ADMINISTRADOR;
  }

  return false;
}
