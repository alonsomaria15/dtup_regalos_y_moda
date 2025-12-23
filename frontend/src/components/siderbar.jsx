import {
  LayoutDashboard,
  Package,
  Users,
  DollarSign,
  BarChart2,
  Settings,
  Wallet,
} from "lucide-react";

export default function Sidebar({ selected, setSelected }) {
  const menu = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Productos", icon: <Package size={20} /> },
    { name: "Clientes", icon: <Users size={20} /> },
    { name: "Ventas", icon: <DollarSign size={20} /> },
    { name: "Abonos", icon: <DollarSign size={20} /> },
    { name: "Salidas de dinero", icon: <Wallet size={20} /> }, // 💸 NUEVO MÓDULO
    { name: "Reportes", icon: <BarChart2 size={20} /> },
    { name: "Configuración", icon: <Settings size={20} /> },
  ];

  return (
    <aside className="w-64 bg-white shadow-md p-4 flex flex-col">
      <h1 className="text-xl font-bold mb-6 text-blue-600">Mi Negocio</h1>

      <nav className="flex-1 space-y-2">
        {menu.map((item) => (
          <button
            key={item.name}
            onClick={() => setSelected(item.name)}
            className={`flex items-center w-full gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
              selected === item.name
                ? "bg-blue-500 text-white"
                : "text-gray-700 hover:bg-blue-100"
            }`}
          >
            {item.icon}
            <span>{item.name}</span>
          </button>
        ))}
      </nav>

      <div className="mt-6 text-sm text-gray-500">
        <p>Versión 1.0</p>
        <p>&copy; 2025 Mi Negocio</p>
      </div>
    </aside>
  );
}
