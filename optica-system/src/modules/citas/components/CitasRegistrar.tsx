// import { useEffect, useState } from "react";
// import { agendarCita, obtenerCitas, type Cita } from "@/services/citaService";
// import api from "@/api/axiosConfig"; 
// import CitaForm from "./CitaForm";

// export default function CitaRegistrar() {
//   const [clientes, setClientes] = useState<any[]>([]);
//   const [optometristas, setOptometristas] = useState<any[]>([]);
//   const [citasExistentes, setCitasExistentes] = useState<Cita[]>([]);

//   const [horasPermitidas] = useState<string[]>([
//     "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
//     "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"
//   ]);

//   const [data, setData] = useState({
//     id: null as null | number,
//     cliente: "",
//     usuario: "", 
//     fecha: "",
//     hora: "",
//     motivo: ""
//   });

//   const [error, setError] = useState("");
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//   const cargarDatos = async () => {
//     try {
//       // 1. Iniciamos limpieza de errores antes de la carga
//       setError("");

//       // 2. Ejecutamos las peticiones
//       // Usamos .data dependiendo de cómo responda tu instancia de axiosConfig
//       const [resClientes, resUsuarios, resCitas] = await Promise.all([
//         api.get('cliente/'), 
//         api.get('auth/optometristas/'), 
//         obtenerCitas()
//       ]);

//       // 3. VALIDACIÓN DE DATOS (Vital para evitar pantalla en blanco)
//       // Nos aseguramos de que si el backend devuelve algo raro, el estado sea al menos un []
//       const dataClientes = Array.isArray(resClientes.data) ? resClientes.data : [];
      
//       // Si tu backend ya filtra optometristas, los pasamos directo
//       const dataOpto = Array.isArray(resUsuarios.data) ? resUsuarios.data : [];
      
//       // obtenerCitas() parece que ya devuelve response.data según tu citaService
//       const dataCitas = Array.isArray(resCitas) ? resCitas : [];

//       setClientes(dataClientes);
//       setOptometristas(dataOpto);
//       setCitasExistentes(dataCitas);

//       // Log para que veas en la consola (F12) qué está llegando realmente
//       console.log("Carga exitosa:", { dataClientes, dataOpto, dataCitas });

//     } catch (err: any) {
//       console.error("Error cargando datos:", err);
      
//       // Evitamos que los estados queden undefined si falla la petición
//       setClientes([]);
//       setOptometristas([]);
//       setCitasExistentes([]);

//       // Mensaje amigable para el usuario
//       const mensajeError = err.response?.data?.detail || "No se pudo conectar con el servidor.";
//       setError(mensajeError);
//     }
//   };

//   cargarDatos();
// }, []);

//   const formatearFechaParaDjango = (fechaStr: string, horaStr: string) => {
//     // 1. Extraer hora y minutos del string "08:00 AM"
//     const [time, modifier] = horaStr.split(' ');
//     let [hours, minutes] = time.split(':');

//     // 2. Convertir a formato 24h
//     if (modifier === 'PM' && hours !== '12') {
//       hours = (parseInt(hours, 10) + 12).toString();
//     }
//     if (modifier === 'AM' && hours === '12') {
//       hours = '00';
//     }

//     // 3. Retornar en formato YYYY-MM-DDTHH:MM:00 (ISO)
//     return `${fechaStr}T${hours}:${minutes}:00`;
//   };

//   const handleSubmit = async () => {

//     const fechaFinal = formatearFechaParaDjango(data.fecha,data.hora);
    
//     // Validación básica
//     if (!data.cliente || !data.usuario || !data.fecha || !data.hora || !data.motivo) {
//       setError("Por favor, complete todos los campos obligatorios.");
//       return;
//     }

//     try {
//       setError("");
//       setMessage("Registrando cita...");

//       // Formateo de fecha para Django (YYYY-MM-DDTHH:MM:SS)
//       // Convertimos "08:00 AM" a formato 24h si es necesario, 
//       // o enviamos la cadena según espere tu serializador.
//       const nuevaCita: Cita = {
//         fecha: fechaFinal, 
//         motivo: data.motivo,
//         cliente: Number(data.cliente),
//         usuario: Number(data.usuario),
//         estado_cita: 'A' // 'A' de Agendada según tu interfaz
//       };

//       await agendarCita(nuevaCita);

//       setMessage("¡La cita se ha guardado correctamente!");
      
//       // Limpiar formulario
//       setData({ id: null, cliente: "", usuario: "", fecha: "", hora: "", motivo: "" });
      
//       // Opcional: Recargar citas para actualizar disponibilidad en el Form
//       const actualizarCitas = await obtenerCitas();
//       setCitasExistentes(actualizarCitas);

//     } catch (err: any) {
//       // Capturamos el error del throw de tu citaService
//       setError(err?.detail || err?.message || "No se pudo agendar la cita.");
//     } finally {
//       setTimeout(() => setMessage(""), 5000);
//     }
//   };

//   return (
//     <div className="p-10">
//       <div className="bg-white p-10 rounded-3xl shadow-xl max-w-4xl border border-gray-100">
//         <div className="flex justify-between items-center mb-10">
//           <h2 className="text-3xl font-black text-[#1a4731]">Registrar Cita</h2>
//           <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-xs font-bold uppercase">
//             Nueva Entrada
//           </span>
//         </div>

//         <div className="mb-8">
//           <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
//             Paso 1: Seleccionar Cliente
//           </label>
//           <select
//             value={data.cliente}
//             onChange={(e) => setData({ ...data, cliente: e.target.value })}
//             className="w-full mt-2 p-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none bg-gray-50/50"
//           >
//             <option value="">Buscar por nombre de cliente...</option>
//             {clientes.map((c) => (
//               <option key={c.id} value={c.id}>
//                 {c.cedula || ''} - {c.nombre} {c.apellido}
//               </option>
//             ))}
//           </select>
//         </div>

//         <hr className="mb-8 border-gray-100" />

//         <CitaForm
//   // Pasamos los datos formateados como el hijo los espera
//   data={{
//     id: data.id ? String(data.id) : null,
//     cliente: data.cliente,
//     optometrista: data.usuario, // Aquí asignamos el valor de usuario a la llave optometrista
//     fecha: data.fecha,
//     hora: data.hora,
//     motivo: data.motivo
//   }}
//   // Cuando el hijo cambie 'optometrista', nosotros actualizamos 'usuario'
//   setData={(newData: any) => {
//     setData({
//       ...data,
//       usuario: newData.optometrista,
//       fecha: newData.fecha,
//       hora: newData.hora,
//       motivo: newData.motivo
//     });
//   }}
//   onSubmit={handleSubmit}
//   error={error}
//   horasPermitidas={horasPermitidas}
//   citas={citasExistentes as any}
//   optometristas={optometristas}
// />

//         {message && (
//           <div className="mt-6 p-4 bg-emerald-500 text-white rounded-2xl font-bold text-center animate-in fade-in zoom-in duration-300">
//             {message}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Calendar, Clock, CheckCircle2 } from "lucide-react";
import api from "@/api/axiosConfig";

export default function CitaRegistrar() {
  const [loading, setLoading] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [clientesFiltrados, setClientesFiltrados] = useState<any[]>([]);
  const [seleccionadoId, setSeleccionadoId] = useState<number | null>(null);
  const [nombreSeleccionado, setNombreSeleccionado] = useState("");

  const getTodayString = () => {
    const today = new Date();
    // Usamos el formato YYYY-MM-DD que es el estándar de HTML5
    return today.toISOString().split('T')[0];
  };
  // Horas permitidas según tu comentario
  const [horasPermitidas] = useState<string[]>([
    "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
    "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"
  ]);

  const [formData, setFormData] = useState({
    cliente: null as number | null,
    fecha: "",
    hora: "",
    motivo_consulta: "",
    estado_cita: "PEN",
  });

  // Búsqueda de clientes
  useEffect(() => {
    if (busqueda.length > 2) {
      const delayDebounceFn = setTimeout(async () => {
        try {
          const res = await api.get(`cliente/?search=${busqueda}`);
          setClientesFiltrados(res.data);
        } catch (err) {
          console.error("Error al buscar clientes", err);
        }
      }, 300);
      return () => clearTimeout(delayDebounceFn);
    }
  }, [busqueda]);

  const handleSeleccionarCliente = (cliente: any) => {
    setSeleccionadoId(cliente.id);
    setNombreSeleccionado(`${cliente.nombre} ${cliente.apellido}`);
    setFormData((prev) => ({ ...prev, cliente: cliente.id }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.cliente || !formData.fecha || !formData.hora) {
      return alert("Por favor seleccione un paciente, fecha y hora.");
    }

    setLoading(true);
    try {
      await api.post("cita/", formData);
      alert("Cita registrada con éxito");
      window.location.reload();
    } catch (err) {
      alert("Error al guardar la cita.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 max-w-7xl mx-auto">
      <div className="bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden">
        
        {/* ENCABEZADO */}
        <div className="bg-[#1a4731] p-8 text-white flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
              <Calendar className="w-10 h-10 text-green-400" />
              Programar Nueva Cita
            </h2>
            <p className="text-green-100/70 mt-1 font-medium text-sm uppercase tracking-widest">Módulo de Agendamiento</p>
          </div>
          {seleccionadoId && (
            <div className="bg-green-800/40 px-6 py-3 rounded-2xl border border-green-500/30 backdrop-blur-sm">
              <p className="text-[10px] font-black uppercase text-green-300">Paciente</p>
              <p className="font-bold text-lg">{nombreSeleccionado}</p>
            </div>
          )}
        </div>

        <div className="p-10">
          <form onSubmit={handleSubmit} className="space-y-12">
            
            {/* SECCIÓN BÚSQUEDA */}
            {/* SECCIÓN BÚSQUEDA */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 space-y-4">
                <h3 className="font-black text-gray-800 text-lg flex items-center gap-2">
                  <Search className="w-5 h-5 text-[#1a4731]" />
                  Seleccionar Paciente
                </h3>
                <Input 
                  placeholder="Buscar por nombre o cédula..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="rounded-xl border-gray-200 py-6 shadow-sm focus:ring-2 focus:ring-[#1a4731]"
                />
              </div>

              <div className="lg:col-span-2">
                <div className="border rounded-[1.5rem] overflow-hidden shadow-inner bg-gray-50 max-h-[200px] overflow-y-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-white sticky top-0 shadow-sm z-10">
                      <tr>
                        <th className="p-4 text-[10px] font-black uppercase text-gray-400">Nombre Completo</th>
                        <th className="p-4 text-[10px] font-black uppercase text-gray-400">Identificación</th>
                        <th className="p-4 text-center text-[10px] font-black uppercase text-gray-400">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {clientesFiltrados.map((item) => (
                        <tr key={item.id} className={`border-b transition-colors ${seleccionadoId === item.id ? 'bg-green-50' : 'bg-white hover:bg-gray-50'}`}>
                          <td className="p-4 font-bold text-gray-700">
                            {item.nombre} {item.apellido}
                          </td>
                          <td className="p-4 font-medium text-gray-500 tracking-wider">
                            {item.identificacion}
                          </td>
                          <td className="p-4 text-center">
                            <Button
                              type="button"
                              onClick={() => handleSeleccionarCliente(item)}
                              className={`rounded-full px-6 h-8 text-[10px] font-black transition-all ${
                                seleccionadoId === item.id 
                                ? 'bg-[#1a4731] shadow-md' 
                                : 'border-2 border-[#1a4731] text-[#1a4731] bg-transparent hover:bg-[#1a4731] hover:text-white'
                              }`}
                            >
                              {seleccionadoId === item.id ? "SELECCIONADO" : "ELEGIR"}
                            </Button>
                          </td>
                        </tr>
                      ))}
                      {clientesFiltrados.length === 0 && busqueda.length > 2 && (
                        <tr>
                          <td colSpan={3} className="p-8 text-center text-gray-400 italic">
                            No se encontraron pacientes con esa información.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <hr className="border-gray-100" />

            {/* SECCIÓN FECHA Y HORA */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* CALENDARIO */}
              <div className="relative">
                <div className="absolute -top-4 left-6 bg-[#1a4731] text-white px-4 py-1 rounded-full text-[10px] font-black shadow-lg uppercase tracking-widest">Fecha de Cita</div>
                <div className="p-8 pt-10 border-2 border-gray-100 rounded-[2.5rem] bg-gray-50/30">
                   <Input 
                    type="date" 
                    className="rounded-xl border-gray-200 py-7 text-xl font-black text-[#1a4731] focus:ring-2 focus:ring-[#1a4731]"
                    onChange={(e) => setFormData({...formData, fecha: e.target.value})}
                    min={getTodayString()}
                   />
                </div>
              </div>

              {/* GRID DE HORAS (AM/PM) */}
              <div className="relative">
                <div className="absolute -top-4 left-6 bg-blue-600 text-white px-4 py-1 rounded-full text-[10px] font-black shadow-lg uppercase tracking-widest">Horario Disponible</div>
                <div className="p-8 pt-10 border-2 border-blue-50 rounded-[2.5rem] bg-blue-50/5">
                   <div className="grid grid-cols-3 gap-3">
                     {horasPermitidas.map((h) => (
                       <button
                         key={h}
                         type="button"
                         onClick={() => setFormData({...formData, hora: h})}
                         className={`py-3 rounded-xl text-xs font-black transition-all border-2 ${
                           formData.hora === h 
                           ? "bg-blue-600 text-white border-blue-600 shadow-lg scale-105" 
                           : "bg-white text-blue-600 border-blue-100 hover:border-blue-300 hover:bg-blue-50"
                         }`}
                       >
                         {h}
                       </button>
                     ))}
                   </div>
                </div>
              </div>
            </div>

            {/* MOTIVO */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Motivo de la Consulta</label>
              <textarea 
                className="w-full p-6 border-2 rounded-[1.5rem] bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#1a4731] outline-none transition-all border-gray-100 shadow-inner font-medium" 
                rows={2}
                placeholder="Indique brevemente el motivo..."
                onChange={(e) => setFormData({...formData, motivo_consulta: e.target.value})}
              />
            </div>

            <Button 
              disabled={loading || !seleccionadoId}
              type="submit" 
              className="w-full py-10 text-xl font-black bg-[#1a4731] hover:bg-[#143625] rounded-[1.5rem] shadow-xl transition-all hover:scale-[1.01] uppercase tracking-widest disabled:opacity-30"
            >
              {loading ? "GUARDANDO..." : "PROGRAMAR CITA AHORA"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}