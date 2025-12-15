import { useState } from "react";

export default function Abonos() {
  const [clientes] = useState([
    { id: 1, nombre: "Juan Pérez", total: 1200, abonado: 800, abonos: [
      { monto: 200, fecha: "01/12/2025" },
      { monto: 300, fecha: "05/12/2025" },
      { monto: 300, fecha: "10/12/2025" },
    ]},
    { id: 2, nombre: "María López", total: 800, abonado: 800, abonos: [
      { monto: 400, fecha: "02/12/2025" },
      { monto: 400, fecha: "12/12/2025" },
    ]},
  ]);

  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [monto, setMonto] = useState("");
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));

  const handleSeleccionCliente = (e) => {
    const cliente = clientes.find(c => c.id === parseInt(e.target.value));
    setClienteSeleccionado(cliente || null);
  };

  const saldoPendiente = clienteSeleccionado ? clienteSeleccionado.total - clienteSeleccionado.abonado : 0;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-2xl space-y-6">

        <h2 className="text-2xl font-semibold text-center">Registrar Abono</h2>

        {/* Contenedor centrado */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">

          {/* Buscar cliente */}
          <label className="block font-medium mb-2">Buscar cliente</label>
          <select
            className="w-full border p-2 rounded mb-4 focus:ring-2 focus:ring-blue-400"
            onChange={handleSeleccionCliente}
          >
            <option value="">-- Selecciona un cliente --</option>
            {clientes.map(c => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>

          {clienteSeleccionado && (
            <div className="space-y-4">

              {/* Resumen del cliente */}
              <div className="space-y-1">
                <p>Total a pagar: <span className="font-semibold">${clienteSeleccionado.total}</span></p>
                <p>Abonado: <span className="font-semibold">${clienteSeleccionado.abonado}</span></p>
                <p>Saldo pendiente: <span className="font-semibold text-red-600">${saldoPendiente}</span></p>
              </div>

              {/* Registrar abono */}
              <div className="space-y-2">
                <label className="block font-medium">Monto del abono</label>
                <input
                  type="number"
                  value={monto}
                  onChange={(e) => setMonto(e.target.value)}
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400"
                />

                <label className="block font-medium">Fecha</label>
                <input
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400"
                />

                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition w-full">
                  Registrar abono
                </button>
              </div>

              {/* Historial de abonos */}
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2 text-center">Historial de abonos</h3>
                <div className="border rounded overflow-auto max-h-40">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-2">Monto</th>
                        <th className="p-2">Fecha</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clienteSeleccionado.abonos.map((a, index) => (
                        <tr key={index} className="border-t">
                          <td className="p-2 text-center">${a.monto}</td>
                          <td className="p-2 text-center">{a.fecha}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
