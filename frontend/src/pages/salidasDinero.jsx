import { useState, useEffect } from "react";
import axios from "axios";

export default function SalidasDinero() {
  const [salidas, setSalidas] = useState([]);
  const [concepto, setConcepto] = useState("");
  const [monto, setMonto] = useState("");
  const [categoria, setCategoria] = useState("");
  const [metodoPago, setMetodoPago] = useState("efectivo");
  const [observaciones, setObservaciones] = useState("");

  useEffect(() => {
    axios.get("http://localhost:3001/api/salidas_dinero")
      .then(res => setSalidas(res.data))
      .catch(err => console.error(err));
  }, []);

  const agregarSalida = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3001/api/salidas_dinero/agregar", {
        concepto, monto, categoria, metodo_pago: metodoPago, observaciones
      });
      alert("Salida registrada correctamente");
      setSalidas([...salidas, { concepto, monto, categoria, metodo_pago: metodoPago, observaciones, fecha: new Date() }]);
      setConcepto(""); setMonto(""); setCategoria(""); setObservaciones("");
    } catch (err) {
      console.error(err);
      alert("Error al guardar salida");
    }
  };

  const eliminarSalida = async (id) => {
    if (!window.confirm("¿Eliminar esta salida?")) return;
    try {
      await axios.delete(`http://localhost:3001/api/salidas_dinero/${id}`);
      setSalidas(salidas.filter(s => s.id_salida !== id));
    } catch (err) {
      console.error(err);
      alert("Error al eliminar salida");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold mb-4 text-center">💸 Salidas de dinero</h2>

      {/* Formulario */}
      <form onSubmit={agregarSalida} className="grid md:grid-cols-2 gap-4 bg-white p-4 rounded-lg shadow">
        <input type="text" placeholder="Concepto" value={concepto} onChange={(e) => setConcepto(e.target.value)} className="border p-2 rounded" required />
        <input type="number" placeholder="Monto" value={monto} onChange={(e) => setMonto(e.target.value)} className="border p-2 rounded" required />
        <input type="text" placeholder="Categoría (Ej: Proveedor, Renta...)" value={categoria} onChange={(e) => setCategoria(e.target.value)} className="border p-2 rounded" />
        <select value={metodoPago} onChange={(e) => setMetodoPago(e.target.value)} className="border p-2 rounded">
          <option value="efectivo">Efectivo</option>
          <option value="transferencia">Transferencia</option>
          <option value="tarjeta">Tarjeta</option>
        </select>
        <textarea placeholder="Observaciones" value={observaciones} onChange={(e) => setObservaciones(e.target.value)} className="border p-2 rounded md:col-span-2" />
        <button type="submit" className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 md:col-span-2">Registrar salida</button>
      </form>

      {/* Tabla */}
      <div className="overflow-x-auto bg-white p-4 rounded-lg shadow">
        <table className="min-w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1">Fecha</th>
              <th className="border px-2 py-1">Concepto</th>
              <th className="border px-2 py-1">Monto</th>
              <th className="border px-2 py-1">Categoría</th>
              <th className="border px-2 py-1">Método</th>
              <th className="border px-2 py-1">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {salidas.length === 0 ? (
              <tr><td colSpan="6" className="text-center p-4">No hay salidas registradas</td></tr>
            ) : (
              salidas.map((s) => (
                <tr key={s.id_salida || s.concepto + s.monto}>
                  <td className="border px-2 py-1">{new Date(s.fecha).toLocaleDateString()}</td>
                  <td className="border px-2 py-1">{s.concepto}</td>
                  <td className="border px-2 py-1">${s.monto}</td>
                  <td className="border px-2 py-1">{s.categoria}</td>
                  <td className="border px-2 py-1 capitalize">{s.metodo_pago}</td>
                  <td className="border px-2 py-1 text-center">
                    <button onClick={() => eliminarSalida(s.id_salida)} className="text-red-500 hover:underline">Eliminar</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
