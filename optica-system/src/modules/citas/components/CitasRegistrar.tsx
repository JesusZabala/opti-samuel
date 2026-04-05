// // import { useState, useEffect } from "react";
// // import { Input } from "@/components/ui/input";
// // import { Button } from "@/components/ui/button";
// // import { Search, Calendar } from "lucide-react";
// // import api from "@/api/axiosConfig";
// // import { combineFechaHoraForApi } from "@/modules/citas/utils/combineFechaHora";

// // export default function CitaRegistrar() {
// //   const [loading, setLoading] = useState(false);
// //   const [busqueda, setBusqueda] = useState("");
// //   const [clientesFiltrados, setClientesFiltrados] = useState<any[]>([]);
// //   const [seleccionadoId, setSeleccionadoId] = useState<number | null>(null);
// //   const [nombreSeleccionado, setNombreSeleccionado] = useState("");

// //   const getTodayString = () => {
// //     const today = new Date();
// //     // Usamos el formato YYYY-MM-DD que es el estándar de HTML5
// //     return today.toISOString().split('T')[0];
// //   };
// //   // Horas permitidas según tu comentario
// //   const [horasPermitidas] = useState<string[]>([
// //     "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
// //     "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"
// //   ]);

// //   const [formData, setFormData] = useState({
// //     cliente: null as number | null,
// //     fecha: "",
// //     hora: "",
// //     motivo: "",
// //     estado_cita: "A",
// //   });

// //   // Búsqueda de clientes
// //   useEffect(() => {
// //     if (busqueda.length > 2) {
// //       const delayDebounceFn = setTimeout(async () => {
// //         try {
// //           const res = await api.get(`cliente/?search=${busqueda}`);
// //           setClientesFiltrados(res.data);
// //         } catch (err) {
// //           console.error("Error al buscar clientes", err);
// //         }
// //       }, 300);
// //       return () => clearTimeout(delayDebounceFn);
// //     }
// //   }, [busqueda]);

// //   const handleSeleccionarCliente = (cliente: any) => {
// //     setSeleccionadoId(cliente.id);
// //     setNombreSeleccionado(`${cliente.nombre} ${cliente.apellido}`);
// //     setFormData((prev) => ({ ...prev, cliente: cliente.id }));
// //   };

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     if (!formData.cliente || !formData.fecha || !formData.hora) {
// //       return alert("Por favor seleccione un paciente, fecha y hora.");
// //     }

// //     setLoading(true);
// //     try {
// //       const fecha = combineFechaHoraForApi(formData.fecha, formData.hora);
// //       await api.post("cita/", {
// //         cliente: formData.cliente,
// //         fecha,
// //         motivo: formData.motivo,
// //         estado_cita: formData.estado_cita,
// //       });
// //       alert("Cita registrada con éxito");
// //       setFormData({
// //         cliente: null,
// //         fecha: "",
// //         hora: "",
// //         motivo: "",
// //         estado_cita: "A",
// //       });
// //       setSeleccionadoId(null);
// //       setNombreSeleccionado("");
// //       setBusqueda("");
// //       setClientesFiltrados([]);
// //     } catch (err) {
// //       alert("Error al guardar la cita.");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="p-10 max-w-7xl mx-auto">
// //       <div className="bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden">
        
// //         {/* ENCABEZADO */}
// //         <div className="bg-[#1a4731] p-8 text-white flex justify-between items-center">
// //           <div>
// //             <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
// //               <Calendar className="w-10 h-10 text-green-400" />
// //               Programar Nueva Cita
// //             </h2>
// //             <p className="text-green-100/70 mt-1 font-medium text-sm uppercase tracking-widest">Módulo de Agendamiento</p>
// //           </div>
// //           {seleccionadoId && (
// //             <div className="bg-green-800/40 px-6 py-3 rounded-2xl border border-green-500/30 backdrop-blur-sm">
// //               <p className="text-[10px] font-black uppercase text-green-300">Paciente</p>
// //               <p className="font-bold text-lg">{nombreSeleccionado}</p>
// //             </div>
// //           )}
// //         </div>

// //         <div className="p-10">
// //           <form onSubmit={handleSubmit} className="space-y-12">
            
// //             {/* SECCIÓN BÚSQUEDA */}
// //             {/* SECCIÓN BÚSQUEDA */}
// //             <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
// //               <div className="lg:col-span-1 space-y-4">
// //                 <h3 className="font-black text-gray-800 text-lg flex items-center gap-2">
// //                   <Search className="w-5 h-5 text-[#1a4731]" />
// //                   Seleccionar Paciente
// //                 </h3>
// //                 <Input 
// //                   placeholder="Buscar por nombre o cédula..."
// //                   value={busqueda}
// //                   onChange={(e) => setBusqueda(e.target.value)}
// //                   className="rounded-xl border-gray-200 py-6 shadow-sm focus:ring-2 focus:ring-[#1a4731]"
// //                 />
// //               </div>

// //               <div className="lg:col-span-2">
// //                 <div className="border rounded-[1.5rem] overflow-hidden shadow-inner bg-gray-50 max-h-[200px] overflow-y-auto">
// //                   <table className="w-full text-left border-collapse">
// //                     <thead className="bg-white sticky top-0 shadow-sm z-10">
// //                       <tr>
// //                         <th className="p-4 text-[10px] font-black uppercase text-gray-400">Nombre Completo</th>
// //                         <th className="p-4 text-[10px] font-black uppercase text-gray-400">Identificación</th>
// //                         <th className="p-4 text-center text-[10px] font-black uppercase text-gray-400">Acción</th>
// //                       </tr>
// //                     </thead>
// //                     <tbody className="text-sm">
// //                       {clientesFiltrados.map((item) => (
// //                         <tr key={item.id} className={`border-b transition-colors ${seleccionadoId === item.id ? 'bg-green-50' : 'bg-white hover:bg-gray-50'}`}>
// //                           <td className="p-4 font-bold text-gray-700">
// //                             {item.nombre} {item.apellido}
// //                           </td>
// //                           <td className="p-4 font-medium text-gray-500 tracking-wider">
// //                             {item.identificacion}
// //                           </td>
// //                           <td className="p-4 text-center">
// //                             <Button
// //                               type="button"
// //                               onClick={() => handleSeleccionarCliente(item)}
// //                               className={`rounded-full px-6 h-8 text-[10px] font-black transition-all ${
// //                                 seleccionadoId === item.id 
// //                                 ? 'bg-[#1a4731] shadow-md' 
// //                                 : 'border-2 border-[#1a4731] text-[#1a4731] bg-transparent hover:bg-[#1a4731] hover:text-white'
// //                               }`}
// //                             >
// //                               {seleccionadoId === item.id ? "SELECCIONADO" : "ELEGIR"}
// //                             </Button>
// //                           </td>
// //                         </tr>
// //                       ))}
// //                       {clientesFiltrados.length === 0 && busqueda.length > 2 && (
// //                         <tr>
// //                           <td colSpan={3} className="p-8 text-center text-gray-400 italic">
// //                             No se encontraron pacientes con esa información.
// //                           </td>
// //                         </tr>
// //                       )}
// //                     </tbody>
// //                   </table>
// //                 </div>
// //               </div>
// //             </section>

// //             <hr className="border-gray-100" />

// //             {/* SECCIÓN FECHA Y HORA */}
// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
// //               {/* CALENDARIO */}
// //               <div className="relative">
// //                 <div className="absolute -top-4 left-6 bg-[#1a4731] text-white px-4 py-1 rounded-full text-[10px] font-black shadow-lg uppercase tracking-widest">Fecha de Cita</div>
// //                 <div className="p-8 pt-10 border-2 border-gray-100 rounded-[2.5rem] bg-gray-50/30">
// //                    <Input 
// //                     type="date" 
// //                     className="rounded-xl border-gray-200 py-7 text-xl font-black text-[#1a4731] focus:ring-2 focus:ring-[#1a4731]"
// //                     onChange={(e) => setFormData({...formData, fecha: e.target.value})}
// //                     min={getTodayString()}
// //                    />
// //                 </div>
// //               </div>

// //               {/* GRID DE HORAS (AM/PM) */}
// //               <div className="relative">
// //                 <div className="absolute -top-4 left-6 bg-blue-600 text-white px-4 py-1 rounded-full text-[10px] font-black shadow-lg uppercase tracking-widest">Horario Disponible</div>
// //                 <div className="p-8 pt-10 border-2 border-blue-50 rounded-[2.5rem] bg-blue-50/5">
// //                    <div className="grid grid-cols-3 gap-3">
// //                      {horasPermitidas.map((h) => (
// //                        <button
// //                          key={h}
// //                          type="button"
// //                          onClick={() => setFormData({...formData, hora: h})}
// //                          className={`py-3 rounded-xl text-xs font-black transition-all border-2 ${
// //                            formData.hora === h 
// //                            ? "bg-blue-600 text-white border-blue-600 shadow-lg scale-105" 
// //                            : "bg-white text-blue-600 border-blue-100 hover:border-blue-300 hover:bg-blue-50"
// //                          }`}
// //                        >
// //                          {h}
// //                        </button>
// //                      ))}
// //                    </div>
// //                 </div>
// //               </div>
// //             </div>

// //             {/* MOTIVO */}
// //             <div className="space-y-3">
// //               <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Motivo de la Consulta</label>
// //               <textarea 
// //                 className="w-full p-6 border-2 rounded-[1.5rem] bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#1a4731] outline-none transition-all border-gray-100 shadow-inner font-medium" 
// //                 rows={2}
// //                 placeholder="Indique brevemente el motivo..."
// //                 onChange={(e) => setFormData({...formData, motivo: e.target.value})}
// //               />
// //             </div>

// //             <Button 
// //               disabled={loading || !seleccionadoId}
// //               type="submit" 
// //               className="w-full py-10 text-xl font-black bg-[#1a4731] hover:bg-[#143625] rounded-[1.5rem] shadow-xl transition-all hover:scale-[1.01] uppercase tracking-widest disabled:opacity-30"
// //             >
// //               {loading ? "GUARDANDO..." : "PROGRAMAR CITA AHORA"}
// //             </Button>
// //           </form>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// import { useState, useEffect } from "react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Search, Calendar, UserCheck, Stethoscope } from "lucide-react";
// import api from "@/api/axiosConfig";
// import { combineFechaHoraForApi } from "@/modules/citas/utils/combineFechaHora";
// import { agendarCita } from "@/services/citaService"; 
// import { consultarEmpleados } from "@/services/empleadoService"; 

// export default function CitaRegistrar() {
//   const [loading, setLoading] = useState(false);
//   const [busqueda, setBusqueda] = useState("");
//   const [clientesFiltrados, setClientesFiltrados] = useState<any[]>([]);
//   const [optometristas, setOptometristas] = useState<any[]>([]);
//   const [seleccionadoId, setSeleccionadoId] = useState<number | null>(null);
//   const [nombreSeleccionado, setNombreSeleccionado] = useState("");

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

//   // Cargar Optometristas
//   useEffect(() => {
//     const cargarOptometristas = async () => {
//       try {
//         const empleados = await consultarEmpleados();
//         // Filtramos por el rol correspondiente (ajusta según tu JSON de respuesta)
//         const listaOpto = empleados.filter((item: any) => 
//           item.rol_nombre === "optometrista" || item.rol === "optometrista"
//         );
//         setOptometristas(listaOpto.length > 0 ? listaOpto : empleados);
//       } catch (err) {
//         console.error("Error al cargar profesionales", err);
//       }
//     };
//     cargarOptometristas();
//   }, []);

//   // Búsqueda de clientes con Debounce
//   useEffect(() => {
//   const delayDebounceFn = setTimeout(async () => {
//     // Si la búsqueda es vacía, traemos todo. Si no, filtramos.
//     const endpoint = busqueda 
//       ? `cliente/?search=${encodeURIComponent(busqueda)}` 
//       : `cliente/`;

//     try {
//       const res = await api.get(endpoint);
//       const data = Array.isArray(res.data) ? res.data : (res.data.results || []);
//       setClientesFiltrados(data);
//     } catch (err) {
//       console.error(err);
//     }
//   }, 500); // <--- Súbelo a 500 para que no sea tan "nervioso"

//   return () => clearTimeout(delayDebounceFn);
// }, [busqueda]);


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
      
//       // Llamada a tu función agendarCita
//       await agendarCita({
//         cliente: formData.cliente,
//         usuario: Number(formData.usuario), // ID del Optometrista
//         fecha: fechaFinal,
//         motivo: formData.motivo,
//         estado_cita: formData.estado_cita as any,
//       });

//       alert("¡Cita programada con éxito!");
      
//       // Limpiar formulario
//       setFormData({ cliente: null, usuario: "", fecha: "", hora: "", motivo: "", estado_cita: "A" });
//       setSeleccionadoId(null);
//       setNombreSeleccionado("");
//       setBusqueda("");
//       setClientesFiltrados([]);
      
//     } catch (err: any) {
//       // Manejo de errores del Serializer (como la hora ocupada)
//       const errorMsg = err?.fecha?.[0] || err?.detail || "Error al procesar la cita.";
//       alert(errorMsg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-10 max-w-7xl mx-auto">
//       <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden">
        
//         {/* HEADER */}
//         <div className="bg-[#1a4731] p-8 text-white flex justify-between items-center">
//           <div>
//             <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
//               <Calendar className="w-10 h-10 text-green-400" />
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

//         <div className="p-10">
//           <form onSubmit={handleAuthSubmit} className="space-y-10">
            
//             {/* BUSCADOR */}
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
//               <div className="space-y-3">
//                 <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">1. Localizar Paciente</label>
//                 <div className="relative">
//                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
//                   <Input 
//                     placeholder="Cédula o Nombre..."
//                     value={busqueda}
//                     onChange={(e) => setBusqueda(e.target.value)}
//                     className="pl-12 py-7 rounded-2xl border-gray-100 bg-gray-50 focus:bg-white shadow-sm"
//                   />
//                 </div>
//               </div>

//               <div className="lg:col-span-2">
//                 <div className="border border-gray-100 rounded-3xl overflow-hidden bg-gray-50/50 max-h-[160px] overflow-y-auto shadow-inner">
//                   <table className="w-full text-sm text-left">
//                     <tbody className="divide-y divide-gray-100">
//                       {clientesFiltrados.map((c) => (
//                         <tr key={c.id} className={seleccionadoId === c.id ? "bg-green-50" : "hover:bg-white"}>
//                           <td className="p-4 font-bold text-gray-700">{c.nombre} {c.apellido}</td>
//                           <td className="p-4 text-gray-500 font-medium">{c.identificacion || c.cedula}</td>
//                           <td className="p-4 text-right">
//                             <Button
//                               type="button"
//                               onClick={() => handleSeleccionarCliente(c)}
//                               className={`rounded-xl px-5 h-9 font-black text-[10px] ${seleccionadoId === c.id ? "bg-[#1a4731]" : "bg-transparent border-2 border-[#1a4731] text-[#1a4731]"}`}
//                             >
//                               {seleccionadoId === c.id ? "LISTO" : "SELECCIONAR"}
//                             </Button>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </div>

//             <hr className="border-gray-100" />

//             {/* OPTOMETRISTA Y MOTIVO */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
//               <div className="space-y-3">
//                 <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
//                   <Stethoscope className="w-4 h-4" /> 2. Optometrista Asignado
//                 </label>
//                 <select
//                   required
//                   value={formData.usuario}
//                   onChange={(e) => setFormData({...formData, usuario: e.target.value})}
//                   className="w-full p-5 rounded-2xl border-2 border-gray-50 bg-gray-50 font-bold text-[#1a4731] focus:border-green-500 outline-none transition-all cursor-pointer"
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
//                 <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">3. Detalles / Motivo</label>
//                 <Input 
//                   placeholder="Ej. Examen de vista, consulta de control..."
//                   value={formData.motivo}
//                   onChange={(e) => setFormData({...formData, motivo: e.target.value})}
//                   className="py-8 rounded-2xl border-gray-100 bg-gray-50 focus:bg-white shadow-sm"
//                 />
//               </div>
//             </div>

//             {/* FECHA Y HORA */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
//               <div className="p-8 border-2 border-gray-50 rounded-[2.5rem] bg-gray-50/20">
//                 <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-4 block">Fecha Programada</label>
//                 <Input 
//                   type="date" 
//                   min={getTodayString()}
//                   onChange={(e) => setFormData({...formData, fecha: e.target.value})}
//                   className="rounded-2xl border-gray-100 py-8 text-2xl font-black text-[#1a4731] text-center"
//                 />
//               </div>

//               <div className="p-8 border-2 border-blue-50 rounded-[2.5rem] bg-blue-50/10">
//                 <label className="text-[10px] font-black uppercase text-blue-400 tracking-[0.2em] mb-4 block text-center">Bloque de Horario</label>
//                 <div className="grid grid-cols-3 gap-3">
//                   {horasPermitidas.map((h) => (
//                     <button
//                       key={h}
//                       type="button"
//                       onClick={() => setFormData({...formData, hora: h})}
//                       className={`py-3 rounded-xl text-[11px] font-black transition-all border-2 ${
//                         formData.hora === h 
//                         ? "bg-blue-600 text-white border-blue-600 shadow-md scale-105" 
//                         : "bg-white text-blue-600 border-blue-50 hover:border-blue-200"
//                       }`}
//                     >
//                       {h}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             <Button 
//               disabled={loading || !seleccionadoId || !formData.usuario}
//               type="submit" 
//               className="w-full py-12 text-xl font-black bg-[#1a4731] hover:bg-[#0f2d1f] text-white rounded-[2rem] shadow-2xl transition-all active:scale-95 disabled:opacity-20"
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
import { Search, Calendar, Stethoscope } from "lucide-react";
import api from "@/api/axiosConfig";
import { combineFechaHoraForApi } from "@/modules/citas/utils/combineFechaHora";
import { agendarCita } from "@/services/citaService"; 
import { consultarEmpleados } from "@/services/empleadoService"; 

export default function CitaRegistrar() {
  const [loading, setLoading] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [clientesFiltrados, setClientesFiltrados] = useState<any[]>([]);
  const [optometristas, setOptometristas] = useState<any[]>([]);
  const [seleccionadoId, setSeleccionadoId] = useState<number | null>(null);
  const [nombreSeleccionado, setNombreSeleccionado] = useState("");

  const [formData, setFormData] = useState({
    cliente: null as number | null,
    usuario: "" as string | number, 
    fecha: "",
    hora: "",
    motivo: "",
    estado_cita: "A",
  });

  const getTodayString = () => new Date().toISOString().split('T')[0];

  const [horasPermitidas] = useState<string[]>([
    "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
    "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"
  ]);

  // 1. Cargar Optometristas al montar el componente
  useEffect(() => {
    const cargarOptometristas = async () => {
      try {
        const empleados = await consultarEmpleados();
        // Filtramos para asegurar que solo aparezcan optometristas
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

  // 2. Búsqueda de clientes con Debounce de 500ms (Optimizado)
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      // Si no hay búsqueda, traemos los recientes. Si hay, filtramos por ?search
      const endpoint = busqueda.trim() 
        ? `cliente/?search=${encodeURIComponent(busqueda)}` 
        : `cliente/`;

      try {
        const res = await api.get(endpoint);
        const data = Array.isArray(res.data) ? res.data : (res.data.results || []);
        // Limitamos a los primeros 8 para que el renderizado sea instantáneo
        setClientesFiltrados(data.slice(0, 8));
      } catch (err) {
        console.error("Error en la búsqueda:", err);
      }
    }, 500); 

    return () => clearTimeout(delayDebounceFn);
  }, [busqueda]);


  const handleSeleccionarCliente = (cliente: any) => {
    setSeleccionadoId(cliente.id);
    setNombreSeleccionado(`${cliente.nombre} ${cliente.apellido}`);
    setFormData((prev) => ({ ...prev, cliente: cliente.id }));
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.cliente || !formData.fecha || !formData.hora || !formData.usuario) {
      return alert("Faltan datos: Asegúrate de elegir Paciente, Optometrista, Fecha y Hora.");
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

      alert("¡Cita programada con éxito!");
      
      // Limpiar formulario tras éxito
      setFormData({ cliente: null, usuario: "", fecha: "", hora: "", motivo: "", estado_cita: "A" });
      setSeleccionadoId(null);
      setNombreSeleccionado("");
      setBusqueda("");
      setClientesFiltrados([]);
      
    } catch (err: any) {
      // Intenta capturar el error específico del backend (ej: "Esta hora ya está ocupada")
      const errorMsg = err?.response?.data?.fecha?.[0] || err?.response?.data?.detail || "Error al procesar la cita.";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 max-w-7xl mx-auto">
      <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden">
        
        {/* HEADER */}
        <div className="bg-[#1a4731] p-8 text-white flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
              <Calendar className="w-10 h-10 text-green-400" />
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

        <div className="p-10">
          <form onSubmit={handleAuthSubmit} className="space-y-10">
            
            {/* BUSCADOR */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              <div className="space-y-3">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">1. Localizar Paciente</label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input 
                    placeholder="Cédula o Nombre..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="pl-12 py-7 rounded-2xl border-gray-100 bg-gray-50 focus:bg-white shadow-sm"
                  />
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="border border-gray-100 rounded-3xl overflow-hidden bg-gray-50/50 max-h-[160px] overflow-y-auto shadow-inner">
                  <table className="w-full text-sm text-left">
                    <tbody className="divide-y divide-gray-100">
                      {clientesFiltrados.map((c) => (
                        <tr key={c.id} className={seleccionadoId === c.id ? "bg-green-50" : "hover:bg-white transition-colors"}>
                          <td className="p-4 font-bold text-gray-700">{c.nombre} {c.apellido}</td>
                          <td className="p-4 text-gray-500 font-medium">{c.identificacion}</td>
                          <td className="p-4 text-right">
                            <Button
                              type="button"
                              onClick={() => handleSeleccionarCliente(c)}
                              className={`rounded-xl px-5 h-9 font-black text-[10px] transition-all ${
                                seleccionadoId === c.id 
                                ? "bg-[#1a4731] text-white" 
                                : "bg-transparent border-2 border-[#1a4731] text-[#1a4731] hover:bg-[#1a4731] hover:text-white"
                              }`}
                            >
                              {seleccionadoId === c.id ? "LISTO" : "SELECCIONAR"}
                            </Button>
                          </td>
                        </tr>
                      ))}
                      {clientesFiltrados.length === 0 && busqueda && (
                        <tr>
                          <td colSpan={3} className="p-6 text-center text-gray-400 text-xs italic">
                            No se encontraron resultados para "{busqueda}"
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* OPTOMETRISTA Y MOTIVO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Stethoscope className="w-4 h-4" /> 2. Optometrista Asignado
                </label>
                <select
                  required
                  value={formData.usuario}
                  onChange={(e) => setFormData({...formData, usuario: e.target.value})}
                  className="w-full p-5 rounded-2xl border-2 border-gray-50 bg-gray-50 font-bold text-[#1a4731] focus:border-green-500 outline-none transition-all cursor-pointer"
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
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">3. Detalles / Motivo</label>
                <Input 
                  placeholder="Ej. Examen de vista, consulta de control..."
                  value={formData.motivo}
                  onChange={(e) => setFormData({...formData, motivo: e.target.value})}
                  className="py-8 rounded-2xl border-gray-100 bg-gray-50 focus:bg-white shadow-sm"
                />
              </div>
            </div>

            {/* FECHA Y HORA */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="p-8 border-2 border-gray-50 rounded-[2.5rem] bg-gray-50/20">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-4 block">Fecha Programada</label>
                <Input 
                  type="date" 
                  min={getTodayString()}
                  value={formData.fecha}
                  onChange={(e) => setFormData({...formData, fecha: e.target.value})}
                  className="rounded-2xl border-gray-100 py-8 text-2xl font-black text-[#1a4731] text-center"
                />
              </div>

              <div className="p-8 border-2 border-blue-50 rounded-[2.5rem] bg-blue-50/10">
                <label className="text-[10px] font-black uppercase text-blue-400 tracking-[0.2em] mb-4 block text-center">Bloque de Horario</label>
                <div className="grid grid-cols-3 gap-3">
                  {horasPermitidas.map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setFormData({...formData, hora: h})}
                      className={`py-3 rounded-xl text-[11px] font-black transition-all border-2 ${
                        formData.hora === h 
                        ? "bg-blue-600 text-white border-blue-600 shadow-md scale-105" 
                        : "bg-white text-blue-600 border-blue-50 hover:border-blue-200"
                      }`}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <Button 
              disabled={loading || !seleccionadoId || !formData.usuario}
              type="submit" 
              className="w-full py-12 text-xl font-black bg-[#1a4731] hover:bg-[#0f2d1f] text-white rounded-[2rem] shadow-2xl transition-all active:scale-95 disabled:opacity-20"
            >
              {loading ? "PROCESANDO..." : "CONFIRMAR Y AGENDAR CITA"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}