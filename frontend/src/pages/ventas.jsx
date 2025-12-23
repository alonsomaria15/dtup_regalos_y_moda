import { useState, useEffect } from "react";
import axios from "axios";

export default function RegistrarVentaProvisional() {
  const [productosDisponibles, setProductosDisponibles] = useState([]);
  const [clientes, setClientes] = useState([]);

  const [producto, setProducto] = useState("");
  const [precio, setPrecio] = useState(0);
  const [descuento, setDescuento] = useState(0);
  const [cantidad, setCantidad] = useState(1);
  const [carrito, setCarrito] = useState([]);

  // Venta a crédito
  const [esCredito, setEsCredito] = useState(false);
  const [abonoInicial, setAbonoInicial] = useState(0);
  const [cliente, setCliente] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);

  // Clientes
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);
  const clientesPorPagina = 5;

  // Cargar productos y clientes
  useEffect(() => {
    axios
      .get("http://localhost:3001/api/productos")
      .then((res) => setProductosDisponibles(res.data))
      .catch((err) => console.error("❌ Error al cargar productos:", err));

    axios
      .get("http://localhost:3001/api/clientes")
      .then((res) => setClientes(res.data))
      .catch((err) => console.error("❌ Error al cargar clientes:", err));
  }, []);

  // Filtrar y paginar clientes
  const clientesFiltrados = clientes.filter((c) =>
    c.nombre?.toLowerCase().includes(busqueda.toLowerCase())
  );
  const indexUltimoCliente = pagina * clientesPorPagina;
  const indexPrimerCliente = indexUltimoCliente - clientesPorPagina;
  const clientesPagina = clientesFiltrados.slice(indexPrimerCliente, indexUltimoCliente);
  const totalPaginas = Math.ceil(clientesFiltrados.length / clientesPorPagina);

  // Buscar producto y actualizar precio
  const handleProductoChange = (e) => {
    const valor = e.target.value;
    setProducto(valor);
    const prod = productosDisponibles.find(
      (p) => p.nombre.toLowerCase() === valor.toLowerCase()
    );
    setPrecio(prod ? prod.precio_venta : 0);
  };

  // Agregar producto al carrito
  const agregarProducto = () => {
    if (!producto || precio <= 0 || cantidad <= 0)
      return alert("Completa los datos del producto");

    const prod = productosDisponibles.find(
      (p) => p.nombre.toLowerCase() === producto.toLowerCase()
    );

    setCarrito([
      ...carrito,
      {
        id_producto: prod?.id_producto || null,
        producto,
        precio,
        descuento,
        cantidad,
        subtotal: (precio - descuento) * cantidad,
      },
    ]);

    setProducto("");
    setPrecio(0);
    setDescuento(0);
    setCantidad(1);
  };

  // Eliminar producto del carrito
  const eliminarProducto = (index) => {
    const nuevo = [...carrito];
    nuevo.splice(index, 1);
    setCarrito(nuevo);
  };

  const totalFinal = carrito.reduce((sum, p) => sum + p.subtotal, 0);

  // Registrar venta
  const registrarVenta = async () => {
    if (carrito.length === 0) return alert("No hay productos en el carrito");
    if (esCredito && !cliente)
      return alert("Debes seleccionar un cliente para venta a crédito");

    try {
      const response = await axios.post("http://localhost:3001/api/ventas/agregar", {
        carrito,
        total: totalFinal,
        total_final: totalFinal,
        id_cliente: esCredito ? cliente : null,
        id_sucursal: 1,
        abono_inicial: esCredito ? abonoInicial : totalFinal,
        metodo_pago: "efectivo",
        estado: esCredito ? "PENDIENTE" : "PAGADO",
        esCredito,
      });

      alert(`✅ Venta registrada (ID: ${response.data.idVenta})`);
      setCarrito([]);
      setEsCredito(false);
      setAbonoInicial(0);
      setCliente("");
      setMostrarModal(false);
    } catch (err) {
      console.error(err);
      alert("❌ Error al registrar venta");
    }
  };

  const handleEditarCliente = (cliente) => {
    alert(`📝 Aquí podrías editar los datos de ${cliente.nombre}`);
  };

  const handleEliminarCliente = (idCliente) => {
    if (window.confirm("¿Seguro que deseas eliminar este cliente?")) {
      setClientes(clientes.filter((c) => c.id_cliente !== idCliente));
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold mb-4">Clientes</h2>

      <button
        onClick={() => setMostrarModal(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Registrar Venta
      </button>

      {/* Buscador */}
      <input
        type="text"
        placeholder="Buscar cliente por nombre..."
        className="mb-4 w-full border p-2 rounded focus:ring-2 focus:ring-blue-400"
        value={busqueda}
        onChange={(e) => {
          setBusqueda(e.target.value);
          setPagina(1);
        }}
      />

      {/* Tabla de clientes */}
      <div className="overflow-x-auto">
        <table className="min-w-full border divide-y divide-gray-200">
          <thead className="bg-gray-100 text-left">
            <tr>
            <th className="p-2 border">Imagen</th>
                      <th className="p-2 border">Código</th>
                      <th className="p-2 border">Nombre</th>
                      <th className="p-2 border">Cantidad</th>
                      <th className="p-2 border">Fecha</th>
                      <th className="p-2 border">Precio Vendido</th>
                      <th className="p-2 border">Total Venta</th>
                      <th className="p-2 border">Total Final</th>
                      <th className="p-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {clientesPagina.map((c) => (
              <tr key={c.id_cliente}>
                <td className="p-2">{c.nombre}</td>
                <td className="p-2">{c.telefono}</td>
                <td className="p-2">{c.direccion}</td>
                    <td className="p-2">{c.direccion}</td>
                        <td className="p-2">{c.direccion}</td>
                            <td className="p-2">{c.direccion}</td>
                                <td className="p-2">{c.direccion}</td>
                <td className="p-2">${c.saldo_pendiente || 0}</td>
                <td className="p-2 flex gap-2">
                  <button
                    onClick={() => handleEditarCliente(c)}
                    className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 transition"
                  >
                    Editar
                  </button>
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

      {/* Modal */}
      {mostrarModal && (
        <>
          {/* Fondo oscuro */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={() => setMostrarModal(false)}
          ></div>

          {/* Contenido del modal */}
          <div className="fixed inset-0 flex justify-center items-center z-50">
            <div
              className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-4xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setMostrarModal(false)}
                className="absolute top-2 right-3 text-gray-500 hover:text-gray-700"
              >
                ✖
              </button>

              <h2 className="text-2xl font-semibold mb-4 text-center">
                Registrar Venta
              </h2>

              {/* Campos de producto */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-4 items-end">
                <div>
                  <label>Producto</label>
                  <input
                    list="productos"
                    placeholder="Nombre del producto"
                    value={producto}
                    onChange={handleProductoChange}
                    className="border p-2 rounded w-full"
                  />
                  <datalist id="productos">
                    {productosDisponibles.map((p) => (
                      <option key={p.id_producto} value={p.nombre} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label>Precio</label>
                  <input
                    type="number"
                    value={precio}
                    className="border p-2 rounded w-full"
                    readOnly
                  />
                </div>

                <div>
                  <label>Descuento</label>
                  <input
                    type="number"
                    value={descuento}
                    onChange={(e) => setDescuento(Number(e.target.value))}
                    className="border p-2 rounded w-full"
                  />
                </div>

                <div>
                  <label>Cantidad</label>
                  <input
                    type="number"
                    value={cantidad}
                    onChange={(e) => setCantidad(Number(e.target.value))}
                    className="border p-2 rounded w-full"
                  />
                </div>

                <button
                  onClick={agregarProducto}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Agregar
                </button>
              </div>

              {/* Tabla del carrito */}
              <div className="overflow-auto mb-4">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2 border">Producto</th>
                      <th className="p-2 border">Precio</th>
                      <th className="p-2 border">Descuento</th>
                      <th className="p-2 border">Cantidad</th>
                      <th className="p-2 border">Subtotal</th>
                      <th className="p-2 border">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {carrito.map((p, i) => (
                      <tr key={i}>
                        <td className="p-2 border">{p.producto}</td>
                        <td className="p-2 border">${p.precio}</td>
                        <td className="p-2 border">${p.descuento}</td>
                        <td className="p-2 border">{p.cantidad}</td>
                        <td className="p-2 border font-semibold">
                          ${p.subtotal}
                        </td>
                        <td className="p-2 border text-center">
                          <button
                            onClick={() => eliminarProducto(i)}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Venta a crédito */}
              <div className="mb-4 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={esCredito}
                  onChange={(e) => setEsCredito(e.target.checked)}
                />
                <label>Venta a crédito (en abonos)</label>
              </div>

              {esCredito && (
                <>
                  <div className="mb-4">
                    <label>Cliente</label>
                    <select
                      value={cliente}
                      onChange={(e) => setCliente(e.target.value)}
                      className="border p-2 rounded w-full"
                    >
                      <option value="">-- Selecciona un cliente --</option>
                      {clientes.map((c) => (
                        <option key={c.id_cliente} value={c.id_cliente}>
                          {c.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-4">
                    <label>Abono inicial (opcional)</label>
                    <input
                      type="number"
                      value={abonoInicial}
                      onChange={(e) =>
                        setAbonoInicial(Number(e.target.value))
                      }
                      className="border p-2 rounded w-full"
                    />
                  </div>
                </>
              )}

              {/* Total */}
              <div className="flex justify-between items-center bg-gray-100 p-4 rounded">
                <p className="font-semibold text-lg">Total: ${totalFinal}</p>
                <button
                  onClick={registrarVenta}
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                >
                  Registrar Venta
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
