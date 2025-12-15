import { useState } from "react";
import Card from "../components/card.jsx";
import DashboardHeader from "../components/dashboardHeader.jsx";
import { TrendingUp, ShoppingCart, Package, AlertCircle } from "lucide-react";

export default function Dashboard() {
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);
  const productosPorPagina = 10; // Cambia este valor según quieras mostrar más o menos productos por página

  // Datos de ejemplo
  const productos = [
    { id_producto: 1, codigo: "PRD001", nombre: "Camisa azul", precio_venta: 350, precio_compra: 200, stock: 2, sucursal: "Centro", activo: "S", imagen: "https://via.placeholder.com/40" },
    { id_producto: 2, codigo: "PRD002", nombre: "Zapatos negros", precio_venta: 800, precio_compra: 500, stock: 1, sucursal: "Norte", activo: "S", imagen: "https://via.placeholder.com/40" },
    { id_producto: 3, codigo: "PRD003", nombre: "Sombrero gris", precio_venta: 220, precio_compra: 120, stock: 3, sucursal: "Centro", activo: "S", imagen: "https://via.placeholder.com/40" },
    { id_producto: 4, codigo: "PRD004", nombre: "Pantalón negro", precio_venta: 500, precio_compra: 300, stock: 4, sucursal: "Sur", activo: "S", imagen: "https://via.placeholder.com/40" },
    { id_producto: 5, codigo: "PRD005", nombre: "Chaqueta roja", precio_venta: 650, precio_compra: 400, stock: 2, sucursal: "Centro", activo: "S", imagen: "https://via.placeholder.com/40" },
  ];

  // Filtrar productos según búsqueda
  const productosFiltrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.codigo.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Calcular los productos que se mostrarán en la página actual
  const indexUltimoProducto = pagina * productosPorPagina;
  const indexPrimerProducto = indexUltimoProducto - productosPorPagina;
  const productosPagina = productosFiltrados.slice(indexPrimerProducto, indexUltimoProducto);

  const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);

  return (
    <div className="space-y-6 p-6">
      <DashboardHeader sucursal="Sucursal Centro" />
      <h2 className="text-2xl font-semibold mb-4">Panel de Ventas</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card title="Ganancias" value="$12,340" icon={<TrendingUp size={24} />} />
        <Card title="Stock total" value="327 unidades" icon={<Package size={24} />} />
        <Card title="Caja disponible" value="$5,000" icon={<ShoppingCart size={24} />} />
        <Card title="Deudas pendientes" value="$1,200" icon={<AlertCircle size={24} />} />
      </div>

      {/* Tabla de inventario con paginación */}
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <h3 className="text-lg font-semibold mb-2">Inventario de productos</h3>

        <input
          type="text"
          placeholder="Buscar producto por nombre o código..."
          className="mb-4 w-full border p-2 rounded focus:ring-2 focus:ring-blue-400"
          value={busqueda}
          onChange={(e) => { setBusqueda(e.target.value); setPagina(1); }} // reinicia a la página 1 al buscar
        />

        <table className="min-w-full border divide-y divide-gray-200">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2">Código</th>
              <th className="p-2">Imagen</th>
              <th className="p-2">Nombre</th>
              <th className="p-2">Precio venta</th>
              <th className="p-2">Costo</th>
              <th className="p-2">Stock</th>
              <th className="p-2">Sucursal</th>
              <th className="p-2">Activo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {productosPagina.map((p) => (
              <tr key={p.id_producto}>
                <td className="p-2">{p.codigo}</td>
                <td className="p-2">
                  <img src={p.imagen} alt={p.nombre} className="w-12 h-12 object-cover rounded" />
                </td>
                <td className="p-2">{p.nombre}</td>
                <td className="p-2">${p.precio_venta}</td>
                <td className="p-2">${p.precio_compra}</td>
                <td className="p-2">{p.stock}</td>
                <td className="p-2">{p.sucursal}</td>
                <td className="p-2">{p.activo}</td>
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
              className={`px-3 py-1 rounded ${pagina === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
