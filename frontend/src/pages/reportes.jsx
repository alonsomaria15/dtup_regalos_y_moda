// Reportes.jsx
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

export default function Reportes() {
  const [mes, setMes] = useState(new Date().getMonth());
  const [año, setAño] = useState(new Date().getFullYear());
  const [gananciaMes, setGananciaMes] = useState(12000);
  const [detalle, setDetalle] = useState([
    { cliente: "Juan Pérez", venta: 5000, abono: 2000 },
    { cliente: "María López", venta: 7000, abono: 3000 },
  ]);

  const meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  const ventasPorMes = [
    { mes: "Enero", ventas: 5000 },
    { mes: "Febrero", ventas: 8000 },
    { mes: "Marzo", ventas: 12000 },
    { mes: "Abril", ventas: 9000 },
    { mes: "Mayo", ventas: 15000 },
    { mes: "Junio", ventas: 7000 },
  ];

  const productosMasVendidos = [
    { producto: "Producto A", cantidad: 120 },
    { producto: "Producto B", cantidad: 90 },
    { producto: "Producto C", cantidad: 60 },
    { producto: "Producto D", cantidad: 150 },
  ];

  const handleBuscar = () => {
    setGananciaMes(Math.floor(Math.random() * 20000));
    setDetalle([
      { cliente: "Juan Pérez", venta: Math.floor(Math.random()*10000), abono: Math.floor(Math.random()*5000) },
      { cliente: "María López", venta: Math.floor(Math.random()*10000), abono: Math.floor(Math.random()*5000) },
    ]);
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Reportes</h2>

      {/* Filtros y exportaciones */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-2 mb-4">
        <div className="flex gap-2">
          <select value={mes} onChange={(e) => setMes(Number(e.target.value))} className="border rounded px-3 py-2">
            {meses.map((m, i) => <option key={i} value={i}>{m}</option>)}
          </select>
          <input type="number" value={año} onChange={(e) => setAño(Number(e.target.value))} className="border rounded px-3 py-2 w-24" />
          <button onClick={handleBuscar} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Buscar</button>
        </div>
        <div className="flex gap-2">
          <button className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900">PDF</button>
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Excel</button>
        </div>
      </div>

      {/* Ganancia mes */}
      <div className="bg-green-100 p-4 rounded-lg shadow-sm text-center">
        <p className="text-lg font-semibold">
          Ganancia total de {meses[mes]} {año}: <span className="text-green-700">${gananciaMes}</span>
        </p>
      </div>

      {/* Ventas por mes */}
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-center">Ventas por Mes</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={ventasPorMes}>
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="ventas" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Productos más vendidos */}
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-center">Productos más vendidos</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={productosMasVendidos} dataKey="cantidad" nameKey="producto" cx="50%" cy="50%" outerRadius={80} label>
              {productosMasVendidos.map((entry, index) => (
                <Cell key={index} fill={["#3b82f6","#10b981","#f59e0b","#ef4444"][index % 4]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Detalle clientes */}
      <div className="bg-white p-6 rounded-2xl shadow-sm overflow-auto">
        <h3 className="text-lg font-semibold mb-2 text-center">Detalle de clientes</h3>
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Cliente</th>
              <th className="p-2 border">Venta</th>
              <th className="p-2 border">Abono</th>
              <th className="p-2 border">Saldo</th>
            </tr>
          </thead>
          <tbody>
            {detalle.map((d, i) => (
              <tr key={i} className="border-t">
                <td className="p-2">{d.cliente}</td>
                <td className="p-2">${d.venta}</td>
                <td className="p-2">${d.abono}</td>
                <td className="p-2 text-red-600">${d.venta - d.abono}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
