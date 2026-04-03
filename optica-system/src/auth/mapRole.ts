import { Role } from '@/types/roles';

/** Mapea el string `rol` del backend (grupo / superadmin) al enum de la UI. */
export function mapApiRoleToRole(rol: string): Role | null {
  switch (rol) {
    case 'superadmin':
      return Role.ADMINISTRADOR;
    case 'recepcionista':
      return Role.RECEPCIONISTA;
    case 'optometrista':
      return Role.OPTOMETRISTA;
    default:
      return null;
  }
}
