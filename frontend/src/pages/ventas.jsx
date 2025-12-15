import { useState } from "react";

export default function RegistrarVentaProvisional() {
  const productosDisponibles = [
    { nombre: "Camisa azul", precio: 350 },
    { nombre: "Zapatos negros", precio: 800 },
    { nombre: "Sombrero gris", precio: 220 },
  ];

  const [producto, setProducto] = useState("");
  const [precio, setPrecio] = useState(0);
  const [descuento, setDescuento] = useState(0);
  const [cantidad, setCantidad] = useState(1);
  const [carrito, setCarrito] = useState([]);

  const handleProductoChange = (e) => {
    const valor = e.target.value;
    setProducto(valor);
    const prod = productosDisponibles.find(p => p.nombre === valor);
    if (prod) setPrecio(prod.precio);
    else setPrecio(0);
  };

  const agregarProducto = () => {
    if (!producto || precio <= 0 || cantidad <= 0) return;
    setCarrito([
      ...carrito,
      {
        producto,
        precio,
        descuento,
        cantidad,
        subtotal: (precio - descuento) * cantidad,
      },
    ]);
    setProducto(""); setPrecio(0); setDescuento(0); setCantidad(1);
  };

  const eliminarProducto = (index) => {
    const nuevoCarrito = [...carrito];
    nuevoCarrito.splice(index, 1);
    setCarrito(nuevoCarrito);
  };

  const totalFinal = carrito.reduce((sum, p) => sum + p.subtotal, 0);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-center">Registrar Venta</h2>

      {/* Inputs para agregar producto */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-4 items-end">
        <div>
          <label className="block font-medium mb-1">Producto</label>
          <input
            list="productos"
            placeholder="Nombre del producto"
            value={producto}
            onChange={handleProductoChange}
            className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-400"
          />
          <datalist id="productos">
            {productosDisponibles.map((p, i) => (
              <option key={i} value={p.nombre} />
            ))}
          </datalist>
        </div>

        <div>
          <label className="block font-medium mb-1">Precio</label>
          <input
            type="number"
            value={precio}
            onChange={(e)=>setPrecio(Number(e.target.value))}
            className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-400"
            disabled
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Descuento</label>
          <input
            type="number"
            placeholder="Ej: 30"
            value={descuento}
            onChange={(e)=>setDescuento(Number(e.target.value))}
            className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Cantidad</label>
          <input
            type="number"
            placeholder="Ej: 2"
            value={cantidad}
            onChange={(e)=>setCantidad(Number(e.target.value))}
            className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={agregarProducto}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Agregar
          </button>
        </div>
      </div>

      {/* Tabla provisional */}
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
              <tr key={i} className="border-t">
                <td className="p-2">{p.producto}</td>
                <td className="p-2">${p.precio}</td>
                <td className="p-2">${p.descuento}</td>
                <td className="p-2">{p.cantidad}</td>
                <td className="p-2 font-semibold">${p.subtotal}</td>
                <td className="p-2">
                  <button
                    onClick={()=>eliminarProducto(i)}
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

      {/* Total final */}
      <div className="flex justify-between items-center bg-gray-100 p-4 rounded">
        <p className="font-semibold text-lg">Total a pagar: ${totalFinal}</p>
        <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          Registrar Venta
        </button>
      </div>
    </div>
  );
}
