

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { obtenerClientes, type Cliente } from "@/services/clienteService";

export default function ClienteConsultar() {
  /* -------- ESTADOS -------- */
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* -------- CARGA DE DATOS (GET) -------- */
  const cargarClientes = async () => {
    try {
      setLoading(true);
      const data = await obtenerClientes();
      setClientes(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("No se pudieron cargar los clientes.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  /* -------- LÓGICA DE FILTRADO -------- */
  const clientesFiltrados = clientes.filter((c) => {
    const termino = busqueda.toLowerCase();
    return (
      c.nombre.toLowerCase().includes(termino) ||
      c.apellido.toLowerCase().includes(termino) ||
      c.identificacion.includes(termino)
    );
  });

  return (
    <div className="p-10">
      <div className="bg-white p-10 rounded-3xl shadow-xl min-h-[500px]">
        <h2 className="text-3xl font-black text-[#1a4731] mb-6">
          Consultar Clientes
        </h2>

        {/* BUSCADOR */}
        <div className="flex gap-4 mb-8">
          <Input 
            placeholder="Buscar por cédula, nombre o apellido..." 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="p-6 rounded-xl border-gray-200 focus:ring-green-500"
          />
          <Button onClick={cargarClientes} variant="outline" className="h-12">
            🔄 Refrescar
          </Button>
        </div>

        {/* LISTADO / TABLA */}
        {loading ? (
          <p className="text-center text-gray-500 animate-pulse">Cargando base de datos...</p>
        ) : error ? (
          <p className="text-center text-red-500 font-bold">{error}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-100 text-[#1a4731] font-bold">
                  <th className="p-4">Identificación</th>
                  <th className="p-4">Nombre Completo</th>
                  <th className="p-4">Contacto</th>
                  <th className="p-4">Tipo/Género</th>
                  <th className="p-4 text-center">Estado</th>
                </tr>
              </thead>
              <tbody>
                {clientesFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-10 text-center text-gray-400">
                      No se encontraron clientes que coincidan.
                    </td>
                  </tr>
                ) : (
                  clientesFiltrados.map((c) => (
                    <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-mono text-sm">
                        <span className="bg-gray-100 px-2 py-1 rounded text-gray-700">
                          {c.tipo_cliente}-{c.identificacion}
                        </span>
                      </td>
                      <td className="p-4 font-bold">
                        {c.nombre} {c.apellido}
                      </td>
                      <td className="p-4">
                        <p className="text-sm text-gray-600">{c.email}</p>
                        <p className="text-xs text-gray-400">{c.telefono}</p>
                      </td>
                      <td className="p-4 text-sm">
                        {c.genero === 'M' ? 'Masculino' : 'Femenino'}
                      </td>
                      <td className="p-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                          c.estado_cliente === 'A' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {c.estado_cliente === 'A' ? 'ACTIVO' : 'INACTIVO'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}