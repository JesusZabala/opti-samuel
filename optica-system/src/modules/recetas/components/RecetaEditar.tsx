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
//                 required
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
import { Search, Edit3, ArrowLeft, Save, User, Activity, ClipboardEdit } from "lucide-react";
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
    // Validación de seguridad: no proceder si no hay observaciones válidas
    if (!editando || !editando.id || !editando.observaciones?.trim()) return;

    try {
        setLoading(true);
        
        // Limpiamos el objeto para enviar solo lo que el backend necesita
        const { cliente_data, ...datosAEnviar } = editando;

        await actualizarReceta(editando.id, datosAEnviar); 
        
        alert("¡Receta actualizada con éxito!");
        setEditando(null);
        cargarRecetas();
    } catch (err) {
        setError("No se pudo actualizar la receta.");
    } finally {
        setLoading(false);
    }
  }; 

  if (loading && !editando) return <div className="p-20 text-center animate-pulse font-bold text-[#1a4731]">Consultando recetas editables...</div>;

  return (
    <div className="p-10 max-w-7xl mx-auto">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-gray-100">
        
        {/* ENCABEZADO */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-4xl font-black text-[#1a4731] flex items-center gap-3">
              <ClipboardEdit className="w-10 h-10" />
              Gestión de Recetas
            </h2>
            <p className="text-gray-400 font-bold uppercase text-xs tracking-widest mt-1 ml-1">
              Edición exclusiva para recetas sin pedido (Estado: SP)
            </p>
          </div>
          {editando && (
            <Button variant="outline" onClick={() => setEditando(null)} className="rounded-xl border-red-200 text-red-500 hover:bg-red-50">
              <ArrowLeft className="w-4 h-4 mr-2" /> Cancelar
            </Button>
          )}
        </div>

        {error && <p className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 font-bold border border-red-100">{error}</p>}

        {!editando ? (
          <div className="space-y-6">
            {/* BUSCADOR VALIDADO */}
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
              <Input
                placeholder="Buscar paciente por nombre (solo letras)..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, ""))}
                className="pl-14 py-8 rounded-2xl border-gray-200 text-xl shadow-sm focus:ring-[#1a4731]"
              />
            </div>

            {/* LISTADO DE RESULTADOS */}
            <div className="grid grid-cols-1 gap-4 mt-8">
              {recetasFiltradas.map((r) => (
                <div key={r.id} className="group p-6 border-2 border-gray-50 rounded-3xl flex justify-between items-center hover:border-[#1a4731]/30 transition-all bg-slate-50/50">
                  <div className="flex items-center gap-5">
                    <div className="bg-white p-4 rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                      <User className="w-6 h-6 text-[#1a4731]" />
                    </div>
                    <div>
                      <p className="font-black text-xl text-gray-800 uppercase tracking-tight">
                        {r.cliente_data?.nombre} {r.cliente_data?.apellido}
                      </p>
                      <p className="text-sm text-gray-400 font-bold" suppressHydrationWarning>
                        Receta #{r.id} • {r.fecha_creacion ? new Date(r.fecha_creacion).toLocaleDateString() : 'Fecha no disponible'}
                      </p>
                    </div>
                  </div>
                  <Button onClick={() => setEditando(r)} className="bg-[#1a4731] hover:bg-[#123122] rounded-2xl px-8 h-14 font-bold flex gap-2">
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
                <div key={idx} className={`p-8 rounded-[2rem] border-2 bg-white relative overflow-hidden ${det.oculus.alias === 'OD' ? 'border-blue-100' : 'border-green-100'}`}>
                  <div className={`absolute top-0 right-0 px-6 py-1 font-black text-xs text-white rounded-bl-2xl ${det.oculus.alias === 'OD' ? 'bg-blue-500' : 'bg-green-600'}`}>
                    {det.oculus.alias}
                  </div>
                  <h4 className="font-black text-[#1a4731] text-xl mb-6 flex items-center gap-2">
                    <Activity className="w-5 h-5 opacity-40" /> {det.oculus.descripcion}
                  </h4>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Esfera</label>
                      <Input type="number" step="0.25" defaultValue={det.oculus.esfera} onChange={(e) => handleUpdateDetail(idx, "esfera", e.target.value)} className="rounded-xl border-gray-100 focus:border-[#1a4731] font-bold" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Cilindro</label>
                      <Input type="number" step="0.25" defaultValue={det.oculus.cilindro} onChange={(e) => handleUpdateDetail(idx, "cilindro", e.target.value)} className="rounded-xl border-gray-100 focus:border-[#1a4731] font-bold" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Eje</label>
                      <Input type="number" defaultValue={det.oculus.eje} onChange={(e) => handleUpdateDetail(idx, "eje", e.target.value)} className="rounded-xl border-gray-100 focus:border-[#1a4731] font-bold" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Adición</label>
                      <Input type="number" step="0.25" defaultValue={det.adicion} onChange={(e) => handleUpdateDetail(idx, "adicion", e.target.value)} className="rounded-xl border-gray-100 focus:border-[#1a4731] font-bold" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-1">D.P (mm)</label>
                      <Input type="number" defaultValue={det.distancia_pupilar} onChange={(e) => handleUpdateDetail(idx, "distancia_pupilar", e.target.value)} className="rounded-xl border-gray-100 focus:border-[#1a4731] font-bold" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-xs font-black uppercase text-gray-400 tracking-widest ml-1">Observaciones Finales *</label>
                <span className="text-[10px] font-bold text-gray-300">{editando.observaciones.length} / 255</span>
              </div>
              <textarea 
                className="w-full p-6 border-2 border-gray-50 rounded-[2rem] bg-slate-50/30 focus:bg-white focus:ring-2 focus:ring-[#1a4731] outline-none transition-all font-medium" 
                rows={4}
                required
                maxLength={255}
                value={editando.observaciones}
                onChange={(e) => setEditando({...editando, observaciones: e.target.value})}
                placeholder="Escriba las observaciones obligatoriamente..."
              />
            </div>

            <Button 
              disabled={loading || !editando.observaciones?.trim()} // Se deshabilita si está cargando o si las observaciones están vacías
              onClick={guardarCambios}
              className="w-full py-10 rounded-[1.8rem] bg-[#1a4731] hover:bg-[#143625] text-xl font-black shadow-xl transition-all active:scale-[0.98] flex gap-3 uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
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