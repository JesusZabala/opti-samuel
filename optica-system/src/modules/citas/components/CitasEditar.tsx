// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import CitaForm from "../../../modules/citas/components/CitaForm";
// // Importamos tus servicios y la config de axios
// import { obtenerCitas, actualizarEstadoCita } from "@/services/citaService";
// import api from "@/api/axiosConfig";  

// export default function CitaEditar() {
//   /* -------- ESTADOS -------- */
//   const [citas, setCitas] = useState<any[]>([]);
//   const [optometristas, setOptometristas] = useState<any[]>([]);
//   const [editando, setEditando] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const horasPermitidas = [
//     "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
//     "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"
//   ];

//   /* -------- CARGAR DATOS INICIALES (GET) -------- */
//   const cargarDatos = async () => {
//     try {
//       setLoading(true);
//       // Traemos las citas y los usuarios (optometristas) en paralelo
//       const [resCitas, resOpto] = await Promise.all([
//         obtenerCitas(),
//         api.get('auth/optometristas/')
//       ]);
      
//       setCitas(Array.isArray(resCitas) ? resCitas : []);
//       setOptometristas(Array.isArray(resOpto.data) ? resOpto.data : []);
//     } catch (err) {
//       console.error("Error cargando datos:", err);
//       setError("Error al conectar con el servidor.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     cargarDatos();
//   }, []);

//   /* -------- PREPARAR DATOS PARA EL FORMULARIO -------- */
//   const iniciarEdicion = (cita: any) => {
//     const fechaObj = new Date(cita.fecha);
    
//     // Transformamos la data de Django al formato que entiende CitaForm
//     setEditando({
//       ...cita,
//       optometrista: String(cita.usuario), // El select necesita el ID como string
//       fecha: cita.fecha.split("T")[0],    // Extraemos solo YYYY-MM-DD
//       hora: fechaObj.toLocaleTimeString([], { 
//         hour: '2-digit', 
//         minute: '2-digit', 
//         hour12: true 
//       }).toUpperCase(),
//       clienteNombre: `${cita.cliente_data?.nombre} ${cita.cliente_data?.apellido}`
//     });
//   };

//   /* -------- ACTUALIZAR EN EL BACKEND (PATCH) -------- */
//   const handleUpdate = async () => {
//     try {
//       setError("");
      
//       // 1. Convertir hora de "08:00 AM" a formato 24h para Django
//       const [time, modifier] = editando.hora.split(' ');
//       let [hours, minutes] = time.split(':');
//       if (modifier === 'PM' && hours !== '12') hours = String(Number(hours) + 12);
//       if (modifier === 'AM' && hours === '12') hours = '00';
//       const fechaISO = `${editando.fecha}T${hours}:${minutes}:00`;

//       // 2. Llamada al servicio con PATCH
//       await actualizarEstadoCita(editando.id, {
//         fecha: fechaISO,
//         motivo: editando.motivo,
//         usuario: Number(editando.optometrista)
//       });

//       setSuccess("Cita actualizada correctamente");
//       setEditando(null);
      
//       // 3. Refrescar la lista de la base de datos
//       await cargarDatos();

//       setTimeout(() => setSuccess(""), 3000);
//     } catch (err: any) {
//       console.error("Error al actualizar:", err);
//       const msg = err?.fecha?.[0] || "No se pudo actualizar la cita.";
//       setError(msg);
//     }
//   };

//   if (loading) return <div className="p-10 text-center font-bold">Cargando citas...</div>;

//   return (
//     <div className="p-10">
//       <div className="bg-white p-10 rounded-3xl shadow-xl">
//         <h2 className="text-3xl font-black text-[#1a4731] mb-8">Editar Citas</h2>

//         {/* MENSAJES DE ESTADO */}
//         {success && <p className="p-4 bg-green-50 text-green-600 rounded-xl font-bold mb-4">{success}</p>}
//         {error && <p className="p-4 bg-red-50 text-red-600 rounded-xl font-bold mb-4">{error}</p>}

//         {/* LISTADO DE CITAS ACTIVAS */}
//         {!editando && (
//           <div className="space-y-4">
//             {/* FILTRO: Solo mostramos las que NO están canceladas ('C') */}
//             {citas.filter(c => c.estado_cita === 'A').length === 0 ? (
//                 <p className="text-gray-400 text-center py-10">No hay citas activas para editar.</p>
//             ) : (
//                 citas.filter(c => c.estado_cita === 'A').map((cita) => {
//                     const f = new Date(cita.fecha);
//                     return (
//                         <div 
//                             key={cita.id} 
//                             className="p-5 border rounded-xl flex justify-between items-center hover:bg-gray-50 transition-all hover:shadow-sm"
//                         >
//                             <div>
//                                 <p className="font-bold text-lg">
//                                     {cita.cliente_data?.nombre} {cita.cliente_data?.apellido}
//                                 </p>
//                                 <p className="text-sm text-gray-500">
//                                     📅 {f.toLocaleDateString()} | ⏰ {f.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
//                                 </p>
//                                 <span className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">ACTIVA</span>
//                             </div>
//                             <Button 
//                                 onClick={() => iniciarEdicion(cita)} 
//                                 className="bg-green-600 hover:bg-green-700"
//                             >
//                                 Modificar
//                             </Button>
//                         </div>
//                     );
//                 })
//             )}
//           </div>
//         )}

//         {/* FORMULARIO DE EDICIÓN */}
//         {editando && (
//           <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
//             <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-xl">
//                 <p className="text-blue-700 font-medium">
//                     Estás modificando la cita de: <strong>{editando.clienteNombre}</strong>
//                 </p>
//             </div>
            
//             <CitaForm
//               data={editando}
//               setData={setEditando}
//               onSubmit={handleUpdate}
//               onCancel={() => setEditando(null)} 
//               error={error}
//               isEdit={true}
//               horasPermitidas={horasPermitidas}
//               citas={citas} // Pasamos todas las citas para validar choques de horario
//               optometristas={optometristas}
//             />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Edit3, CheckCircle, Calendar, User } from "lucide-react";
import CitaForm from "../../../modules/citas/components/CitaForm";
import { obtenerCitas, actualizarEstadoCita } from "@/services/citaService";
import api from "@/api/axiosConfig";
import { useNotifications } from "@/context/NotificationContext";

export default function CitaEditar() {
  /* -------- ESTADOS -------- */
  const [citas, setCitas] = useState<any[]>([]);
  const [optometristas, setOptometristas] = useState<any[]>([]);
  const [editando, setEditando] = useState<any>(null);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { addNotification } = useNotifications();

  const horasPermitidas = [
    "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"
  ];

  /* -------- CARGAR DATOS -------- */
  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [resCitas, resOpto] = await Promise.all([
        obtenerCitas(),
        api.get('auth/optometristas/')
      ]);
      setCitas(Array.isArray(resCitas) ? resCitas : []);
      setOptometristas(Array.isArray(resOpto.data) ? resOpto.data : []);
    } catch (err) {
      setError("Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  /* -------- LÓGICA DE FILTRADO -------- */
  // Filtramos: 1. Que el estado sea 'A' (Agendada) 2. Por el nombre del buscador
  const citasEditables = citas.filter((c) => {
    const nombreCompleto = `${c.cliente_data?.nombre || ''} ${c.cliente_data?.apellido || ''}`.toLowerCase();
    const cumpleNombre = nombreCompleto.includes(busqueda.toLowerCase());
    const esAgendada = c.estado_cita === 'A';
    return cumpleNombre && esAgendada;
  });

  /* -------- ACCIÓN: INICIAR EDICIÓN -------- */
  const iniciarEdicion = (cita: any) => {
    const fechaObj = new Date(cita.fecha);
    setEditando({
      ...cita,
      optometrista: String(cita.usuario),
      fecha: cita.fecha.split("T")[0],
      hora: fechaObj.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true 
      }).toUpperCase(),
      clienteNombre: `${cita.cliente_data?.nombre} ${cita.cliente_data?.apellido}`
    });
  };

  /* -------- ACCIÓN: COMPLETAR CITA (Rápido) -------- */
  const handleCompletarCita = async (id: number) => {
    if (!window.confirm("¿Marcar esta cita como completada?")) return;
    try {
      await actualizarEstadoCita(id, { estado_cita: "COM" });
      setSuccess("Cita marcada como completada.");
      addNotification({
        titulo: "Cita completada",
        mensaje: "La cita fue marcada como completada correctamente.",
        fecha: "Ahora",
      });
      await cargarDatos();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("No se pudo actualizar el estado.");
    }
  };

  /* -------- ACTUALIZAR DATOS (Submit Form) -------- */
  const handleUpdate = async () => {
    try {
      setError("");
      const [time, modifier] = editando.hora.split(' ');
      let [hours, minutes] = time.split(':');
      if (modifier === 'PM' && hours !== '12') hours = String(Number(hours) + 12);
      if (modifier === 'AM' && hours === '12') hours = '00';
      const fechaISO = `${editando.fecha}T${hours}:${minutes}:00`;

      await actualizarEstadoCita(editando.id, {
        fecha: fechaISO,
        motivo: editando.motivo,
        usuario: Number(editando.optometrista)
      });

      setSuccess("Cita modificada correctamente");
      addNotification({
        titulo: "Cita modificada",
        mensaje: "Los datos de la cita fueron actualizados.",
        fecha: "Ahora",
      });
      setEditando(null);
      await cargarDatos();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError("Error al guardar los cambios.");
    }
  };

  if (loading) return <div className="p-10 text-center font-bold text-[#1a4731] animate-pulse">Cargando gestión de citas...</div>;

  return (
    <div className="p-10 max-w-5xl mx-auto">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-gray-100">
        
        <div className="flex justify-between items-center mb-10">
            <h2 className="text-4xl font-black text-[#1a4731] tracking-tight">Gestión de Agenda</h2>
            <Edit3 className="w-10 h-10 text-green-600/20" />
        </div>

        {success && <p className="p-4 bg-green-50 text-green-600 rounded-2xl font-bold mb-6 border border-green-100 animate-in fade-in">✓ {success}</p>}
        {error && <p className="p-4 bg-red-50 text-red-600 rounded-2xl font-bold mb-6 border border-red-100">⚠ {error}</p>}

        {!editando ? (
          <div className="space-y-6">
            
            {/* BUSCADOR */}
            <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                    placeholder="Buscar paciente por nombre..."
                    value={busqueda}
                    // Agregado el paréntesis de cierre que faltaba al final de .replace()
                    onChange={(e) => setBusqueda(e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, ""))}
                    className="pl-14 rounded-2xl border-gray-200 py-8 text-lg shadow-sm focus:ring-[#1a4731]"
                />
            </div>

            {/* LISTADO DE CITAS AGENDADAS */}
            <div className="space-y-4">
              {citasEditables.length > 0 ? (
                citasEditables.map((cita) => {
                  const f = new Date(cita.fecha);
                  return (
                    <div 
                      key={cita.id} 
                      className="group p-6 border-2 border-gray-50 rounded-3xl flex justify-between items-center bg-white hover:border-blue-200 hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex items-center gap-6">
                          <div className="p-4 rounded-2xl bg-blue-50 text-blue-600">
                              <User className="w-6 h-6" />
                          </div>
                          <div>
                              <p className="font-black text-gray-800 text-xl">
                                  {cita.cliente_data?.nombre} {cita.cliente_data?.apellido}
                              </p>
                              <p className="text-sm text-gray-500 font-bold flex items-center gap-2 mt-1">
                                  <Calendar className="w-4 h-4" /> 
                                  {f.toLocaleDateString()} | {f.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </p>
                              <span className="inline-block mt-2 text-[10px] bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-black uppercase tracking-widest">
                                  AGENDADA
                              </span>
                          </div>
                      </div>

                      <div className="flex gap-3">
                          <Button 
                            onClick={() => iniciarEdicion(cita)} 
                            className="bg-gray-800 hover:bg-black rounded-xl px-6 py-6 transition-transform active:scale-95"
                          >
                            <Edit3 className="w-4 h-4 mr-2" /> Modificar
                          </Button>
                          
                          <Button 
                            onClick={() => handleCompletarCita(cita.id)}
                            className="bg-green-600 hover:bg-green-700 rounded-xl px-6 py-6 shadow-lg shadow-green-100"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" /> Completar
                          </Button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
                    <p className="text-gray-400 font-bold italic">No hay citas pendientes que coincidan.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* MODO EDICIÓN */
          <div className="animate-in slide-in-from-right duration-300">
            <div className="flex items-center gap-4 mb-8 p-6 bg-blue-50 rounded-3xl border-2 border-blue-100">
                <div className="bg-blue-600 p-3 rounded-2xl text-white">
                    <Edit3 className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-xl font-black text-blue-900">Modificando Cita</h3>
                    <p className="text-blue-700 font-bold text-sm">Paciente: {editando.clienteNombre}</p>
                </div>
            </div>
            
            <CitaForm
              data={editando}
              setData={setEditando}
              onSubmit={handleUpdate}
              onCancel={() => setEditando(null)} 
              error={error}
              isEdit={true}
              horasPermitidas={horasPermitidas}
              citas={citas} 
              optometristas={optometristas}
            />
          </div>
        )}
      </div>
    </div>
  );
}