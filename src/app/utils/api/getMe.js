import { apiFetch } from '@/lib/api';

export async function getMe() {
  return apiFetch('/users/me');
}