import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { obtenerAuditoria, type AuditoriaRegistro } from "@/services/auditoriaService";
import { obtenerUsuarios, type UserList } from "@/services/userService";

export default function Auditoria() {
  
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState("");
  const [accion, setAccion] = useState("");
  const [moduloSeleccionado, setModuloSeleccionado] = useState("");

  const [todosLosRegistros, setTodosLosRegistros] = useState<AuditoriaRegistro[]>([]);
  const [registrosFiltrados, setRegistrosFiltrados] = useState<AuditoriaRegistro[]>([]);
  const [usuariosSistema, setUsuariosSistema] = useState<UserList[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatosIniciales = async () => {
      try {
        const [dataAuditoria, dataUsuarios] = await Promise.all([
          obtenerAuditoria(),
          obtenerUsuarios(),
        ]);
        
        setTodosLosRegistros(dataAuditoria);
        setRegistrosFiltrados(dataAuditoria);
        setUsuariosSistema(dataUsuarios);
      } catch (error) {
        console.error("Error en la carga inicial:", error);
      } finally {
        setLoading(false);
      }
    };
    cargarDatosIniciales();
  }, []);

  const obtenerSoloCambios = (reg: AuditoriaRegistro) => {
    const anterior = reg.objeto_anterior || {};
    const nuevo = reg.objeto_nuevo || {};

    if (reg.accion === 'C') {
      return { anterior: {}, nuevo };
    }

    const anteriorFiltrado: any = {};
    const nuevoFiltrado: any = {};

    Object.keys(nuevo).forEach((key) => {
      // Si el valor cambió, lo guardamos en ambos objetos para comparar el rastro
      if (JSON.stringify(nuevo[key]) !== JSON.stringify(anterior[key])) {
        anteriorFiltrado[key] = anterior[key];
        nuevoFiltrado[key] = nuevo[key];
      }
    });

    return { anterior: anteriorFiltrado, nuevo: nuevoFiltrado };
  };

  const handleBuscar = () => {
    const filtrados = todosLosRegistros.filter((reg) => {
      const coincideUsuario = usuarioSeleccionado ? reg.usuario_nombre === usuarioSeleccionado : true;
      const coincideAccion = accion ? reg.accion === accion : true;
      const coincideModulo = moduloSeleccionado ? reg.modulo === moduloSeleccionado : true;
      
      const fechaReg = reg.fecha_sistema.split('T')[0];
      const coincideDesde = fechaDesde ? fechaReg >= fechaDesde : true;
      const coincideHasta = fechaHasta ? fechaReg <= fechaHasta : true;

      return coincideUsuario && coincideAccion && coincideModulo && coincideDesde && coincideHasta;
    });
    setRegistrosFiltrados(filtrados);
  };

  const handleLimpiar = () => {
    setFechaDesde("");
    setFechaHasta("");
    setUsuarioSeleccionado("");
    setAccion("");
    setModuloSeleccionado("");
    setRegistrosFiltrados(todosLosRegistros);
  };

  const renderJsonCell = (data: any) => {
    if (!data || Object.keys(data).length === 0) return <span className="text-gray-400">-</span>;
    return (
      <div className="group relative">
        <span className="text-[10px] font-mono bg-gray-100 p-1 rounded border block max-w-[150px] truncate cursor-help">
          {JSON.stringify(data)}
        </span>
        <div className="hidden group-hover:block absolute z-50 bg-black text-white p-3 rounded-lg mt-1 text-[10px] min-w-[200px] max-w-xs break-all shadow-2xl border border-gray-700">
          <pre className="whitespace-pre-wrap font-mono">{JSON.stringify(data, null, 2)}</pre>
        </div>
      </div>
    );
  };

  return (
    <div className="p-10 bg-[#f5f7fb] min-h-screen">
      <div className="bg-white rounded-3xl shadow-xl p-10 border border-gray-100">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-black text-[#1a4731]">Auditoría del Sistema</h1>
            <p className="text-gray-500 mt-2">Seguimiento de registros y actualizaciones en Opti Samuel.</p>
          </div>
        </div>

        {/* FILTROS */}
        <div className="bg-[#f8fafc] border border-gray-200 rounded-3xl p-8">
          <h2 className="text-2xl font-bold text-[#1a4731] mb-8">Filtros de Búsqueda</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600">Fecha Desde</label>
              <Input type="date" value={fechaDesde} onChange={(e) => setFechaDesde(e.target.value)} className="h-12 rounded-xl bg-white shadow-sm" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600">Fecha Hasta</label>
              <Input type="date" value={fechaHasta} onChange={(e) => setFechaHasta(e.target.value)} className="h-12 rounded-xl bg-white shadow-sm" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600">Usuario Responsable</label>
              <select
                value={usuarioSeleccionado}
                onChange={(e) => setUsuarioSeleccionado(e.target.value)}
                className="w-full h-12 rounded-xl border border-gray-300 px-4 outline-none focus:ring-2 focus:ring-green-500 bg-white shadow-sm transition-all"
              >
                <option value="">Todos los usuarios registrados</option>
                {usuariosSistema.map((u) => (
                  <option key={u.id} value={u.username}>
                    {u.first_name} {u.last_name} ({u.username})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600">Tipo de Acción</label>
              <select
                value={accion}
                onChange={(e) => setAccion(e.target.value)}
                className="w-full h-12 rounded-xl border border-gray-300 px-4 outline-none focus:ring-2 focus:ring-green-500 bg-white shadow-sm"
              >
                <option value="">Cualquier acción</option>
                <option value="C">Creación (Registros nuevos)</option>
                <option value="U">Modificación (Cambios realizados)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600">Módulo del Sistema</label>
              <select
                value={moduloSeleccionado}
                onChange={(e) => setModuloSeleccionado(e.target.value)}
                className="w-full h-12 rounded-xl border border-gray-300 px-4 outline-none focus:ring-2 focus:ring-green-500 bg-white shadow-sm"
              >
                <option value="">Todos los módulos</option>
                <option value="Cliente">Cliente</option>
                <option value="Cita">Citas</option>
                <option value="RecetaVisual">Receta Visual</option>
                <option value="Pedido">Pedido</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mt-8">
            <Button onClick={handleBuscar} disabled={loading} className="bg-[#1a4731] hover:bg-[#256046] text-white px-10 h-12 rounded-xl shadow-md transition-all active:scale-95">
              {loading ? <Loader2 className="animate-spin mr-2" /> : "Aplicar Filtros"}
            </Button>
            <Button variant="outline" onClick={handleLimpiar} className="h-12 rounded-xl border-gray-300 hover:bg-gray-100 text-gray-600">
              Limpiar Búsqueda
            </Button>
          </div>
        </div>

        {/* TABLA DE RESULTADOS */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#1a4731]">Movimientos ({registrosFiltrados.length})</h2>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
            <table className="w-full border-collapse bg-white text-sm">
              <thead className="bg-[#1a4731] text-white">
                <tr>
                  <th className="text-left px-6 py-5 font-bold uppercase tracking-wider">Usuario</th>
                  <th className="text-left px-6 py-5 font-bold uppercase tracking-wider">Acción</th>
                  <th className="text-left px-6 py-5 font-bold uppercase tracking-wider">Módulo</th>
                  <th className="text-left px-6 py-5 font-bold uppercase tracking-wider">Fecha y Hora</th>
                  <th className="text-left px-6 py-5 font-bold uppercase tracking-wider">Estado Anterior</th>
                  <th className="text-left px-6 py-5 font-bold uppercase tracking-wider">Estado Nuevo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-20 text-gray-400">
                      <Loader2 className="animate-spin mx-auto mb-4 text-[#1a4731]" size={40} />
                      Sincronizando auditoría...
                    </td>
                  </tr>
                ) : registrosFiltrados.length > 0 ? (
                  registrosFiltrados.map((reg) => {
                    // Calculamos la diferencia justo antes de renderizar la fila
                    const { anterior, nuevo } = obtenerSoloCambios(reg);
                    
                    return (
                      <tr key={reg.id} className="hover:bg-green-50/30 transition-colors duration-150">
                        <td className="px-6 py-4 font-bold text-gray-800">{reg.usuario_nombre}</td>
                        <td className="px-6 py-4">
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                            reg.accion === 'C' 
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                              : 'bg-blue-100 text-blue-800 border border-blue-200'
                          }`}>
                            {reg.accion === 'C' ? 'Registro' : 'Edición'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600 uppercase text-[11px] font-black tracking-widest">
                          {reg.modulo}
                        </td>
                        <td className="px-6 py-4 text-gray-500 font-semibold italic">
                          {new Date(reg.fecha_sistema).toLocaleString('es-ES', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                          })}
                        </td>
                        <td className="px-6 py-4">{renderJsonCell(anterior)}</td>
                        <td className="px-6 py-4">{renderJsonCell(nuevo)}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-20 text-gray-500 font-semibold bg-gray-50/50">
                      No se encontraron actividades bajo estos criterios.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}