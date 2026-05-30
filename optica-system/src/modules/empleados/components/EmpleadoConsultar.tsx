

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { consultarEmpleados, type Empleado } from "@/services/empleadoService"; 

export default function EmpleadoConsultar() {
  /* -------- ESTADOS -------- */
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* -------- CARGA DE DATOS -------- */
  const cargarEmpleados = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await consultarEmpleados();
      setEmpleados(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("No se pudo conectar con el servidor de Opti-Samuel.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarEmpleados();
  }, []);

  /* -------- LÓGICA DE FILTRADO SEGURO (Previene Pantalla en Blanco) -------- */
  const empleadosFiltrados = empleados.filter((e) => {
    const termino = busqueda.toLowerCase();

    // Usamos || "" para manejar valores null/undefined del backend
    const nombre = (e.first_name || "").toLowerCase();
    const apellido = (e.last_name || "").toLowerCase();
    const usuario = (e.username || "").toLowerCase();
    const email = (e.email || "").toLowerCase();

    return (
      nombre.includes(termino) ||
      apellido.includes(termino) ||
      usuario.includes(termino) ||
      email.includes(termino)
    );
  });

  return (
    <div className="p-10 dark:bg-[#0a0f0a]">
      <div className="bg-white dark:bg-[#1a2a20] p-10 rounded-3xl shadow-xl min-h-[500px] border border-gray-100 dark:border-white/10">
        <h2 className="text-3xl font-black text-[#1a4731] dark:text-emerald-100 mb-6 flex items-center gap-2">
           Consultar Personal
        </h2>

        {/* BUSCADOR */}
        <div className="flex gap-4 mb-8">
          <div className="relative flex-1">
            <Input 
              placeholder="Buscar por nombre, usuario o correo..." 
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="p-6 pl-4 rounded-xl border-gray-200 dark:border-gray-700 focus:ring-green-500 text-lg"
            />
          </div>
          <Button 
            onClick={cargarEmpleados} 
            variant="outline" 
            className="h-14 px-6 border-2 hover:bg-gray-50 dark:hover:bg-[#0f1a14] font-bold"
          >
            🔄 Actualizar
          </Button>
        </div>

        {/* LISTADO / TABLA */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-500 dark:text-gray-400 font-medium italic">Sincronizando con el servidor...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-6 rounded-2xl border border-red-100 dark:border-red-800/30 text-center font-bold">
            {error}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-2">
              <thead>
                <tr className="text-[#1a4731] dark:text-emerald-100 font-black uppercase text-xs tracking-widest">
                  <th className="p-4">Usuario</th>
                  <th className="p-4">Nombre Completo</th>
                  <th className="p-4">Contacto (Email)</th>
                  <th className="p-4">Cargo / Rol</th>
                  <th className="p-4 text-center">Estado</th>
                </tr>
              </thead>
              <tbody>
                {empleadosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-20 text-center text-gray-400 dark:text-gray-300 font-medium">
                      No hay registros que coincidan con la búsqueda.
                    </td>
                  </tr>
                ) : (
                  empleadosFiltrados.map((emp) => (
                    <tr 
                      key={emp.id} 
                      className="bg-white dark:bg-[#1a2a20] hover:bg-green-50/50 dark:hover:bg-emerald-900/10 border border-gray-100 dark:border-white/10 transition-all group"
                    >
                      {/* USUARIO */}
                      <td className="p-4 rounded-l-2xl border-y border-l">
                        <span className="font-mono text-xs bg-gray-100 dark:bg-[#0f1a14] text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full group-hover:bg-white dark:group-hover:bg-[#1a2a20]">
                          @{emp.username}
                        </span>
                      </td>

                      {/* NOMBRE COMPLETO */}
                      <td className="p-4 border-y">
                        <p className="font-bold text-gray-800 dark:text-gray-200 capitalize">
                          {emp.first_name || "Sin nombre"} {emp.last_name || ""}
                        </p>
                      </td>

                      {/* CONTACTO - EMAIL */}
                      <td className="p-4 border-y">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {emp.email || "No registrado"}
                          </span>
                          <span className="text-[10px] text-gray-400 dark:text-gray-300 uppercase tracking-tighter italic">
                            Institucional
                          </span>
                        </div>
                      </td>

                      {/* CARGO / ROL */}
                      <td className="p-4 border-y">
                        <span className={`px-3 py-1 rounded-lg text-[11px] font-black uppercase tracking-tighter ${
                          (emp.rol as string) === 'Admin' || (emp.rol as string) === 'superadmin'
                            ? 'bg-purple-100 text-purple-700'
                            : emp.rol === 'optometrista'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-orange-100 text-orange-700'
                        }`}>
                          {emp.rol}
                        </span>
                      </td>

                      {/* ESTADO */}
                      <td className="p-4 text-center rounded-r-2xl border-y border-r">
                        <div className="flex items-center justify-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${emp.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
                          <span className={`text-[10px] font-bold ${emp.is_active ? 'text-green-700' : 'text-red-700'}`}>
                            {emp.is_active ? 'ACTIVO' : 'INACTIVO'}
                          </span>
                        </div>
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