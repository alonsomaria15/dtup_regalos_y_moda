import React, { useState, useEffect } from "react";
import axios from "axios";

function Inventario() {
  const [productos, setProductos] = useState([]);
  const [buscar, setBuscar] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalVariantesProducto, setMostrarModalVariantesProducto] =
    useState(false);
  const [imagenGrande, setImagenGrande] = useState(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const [productosPorPagina] = useState(10);
  const [categorias, setCategorias] = useState([]);
  const [generos, setGeneros] = useState([]);
  const [variantes, setVariantes] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [sucursalSeleccionada, setSucursalSeleccionada] = useState("");

  // 🆕 Modal para registrar una nueva variante
  const [mostrarModalAgregarVariante, setMostrarModalAgregarVariante] =
    useState(false);
  const [nuevaVariante, setNuevaVariante] = useState({
    modelo: "",
    color: "",
    talla: "",
  });

  // 🧩 Variantes temporales antes de guardar producto
  const [variantesTemp, setVariantesTemp] = useState([]);

  // Estado del producto nuevo/editar
  const [nuevoProducto, setNuevoProducto] = useState({
    id_producto: "",
    codigo: "",
    nombre: "",
    categoria: "",
    genero: "",
    tipo: "",
    precio_compra: "",
    precio_venta: "",
    stock: "",
    imagen: "",
    sucursal: "",
  });

  // 🧹 Limpiar campos
  const limpiarCampos = () => {
    setNuevoProducto({
      id_producto: "",
      codigo: "",
      nombre: "",
      categoria: "",
      genero: "",
      tipo: "",
      precio_compra: "",
      precio_venta: "",
      stock: "",
      imagen: "",
      sucursal: sucursalSeleccionada,
    });
    setVariantesTemp([]);
  };

  // 🟢 Generar código automático
  const generarCodigo = () =>
    "PRD" + Math.floor(100000 + Math.random() * 900000);

  // 🟢 Cargar productos SOLO cuando se selecciona sucursal
  useEffect(() => {
    async function fetchProductos() {
      if (!sucursalSeleccionada) {
        setProductos([]);
        return;
      }
      try {
        const res = await axios.get(
          `http://localhost:3001/api/productos?sucursal=${sucursalSeleccionada}`
        );
        setProductos(res.data);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      }
    }
    fetchProductos();
  }, [sucursalSeleccionada]);

  // 🟢 Cargar categorías
  useEffect(() => {
    async function fetchCategorias() {
      try {
        const res = await axios.get("http://localhost:3001/api/categorias");
        setCategorias(res.data);
      } catch (error) {
        console.error("Error al cargar categorías:", error);
      }
    }
    fetchCategorias();
  }, []);

  // 🟢 Cargar géneros
  useEffect(() => {
    async function fetchGeneros() {
      try {
        const res = await axios.get("http://localhost:3001/api/genero");
        setGeneros(res.data);
      } catch (error) {
        console.error("Error al cargar géneros:", error);
      }
    }
    fetchGeneros();
  }, []);

  // 🟡 Agregar o editar producto
  const handleAgregarProducto = async () => {
    if (!sucursalSeleccionada) {
      alert("⚠️ Debes seleccionar una sucursal antes de agregar un producto");
      return;
    }

    try {
      const formData = new FormData();
      const codigoGenerado = nuevoProducto.codigo || generarCodigo();

      formData.append("codigo", codigoGenerado);
      formData.append("nombre", nuevoProducto.nombre);
      formData.append("categoria", nuevoProducto.categoria);
      formData.append("genero", nuevoProducto.genero);
      formData.append("precio_compra", nuevoProducto.precio_compra);
      formData.append("precio_venta", nuevoProducto.precio_venta);
      formData.append("stock", nuevoProducto.stock);
      formData.append("sucursal", nuevoProducto.sucursal || sucursalSeleccionada);

      if (nuevoProducto.imagen) {
        formData.append("imagen", nuevoProducto.imagen);
      }

      if (nuevoProducto.id_producto) {
        // ✏️ EDITAR PRODUCTO
        await axios.put(
          `http://localhost:3001/api/productos/${nuevoProducto.id_producto}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        alert("✅ Producto actualizado correctamente");
      } else {
        // 🆕 AGREGAR NUEVO PRODUCTO
        const res = await axios.post(
          "http://localhost:3001/api/productos/agregar",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        alert("✅ Producto agregado correctamente");

        const idNuevoProducto = res.data.id_producto;

        // 🟢 Si hay variantes temporales, guardarlas en la tabla
        if (variantesTemp.length > 0 && idNuevoProducto) {
          for (const v of variantesTemp) {
            await axios.post(`http://localhost:3001/api/variantes`, {
              id_producto: idNuevoProducto,
              ...v,
            });
          }
          alert("🟢 Variantes guardadas correctamente");
          setVariantesTemp([]);
        }
      }

      limpiarCampos();
      setMostrarModal(false);

      // Recargar productos de la sucursal actual
      const r = await axios.get(
        `http://localhost:3001/api/productos?sucursal=${sucursalSeleccionada}`
      );
      setProductos(r.data);
    } catch (error) {
      console.error(error);
      alert("❌ Error al registrar o actualizar producto");
    }
  };

  // ✏️ Editar producto
  const handleEditarProducto = (producto) => {
    setNuevoProducto({
      ...producto,
      imagen: null,
    });
    setMostrarModal(true);
  };

  // 🗑️ Eliminar producto
  const handleEliminarProducto = async (id_producto) => {
    if (window.confirm("¿Seguro que deseas eliminar este producto?")) {
      try {
        await axios.delete(`http://localhost:3001/api/productos/${id_producto}`);
        setProductos(productos.filter((p) => p.id_producto !== id_producto));
        alert("🗑️ Producto eliminado correctamente");
      } catch (error) {
        console.error("Error al eliminar producto:", error);
        alert("❌ Error al eliminar producto");
      }
    }
  };

  // 👕 Abrir modal de variantes (ver detalles)
  const abrirModalVariantesProducto = async (id_producto) => {
    try {
      setProductoSeleccionado(id_producto);
      const res = await axios.get(
        `http://localhost:3001/api/variantes/${id_producto}`
      );
      setVariantes(res.data);
      setMostrarModalVariantesProducto(true);
    } catch (error) {
      console.error("Error al cargar variantes:", error);
    }
  };

  // 🟣 Abrir modal variantes al elegir ropa o calzado
  useEffect(() => {
    const categoria = nuevoProducto.categoria?.toLowerCase();
    if (categoria === "ropa" || categoria === "calzado") {
      setMostrarModalAgregarVariante(true);
    }
  }, [nuevoProducto.categoria]);

  // 🔍 Filtrar productos
  const productosFiltrados = productos.filter(
    (p) =>
      p.nombre?.toLowerCase().includes(buscar.toLowerCase()) ||
      p.categoria?.toLowerCase().includes(buscar.toLowerCase()) ||
      p.codigo?.toLowerCase().includes(buscar.toLowerCase())
  );

  // 🔹 Paginación
  const indexUltimo = paginaActual * productosPorPagina;
  const indexPrimero = indexUltimo - productosPorPagina;
  const productosPagina = productosFiltrados.slice(indexPrimero, indexUltimo);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-xl rounded-2xl p-6 space-y-6">
        <h2 className="text-2xl font-semibold mb-4">Inventario</h2>

        {/* 🏪 Selección de sucursal */}
        <div className="flex items-center justify-start mb-4 bg-yellow-100 border border-yellow-400 p-3 rounded-lg">
          <label className="text-black font-bold mr-3">Sucursal:</label>
          <select
            value={sucursalSeleccionada}
            onChange={(e) => {
              setSucursalSeleccionada(e.target.value);
              setPaginaActual(1);
              setNuevoProducto((prev) => ({
                ...prev,
                sucursal: e.target.value,
              }));
            }}
            className="border-2 border-black p-2 rounded bg-white text-black"
          >
            <option value="">Selecciona una sucursal...</option>
            <option value="1">Sucursal 1: Alberto García</option>
            <option value="2">Sucursal 2: Francisco Villa</option>
          </select>
        </div>

        {/* 🟢 Tabla de productos */}
        {!sucursalSeleccionada ? (
          <div className="text-center py-10 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-700 text-lg font-medium">
              🏪 Selecciona una sucursal para ver los productos.
            </p>
          </div>
        ) : (
          <>
            {/* Buscador y botón */}
            <div className="flex items-center justify-between gap-4">
              <input
                type="text"
                placeholder="Buscar producto..."
                className="border p-2 rounded focus:ring-2 focus:ring-blue-400"
                value={buscar}
                onChange={(e) => setBuscar(e.target.value)}
              />
              <button
                onClick={() => {
                  limpiarCampos();
                  setMostrarModal(true);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Agregar Producto
              </button>
            </div>

            {/* Tabla de productos */}
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full border divide-y divide-gray-200">
                <thead className="bg-gray-100 text-left">
                  <tr>
                    <th className="p-2">#</th>
                    <th className="p-2">Código</th>
                    <th className="p-2">Nombre</th>
                    <th className="p-2">Categoría</th>
                    <th className="p-2">Precio Compra</th>
                    <th className="p-2">Precio Venta</th>
                    <th className="p-2">Ganancia</th>
                    <th className="p-2">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productosPagina.map((p, i) => (
                    <tr key={p.id_producto} className="hover:bg-gray-50">
                      <td className="p-2">
                        {(paginaActual - 1) * productosPorPagina + i + 1}
                      </td>
                      <td className="p-2">{p.codigo}</td>
                      <td className="p-2">{p.nombre}</td>
                      <td className="p-2">{p.categoria}</td>
                      <td className="p-2">${p.precio_compra}</td>
                      <td className="p-2">${p.precio_venta}</td>
                      <td className="p-2 text-green-600 font-medium">
                        ${p.precio_venta - p.precio_compra}
                      </td>
                      <td className="p-2 flex gap-2">
                        <button
                          onClick={() => handleEditarProducto(p)}
                          className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 transition"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleEliminarProducto(p.id_producto)}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                        >
                          Eliminar
                        </button>
                        <button
                          onClick={() =>
                            abrirModalVariantesProducto(p.id_producto)
                          }
                          className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 transition"
                        >
                          Variantes
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* 🟣 Modal para registrar variantes (con tabla local) */}
        {mostrarModalAgregarVariante && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
            <div className="bg-white w-full max-w-lg p-6 rounded-2xl shadow-lg relative">
              <button
                onClick={() => setMostrarModalAgregarVariante(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl font-bold"
              >
                &times;
              </button>

              <h3 className="text-2xl font-semibold mb-4 text-center text-purple-700">
                Registrar Variantes
              </h3>

              {/* Formulario + tabla */}
              <div className="flex flex-col md:flex-row gap-3 mb-4">
                <input
                  type="text"
                  placeholder="Modelo"
                  value={nuevaVariante.modelo}
                  onChange={(e) =>
                    setNuevaVariante({ ...nuevaVariante, modelo: e.target.value })
                  }
                  className="border p-2 rounded w-full"
                />
                <input
                  type="text"
                  placeholder="Color"
                  value={nuevaVariante.color}
                  onChange={(e) =>
                    setNuevaVariante({ ...nuevaVariante, color: e.target.value })
                  }
                  className="border p-2 rounded w-full"
                />
                <input
                  type="text"
                  placeholder="Talla"
                  value={nuevaVariante.talla}
                  onChange={(e) =>
                    setNuevaVariante({ ...nuevaVariante, talla: e.target.value })
                  }
                  className="border p-2 rounded w-full"
                />
                <button
                  onClick={() => {
                    if (
                      !nuevaVariante.modelo ||
                      !nuevaVariante.color ||
                      !nuevaVariante.talla
                    ) {
                      alert("⚠️ Completa todos los campos");
                      return;
                    }
                    setVariantesTemp([...variantesTemp, nuevaVariante]);
                    setNuevaVariante({ modelo: "", color: "", talla: "" });
                  }}
                  className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
                >
                  ➕
                </button>
              </div>

              {/* Tabla de variantes */}
              {variantesTemp.length > 0 ? (
                <table className="min-w-full border border-gray-200 rounded-lg text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-2 px-3 text-left">#</th>
                      <th className="py-2 px-3 text-left">Modelo</th>
                      <th className="py-2 px-3 text-left">Color</th>
                      <th className="py-2 px-3 text-left">Talla</th>
                      <th className="py-2 px-3 text-center">Eliminar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {variantesTemp.map((v, i) => (
                      <tr key={i} className="border-t hover:bg-gray-50">
                        <td className="py-2 px-3">{i + 1}</td>
                        <td className="py-2 px-3">{v.modelo}</td>
                        <td className="py-2 px-3">{v.color}</td>
                        <td className="py-2 px-3">{v.talla}</td>
                        <td className="py-2 px-3 text-center">
                          <button
                            onClick={() =>
                              setVariantesTemp(
                                variantesTemp.filter((_, idx) => idx !== i)
                              )
                            }
                            className="text-red-600 hover:text-red-800 font-bold"
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500 text-center">
                  No has agregado variantes aún.
                </p>
              )}

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setMostrarModalAgregarVariante(false)}
                  className="bg-gray-200 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-300 transition font-medium"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Inventario;
