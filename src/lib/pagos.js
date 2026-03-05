import { API } from "@/config";

export async function crearPago(data) {
  const res = await fetch(`${API}/pagos/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error);
  }

  return res.json();
}

export async function verificarPago(payment_intent, boleta_id) {
  const res = await fetch(`${API}/pagos/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      payment_intent,
      boleta_id,
    }),
  });

  return res.json();
}