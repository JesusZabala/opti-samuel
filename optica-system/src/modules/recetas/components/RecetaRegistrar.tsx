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

//   const handleInputChange = (ojo: "od" | "oi", campo: string, valor: string) => {
//     setFormData((prev) => ({
//       ...prev,
//       [ojo]: { ...prev[ojo], [campo]: parseFloat(valor) || 0 },
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!seleccionadoId) return alert("Por favor, selecciona un cliente o cita primero.");

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
//     <div className="p-10 max-w-7xl mx-auto">
//       <div className="bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden">
        
//         {/* ENCABEZADO TIPO DASHBOARD */}
//         <div className="bg-[#1a4731] p-8 text-white">
//           <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
//             <CheckCircle2 className="w-10 h-10 text-green-400" />
//             Nueva Receta Médica
//           </h2>
//           <p className="text-green-100/70 mt-1 font-medium">Registro de optometría y salud visual</p>
//         </div>

//         <div className="p-10">
//           {/* SELECTOR DE MODO PROFESIONAL */}
//           <div className="flex bg-gray-100 p-1.5 rounded-2xl w-fit mb-10">
//             <button
//               type="button"
//               onClick={() => { setModo("CITA"); setSeleccionadoId(null); setBusqueda(""); }}
//               className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${modo === "CITA" ? "bg-white text-[#1a4731] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
//             >
//               <Calendar className="w-5 h-5" /> Por Cita
//             </button>
//             <button
//               type="button"
//               onClick={() => { setModo("CLIENTE"); setSeleccionadoId(null); setBusqueda(""); }}
//               className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${modo === "CLIENTE" ? "bg-white text-[#1a4731] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
//             >
//               <User className="w-5 h-5" /> Cliente Externo
//             </button>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-12">
            
//             {/* SECCIÓN DE BÚSQUEDA Y SELECCIÓN */}
//             <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
//               <div className="lg:col-span-1 space-y-4">
//                 <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
//                   <Search className="w-5 h-5 text-green-700" />
//                   {modo === "CITA" ? "Filtrar Citas Pendientes" : "Buscar Cliente"}
//                 </h3>
//                 <Input 
//                   placeholder={modo === "CITA" ? "Nombre del paciente..." : "Cédula o Nombre..."}
//                   value={busqueda}
//                   onChange={(e) => setBusqueda(e.target.value)}
//                   className="rounded-xl border-gray-200 py-6 shadow-sm focus:ring-2 focus:ring-green-600"
//                 />
//                 <p className="text-xs text-gray-400 italic">
//                   {modo === "CITA" ? "Mostrando solo citas con estado 'Completada'." : "Escribe al menos 3 caracteres para buscar."}
//                 </p>
//               </div>

//               <div className="lg:col-span-2">
//                 <div className="border rounded-2xl overflow-hidden shadow-inner bg-gray-50 max-h-[250px] overflow-y-auto">
//                   <table className="w-full text-left border-collapse">
//                     <thead className="bg-white sticky top-0 shadow-sm">
//                       <tr>
//                         <th className="p-4 text-xs font-black uppercase text-gray-400">Nombre Completo</th>
//                         <th className="p-4 text-xs font-black uppercase text-gray-400">{modo === "CITA" ? "Fecha Cita" : "Identificación"}</th>
//                         <th className="p-4 text-xs font-black uppercase text-gray-400 text-center">Acción</th>
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
//                         <tr key={item.id} className={`border-b transition-colors ${seleccionadoId === item.id ? 'bg-green-50' : 'bg-white hover:bg-gray-50'}`}>
//                           <td className="p-4 font-bold text-gray-700">
//                             {modo === "CITA" ? `${item.cliente_data?.nombre} ${item.cliente_data?.apellido}` : `${item.nombre} ${item.apellido}`}
//                           </td>
//                           <td className="p-4 text-sm text-gray-500">
//                             {/* FORMATEO DE FECHA PARA CITAS */}
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
//                     <div className="p-10 text-center text-gray-400 text-sm">No se encontraron resultados.</div>
//                   )}
//                 </div>
//               </div>
//             </section>

//             <hr className="border-gray-100" />

//             {/* SECCIÓN DE DATOS ÓPTICOS */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
//               {/* OJO DERECHO */}
//               <div className="relative group">
//                 <div className="absolute -top-4 left-6 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-black shadow-lg">OJO DERECHO (OD)</div>
//                 <div className="p-8 pt-10 border-2 border-blue-100 rounded-[2rem] bg-blue-50/5 space-y-6">
//                   <div className="grid grid-cols-3 gap-6">
//                     <div className="space-y-1"> <label className="text-[10px] font-black text-blue-900/50 uppercase ml-1">Esfera</label> <Input type="number" step="0.25" className="rounded-xl border-blue-100 focus:border-blue-500" onChange={(e) => handleInputChange("od", "esfera", e.target.value)} /> </div>
//                     <div className="space-y-1"> <label className="text-[10px] font-black text-blue-900/50 uppercase ml-1">Cilindro</label> <Input type="number" step="0.25" className="rounded-xl border-blue-100 focus:border-blue-500" onChange={(e) => handleInputChange("od", "cilindro", e.target.value)} /> </div>
//                     <div className="space-y-1"> <label className="text-[10px] font-black text-blue-900/50 uppercase ml-1">Eje</label> <Input type="number" className="rounded-xl border-blue-100 focus:border-blue-500" onChange={(e) => handleInputChange("od", "eje", e.target.value)} /> </div>
//                   </div>
//                   <div className="grid grid-cols-2 gap-6 pt-2">
//                     <div className="space-y-1"> <label className="text-[10px] font-black text-blue-900/50 uppercase ml-1">Adición</label> <Input type="number" step="0.25" className="rounded-xl border-blue-100 focus:border-blue-500" onChange={(e) => handleInputChange("od", "adicion", e.target.value)} /> </div>
//                     <div className="space-y-1"> <label className="text-[10px] font-black text-blue-900/50 uppercase ml-1">Distancia Pupilar</label> <Input type="number" className="rounded-xl border-blue-100 focus:border-blue-500" onChange={(e) => handleInputChange("od", "dp", e.target.value)} /> </div>
//                   </div>
//                 </div>
//               </div>

//               {/* OJO IZQUIERDO */}
//               <div className="relative group">
//                 <div className="absolute -top-4 left-6 bg-green-600 text-white px-4 py-1 rounded-full text-xs font-black shadow-lg">OJO IZQUIERDO (OI)</div>
//                 <div className="p-8 pt-10 border-2 border-green-100 rounded-[2rem] bg-green-50/5 space-y-6">
//                   <div className="grid grid-cols-3 gap-6">
//                     <div className="space-y-1"> <label className="text-[10px] font-black text-green-900/50 uppercase ml-1">Esfera</label> <Input type="number" step="0.25" className="rounded-xl border-green-100 focus:border-green-500" onChange={(e) => handleInputChange("oi", "esfera", e.target.value)} /> </div>
//                     <div className="space-y-1"> <label className="text-[10px] font-black text-green-900/50 uppercase ml-1">Cilindro</label> <Input type="number" step="0.25" className="rounded-xl border-green-100 focus:border-green-500" onChange={(e) => handleInputChange("oi", "cilindro", e.target.value)} /> </div>
//                     <div className="space-y-1"> <label className="text-[10px] font-black text-green-900/50 uppercase ml-1">Eje</label> <Input type="number" className="rounded-xl border-green-100 focus:border-green-500" onChange={(e) => handleInputChange("oi", "eje", e.target.value)} /> </div>
//                   </div>
//                   <div className="grid grid-cols-2 gap-6 pt-2">
//                     <div className="space-y-1"> <label className="text-[10px] font-black text-green-900/50 uppercase ml-1">Adición</label> <Input type="number" step="0.25" className="rounded-xl border-green-100 focus:border-green-500" onChange={(e) => handleInputChange("oi", "adicion", e.target.value)} /> </div>
//                     <div className="space-y-1"> <label className="text-[10px] font-black text-green-900/50 uppercase ml-1">Distancia Pupilar</label> <Input type="number" className="rounded-xl border-green-100 focus:border-green-500" onChange={(e) => handleInputChange("oi", "dp", e.target.value)} /> </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="space-y-3">
//               <div className="flex justify-between items-center">
//                 <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-1">Observaciones Finales</label>
//                 {/* CONTADOR DE CARACTERES */}
//                 <span className={`text-xs font-bold ${formData.observaciones.length > 240 ? 'text-red-500' : 'text-gray-400'}`}>
//                   {formData.observaciones.length} / 255
//                 </span>
//               </div>
//               <textarea 
//                 className="w-full p-6 border rounded-[1.5rem] bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-600 outline-none transition-all border-gray-100 shadow-inner" 
//                 rows={3}
//                 maxLength={255} // VALIDACIÓN DE 255 CARACTERES
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
    od: { esfera: 0, cilindro: 0, eje: 0, adicion: 1, dp: 0 },
    oi: { esfera: 0, cilindro: 0, eje: 0, adicion: 1, dp: 0 },
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

  const handleInputChange = (ojo: "od" | "oi", campo: string, valor: string) => {
    setFormData((prev) => ({
      ...prev,
      [ojo]: { ...prev[ojo], [campo]: parseFloat(valor) || 0 },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!seleccionadoId) return alert("Por favor, selecciona un cliente o cita primero.");

    /* --- VALIDACIONES --- */
    // 1. Validar rangos de adición (Mínimo 0, Máximo 3)
    if (formData.od.adicion < 0 || formData.od.adicion > 3 || formData.oi.adicion < 0 || formData.oi.adicion > 3) {
      return alert("La adición de ambos ojos debe estar entre un valor mínimo de 0 y un máximo de 3.");
    }

    // 2. Validar rangos de Eje (Mínimo 1, Máximo 180)
    if (formData.od.eje < 1 || formData.od.eje > 180 || formData.oi.eje < 1 || formData.oi.eje > 180) {
      return alert("El eje de ambos ojos debe estar en un rango de 1° a 180°.");
    }

    // 3. Validar que la Distancia Pupilar sea idéntica en ambos ojos
    if (formData.od.dp !== formData.oi.dp) {
      return alert("La Distancia Pupilar (D.P.) debe ser exactamente igual para el Ojo Derecho y el Ojo Izquierdo.");
    }

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
      setFormData({
        cita: null,
        cliente: null,
        observaciones: "",
        od: { esfera: 0, cilindro: 0, eje: 0, adicion: 1, dp: 0 },
        oi: { esfera: 0, cilindro: 0, eje: 0, adicion: 1, dp: 0 },
      });
      setSeleccionadoId(null);
      setBusqueda("");
      setClientesFiltrados([]);
      if (modo === "CITA") {
        api
          .get("cita/")
          .then((res) => {
            const completadas = res.data.filter((c: { estado_cita: string }) => c.estado_cita === "COM");
            setCitasCompletadas(completadas);
          })
          .catch(() => console.error("Error al recargar citas"));
      }
    } catch (err) {
      alert("Error al guardar la receta. Revisa los permisos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 max-w-7xl mx-auto">
      <div className="bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden">
        
        {/* ENCABEZADO TIPO DASHBOARD */}
        <div className="bg-[#1a4731] p-8 text-white">
          <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <CheckCircle2 className="w-10 h-10 text-green-400" />
            Nueva Receta Médica
          </h2>
          <p className="text-green-100/70 mt-1 font-medium">Registro de optometría y salud visual</p>
        </div>

        <div className="p-10">
          {/* SELECTOR DE MODO PROFESIONAL */}
          <div className="flex bg-gray-100 p-1.5 rounded-2xl w-fit mb-10">
            <button
              type="button"
              onClick={() => { setModo("CITA"); setSeleccionadoId(null); setBusqueda(""); }}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${modo === "CITA" ? "bg-white text-[#1a4731] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              <Calendar className="w-5 h-5" /> Por Cita
            </button>
            <button
              type="button"
              onClick={() => { setModo("CLIENTE"); setSeleccionadoId(null); setBusqueda(""); }}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${modo === "CLIENTE" ? "bg-white text-[#1a4731] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              <User className="w-5 h-5" /> Cliente Externo
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-12">
            
            {/* SECCIÓN DE BÚSQUEDA Y SELECCIÓN */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              <div className="lg:col-span-1 space-y-4">
                <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                  <Search className="w-5 h-5 text-green-700" />
                  {modo === "CITA" ? "Filtrar Citas Pendientes" : "Buscar Cliente"}
                </h3>
                <Input 
                  placeholder={modo === "CITA" ? "Nombre del paciente..." : "Cédula o Nombre..."}
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="rounded-xl border-gray-200 py-6 shadow-sm focus:ring-2 focus:ring-green-600"
                />
                <p className="text-xs text-gray-400 italic">
                  {modo === "CITA" ? "Mostrando solo citas con estado 'Completada'." : "Escribe al menos 3 caracteres para buscar."}
                </p>
              </div>

              <div className="lg:col-span-2">
                <div className="border rounded-2xl overflow-hidden shadow-inner bg-gray-50 max-h-[250px] overflow-y-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-white sticky top-0 shadow-sm">
                      <tr>
                        <th className="p-4 text-xs font-black uppercase text-gray-400">Nombre Completo</th>
                        <th className="p-4 text-xs font-black uppercase text-gray-400">{modo === "CITA" ? "Fecha Cita" : "Identificación"}</th>
                        <th className="p-4 text-xs font-black uppercase text-gray-400 text-center">Acción</th>
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
                        <tr key={item.id} className={`border-b transition-colors ${seleccionadoId === item.id ? 'bg-green-50' : 'bg-white hover:bg-gray-50'}`}>
                          <td className="p-4 font-bold text-gray-700">
                            {modo === "CITA" ? `${item.cliente_data?.nombre} ${item.cliente_data?.apellido}` : `${item.nombre} ${item.apellido}`}
                          </td>
                          <td className="p-4 text-sm text-gray-500">
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
                    <div className="p-10 text-center text-gray-400 text-sm">No se encontraron resultados.</div>
                  )}
                </div>
              </div>
            </section>

            <hr className="border-gray-100" />

            {/* SECCIÓN DE DATOS ÓPTICOS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* OJO DERECHO */}
              <div className="relative group">
                <div className="absolute -top-4 left-6 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-black shadow-lg">OJO DERECHO (OD)</div>
                <div className="p-8 pt-10 border-2 border-blue-100 rounded-[2rem] bg-blue-50/5 space-y-6">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-1"> <label className="text-[10px] font-black text-blue-900/50 uppercase ml-1">Esfera</label> <Input type="number" step="0.25" className="rounded-xl border-blue-100 focus:border-blue-500" onChange={(e) => handleInputChange("od", "esfera", e.target.value)} /> </div>
                    <div className="space-y-1"> <label className="text-[10px] font-black text-blue-900/50 uppercase ml-1">Cilindro</label> <Input type="number" step="0.25" className="rounded-xl border-blue-100 focus:border-blue-500" onChange={(e) => handleInputChange("od", "cilindro", e.target.value)} /> </div>
                    {/* Input Eje con step 15, min 1 y max 180 */}
                    <div className="space-y-1"> 
                      <label className="text-[10px] font-black text-blue-900/50 uppercase ml-1">Eje (°)</label> 
                      <Input type="number" min="0" max="180" step="15" className="rounded-xl border-blue-100 focus:border-blue-500" onChange={(e) => handleInputChange("od", "eje", e.target.value)} /> 
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6 pt-2">
                    <div className="space-y-1"> 
                      <label className="text-[10px] font-black text-blue-900/50 uppercase ml-1">Adición</label> 
                      <Input type="number" step="0.25" min="0" max="3" defaultValue="1" className="rounded-xl border-blue-100 focus:border-blue-500" onChange={(e) => handleInputChange("od", "adicion", e.target.value)} /> 
                    </div>
                    <div className="space-y-1"> <label className="text-[10px] font-black text-blue-900/50 uppercase ml-1">Distancia Pupilar</label> <Input type="number" className="rounded-xl border-blue-100 focus:border-blue-500" onChange={(e) => handleInputChange("od", "dp", e.target.value)} /> </div>
                  </div>
                </div>
              </div>

              {/* OJO IZQUIERDO */}
              <div className="relative group">
                <div className="absolute -top-4 left-6 bg-green-600 text-white px-4 py-1 rounded-full text-xs font-black shadow-lg">OJO IZQUIERDO (OI)</div>
                <div className="p-8 pt-10 border-2 border-green-100 rounded-[2rem] bg-green-50/5 space-y-6">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-1"> <label className="text-[10px] font-black text-green-900/50 uppercase ml-1">Esfera</label> <Input type="number" step="0.25" className="rounded-xl border-green-100 focus:border-blue-500" onChange={(e) => handleInputChange("oi", "esfera", e.target.value)} /> </div>
                    <div className="space-y-1"> <label className="text-[10px] font-black text-green-900/50 uppercase ml-1">Cilindro</label> <Input type="number" step="0.25" className="rounded-xl border-green-100 focus:border-blue-500" onChange={(e) => handleInputChange("oi", "cilindro", e.target.value)} /> </div>
                    {/* Input Eje con step 15, min 1 y max 180 */}
                    <div className="space-y-1"> 
                      <label className="text-[10px] font-black text-green-900/50 uppercase ml-1">Eje (°)</label> 
                      <Input type="number" min="0" max="180" step="15" className="rounded-xl border-green-100 focus:border-blue-500" onChange={(e) => handleInputChange("oi", "eje", e.target.value)} /> 
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6 pt-2">
                    <div className="space-y-1"> 
                      <label className="text-[10px] font-black text-green-900/50 uppercase ml-1">Adición</label> 
                      <Input type="number" step="0.25" min="0" max="3" defaultValue="1" className="rounded-xl border-green-100 focus:border-blue-500" onChange={(e) => handleInputChange("oi", "adicion", e.target.value)} /> 
                    </div>
                    <div className="space-y-1"> <label className="text-[10px] font-black text-green-900/50 uppercase ml-1">Distancia Pupilar</label> <Input type="number" className="rounded-xl border-green-100 focus:border-blue-500" onChange={(e) => handleInputChange("oi", "dp", e.target.value)} /> </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-1">Observaciones Finales</label>
                <span className={`text-xs font-bold ${formData.observaciones.length > 240 ? 'text-red-500' : 'text-gray-400'}`}>
                  {formData.observaciones.length} / 255
                </span>
              </div>
              <textarea 
                className="w-full p-6 border rounded-[1.5rem] bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-600 outline-none transition-all border-gray-100 shadow-inner" 
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
              className="w-full py-10 text-xl font-black bg-[#1a4731] hover:bg-[#143625] rounded-[1.5rem] shadow-xl transition-all hover:scale-[1.01] uppercase tracking-widest disabled:opacity-50"
            >
              {loading ? "PROCESANDO REGISTRO..." : "GUARDAR RECETA EN HISTORIAL"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}