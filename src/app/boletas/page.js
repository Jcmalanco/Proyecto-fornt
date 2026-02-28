'use client';

import { useEffect, useState } from 'react';
import { getBoletas } from '@/app/utils/api/getBoletas';
import { getMe } from '@/app/utils/api/getMe';
import AuthGuard from '@/components/AuthGuard';
import StatusBox from '@/components/StatusBox';

/*CÁLCULO DE PAGOS (FRONTEND)= */
function generarPagos(boleta) {
  const pagos = [];
  const plazo = Number(boleta.plazo_meses);
  const total = Number(boleta.total_prestamo);
  const montoBase = total / plazo;

  const fechaBase = new Date(boleta.fecha_empeno);
  const hoy = new Date();

  for (let i = 1; i <= plazo; i++) {
    const fechaLimite = new Date(fechaBase);
    fechaLimite.setMonth(fechaLimite.getMonth() + i);

    const diasVencidos =
      hoy > fechaLimite
        ? Math.floor((hoy - fechaLimite) / (1000 * 60 * 60 * 24))
        : 0;

    const recargos = diasVencidos * 13.14; // ejemplo fijo
    const totalPagar = montoBase + recargos;

    pagos.push({
      numero: `${i}/${plazo}`,
      fechaLimite,
      montoBase,
      diasVencidos,
      recargos,
      totalPagar,
    });
  }

  return pagos;
}

export default function BoletasPage() {
  const [user, setUser] = useState(null);
  const [boletas, setBoletas] = useState([]);
  const [boletaActiva, setBoletaActiva] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const me = await getMe();
        setUser(me);

        const data = await getBoletas(me.id);
        setBoletas(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || 'Error cargando datos');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) return <StatusBox loading />;
  if (error) return <StatusBox error={error} />;

  const pagos = boletaActiva ? generarPagos(boletaActiva) : [];

  return (
    <AuthGuard>
      <div className="flex h-screen">

        {/*= SIDEBAR= */}
        <aside className="w-64 bg-gray-500 border-r overflow-y-auto">
          <h2 className="p-4 font-bold text-center">Boletas</h2>

          {boletas.length === 0 && (
            <p className="text-center text-sm text-gray-300">
              No hay boletas
            </p>
          )}

          <ul>
            {boletas.map(b => (
              <li
                key={b.id}
                onClick={() => setBoletaActiva(b)}
                className={`px-4 py-2 cursor-pointer text-center
                  hover:bg-gray-700
                  ${boletaActiva?.id === b.id ? 'bg-gray-400 font-semibold' : ''}
                `}
              >
                Boleta #{b.id}
              </li>
            ))}
          </ul>
        </aside>

        {/*= CONTENIDO= */}
        <main className="flex-1 p-6 overflow-y-auto">
          <h1 className="text-xl font-semibold">
            Bienvenido {user.email}
          </h1>

          {!boletaActiva && (
            <p className="mt-4 text-gray-600">
              Selecciona una boleta del menú
            </p>
          )}

          {boletaActiva && (
            <section className="mt-6 space-y-6">

              {/*ENCABEZADO*/}
              <header className="border p-4">
                <ul className="flex justify-between">
                  <li>No. Boleta: {boletaActiva.id}</li>
                  <li>Cliente ID: {boletaActiva.cliente_id}</li>
                </ul>
              </header>

              {/*DESCRIPCIÓN*/}
              <section className="border p-4">
                <h3>Descripción del artículo</h3>
                <p>{boletaActiva.descripcion}</p>
              </section>

              {/*TABLA DE PAGOS*/}
              <section className="border p-4">
                <h3 className="mb-2">Pagos</h3>

                <ul>
                  <li className="font-semibold">
                    <ul className="grid grid-cols-3">
                      <li>No. Pago</li>
                      <li>Fecha límite</li>
                      {/* <li>Monto</li>
                      <li>Días vencidos</li>
                      <li>Recargos</li> */}
                      <li>Total</li>
                    </ul>
                  </li>

                  {pagos.map((p, i) => (
                    <li key={i}>
                      <ul className="grid grid-cols-3">
                        <li>{p.numero}</li>
                        <li>{p.fechaLimite.toLocaleDateString()}</li>
                        {/* <li>${p.montoBase.toFixed(2)}</li>
                        <li>{p.diasVencidos}</li>
                        <li>${p.recargos.toFixed(2)}</li> */}
                        <li>${p.totalPagar.toFixed(2)}</li>
                      </ul>
                    </li>
                  ))}
                </ul>
              </section>

              {/*RESUMEN*/}
              <section className="border p-4">
                <ul>
                  <li>Total préstamo: ${boletaActiva.prestamo}</li>
                  <li>Total pagado: ${boletaActiva.total_pagado}</li>
                  <li><strong>Saldo pendiente:</strong> ${boletaActiva.saldo_pendiente}</li>
                </ul>
              </section>
              <div className="flex gap-4 pt-4">
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={() => alert('Refrendo')}
                >
                  Refrendar
                </button>

                <button
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  onClick={() => alert('Liquidar')}
                >
                  Liquidar
                </button>
              </div>
            </section>
          )}
        </main>
      </div>
    </AuthGuard>
  );
}