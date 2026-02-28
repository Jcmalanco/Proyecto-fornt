import { apiFetch } from '@/lib/api';

export async function getBoletas(clienteId, page = 1, limit = 20) {
  const res = await apiFetch(
    `/boletas?cliente_id=${clienteId}&page=${page}&limit=${limit}`
  );

  return res.data ?? res;
}