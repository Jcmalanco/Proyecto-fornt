import { API } from '@/config';
import { getToken, clearToken } from '@/lib/auth';

export async function apiFetch(path, options = {}) {
  if (!API) throw new Error('Falta NEXT_PUBLIC_API_URL');

  const token = getToken();

  const headers = { ...(options.headers) || {} };

  const isFormData = options.body instanceof FormData;
  if (!isFormData && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }
   
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API}${path}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => null);

  if (res.status === 401) {
    clearToken();
    const err = new Error(data?.error || 'Session expirada');
    err.status = 401;
    throw err;
  } 

  if (!res.ok) {
    const err = new Error(data?.error || `Error HTTP ${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}