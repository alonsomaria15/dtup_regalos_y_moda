export default function AgregarProducto() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-xl">
        <h2 className="text-2xl font-semibold mb-6 text-center">Agregar Producto</h2>

        <form className="bg-white p-6 rounded-2xl shadow-sm" encType="multipart/form-data">
          {/* Nombre del producto */}
          <div className="mb-4">
            <label className="block font-medium mb-1">Nombre del producto</label>
            <input
              type="text"
              placeholder="Ej: Camisa azul"
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Categoría */}
          <div className="mb-4">
            <label className="block font-medium mb-1">Categoría</label>
            <select className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400">
              <option value="">Selecciona una categoría</option>
              <option value="1">Ropa</option>
              <option value="2">Calzado</option>
              <option value="3">Accesorios</option>
            </select>
          </div>

          {/* Género */}
          <div className="mb-4">
            <label className="block font-medium mb-1">Género</label>
            <select className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400">
              <option value="">Selecciona un género</option>
              <option value="1">Caballero</option>
              <option value="2">Dama</option>
              <option value="3">Niño/Niña</option>
            </select>
          </div>

          {/* Tipo */}
          <div className="mb-4">
            <label className="block font-medium mb-1">Tipo de producto</label>
            <select className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400">
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
            />
          </div>

          {/* Cantidad en stock */}
          <div className="mb-4">
            <label className="block font-medium mb-1">Cantidad en stock</label>
            <input
              type="number"
              placeholder="Ej: 50"
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Imagen */}
          <div className="mb-4">
            <label className="block font-medium mb-1">Imagen del producto</label>
            <input
              type="file"
              accept="image/*"
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400"
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
            >
              Limpiar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
