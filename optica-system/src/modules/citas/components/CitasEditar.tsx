

// import { useState, useEffect } from "react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Search, Edit3, CheckCircle, Calendar, User, ClipboardList } from "lucide-react";
// import CitaForm from "../../../modules/citas/components/CitaForm";
// import { obtenerCitas, actualizarEstadoCita } from "@/services/citaService";
// import api from "@/api/axiosConfig";
// import { useNotifications } from "@/context/NotificationContext";
// import { useNavigate } from "react-router-dom";

// export default function CitaEditar() {
//   const navigate = useNavigate();

//   /* -------- ESTADOS -------- */
//   const [citas, setCitas] = useState<any[]>([]);
//   const [optometristas, setOptometristas] = useState<any[]>([]);
//   const [editando, setEditando] = useState<any>(null);
//   const [busqueda, setBusqueda] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [showRecetaModal, setShowRecetaModal] = useState(false);
//   const [pendingCitaId, setPendingCitaId] = useState<number | null>(null);
//   const { addNotification } = useNotifications();

//   const horasPermitidas = [
//     "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
//     "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"
//   ];

//   /* -------- CARGAR DATOS -------- */
//   const cargarDatos = async () => {
//     try {
//       setLoading(true);
//       const [resCitas, resOpto] = await Promise.all([
//         obtenerCitas(),
//         api.get('auth/optometristas/')
//       ]);
//       setCitas(Array.isArray(resCitas) ? resCitas : []);
//       setOptometristas(Array.isArray(resOpto.data) ? resOpto.data : []);
//     } catch (err) {
//       setError("Error al conectar con el servidor.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     cargarDatos();
//   }, []);

//   /* -------- LÓGICA DE FILTRADO -------- */
//   // Filtramos: 1. Que el estado sea 'A' (Agendada) 2. Por el nombre del buscador
//   const citasEditables = citas.filter((c) => {
//     const nombreCompleto = `${c.cliente_data?.nombre || ''} ${c.cliente_data?.apellido || ''}`.toLowerCase();
//     const cumpleNombre = nombreCompleto.includes(busqueda.toLowerCase());
//     const esAgendada = c.estado_cita === 'A';
//     return cumpleNombre && esAgendada;
//   });

//   /* -------- ACCIÓN: INICIAR EDICIÓN -------- */
//   const iniciarEdicion = (cita: any) => {
//     const fechaObj = new Date(cita.fecha);
//     setEditando({
//       ...cita,
//       optometrista: String(cita.usuario),
//       fecha: cita.fecha.split("T")[0],
//       hora: fechaObj.toLocaleTimeString([], { 
//         hour: '2-digit', 
//         minute: '2-digit', 
//         hour12: true 
//       }).toUpperCase(),
//       clienteNombre: `${cita.cliente_data?.nombre} ${cita.cliente_data?.apellido}`
//     });
//   };

//   /* -------- ACCIÓN: COMPLETAR CITA (Verifica receta primero) -------- */
//   const handleCompletarCita = async (id: number) => {
//     if (!window.confirm("¿Deseas marcar esta cita como completada y abrir el módulo de recetas?")) return;
    
//     try {
//       setError("");
//       // 1. Cambiamos el estado en el backend a Completada ('COM')
//       await actualizarEstadoCita(id, { estado_cita: "COM" });
      
//       // 2. Notificación al usuario
//       addNotification({
//         titulo: "Cita completada",
//         mensaje: "La cita fue completada con éxito. Redirigiendo...",
//         fecha: "Ahora",
//       });

//       // 3. Redirección limpia al módulo de registro de recetas
//       navigate("/recetas/registrar");
      
//     } catch (err) {
//       setError("No se pudo actualizar el estado de la cita en el servidor.");
//     }
//   };

//   const irARegistrarReceta = () => {
//     setShowRecetaModal(false);
//     if (pendingCitaId) {
//       navigate(`/recetas/registrar?cita=${pendingCitaId}`);
//     }
//   };

//   /* -------- ACTUALIZAR DATOS (Submit Form) -------- */
//   const handleUpdate = async () => {
//     try {
//       setError("");
//       const [time, modifier] = editando.hora.split(' ');
//       let [hours, minutes] = time.split(':');
//       if (modifier === 'PM' && hours !== '12') hours = String(Number(hours) + 12);
//       if (modifier === 'AM' && hours === '12') hours = '00';
//       const fechaISO = `${editando.fecha}T${hours}:${minutes}:00`;

//       await actualizarEstadoCita(editando.id, {
//         fecha: fechaISO,
//         motivo: editando.motivo,
//         usuario: Number(editando.optometrista)
//       });

//       setSuccess("Cita modificada correctamente");
//       addNotification({
//         titulo: "Cita modificada",
//         mensaje: "Los datos de la cita fueron actualizados.",
//         fecha: "Ahora",
//       });
//       setEditando(null);
//       await cargarDatos();
//       setTimeout(() => setSuccess(""), 3000);
//     } catch (err: any) {
//       setError("Error al guardar los cambios.");
//     }
//   };

//   /* -------- MODAL: RECETA REQUERIDA -------- */
//   const RecetaModal = () => {
//     if (!showRecetaModal) return null;
//     return (
//       <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
//         <div className="bg-white dark:bg-[#1a2a20] rounded-[2rem] p-8 max-w-md w-full mx-4 shadow-2xl border border-gray-100 dark:border-white/10 animate-in fade-in zoom-in-95 duration-200">
//           <div className="text-center">
//             <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center mx-auto mb-4">
//               <ClipboardList className="w-8 h-8 text-amber-600 dark:text-amber-300" />
//             </div>
//             <h3 className="text-xl font-black text-gray-800 dark:text-emerald-100 mb-2">Receta requerida</h3>
//             <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
//               Esta cita no tiene una receta registrada. Debes registrar la receta antes de marcarla como completada.
//             </p>
//             <div className="flex gap-3 justify-center">
//               <Button
//                 variant="outline"
//                 onClick={() => { setShowRecetaModal(false); setPendingCitaId(null); }}
//                 className="rounded-xl px-6"
//               >
//                 Cancelar
//               </Button>
//               <Button
//                 onClick={irARegistrarReceta}
//                 className="bg-[#1a4731] hover:bg-[#163d2a] rounded-xl px-6"
//               >
//                 Ir a Registrar Receta
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   if (loading) return <div className="p-10 text-center font-bold text-[#1a4731] dark:text-emerald-300 animate-pulse">Cargando gestión de citas...</div>;

//   return (
//     <div className="p-4 md:p-10 max-w-5xl mx-auto">
//       <div className="bg-white dark:bg-[#1a2a20] p-4 md:p-10 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-white/10">
        
//         <div className="flex justify-between items-center mb-10">
//             <h2 className="text-2xl md:text-4xl font-black text-[#1a4731] dark:text-emerald-100 tracking-tight">Gestión de Agenda</h2>
//             <Edit3 className="w-8 md:w-10 h-8 md:h-10 text-green-600/20 dark:text-green-500/30" />
//         </div>

//         {success && <p className="p-4 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-300 rounded-2xl font-bold mb-6 border border-green-100 dark:border-green-800 animate-in fade-in">✓ {success}</p>}
//         {error && <p className="p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 rounded-2xl font-bold mb-6 border border-red-100 dark:border-red-800">⚠ {error}</p>}

//         {!editando ? (
//           <div className="space-y-6">
            
//             {/* BUSCADOR */}
//             <div className="relative">
//                 <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
//                 <Input
//                     placeholder="Buscar paciente por nombre..."
//                     value={busqueda}
//                     onChange={(e) => setBusqueda(e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, ""))}
//                     className="pl-14 rounded-2xl border-gray-200 dark:border-gray-700 dark:bg-[#0f1a14] dark:text-emerald-100 py-8 text-lg shadow-sm focus:ring-[#1a4731]"
//                 />
//             </div>

//             {/* LISTADO DE CITAS AGENDADAS */}
//             <div className="space-y-4">
//               {citasEditables.length > 0 ? (
//                 citasEditables.map((cita) => {
//                   const f = new Date(cita.fecha);
//                   return (
//                     <div 
//                       key={cita.id} 
//                       className="group p-6 border-2 border-gray-50 dark:border-white/5 rounded-3xl flex flex-col md:flex-row justify-between md:items-center gap-4 bg-white dark:bg-[#0f1a14] hover:border-blue-200 dark:hover:border-blue-700 hover:shadow-xl transition-all duration-300"
//                     >
//                       <div className="flex items-center gap-4 md:gap-6">
//                           <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300">
//                               <User className="w-6 h-6" />
//                           </div>
//                           <div>
//                               <p className="font-black text-gray-800 dark:text-emerald-100 text-xl">
//                                   {cita.cliente_data?.nombre} {cita.cliente_data?.apellido}
//                               </p>
//                               <p className="text-sm text-gray-500 dark:text-gray-400 font-bold flex items-center gap-2 mt-1">
//                                   <Calendar className="w-4 h-4" /> 
//                                   {f.toLocaleDateString()} | {f.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
//                               </p>
//                               <span className="inline-block mt-2 text-[10px] bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full font-black uppercase tracking-widest">
//                                   AGENDADA
//                               </span>
//                           </div>
//                       </div>

//                       <div className="flex gap-3 w-full md:w-auto">
//                           <Button 
//                             onClick={() => iniciarEdicion(cita)} 
//                             className="bg-gray-800 hover:bg-black rounded-xl px-6 py-6 transition-transform active:scale-95 flex-1 md:flex-none"
//                           >
//                             <Edit3 className="w-4 h-4 mr-2" /> Modificar
//                           </Button>
                          
//                           <Button 
//                             onClick={() => handleCompletarCita(cita.id)}
//                             className="bg-green-600 hover:bg-green-700 rounded-xl px-6 py-6 shadow-lg shadow-green-100 dark:shadow-green-900/30 flex-1 md:flex-none"
//                           >
//                             <CheckCircle className="w-4 h-4 mr-2" /> Completar
//                           </Button>
//                       </div>
//                     </div>
//                   );
//                 })
//               ) : (
//                 <div className="text-center py-12 md:py-20 bg-gray-50 dark:bg-[#0f1a14] rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-gray-700">
//                     <p className="text-gray-400 dark:text-gray-500 font-bold italic">No hay citas pendientes que coincidan.</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         ) : (
//           /* MODO EDICIÓN */
//           <div className="animate-in slide-in-from-right duration-300">
//             <div className="flex items-center gap-4 mb-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-3xl border-2 border-blue-100 dark:border-blue-800">
//                 <div className="bg-blue-600 p-3 rounded-2xl text-white">
//                     <Edit3 className="w-6 h-6" />
//                 </div>
//                 <div>
//                     <h3 className="text-xl font-black text-blue-900 dark:text-blue-200">Modificando Cita</h3>
//                     <p className="text-blue-700 dark:text-blue-300 font-bold text-sm">Paciente: {editando.clienteNombre}</p>
//                 </div>
//             </div>
            
//             <CitaForm
//               data={editando}
//               setData={setEditando}
//               onSubmit={handleUpdate}
//               onCancel={() => setEditando(null)} 
//               error={error}
//               isEdit={true}
//               horasPermitidas={horasPermitidas}
//               citas={citas} 
//               optometristas={optometristas}
//             />
//           </div>
//         )}
//       </div>
//       <RecetaModal />
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Edit3, CheckCircle, Calendar, User, ClipboardList, Stethoscope, Loader2 } from "lucide-react";
import { obtenerCitas, actualizarEstadoCita, obtenerCitasPorFecha, type Cita } from "@/services/citaService";
import api from "@/api/axiosConfig";
import { useNotifications } from "@/context/NotificationContext";
import { notifyWarning } from "@/lib/notify";
import { useNavigate } from "react-router-dom";

export default function CitaEditar() {
  const navigate = useNavigate();

  /* -------- ESTADOS -------- */
  const [citas, setCitas] = useState<any[]>([]);
  const [optometristas, setOptometristas] = useState<any[]>([]);
  const [editando, setEditando] = useState<any>(null);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showRecetaModal, setShowRecetaModal] = useState(false);
  const [pendingCitaId, setPendingCitaId] = useState<number | null>(null);
  const { addNotification } = useNotifications();

  // Estados para el control de horarios dinámicos al editar
  const [horasBloqueadas, setHorasBloqueadas] = useState<string[]>([]);
  const [cargandoHorarios, setCargandoHorarios] = useState(false);

  const horasPermitidas = [
    "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"
  ];

  const getTodayString = () => new Date().toISOString().split('T')[0];

  /* -------- CARGAR DATOS GENERALES -------- */
  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError("");

      try {
        const resCitas = await obtenerCitas();
        setCitas(Array.isArray(resCitas) ? resCitas : []);
      } catch (citaErr) {
        console.error("Error al obtener citas:", citaErr);
        setError("No se pudieron cargar las citas de la agenda.");
      }

      try {
        const resOpto = await api.get('auth/optometristas/'); 
        setOptometristas(Array.isArray(resOpto.data) ? resOpto.data : []);
      } catch (optoErr: any) {
        console.error("Error al obtener optometristas:", optoErr);
        if (optoErr?.response?.status === 403) {
          setError("El rol actual no tiene permisos para listar optometristas.");
        } else {
          setError("Error al cargar la lista de profesionales.");
        }
      }

    } catch (err) {
      setError("Error de conexión general con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  /* -------- EFECTO: CONTROL DE HORARIOS DINÁMICOS AL EDITAR -------- */
  useEffect(() => {
    if (!editando || !editando.fecha) {
      setHorasBloqueadas([]);
      return;
    }

    const verificarHorariosEdicion = async () => {
      setCargandoHorarios(true);
      const bloqueadas: string[] = [];

      try {
        const todasLasCitas = await obtenerCitasPorFecha(editando.fecha);

        todasLasCitas.forEach((cita: Cita) => {
          // 1. Ignoramos la misma cita que estamos editando para no auto-bloquearnos
          if (Number(cita.id) === Number(editando.id)) return;

          // 2. Solo procesamos citas activas
          if (cita.fecha && cita.estado_cita !== "C" && cita.estado_cita !== "COM") {
            const [fechaCitaIso, tiempoCompleto] = cita.fecha.split('T');

            if (fechaCitaIso !== editando.fecha) return;

            // Extraer hora y minutos limpios de la DB (ignorando milisegundos o Z al final)
            const [horaRaw, minRaw] = tiempoCompleto.split(':');
            let horas = parseInt(horaRaw, 10);
            const minutos = minRaw.substring(0, 2);

            // Conversión manual estricta a 12h sin depender de configuraciones regionales del móvil
            const ampm = horas >= 12 ? 'PM' : 'AM';
            horas = horas % 12;
            horas = horas ? horas : 12; 

            const horaFormateada = `${horas.toString().padStart(2, '0')}:${minutos} ${ampm}`;

            if (!bloqueadas.includes(horaFormateada)) {
              bloqueadas.push(horaFormateada);
            }
          }
        });
      } catch (err) {
        console.error("Error consultando horarios ocupados al editar:", err);
      }

      setHorasBloqueadas(bloqueadas);
      setCargandoHorarios(false);
    };

    verificarHorariosEdicion();
  }, [editando?.fecha, editando?.id]);

  /* -------- LÓGICA DE FILTRADO -------- */
  const citasEditables = citas.filter((c) => {
    const nombreCompleto = `${c.cliente_data?.nombre || ''} ${c.cliente_data?.apellido || ''}`.toLowerCase();
    const cumpleNombre = nombreCompleto.includes(busqueda.toLowerCase());
    const esAgendada = c.estado_cita === 'A';
    return cumpleNombre && esAgendada;
  });

  /* -------- ACCIÓN: INICIAR EDICIÓN (Solución Homogénea de Texto Plano) -------- */
  const iniciarEdicion = (cita: any) => {
    // 1. Separamos fecha e indicador de tiempo directamente desde la cadena ISO de la DB
    const [fechaCitaIso, tiempoCompleto] = cita.fecha.split('T');
    
    // 2. Extraemos hora y minutos de forma limpia
    const [horaRaw, minRaw] = tiempoCompleto.split(':');
    let horas = parseInt(horaRaw, 10);
    const minutos = minRaw.substring(0, 2);

    // 3. Conversión manual estricta a formato 12 Horas
    const ampm = horas >= 12 ? 'PM' : 'AM';
    horas = horas % 12;
    horas = horas ? horas : 12; 

    // 4. Estructuramos la cadena exacta coincidente con horasPermitidas
    const horaFormateadaConstruida = `${horas.toString().padStart(2, '0')}:${minutos} ${ampm}`;

    setEditando({
      ...cita,
      optometrista: String(cita.usuario),
      fecha: fechaCitaIso,
      hora: horaFormateadaConstruida, 
      clienteNombre: `${cita.cliente_data?.nombre} ${cita.cliente_data?.apellido}`,
      motivo: cita.motivo || ""
    });
  };

  /* -------- ACCIÓN: COMPLETAR CITA -------- */
  const handleCompletarCita = async (id: number) => {
    if (!window.confirm("¿Deseas marcar esta cita como completada y abrir el módulo de recetas?")) return;
    
    try {
      setError("");
      await actualizarEstadoCita(id, { estado_cita: "COM" });
      
      addNotification({
        titulo: "Cita completada",
        mensaje: "La cita fue completada con éxito. Redirigiendo...",
        fecha: "Ahora",
      });

      navigate("/recetas/registrar");
    } catch (err) {
      setError("No se pudo actualizar el estado de la cita en el servidor.");
    }
  };

  const irARegistrarReceta = () => {
    setShowRecetaModal(false);
    if (pendingCitaId) {
      navigate(`/recetas/registrar?cita=${pendingCitaId}`);
    }
  };

  /* -------- ACTUALIZAR DATOS (Submit Form) -------- */
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editando.fecha || !editando.hora || !editando.optometrista) {
      notifyWarning("Por favor complete todos los campos obligatorios.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const [time, modifier] = editando.hora.split(' ');
      let [hours, minutes] = time.split(':');
      if (modifier === 'PM' && hours !== '12') hours = String(Number(hours) + 12);
      if (modifier === 'AM' && hours === '12') hours = '00';
      const fechaISO = `${editando.fecha}T${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:00`;

      await actualizarEstadoCita(editando.id, {
        fecha: fechaISO,
        motivo: editando.motivo,
        usuario: Number(editando.optometrista)
      });

      setSuccess("Cita modificada correctamente");
      addNotification({
        titulo: "Cita modificada",
        mensaje: "Los datos de la cita fueron actualizados con éxito.",
        fecha: "Ahora",
      });
      setEditando(null);
      await cargarDatos();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError("Error al guardar los cambios en el servidor.");
    } finally {
      setLoading(false);
    }
  };

  /* -------- MODAL: RECETA REQUERIDA -------- */
  const RecetaModal = () => {
    if (!showRecetaModal) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white dark:bg-[#1a2a20] rounded-[2rem] p-8 max-w-md w-full mx-4 shadow-2xl border border-gray-100 dark:border-white/10 animate-in fade-in zoom-in-95 duration-200">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center mx-auto mb-4">
              <ClipboardList className="w-8 h-8 text-amber-600 dark:text-amber-300" />
            </div>
            <h3 className="text-xl font-black text-gray-800 dark:text-emerald-100 mb-2">Receta requerida</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
              Esta cita no tiene una receta registrada. Debes registrar la receta antes de marcarla como completada.
            </p>
            <div className="flex gap-3 justify-center">
              <Button
                variant="outline"
                onClick={() => { setShowRecetaModal(false); setPendingCitaId(null); }}
                className="rounded-xl px-6"
              >
                Cancelar
              </Button>
              <Button
                onClick={irARegistrarReceta}
                className="bg-[#1a4731] hover:bg-[#163d2a] rounded-xl px-6"
              >
                Ir a Registrar Receta
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading && citas.length === 0) return <div className="p-10 text-center font-bold text-[#1a4731] dark:text-emerald-300 animate-pulse">Cargando gestión de citas...</div>;

  return (
    <div className="p-4 md:p-10 max-w-7xl mx-auto dark:bg-[#0a0f0a]">
      <div className="bg-white dark:bg-[#1a2a20] rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden">
        
        {!editando ? (
          <div className="p-4 md:p-10">
            <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl md:text-4xl font-black text-[#1a4731] dark:text-emerald-100 tracking-tight">Gestión de Agenda</h2>
                <Edit3 className="w-8 md:w-10 h-8 md:h-10 text-green-600/20 dark:text-green-500/30" />
            </div>

            {success && <p className="p-4 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-300 rounded-2xl font-bold mb-6 border border-green-100 dark:border-green-800 animate-in fade-in">✓ {success}</p>}
            {error && <p className="p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 rounded-2xl font-bold mb-6 border border-red-100 dark:border-red-800">⚠ {error}</p>}

            <div className="space-y-6">
              <div className="relative">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                  <Input
                      placeholder="Buscar paciente por nombre..."
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, ""))}
                      className="pl-14 rounded-2xl border-gray-200 dark:border-gray-700 dark:bg-[#0f1a14] dark:text-emerald-100 py-8 text-lg shadow-sm focus:ring-[#1a4731]"
                  />
              </div>

              <div className="space-y-4">
                {citasEditables.length > 0 ? (
                  citasEditables.map((cita) => {
                    const f = new Date(cita.fecha);
                    return (
                      <div 
                        key={cita.id} 
                        className="group p-6 border-2 border-gray-50 dark:border-white/5 rounded-3xl flex flex-col md:flex-row justify-between md:items-center gap-4 bg-white dark:bg-[#0f1a14] hover:border-blue-200 dark:hover:border-blue-700 hover:shadow-xl transition-all duration-300"
                      >
                        <div className="flex items-center gap-4 md:gap-6">
                            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300">
                                <User className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="font-black text-gray-800 dark:text-emerald-100 text-xl">
                                    {cita.cliente_data?.nombre} {cita.cliente_data?.apellido}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 font-bold flex items-center gap-2 mt-1">
                                    <Calendar className="w-4 h-4" /> 
                                    {f.toLocaleDateString()} | {f.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </p>
                                <span className="inline-block mt-2 text-[10px] bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full font-black uppercase tracking-widest">
                                    AGENDADA
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-3 w-full md:w-auto">
                            <Button 
                              onClick={() => iniciarEdicion(cita)} 
                              className="bg-gray-800 hover:bg-black rounded-xl px-6 py-6 transition-transform active:scale-95 flex-1 md:flex-none"
                            >
                              <Edit3 className="w-4 h-4 mr-2" /> Modificar
                            </Button>
                            
                            <Button 
                              onClick={() => handleCompletarCita(cita.id)}
                              className="bg-green-600 hover:bg-green-700 rounded-xl px-6 py-6 shadow-lg shadow-green-100 dark:shadow-green-900/30 flex-1 md:flex-none"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" /> Completar
                            </Button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-12 md:py-20 bg-gray-50 dark:bg-[#0f1a14] rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-gray-700">
                      <p className="text-gray-400 dark:text-gray-500 font-bold italic">No hay citas pendientes que coincidan.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-in slide-in-from-right duration-300">
            <div className="bg-[#1a4731] p-4 md:p-8 text-white flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div>
                <h2 className="text-xl md:text-3xl font-black tracking-tight flex items-center gap-3">
                  <Calendar className="w-8 md:w-10 h-8 md:h-10 text-green-400" />
                  Modificar Horario de Cita
                </h2>
                <p className="text-green-100/60 font-bold text-xs uppercase tracking-[0.3em]">Opti Samuel • Actualización de Agenda</p>
              </div>
              <div className="bg-white/10 px-6 py-3 rounded-2xl backdrop-blur-md border border-white/20">
                <p className="text-[10px] font-black text-green-300 uppercase">Paciente Seleccionado</p>
                <p className="font-bold text-lg">{editando.clienteNombre}</p>
              </div>
            </div>

            <div className="p-4 md:p-10">
              <form onSubmit={handleUpdate} className="space-y-6 md:space-y-10">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <label className="text-xs font-black text-gray-400 dark:text-gray-300 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <Stethoscope className="w-4 h-4" /> 1. Optometrista Asignado
                    </label>
                    <select
                      required
                      value={editando.optometrista}
                      onChange={(e) => setEditando({...editando, optometrista: e.target.value})}
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
                    <label className="text-xs font-black text-gray-400 dark:text-gray-300 uppercase tracking-widest ml-1">2. Detalles / Motivo</label>
                    <Input 
                      placeholder="Ej. Examen de vista, consulta de control..."
                      value={editando.motivo}
                      onChange={(e) => setEditando({...editando, motivo: e.target.value})}
                      className="py-8 rounded-2xl border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-[#0f1a14] focus:bg-white dark:focus:bg-[#1a2a20] shadow-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="p-8 border-2 border-gray-50 dark:border-white/10 rounded-[2.5rem] bg-gray-50/20 dark:bg-[#0f1a14]/20">
                    <label className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-300 tracking-[0.2em] mb-4 block">Nueva Fecha Programada</label>
                    <Input 
                      type="date" 
                      min={getTodayString()}
                      value={editando.fecha}
                      onChange={(e) => setEditando({...editando, fecha: e.target.value, hora: ""})} 
                      className="rounded-2xl border-gray-100 dark:border-gray-700 py-8 text-2xl font-black text-[#1a4731] dark:text-emerald-300 text-center"
                    />
                  </div>

                  <div className="p-8 border-2 border-blue-50 dark:border-blue-800/30 rounded-[2.5rem] bg-blue-50/10 dark:bg-blue-900/10 relative">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <label className="text-[10px] font-black uppercase text-blue-400 dark:text-blue-300 tracking-[0.2em] block text-center">
                        Nuevo Bloque de Horario
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
                            disabled={estaBloqueada || !editando.fecha}
                            onClick={() => setEditando({...editando, hora: h})}
                            className={`py-3 rounded-xl text-[11px] font-black transition-all border-2 ${
                              editando.hora === h 
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

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => setEditando(null)}
                    className="w-full sm:w-1/3 py-6 md:py-8 text-md font-black border-2 border-gray-200 dark:border-gray-700 rounded-[2rem] transition-all active:scale-95 text-gray-500"
                  >
                    CANCELAR REPROGRAMACIÓN
                  </Button>

                  <Button 
                    disabled={loading || !editando.fecha || !editando.hora || !editando.optometrista || !editando.motivo || cargandoHorarios}
                    type="submit" 
                    className="w-full sm:w-2/3 py-6 md:py-8 text-lg font-black bg-[#1a4731] hover:bg-[#0f2d1f] text-white rounded-[2rem] shadow-2xl transition-all active:scale-95 disabled:opacity-20"
                  >
                    {loading ? "GUARDANDO CAMBIOS..." : "CONFIRMAR Y GUARDAR CAMBIOS"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      <RecetaModal />
    </div>
  );
}