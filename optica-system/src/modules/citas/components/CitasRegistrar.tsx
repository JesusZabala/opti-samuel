

// import { useState, useEffect } from "react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Search, Calendar, Stethoscope, Loader2 } from "lucide-react";
// import api from "@/api/axiosConfig";
// import { combineFechaHoraForApi } from "@/modules/citas/utils/combineFechaHora";
// import { agendarCita, obtenerCitasPorFecha, type Cita } from "@/services/citaService"; 
// import { consultarEmpleados } from "@/services/empleadoService"; 

// export default function CitaRegistrar() {
//   const [loading, setLoading] = useState(false);
//   const [busqueda, setBusqueda] = useState("");
//   const [clientesFiltrados, setClientesFiltrados] = useState<any[]>([]);
//   const [optometristas, setOptometristas] = useState<any[]>([]);
//   const [seleccionadoId, setSeleccionadoId] = useState<number | null>(null);
//   const [nombreSeleccionado, setNombreSeleccionado] = useState("");
  
//   const [horasBloqueadas, setHorasBloqueadas] = useState<string[]>([]);
//   const [cargandoHorarios, setCargandoHorarios] = useState(false);

//   const [formData, setFormData] = useState({
//     cliente: null as number | null,
//     usuario: "" as string | number, 
//     fecha: "",
//     hora: "",
//     motivo: "",
//     estado_cita: "A",
//   });

//   const getTodayString = () => new Date().toISOString().split('T')[0];

//   const [horasPermitidas] = useState<string[]>([
//     "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
//     "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"
//   ]);

//   // 1. Cargar Optometristas al montar el componente
//   useEffect(() => {
//     const cargarOptometristas = async () => {
//       try {
//         const empleados = await consultarEmpleados();
//         const listaOpto = empleados.filter((item: any) => 
//           item.rol_nombre?.toLowerCase() === "optometrista" || 
//           item.rol?.toLowerCase() === "optometrista"
//         );
//         setOptometristas(listaOpto.length > 0 ? listaOpto : empleados);
//       } catch (err) {
//         console.error("Error al cargar profesionales", err);
//       }
//     };
//     cargarOptometristas();
//   }, []);

//   // 2. Búsqueda de clientes con Debounce de 500ms
//   useEffect(() => {
//     const delayDebounceFn = setTimeout(async () => {
//       const endpoint = busqueda.trim() 
//         ? `cliente/?search=${encodeURIComponent(busqueda)}` 
//         : `cliente/`;

//       try {
//         const res = await api.get(endpoint);
//         const data = Array.isArray(res.data) ? res.data : (res.data.results || []);
//         setClientesFiltrados(data.slice(0, 8));
//       } catch (err) {
//         console.error("Error en la búsqueda:", err);
//       }
//     }, 500); 

//     return () => clearTimeout(delayDebounceFn);
//   }, [busqueda]);

//   // 3. CONTROL DE HORARIOS OCUPADOS Y PASADOS (Consumiendo el nuevo servicio limpio)
//   // 3. CONTROL DE HORARIOS OCUPADOS Y PASADOS (Unificado y Corregido)
//   // 3. CONTROL DE HORARIOS OCUPADOS (Versión definitiva sin bloqueos fantasma de hora local)
//   useEffect(() => {
//     if (!formData.fecha) {
//       setHorasBloqueadas([]);
//       return;
//     }

//     const verificarHorarios = async () => {
//       // 🚀 PASO A: Bloqueo preventivo inmediato de todas las horas y reseteo de la hora elegida
//       setCargandoHorarios(true);
//       setFormData((prev) => ({ ...prev, hora: "" }));

//       const bloqueadas: string[] = [];

//       // REGLA ÚNICA: Consultar al Backend y bloquear estrictamente lo que ya esté ocupado
//       try {
//         const todasLasCitas = await obtenerCitasPorFecha(formData.fecha);

//         todasLasCitas.forEach((cita: Cita) => {
//           // Solo procesar si la cita NO está cancelada ('C')
//           if (cita.fecha && cita.estado_cita !== "C") {
            
//             // Separamos el string ISO limpiamente ("2026-05-31T10:00:00-04:00")
//             const [fechaCitaIso, tiempoCompleto] = cita.fecha.split('T'); 
            
//             // Si la cita no pertenece al día seleccionado, la ignoramos
//             if (fechaCitaIso !== formData.fecha) return;

//             // Si el usuario seleccionó un optometrista, solo bloqueamos las de ESE optometrista
//             if (formData.usuario && Number(cita.usuario) !== Number(formData.usuario)) return;

//             // Extraer hora y minutos directamente del fragmento de tiempo ("10:00:00...")
//             const [horaRaw, minRaw] = tiempoCompleto.split(':');
//             let horas = parseInt(horaRaw, 10);
//             const minutos = minRaw;
            
//             // Conversión limpia a formato 12h respetando los dos dígitos del botón
//             const ampm = horas >= 12 ? 'PM' : 'AM';
//             horas = horas % 12;
//             horas = horas ? horas : 12; // Si es 0 (medianoche o 12m), cambia a 12
            
//             // Forzar dos dígitos en la hora (ej: 8 -> "08") para hacer match perfecto con tu array
//             const horaFormateada = `${horas.toString().padStart(2, '0')}:${minutos} ${ampm}`;
            
//             if (!bloqueadas.includes(horaFormateada)) {
//               bloqueadas.push(horaFormateada);
//             }
//           }
//         });
//       } catch (err) {
//         console.error("Error consultando citas existentes:", err);
//       }

//       // 🚀 PASO B: Actualizar estado con las horas bloqueadas reales de la DB y liberar UI
//       setHorasBloqueadas(bloqueadas);
//       setCargandoHorarios(false);
//     };

//     verificarHorarios();
//   }, [formData.fecha, formData.usuario]);

//   const handleSeleccionarCliente = (cliente: any) => {
//     setSeleccionadoId(cliente.id);
//     setNombreSeleccionado(`${cliente.nombre} ${cliente.apellido}`);
//     setFormData((prev) => ({ ...prev, cliente: cliente.id }));
//   };

//   const handleAuthSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!formData.cliente || !formData.fecha || !formData.hora || !formData.usuario) {
//       return alert("Faltan datos: Asegúrate de elegir Paciente, Optometrista, Fecha y Hora.");
//     }

//     setLoading(true);
//     try {
//       const fechaFinal = combineFechaHoraForApi(formData.fecha, formData.hora);
      
//       await agendarCita({
//         cliente: formData.cliente,
//         usuario: Number(formData.usuario), 
//         fecha: fechaFinal,
//         motivo: formData.motivo,
//         estado_cita: formData.estado_cita as any,
//       });

//       alert("¡Cita programada con éxito!");
      
//       setFormData({ cliente: null, usuario: "", fecha: "", hora: "", motivo: "", estado_cita: "A" });
//       setSeleccionadoId(null);
//       setNombreSeleccionado("");
//       setBusqueda("");
//       setClientesFiltrados([]);
//       setHorasBloqueadas([]); // Limpieza de bloqueos post-guardado
      
//     } catch (err: any) {
//       const errorMsg = err?.response?.data?.fecha?.[0] || err?.response?.data?.detail || err || "Error al procesar la cita.";
//       alert(errorMsg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-4 md:p-10 max-w-7xl mx-auto dark:bg-[#0a0f0a]">
//       <div className="bg-white dark:bg-[#1a2a20] rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden">
        
//         {/* HEADER */}
//         <div className="bg-[#1a4731] p-4 md:p-8 text-white flex flex-col md:flex-row justify-between md:items-center gap-4">
//           <div>
//             <h2 className="text-xl md:text-3xl font-black tracking-tight flex items-center gap-3">
//               <Calendar className="w-8 md:w-10 h-8 md:h-10 text-green-400" />
//               Gestión de Citas
//             </h2>
//             <p className="text-green-100/60 font-bold text-xs uppercase tracking-[0.3em]">Opti Samuel • 2026</p>
//           </div>
//           {seleccionadoId && (
//             <div className="bg-white/10 px-6 py-3 rounded-2xl backdrop-blur-md border border-white/20">
//               <p className="text-[10px] font-black text-green-300 uppercase">Paciente</p>
//               <p className="font-bold text-lg">{nombreSeleccionado}</p>
//             </div>
//           )}
//         </div>

//         <div className="p-4 md:p-10">
//           <form onSubmit={handleAuthSubmit} className="space-y-6 md:space-y-10">
            
//             {/* BUSCADOR */}
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
//               <div className="space-y-3">
//                 <label className="text-xs font-black text-gray-400 dark:text-gray-300 uppercase tracking-widest ml-1">1. Localizar Paciente</label>
//                 <div className="relative">
//                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300 w-5 h-5" />
//                   <Input 
//                     placeholder="Cédula o Nombre..."
//                     value={busqueda}
//                     onChange={(e) => setBusqueda(e.target.value)}
//                     className="pl-12 py-7 rounded-2xl border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-[#0f1a14] focus:bg-white dark:focus:bg-[#1a2a20] shadow-sm"
//                   />
//                 </div>
//               </div>

//               <div className="lg:col-span-2">
//                 <div className="border border-gray-100 dark:border-white/10 rounded-3xl overflow-hidden bg-gray-50/50 dark:bg-[#0f1a14]/50 max-h-[160px] overflow-y-auto shadow-inner">
//                   <table className="w-full text-sm text-left">
//                     <tbody className="divide-y divide-gray-100 dark:divide-white/10">
//                       {clientesFiltrados.map((c) => (
//                         <tr key={c.id} className={seleccionadoId === c.id ? "bg-green-50 dark:bg-emerald-900/20" : "hover:bg-white dark:hover:bg-[#1a2a20] transition-colors"}>
//                           <td className="p-4 font-bold text-gray-700 dark:text-gray-300">{c.nombre} {c.apellido}</td>
//                           <td className="p-4 text-gray-500 dark:text-gray-400 font-medium">{c.identificacion}</td>
//                           <td className="p-4 text-right">
//                             <Button
//                               type="button"
//                               onClick={() => handleSeleccionarCliente(c)}
//                               className={`rounded-xl px-5 h-9 font-black text-[10px] transition-all ${
//                                 seleccionadoId === c.id 
//                                   ? "bg-[#1a4731] dark:bg-emerald-900 text-white" 
//                                   : "bg-transparent border-2 border-[#1a4731] dark:border-emerald-600 text-[#1a4731] dark:text-emerald-300 hover:bg-[#1a4731] dark:hover:bg-emerald-800 hover:text-white"
//                               }`}
//                             >
//                               {seleccionadoId === c.id ? "LISTO" : "SELECCIONAR"}
//                             </Button>
//                           </td>
//                         </tr>
//                       ))}
//                       {clientesFiltrados.length === 0 && busqueda && (
//                         <tr>
//                           <td colSpan={3} className="p-6 text-center text-gray-400 dark:text-gray-300 text-xs italic">
//                             No se encontraron resultados para "{busqueda}"
//                           </td>
//                         </tr>
//                       )}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </div>

//             <hr className="border-gray-100 dark:border-white/10" />

//             {/* OPTOMETRISTA Y MOTIVO */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
//               <div className="space-y-3">
//                 <label className="text-xs font-black text-gray-400 dark:text-gray-300 uppercase tracking-widest ml-1 flex items-center gap-2">
//                   <Stethoscope className="w-4 h-4" /> 2. Optometrista Asignado
//                 </label>
//                 <select
//                   required
//                   value={formData.usuario}
//                   onChange={(e) => setFormData({...formData, usuario: e.target.value})}
//                   className="w-full p-5 rounded-2xl border-2 border-gray-50 dark:border-white/10 bg-gray-50 dark:bg-[#0f1a14] font-bold text-[#1a4731] dark:text-emerald-300 focus:border-green-500 outline-none transition-all cursor-pointer"
//                 >
//                   <option value="">-- Elija un profesional --</option>
//                   {optometristas.map((o) => (
//                     <option key={o.id} value={o.id}>
//                       {o.first_name ? `Dr. ${o.first_name} ${o.last_name}` : o.username}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div className="space-y-3">
//                 <label className="text-xs font-black text-gray-400 dark:text-gray-300 uppercase tracking-widest ml-1">3. Detalles / Motivo</label>
//                 <Input 
//                   placeholder="Ej. Examen de vista, consulta de control..."
//                   value={formData.motivo}
//                   onChange={(e) => setFormData({...formData, motivo: e.target.value})}
//                   className="py-8 rounded-2xl border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-[#0f1a14] focus:bg-white dark:focus:bg-[#1a2a20] shadow-sm"
//                 />
//               </div>
//             </div>

//             {/* FECHA Y HORA */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
//               <div className="p-8 border-2 border-gray-50 dark:border-white/10 rounded-[2.5rem] bg-gray-50/20 dark:bg-[#0f1a14]/20">
//                 <label className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-300 tracking-[0.2em] mb-4 block">Fecha Programada</label>
//                 <Input 
//                   type="date" 
//                   min={getTodayString()}
//                   value={formData.fecha}
//                   onChange={(e) => setFormData({...formData, fecha: e.target.value})}
//                   className="rounded-2xl border-gray-100 dark:border-gray-700 py-8 text-2xl font-black text-[#1a4731] dark:text-emerald-300 text-center"
//                 />
//               </div>

//               <div className="p-8 border-2 border-blue-50 dark:border-blue-800/30 rounded-[2.5rem] bg-blue-50/10 dark:bg-blue-900/10 relative">
                
//                 <div className="flex items-center justify-center gap-2 mb-4">
//                   <label className="text-[10px] font-black uppercase text-blue-400 dark:text-blue-300 tracking-[0.2em] block text-center">
//                     Bloque de Horario
//                   </label>
//                   {cargandoHorarios && <Loader2 className="w-3 h-3 text-blue-500 animate-spin" />}
//                 </div>

//                 <div className="grid grid-cols-3 gap-3">
//                   {horasPermitidas.map((h) => {
//                     const estaBloqueada = cargandoHorarios || horasBloqueadas.includes(h);
                    
//                     return (
//                       <button
//                         key={h}
//                         type="button"
//                         disabled={estaBloqueada || !formData.fecha}
//                         onClick={() => setFormData({...formData, hora: h})}
//                         className={`py-3 rounded-xl text-[11px] font-black transition-all border-2 ${
//                           formData.hora === h 
//                             ? "bg-blue-600 text-white border-blue-600 shadow-md scale-105" 
//                             : estaBloqueada 
//                             ? "bg-gray-100 dark:bg-gray-800/50 text-gray-400 dark:text-gray-600 border-gray-200 dark:border-gray-700/30 opacity-50 cursor-not-allowed line-through" 
//                             : "bg-white dark:bg-[#1a2a20] text-blue-600 dark:text-blue-300 border-blue-50 dark:border-blue-800/30 hover:border-blue-200 dark:hover:border-blue-500"
//                         }`}
//                       >
//                         {h}
//                       </button>
//                     );
//                   })}
//                 </div>
//               </div>
//             </div>

//             <Button 
//               disabled={loading || !seleccionadoId || !formData.usuario || !formData.hora || cargandoHorarios}
//               type="submit" 
//               className="w-full py-6 md:py-12 text-lg md:text-xl font-black bg-[#1a4731] hover:bg-[#0f2d1f] text-white rounded-[2rem] shadow-2xl transition-all active:scale-95 disabled:opacity-20"
//             >
//               {loading ? "PROCESANDO..." : "CONFIRMAR Y AGENDAR CITA"}
//             </Button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Calendar, Stethoscope, Loader2 } from "lucide-react";
import api from "@/api/axiosConfig";
import { combineFechaHoraForApi } from "@/modules/citas/utils/combineFechaHora";
import { agendarCita, obtenerCitasPorFecha, type Cita } from "@/services/citaService";
import { consultarEmpleados } from "@/services/empleadoService";
import { notifyOk, notifyError, notifyWarning } from "@/lib/notify"; 

export default function CitaRegistrar() {
  const [loading, setLoading] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [clientesFiltrados, setClientesFiltrados] = useState<any[]>([]);
  const [optometristas, setOptometristas] = useState<any[]>([]);
  const [seleccionadoId, setSeleccionadoId] = useState<number | null>(null);
  const [nombreSeleccionado, setNombreSeleccionado] = useState("");
  
  const [horasBloqueadas, setHorasBloqueadas] = useState<string[]>([]);
  const [cargandoHorarios, setCargandoHorarios] = useState(false);

  const [formData, setFormData] = useState({
    cliente: null as number | null,
    usuario: "" as string | number, 
    fecha: "",
    hora: "",
    motivo: "",
    estado_cita: "A",
  });

  const getTodayString = () => new Date().toISOString().split('T')[0];

  // 12h estricto para renderizado de botones
  const [horasPermitidas] = useState<string[]>([
    "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
    "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"
  ]);

  // 1. Cargar Optometristas al montar el componente
  useEffect(() => {
    const cargarOptometristas = async () => {
      try {
        const empleados = await consultarEmpleados();
        const listaOpto = empleados.filter((item: any) => 
          item.rol_nombre?.toLowerCase() === "optometrista" || 
          item.rol?.toLowerCase() === "optometrista"
        );
        setOptometristas(listaOpto.length > 0 ? listaOpto : empleados);
      } catch (err) {
        console.error("Error al cargar profesionales", err);
      }
    };
    cargarOptometristas();
  }, []);

  // 2. Búsqueda de clientes con Debounce de 500ms
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      const endpoint = busqueda.trim() 
        ? `cliente/?search=${encodeURIComponent(busqueda)}` 
        : `cliente/`;

      try {
        const res = await api.get(endpoint);
        const data = Array.isArray(res.data) ? res.data : (res.data.results || []);
        setClientesFiltrados(data.slice(0, 8));
      } catch (err) {
        console.error("Error en la búsqueda:", err);
      }
    }, 500); 

    return () => clearTimeout(delayDebounceFn);
  }, [busqueda]);

  // 3. CONTROL DE HORARIOS OCUPADOS (Regla de Consultorio Único y Conversión Forzada)
  useEffect(() => {
    if (!formData.fecha) {
      setHorasBloqueadas([]);
      return;
    }

    const verificarHorarios = async () => {
      setCargandoHorarios(true);
      setFormData((prev) => ({ ...prev, hora: "" }));

      const bloqueadas: string[] = [];

      try {
        const todasLasCitas = await obtenerCitasPorFecha(formData.fecha);

        todasLasCitas.forEach((cita: Cita) => {
          // Procesar solo citas activas (no canceladas ni completadas)
          if (cita.fecha && cita.estado_cita !== "C" && cita.estado_cita !== "COM") {
            
            const [fechaCitaIso, tiempoCompleto] = cita.fecha.split('T'); 
            
            if (fechaCitaIso !== formData.fecha) return;

            // Extraer limpiamente los segmentos de tiempo ignorando la zona horaria del string
            const [horaRaw, minRaw] = tiempoCompleto.split(':');
            let horas = parseInt(horaRaw, 10);
            const minutos = minRaw;
            
            // Conversión manual estricta a 12h sin depender de configuraciones del teléfono
            const ampm = horas >= 12 ? 'PM' : 'AM';
            horas = horas % 12;
            horas = horas ? horas : 12; // Mapea el 0 a 12
            
            // Construcción idéntica al formato de tu array local ("01:00 PM")
            const horaFormateada = `${horas.toString().padStart(2, '0')}:${minutos} ${ampm}`;
            
            if (!bloqueadas.includes(horaFormateada)) {
              bloqueadas.push(horaFormateada);
            }
          }
        });
      } catch (err) {
        console.error("Error consultando citas existentes:", err);
      }

      setHorasBloqueadas(bloqueadas);
      setCargandoHorarios(false);
    };

    verificarHorarios();
  }, [formData.fecha]);

  const handleSeleccionarCliente = (cliente: any) => {
    setSeleccionadoId(cliente.id);
    setNombreSeleccionado(`${cliente.nombre} ${cliente.apellido}`);
    setFormData((prev) => ({ ...prev, cliente: cliente.id }));
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.cliente || !formData.fecha || !formData.hora || !formData.usuario) {
      notifyWarning("Faltan datos: asegúrate de elegir Paciente, Optometrista, Fecha y Hora.");
      return;
    }

    setLoading(true);
    try {
      const fechaFinal = combineFechaHoraForApi(formData.fecha, formData.hora);
      
      await agendarCita({
        cliente: formData.cliente,
        usuario: Number(formData.usuario), 
        fecha: fechaFinal,
        motivo: formData.motivo,
        estado_cita: formData.estado_cita as any,
      });

      notifyOk("¡Cita programada con éxito!");

      setFormData({ cliente: null, usuario: "", fecha: "", hora: "", motivo: "", estado_cita: "A" });
      setSeleccionadoId(null);
      setNombreSeleccionado("");
      setBusqueda("");
      setClientesFiltrados([]);
      setHorasBloqueadas([]); 
      
    } catch (err: any) {
      notifyError(err, "Error al procesar la cita.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-10 max-w-7xl mx-auto dark:bg-[#0a0f0a]">
      <div className="bg-white dark:bg-[#1a2a20] rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden">
        
        {/* HEADER */}
        <div className="bg-[#1a4731] p-4 md:p-8 text-white flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h2 className="text-xl md:text-3xl font-black tracking-tight flex items-center gap-3">
              <Calendar className="w-8 md:w-10 h-8 md:h-10 text-green-400" />
              Gestión de Citas
            </h2>
            <p className="text-green-100/60 font-bold text-xs uppercase tracking-[0.3em]">Opti Samuel • 2026</p>
          </div>
          {seleccionadoId && (
            <div className="bg-white/10 px-6 py-3 rounded-2xl backdrop-blur-md border border-white/20">
              <p className="text-[10px] font-black text-green-300 uppercase">Paciente</p>
              <p className="font-bold text-lg">{nombreSeleccionado}</p>
            </div>
          )}
        </div>

        <div className="p-4 md:p-10">
          <form onSubmit={handleAuthSubmit} className="space-y-6 md:space-y-10">
            
            {/* BUSCADOR */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              <div className="space-y-3">
                <label className="text-xs font-black text-gray-400 dark:text-gray-300 uppercase tracking-widest ml-1">1. Localizar Paciente</label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300 w-5 h-5" />
                  <Input 
                    placeholder="Cédula o Nombre..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="pl-12 py-7 rounded-2xl border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-[#0f1a14] focus:bg-white dark:focus:bg-[#1a2a20] shadow-sm"
                  />
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="border border-gray-100 dark:border-white/10 rounded-3xl overflow-hidden bg-gray-50/50 dark:bg-[#0f1a14]/50 max-h-[160px] overflow-y-auto shadow-inner">
                  <table className="w-full text-sm text-left">
                    <tbody className="divide-y divide-gray-100 dark:divide-white/10">
                      {clientesFiltrados.map((c) => (
                        <tr key={c.id} className={seleccionadoId === c.id ? "bg-green-50 dark:bg-emerald-900/20" : "hover:bg-white dark:hover:bg-[#1a2a20] transition-colors"}>
                          <td className="p-4 font-bold text-gray-700 dark:text-gray-300">{c.nombre} {c.apellido}</td>
                          <td className="p-4 text-gray-500 dark:text-gray-400 font-medium">{c.identificacion}</td>
                          <td className="p-4 text-right">
                            <Button
                              type="button"
                              onClick={() => handleSeleccionarCliente(c)}
                              className={`rounded-xl px-5 h-9 font-black text-[10px] transition-all ${
                                seleccionadoId === c.id 
                                  ? "bg-[#1a4731] dark:bg-emerald-900 text-white" 
                                  : "bg-transparent border-2 border-[#1a4731] dark:border-emerald-600 text-[#1a4731] dark:text-emerald-300 hover:bg-[#1a4731] dark:hover:bg-emerald-800 hover:text-white"
                              }`}
                            >
                              {seleccionadoId === c.id ? "LISTO" : "SELECCIONAR"}
                            </Button>
                          </td>
                        </tr>
                      ))}
                      {clientesFiltrados.length === 0 && busqueda && (
                        <tr>
                          <td colSpan={3} className="p-6 text-center text-gray-400 dark:text-gray-300 text-xs italic">
                            No se encontraron resultados para "{busqueda}"
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <hr className="border-gray-100 dark:border-white/10" />

            {/* OPTOMETRISTA Y MOTIVO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <label className="text-xs font-black text-gray-400 dark:text-gray-300 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Stethoscope className="w-4 h-4" /> 2. Optometrista Asignado
                </label>
                <select
                  required
                  value={formData.usuario}
                  onChange={(e) => setFormData({...formData, usuario: e.target.value})}
                  className="w-full p-5 rounded-2xl border-2 border-gray-50 dark:border-white/10 bg-gray-50 dark:bg-[#0f1a14] font-bold text-[#1a4731] dark:text-emerald-300 focus:border-green-500 outline-none transition-all cursor-pointer"
                >
                  <option value="">-- Elija un profesional --</option>
                  {optometristas.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.first_name ? `Dr. ${o.first_name} ${o.last_name}` : o.username}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-gray-400 dark:text-gray-300 uppercase tracking-widest ml-1">3. Detalles / Motivo</label>
                <Input 
                  placeholder="Ej. Examen de vista, consulta de control..."
                  value={formData.motivo}
                  onChange={(e) => setFormData({...formData, motivo: e.target.value})}
                  className="py-8 rounded-2xl border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-[#0f1a14] focus:bg-white dark:focus:bg-[#1a2a20] shadow-sm"
                />
              </div>
            </div>

            {/* FECHA Y HORA */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="p-8 border-2 border-gray-50 dark:border-white/10 rounded-[2.5rem] bg-gray-50/20 dark:bg-[#0f1a14]/20">
                <label className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-300 tracking-[0.2em] mb-4 block">Fecha Programada</label>
                <Input 
                  type="date" 
                  min={getTodayString()}
                  value={formData.fecha}
                  onChange={(e) => setFormData({...formData, fecha: e.target.value})}
                  className="rounded-2xl border-gray-100 dark:border-gray-700 py-8 text-2xl font-black text-[#1a4731] dark:text-emerald-300 text-center"
                />
              </div>

              <div className="p-8 border-2 border-blue-50 dark:border-blue-800/30 rounded-[2.5rem] bg-blue-50/10 dark:bg-blue-900/10 relative">
                
                <div className="flex items-center justify-center gap-2 mb-4">
                  <label className="text-[10px] font-black uppercase text-blue-400 dark:text-blue-300 tracking-[0.2em] block text-center">
                    Bloque de Horario
                  </label>
                  {cargandoHorarios && <Loader2 className="w-3 h-3 text-blue-500 animate-spin" />}
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {horasPermitidas.map((h) => {
                    const estaBloqueada = cargandoHorarios || horasBloqueadas.includes(h);
                    
                    return (
                      <button
                        key={h}
                        type="button"
                        disabled={estaBloqueada || !formData.fecha}
                        onClick={() => setFormData({...formData, hora: h})}
                        className={`py-3 rounded-xl text-[11px] font-black transition-all border-2 ${
                          formData.hora === h 
                            ? "bg-blue-600 text-white border-blue-600 shadow-md scale-105" 
                            : estaBloqueada 
                            ? "bg-gray-100 dark:bg-gray-800/50 text-gray-400 dark:text-gray-600 border-gray-200 dark:border-gray-700/30 opacity-50 cursor-not-allowed line-through" 
                            : "bg-white dark:bg-[#1a2a20] text-blue-600 dark:text-blue-300 border-blue-50 dark:border-blue-800/30 hover:border-blue-200 dark:hover:border-blue-500"
                        }`}
                      >
                        {h}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <Button 
              disabled={loading || !seleccionadoId || !formData.usuario || !formData.hora || !formData.motivo || cargandoHorarios}
              type="submit" 
              className="w-full py-6 md:py-12 text-lg md:text-xl font-black bg-[#1a4731] hover:bg-[#0f2d1f] text-white rounded-[2rem] shadow-2xl transition-all active:scale-95 disabled:opacity-20"
            >
              {loading ? "PROCESANDO..." : "CONFIRMAR Y AGENDAR CITA"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}