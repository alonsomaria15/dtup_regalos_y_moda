import { useState } from "react";

export default function Clientes() {
  const [busqueda, setBusqueda] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  // Datos de ejemplo
  const clientes = [
    { id: 1, codigo: "CLI001", nombre: "Juan Pérez", telefono: "55-1234", email: "juan@mail.com", total: 2000, pagos: 1200 },
    { id: 2, codigo: "CLI002", nombre: "María López", telefono: "55-5678", email: "maria@mail.com", total: 1500, pagos: 1500 },
    { id: 3, codigo: "CLI003", nombre: "Carlos Martínez", telefono: "55-9012", email: "carlos@mail.com", total: 900, pagos: 500 },
  ];

  const clientesFiltrados = clientes.filter(
    (c) =>
      c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.codigo.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold mb-4">Clientes</h2>

      {/* Botón para mostrar formulario */}
      <button
        onClick={() => setMostrarFormulario(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Agregar Cliente
      </button>

      {/* Buscador */}
      <input
        type="text"
        placeholder="Buscar cliente por nombre o código..."
        className="mb-4 w-full border p-2 rounded focus:ring-2 focus:ring-blue-400"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      {/* Tabla de clientes */}
      <div className="overflow-x-auto">
        <table className="min-w-full border divide-y divide-gray-200">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2">Código</th>
              <th className="p-2">Nombre</th>
              <th className="p-2">Teléfono</th>
              <th className="p-2">Email</th>
              <th className="p-2">Total comprado</th>
              <th className="p-2">Pagos realizados</th>
              <th className="p-2">Pendiente</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {clientesFiltrados.map((c) => (
              <tr key={c.id}>
                <td className="p-2">{c.codigo}</td>
                <td className="p-2">{c.nombre}</td>
                <td className="p-2">{c.telefono}</td>
                <td className="p-2">{c.email}</td>
                <td className="p-2">${c.total}</td>
                <td className="p-2">${c.pagos}</td>
                <td className="p-2 text-red-600 font-semibold">${c.total - c.pagos}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para agregar cliente */}
      {mostrarFormulario && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg p-6 rounded-2xl shadow-lg relative">
            <button
              onClick={() => setMostrarFormulario(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl font-bold"
            >
              &times;
            </button>
            <h3 className="text-xl font-semibold mb-4">Agregar Cliente</h3>
            <form className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Nombre</label>
                <input type="text" className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400" />
              </div>
              <div>
                <label className="block font-medium mb-1">Teléfono</label>
                <input type="text" className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400" />
              </div>
              <div>
                <label className="block font-medium mb-1">Email</label>
                <input type="email" className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400" />
              </div>
              <div>
                <label className="block font-medium mb-1">Dirección</label>
                <input type="text" className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400" />
              </div>
              <div className="flex justify-center gap-4 mt-4">
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                  Guardar
                </button>
                <button
                  type="button"
                  onClick={() => setMostrarFormulario(false)}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
