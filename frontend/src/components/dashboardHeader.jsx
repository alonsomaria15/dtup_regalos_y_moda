// DashboardHeader.jsx
import { User, LogOut } from "lucide-react";

export default function DashboardHeader({ sucursal = "Sucursal Principal" }) {
  return (
    <div className="flex items-center justify-between bg-white p-4 shadow-sm border-b border-gray-200 m-0">
      {/* Información de sucursal */}
      <div>
        <h2 className="text-lg font-semibold m-0">Sucursal actual:</h2>
        <span className="font-bold">{sucursal}</span>
      </div>

      {/* Iconos a la derecha */}
      <div className="flex items-center gap-4">
        <button className="flex items-center gap-1 text-gray-700 hover:text-gray-900">
          <User size={20} />
          <span>Perfil</span>
        </button>
        <button className="flex items-center gap-1 text-gray-700 hover:text-gray-900">
          <LogOut size={20} />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </div>
  );
}
