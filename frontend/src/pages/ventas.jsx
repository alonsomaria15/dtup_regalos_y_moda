import React, { useState, useEffect } from "react";

function App() {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [inputValor, setInputValor] = useState("");

  useEffect(() => {
    console.log("App cargada");
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-xl rounded-2xl p-6 space-y-6">
        <h2 className="text-2xl font-semibold mb-4">Formulario de Ejemplo</h2>

        {/* Input con label + botón alineados a la derecha */}
        <div className="flex items-center justify-end gap-4">
          <div className="flex flex-col">
            <label
              htmlFor="buscarProductos"
              className="font-medium mb-1 text-right"
            >
              Producto:
            </label>
            <input
              id="buscarProductos"
              type="text"
              placeholder="Buscar Producto..."
              value={inputValor}
              onChange={(e) => setInputValor(e.target.value)}
              className="border p-2 rounded focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            onClick={() => setMostrarModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Abrir Modal
          </button>
        </div>

        {/* Modal */}
        {mostrarModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-lg relative">
              <button
                onClick={() => setMostrarModal(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl font-bold"
              >
                &times;
              </button>
              <h3 className="text-xl font-semibold mb-4">Modal de Ejemplo</h3>
              <p>Este es el contenido del modal.</p>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setMostrarModal(false)}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
