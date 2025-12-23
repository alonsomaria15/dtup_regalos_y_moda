import { useState, useEffect } from "react";
import axios from "axios";

export default function Abonos() {
  const [ventas, setVentas] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [ventasCliente, setVentasCliente] = useState([]);
  const [abonos, setAbonos] = useState([]);
  const [ventaParaAbonar, setVentaParaAbonar] = useState("");
  const [monto, setMonto] = useState("");
  const [metodoPago, setMetodoPago] = useState("efectivo");
  const [observaciones, setObservaciones] = useState("");

  // 🔹 Obtener ventas
  useEffect(() => {
    const fetchVentas = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/ventas");
        setVentas(res.data);
      } catch (err) {
        console.error("❌ Error al obtener ventas:", err);
      }
    };
    fetchVentas();
  }, []);

  // 🔹 Obtener abonos por venta
  const fetchAbonos = async (id_venta) => {
    try {
      const res = await axios.get(`http://localhost:3001/api/abonos/${id_venta}`);
      return res.data;
    } catch (err) {
      console.error("❌ Error al obtener abonos:", err);
      return [];
    }
  };

  // 🔹 Seleccionar cliente
  const handleSelectCliente = async (nombreCliente) => {
    setClienteSeleccionado(nombreCliente);
    const ventasDelCliente = ventas.filter(v => v.cliente_nombre === nombreCliente);
    setVentasCliente(ventasDelCliente);

    // Obtener todos los abonos de sus ventas
    let abonosTotales = [];
    for (let venta of ventasDelCliente) {
      const abonosVenta = await fetchAbonos(venta.id_venta);
      abonosTotales = [...abonosTotales, ...abonosVenta.map(a => ({ ...a, id_venta: venta.id_venta }))];
    }
    setAbonos(abonosTotales);
    setVentaParaAbonar(""); // Resetear venta seleccionada para abono
  };

  // 🔹 Registrar nuevo abono
  const handleAbonar = async () => {
    if (!ventaParaAbonar || !monto) {
      alert("Selecciona una venta y el monto del abono");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3001/api/abonos/agregar", {
        id_venta: parseInt(ventaParaAbonar),
        monto,
        metodo_pago: metodoPago,
        observaciones,
      });

      alert(res.data.mensaje || "Abono registrado correctamente");
      setMonto("");
      setObservaciones("");

      // Actualizar abonos
      const abonosVenta = await fetchAbonos(parseInt(ventaParaAbonar));
      setAbonos(prev => [
        ...prev.filter(a => a.id_venta !== parseInt(ventaParaAbonar)),
        ...abonosVenta.map(a => ({ ...a, id_venta: parseInt(ventaParaAbonar) }))
      ]);
    } catch (err) {
      console.error("❌ Error al agregar abono:", err);
      alert("Error al registrar el abono");
    }
  };

  // 🔹 Calcular totales por venta
  const calcularTotalAbonado = (id_venta) =>
    abonos
      .filter(a => a.id_venta === id_venta)
      .reduce((sum, a) => sum + parseFloat(a.monto), 0);

  const calcularPendiente = (venta) =>
    venta.total_final - calcularTotalAbonado(venta.id_venta);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">💰 Abonos de Ventas</h1>

      {/* Selección de cliente */}
      <select
        value={clienteSeleccionado || ""}
        onChange={(e) => handleSelectCliente(e.target.value)}
        className="border p-2 mb-4"
      >
        <option value="">Selecciona un cliente</option>
        {[...new Set(ventas.map(v => v.cliente_nombre))].map((nombre, i) => (
          <option key={i} value={nombre}>
            {nombre}
          </option>
        ))}
      </select>

      {/* Tabla de ventas del cliente */}
      {clienteSeleccionado && ventasCliente.length > 0 && (
        <>
          <h2 className="font-semibold mb-2">Ventas de {clienteSeleccionado}</h2>

          <table className="border w-full mb-4">
            <thead>
              <tr>
                <th className="border p-2">Venta</th>
                <th className="border p-2">Total</th>
                <th className="border p-2">Abonado</th>
                <th className="border p-2">Pendiente</th>
                <th className="border p-2">Abonos</th>
                <th className="border p-2">Saldo</th>
              </tr>
            </thead>
            <tbody>
              {ventasCliente.map(venta => {
                const totalAbonado = calcularTotalAbonado(venta.id_venta);
                const pendiente = calcularPendiente(venta);
                const estadoPago = pendiente <= 0 ? "PAGADO ✅" : "PENDIENTE ⏳";
                const abonosVenta = abonos.filter(a => a.id_venta === venta.id_venta);

                return (
                  <tr key={venta.id_venta}>
                    <td className="border p-2 text-center">#{venta.id_venta}</td>
                    <td className="border p-2 text-center">${venta.total_final}</td>
                    <td className="border p-2 text-center">${totalAbonado}</td>
                    <td className="border p-2 text-center">${pendiente > 0 ? pendiente : 0}</td>
                    <td className="border p-2">
                      {abonosVenta.length > 0 ? (
                        <ul className="list-disc ml-4">
                          {abonosVenta.map((a, i) => (
                            <li key={i}>
                              {new Date(a.fecha).toLocaleDateString("es-MX")} — ${a.monto} ({a.metodo_pago})
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-gray-500">Sin abonos</span>
                      )}
                    </td>
                    <td className={`border p-2 font-semibold text-center ${estadoPago.includes("PAGADO") ? "text-green-600" : "text-red-600"}`}>
                      {estadoPago}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Formulario para agregar abono */}
          <div className="flex flex-col gap-2 max-w-md mt-4">
            <select
              value={ventaParaAbonar}
              onChange={(e) => setVentaParaAbonar(e.target.value)}
              className="border p-2"
            >
              <option value="">Selecciona la venta para abonar</option>
              {ventasCliente.map(v => (
                <option key={v.id_venta} value={v.id_venta}>
                  #{v.id_venta} - ${v.total_final} (Pendiente: ${calcularPendiente(v)})
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Monto"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              className="border p-2"
            />

            <select
              value={metodoPago}
              onChange={(e) => setMetodoPago(e.target.value)}
              className="border p-2"
            >
              <option value="efectivo">Efectivo</option>
              <option value="transferencia">Transferencia</option>
              <option value="tarjeta">Tarjeta</option>
            </select>

            <textarea
              placeholder="Observaciones (opcional)"
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              className="border p-2"
            />

            <button
              onClick={handleAbonar}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Agregar Abono
            </button>
          </div>
        </>
      )}
    </div>
  );
}
