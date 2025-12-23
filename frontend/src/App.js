import { useState } from "react";
import Sidebar from "./components/siderbar.jsx";
import Dashboard from "./pages/dashboard.jsx";
import Grafic from "./pages/reportes.jsx";
import AgregarProducto from "./pages/productos.jsx"; // Componente completo
import AgregarCliente from "./pages/clientes.jsx";
import RegistrarVenta from "./pages/ventas.jsx";
import Abonos from "./pages/abonos.jsx";
import SalidasDinero from "./pages/salidasDinero.jsx";


export default function App() {
  const [selected, setSelected] = useState("Dashboard");

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Menú lateral */}
      <Sidebar selected={selected} setSelected={setSelected} />

      {/* Contenido principal */}
      <main className="flex-1 p-6 overflow-auto">
        {selected === "Dashboard" && <Dashboard />}
        {selected === "Productos" && <AgregarProducto />}
        {selected === "Clientes" && <AgregarCliente />}
        {selected === "Ventas" && <RegistrarVenta />}
        {selected === "Abonos" && <Abonos />}
        {selected === "Salidas de dinero" && <SalidasDinero />}
        {selected === "Reportes" && <Grafic />}
        {selected === "Configuración" && <div>⚙️ Configuración</div>}
      </main>
    </div>
  );
}
