import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { authStorage } from '@/auth/authStorage';
import { notifyUnauthorized } from '@/auth/authEvents';

const baseURL = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000/api/';
// http://192.168.1.102:8000/api/

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const rawAxios = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let refreshPromise: Promise<string> | null = null;

function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    const refresh = authStorage.getRefreshToken();
    if (!refresh) {
      return Promise.reject(new Error('Sin refresh token'));
    }
    refreshPromise = rawAxios
      .post<{ access: string }>('auth/refresh/', { refresh })
      .then(({ data }) => {
        authStorage.setAccessToken(data.access);
        return data.access;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const access = authStorage.getAccessToken();
  if (access && config.headers) {
    config.headers.Authorization = `Bearer ${access}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const status = error.response?.status;

    if (status !== 401 || !originalRequest) {
      return Promise.reject(error);
    }

    const url = originalRequest.url ?? '';
    if (url.includes('auth/login/') || url.includes('auth/refresh/')) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      return Promise.reject(error);
    }
    originalRequest._retry = true;

    try {
      const token = await refreshAccessToken();
      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${token}`;
      }
      return api(originalRequest);
    } catch {
      authStorage.clear();
      notifyUnauthorized();
      return Promise.reject(error);
    }
  }
);

export default api;
