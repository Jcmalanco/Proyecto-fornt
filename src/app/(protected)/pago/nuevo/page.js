'use client';

import { useEffect, useState } from 'react';
import { getBoletas } from '@/app/utils/api/getBoletas';
import { getUser } from '@/lib/auth';
import { API } from '@/config';

export default function PagosPage() {

  const [boletas, setBoletas] = useState([]);
  const [selected, setSelected] = useState(null);
  const [monto, setMonto] = useState('');
  const [loading, setLoading] = useState(true);
  const [clientSecret, setClientSecret] = useState(null);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    async function loadBoletas() {
      try {
        const user = getUser();
        if (!user?.id) return;

        const data = await getBoletas(user.id);
        setBoletas(data);

        if (data.length > 0) {
          setSelected(data[0]); // selecciona automáticamente la primera
        }
      } catch (err) {
        console.error('Error cargando boletas', err);
      } finally {
        setLoading(false);
      }
    }

    loadBoletas();
  }, []);

  async function crearPago() {
    try {

      if (!selected) {
        setMensaje("Selecciona una boleta");
        return;
      }

      const res = await fetch(`${API}/pagos/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          boleta_id: selected.id,   // ← ID automático de la boleta seleccionada
          monto: Number(monto)
        })
      });

      const data = await res.json();

      if (data.error) {
        setMensaje(data.error);
        return;
      }

      setClientSecret(data.clientSecret);
      setMensaje("PaymentIntent creado correctamente");

    } catch (err) {
      console.error('Error creando pago', err);
      setMensaje("Error conectando con el servidor");
    }
  }

  if (loading) {
    return <p className="p-6">Cargando boletas...</p>;
  }

  return (
    <div className="flex h-screen">

      {/* MENU LATERAL */}
      <aside className="w-64 border-r bg-gray-600 p-4">
        <h2 className="font-bold mb-4 text-white">Mis Boletas</h2>

        {boletas.map((b) => (
          <div
            key={b.id}
            onClick={() => setSelected(b)}
            className={`p-3 mb-2 cursor-pointer rounded ${
              selected?.id === b.id ? 'bg-blue-500' : 'bg-gray-400'
            }`}
          >
            <p className="font-semibold">{b.descripcion}</p>
            <p className="text-sm">Saldo: ${b.saldo_pendiente}</p>
          </div>
        ))}
      </aside>

      {/* CONTENIDO */}
      <main className="flex-1 p-10">

        {selected && (
          <>
            <h1 className="text-2xl font-bold mb-6">
              Pago de Boleta
            </h1>

            <div className="mb-6">
              <p><b>ID Boleta:</b> {selected.id}</p>
              <p><b>Artículo:</b> {selected.descripcion}</p>
              <p><b>Categoría:</b> {selected.categoria}</p>
              <p><b>Saldo pendiente:</b> ${selected.saldo_pendiente}</p>
            </div>

            <div className="mb-4">
              <input
                type="number"
                placeholder="Monto a pagar"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                className="border p-2 rounded w-60"
              />
            </div>

            <button
              onClick={crearPago}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Generar Pago
            </button>

            {clientSecret && (
              <div className="mt-6">
                <p className="text-green-600">
                  PaymentIntent creado correctamente
                </p>
              </div>
            )}

            {mensaje && (
              <p className="mt-4 text-gray-700">
                {mensaje}
              </p>
            )}
          </>
        )}

      </main>

    </div>
  );
}