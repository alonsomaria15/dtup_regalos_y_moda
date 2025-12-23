import { useState, useEffect } from "react";
import axios from "axios";

export default function AgregarProducto() {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precioCompra, setPrecioCompra] = useState("");
  const [precioVenta, setPrecioVenta] = useState("");
  const [imagen, setImagen] = useState(null);

  const [categorias, setCategorias] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [generos, setGeneros] = useState([]);
  const [variantes, setVariantes] = useState([]);

  const [categoria, setCategoria] = useState("");
  const [tipo, setTipo] = useState("");
  const [genero, setGenero] = useState("");

  // Modal variante
  const [modalVisible, setModalVisible] = useState(false);
  const [varianteModelo, setVarianteModelo] = useState("");
  const [varianteColor, setVarianteColor] = useState("");
  const [varianteTalla, setVarianteTalla] = useState("");
  const [variantePrecio, setVariantePrecio] = useState("");

  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarTablaProductos, setMostrarTablaProductos] = useState(true);

  const [editando, setEditando] = useState(false);
  const [idProducto, setIdProducto] = useState(null);

  // Inicialización
  useEffect(() => {
    setMostrarModal(false);
    setMostrarTablaProductos(true);
  }, []);

  const abrirModal = () => {
    setMostrarModal(true);
    setMostrarTablaProductos(false);
  };

  // Cargar categorías
  useEffect(() => {
    axios
      .get("http://localhost:3001/api/categorias")
      .then((res) => setCategorias(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Cargar géneros
  useEffect(() => {
    axios
      .get("http://localhost:3001/api/genero")
      .then((res) => setGeneros(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Cargar tipos según categoría
  useEffect(() => {
    if (!categoria) {
      setTipos([]); // limpiar tipos si no hay categoría
      setTipo(""); // resetear tipo seleccionado
      return;
    }
    axios
      .get(`http://localhost:3001/api/tipos?id_categoria=${categoria}`)
      .then((res) => {
        setTipos(res.data);
        setTipo(""); // resetear tipo al cambiar categoría
      })
      .catch((err) => {
        console.error("Error al obtener tipos:", err);
        setTipos([]);
      });
  }, [categoria]);

  // Agregar variante
  const agregarVariante = () => {
    if (!varianteModelo || !varianteColor || !varianteTalla || !variantePrecio) {
      alert("Completa todos los campos de la variante");
      return;
    }
    setVariantes([
      ...variantes,
      {
        modelo: varianteModelo,
        color: varianteColor,
        talla: varianteTalla,
        precio: variantePrecio,
      },
    ]);
    setVarianteModelo("");
    setVarianteColor("");
    setVarianteTalla("");
    setVariantePrecio("");
    setModalVisible(false);
  };

  const eliminarVariante = (index) => {
    const nuevas = [...variantes];
    nuevas.splice(index, 1);
    setVariantes(nuevas);
  };

  // Enviar formulario (Agregar o Editar)
  const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("nombre", nombre);
  formData.append("precio_venta", precioVenta);
  formData.append("precio_compra", precioCompra);
  formData.append("id_categoria", categoria);
  formData.append("id_tipo", tipo);
  if (genero) formData.append("id_genero", genero);
  if (imagen) formData.append("imagen", imagen);

  try {
    await axios.post("http://localhost:3001/api/productos/agregar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    alert("Producto agregado correctamente");
  } catch (error) {
    console.error(error.response?.data || error);
    alert("Error al guardar producto");
  }
};


  // Cargar producto para editar
  const editarProducto = (producto) => {
    setIdProducto(producto.id_producto);
    setNombre(producto.nombre);
    setDescripcion(producto.descripcion);
    setCategoria(producto.id_categoria);
    setTipo(producto.id_tipo);
    setGenero(producto.id_genero || "");
    setPrecioCompra(producto.precio_compra);
    setPrecioVenta(producto.precio_venta);
    setEditando(true);
    setMostrarModal(true);
    setMostrarTablaProductos(false);
  };

  return (
    <>
      {/* Formulario */}
      {mostrarModal && (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
          <div className="w-full max-w-xl bg-white p-6 rounded-2xl shadow-sm">
            <h2 className="text-2xl font-semibold mb-6 text-center">
              {editando ? "Editar Producto" : "Agregar Producto"}
            </h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              {/* Nombre */}
              <div className="mb-4">
                <label className="block font-medium mb-1">Nombre</label>
                <input
                  type="text"
                  className="w-full border p-2 rounded"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </div>

              {/* Descripción */}
              <div className="mb-4">
                <label className="block font-medium mb-1">Descripción</label>
                <textarea
                  className="w-full border p-2 rounded"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                />
              </div>

              {/* Categoría */}
              <div className="mb-4">
                <label className="block font-medium mb-1">Categoría</label>
                <select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="w-full border p-2 rounded"
                  required
                >
                  <option value="">Selecciona una categoría</option>
                  {categorias.map((cat) => (
                    <option key={cat.id_categoria} value={cat.id_categoria}>
                      {cat.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Género */}
              {categoria === "1" && (
                <div className="mb-4">
                  <label className="block font-medium mb-1">Género</label>
                  <select
                    value={genero}
                    onChange={(e) => setGenero(e.target.value)}
                    className="w-full border p-2 rounded"
                  >
                    <option value="">Selecciona un género</option>
                    {generos.map((g) => (
                      <option key={g.id_genero} value={g.id_genero}>
                        {g.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Tipo */}
              <div className="mb-4">
                <label className="block font-medium mb-1">Tipo de producto</label>
                <select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  className="w-full border p-2 rounded"
                  required
                  disabled={!categoria}
                >
                  <option value="">
                    {categoria ? "Selecciona un tipo" : "Primero selecciona una categoría"}
                  </option>
                  {tipos.length > 0 ? (
                    tipos.map((t) => (
                      <option key={t.id_tipo} value={t.id_tipo}>
                        {t.nombre}
                      </option>
                    ))
                  ) : categoria ? (
                    <option value="">No hay tipos disponibles</option>
                  ) : null}
                </select>
              </div>

              {/* Variantes */}
              {(categoria === "1" || categoria === "2") && (
                <div className="mb-4">
                  <button
                    type="button"
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    onClick={() => setModalVisible(true)}
                  >
                    Agregar variantes
                  </button>
                  {variantes.length > 0 && (
                    <table className="mt-2 w-full border">
                      <thead>
                        <tr>
                          <th className="border px-2 py-1">Modelo</th>
                          <th className="border px-2 py-1">Color</th>
                          <th className="border px-2 py-1">Talla</th>
                          <th className="border px-2 py-1">Precio</th>
                          <th className="border px-2 py-1">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {variantes.map((v, i) => (
                          <tr key={i}>
                            <td className="border px-2 py-1">{v.modelo}</td>
                            <td className="border px-2 py-1">{v.color}</td>
                            <td className="border px-2 py-1">{v.talla}</td>
                            <td className="border px-2 py-1">${v.precio}</td>
                            <td className="border px-2 py-1">
                              <button
                                type="button"
                                className="text-red-500"
                                onClick={() => eliminarVariante(i)}
                              >
                                Eliminar
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {/* Precio compra */}
              <div className="mb-4">
                <label className="block font-medium mb-1">Precio de compra</label>
                <input
                  type="number"
                  className="w-full border p-2 rounded"
                  value={precioCompra}
                  onChange={(e) => setPrecioCompra(e.target.value)}
                  required
                />
              </div>

              {/* Precio venta */}
              <div className="mb-4">
                <label className="block font-medium mb-1">Precio de venta</label>
                <input
                  type="number"
                  className="w-full border p-2 rounded"
                  value={precioVenta}
                  onChange={(e) => setPrecioVenta(e.target.value)}
                  required
                />
              </div>

              {/* Imagen */}
              <div className="mb-6">
                <label className="block font-medium mb-1">Imagen</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImagen(e.target.files[0])}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                {editando ? "Actualizar producto" : "Guardar producto"}
              </button>
            </form>

            {/* Modal variantes */}
            {modalVisible && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
                  <h3 className="text-xl font-semibold mb-4">Agregar Variante</h3>
                  <div className="mb-2">
                    <input
                      type="text"
                      placeholder="Modelo"
                      className="w-full border p-2 rounded mb-2"
                      value={varianteModelo}
                      onChange={(e) => setVarianteModelo(e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Color"
                      className="w-full border p-2 rounded mb-2"
                      value={varianteColor}
                      onChange={(e) => setVarianteColor(e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Talla"
                      className="w-full border p-2 rounded mb-2"
                      value={varianteTalla}
                      onChange={(e) => setVarianteTalla(e.target.value)}
                    />
                    <input
                      type="number"
                      placeholder="Precio"
                      className="w-full border p-2 rounded"
                      value={variantePrecio}
                      onChange={(e) => setVariantePrecio(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      type="button"
                      className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                      onClick={() => setModalVisible(false)}
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                      onClick={agregarVariante}
                    >
                      Agregar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tabla */}
      {mostrarTablaProductos && (
        <TablaProductos abrirModal={abrirModal} editarProducto={editarProducto} editando={editando} />
      )}
    </>
  );
}

/* ===========================
   🧩 COMPONENTE: TablaProductos
=========================== */
const TablaProductos = ({ abrirModal, editarProducto, editando }) => {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/productos")
      .then((res) => setProductos(res.data))
      .catch((err) => console.error(err));
  }, []);

  const productosFiltrados = productos.filter((p) => {
    const texto = busqueda.toLowerCase();
    const nombre = p.nombre?.toLowerCase() || "";
    const categoria = p.categoria?.toLowerCase() || "";
    return nombre.includes(texto) || categoria.includes(texto);
  });

  const eliminarProducto = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;
    try {
      await axios.delete(`http://localhost:3001/api/productos/${id}`);
      alert("Producto eliminado correctamente");
      setProductos(productos.filter((p) => p.id_producto !== id));
    } catch (error) {
      console.error(error);
      alert("Error al eliminar el producto");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        {editando ? "Editar Producto" : "Listado de Productos"}
      </h2>

      {/* Barra de búsqueda */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre o categoría..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full sm:w-64 border p-2 rounded focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="button"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          onClick={abrirModal}
        >
          + Agregar nuevo
        </button>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full border divide-y divide-gray-200">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2 border">Imagen</th>
              <th className="p-2 border">Código</th>
              <th className="p-2 border">Nombre</th>
              <th className="p-2 border">Categoría</th>
              <th className="p-2 border">Precio Compra</th>
              <th className="p-2 border">Precio Venta</th>
              <th className="p-2 border">Stock</th>
              <th className="p-2 border text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {productosFiltrados.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center p-4">
                  No hay productos que coincidan
                </td>
              </tr>
            ) : (
              productosFiltrados.map((p) => (
                <tr key={p.id_producto}>
                  <td className="p-2 border text-center">
                    {p.imagen ? (
                      <img
                        src={`http://localhost:3001/${p.imagen}`}
                        alt={p.nombre}
                        className="w-12 h-12 object-cover mx-auto"
                      />
                    ) : (
                      "Sin imagen"
                    )}
                  </td>
                  <td className="p-2 border">{p.codigo}</td>
                  <td className="p-2 border">{p.nombre}</td>
                  <td className="p-2 border">{p.categoria}</td>
                  <td className="p-2 border">{p.precio_compra}</td>
                  <td className="p-2 border">{p.precio_venta}</td>
                  <td className="p-2 border">{p.stock}</td>
                  <td className="p-2 flex justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => editarProducto(p)}
                      className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 transition"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        eliminarProducto(p.id_producto);
                      }}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
