

// import { useState, useEffect } from "react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Search, User, Calendar, CheckCircle2 } from "lucide-react"; 
// import { registrarRecetaCompleta } from "@/services/recetaService"; 
// import api from "@/api/axiosConfig"; 

// export default function RecetaRegistrar() {
//   const [modo, setModo] = useState<"CITA" | "CLIENTE">("CITA");
//   const [loading, setLoading] = useState(false);
  
//   const [formData, setFormData] = useState({
//     cita: null as number | null,
//     cliente: null as number | null,
//     observaciones: "",
//     od: { esfera: 0, cilindro: 0, eje: 0, adicion: 0, dp: 0 },
//     oi: { esfera: 0, cilindro: 0, eje: 0, adicion: 0, dp: 0 },
//   });

//   const [citasCompletadas, setCitasCompletadas] = useState<any[]>([]);
//   const [busqueda, setBusqueda] = useState("");
//   const [clientesFiltrados, setClientesFiltrados] = useState<any[]>([]);
//   const [seleccionadoId, setSeleccionadoId] = useState<number | null>(null);

//   // 1. Cargar Citas (Filtro por estado COM)
//   useEffect(() => {
//     if (modo === "CITA") {
//       api.get("cita/") 
//         .then((res) => {
//           const completadas = res.data.filter((c: any) => c.estado_cita === "COM");
//           setCitasCompletadas(completadas);
//         })
//         .catch(() => console.error("Error al cargar citas"));
//     }
//   }, [modo]);

//   // 2. Filtro dinámico para Clientes o Citas
//   useEffect(() => {
//     if (modo === "CLIENTE" && busqueda.length > 2) {
//       const delayDebounceFn = setTimeout(async () => {
//         try {
//           const res = await api.get(`cliente/?search=${busqueda}`);
//           setClientesFiltrados(res.data);
//         } catch (err) {
//           console.error(err);
//         }
//       }, 300);
//       return () => clearTimeout(delayDebounceFn);
//     }
//   }, [busqueda, modo]);

//   const handleSeleccionar = (id: number) => {
//     setSeleccionadoId(id);
//     if (modo === "CITA") setFormData(prev => ({ ...prev, cita: id, cliente: null }));
//     else setFormData(prev => ({ ...prev, cliente: id, cita: null }));
//   };

//   // CONTROL ESTRICTO DE INPUTS NUMÉRICOS
//   const handleInputChange = (ojo: "od" | "oi", campo: string, valor: string) => {
//     if (valor === "") {
//       setFormData((prev) => ({
//         ...prev,
//         [ojo]: { ...prev[ojo], [campo]: 0 },
//       }));
//       return;
//     }

//     const numeroParseado = parseFloat(valor);

//     if (!isNaN(numeroParseado)) {
//       setFormData((prev) => ({
//         ...prev,
//         [ojo]: { ...prev[ojo], [campo]: numeroParseado },
//       }));
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!seleccionadoId) return alert("Por favor, selecciona un cliente o cita primero.");

//     /* --- VALIDACIONES --- */
//     if (formData.od.adicion < 0 || formData.od.adicion > 3 || formData.oi.adicion < 0 || formData.oi.adicion > 3) {
//       return alert("La adición de ambos ojos debe estar entre un valor mínimo de 0 y un máximo de 3.");
//     }

//     if (formData.od.eje < 1 || formData.od.eje > 180 || formData.oi.eje < 1 || formData.oi.eje > 180) {
//       return alert("El eje de ambos ojos debe estar en un rango de 1° a 180°.");
//     }

//     if (formData.od.dp !== formData.oi.dp) {
//       return alert("La Distancia Pupilar (D.P.) debe ser exactamente igual para el Ojo Derecho y el Ojo Izquierdo.");
//     }

//     setLoading(true);
//     const payload = {
//       cita: modo === "CITA" ? formData.cita : null,
//       cliente: modo === "CLIENTE" ? formData.cliente : null,
//       observaciones: formData.observaciones,
//       rv_detalle_data: [
//         {
//           oculus: { descripcion: "Ojo Derecho", alias: "OD", esfera: formData.od.esfera, cilindro: formData.od.cilindro, eje: formData.od.eje },
//           adicion: formData.od.adicion,
//           distancia_pupilar: formData.od.dp
//         },
//         {
//           oculus: { descripcion: "Ojo Izquierdo", alias: "OI", esfera: formData.oi.esfera, cilindro: formData.oi.cilindro, eje: formData.oi.eje },
//           adicion: formData.oi.adicion,
//           distancia_pupilar: formData.oi.dp
//         }
//       ]
//     };

//     try {
//       await registrarRecetaCompleta(payload);
//       alert("Receta registrada con éxito en Opti-Samuel");
//       setFormData({
//         cita: null,
//         cliente: null,
//         observaciones: "",
//         od: { esfera: 0, cilindro: 0, eje: 0, adicion: 0, dp: 0 },
//         oi: { esfera: 0, cilindro: 0, eje: 0, adicion: 0, dp: 0 },
//       });
//       setSeleccionadoId(null);
//       setBusqueda("");
//       setClientesFiltrados([]);
//       if (modo === "CITA") {
//         api
//           .get("cita/")
//           .then((res) => {
//             const completadas = res.data.filter((c: { estado_cita: string }) => c.estado_cita === "COM");
//             setCitasCompletadas(completadas);
//           })
//           .catch(() => console.error("Error al recargar citas"));
//       }
//     } catch (err) {
//       alert("Error al guardar la receta. Revisa los permisos.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-3 md:p-10 max-w-7xl mx-auto dark:bg-[#0a0f0a]">
//       <div className="bg-white dark:bg-[#1a2a20] rounded-[2rem] shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden">
        
//         {/* ENCABEZADO TIPO DASHBOARD */}
//         <div className="bg-[#1a4731] p-8 text-white">
//           <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
//             <CheckCircle2 className="w-10 h-10 text-green-400" />
//             Nueva Receta Médica
//           </h2>
//           <p className="text-green-100/70 mt-1 font-medium">Registro de optometría y salud visual</p>
//         </div>

//         <div className="p-4 md:p-10">
//           {/* SELECTOR DE MODO PROFESIONAL */}
//           <div className="flex bg-gray-100 dark:bg-[#0f1a14] p-1.5 rounded-2xl w-fit mb-10">
//             <button
//               type="button"
//               onClick={() => { setModo("CITA"); setSeleccionadoId(null); setBusqueda(""); }}
//               className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${modo === "CITA" ? "bg-white dark:bg-[#1a2a20] text-[#1a4731] dark:text-emerald-100 shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"}`}
//             >
//               <Calendar className="w-5 h-5" /> Por Cita
//             </button>
//             <button
//               type="button"
//               onClick={() => { setModo("CLIENTE"); setSeleccionadoId(null); setBusqueda(""); }}
//               className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${modo === "CLIENTE" ? "bg-white dark:bg-[#1a2a20] text-[#1a4731] dark:text-emerald-100 shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"}`}
//             >
//               <User className="w-5 h-5" /> Cliente Externo
//             </button>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-12">
            
//             {/* SECCIÓN DE BÚSQUEDA Y SELECCIÓN */}
//             <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
//               <div className="lg:col-span-1 space-y-4">
//                 <h3 className="font-bold text-gray-800 dark:text-gray-200 text-lg flex items-center gap-2">
//                   <Search className="w-5 h-5 text-green-700" />
//                   {modo === "CITA" ? "Filtrar Citas Pendientes" : "Buscar Cliente"}
//                 </h3>
//                 <Input 
//                   placeholder={modo === "CITA" ? "Nombre del paciente..." : "Cédula o Nombre..."}
//                   value={busqueda}
//                   onChange={(e) => setBusqueda(e.target.value)}
//                   className="rounded-xl border-gray-200 dark:border-gray-700 py-6 shadow-sm focus:ring-2 focus:ring-green-600"
//                 />
//                 <p className="text-xs text-gray-400 dark:text-gray-300 italic">
//                   {modo === "CITA" ? "Mostrando solo citas con estado 'Completada'." : "Escribe al menos 3 caracteres para buscar."}
//                 </p>
//               </div>

//               <div className="lg:col-span-2">
//                 <div className="border rounded-2xl overflow-y-auto shadow-inner bg-gray-50 dark:bg-[#0f1a14] max-h-[250px]">
//                   <table className="w-full text-left border-collapse">
//                     <thead className="bg-white dark:bg-[#1a2a20] sticky top-0 shadow-sm">
//                       <tr>
//                         <th className="p-4 text-xs font-black uppercase text-gray-400 dark:text-gray-300">Nombre Completo</th>
//                         <th className="p-4 text-xs font-black uppercase text-gray-400 dark:text-gray-300">{modo === "CITA" ? "Fecha Cita" : "Identificación"}</th>
//                         <th className="p-4 text-xs font-black uppercase text-gray-400 dark:text-gray-300 text-center">Acción</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {(modo === "CITA" ? citasCompletadas : clientesFiltrados)
//                         .filter(item => {
//                            const nombre = modo === "CITA" 
//                              ? `${item.cliente_data?.nombre} ${item.cliente_data?.apellido}` 
//                              : `${item.nombre} ${item.apellido}`;
//                            return nombre.toLowerCase().includes(busqueda.toLowerCase());
//                         })
//                         .map((item) => (
//                         <tr key={item.id} className={`border-b transition-colors ${seleccionadoId === item.id ? 'bg-green-50 dark:bg-emerald-900/20' : 'bg-white dark:bg-[#1a2a20] hover:bg-gray-50 dark:hover:bg-[#0f1a14]'}`}>
//                           <td className="p-4 font-bold text-gray-700 dark:text-gray-300">
//                             {modo === "CITA" ? `${item.cliente_data?.nombre} ${item.cliente_data?.apellido}` : `${item.nombre} ${item.apellido}`}
//                           </td>
//                           <td className="p-4 text-sm text-gray-500 dark:text-gray-400">
//                             {modo === "CITA" ? new Date(item.fecha).toLocaleDateString() : item.identificacion}
//                           </td>
//                           <td className="p-4 text-center">
//                             <Button
//                               type="button"
//                               onClick={() => handleSeleccionar(item.id)}
//                               variant={seleccionadoId === item.id ? "default" : "outline"}
//                               className={`rounded-full px-6 h-8 text-xs ${seleccionadoId === item.id ? 'bg-green-700' : 'border-green-700 text-green-700'}`}
//                             >
//                               {seleccionadoId === item.id ? "Seleccionado" : "Elegir"}
//                             </Button>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                   {((modo === "CITA" ? citasCompletadas : clientesFiltrados).length === 0) && (
//                     <div className="p-10 text-center text-gray-400 dark:text-gray-300 text-sm"></div>
//                   )}
//                 </div>
//               </div>
//             </section>

//             <hr className="border-gray-100 dark:border-white/10" />

//             {/* SECCIÓN DE DATOS ÓPTICOS */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              
//               {/* OJO DERECHO */}
//               <div className="relative group">
//                 <div className="absolute -top-4 left-6 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-black shadow-lg">OJO DERECHO (OD)</div>
//                 <div className="p-8 pt-10 border-2 border-blue-100 dark:border-blue-800/30 rounded-[2rem] bg-blue-50/5 dark:bg-blue-900/10 space-y-6">
//                   <div className="grid grid-cols-3 gap-2 md:gap-6">
//                     <div className="space-y-1"> 
//                       <label className="text-[10px] font-black text-blue-900/50 dark:text-blue-300/50 uppercase ml-1">Esfera</label> 
//                       <Input 
//                         type="number" 
//                         step="0.25" 
//                         value={formData.od.esfera || ""}
//                         onKeyDown={(e) => ["e", "E", "+"].includes(e.key) && e.preventDefault()}
//                         className="rounded-xl border-blue-100 dark:border-blue-800/30 focus:border-blue-500" 
//                         onChange={(e) => handleInputChange("od", "esfera", e.target.value)} 
//                       /> 
//                     </div>
//                     <div className="space-y-1"> 
//                       <label className="text-[10px] font-black text-blue-900/50 dark:text-blue-300/50 uppercase ml-1">Cilindro</label> 
//                       <Input 
//                         type="number" 
//                         step="0.25" 
//                         value={formData.od.cilindro || ""}
//                         onKeyDown={(e) => ["e", "E", "+"].includes(e.key) && e.preventDefault()}
//                         className="rounded-xl border-blue-100 dark:border-blue-800/30 focus:border-blue-500" 
//                         onChange={(e) => handleInputChange("od", "cilindro", e.target.value)} 
//                       /> 
//                     </div>
//                     <div className="space-y-1"> 
//                       <label className="text-[10px] font-black text-blue-900/50 dark:text-blue-300/50 uppercase ml-1">Eje (°)</label> 
//                       <Input 
//                         type="number" 
//                         min="0" 
//                         max="180" 
//                         step="15" 
//                         value={formData.od.eje || ""}
//                         onKeyDown={(e) => ["e", "E", "+", "-", "."].includes(e.key) && e.preventDefault()}
//                         className="rounded-xl border-blue-100 dark:border-blue-800/30 focus:border-blue-500" 
//                         onChange={(e) => handleInputChange("od", "eje", e.target.value)} 
//                       /> 
//                     </div>
//                   </div>
//                   <div className="grid grid-cols-2 gap-2 md:gap-6 pt-2">
//                     <div className="space-y-1"> 
//                       <label className="text-[10px] font-black text-blue-900/50 dark:text-blue-300/50 uppercase ml-1">Adición</label> 
//                       <Input 
//                         type="number" 
//                         step="0.25" 
//                         min="0" 
//                         max="3" 
//                         value={formData.od.adicion || ""}
//                         onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}
//                         className="rounded-xl border-blue-100 dark:border-blue-800/30 focus:border-blue-500" 
//                         onChange={(e) => handleInputChange("od", "adicion", e.target.value)} 
//                       /> 
//                     </div>
//                     <div className="space-y-1"> 
//                       <label className="text-[10px] font-black text-blue-900/50 dark:text-blue-300/50 uppercase ml-1">Distancia Pupilar</label> 
//                       <Input 
//                         type="number" 
//                         value={formData.od.dp || ""}
//                         onKeyDown={(e) => ["e", "E", "+", "-", "."].includes(e.key) && e.preventDefault()}
//                         className="rounded-xl border-blue-100 dark:border-blue-800/30 focus:border-blue-500" 
//                         onChange={(e) => handleInputChange("od", "dp", e.target.value)} 
//                       /> 
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* OJO IZQUIERDO */}
//               <div className="relative group">
//                 <div className="absolute -top-4 left-6 bg-green-600 text-white px-4 py-1 rounded-full text-xs font-black shadow-lg">OJO IZQUIERDO (OI)</div>
//                 <div className="p-8 pt-10 border-2 border-green-100 dark:border-emerald-800/30 rounded-[2rem] bg-green-50/5 dark:bg-emerald-900/10 space-y-6">
//                   <div className="grid grid-cols-3 gap-2 md:gap-6">
//                     <div className="space-y-1"> 
//                       <label className="text-[10px] font-black text-green-900/50 dark:text-emerald-300/50 uppercase ml-1">Esfera</label> 
//                       <Input 
//                         type="number" 
//                         step="0.25" 
//                         value={formData.oi.esfera || ""}
//                         onKeyDown={(e) => ["e", "E", "+"].includes(e.key) && e.preventDefault()}
//                         className="rounded-xl border-green-100 dark:border-emerald-800/30 focus:border-blue-500" 
//                         onChange={(e) => handleInputChange("oi", "esfera", e.target.value)} 
//                       /> 
//                     </div>
//                     <div className="space-y-1"> 
//                       <label className="text-[10px] font-black text-green-900/50 dark:text-emerald-300/50 uppercase ml-1">Cilindro</label> 
//                       <Input 
//                         type="number" 
//                         step="0.25" 
//                         value={formData.oi.cilindro || ""}
//                         onKeyDown={(e) => ["e", "E", "+"].includes(e.key) && e.preventDefault()}
//                         className="rounded-xl border-green-100 dark:border-emerald-800/30 focus:border-blue-500" 
//                         onChange={(e) => handleInputChange("oi", "cilindro", e.target.value)} 
//                       /> 
//                     </div>
//                     <div className="space-y-1"> 
//                       <label className="text-[10px] font-black text-green-900/50 dark:text-emerald-300/50 uppercase ml-1">Eje (°)</label> 
//                       <Input 
//                         type="number" 
//                         min="0" 
//                         max="180" 
//                         step="15" 
//                         value={formData.oi.eje || ""}
//                         onKeyDown={(e) => ["e", "E", "+", "-", "."].includes(e.key) && e.preventDefault()}
//                         className="rounded-xl border-green-100 dark:border-emerald-800/30 focus:border-blue-500" 
//                         onChange={(e) => handleInputChange("oi", "eje", e.target.value)} 
//                       /> 
//                     </div>
//                   </div>
//                   <div className="grid grid-cols-2 gap-2 md:gap-6 pt-2">
//                     <div className="space-y-1"> 
//                       <label className="text-[10px] font-black text-green-900/50 dark:text-emerald-300/50 uppercase ml-1">Adición</label> 
//                       <Input 
//                         type="number" 
//                         step="0.25" 
//                         min="0" 
//                         max="3" 
//                         value={formData.oi.adicion || ""}
//                         onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}
//                         className="rounded-xl border-green-100 dark:border-emerald-800/30 focus:border-blue-500" 
//                         onChange={(e) => handleInputChange("oi", "adicion", e.target.value)} 
//                       /> 
//                     </div>
//                     <div className="space-y-1"> 
//                       <label className="text-[10px] font-black text-green-900/50 dark:text-emerald-300/50 uppercase ml-1">Distancia Pupilar</label> 
//                       <Input 
//                         type="number" 
//                         value={formData.oi.dp || ""}
//                         onKeyDown={(e) => ["e", "E", "+", "-", "."].includes(e.key) && e.preventDefault()}
//                         className="rounded-xl border-green-100 dark:border-emerald-800/30 focus:border-blue-500" 
//                         onChange={(e) => handleInputChange("oi", "dp", e.target.value)} 
//                       /> 
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="space-y-3">
//               <div className="flex justify-between items-center">
//                 <label className="text-sm font-black text-gray-400 dark:text-gray-300 uppercase tracking-widest ml-1">Observaciones Finales</label>
//                 <span className={`text-xs font-bold ${formData.observaciones.length > 240 ? 'text-red-500' : 'text-gray-400 dark:text-gray-300'}`}>
//                   {formData.observaciones.length} / 255
//                 </span>
//               </div>
//               <textarea 
//                 className="w-full p-6 border rounded-[1.5rem] bg-gray-50 dark:bg-[#0f1a14] focus:bg-white dark:focus:bg-[#1a2a20] focus:ring-2 focus:ring-green-600 outline-none transition-all border-gray-100 dark:border-gray-700 shadow-inner" 
//                 rows={3}
//                 maxLength={255}
//                 placeholder="Ej: El paciente presenta fatiga ocular. Se recomienda filtro azul..."
//                 value={formData.observaciones}
//                 onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
//               />
//             </div>

//             <Button 
//               disabled={loading || !seleccionadoId}
//               type="submit" 
//               className="w-full py-10 text-xl font-black bg-[#1a4731] hover:bg-[#143625] rounded-[1.5rem] shadow-xl transition-all hover:scale-[1.01] uppercase tracking-widest disabled:opacity-50"
//             >
//               {loading ? "PROCESANDO REGISTRO..." : "GUARDAR RECETA EN HISTORIAL"}
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
import { Search, User, Calendar, CheckCircle2 } from "lucide-react"; 
import { registrarRecetaCompleta } from "@/services/recetaService"; 
import api from "@/api/axiosConfig"; 

export default function RecetaRegistrar() {
  const [modo, setModo] = useState<"CITA" | "CLIENTE">("CITA");
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    cita: null as number | null,
    cliente: null as number | null,
    observaciones: "",
    od: { esfera: 0, cilindro: 0, eje: 0, adicion: 0, dp: 0 },
    oi: { esfera: 0, cilindro: 0, eje: 0, adicion: 0, dp: 0 },
  });

  const [citasCompletadas, setCitasCompletadas] = useState<any[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [clientesFiltrados, setClientesFiltrados] = useState<any[]>([]);
  const [seleccionadoId, setSeleccionadoId] = useState<number | null>(null);

  // 1. Cargar Citas (Filtro por estado COM)
  useEffect(() => {
    if (modo === "CITA") {
      api.get("cita/") 
        .then((res) => {
          const completadas = res.data.filter((c: any) => c.estado_cita === "COM");
          setCitasCompletadas(completadas);
        })
        .catch(() => console.error("Error al cargar citas"));
    }
  }, [modo]);

  // 2. Filtro dinámico para Clientes o Citas
  useEffect(() => {
    if (modo === "CLIENTE" && busqueda.length > 2) {
      const delayDebounceFn = setTimeout(async () => {
        try {
          const res = await api.get(`cliente/?search=${busqueda}`);
          setClientesFiltrados(res.data);
        } catch (err) {
          console.error(err);
        }
      }, 300);
      return () => clearTimeout(delayDebounceFn);
    }
  }, [busqueda, modo]);

  const handleSeleccionar = (id: number) => {
    setSeleccionadoId(id);
    if (modo === "CITA") setFormData(prev => ({ ...prev, cita: id, cliente: null }));
    else setFormData(prev => ({ ...prev, cliente: id, cita: null }));
  };

  // CONTROL ESTRICTO DE INPUTS NUMÉRICOS
  const handleInputChange = (ojo: "od" | "oi", campo: string, valor: string) => {
    if (valor === "") {
      setFormData((prev) => ({
        ...prev,
        [ojo]: { ...prev[ojo], [campo]: 0 },
      }));
      return;
    }

    const numeroParseado = parseFloat(valor);

    if (!isNaN(numeroParseado)) {
      setFormData((prev) => ({
        ...prev,
        [ojo]: { ...prev[ojo], [campo]: numeroParseado },
      }));
    }
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!seleccionadoId) return alert("Por favor, selecciona un cliente o cita primero.");

  //   /* --- VALIDACIONES --- */
  //   if (formData.od.adicion < 0 || formData.od.adicion > 3 || formData.oi.adicion < 0 || formData.oi.adicion > 3) {
  //     return alert("La adición de ambos ojos debe estar entre un valor mínimo de 0 y un máximo de 3.");
  //   }

  //   if (formData.od.eje < 1 || formData.od.eje > 180 || formData.oi.eje < 1 || formData.oi.eje > 180) {
  //     return alert("El eje de ambos ojos debe estar en un rango de 1° a 180°.");
  //   }

  //   if (formData.od.dp !== formData.oi.dp) {
  //     return alert("La Distancia Pupilar (D.P.) debe ser exactamente igual para el Ojo Derecho y el Ojo Izquierdo.");
  //   }

  //   loading(true);
  //   const payload = {
  //     cita: modo === "CITA" ? formData.cita : null,
  //     cliente: modo === "CLIENTE" ? formData.cliente : null,
  //     observaciones: formData.observaciones,
  //     rv_detalle_data: [
  //       {
  //         oculus: { descripcion: "Ojo Derecho", alias: "OD", esfera: formData.od.esfera, cilindro: formData.od.cilindro, eje: formData.od.eje },
  //         adicion: formData.od.adicion,
  //         distancia_pupilar: formData.od.dp
  //       },
  //       {
  //         oculus: { descripcion: "Ojo Izquierdo", alias: "OI", esfera: formData.oi.esfera, cilindro: formData.oi.cilindro, eje: formData.oi.eje },
  //         adicion: formData.oi.adicion,
  //         distancia_pupilar: formData.oi.dp
  //       }
  //     ]
  //   };

  //   try {
  //     await registrarRecetaCompleta(payload);
  //     alert("Receta registrada con éxito en Opti-Samuel");
  //     setFormData({
  //       cita: null,
  //       cliente: null,
  //       observaciones: "",
  //       od: { esfera: 0, cilindro: 0, eje: 0, adicion: 0, dp: 0 },
  //       oi: { esfera: 0, cilindro: 0, eje: 0, adicion: 0, dp: 0 },
  //     });
  //     setSeleccionadoId(null);
  //     setBusqueda("");
  //     setClientesFiltrados([]);
  //     if (modo === "CITA") {
  //       api
  //         .get("cita/")
  //         .then((res) => {
  //           const completadas = res.data.filter((c: { estado_cita: string }) => c.estado_cita === "COM");
  //           setCitasCompletadas(completadas);
  //         })
  //         .catch(() => console.error("Error al recargar citas"));
  //     }
  //   } catch (err) {
  //     alert("Error al guardar la receta. Revisa los permisos.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!seleccionadoId) return alert("Por favor, selecciona un cliente o cita primero.");

    /* --- VALIDACIONES --- */
    if (formData.od.adicion < 0 || formData.od.adicion > 3 || formData.oi.adicion < 0 || formData.oi.adicion > 3) {
      return alert("La adición de ambos ojos debe estar entre un valor mínimo de 0 y un máximo de 3.");
    }

    if (formData.od.eje < 1 || formData.od.eje > 180 || formData.oi.eje < 1 || formData.oi.eje > 180) {
      return alert("El eje de ambos ojos debe estar en un rango de 1° a 180°.");
    }

    if (formData.od.dp !== formData.oi.dp) {
      return alert("La Distancia Pupilar (D.P.) debe ser exactamente igual para el Ojo Derecho y el Ojo Izquierdo.");
    }

    // CORREGIDO: Usar la función modificadora del estado
    setLoading(true); 

    const payload = {
      cita: modo === "CITA" ? formData.cita : null,
      cliente: modo === "CLIENTE" ? formData.cliente : null,
      observaciones: formData.observaciones,
      rv_detalle_data: [
        {
          oculus: { descripcion: "Ojo Derecho", alias: "OD", esfera: formData.od.esfera, cilindro: formData.od.cilindro, eje: formData.od.eje },
          adicion: formData.od.adicion,
          distancia_pupilar: formData.od.dp
        },
        {
          oculus: { descripcion: "Ojo Izquierdo", alias: "OI", esfera: formData.oi.esfera, cilindro: formData.oi.cilindro, eje: formData.oi.eje },
          adicion: formData.oi.adicion,
          distancia_pupilar: formData.oi.dp
        }
      ]
    };

    try {
      await registrarRecetaCompleta(payload);
      alert("Receta registrada con éxito en Opti-Samuel");
      
      // Reiniciar formulario...
      setFormData({
        cita: null,
        cliente: null,
        observaciones: "",
        od: { esfera: 0, cilindro: 0, eje: 0, adicion: 0, dp: 0 },
        oi: { esfera: 0, cilindro: 0, eje: 0, adicion: 0, dp: 0 },
      });
      setSeleccionadoId(null);
      setBusqueda("");
      setClientesFiltrados([]);
      
      if (modo === "CITA") {
        api.get("cita/")
          .then((res) => {
            const completadas = res.data.filter((c: { estado_cita: string }) => c.estado_cita === "COM");
            setCitasCompletadas(completadas);
          })
          .catch(() => console.error("Error al recargar citas"));
      }
    } catch (err) {
      alert("Error al guardar la receta. Revisa los permisos o los datos enviados.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3 md:p-10 max-w-7xl mx-auto dark:bg-[#0a0f0a]">
      <div className="bg-white dark:bg-[#1a2a20] rounded-[2rem] md:rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden">

        {/* HEADER (igual a CitasRegistrar) */}
        <div className="bg-[#1a4731] p-4 md:p-8 text-white flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h2 className="text-xl md:text-3xl font-black tracking-tight flex items-center gap-3">
              <CheckCircle2 className="w-8 md:w-10 h-8 md:h-10 text-green-400" />
              Nueva Receta Médica
            </h2>
            <p className="text-green-100/60 font-bold text-[10px] md:text-xs uppercase tracking-[0.3em] mt-1">Opti Samuel • 2026</p>
          </div>
          {seleccionadoId && (
            <div className="bg-white/10 px-6 py-3 rounded-2xl backdrop-blur-md border border-white/20">
              <p className="text-[10px] font-black text-green-300 uppercase">Modo</p>
              <p className="font-bold text-lg">{modo === "CITA" ? "Por Cita" : "Cliente Externo"}</p>
            </div>
          )}
        </div>

        <div className="p-4 md:p-10">
          {/* SELECTOR DE MODO PROFESIONAL */}
          <div className="flex bg-gray-100 dark:bg-[#0f1a14] p-1.5 rounded-2xl w-full md:w-fit mb-6 md:mb-10 overflow-x-auto">
            <button
              type="button"
              onClick={() => { setModo("CITA"); setSeleccionadoId(null); setBusqueda(""); }}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 md:px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap text-xs md:text-sm ${modo === "CITA" ? "bg-white dark:bg-[#1a2a20] text-[#1a4731] dark:text-emerald-100 shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"}`}
            >
              <Calendar className="w-4 md:w-5 h-4 md:h-5" /> Por Cita
            </button>
            <button
              type="button"
              onClick={() => { setModo("CLIENTE"); setSeleccionadoId(null); setBusqueda(""); }}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 md:px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap text-xs md:text-sm ${modo === "CLIENTE" ? "bg-white dark:bg-[#1a2a20] text-[#1a4731] dark:text-emerald-100 shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"}`}
            >
              <User className="w-4 md:w-5 h-4 md:h-5" /> Cliente Externo
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-12">
            
            {/* SECCIÓN DE BÚSQUEDA Y SELECCIÓN */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              <div className="lg:col-span-1 space-y-4">
                <h3 className="font-bold text-gray-800 dark:text-gray-200 text-lg flex items-center gap-2">
                  <Search className="w-5 h-5 text-green-700" />
                  {modo === "CITA" ? "Filtrar Citas Pendientes" : "Buscar Cliente"}
                </h3>
                <Input 
                  placeholder={modo === "CITA" ? "Nombre del paciente..." : "Cédula o Nombre..."}
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="rounded-xl border-gray-200 dark:border-gray-700 py-6 shadow-sm focus:ring-2 focus:ring-green-600"
                />
                <p className="text-xs text-gray-400 dark:text-gray-300 italic">
                  {modo === "CITA" ? "Mostrando solo citas con estado 'Completada'." : "Escribe al menos 3 caracteres para buscar."}
                </p>
              </div>

              <div className="lg:col-span-2">
                <div className="border rounded-2xl overflow-y-auto shadow-inner bg-gray-50 dark:bg-[#0f1a14] max-h-[250px]">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-white dark:bg-[#1a2a20] sticky top-0 shadow-sm">
                      <tr>
                        <th className="p-4 text-xs font-black uppercase text-gray-400 dark:text-gray-300">Nombre Completo</th>
                        <th className="p-4 text-xs font-black uppercase text-gray-400 dark:text-gray-300">{modo === "CITA" ? "Fecha Cita" : "Identificación"}</th>
                        <th className="p-4 text-xs font-black uppercase text-gray-400 dark:text-gray-300 text-center">Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(modo === "CITA" ? citasCompletadas : clientesFiltrados)
                        .filter(item => {
                           const nombre = modo === "CITA" 
                             ? `${item.cliente_data?.nombre} ${item.cliente_data?.apellido}` 
                             : `${item.nombre} ${item.apellido}`;
                           return nombre.toLowerCase().includes(busqueda.toLowerCase());
                        })
                        .map((item) => (
                        <tr key={item.id} className={`border-b transition-colors ${seleccionadoId === item.id ? 'bg-green-50 dark:bg-emerald-900/20' : 'bg-white dark:bg-[#1a2a20] hover:bg-gray-50 dark:hover:bg-[#0f1a14]'}`}>
                          <td className="p-4 font-bold text-gray-700 dark:text-gray-300">
                            {modo === "CITA" ? `${item.cliente_data?.nombre} ${item.cliente_data?.apellido}` : `${item.nombre} ${item.apellido}`}
                          </td>
                          <td className="p-4 text-sm text-gray-500 dark:text-gray-400">
                            {modo === "CITA" ? new Date(item.fecha).toLocaleDateString() : item.identificacion}
                          </td>
                          <td className="p-4 text-center">
                            <Button
                              type="button"
                              onClick={() => handleSeleccionar(item.id)}
                              variant={seleccionadoId === item.id ? "default" : "outline"}
                              className={`rounded-full px-6 h-8 text-xs ${seleccionadoId === item.id ? 'bg-green-700' : 'border-green-700 text-green-700'}`}
                            >
                              {seleccionadoId === item.id ? "Seleccionado" : "Elegir"}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {((modo === "CITA" ? citasCompletadas : clientesFiltrados).length === 0) && (
                    <div className="p-10 text-center text-gray-400 dark:text-gray-300 text-sm"></div>
                  )}
                </div>
              </div>
            </section>

            <hr className="border-gray-100 dark:border-white/10" />

            {/* SECCIÓN DE DATOS ÓPTICOS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              
              {/* OJO DERECHO */}
              <div className="relative group">
                <div className="absolute -top-4 left-6 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-black shadow-lg">OJO DERECHO (OD)</div>
                <div className="p-4 md:p-8 pt-8 md:pt-10 border-2 border-blue-100 dark:border-blue-800/30 rounded-[1.5rem] md:rounded-[2rem] bg-blue-50/5 dark:bg-blue-900/10 space-y-6">
                  <div className="grid grid-cols-3 gap-2 md:gap-6">
                    <div className="space-y-1"> 
                      <label className="text-[10px] font-black text-blue-900/50 dark:text-blue-300/50 uppercase ml-1">Esfera</label> 
                      <Input 
                        type="number" 
                        step="0.25" 
                        value={formData.od.esfera ?? ""}
                        onKeyDown={(e) => ["e", "E", "+"].includes(e.key) && e.preventDefault()}
                        className="rounded-xl border-blue-100 dark:border-blue-800/30 focus:border-blue-500" 
                        onChange={(e) => handleInputChange("od", "esfera", e.target.value)} 
                      /> 
                    </div>
                    <div className="space-y-1"> 
                      <label className="text-[10px] font-black text-blue-900/50 dark:text-blue-300/50 uppercase ml-1">Cilindro</label> 
                      <Input 
                        type="number" 
                        step="0.25" 
                        value={formData.od.cilindro ?? ""}
                        onKeyDown={(e) => ["e", "E", "+"].includes(e.key) && e.preventDefault()}
                        className="rounded-xl border-blue-100 dark:border-blue-800/30 focus:border-blue-500" 
                        onChange={(e) => handleInputChange("od", "cilindro", e.target.value)} 
                      /> 
                    </div>
                    <div className="space-y-1"> 
                      <label className="text-[10px] font-black text-blue-900/50 dark:text-blue-300/50 uppercase ml-1">Eje (°)</label> 
                      <Input 
                        type="number" 
                        min="0" 
                        max="180" 
                        step="15" 
                        value={formData.od.eje ?? ""}
                        onKeyDown={(e) => ["e", "E", "+", "-", "."].includes(e.key) && e.preventDefault()}
                        className="rounded-xl border-blue-100 dark:border-blue-800/30 focus:border-blue-500" 
                        onChange={(e) => handleInputChange("od", "eje", e.target.value)} 
                      /> 
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 md:gap-6 pt-2">
                    <div className="space-y-1"> 
                      <label className="text-[10px] font-black text-blue-900/50 dark:text-blue-300/50 uppercase ml-1">Adición</label> 
                      <Input 
                        type="number" 
                        step="0.25" 
                        min="0" 
                        max="3" 
                        value={formData.od.adicion ?? ""}
                        onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}
                        className="rounded-xl border-blue-100 dark:border-blue-800/30 focus:border-blue-500" 
                        onChange={(e) => handleInputChange("od", "adicion", e.target.value)} 
                      /> 
                    </div>
                    <div className="space-y-1"> 
                      <label className="text-[10px] font-black text-blue-900/50 dark:text-blue-300/50 uppercase ml-1">Distancia Pupilar</label> 
                      <Input 
                        type="number" 
                        value={formData.od.dp ?? ""}
                        onKeyDown={(e) => ["e", "E", "+", "-", "."].includes(e.key) && e.preventDefault()}
                        className="rounded-xl border-blue-100 dark:border-blue-800/30 focus:border-blue-500" 
                        onChange={(e) => handleInputChange("od", "dp", e.target.value)} 
                      /> 
                    </div>
                  </div>
                </div>
              </div>

              {/* OJO IZQUIERDO */}
              <div className="relative group">
                <div className="absolute -top-4 left-6 bg-green-600 text-white px-4 py-1 rounded-full text-xs font-black shadow-lg">OJO IZQUIERDO (OI)</div>
                <div className="p-4 md:p-8 pt-8 md:pt-10 border-2 border-green-100 dark:border-emerald-800/30 rounded-[1.5rem] md:rounded-[2rem] bg-green-50/5 dark:bg-emerald-900/10 space-y-6">
                  <div className="grid grid-cols-3 gap-2 md:gap-6">
                    <div className="space-y-1"> 
                       
                      <label className="text-[10px] font-black text-green-900/50 dark:text-emerald-300/50 uppercase ml-1">Esfera</label> 
                      <Input 
                        type="number" 
                        step="0.25" 
                        value={formData.oi.esfera ?? ""}
                        onKeyDown={(e) => ["e", "E", "+"].includes(e.key) && e.preventDefault()}
                        className="rounded-xl border-green-100 dark:border-emerald-800/30 focus:border-blue-500" 
                        onChange={(e) => handleInputChange("oi", "esfera", e.target.value)} 
                      /> 
                    </div>
                    <div className="space-y-1"> 
                      <label className="text-[10px] font-black text-green-900/50 dark:text-emerald-300/50 uppercase ml-1">Cilindro</label> 
                      <Input 
                        type="number" 
                        step="0.25" 
                        value={formData.oi.cilindro ?? ""}
                        onKeyDown={(e) => ["e", "E", "+"].includes(e.key) && e.preventDefault()}
                        className="rounded-xl border-green-100 dark:border-emerald-800/30 focus:border-blue-500" 
                        onChange={(e) => handleInputChange("oi", "cilindro", e.target.value)} 
                      /> 
                    </div>
                    <div className="space-y-1"> 
                      <label className="text-[10px] font-black text-green-900/50 dark:text-emerald-300/50 uppercase ml-1">Eje (°)</label> 
                      <Input 
                        type="number" 
                        min="0" 
                        max="180" 
                        step="15" 
                        value={formData.oi.eje ?? ""}
                        onKeyDown={(e) => ["e", "E", "+", "-", "."].includes(e.key) && e.preventDefault()}
                        className="rounded-xl border-green-100 dark:border-emerald-800/30 focus:border-blue-500" 
                        onChange={(e) => handleInputChange("oi", "eje", e.target.value)} 
                      /> 
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 md:gap-6 pt-2">
                    <div className="space-y-1"> 
                      <label className="text-[10px] font-black text-green-900/50 dark:text-emerald-300/50 uppercase ml-1">Adición</label> 
                      <Input 
                        type="number" 
                        step="0.25" 
                        min="0" 
                        max="3" 
                        value={formData.oi.adicion ?? ""}
                        onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}
                        className="rounded-xl border-green-100 dark:border-emerald-800/30 focus:border-blue-500" 
                        onChange={(e) => handleInputChange("oi", "adicion", e.target.value)} 
                      /> 
                    </div>
                    <div className="space-y-1"> 
                      <label className="text-[10px] font-black text-green-900/50 dark:text-emerald-300/50 uppercase ml-1">Distancia Pupilar</label> 
                      <Input 
                        type="number" 
                        value={formData.oi.dp ?? ""}
                        onKeyDown={(e) => ["e", "E", "+", "-", "."].includes(e.key) && e.preventDefault()}
                        className="rounded-xl border-green-100 dark:border-emerald-800/30 focus:border-blue-500" 
                        onChange={(e) => handleInputChange("oi", "dp", e.target.value)} 
                      /> 
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-black text-gray-400 dark:text-gray-300 uppercase tracking-widest ml-1">Observaciones Finales</label>
                <span className={`text-xs font-bold ${formData.observaciones.length > 240 ? 'text-red-500' : 'text-gray-400 dark:text-gray-300'}`}>
                  {formData.observaciones.length} / 255
                </span>
              </div>
              <textarea 
                className="w-full p-6 border rounded-[1.5rem] bg-gray-50 dark:bg-[#0f1a14] focus:bg-white dark:focus:bg-[#1a2a20] focus:ring-2 focus:ring-green-600 outline-none transition-all border-gray-100 dark:border-gray-700 shadow-inner" 
                rows={3}
                maxLength={255}
                placeholder="Ej: El paciente presenta fatiga ocular. Se recomienda filtro azul..."
                value={formData.observaciones}
                onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
              />
            </div>

            <Button
              disabled={loading || !seleccionadoId}
              type="submit"
              className="w-full py-6 md:py-10 text-sm md:text-xl font-black bg-[#1a4731] hover:bg-[#143625] rounded-2xl md:rounded-[1.5rem] shadow-xl transition-all hover:scale-[1.01] uppercase tracking-widest disabled:opacity-50"
            >
              {loading ? "PROCESANDO REGISTRO..." : "GUARDAR RECETA EN HISTORIAL"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}