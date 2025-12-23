import { useState, useEffect } from "react";

export default function Clientes() {
  // Estados generales
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  // Lista de clientes
  const [clientesData, setClientesData] = useState([]);

  // Estados del formulario
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");

  const [clienteEditarId, setClienteEditarId] = useState(null);

  const productosPorPagina = 10;

  // Cargar clientes desde el backend
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/clientes");
        const data = await res.json();
        setClientesData(data);
      } catch (error) {
        console.error("Error al cargar clientes:", error);
      }
    };
    fetchClientes();
  }, []);

  // Filtrado de clientes
  const clientesFiltrados = clientesData.filter((c) =>
    c.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Paginación
  const indexUltimoProducto = pagina * productosPorPagina;
  const indexPrimerProducto = indexUltimoProducto - productosPorPagina;
  const clientesPagina = clientesFiltrados.slice(
    indexPrimerProducto,
    indexUltimoProducto
  );
  const totalPaginas = Math.ceil(clientesFiltrados.length / productosPorPagina);

  //saldo pendiente
  const saldo_pendiente = 100;

  //Editar Cliente
  const handleEditarCliente = (cliente) => {
  setClienteEditarId(cliente.id_cliente); // Guardamos el id
  setNombre(cliente.nombre);
  setTelefono(cliente.telefono);
  setDireccion(cliente.direccion);
  setMostrarFormulario(true);
};

  // Guardar cliente nuevo
  const handleGuardarCliente = async (e) => {
  e.preventDefault();
console.log(clienteEditarId);
  try {
    if (clienteEditarId) {
      // EDITAR cliente
      const res = await fetch(`http://localhost:3001/api/clientes/${clienteEditarId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, telefono, direccion }),
      });
      const data = await res.json();

      // Actualizar la lista local
      setClientesData(clientesData.map(c => c.id_cliente === clienteEditarId ? data : c));
    } else {
      // AGREGAR cliente
      const res = await fetch('http://localhost:3001/api/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, telefono, direccion }),
      });
      const data = await res.json();
      setClientesData([...clientesData, data]);
    }

    // Limpiar formulario
    setNombre('');
    setTelefono('');
    setDireccion('');
    setClienteEditarId(null);
    setMostrarFormulario(false);
  } catch (error) {
    console.error('Error al guardar cliente:', error);
  }
};

const handleEliminarCliente = async (id_cliente) => {
  if (!window.confirm("¿Estás seguro de que quieres eliminar este cliente?")) return;


  try {
    const res = await fetch(`http://localhost:3001/api/clientes/${id_cliente}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Error al eliminar cliente");

    // Actualizar la lista local
    setClientesData(clientesData.filter((c) => c.id_cliente !== id_cliente));
  } catch (error) {
    console.error("Error al eliminar cliente:", error);
  }
};

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold mb-4">Clientes</h2>

      <button
        onClick={() => setMostrarFormulario(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Agregar Cliente
      </button>

      <input
        type="text"
        placeholder="Buscar cliente por nombre..."
        className="mb-4 w-full border p-2 rounded focus:ring-2 focus:ring-blue-400"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      {/* Tabla de clientes */}
      <div className="overflow-x-auto">
        <table className="min-w-full border divide-y divide-gray-200">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2">Nombre</th>
              <th className="p-2">Teléfono</th>
              <th className="p-2">Dirección</th>
              <th className="p-2">Saldo Pendiente</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {clientesPagina.map((c) => (
              <tr key={c.id_cliente}>
                <td className="p-2">{c.nombre}</td>
                <td className="p-2">{c.telefono}</td>
                <td className="p-2">{c.direccion}</td>
                <td className="p-2">{saldo_pendiente}</td>
                    <td className="p-2 flex gap-2">
          {/* Botón Editar */}
          <button
             onClick={() => handleEditarCliente(c)}
            className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 transition"
          >
            Editar
          </button>

          {/* Botón Eliminar */}
          <button
             onClick={() => handleEliminarCliente(c.id_cliente)}
            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
          >
            Eliminar
          </button>
        </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Paginación */}
        <div className="flex justify-center mt-4 space-x-2">
          {Array.from({ length: totalPaginas }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setPagina(i + 1)}
              className={`px-3 py-1 rounded ${
                pagina === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
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
            <form className="space-y-4" onSubmit={handleGuardarCliente}>
              <div>
                <label className="block font-medium mb-1">Nombre</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Teléfono</label>
                <input
                  type="text"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Dirección</label>
                <input
                  type="text"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              <div className="flex justify-center gap-4 mt-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
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
