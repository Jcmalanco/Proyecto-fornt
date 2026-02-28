// src/lib/auth.js

export function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

export function setToken(token) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('token', token);
}

export function clearToken() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('token');
}

// 👉 DECODIFICAR USUARIO DESDE JWT
export function getUser() {
  const token = getToken();
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch {
    return null;
  }
}