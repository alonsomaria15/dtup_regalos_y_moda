import React, { useState, useEffect } from "react";
import axios from "axios";

function Inventario() {
  const [productos, setProductos] = useState([]);
  const [buscar, setBuscar] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalVariantes, setMostrarModalVariantes] = useState(false);
  const [imagenGrande, setImagenGrande] = useState(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const [productosPorPagina] = useState(10);
  const [categorias, setCategorias] = useState([]);
  const [generos, setGeneros] = useState([]);
  const [tiposFiltrados, setTiposFiltrados] = useState([]);
const [mostrarModalVariante, setMostrarModalVariante] = useState(false);
const [nuevaVariante, setNuevaVariante] = useState({ modelo: "", color: "", talla: "" });
 const [inversionTotal, setInversionTotal] = useState(0);
// Estados
const [sucursales, setSucursales] = useState([]);
const [sucursalSeleccionada, setSucursalSeleccionada] = useState("");
const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [mostrarModalVariantesProducto, setMostrarModalVariantesProducto] =
    useState(false);

  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [variantes, setVariantes] = useState([]);

  // 🟢 Estado principal del producto
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
  });

  // 🧩 Función para actualizar una variante
  const actualizarVariante = (index, campo, valor) => {
    const nuevas = [...variantes];
    nuevas[index][campo] = valor;
    setVariantes(nuevas);
  };

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
    });
    setVariantes([]);
  };

  // 🔹 Generar código automático
  const generarCodigo = () => {
    return "PRD" + Math.floor(100000 + Math.random() * 900000);
  };

  // 🟢 Cargar productos al iniciar
  useEffect(() => {
    async function fetchProductos() {
      try {
        const res = await axios.get("http://localhost:3001/api/productos");
        setProductos(res.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchProductos();
  }, []);

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
    alert("❌ Debes seleccionar una sucursal antes de agregar un producto");
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
    formData.append("id_sucursal", sucursalSeleccionada); // 🟢 Aquí agregamos la sucursal

    if (nuevoProducto.imagen) {
      formData.append("imagen", nuevoProducto.imagen);
    }

    if (nuevoProducto.id_producto) {
      // ✏️ EDITAR
      await axios.put(
        `http://localhost:3001/api/productos/${nuevoProducto.id_producto}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      alert("✅ Producto actualizado correctamente");
    } else {
      // 🆕 AGREGAR
      const res = await axios.post(
        "http://localhost:3001/api/productos/agregar",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const id_producto = res.data.id_producto;

      if (variantes.length > 0) {
        await axios.post("http://localhost:3001/api/variantes", {
          id_producto,
          variantes,
        });
      }

      alert("✅ Producto y variantes registrados correctamente");
    }

    // 🔄 Limpiar y recargar solo los productos de la sucursal seleccionada
    limpiarCampos();
    setMostrarModal(false);
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
      id_producto: producto.id_producto,
      codigo: producto.codigo,
      nombre: producto.nombre,
      categoria: producto.categoria,
      genero: producto.genero,
      precio_compra: producto.precio_compra,
      precio_venta: producto.precio_venta,
      stock: producto.stock,
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

  // 👕 Abrir modal variantes del producto
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

 // Obtener sucursales desde backend
useEffect(() => {
  const fetchSucursales = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/sucursales");
      setSucursales(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  fetchSucursales();
}, []);

 // Filtrar productos según sucursal y búsqueda
  useEffect(() => {
    const filtrados = productos.filter(
      (p) =>
        sucursalSeleccionada && // solo si hay sucursal seleccionada
        p.id_sucursal === Number(sucursalSeleccionada) &&
        (
          p.nombre?.toLowerCase().includes(buscar.toLowerCase()) ||
          p.categoria?.toLowerCase().includes(buscar.toLowerCase()) ||
          p.codigo?.toLowerCase().includes(buscar.toLowerCase())
        )
    );
    setProductosFiltrados(filtrados);
  }, [productos, sucursalSeleccionada, buscar]);


useEffect(() => {
  setProductosFiltrados(
    productos.filter((p) => {
      // No mostrar si no hay sucursal seleccionada
      if (!sucursalSeleccionada) return false;

      // Filtrar por sucursal
      if (p.id_sucursal !== Number(sucursalSeleccionada)) return false;

      // Convertir a string antes de comparar
      const nombre = p.nombre?.toString().toLowerCase() || '';
      const categoria = p.categoria?.toString().toLowerCase() || '';
      const codigo = p.codigo?.toString().toLowerCase() || '';

      // Filtrar por búsqueda
      return (
        nombre.includes(buscar.toLowerCase()) ||
        categoria.includes(buscar.toLowerCase()) ||
        codigo.includes(buscar.toLowerCase())
      );
    })
  );
}, [productos, buscar, sucursalSeleccionada]);



  // 🔹 Paginación
  const indexUltimo = paginaActual * productosPorPagina;
  const indexPrimero = indexUltimo - productosPorPagina;
  const productosPagina = productosFiltrados.slice(indexPrimero, indexUltimo);
  const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);

    // Calcular inversión total por sucursal
  useEffect(() => {
    const total = productosFiltrados.reduce((acc, p) => {
      return acc + Number(p.precio_compra) * Number(p.stock);
    }, 0);
    setInversionTotal(total);
  }, [productosFiltrados]);



 return (
  <div className="p-6 bg-gray-100 min-h-screen">
    <div className="bg-white shadow-xl rounded-2xl p-6 space-y-6">
      
      <h2 className="text-2xl font-semibold mb-4">Inventario</h2>


  {/* Combo de sucursal */}
  <div className="flex flex-col">
    <label className="text-gray-600 font-medium">Sucursal</label>
    <select
      value={sucursalSeleccionada}
      onChange={(e) => setSucursalSeleccionada(e.target.value)}
      className="border p-2 rounded w-48 focus:ring-2 focus:ring-blue-400"
    >
      <option value="">Selecciona sucursal</option>
      {sucursales.map((s) => (
        <option key={s.id_sucursal} value={s.id_sucursal}>
          {s.nombre}
        </option>
      ))}
    </select>
  </div>
                    {/* Encabezado */}
                        {!sucursalSeleccionada ? (
  <p className="text-gray-500 mt-4">
    Selecciona una sucursal para ver los productos.
  </p>
) : (
  <>
                    <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-col">
                <label className="text-gray-600 font-medium">Total Inversión</label>
                <span className="text-xl font-semibold text-green-600">
                  {sucursalSeleccionada
                    ? `$${productosFiltrados
                        .reduce(
                          (total, p) => total + Number(p.precio_compra) * Number(p.stock),
                          0
                        )
                        .toLocaleString()}`
                    : "$0"}
                </span>
              </div>


        {/* 🔍 Búsqueda + botón */}
    
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Buscar producto..."
            className="border p-2 rounded focus:ring-2 focus:ring-blue-400"
            value={buscar}
            onChange={(e) => {
              setBuscar(e.target.value);
              setPaginaActual(1);
            }}
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
      
      </div>
  
      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full border divide-y divide-gray-200 mt-4">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2">N°</th>
              <th className="p-2">Código</th>
              <th className="p-2">Imagen</th>
              <th className="p-2">Nombre</th>
              <th className="p-2">Categoría</th>
              <th className="p-2">Precio Compra</th>
              <th className="p-2">Precio Venta</th>
              <th className="p-2">Ganancias</th>
              <th className="p-2">Stock</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {productosPagina.length > 0 ? (
              productosPagina.map((p, index) => (
                <tr key={p.id_producto}>
                  <td className="p-2">
                    {(paginaActual - 1) * productosPorPagina + index + 1}
                  </td>
                  <td className="p-2">{p.codigo}</td>
                  <td className="p-2">
                    {p.imagen ? (
                      <img
                        src={`http://localhost:3001/uploads/${p.imagen}`}
                        alt={p.nombre}
                        onError={(e) =>
                          (e.target.src = "https://via.placeholder.com/50")
                        }
                        className="w-16 h-16 object-cover rounded cursor-pointer hover:scale-110 transition-transform"
                        onClick={() =>
                          setImagenGrande(
                            `http://localhost:3001/uploads/${p.imagen}`
                          )
                        }
                      />
                    ) : (
                      "Sin imagen"
                    )}
                  </td>
                  <td className="p-2">{p.nombre}</td>
                  <td className="p-2">{p.categoria}</td>
                  <td className="p-2">${p.precio_compra}</td>
                  <td className="p-2">${p.precio_venta}</td>
                  <td className="p-2">${p.precio_venta - p.precio_compra}</td>
                  <td className="p-2">{p.stock}</td>
                  <td className="p-2 flex gap-2">
                      <button
                      className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 transition"
                      onClick={() => handleEditarProducto(p)}
                    >
                      Editar
                    </button>

                    <button
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                      onClick={() => handleEliminarProducto(p.id_producto)}
                    >
                      Eliminar
                    </button>
                    <button
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                      onClick={() => abrirModalVariantesProducto(p.id_producto)}
                    >
                      Variantes
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center py-4 text-gray-500">
                  No se encontraron productos
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Paginación */}
        {totalPaginas > 1 && (
          <div className="flex justify-center mt-4 space-x-2">
            {Array.from({ length: totalPaginas }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setPaginaActual(i + 1)}
                className={`px-3 py-1 rounded ${
                  paginaActual === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
      </>
)}
    </div>
  
    {/* Imagen ampliada */}
    {imagenGrande && (
      <div
        className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
        onClick={() => setImagenGrande(null)}
      >
        <img
          src={imagenGrande}
          alt="Vista ampliada"
          className="max-w-3xl max-h-[80vh] rounded-2xl shadow-2xl border-4 border-white transition-transform duration-300 scale-100 hover:scale-105"
        />
      </div>
    )}

    {/* 🧩 Modal de producto */}
    {mostrarModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-lg relative">
          <button
            onClick={() => {
              limpiarCampos();
              setMostrarModal(false);
            }}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl font-bold"
          >
            &times;
          </button>

          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
            {nuevoProducto.id_producto ? "Editar Producto" : "Agregar Producto"}
          </h2>

          <div className="flex flex-col space-y-4">
            <input
              type="text"
              placeholder="Nombre del producto"
              value={nuevoProducto.nombre}
              onChange={(e) =>
                setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })
              }
              className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-purple-400"
            />

            {/* Categoría */}
            <div>
              <label className="block text-gray-600 text-sm mb-1">
                Categoría
              </label>
              <select
                value={nuevoProducto.categoria || ""}
                onChange={(e) =>
                  setNuevoProducto({
                    ...nuevoProducto,
                    categoria: e.target.value,
                  })
                }
                className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-purple-400"
              >
                <option value="">Selecciona una categoría</option>
                {categorias.map((c) => (
                  <option key={c.id_categoria} value={c.id_categoria}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Género */}
            <div>
              <label className="block text-gray-600 text-sm mb-1">Género</label>
              <select
                value={nuevoProducto.genero || ""}
                onChange={(e) =>
                  setNuevoProducto({
                    ...nuevoProducto,
                    genero: e.target.value,
                  })
                }
                className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-purple-400"
              >
                <option value="">Selecciona un género</option>
                {generos.map((g) => (
                  <option key={g.id_genero} value={g.id_genero}>
                    {g.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* 🔸 Botón para abrir modal variantes */}
            {["ropa", "calzado"].includes(
              categorias
                .find((c) => c.id_categoria == nuevoProducto.categoria)
                ?.nombre?.toLowerCase() || ""
            ) && (
              <button
                type="button"
                onClick={() => setMostrarModalVariante(true)}
                className="mt-2 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition"
              >
                Agregar Variantes
              </button>
            )}

            {/* Stock */}
            <div>
              <label className="block text-gray-600 text-sm mb-1">
                Stock disponible
              </label>
              <input
                type="number"
                placeholder="Cantidad en existencia"
                value={nuevoProducto.stock}
                onChange={(e) =>
                  setNuevoProducto({
                    ...nuevoProducto,
                    stock: e.target.value,
                  })
                }
                className="border p-2 rounded w-full focus:ring-2 focus:ring-purple-400"
              />
            </div>

            {/* Precios */}
            <div className="flex gap-4">
              <input
                type="number"
                placeholder="Precio compra"
                value={nuevoProducto.precio_compra}
                onChange={(e) =>
                  setNuevoProducto({
                    ...nuevoProducto,
                    precio_compra: e.target.value,
                  })
                }
                className="border p-2 rounded w-1/2 focus:ring-2 focus:ring-purple-400"
              />
              <input
                type="number"
                placeholder="Precio venta"
                value={nuevoProducto.precio_venta}
                onChange={(e) =>
                  setNuevoProducto({
                    ...nuevoProducto,
                    precio_venta: e.target.value,
                  })
                }
                className="border p-2 rounded w-1/2 focus:ring-2 focus:ring-purple-400"
              />
            </div>

            {/* Imagen */}
            <div>
              <label className="block text-gray-600 text-sm mb-1">Imagen</label>
              <input
                type="file"
                className="border p-2 rounded w-full"
                onChange={(e) =>
                  setNuevoProducto({
                    ...nuevoProducto,
                    imagen: e.target.files[0],
                  })
                }
              />
            </div>

            {/* Guardar */}
            <button
              onClick={handleAgregarProducto}
              className="mt-4 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
            >
              {nuevoProducto.id_producto
                ? "Actualizar producto"
                : "Guardar producto"}
            </button>
          </div>
        </div>
      </div>
    )}

    {/* 🧩 Modal Variantes */}
    {mostrarModalVariante && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white w-full max-w-lg p-6 rounded-2xl shadow-lg relative">
          <button
            onClick={() => setMostrarModalVariante(false)}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl font-bold"
          >
            &times;
          </button>

          <h2 className="text-2xl font-semibold text-center text-blue-700 mb-4">
            Variantes del Producto
          </h2>

          <div className="grid grid-cols-3 gap-2 mb-3">
            <input
              type="text"
              placeholder="Modelo"
              value={nuevaVariante.modelo}
              onChange={(e) =>
                setNuevaVariante({ ...nuevaVariante, modelo: e.target.value })
              }
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Color"
              value={nuevaVariante.color}
              onChange={(e) =>
                setNuevaVariante({ ...nuevaVariante, color: e.target.value })
              }
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Talla"
              value={nuevaVariante.talla}
              onChange={(e) =>
                setNuevaVariante({ ...nuevaVariante, talla: e.target.value })
              }
              className="border p-2 rounded"
            />
          </div>

          <button
            onClick={() => {
              if (
                nuevaVariante.modelo &&
                nuevaVariante.color &&
                nuevaVariante.talla
              ) {
                setVariantes([...variantes, nuevaVariante]);
                setNuevaVariante({ modelo: "", color: "", talla: "" });
              } else {
                alert("⚠️ Completa todos los campos de la variante");
              }
            }}
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
          >
            Agregar Variante
          </button>

          {/* Tabla de variantes */}
          {variantes.length > 0 && (
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full border border-gray-200 rounded-lg text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-left">#</th>
                    <th className="p-2 text-left">Modelo</th>
                    <th className="p-2 text-left">Color</th>
                    <th className="p-2 text-left">Talla</th>
                    <th className="p-2 text-center">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {variantes.map((v, index) => (
                    <tr key={index} className="border-t">
                      <td className="p-2">{index + 1}</td>
                      <td className="p-2">{v.modelo}</td>
                      <td className="p-2">{v.color}</td>
                      <td className="p-2">{v.talla}</td>
                      <td className="p-2 text-center">
                        <button
                          onClick={() =>
                            setVariantes(variantes.filter((_, i) => i !== index))
                          }
                          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex justify-end mt-6">
            <button
              onClick={() => setMostrarModalVariante(false)}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    )}

    {/* 🧩 Modal variantes del producto (solo lectura) */}
    {mostrarModalVariantesProducto && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white w-full max-w-2xl p-6 rounded-2xl shadow-lg relative">
          <button
            onClick={() => setMostrarModalVariantesProducto(false)}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl font-bold"
          >
            &times;
          </button>

          <h3 className="text-2xl font-semibold mb-6 text-center text-blue-700">
            Variantes del producto
          </h3>

          {variantes.length === 0 ? (
            <p className="text-gray-500 text-center">
              No hay variantes para este producto.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 rounded-lg">
                <thead>
                  <tr className="bg-blue-100 text-blue-800">
                    <th className="py-2 px-4 text-left">#</th>
                    <th className="py-2 px-4 text-left">Modelo</th>
                    <th className="py-2 px-4 text-left">Color</th>
                    <th className="py-2 px-4 text-left">Talla</th>
                  </tr>
                </thead>
                <tbody>
                  {variantes.map((v, index) => (
                    <tr
                      key={index}
                      className={`${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } hover:bg-blue-50 transition`}
                    >
                      <td className="py-2 px-4 font-medium text-gray-700">
                        {index + 1}
                      </td>
                      <td className="py-2 px-4 text-gray-800">{v.modelo}</td>
                      <td className="py-2 px-4 text-gray-800">{v.color}</td>
                      <td className="py-2 px-4 text-gray-800">{v.talla}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex justify-end mt-6">
            <button
              onClick={() => setMostrarModalVariantesProducto(false)}
              className="bg-gray-200 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-300 transition font-medium"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);
}

export default Inventario;