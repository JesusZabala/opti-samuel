
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar, User, Eye, ArrowLeft, ClipboardList, Activity } from "lucide-react";
// Importamos el servicio real
import { obtenerTodasLasRecetas } from "@/services/recetaService";
import { type RecetaVisual } from "@/services/recetaService";

export default function RecetaConsultar() {
  /* -------- ESTADOS -------- */
  const [recetas, setRecetas] = useState<RecetaVisual[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [detalle, setDetalle] = useState<RecetaVisual | null>(null);
  const [error, setError] = useState("");

  /* -------- CARGA DE DATOS -------- */
  const cargarRecetas = async () => {
    try {
      setLoading(true);
      const data = await obtenerTodasLasRecetas();
      // Ajuste por si el backend usa paginación (response.data.results)
      const lista = Array.isArray(data) ? data : (data as any).results || [];
      setRecetas(lista);
    } catch (err) {
      setError("Error al obtener el historial de recetas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarRecetas();
  }, []);

  /* -------- FILTRO EN TIEMPO REAL -------- */
  const recetasFiltradas = recetas.filter((r) => {
    const nombreCompleto = `${r.cliente_data?.nombre} ${r.cliente_data?.apellido}`.toLowerCase();
    return nombreCompleto.includes(busqueda.toLowerCase());
  });

  /* -------- HELPER PARA ANTEPONER SIGNO "+" -------- */
  const renderSigno = (valor: any) => {
    if (valor === undefined || valor === null || valor === "") return "0.00";
    const num = parseFloat(valor);
    if (isNaN(num)) return valor; // Si es un string de texto, lo deja igual
    return num > 0 ? `+${valor}` : valor;
  };

  /* -------- UI DE CARGA -------- */
  if (loading) return (
    <div className="p-4 md:p-10 text-center flex flex-col items-center gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a4731]"></div>
      <p className="text-[#1a4731] dark:text-emerald-100 font-bold">Cargando historial médico...</p>
    </div>
  );

  return (
    <div className="p-4 md:p-10 dark:bg-[#0a0f0a]">
      <div className="bg-white dark:bg-[#1a2a20] p-4 md:p-10 rounded-3xl shadow-xl min-h-[500px]">
        <h2 className="text-xl md:text-3xl font-black text-[#1a4731] dark:text-emerald-100 mb-6 flex items-center gap-3">
          <ClipboardList className="w-8 h-8" />
          Consultar Recetas
        </h2>

        {error && <p className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl font-bold mb-4">{error}</p>}

        {/* --- VISTA DE LISTADO --- */}
        {!detalle && (
          <>
            <div className="relative mb-8">
              <Input
                placeholder="Buscar por nombre de cliente..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, ""))}
                className="p-6 rounded-xl border-gray-200 dark:border-gray-700 pl-12 text-lg"
              />
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300 w-5 h-5" />
            </div>

            <div className="space-y-4">
              {recetasFiltradas.length === 0 && (
                <div className="text-center p-20 text-gray-400 dark:text-gray-300">
                  <p className="text-xl">No se encontraron recetas registradas.</p>
                </div>
              )}

              {recetasFiltradas.map((receta) => (
                  <div
                    key={receta.id}
                    className="p-6 border border-gray-100 dark:border-white/10 rounded-2xl flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 transition-all hover:shadow-lg hover:border-[#1a4731]/20 bg-slate-50/30 dark:bg-[#0f1a14]/30"
                  >
                    <div className="space-y-1">
                    <p className="font-black text-xl text-gray-800 dark:text-gray-200 uppercase tracking-tight">
                      {receta.cliente_data?.nombre} {receta.cliente_data?.apellido}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1 bg-white dark:bg-[#1a2a20] px-2 py-1 rounded-md border text-xs font-bold">
                        ID: #{receta.id}
                      </span>
                      <span className="flex items-center gap-1 font-medium">
                        <Calendar className="w-4 h-4" />
                        {receta.fecha_creacion ? new Date(receta.fecha_creacion).toLocaleDateString() : 'Sin fecha'}
                      </span>
                    </div>
                  </div>

                  <Button 
                    onClick={() => setDetalle(receta)} 
                    className="bg-[#1a4731] hover:bg-[#123122] h-12 px-6 rounded-xl gap-2 font-bold w-full sm:w-auto"
                  >
                    <Eye className="w-5 h-5" />
                    Ver Detalles
                  </Button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* --- VISTA DE DETALLE TÉCNICO --- */}
        {detalle && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <button 
              onClick={() => setDetalle(null)} 
               className="flex items-center gap-2 text-[#1a4731] dark:text-emerald-100 font-bold hover:underline mb-8"
            >
              <ArrowLeft className="w-5 h-5" /> Volver al listado
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Info Cliente */}
              <div className="bg-[#1a4731]/5 dark:bg-[#1a4731]/20 p-6 rounded-2xl border border-[#1a4731]/10 dark:border-[#1a4731]/30">
                <h3 className="font-bold text-[#1a4731] dark:text-emerald-100 mb-4 flex items-center gap-2 uppercase tracking-widest text-sm">
                  <User className="w-4 h-4" /> Información del Paciente
                </h3>
                <p className="text-2xl font-black text-slate-800 dark:text-gray-200">{detalle.cliente_data?.nombre} {detalle.cliente_data?.apellido}</p>
                <p className="text-slate-500 dark:text-gray-400">ID Identificación: {detalle.cliente_data?.tipo_cliente}-{detalle.cliente_data?.identificacion}</p>
              </div>

              {/* Info General */}
              <div className="bg-slate-50 dark:bg-[#0f1a14] p-6 rounded-2xl border border-slate-200 dark:border-gray-700">
                <h3 className="font-bold text-slate-400 dark:text-gray-300 mb-4 flex items-center gap-2 uppercase tracking-widest text-sm">
                  <Calendar className="w-4 h-4" /> Datos de Emisión
                </h3>
                <p className="text-lg font-bold">Fecha: {detalle.fecha_creacion ? new Date(detalle.fecha_creacion).toLocaleString() : 'N/A'}</p>
                <p className="text-slate-500 dark:text-gray-400 italic">Registrado en sistema: {detalle.fecha_sistema ? new Date(detalle.fecha_sistema).toLocaleDateString() : 'N/A'}</p>
              </div>

              {/* Detalles Técnicos (Oculus) */}
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {detalle.rv_detalle_data.map((det: any, idx: number) => (
                  <div key={idx} className="p-6 border-2 border-slate-100 dark:border-white/10 rounded-3xl bg-white dark:bg-[#1a2a20] relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-[#1a4731] text-white px-4 py-1 rounded-bl-xl font-bold text-xs">
                      {det.oculus.alias}
                    </div>
                    <h4 className="font-black text-xl text-[#1a4731] dark:text-emerald-100 mb-4 uppercase">{det.oculus.descripcion}</h4>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-slate-50 dark:bg-[#0f1a14] rounded-xl">
                        <span className="text-[10px] block text-slate-400 dark:text-gray-300 font-black uppercase">Esfera</span>
                        <span className="text-lg font-mono font-bold text-slate-800 dark:text-gray-200">
                          {renderSigno(det.oculus.esfera)}
                        </span>
                      </div>
                      <div className="text-center p-3 bg-slate-50 rounded-xl">
                        <span className="text-[10px] block text-slate-400 font-black uppercase">Cilindro</span>
                        <span className="text-lg font-mono font-bold text-slate-800">
                          {renderSigno(det.oculus.cilindro)}
                        </span>
                      </div>
                      <div className="text-center p-3 bg-slate-50 rounded-xl">
                        <span className="text-[10px] block text-slate-400 font-black uppercase">Eje</span>
                        <span className="text-lg font-mono font-bold text-slate-800">{det.oculus.eje}°</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t flex justify-between text-sm font-medium">
                      <span>Adición: <b className="text-[#1a4731] dark:text-emerald-100">{renderSigno(det.adicion)}</b></span>
                      <span>D.P: <b className="text-[#1a4731] dark:text-emerald-100">{det.distancia_pupilar} mm</b></span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Observaciones */}
              <div className="md:col-span-2 p-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-800/30 rounded-3xl">
                <h3 className="font-bold text-yellow-800 mb-2 flex items-center gap-2">
                  <Activity className="w-5 h-5" /> Observaciones Clínicas
                </h3>
                <p className="text-slate-700 dark:text-gray-300 leading-relaxed italic">
                  {detalle.observaciones || "El especialista no dejó observaciones adicionales para esta receta."}
                </p>
              </div>
            </div>
            
            <div className="mt-10">
              <Button onClick={() => setDetalle(null)} className="bg-slate-800 hover:bg-slate-900 px-10 h-12 rounded-xl font-bold">
                Cerrar Consulta
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}