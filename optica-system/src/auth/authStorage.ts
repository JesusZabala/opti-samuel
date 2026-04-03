const KEYS = {
  access: 'optisamuel_access_token',
  refresh: 'optisamuel_refresh_token',
  rol: 'optisamuel_rol',
  username: 'optisamuel_username',
} as const;

export const authStorage = {
  getAccessToken: () => localStorage.getItem(KEYS.access),
  getRefreshToken: () => localStorage.getItem(KEYS.refresh),
  getRol: () => localStorage.getItem(KEYS.rol),
  getUsername: () => localStorage.getItem(KEYS.username),

  setAccessToken: (token: string) => {
    localStorage.setItem(KEYS.access, token);
  },

  setSession: (payload: {
    access_token: string;
    refresh_token: string;
    rol: string;
    user: string;
  }) => {
    localStorage.setItem(KEYS.access, payload.access_token);
    localStorage.setItem(KEYS.refresh, payload.refresh_token);
    localStorage.setItem(KEYS.rol, payload.rol);
    localStorage.setItem(KEYS.username, payload.user);
  },

  clear: () => {
    localStorage.removeItem(KEYS.access);
    localStorage.removeItem(KEYS.refresh);
    localStorage.removeItem(KEYS.rol);
    localStorage.removeItem(KEYS.username);
  },
};
