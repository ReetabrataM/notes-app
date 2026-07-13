import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const api = axios.create({
  baseURL,
  withCredentials: true,
});

/**
 * Locally-stored attachments are saved with a relative URL like "/uploads/xyz.pdf".
 * Since the frontend and backend run on different origins in development, that
 * relative path resolves against the frontend's origin by default and 404s.
 * Cloudinary URLs are already absolute and pass through unchanged.
 */
export function resolveFileUrl(url: string): string {
  if (/^https?:\/\//i.test(url)) return url;
  const backendOrigin = baseURL.replace(/\/api\/v1\/?$/, '');
  return `${backendOrigin}${url}`;
}

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let pendingQueue: Array<() => void> = [];

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/auth/')) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          pendingQueue.push(() => resolve(api(originalRequest)));
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await api.post('/auth/refresh');
        useAuthStore.getState().setAccessToken(data.data.accessToken);
        pendingQueue.forEach((cb) => cb());
        pendingQueue = [];
        return api(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().clearSession();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
