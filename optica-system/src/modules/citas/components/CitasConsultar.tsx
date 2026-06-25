

// import { useState, useEffect } from "react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Search, Calendar, User, Clock, AlertCircle, ArrowLeft, XCircle } from "lucide-react";
// // Importamos los servicios reales
// import { obtenerCitas, actualizarEstadoCita } from "@/services/citaService";

// export default function CitaConsultar() {
//   /* -------- ESTADOS -------- */
//   const [citas, setCitas] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [busqueda, setBusqueda] = useState("");
//   // Filtro de estado basado en los models.TextChoices de Django
//   const [filtroEstado, setFiltroEstado] = useState<"TODOS" | "A" | "C" | "COM" | "RR" | "NA">("TODOS");
//   const [detalle, setDetalle] = useState<any>(null);
//   const [cancelando, setCancelando] = useState(false);
//   const [motivoCancelacion, setMotivoCancelacion] = useState("");
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   /* -------- CARGA DE DATOS -------- */
//   const cargarCitas = async () => {
//     try {
//       setLoading(true);
//       const data = await obtenerCitas();
//       setCitas(Array.isArray(data) ? data : []);
//     } catch (err) {
//       setError("Error al obtener las citas del servidor.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     cargarCitas();
//   }, []);

//   /* -------- HELPERS PARA UI -------- */
//   const getEstadoLabel = (sigla: string) => {
//     const nombres: any = { 
//         'A': "Agendada", 
//         'C': "Cancelada", 
//         'COM': "Completada", 
//         'RR': "Receta Registrada", 
//         'NA': "No Asistió" 
//     };
//     return nombres[sigla] || sigla;
//   };

//   const getEstadoColor = (sigla: string) => {
//     switch (sigla) {
//       case 'A': return 'bg-blue-100 text-blue-700 border-blue-200';
//       case 'C': return 'bg-red-100 text-red-700 border-red-200';
//       case 'COM': return 'bg-green-100 text-green-700 border-green-200';
//       case 'RR': return 'bg-purple-100 text-purple-700 border-purple-200';
//       case 'NA': return 'bg-gray-100 text-gray-700 border-gray-200';
//       default: return 'bg-gray-50 text-gray-600';
//     }
//   };

//   /* -------- LÓGICA DE FILTRADO -------- */
//   const citasFiltradas = citas.filter((c) => {
//     const nombreCompleto = `${c.cliente_data?.nombre || ''} ${c.cliente_data?.apellido || ''}`.toLowerCase();
//     const cumpleBusqueda = nombreCompleto.includes(busqueda.toLowerCase());
//     const cumpleEstado = filtroEstado === "TODOS" || c.estado_cita === filtroEstado;
//     return cumpleBusqueda && cumpleEstado;
//   });

//   /* -------- ACCIÓN: CANCELAR -------- */
//   const handleCancelarCita = async () => {
//     if (!motivoCancelacion) {
//       setError("Debes indicar el motivo de cancelación");
//       return;
//     }
//     try {
//       setError("");
//       await actualizarEstadoCita(detalle.id, {
//         estado_cita: "C", 
//         motivo_cancelacion: motivoCancelacion
//       });
//       setSuccess("Cita cancelada correctamente");
//       setDetalle(null);
//       setCancelando(false);
//       setMotivoCancelacion("");
//       await cargarCitas();
//       setTimeout(() => setSuccess(""), 3000);
//     } catch (err) {
//       setError("No se pudo cancelar la cita.");
//     }
//   };

//   if (loading) return <div className="p-10 text-center font-bold text-[#1a4731] animate-pulse">Cargando agenda de Opti-Samuel...</div>;

//   return (
//     <div className="p-10 max-w-6xl mx-auto">
//       <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-gray-100">
        
//         <div className="flex justify-between items-center mb-10">
//             <h2 className="text-4xl font-black text-[#1a4731] tracking-tight">Consultar Citas</h2>
//             <Calendar className="w-12 h-12 text-green-500/20" />
//         </div>

//         {success && <p className="p-4 bg-green-50 text-green-600 rounded-2xl font-bold mb-6 border border-green-100 animate-in fade-in">✓ {success}</p>}
//         {error && <p className="p-4 bg-red-50 text-red-600 rounded-2xl font-bold mb-6 border border-red-100">⚠ {error}</p>}

//         {!detalle ? (
//           <div className="space-y-8">
            
//             {/* SELECTOR DE ESTADOS */}
//             <div className="flex flex-wrap gap-3 p-2 bg-gray-50 rounded-[2rem] border border-gray-100">
//               {(["TODOS", "A", "COM", "RR", "C", "NA"] as const).map((estado) => (
//                 <Button
//                   key={estado}
//                   onClick={() => setFiltroEstado(estado)}
//                   className={`rounded-full px-6 py-2 h-auto text-[11px] font-black tracking-widest transition-all ${
//                     filtroEstado === estado 
//                       ? "bg-[#1a4731] text-white shadow-lg scale-105" 
//                       : "bg-white text-gray-500 hover:bg-gray-100 border border-gray-200"
//                   }`}
//                 >
//                   {estado === "TODOS" ? "TODAS" : getEstadoLabel(estado).toUpperCase()}
//                 </Button>
//               ))}
//             </div>

//             {/* BUSCADOR */}
//             <div className="relative">
//                 <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
//                 <Input
//                     placeholder="Buscar paciente por nombre..."
//                     value={busqueda}
//                     onChange={(e) => setBusqueda(e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, ""))}
//                     className="pl-14 rounded-2xl border-gray-200 py-8 text-lg shadow-sm focus:ring-[#1a4731]"
//                 />
//             </div>

//             {/* LISTADO */}
//             <div className="grid grid-cols-1 gap-4">
//               {citasFiltradas.length > 0 ? (
//                 citasFiltradas.map((cita) => (
//                   <div 
//                     key={cita.id} 
//                     className="group p-6 border-2 border-gray-50 rounded-3xl flex justify-between items-center bg-white hover:border-green-200 hover:shadow-xl transition-all duration-300"
//                   >
//                     <div className="flex items-center gap-6">
//                         <div className={`p-4 rounded-2xl ${getEstadoColor(cita.estado_cita)} bg-opacity-20`}>
//                             <User className="w-6 h-6" />
//                         </div>
//                         <div>
//                             <p className="font-black text-gray-800 text-xl">
//                                 {cita.cliente_data?.nombre} {cita.cliente_data?.apellido}
//                             </p>
//                             <div className="flex gap-4 mt-1">
//                                 <span className="text-xs flex items-center gap-1 text-gray-400 font-bold">
//                                     <Clock className="w-3 h-3" /> {new Date(cita.fecha).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
//                                 </span>
//                                 <span className="text-xs flex items-center gap-1 text-gray-400 font-bold">
//                                     <Calendar className="w-3 h-3" /> {new Date(cita.fecha).toLocaleDateString()}
//                                 </span>
//                             </div>
//                             <span className={`inline-block mt-3 text-[10px] font-black uppercase px-3 py-1 rounded-full border ${getEstadoColor(cita.estado_cita)}`}>
//                                 {getEstadoLabel(cita.estado_cita)}
//                             </span>
//                         </div>
//                     </div>
//                     <Button 
//                       onClick={() => setDetalle(cita)} 
//                       className="bg-[#1a4731] hover:bg-green-800 rounded-2xl px-8 py-6 shadow-lg shadow-green-900/10 transition-transform active:scale-95"
//                     >
//                       Ver Detalles
//                     </Button>
//                   </div>
//                 ))
//               ) : (
//                 <div className="text-center py-24 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
//                     <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
//                     <p className="text-gray-400 font-bold italic">No hay citas que coincidan con los filtros.</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         ) : (
//           /* VISTA DETALLE */
//           /* -------- VISTA DETALLE OPTIMIZADA -------- */
//           <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
//             <div className="flex justify-between items-end border-b border-gray-100 pb-8">
//                 <div>
//                   <h3 className="text-4xl font-black text-[#1a4731]">Detalle de Cita</h3>
//                   <p className="text-gray-400 font-bold mt-2 uppercase tracking-widest text-[10px]">Gestión de Agenda Sanitaria</p>
//                 </div>
//                 <Button variant="outline" onClick={() => {setDetalle(null); setCancelando(false);}} className="rounded-2xl border-2 py-6 px-8 font-bold hover:bg-gray-50 transition-all flex items-center gap-2">
//                   <ArrowLeft className="w-4 h-4" /> Regresar
//                 </Button>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
//               {/* COLUMNA 1: INFORMACIÓN DEL PACIENTE Y ESPECIALISTA */}
//               <div className="space-y-6">
//                   <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Ficha de Consulta</h4>
//                   <div className="bg-gray-50 p-8 rounded-[2.5rem] space-y-6 border border-gray-100 shadow-inner">
                    
//                     {/* Nombre y Cédula Principal */}
//                     <div>
//                       <p className="text-[10px] font-black text-green-600 uppercase mb-1">Paciente</p>
//                       <p className="text-3xl font-black text-gray-800 leading-none">
//                         {detalle.cliente_data?.nombre} {detalle.cliente_data?.apellido}
//                       </p>
//                       <p className="text-gray-500 font-bold mt-2 flex items-center gap-2">
//                         <span className="bg-white px-3 py-1 rounded-lg border border-gray-200 text-xs shadow-sm">
//                           V-{detalle.cliente_data?.cedula || detalle.cliente_data?.identificacion || "S/N"}
//                         </span>
//                       </p>
//                     </div>

//                     <div className="h-px bg-gray-200 w-full" />

//                     {/* Especialista y Motivo */}
//                     <div className="space-y-4">
//                         <div className="flex items-start gap-3">
//                           <div className="p-2 bg-white rounded-lg border border-gray-100 shadow-sm">
//                             <User className="w-4 h-4 text-green-600" />
//                           </div>
//                           <div>
//                             <p className="text-[10px] font-black text-gray-400 uppercase">Especialista Asignado</p>
//                             <p className="text-gray-700 font-bold">
//                               {detalle.usuario_data ? `Dr. ${detalle.usuario_data.first_name} ${detalle.usuario_data.last_name}` : "Por asignar"}
//                             </p>
//                           </div>
//                         </div>

//                         <div className="flex items-start gap-3">
//                           <div className="p-2 bg-white rounded-lg border border-gray-100 shadow-sm">
//                             <AlertCircle className="w-4 h-4 text-green-600" />
//                           </div>
//                           <div>
//                             <p className="text-[10px] font-black text-gray-400 uppercase">Motivo de Consulta</p>
//                             <p className="text-gray-700 font-medium italic">"{detalle.motivo}"</p>
//                           </div>
//                         </div>
//                     </div>
//                   </div>
//               </div>

//               {/* COLUMNA 2: ESTADO Y ACCIONES */}
//               <div className="space-y-6">
//                   <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Programación</h4>
//                   <div className="bg-white p-8 rounded-[2.5rem] border-2 border-gray-50 shadow-sm space-y-6">
//                     <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl">
//                         <div className="flex items-center gap-3">
//                           <Calendar className="w-5 h-5 text-gray-400" />
//                           <span className="font-bold text-gray-600">Fecha</span>
//                         </div>
//                         <span className="font-black text-gray-800">{new Date(detalle.fecha).toLocaleDateString()}</span>
//                     </div>

//                     <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl">
//                         <div className="flex items-center gap-3">
//                           <Clock className="w-5 h-5 text-gray-400" />
//                           <span className="font-bold text-gray-600">Hora Estimada</span>
//                         </div>
//                         <span className="font-black text-gray-800">
//                           {new Date(detalle.fecha).toLocaleTimeString('en-US', {
//                             hour: '2-digit', 
//                             minute: '2-digit', 
//                             hour12: true 
//                           })}
//                         </span>
//                     </div>

//                     <div className={`w-full text-center py-4 rounded-2xl font-black text-sm border uppercase tracking-widest ${getEstadoColor(detalle.estado_cita)}`}>
//                         {getEstadoLabel(detalle.estado_cita)}
//                     </div>
//                   </div>

//                   {/* BOTÓN DE CANCELAR DINÁMICO */}
//                   {detalle.estado_cita === 'A' && !cancelando && (
//                     <Button 
//                         variant="destructive" 
//                         onClick={() => setCancelando(true)}
//                         className="w-full py-8 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-lg shadow-red-100 transition-all hover:scale-[1.02] bg-red-600 hover:bg-red-700"
//                     >
//                         <XCircle className="w-5 h-5 mr-2" /> Cancelar Cita
//                     </Button>
//                   )}
//               </div>
//             </div>

//             {/* FORMULARIO DE CANCELACIÓN */}
//             {cancelando && (
//                 <div className="bg-red-50 p-8 rounded-[2rem] border-2 border-red-100 space-y-6 animate-in zoom-in-95">
//                     <div className="flex items-center gap-3 text-red-700">
//                         <AlertCircle className="w-6 h-6" />
//                         <h3 className="text-xl font-black uppercase tracking-tight">Confirmar Cancelación</h3>
//                     </div>
//                     <textarea 
//                         className="w-full p-6 border-2 border-red-200 rounded-2xl bg-white focus:ring-2 focus:ring-red-500 outline-none font-medium transition-all"
//                         placeholder="Escriba el motivo por el cual se cancela la cita..."
//                         rows={3}
//                         value={motivoCancelacion}
//                         onChange={(e) => setMotivoCancelacion(e.target.value)}
//                     />
//                     <div className="flex gap-4">
//                         <Button className="flex-1 bg-red-600 hover:bg-red-700 py-7 rounded-xl font-black uppercase tracking-widest text-xs" onClick={handleCancelarCita}>Confirmar Cancelación</Button>
//                         <Button variant="ghost" className="flex-1 py-7 rounded-xl font-bold text-red-400 hover:bg-red-100" onClick={() => setCancelando(false)}>Cerrar</Button>
//                     </div>
//                 </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Calendar, User, Clock, AlertCircle, ArrowLeft, XCircle, FileText } from "lucide-react";
// Importamos los servicios reales
import { obtenerCitas, actualizarEstadoCita } from "@/services/citaService";

export default function CitaConsultar() {
  /* -------- ESTADOS -------- */
  const [citas, setCitas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  // Filtro de estado basado en los models.TextChoices de Django
  const [filtroEstado, setFiltroEstado] = useState<"TODOS" | "A" | "C" | "COM" | "RR" | "NA">("TODOS");
  const [detalle, setDetalle] = useState<any>(null);
  const [cancelando, setCancelando] = useState(false);
  const [motivoCancelacion, setMotivoCancelacion] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* -------- CARGA DE DATOS -------- */
  const cargarCitas = async () => {
    try {
      setLoading(true);
      const data = await obtenerCitas();
      setCitas(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Error al obtener las citas del servidor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarCitas();
  }, []);

  /* -------- HELPERS PARA UI -------- */
  const getEstadoLabel = (sigla: string) => {
    const nombres: any = { 
        'A': "Agendada", 
        'C': "Cancelada", 
        'COM': "Completada", 
        'RR': "Receta Registrada", 
        'NA': "No Asistió" 
    };
    return nombres[sigla] || sigla;
  };

  const getEstadoColor = (sigla: string) => {
    switch (sigla) {
      case 'A': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'C': return 'bg-red-100 text-red-700 border-red-200';
      case 'COM': return 'bg-green-100 text-green-700 border-green-200';
      case 'RR': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'NA': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  /* -------- LÓGICA DE FILTRADO -------- */
  const citasFiltradas = citas.filter((c) => {
    const nombreCompleto = `${c.cliente_data?.nombre || ''} ${c.cliente_data?.apellido || ''}`.toLowerCase();
    const cumpleBusqueda = nombreCompleto.includes(busqueda.toLowerCase());
    const cumpleEstado = filtroEstado === "TODOS" || c.estado_cita === filtroEstado;
    return cumpleBusqueda && cumpleEstado;
  });

  /* -------- ACCIÓN: CANCELAR -------- */
  const handleCancelarCita = async () => {
    if (!motivoCancelacion) {
      setError("Debes indicar el motivo de cancelación");
      return;
    }
    try {
      setError("");
      await actualizarEstadoCita(detalle.id, {
        estado_cita: "C", 
        motivo_cancelacion: motivoCancelacion
      });
      setSuccess("Cita cancelada correctamente");
      setDetalle(null);
      setCancelando(false);
      setMotivoCancelacion("");
      await cargarCitas();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("No se pudo cancelar la cita.");
    }
  };

  if (loading) return <div className="p-10 text-center font-bold text-[#1a4731] dark:text-emerald-100 animate-pulse">Cargando agenda de Opti-Samuel...</div>;

  return (
    <div className="p-4 md:p-10 max-w-6xl mx-auto dark:bg-[#0a0f0a]">
      <div className="bg-white dark:bg-[#1a2a20] p-4 md:p-10 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-white/10">
        
        <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl md:text-4xl font-black text-[#1a4731] dark:text-emerald-100 tracking-tight">Consultar Citas</h2>
            <Calendar className="w-8 md:w-12 h-8 md:h-12 text-green-500/20" />
        </div>

        {success && <p className="p-4 bg-green-50 dark:bg-emerald-900/20 text-green-600 dark:text-green-400 rounded-2xl font-bold mb-6 border border-green-100 dark:border-emerald-800/30 animate-in fade-in">✓ {success}</p>}
        {error && <p className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl font-bold mb-6 border border-red-100 dark:border-red-800/30">⚠ {error}</p>}

        {!detalle ? (
          <div className="space-y-8">
            
            {/* SELECTOR DE ESTADOS */}
            <div className="flex flex-wrap gap-3 p-2 bg-gray-50 dark:bg-[#0f1a14] rounded-[2rem] border border-gray-100 dark:border-white/10">
              {(["TODOS", "A", "COM", "RR", "C", "NA"] as const).map((estado) => (
                <Button
                  key={estado}
                  onClick={() => setFiltroEstado(estado)}
                  className={`rounded-full px-6 py-2 h-auto text-[11px] font-black tracking-widest transition-all ${
                    filtroEstado === estado 
                      ? "bg-[#1a4731] dark:bg-emerald-900 text-white shadow-lg scale-105" 
                      : "bg-white dark:bg-[#1a2a20] text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1a2a20] border border-gray-200 dark:border-gray-700"
                  }`}
                >
                  {estado === "TODOS" ? "TODAS" : getEstadoLabel(estado).toUpperCase()}
                </Button>
              ))}
            </div>

            {/* BUSCADOR */}
            <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300 w-5 h-5" />
                <Input
                    placeholder="Buscar paciente por nombre..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, ""))}
                    className="pl-14 rounded-2xl border-gray-200 dark:border-gray-700 py-8 text-lg shadow-sm focus:ring-[#1a4731]"
                />
            </div>

            {/* LISTADO */}
            <div className="grid grid-cols-1 gap-4">
              {citasFiltradas.length > 0 ? (
                citasFiltradas.map((cita) => (
                  <div 
                    key={cita.id} 
                    className="group p-6 border-2 border-gray-50 dark:border-white/10 rounded-3xl flex flex-col md:flex-row justify-between md:items-center gap-4 bg-white dark:bg-[#1a2a20] hover:border-green-200 dark:hover:border-emerald-700 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-center gap-4 md:gap-6">
                        <div className={`p-4 rounded-2xl ${getEstadoColor(cita.estado_cita)} bg-opacity-20`}>
                            <User className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="font-black text-gray-800 text-xl">
                                {cita.cliente_data?.nombre} {cita.cliente_data?.apellido}
                            </p>
                            <div className="flex gap-4 mt-1">
                                <span className="text-xs flex items-center gap-1 text-gray-400 dark:text-gray-300 font-bold">
                                    <Clock className="w-3 h-3" /> {new Date(cita.fecha).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </span>
                                <span className="text-xs flex items-center gap-1 text-gray-400 dark:text-gray-300 font-bold">
                                    <Calendar className="w-3 h-3" /> {new Date(cita.fecha).toLocaleDateString()}
                                </span>
                            </div>
                            <span className={`inline-block mt-3 text-[10px] font-black uppercase px-3 py-1 rounded-full border ${getEstadoColor(cita.estado_cita)}`}>
                                {getEstadoLabel(cita.estado_cita)}
                            </span>
                        </div>
                    </div>
                    <Button 
                      onClick={() => setDetalle(cita)} 
                      className="bg-[#1a4731] hover:bg-green-800 rounded-2xl px-8 py-6 shadow-lg shadow-green-900/10 transition-transform active:scale-95 w-full md:w-auto"
                    >
                      Ver Detalles
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 md:py-24 bg-gray-50 dark:bg-[#0f1a14] rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-white/10">
                    <AlertCircle className="w-12 h-12 text-gray-300 dark:text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400 dark:text-gray-300 font-bold italic">No hay citas que coincidan con los filtros.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* VISTA DETALLE OPTIMIZADA */
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 border-b border-gray-100 dark:border-white/10 pb-8">
                <div>
                  <h3 className="text-2xl md:text-4xl font-black text-[#1a4731] dark:text-emerald-100">Detalle de Cita</h3>
                  <p className="text-gray-400 dark:text-gray-300 font-bold mt-2 uppercase tracking-widest text-[10px]">Gestión de Agenda Sanitaria</p>
                </div>
                <Button variant="outline" onClick={() => {setDetalle(null); setCancelando(false);}} className="rounded-2xl border-2 py-6 px-8 font-bold hover:bg-gray-50 dark:hover:bg-[#0f1a14] transition-all flex items-center gap-2 w-full md:w-auto justify-center">
                  <ArrowLeft className="w-4 h-4" /> Regresar
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* COLUMNA 1: INFORMACIÓN DEL PACIENTE Y ESPECIALISTA */}
              <div className="space-y-6">
                  <h4 className="text-[10px] font-black text-gray-400 dark:text-gray-300 uppercase tracking-[0.2em] ml-2">Ficha de Consulta</h4>
                  <div className="bg-gray-50 dark:bg-[#0f1a14] p-8 rounded-[2.5rem] space-y-6 border border-gray-100 dark:border-white/10 shadow-inner">
                    
                    {/* Nombre y Cédula Principal */}
                    <div>
                      <p className="text-[10px] font-black text-green-600 uppercase mb-1">Paciente</p>
                      <p className="text-3xl font-black text-gray-800 dark:text-gray-200 leading-none">
                        {detalle.cliente_data?.nombre} {detalle.cliente_data?.apellido}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400 font-bold mt-2 flex items-center gap-2">
                        <span className="bg-white dark:bg-[#1a2a20] px-3 py-1 rounded-lg border border-gray-200 dark:border-gray-700 text-xs shadow-sm">
                          V-{detalle.cliente_data?.cedula || detalle.cliente_data?.identificacion || "S/N"}
                        </span>
                      </p>
                    </div>

                    <div className="h-px bg-gray-200 dark:bg-gray-700 w-full" />

                    {/* Especialista y Motivo */}
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-white dark:bg-[#1a2a20] rounded-lg border border-gray-100 dark:border-white/10 shadow-sm">
                            <User className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-gray-400 dark:text-gray-300 uppercase">Especialista Asignado</p>
                            <p className="text-gray-700 dark:text-gray-300 font-bold">
                              {detalle.usuario_data ? `Dr. ${detalle.usuario_data.first_name} ${detalle.usuario_data.last_name}` : "Por asignar"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-white dark:bg-[#1a2a20] rounded-lg border border-gray-100 dark:border-white/10 shadow-sm">
                            <AlertCircle className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-gray-400 dark:text-gray-300 uppercase">Motivo de Consulta</p>
                            <p className="text-gray-700 dark:text-gray-300 font-medium italic">"{detalle.motivo}"</p>
                          </div>
                        </div>
                    </div>
                  </div>
              </div>

              {/* COLUMNA 2: ESTADO Y ACCIONES */}
              <div className="space-y-6">
                  <h4 className="text-[10px] font-black text-gray-400 dark:text-gray-300 uppercase tracking-[0.2em] ml-2">Programación</h4>
                  <div className="bg-white dark:bg-[#1a2a20] p-8 rounded-[2.5rem] border-2 border-gray-50 dark:border-white/10 shadow-sm space-y-6">
                    <div className="flex justify-between items-center bg-gray-50 dark:bg-[#0f1a14] p-4 rounded-2xl">
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-gray-400 dark:text-gray-300" />
                          <span className="font-bold text-gray-600 dark:text-gray-300">Fecha</span>
                        </div>
                        <span className="font-black text-gray-800 dark:text-gray-200">{new Date(detalle.fecha).toLocaleDateString()}</span>
                    </div>

                    <div className="flex justify-between items-center bg-gray-50 dark:bg-[#0f1a14] p-4 rounded-2xl">
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-gray-400 dark:text-gray-300" />
                          <span className="font-bold text-gray-600 dark:text-gray-300">Hora Estimada</span>
                        </div>
                        <span className="font-black text-gray-800 dark:text-gray-200">
                          {new Date(detalle.fecha).toLocaleTimeString('en-US', {
                            hour: '2-digit', 
                            minute: '2-digit', 
                            hour12: true 
                          })}
                        </span>
                    </div>

                    <div className={`w-full text-center py-4 rounded-2xl font-black text-sm border uppercase tracking-widest ${getEstadoColor(detalle.estado_cita)}`}>
                        {getEstadoLabel(detalle.estado_cita)}
                    </div>
                  </div>

                  {/* BOTÓN DE CANCELAR DINÁMICO */}
                  {detalle.estado_cita === 'A' && !cancelando && (
                    <Button 
                        variant="destructive" 
                        onClick={() => setCancelando(true)}
                        className="w-full py-8 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-lg shadow-red-100 transition-all hover:scale-[1.02] bg-red-600 hover:bg-red-700"
                    >
                        <XCircle className="w-5 h-5 mr-2" /> Cancelar Cita
                    </Button>
                  )}
              </div>
            </div>

            {/* SECCIÓN AGREGADA: MOTIVO DE CANCELACIÓN (Para citas que ya están canceladas en la DB) */}
            {detalle.estado_cita === 'C' && (
                <div className="bg-red-50/60 dark:bg-red-900/10 p-4 md:p-8 rounded-[2rem] border-2 border-dashed border-red-200 dark:border-red-800/30 space-y-3">
                <div className="flex items-center gap-3 text-red-800">
                  <FileText className="w-5 h-5" />
                  <h4 className="text-xs font-black uppercase tracking-wider">Detalles de Cancelación del Sistema</h4>
                </div>
                <div className="bg-white dark:bg-[#1a2a20] p-5 rounded-xl border border-red-100 dark:border-red-800/30 shadow-sm">
                  <p className="text-gray-400 dark:text-gray-300 text-[10px] font-black uppercase mb-1">Motivo Registrado:</p>
                  <p className="text-gray-700 dark:text-gray-300 font-semibold italic text-sm">
                    {detalle.motivo_cancelacion ? `"${detalle.motivo_cancelacion}"` : "No se especificó un motivo en el sistema."}
                  </p>
                </div>
              </div>
            )}

            {/* FORMULARIO DE CANCELACIÓN */}
            {cancelando && (
                <div className="bg-red-50 dark:bg-red-900/10 p-4 md:p-8 rounded-[2rem] border-2 border-red-100 dark:border-red-800/30 space-y-6 animate-in zoom-in-95">
                    <div className="flex items-center gap-3 text-red-700">
                        <AlertCircle className="w-6 h-6" />
                        <h3 className="text-xl font-black uppercase tracking-tight">Confirmar Cancelación</h3>
                    </div>
                    <textarea 
                        className="w-full p-6 border-2 border-red-200 dark:border-red-800/30 rounded-2xl bg-white dark:bg-[#1a2a20] focus:ring-2 focus:ring-red-500 outline-none font-medium transition-all"
                        placeholder="Escriba el motivo por el cual se cancela la cita..."
                        rows={3}
                        value={motivoCancelacion}
                        onChange={(e) => setMotivoCancelacion(e.target.value)}
                    />
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button className="flex-1 bg-red-600 hover:bg-red-700 py-7 rounded-xl font-black uppercase tracking-widest text-xs" onClick={handleCancelarCita}>Confirmar Cancelación</Button>
                        <Button variant="ghost" className="flex-1 py-7 rounded-xl font-bold text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30" onClick={() => setCancelando(false)}>Cerrar</Button>
                    </div>
                </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}