import React, { useState, useEffect } from "react";
import axios from "axios";

function Ventas() {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarDetalle, setMostrarDetalle] = useState(false);
  const [detalleActual, setDetalleActual] = useState([]);

  // Estados para registrar venta
  const [productos, setProductos] = useState([]);
  const [producto, setProducto] = useState("");
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [precio, setPrecio] = useState(0);
  const [descuento, setDescuento] = useState(0);
  const [cliente, setCliente] = useState("");
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [tipoVenta, setTipoVenta] = useState("contado");
  const [tipoPago, setTipoPago] = useState("efectivo");
  const [anticipo, setAnticipo] = useState("");

  const [clientes, setClientes] = useState([]);
  const [listaProductos, setListaProductos] = useState([]);
  const [ventas, setVentas] = useState([]);

  // Estados para edición
  const [ventaEditando, setVentaEditando] = useState(null);
  const [mostrarEditar, setMostrarEditar] = useState(false);

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);


  const [sucursales, setSucursales] = useState([]);
const [sucursalSeleccionada, setSucursalSeleccionada] = useState("");


  const cambiarPagina = (numeroPagina) => {
    setPaginaActual(numeroPagina);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
  axios.get("http://localhost:3001/api/sucursales")
    .then(res => setSucursales(res.data))
    .catch(err => console.error(err));
}, []);

// Filtrado por sucursal
const ventasFiltradas =
  sucursalSeleccionada && sucursalSeleccionada !== "todas"
    ? ventas.filter((v) => Number(v.id_sucursal) === Number(sucursalSeleccionada))
    : [];


// Luego haces la paginación sobre las ventas filtradas
const ventasPorPagina = 10;
const indexUltimaVenta = paginaActual * ventasPorPagina;
const indexPrimeraVenta = indexUltimaVenta - ventasPorPagina;
const ventasActuales = ventasFiltradas.slice(indexPrimeraVenta, indexUltimaVenta);
const totalPaginas = Math.ceil(ventasFiltradas.length / ventasPorPagina);



console.log(ventas);



  // Cargar clientes y productos al abrir modal
  useEffect(() => {
    if (mostrarModal) {
      axios.get("http://localhost:3001/api/clientes")
        .then((res) => setClientes(res.data))
        .catch((err) => console.error(err));

      axios.get("http://localhost:3001/api/productos")
        .then((res) => setListaProductos(res.data))
        .catch((err) => console.error(err));
    }
  }, [mostrarModal]);

  // Cargar ventas
  useEffect(() => {
    cargarVentas();
  }, []);

  const cargarVentas = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/ventas");
      setVentas(res.data);
    } catch (error) {
      console.error("Error al cargar ventas:", error);
    }
  };

  // Agregar producto al carrito
  const agregarProducto = () => {
    if (!productoSeleccionado || !precio)
      return alert("Selecciona un producto válido");

    const subtotal =
      Number(cantidad || 1) * Number(precio || 0) - Number(descuento || 0);

    setProductos([
      ...productos,
      {
        id_producto: productoSeleccionado.id_producto,
        producto: productoSeleccionado.nombre,
        cantidad: Number(cantidad || 1),
        precio: Number(precio || 0),
        descuento: Number(descuento || 0),
        subtotal,
      },
    ]);

    setProducto("");
    setProductoSeleccionado(null);
    setCantidad(1);
    setPrecio(0);
    setDescuento(0);
  };

  const eliminarProducto = (index) => {
    setProductos(productos.filter((_, i) => i !== index));
  };

  const totalOriginal = productos.reduce(
    (sum, p) => sum + p.precio * p.cantidad,
    0
  );
  const totalConDescuento = productos.reduce(
    (sum, p) => sum + (p.precio * p.cantidad - p.descuento),
    0
  );

  // Registrar venta
  const registrarVenta = async () => {
    if (!sucursalSeleccionada || sucursalSeleccionada === "todas") {
  alert("⚠️ Debes seleccionar una sucursal válida antes de registrar la venta.");
  return;
}

    if (productos.length === 0) return alert("Agrega al menos un producto");
    if (tipoVenta === "abonos" && !clienteSeleccionado)
      return alert("Selecciona un cliente para ventas a crédito");

    try {
      const carrito = productos.map((p) => ({
        id_producto: p.id_producto,
        cantidad: p.cantidad,
        precio: p.precio,
        descuento: p.descuento,
        subtotal: p.subtotal,
      }));

      const ventaData = {
        carrito,
        total: totalOriginal,
        total_final: totalConDescuento,
        id_cliente: clienteSeleccionado ? clienteSeleccionado.id_cliente : null,
        id_sucursal: sucursalSeleccionada,
        abono_inicial: tipoVenta === "abonos" ? Number(anticipo || 0) : 0,
        metodo_pago: tipoPago,
        estado: tipoVenta === "abonos" ? "PENDIENTE" : "PAGADO",
        esCredito: tipoVenta === "abonos",
      };

      await axios.post("http://localhost:3001/api/ventas/agregar", ventaData);
      alert("✅ Venta registrada correctamente");

      setProductos([]);
      setProducto("");
      setCantidad(1);
      setPrecio(0);
      setDescuento(0);
      setCliente("");
      setClienteSeleccionado(null);
      setAnticipo("");
      setMostrarModal(false);
      cargarVentas();
    } catch (error) {
      console.error(error);
      alert("❌ Error al registrar la venta");
    }
  };

  // Ver detalle de venta
  const verDetalle = async (idVenta) => {
    try {
      const res = await axios.get(
        `http://localhost:3001/api/ventas/detalle/${idVenta}`
      );
      setDetalleActual(res.data);
      setMostrarDetalle(true);
    } catch (error) {
      console.error(error);
      alert("Error al obtener detalle de venta");
    }
  };

  // Eliminar venta
  const eliminarVenta = async (idVenta) => {
    const confirmar = window.confirm("¿Seguro que deseas eliminar esta venta?");
    if (!confirmar) return;

    try {
      await axios.delete(`http://localhost:3001/api/ventas/${idVenta}`);
      alert("✅ Venta eliminada correctamente");
      cargarVentas();
    } catch (error) {
      console.error(error);
      alert("❌ Error al eliminar la venta");
    }
  };

  // Editar venta
  const editarVenta = (venta) => {
    setVentaEditando(venta);
    setMostrarEditar(true);
    setTipoPago(venta.metodo_pago || "efectivo");
    setTipoVenta(venta.esCredito ? "abonos" : "contado");
    setAnticipo(venta.abono_inicial || "");
    setClienteSeleccionado(
      venta.id_cliente
        ? clientes.find((c) => c.id_cliente === venta.id_cliente)
        : null
    );
  };

  const guardarEdicion = async () => {
    if (!ventaEditando) return;
    try {
      const datosActualizados = {
        tipo_pago: tipoPago,
        tipo_venta: tipoVenta,
        anticipo,
        id_cliente: clienteSeleccionado ? clienteSeleccionado.id_cliente : null,
      };

      await axios.put(
        `http://localhost:3001/api/ventas/${ventaEditando.id_venta}`,
        datosActualizados
      );
      alert("✅ Venta actualizada correctamente");
      setMostrarEditar(false);
      setVentaEditando(null);
      cargarVentas();
    } catch (error) {
      console.error(error);
      alert("❌ Error al actualizar la venta");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-xl rounded-2xl p-6 space-y-6">
        <h2 className="text-2xl font-semibold mb-4 text-center">📦 Ventas Registradas</h2>
<div className="flex justify-start mb-4 gap-2">
  <label>Sucursal:</label>
  <select
    value={sucursalSeleccionada}
    onChange={(e) => setSucursalSeleccionada(e.target.value)}
    className="border rounded-lg p-2"
  >
    <option value="todas">Todas</option>
    {sucursales.map((s) => (
      <option key={s.id_sucursal} value={s.id_sucursal}>
        {s.nombre}
      </option>
    ))}
  </select>
</div>

        <div className="flex justify-end mb-4">
          <button
            onClick={() => setMostrarModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Registrar Venta
          </button>
        </div>

        {/* Tabla de ventas */}
        <div className="overflow-x-auto">
          <table className="min-w-full border divide-y divide-gray-200">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-2">N°</th>
                <th className="p-2">Fecha</th>
                <th className="p-2">Cliente</th>
                <th className="p-2 text-center">Cantidad</th>
                <th className="p-2 text-right">Precio Venta</th>
                <th className="p-2 text-right">Descuento</th>
                <th className="p-2 text-right">Total Final</th>
                <th className="p-2 text-center">Estatus</th>
                <th className="p-2 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ventasActuales.length === 0 ? (
                <tr>
                  <td colSpan="10" className="text-center p-4 text-gray-500">
                  {sucursalSeleccionada === ""
                    ? "Selecciona una sucursal para ver sus ventas"
                    : sucursalSeleccionada === "todas"
                    ? "No se muestran ventas cuando seleccionas 'Todas'"
                    : "No hay ventas registradas para esta sucursal"}
                </td>
                </tr>
              ) : (
                ventasActuales.map((v, index) => (
                  <tr key={v.id_venta} className="hover:bg-gray-50 transition-colors">
                    <td className="p-2">{indexPrimeraVenta + index + 1}</td>
                    <td className="p-2">{new Date(v.fecha).toLocaleString()}</td>
                    <td className="p-2">{v.cliente || "Mostrador"}</td>
                    <td className="p-2 text-center">{v.cantidad_total ?? 0}</td>
                    <td className="p-2 text-right">${Number(v.precio_venta_total || 0).toFixed(2)}</td>
                    <td className="p-2 text-right">${Number(v.descuento_total || 0).toFixed(2)}</td>
                    <td className="p-2 text-right font-semibold">${Number(v.total_final || 0).toFixed(2)}</td>
                    <td
                      className={`p-2 text-center font-semibold rounded-lg ${
                        v.estado === "PENDIENTE"
                          ? "bg-red-100 text-red-700 border border-red-400"
                          : "bg-green-100 text-green-700 border border-green-400"
                      }`}
                    >
                      {v.estado}
                    </td>
                    <td className="p-2 flex gap-2 justify-center">
                      <button
                        className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                        onClick={() => eliminarVenta(v.id_venta)}
                      >
                        Eliminar
                      </button>
                      <button
                        className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                        onClick={() => verDetalle(v.id_venta)}
                      >
                        Ver detalle
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {totalPaginas > 1 && (
          <div className="flex justify-center items-center gap-2 mt-4">
            <button
              onClick={() => cambiarPagina(Math.max(paginaActual - 1, 1))}
              disabled={paginaActual === 1}
              className={`px-3 py-1 rounded border ${
                paginaActual === 1
                  ? "text-gray-400 border-gray-300 cursor-not-allowed"
                  : "text-blue-600 border-blue-400 hover:bg-blue-50"
              }`}
            >
              ⬅ Anterior
            </button>

            {[...Array(totalPaginas)].map((_, i) => (
              <button
                key={i}
                onClick={() => cambiarPagina(i + 1)}
                className={`px-3 py-1 rounded border ${
                  paginaActual === i + 1
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => cambiarPagina(Math.min(paginaActual + 1, totalPaginas))}
              disabled={paginaActual === totalPaginas}
              className={`px-3 py-1 rounded border ${
                paginaActual === totalPaginas
                  ? "text-gray-400 border-gray-300 cursor-not-allowed"
                  : "text-blue-600 border-blue-400 hover:bg-blue-50"
              }`}
            >
              Siguiente ➡
            </button>
          </div>
        )}
      </div>

      {/* 🔹 Modal Registrar Venta */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-3xl p-6 rounded-2xl shadow-lg relative">
            <button
              onClick={() => setMostrarModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl font-bold"
            >
              &times;
            </button>

            <h2 className="text-2xl font-semibold mb-4 text-center">Registrar Venta</h2>
<div className="mb-4 text-center text-lg font-medium">
  🏬 Sucursal actual:{" "}
  <span className="font-semibold text-blue-600">
    {
      sucursales.find((s) => s.id_sucursal == sucursalSeleccionada)?.nombre ||
      "No seleccionada"
    }
  </span>
</div>
            {/* Tipo de venta y pago */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label>Tipo de venta:</label>
                <select
                  value={tipoVenta}
                  onChange={(e) => setTipoVenta(e.target.value)}
                  className="border rounded-lg w-full p-2"
                >
                  <option value="contado">Contado</option>
                  <option value="abonos">Abonos</option>
                </select>
              </div>
              <div>
                <label>Tipo de pago:</label>
                <select
                  value={tipoPago}
                  onChange={(e) => setTipoPago(e.target.value)}
                  className="border rounded-lg w-full p-2"
                >
                  <option value="efectivo">Efectivo</option>
                  <option value="tarjeta">Tarjeta</option>
                  <option value="transferencia">Transferencia</option>
                </select>
              </div>

              {tipoVenta === "abonos" && (
                <>
                  <div>
                    <label>Cliente:</label>
                    <select
                      value={clienteSeleccionado?.id_cliente || ""}
                      onChange={(e) => {
                        const id = e.target.value;
                        const sel = clientes.find((c) => c.id_cliente == id);
                        setClienteSeleccionado(sel || null);
                      }}
                      className="border rounded-lg w-full p-2"
                    >
                      <option value="">Seleccione un cliente</option>
                      {clientes.map((c) => (
                        <option key={c.id_cliente} value={c.id_cliente}>
                          {c.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label>Anticipo:</label>
                    <input
                      type="number"
                      value={anticipo}
                      onChange={(e) => setAnticipo(e.target.value)}
                      className="border rounded-lg w-full p-2"
                      placeholder="Monto a cuenta"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Productos */}
            <div className="border-t pt-4 mt-2 relative">
              <h3 className="text-lg font-semibold mb-2">Agregar producto</h3>

              <div className="grid grid-cols-5 gap-2 mb-3 relative">
                <div className="col-span-1 relative">
                  <input
                    type="text"
                    placeholder="Producto"
                    value={producto}
                    onChange={(e) => setProducto(e.target.value)}
                    className="border rounded-lg p-2 w-full"
                  />
                  {producto && (
                    <ul className="absolute z-10 bg-white border w-full max-h-40 overflow-y-auto mt-1 rounded shadow">
                      {listaProductos
                        .filter(
                          (p) =>
                            p.nombre.toLowerCase().includes(producto.toLowerCase()) ||
                            (p.codigo && p.codigo.toLowerCase().includes(producto.toLowerCase()))
                        )
                        .map((p) => (
                          <li
                            key={p.id_producto}
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                              setProducto(p.nombre);
                              setPrecio(Number(p.precio_venta ?? 0));
                              setProductoSeleccionado(p);
                            }}
                          >
                            {p.nombre} {p.codigo && `(${p.codigo})`}
                          </li>
                        ))}
                    </ul>
                  )}
                </div>

                <input
                  type="number"
                  value={precio}
                  disabled
                  className="border rounded-lg p-2"
                  placeholder="Precio"
                />
                <input
                  type="number"
                  min="1"
                  value={cantidad}
                  onChange={(e) => setCantidad(Number(e.target.value))}
                  className="border rounded-lg p-2"
                  placeholder="Cantidad"
                />
                <input
                  type="number"
                  value={descuento}
                  onChange={(e) => setDescuento(Number(e.target.value))}
                  className="border rounded-lg p-2"
                  placeholder="Descuento"
                  disabled={tipoVenta === "abonos"}
                />
                <button
                  onClick={agregarProducto}
                  className="bg-blue-600 text-white rounded-lg p-2 hover:bg-blue-700 transition"
                >
                  Agregar
                </button>
              </div>

              {/* Tabla de productos */}
              <table className="w-full text-sm border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 border">Producto</th>
                    <th className="p-2 border">Cant.</th>
                    <th className="p-2 border">Precio</th>
                    <th className="p-2 border">Desc.</th>
                    <th className="p-2 border">Subtotal</th>
                    <th className="p-2 border"></th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map((p, index) => (
                    <tr key={index}>
                      <td className="p-2 border">{p.producto}</td>
                      <td className="p-2 border text-center">{p.cantidad}</td>
                      <td className="p-2 border text-right">${p.precio.toFixed(2)}</td>
                      <td className="p-2 border text-right">${p.descuento.toFixed(2)}</td>
                      <td className="p-2 border text-right">${p.subtotal.toFixed(2)}</td>
                      <td className="p-2 border text-center">
                        <button
                          onClick={() => eliminarProducto(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                  {productos.length === 0 && (
                    <tr>
                      <td colSpan="6" className="p-2 text-center text-gray-500">
                        No hay productos agregados
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Totales */}
              <div className="text-right mt-3 font-semibold text-lg">
                <div>Total sin descuento: ${totalOriginal.toFixed(2)}</div>
                <div>Total con descuento: ${totalConDescuento.toFixed(2)}</div>
              </div>
            </div>

            {/* Botones de acción */}
           <div className="flex justify-end gap-2 mt-6">
  <button
    onClick={() => setMostrarModal(false)}
    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
  >
    Cancelar
  </button>

  {sucursalSeleccionada && sucursalSeleccionada !== "todas" ? (
    <button
      onClick={registrarVenta}
      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
    >
      Registrar Venta
    </button>
  ) : (
    <span className="text-gray-500 italic self-center">
      Selecciona una sucursal para registrar ventas
    </span>
  )}
</div>

          </div>
        </div>
      )}

      {/* 🔹 Modal Detalle */}
      {mostrarDetalle && detalleActual.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-2xl p-6 rounded-2xl shadow-lg relative">
            <button
              onClick={() => setMostrarDetalle(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl font-bold"
            >
              &times;
            </button>

            <div className="mb-4 border-b pb-3">
              <h2 className="text-2xl font-semibold text-center mb-2">
                Detalle de Venta
              </h2>
              <div className="flex justify-between text-lg font-medium">
                <span>
                  🧍 Cliente:{" "}
                  <strong>{detalleActual[0].cliente || ""}</strong>
                </span>
                <span>
                  💰 Total abonado:{" "}
                  <strong>
                    ${Number(detalleActual[0].total_abonado ?? 0).toFixed(2)}
                  </strong>
                </span>
              </div>
            </div>

            <table className="w-full text-sm border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">Producto</th>
                  <th className="p-2 border">Cantidad</th>
                  <th className="p-2 border">Precio</th>
                  <th className="p-2 border">Descuento</th>
                  <th className="p-2 border">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {detalleActual.map((item, index) => (
                  <tr key={index}>
                    <td className="p-2 border">{item.nombre || item.producto}</td>
                    <td className="p-2 border text-center">{item.cantidad}</td>
                    <td className="p-2 border text-right">${Number(item.precio ?? 0).toFixed(2)}</td>
                    <td className="p-2 border text-right">${Number(item.descuento ?? 0).toFixed(2)}</td>
                    <td className="p-2 border text-right">${Number(item.subtotal ?? 0).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 🔹 Modal Editar Venta */}
      {mostrarEditar && ventaEditando && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-lg relative">
            <button
              onClick={() => setMostrarEditar(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl font-bold"
            >
              &times;
            </button>

            <h2 className="text-2xl font-semibold mb-4 text-center">Editar Venta</h2>

            <div className="space-y-3">
              <div>
                <label>Tipo de venta:</label>
                <select
                  value={tipoVenta}
                  onChange={(e) => setTipoVenta(e.target.value)}
                  className="border rounded-lg w-full p-2"
                >
                  <option value="contado">Contado</option>
                  <option value="abonos">Abonos</option>
                </select>
              </div>

              <div>
                <label>Tipo de pago:</label>
                <select
                  value={tipoPago}
                  onChange={(e) => setTipoPago(e.target.value)}
                  className="border rounded-lg w-full p-2"
                >
                  <option value="efectivo">Efectivo</option>
                  <option value="tarjeta">Tarjeta</option>
                  <option value="transferencia">Transferencia</option>
                </select>
              </div>

              {tipoVenta === "abonos" && (
                <>
                  <div>
                    <label>Cliente:</label>
                    <select
                      value={clienteSeleccionado?.id_cliente || ""}
                      onChange={(e) => {
                        const id = e.target.value;
                        const sel = clientes.find((c) => c.id_cliente == id);
                        setClienteSeleccionado(sel || null);
                      }}
                      className="border rounded-lg w-full p-2"
                    >
                      <option value="">Seleccione un cliente</option>
                      {clientes.map((c) => (
                        <option key={c.id_cliente} value={c.id_cliente}>
                          {c.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label>Anticipo:</label>
                    <input
                      type="number"
                      value={anticipo}
                      onChange={(e) => setAnticipo(e.target.value)}
                      className="border rounded-lg w-full p-2"
                      placeholder="Monto a cuenta"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setMostrarEditar(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={guardarEdicion}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Ventas;
