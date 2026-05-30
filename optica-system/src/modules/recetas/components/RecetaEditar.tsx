// import { useState, useEffect } from "react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Search, Edit3, ArrowLeft, Save, User, Activity, ClipboardEdit } from "lucide-react";
// // Importamos los servicios reales
// import { obtenerTodasLasRecetas, actualizarReceta } from "@/services/recetaService";
// import { type RecetaVisual } from "@/services/recetaService";

// export default function RecetaEditar() {
//   /* -------- ESTADOS -------- */
//   const [recetas, setRecetas] = useState<RecetaVisual[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [busqueda, setBusqueda] = useState("");
//   const [editando, setEditando] = useState<RecetaVisual | null>(null);
//   const [error, setError] = useState("");

//   /* -------- CONSTANTES DE ESTADO -------- */
//   const SIN_PEDIDO = 'SP';

//   /* -------- CARGA DE DATOS -------- */
//   const cargarRecetas = async () => {
//     try {
//       setLoading(true);
//       const data = await obtenerTodasLasRecetas();
//       const lista = Array.isArray(data) ? data : (data as any).results || [];
      
//       // Filtramos solo las que están en estado 'SP' (Sin Pedido)
//       const soloEditables = lista.filter((r: any) => r.estado_receta === SIN_PEDIDO);
//       setRecetas(soloEditables);
//     } catch (err) {
//       setError("Error al cargar el historial de recetas.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     cargarRecetas();
//   }, []);

//   /* -------- FILTRO Y VALIDACIÓN (SOLO LETRAS) -------- */
//   const recetasFiltradas = recetas.filter((r) => {
//     const nombreCompleto = `${r.cliente_data?.nombre} ${r.cliente_data?.apellido}`.toLowerCase();
//     return nombreCompleto.includes(busqueda.toLowerCase());
//   });

//   /* -------- MANEJO DE CAMBIOS -------- */
//   const handleUpdateDetail = (index: number, campo: string, valor: string) => {
//     if (!editando) return;
//     const nuevosDetalles = [...editando.rv_detalle_data];
//     const numValor = parseFloat(valor) || 0;

//     if (["esfera", "cilindro", "eje"].includes(campo)) {
//       nuevosDetalles[index].oculus = { ...nuevosDetalles[index].oculus, [campo]: numValor };
//     } else {
//       (nuevosDetalles[index] as any)[campo] = numValor;
//     }

//     setEditando({ ...editando, rv_detalle_data: nuevosDetalles });
//   };

//   const guardarCambios = async () => {
//     if (!editando || !editando.id) return; // Validación de seguridad

//     try {
//         setLoading(true);
        
//         // Limpiamos el objeto para enviar solo lo que el backend necesita
//         // (Opcional: eliminar cliente_data para evitar errores de 400 Bad Request)
//         const { cliente_data, ...datosAEnviar } = editando;

//         await actualizarReceta(editando.id, datosAEnviar); 
        
//         alert("¡Receta actualizada con éxito!");
//         setEditando(null);
//         cargarRecetas();
//     } catch (err) {
//         setError("No se pudo actualizar la receta.");
//     } finally {
//         setLoading(false);
//     }
//   }; 

//   if (loading && !editando) return <div className="p-20 text-center animate-pulse font-bold text-[#1a4731]">Consultando recetas editables...</div>;

//   return (
//     <div className="p-10 max-w-7xl mx-auto">
//       <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-gray-100">
        
//         {/* ENCABEZADO */}
//         <div className="flex items-center justify-between mb-10">
//           <div>
//             <h2 className="text-4xl font-black text-[#1a4731] flex items-center gap-3">
//               <ClipboardEdit className="w-10 h-10" />
//               Gestión de Recetas
//             </h2>
//             <p className="text-gray-400 font-bold uppercase text-xs tracking-widest mt-1 ml-1">
//               Edición exclusiva para recetas sin pedido (Estado: SP)
//             </p>
//           </div>
//           {editando && (
//             <Button variant="outline" onClick={() => setEditando(null)} className="rounded-xl border-red-200 text-red-500 hover:bg-red-50">
//               <ArrowLeft className="w-4 h-4 mr-2" /> Cancelar
//             </Button>
//           )}
//         </div>

//         {error && <p className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 font-bold border border-red-100">{error}</p>}

//         {!editando ? (
//           <div className="space-y-6">
//             {/* BUSCADOR VALIDADO */}
//             <div className="relative">
//               <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
//               <Input
//                 placeholder="Buscar paciente por nombre (solo letras)..."
//                 value={busqueda}
//                 onChange={(e) => setBusqueda(e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, ""))}
//                 className="pl-14 py-8 rounded-2xl border-gray-200 text-xl shadow-sm focus:ring-[#1a4731]"
//               />
//             </div>

//             {/* LISTADO DE RESULTADOS */}
//             <div className="grid grid-cols-1 gap-4 mt-8">
//               {recetasFiltradas.map((r) => (
//                 <div key={r.id} className="group p-6 border-2 border-gray-50 rounded-3xl flex justify-between items-center hover:border-[#1a4731]/30 transition-all bg-slate-50/50">
//                   <div className="flex items-center gap-5">
//                     <div className="bg-white p-4 rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
//                       <User className="w-6 h-6 text-[#1a4731]" />
//                     </div>
//                     <div>
//                       <p className="font-black text-xl text-gray-800 uppercase tracking-tight">
//                         {r.cliente_data?.nombre} {r.cliente_data?.apellido}
//                       </p>
//                       <p className="text-sm text-gray-400 font-bold" suppressHydrationWarning>
//                         Receta #{r.id} • {r.fecha_creacion ? new Date(r.fecha_creacion).toLocaleDateString() : 'Fecha no disponible'}
//                     </p>
//                     </div>
//                   </div>
//                   <Button onClick={() => setEditando(r)} className="bg-[#1a4731] hover:bg-[#123122] rounded-2xl px-8 h-14 font-bold flex gap-2">
//                     <Edit3 className="w-5 h-5" /> Editar Receta
//                   </Button>
//                 </div>
//               ))}
//               {recetasFiltradas.length === 0 && (
//                 <div className="text-center py-20 opacity-40 italic">No se encontraron recetas pendientes de pedido.</div>
//               )}
//             </div>
//           </div>
//         ) : (
//           /* FORMULARIO DE EDICIÓN */
//           <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//               {editando.rv_detalle_data.map((det: any, idx: number) => (
//                 <div key={idx} className={`p-8 rounded-[2rem] border-2 bg-white relative overflow-hidden ${det.oculus.alias === 'OD' ? 'border-blue-100' : 'border-green-100'}`}>
//                   <div className={`absolute top-0 right-0 px-6 py-1 font-black text-xs text-white rounded-bl-2xl ${det.oculus.alias === 'OD' ? 'bg-blue-500' : 'bg-green-600'}`}>
//                     {det.oculus.alias}
//                   </div>
//                   <h4 className="font-black text-[#1a4731] text-xl mb-6 flex items-center gap-2">
//                     <Activity className="w-5 h-5 opacity-40" /> {det.oculus.descripcion}
//                   </h4>
                  
//                   <div className="grid grid-cols-3 gap-4">
//                     <div className="space-y-1">
//                       <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Esfera</label>
//                       <Input type="number" step="0.25" defaultValue={det.oculus.esfera} onChange={(e) => handleUpdateDetail(idx, "esfera", e.target.value)} className="rounded-xl border-gray-100 focus:border-[#1a4731] font-bold" />
//                     </div>
//                     <div className="space-y-1">
//                       <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Cilindro</label>
//                       <Input type="number" step="0.25" defaultValue={det.oculus.cilindro} onChange={(e) => handleUpdateDetail(idx, "cilindro", e.target.value)} className="rounded-xl border-gray-100 focus:border-[#1a4731] font-bold" />
//                     </div>
//                     <div className="space-y-1">
//                       <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Eje</label>
//                       <Input type="number" defaultValue={det.oculus.eje} onChange={(e) => handleUpdateDetail(idx, "eje", e.target.value)} className="rounded-xl border-gray-100 focus:border-[#1a4731] font-bold" />
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-2 gap-4 mt-6">
//                     <div className="space-y-1">
//                       <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Adición</label>
//                       <Input type="number" step="0.25" defaultValue={det.adicion} onChange={(e) => handleUpdateDetail(idx, "adicion", e.target.value)} className="rounded-xl border-gray-100 focus:border-[#1a4731] font-bold" />
//                     </div>
//                     <div className="space-y-1">
//                       <label className="text-[10px] font-black uppercase text-gray-400 ml-1">D.P (mm)</label>
//                       <Input type="number" defaultValue={det.distancia_pupilar} onChange={(e) => handleUpdateDetail(idx, "distancia_pupilar", e.target.value)} className="rounded-xl border-gray-100 focus:border-[#1a4731] font-bold" />
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <div className="space-y-3">
//               <div className="flex justify-between">
//                 <label className="text-xs font-black uppercase text-gray-400 tracking-widest ml-1">Observaciones Finales</label>
//                 <span className="text-[10px] font-bold text-gray-300">{editando.observaciones.length} / 255</span>
//               </div>
//               <textarea 
//                 className="w-full p-6 border-2 border-gray-50 rounded-[2rem] bg-slate-50/30 focus:bg-white focus:ring-2 focus:ring-[#1a4731] outline-none transition-all font-medium" 
//                 rows={4}
//                 maxLength={255}
//                 value={editando.observaciones}
//                 onChange={(e) => setEditando({...editando, observaciones: e.target.value})}
//               />
//             </div>

//             <Button 
//               disabled={loading}
//               onClick={guardarCambios}
//               className="w-full py-10 rounded-[1.8rem] bg-[#1a4731] hover:bg-[#143625] text-xl font-black shadow-xl transition-all active:scale-[0.98] flex gap-3 uppercase tracking-widest"
//             >
//               <Save className="w-6 h-6" />
//               {loading ? "Actualizando historial..." : "Confirmar Cambios en Receta"}
//             </Button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Edit3, ArrowLeft, Save, User, Activity, ClipboardEdit, AlertCircle } from "lucide-react";
// Importamos los servicios reales
import { obtenerTodasLasRecetas, actualizarReceta } from "@/services/recetaService";
import { type RecetaVisual } from "@/services/recetaService";

export default function RecetaEditar() {
  /* -------- ESTADOS -------- */
  const [recetas, setRecetas] = useState<RecetaVisual[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [editando, setEditando] = useState<RecetaVisual | null>(null);
  const [error, setError] = useState("");

  /* -------- CONSTANTES DE ESTADO -------- */
  const SIN_PEDIDO = 'SP';

  /* -------- CARGA DE DATOS -------- */
  const cargarRecetas = async () => {
    try {
      setLoading(true);
      const data = await obtenerTodasLasRecetas();
      const lista = Array.isArray(data) ? data : (data as any).results || [];
      
      // Filtramos solo las que están en estado 'SP' (Sin Pedido)
      const soloEditables = lista.filter((r: any) => r.estado_receta === SIN_PEDIDO);
      setRecetas(soloEditables);
    } catch (err) {
      setError("Error al cargar el historial de recetas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarRecetas();
  }, []);

  /* -------- FILTRO Y VALIDACIÓN (SOLO LETRAS) -------- */
  const recetasFiltradas = recetas.filter((r) => {
    const nombreCompleto = `${r.cliente_data?.nombre} ${r.cliente_data?.apellido}`.toLowerCase();
    return nombreCompleto.includes(busqueda.toLowerCase());
  });

  /* -------- MANEJO DE CAMBIOS -------- */
  const handleUpdateDetail = (index: number, campo: string, valor: string) => {
    if (!editando) return;
    setError(""); // Limpiamos errores previos al escribir
    const nuevosDetalles = [...editando.rv_detalle_data];
    const numValor = parseFloat(valor) || 0;

    if (["esfera", "cilindro", "eje"].includes(campo)) {
      nuevosDetalles[index].oculus = { ...nuevosDetalles[index].oculus, [campo]: numValor };
    } else {
      (nuevosDetalles[index] as any)[campo] = numValor;
    }

    setEditando({ ...editando, rv_detalle_data: nuevosDetalles });
  };

  const guardarCambios = async () => {
    if (!editando || !editando.id) return; 
    setError("");

    // Buscamos los bloques de cada ojo basándonos en el alias del oculus
    const od = editando.rv_detalle_data.find((d: any) => d.oculus.alias === "OD") as any;
    const oi = editando.rv_detalle_data.find((d: any) => d.oculus.alias === "OI") as any;

    if (!od || !oi) {
      setError("La receta debe contener datos tanto para el Ojo Derecho (OD) como para el Ojo Izquierdo (OI).");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    /* --- CRITERIOS DE VALIDACIÓN --- */

    // 1. Validar rangos de adición (Permite 0, o exige entre 1.00 y 3.00)
    if (
      (od.adicion !== 0 && (od.adicion < 1 || od.adicion > 3)) || 
      (oi.adicion !== 0 && (oi.adicion < 1 || oi.adicion > 3))
    ) {
      setError("La adición de ambos ojos debe ser 0.00 (sin adición) o estar configurada en un rango de 1.00 a 3.00.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // 2. Validar rangos de Eje (Mínimo 1, Máximo 180)
    if (od.oculus.eje < 1 || od.oculus.eje > 180 || oi.oculus.eje < 1 || oi.oculus.eje > 180) {
      setError("El eje de ambos ojos debe configurarse estrictamente en un rango de 1° a 180°.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // 3. Validar que la Distancia Pupilar sea idéntica en ambos ojos
    if (od.distancia_pupilar !== oi.distancia_pupilar) {
      setError("La Distancia Pupilar (D.P.) debe ser exactamente igual para el Ojo Derecho y el Ojo Izquierdo.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // 4. Validar que la Adición sea idéntica en ambos ojos
    if (od.adicion !== oi.adicion) {
      setError("La adición debe ser exactamente igual para el Ojo Derecho y el Ojo Izquierdo.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    try {
        setLoading(true);
        
        // Limpiamos el objeto para enviar solo lo que el backend necesita
        const { cliente_data, ...datosAEnviar } = editando;

        await actualizarReceta(editando.id, datosAEnviar); 
        
        alert("¡Receta actualizada con éxito en Opti-Samuel!");
        setEditando(null);
        cargarRecetas();
    } catch (err) {
        setError("No se pudo procesar la actualización de la receta médica.");
    } finally {
        setLoading(false);
    }
  }; 

  if (loading && !editando) return <div className="p-20 text-center animate-pulse font-bold text-[#1a4731] dark:text-emerald-100">Consultando recetas editables...</div>;

  return (
    <div className="p-10 max-w-7xl mx-auto dark:bg-[#0a0f0a]">
      <div className="bg-white dark:bg-[#1a2a20] p-10 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-white/10">
        
        {/* ENCABEZADO */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-4xl font-black text-[#1a4731] dark:text-emerald-100 flex items-center gap-3">
              <ClipboardEdit className="w-10 h-10" />
              Gestión de Recetas
            </h2>
            <p className="text-gray-400 dark:text-gray-300 font-bold uppercase text-xs tracking-widest mt-1 ml-1">
              Edición exclusiva para recetas sin pedido (Estado: SP)
            </p>
          </div>
          {editando && (
            <Button variant="outline" onClick={() => { setEditando(null); setError(""); }} className="rounded-xl border-red-200 dark:border-red-800/30 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
              <ArrowLeft className="w-4 h-4 mr-2" /> Cancelar
            </Button>
          )}
        </div>

        {/* CONTENEDOR DE ALERTAS GLOBALES */}
        {error && (
          <div className="p-5 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 flex items-start gap-3 rounded-r-xl mb-6 animate-in fade-in zoom-in">
            <AlertCircle className="w-6 h-6 shrink-0 mt-0.5" />
            <div>
              <h5 className="font-black text-sm uppercase tracking-wide">Error de Validación</h5>
              <p className="font-bold text-xs mt-1 leading-relaxed">{error}</p>
            </div>
          </div>
        )}

        {!editando ? (
          <div className="space-y-6">
            {/* BUSCADOR VALIDADO */}
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300 w-6 h-6" />
              <Input
                placeholder="Buscar paciente por nombre (solo letras)..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, ""))}
                className="pl-14 py-8 rounded-2xl border-gray-200 dark:border-gray-700 text-xl shadow-sm focus:ring-[#1a4731]"
              />
            </div>

            {/* LISTADO DE RESULTADOS */}
            <div className="grid grid-cols-1 gap-4 mt-8">
              {recetasFiltradas.map((r) => (
                <div key={r.id} className="group p-6 border-2 border-gray-50 dark:border-white/10 rounded-3xl flex justify-between items-center hover:border-[#1a4731]/30 dark:hover:border-emerald-600/30 transition-all bg-slate-50/50 dark:bg-[#0f1a14]/50">
                  <div className="flex items-center gap-5">
                    <div className="bg-white dark:bg-[#1a2a20] p-4 rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                      <User className="w-6 h-6 text-[#1a4731] dark:text-emerald-100" />
                    </div>
                    <div>
                      <p className="font-black text-xl text-gray-800 dark:text-gray-200 uppercase tracking-tight">
                        {r.cliente_data?.nombre} {r.cliente_data?.apellido}
                      </p>
                      <p className="text-sm text-gray-400 dark:text-gray-300 font-bold" suppressHydrationWarning>
                        Receta #{r.id} • {r.fecha_creacion ? new Date(r.fecha_creacion).toLocaleDateString() : 'Fecha no disponible'}
                      </p>
                    </div>
                  </div>
                  <Button onClick={() => { setEditando(r); setError(""); }} className="bg-[#1a4731] hover:bg-[#123122] rounded-2xl px-8 h-14 font-bold flex gap-2">
                    <Edit3 className="w-5 h-5" /> Editar Receta
                  </Button>
                </div>
              ))}
              {recetasFiltradas.length === 0 && (
                <div className="text-center py-20 opacity-40 italic">No se encontraron recetas pendientes de pedido.</div>
              )}
            </div>
          </div>
        ) : (
          /* FORMULARIO DE EDICIÓN */
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {editando.rv_detalle_data.map((det: any, idx: number) => (
                <div key={idx} className={`p-8 rounded-[2rem] border-2 bg-white dark:bg-[#1a2a20] relative overflow-hidden ${det.oculus.alias === 'OD' ? 'border-blue-100 dark:border-blue-800/30' : 'border-green-100 dark:border-emerald-800/30'}`}>
                  <div className={`absolute top-0 right-0 px-6 py-1 font-black text-xs text-white rounded-bl-2xl ${det.oculus.alias === 'OD' ? 'bg-blue-500' : 'bg-green-600'}`}>
                    {det.oculus.alias}
                  </div>
                  <h4 className="font-black text-[#1a4731] dark:text-emerald-100 text-xl mb-6 flex items-center gap-2">
                    <Activity className="w-5 h-5 opacity-40" /> {det.oculus.descripcion}
                  </h4>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-300 ml-1">Esfera</label>
                      <Input type="number" step="0.25" value={det.oculus.esfera} onChange={(e) => handleUpdateDetail(idx, "esfera", e.target.value)} className="rounded-xl border-gray-100 dark:border-gray-700 focus:border-[#1a4731] font-bold" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-300 ml-1">Cilindro</label>
                      <Input type="number" step="0.25" value={det.oculus.cilindro} onChange={(e) => handleUpdateDetail(idx, "cilindro", e.target.value)} className="rounded-xl border-gray-100 dark:border-gray-700 focus:border-[#1a4731] font-bold" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-300 ml-1">Eje (°)</label>
                      <Input type="number" min="0" max="180" step="15" value={det.oculus.eje} onChange={(e) => handleUpdateDetail(idx, "eje", e.target.value)} className="rounded-xl border-gray-100 dark:border-gray-700 focus:border-[#1a4731] font-bold" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-300 ml-1">Adición</label>
                      <Input type="number" step="0.25" min="0" max="3" value={det.adicion} onChange={(e) => handleUpdateDetail(idx, "adicion", e.target.value)} className="rounded-xl border-gray-100 dark:border-gray-700 focus:border-[#1a4731] font-bold" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-300 ml-1">D.P (mm)</label>
                      <Input type="number" value={det.distancia_pupilar} onChange={(e) => handleUpdateDetail(idx, "distancia_pupilar", e.target.value)} className="rounded-xl border-gray-100 dark:border-gray-700 focus:border-[#1a4731] font-bold" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-xs font-black uppercase text-gray-400 dark:text-gray-300 tracking-widest ml-1">Observaciones Finales</label>
                <span className="text-[10px] font-bold text-gray-300 dark:text-gray-500">{editando.observaciones.length} / 255</span>
              </div>
              <textarea 
                className="w-full p-6 border-2 border-gray-50 dark:border-white/10 rounded-[2rem] bg-slate-50/30 dark:bg-[#0f1a14]/30 focus:bg-white dark:focus:bg-[#1a2a20] focus:ring-2 focus:ring-[#1a4731] outline-none transition-all font-medium" 
                rows={4}
                maxLength={255}
                value={editando.observaciones}
                onChange={(e) => setEditando({...editando, observaciones: e.target.value})}
              />
            </div>

            <Button 
              disabled={loading}
              onClick={guardarCambios}
              className="w-full py-10 rounded-[1.8rem] bg-[#1a4731] hover:bg-[#143625] text-xl font-black shadow-xl transition-all active:scale-[0.98] flex gap-3 uppercase tracking-widest"
            >
              <Save className="w-6 h-6" />
              {loading ? "Actualizando historial..." : "Confirmar Cambios en Receta"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}