'use client';

import { useEffect, useState } from 'react';
import { getBoletas } from '@/app/utils/api/getBoletas';
import { getUser } from '@/lib/auth';

export default function BoletasPage() {
  const [boletas, setBoletas] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBoletas() {
      try {
        const user = getUser(); // desde el token
        if (!user?.id) return;

        const data = await getBoletas(user.id);
        setBoletas(data);
        if (data.length > 0) setSelected(data[0]);
      } catch (err) {
        console.error('Error cargando boletas', err);
      } finally {
        setLoading(false);
      }
    }

    loadBoletas();
  }, []);

  if (loading) {
    return <p className="p-6">Cargando boletas...</p>;
  }

  return (
    <div className="flex h-screen">
      {/* Menú lateral */}
      <aside className="w-64 border-r bg-gray-100 overflow-y-auto">
        <h2 className="p-4 font-semibold">Mis boletas</h2>

        <ul>
          {boletas.map((boleta) => (
            <li
              key={boleta.id}
              onClick={() => setSelected(boleta)}
              className={`p-3 cursor-pointer border-b hover:bg-gray-200 ${
                selected?.id === boleta.id ? 'bg-gray-300' : ''
              }`}
            >
              <div className="text-sm font-medium">
                {boleta.folio ?? `Boleta #${boleta.id}`}
              </div>
              <div className="text-xs text-gray-600">
                {boleta.fecha}
              </div>
            </li>
          ))}
        </ul>
      </aside>

      {/* Contenido */}
      <main className="flex-1 p-6">
        {selected ? (
          <>
            <h1 className="text-xl font-semibold mb-4">
              Detalle de boleta
            </h1>

            <pre className="bg-gray-100 p-4 rounded">
              {JSON.stringify(selected, null, 2)}
            </pre>
          </>
        ) : (
          <p>No hay boletas para mostrar</p>
        )}
      </main>
    </div>
  );
}