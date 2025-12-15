import { useState } from "react";
import axios from "axios";

export default function AgregarProducto() {
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("");
  const [genero, setGenero] = useState("");
  const [tipo, setTipo] = useState("");
  const [precioVenta, setPrecioVenta] = useState("");
  const [stock, setStock] = useState("");
  const [imagen, setImagen] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("id_categoria", categoria);
    formData.append("id_genero", genero);
    formData.append("id_tipo", tipo);
    formData.append("precio_venta", precioVenta);
    formData.append("stock", stock);
    if (imagen) formData.append("imagen", imagen);

    try {
      const res = await axios.post(
        "http://localhost:3001/api/productos/agregar",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      alert("Producto agregado con éxito: ID " + res.data.id_producto);

      // Limpiar formulario
      setNombre("");
      setCategoria("");
      setGenero("");
      setTipo("");
      setPrecioVenta("");
      setStock("");
      setImagen(null);
    } catch (err) {
      console.error(err);
      alert("Error al agregar producto");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-xl">
        <h2 className="text-2xl font-semibold mb-6 text-center">Agregar Producto</h2>

        <form
          className="bg-white p-6 rounded-2xl shadow-sm"
          encType="multipart/form-data"
          onSubmit={handleSubmit}
        >
          {/* Nombre del producto */}
          <div className="mb-4">
            <label className="block font-medium mb-1">Nombre del producto</label>
            <input
              type="text"
              placeholder="Ej: Camisa azul"
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>

          {/* Categoría */}
          <div className="mb-4">
            <label className="block font-medium mb-1">Categoría</label>
            <select
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              required
            >
              <option value="">Selecciona una categoría</option>
              <option value="1">Ropa</option>
              <option value="2">Calzado</option>
              <option value="3">Accesorios</option>
            </select>
          </div>

          {/* Género */}
          <div className="mb-4">
            <label className="block font-medium mb-1">Género</label>
            <select
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400"
              value={genero}
              onChange={(e) => setGenero(e.target.value)}
            >
              <option value="">Selecciona un género</option>
              <option value="1">Caballero</option>
              <option value="2">Dama</option>
              <option value="3">Niño/Niña</option>
            </select>
          </div>

          {/* Tipo */}
          <div className="mb-4">
            <label className="block font-medium mb-1">Tipo de producto</label>
            <select
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
            >
              <option value="">Selecciona un tipo</option>
              <option value="1">Camisa</option>
              <option value="2">Pantalón</option>
              <option value="3">Zapato</option>
            </select>
          </div>

          {/* Precio */}
          <div className="mb-4">
            <label className="block font-medium mb-1">Precio de venta</label>
            <input
              type="number"
              placeholder="Ej: 350"
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400"
              value={precioVenta}
              onChange={(e) => setPrecioVenta(e.target.value)}
              required
            />
          </div>

          {/* Cantidad en stock */}
          <div className="mb-4">
            <label className="block font-medium mb-1">Cantidad en stock</label>
            <input
              type="number"
              placeholder="Ej: 50"
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
            />
          </div>

          {/* Imagen */}
          <div className="mb-4">
            <label className="block font-medium mb-1">Imagen del producto</label>
            <input
              type="file"
              accept="image/*"
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400"
              onChange={(e) => setImagen(e.target.files[0])}
            />
          </div>

          {/* Botones */}
          <div className="flex gap-4 mt-6 justify-center">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Agregar Producto
            </button>
            <button
              type="reset"
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition"
              onClick={() => {
                setNombre("");
                setCategoria("");
                setGenero("");
                setTipo("");
                setPrecioVenta("");
                setStock("");
                setImagen(null);
              }}
            >
              Limpiar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
