// import api from '@/api/axiosConfig';
// import { authStorage } from '@/auth/authStorage';
// import type { Role } from '@/types/roles';
// import { mapApiRoleToRole } from '@/auth/mapRole';

// export interface LoginResponse {
//   access_token: string;
//   refresh_token: string;
//   email: string;
//   rol: string;
//   user: string;
// }

// export const authService = {
//   login: async (username: string, password: string): Promise<{ role: Role }> => {
//     authStorage.clear();
//     const response = await api.post<LoginResponse>('auth/login/', { username, password });
//     const data = response.data;

//     authStorage.setSession({
//       access_token: data.access_token,
//       refresh_token: data.refresh_token,
//       rol: data.rol,
//       user: data.user,
//     });

//     const role = mapApiRoleToRole(data.rol);
//     if (!role) {
//       authStorage.clear();
//       throw new Error(
//         `El rol "${data.rol}" no tiene acceso a este sistema. Se requiere recepcionista, optometrista o superadmin.`
//       );
//     }

//     return { role };
//   },

//   logout: () => {
//     authStorage.clear();
//   },

//   /** Restaura rol desde localStorage si hay tokens guardados (tras F5). */
//   restoreRoleFromStorage: (): Role | null => {
//     const token = authStorage.getAccessToken();
//     const rol = authStorage.getRol();
//     if (!token || !rol) return null;
//     return mapApiRoleToRole(rol);
//   },
// };
import api from '@/api/axiosConfig';
import { authStorage } from '@/auth/authStorage';
import type { Role } from '@/types/roles';
import { mapApiRoleToRole } from '@/auth/mapRole';

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  email: string;
  rol: string;
  user: string;
}

export const authService = {
  login: async (username: string, password: string): Promise<{ role: Role }> => {
    authStorage.clear();
    const response = await api.post<LoginResponse>('auth/login/', { username, password });
    const data = response.data;

    authStorage.setSession({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      rol: data.rol,
      user: data.user,
    });

    const role = mapApiRoleToRole(data.rol);
    if (!role) {
      authStorage.clear();
      throw new Error(
        `El rol "${data.rol}" no tiene acceso a este sistema. Se requiere recepcionista, optometrista o superadmin.`
      );
    }

    return { role };
  },

  logout: () => {
    authStorage.clear();
  },

  /** Restaura rol desde localStorage si hay tokens guardados (tras F5). */
  restoreRoleFromStorage: (): Role | null => {
    const token = authStorage.getAccessToken();
    const rol = authStorage.getRol();
    if (!token || !rol) return null;
    return mapApiRoleToRole(rol);
  },

  /** * Paso 1: Enviar correo para solicitar el reset 
   * El backend de django-rest-passwordreset espera { "email": "..." }
   */
  requestPasswordReset: async (email: string): Promise<void> => {
    await api.post('auth/password_reset/', { email });
  },

  /** * Paso 2: Confirmar nueva contraseña usando el token del correo 
   * El backend espera { "token": "...", "password": "..." }
   */
  confirmPasswordReset: async (token: string, password: string): Promise<void> => {
    await api.post('auth/password_reset/confirm/', { token, password });
  },
};