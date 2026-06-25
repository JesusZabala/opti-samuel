// import { useState, useEffect } from "react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { obtenerClientes, actualizarCliente, type Cliente } from "@/services/clienteService";

// export default function ClienteEditar() {
//   /* -------- ESTADOS -------- */
//   const [clientes, setClientes] = useState<Cliente[]>([]);
//   const [busqueda, setBusqueda] = useState("");
//   const [editando, setEditando] = useState<Cliente | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<any>("");
//   const [success, setSuccess] = useState("");

//   /* -------- CARGAR LISTA -------- */
//   const cargarClientes = async () => {
//     try {
//       setLoading(true);
//       const data = await obtenerClientes();
//       // Nos aseguramos de que sea un array para evitar el error .filter is not a function
//       setClientes(Array.isArray(data) ? data : []);
//     } catch (err) {
//       setError("Error al cargar la lista de clientes.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     cargarClientes();
//   }, []);

//   /* -------- FILTRADO SEGURO -------- */
//   const clientesFiltrados = (clientes || []).filter((c) => {
//     const term = busqueda.toLowerCase();
//     return (
//       (c.nombre?.toLowerCase() || "").includes(term) ||
//       (c.apellido?.toLowerCase() || "").includes(term) ||
//       (c.identificacion || "").includes(term)
//     );
//   });

//   /* -------- UPDATE -------- */
//   const handleUpdate = async () => {
//     if (!editando?.id) return;

//     try {
//       setError("");
//       setSuccess("Actualizando...");

//       await actualizarCliente(editando.id, {
//         nombre: editando.nombre,
//         apellido: editando.apellido,
//         email: editando.email,
//         telefono: editando.telefono,
//         genero: editando.genero,
//         tipo_cliente: editando.tipo_cliente,
//         estado_cliente: editando.estado_cliente
//       });

//       setSuccess("¡Cliente actualizado!");
//       setEditando(null); 
//       await cargarClientes(); 

//       setTimeout(() => setSuccess(""), 3000);
//     } catch (err: any) {
//       setSuccess("");
//       setError(err); 
//     }
//   };

//   if (loading) return <div className="p-10 text-center font-bold text-green-800">Cargando clientes...</div>;

//   return (
//     <div className="p-10">
//       <div className="bg-white p-10 rounded-3xl shadow-xl min-h-[400px]">
//         <h2 className="text-3xl font-black text-[#1a4731] mb-8">
//           {editando ? `Modificar Datos` : "Editar Clientes"}
//         </h2>

//         {success && <p className="mb-4 text-green-600 font-bold bg-green-50 p-3 rounded-xl">{success}</p>}
//         {error && <p className="mb-4 text-red-600 bg-red-50 p-3 rounded-xl">{typeof error === 'string' ? error : "Error en el servidor"}</p>}

//         {/* VISTA 1: BUSCADOR */}
//         {!editando ? (
//           <div className="animate-in fade-in duration-500">
//             <Input 
//               placeholder="Buscar por cédula o nombre..." 
//               value={busqueda}
//               onChange={(e) => setBusqueda(e.target.value)}
//               className="mb-6 p-6 rounded-xl border-gray-200"
//             />

//             <div className="grid gap-3">
//               {clientesFiltrados.map((c) => (
//                 <div key={c.id} className="p-4 border rounded-2xl flex justify-between items-center hover:bg-gray-50 transition-all border-gray-100 shadow-sm">
//                   <div>
//                     <p className="font-bold text-[#1a4731]">{c.nombre} {c.apellido}</p>
//                     <p className="text-xs text-gray-400 font-mono">{c.tipo_cliente}-{c.identificacion}</p>
//                   </div>
//                   <Button onClick={() => setEditando({ ...c })} className="bg-[#1a4731] hover:bg-[#123122]">
//                     Seleccionar
//                   </Button>
//                 </div>
//               ))}
//               {clientesFiltrados.length === 0 && <p className="text-center text-gray-400 py-10">No se encontraron clientes.</p>}
//             </div>
//           </div>
//         ) : (
//           /* VISTA 2: FORMULARIO */
//           <div className="animate-in slide-in-from-right-5 duration-300">
//              <div className="bg-gray-50 p-4 rounded-xl mb-6">
//                 <p className="text-sm text-gray-500 italic">Editando a: <strong>{editando.nombre} {editando.apellido}</strong></p>
//              </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="space-y-2">
//                 <label className="text-[10px] font-black text-gray-400 ml-1">NOMBRE</label>
//                 <Input 
//                   value={editando.nombre || ""} 
//                   onChange={(e) => setEditando({...editando, nombre: e.target.value})}
//                 />
//               </div>

//               <div className="space-y-2">
//                 <label className="text-[10px] font-black text-gray-400 ml-1">APELLIDO</label>
//                 <Input 
//                   value={editando.apellido || ""} 
//                   onChange={(e) => setEditando({...editando, apellido: e.target.value})}
//                 />
//               </div>

//               <div className="space-y-2">
//                 <label className="text-[10px] font-black text-gray-400 ml-1">TELÉFONO</label>
//                 <Input 
//                   value={editando.telefono || ""} 
//                   onChange={(e) => setEditando({...editando, telefono: e.target.value})}
//                 />
//               </div>

//               <div className="space-y-2">
//                 <label className="text-[10px] font-black text-gray-400 ml-1">CORREO</label>
//                 <Input 
//                   value={editando.email || ""} 
//                   onChange={(e) => setEditando({...editando, email: e.target.value})}
//                 />
//               </div>
//             </div>

//             <div className="flex gap-4 mt-10">
//               <Button onClick={handleUpdate} className="bg-green-700 hover:bg-green-800 flex-1 h-12 font-bold">
//                 Actualizar Cliente
//               </Button>
//               <Button variant="outline" onClick={() => setEditando(null)} className="flex-1 h-12 font-bold border-gray-300">
//                 Volver a la lista
//               </Button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { obtenerClientes, actualizarCliente, type Cliente } from "@/services/clienteService";

export default function ClienteEditar() {
  /* -------- ESTADOS -------- */
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [editando, setEditando] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>("");
  const [success, setSuccess] = useState("");

  /* -------- CARGAR LISTA -------- */
  const cargarClientes = async () => {
    try {
      setLoading(true);
      const data = await obtenerClientes();
      setClientes(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Error al cargar la lista de clientes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  /* -------- FILTRADO SEGURO -------- */
  const clientesFiltrados = (clientes || []).filter((c) => {
    const term = busqueda.toLowerCase();
    return (
      (c.nombre?.toLowerCase() || "").includes(term) ||
      (c.apellido?.toLowerCase() || "").includes(term) ||
      (c.identificacion || "").includes(term)
    );
  });

  /* -------- VALIDACIONES DE EDICIÓN -------- */
  const handleEditChange = (field: keyof Cliente, value: string) => {
    if (!editando) return;

    let sanitizedValue = value;

    // 1. Letras solamente y límite de 40
    if (field === "nombre" || field === "apellido") {
      sanitizedValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
      if (sanitizedValue.length > 40) return;
    }

    // 2. Solo números y "+" para teléfono (Límite 15)
    if (field === "telefono") {
      sanitizedValue = value.replace(/[^0-9+]/g, "").slice(0, 15);
    }

    // 3. Email (Límite 60)
    if (field === "email") {
      sanitizedValue = value.toLowerCase().slice(0, 60);
    }

    setEditando({ ...editando, [field]: sanitizedValue });
  };

  /* -------- UPDATE -------- */
  const handleUpdate = async () => {
    if (!editando?.id) return;

    // Validación básica de campos obligatorios
    if (!editando.nombre || !editando.apellido || !editando.telefono) {
      setError("Nombre, Apellido y Teléfono son obligatorios.");
      return;
    }

    try {
      setError("");
      setSuccess("Actualizando...");

      await actualizarCliente(editando.id, {
        nombre: editando.nombre,
        apellido: editando.apellido,
        email: editando.email,
        telefono: editando.telefono,
        genero: editando.genero,
        tipo_cliente: editando.tipo_cliente,
        estado_cliente: editando.estado_cliente
      });

      setSuccess("¡Cliente actualizado con éxito!");
      
      // Esperamos un poco para que el usuario vea el éxito antes de cerrar
      setTimeout(async () => {
        setEditando(null); 
        setSuccess("");
        await cargarClientes(); 
      }, 1500);

    } catch (err: any) {
      setSuccess("");
      setError(err); 
    }
  };

  if (loading) return <div className="p-10 text-center font-bold text-[#1a4731] dark:text-emerald-100 animate-pulse">Cargando base de datos de clientes...</div>;

  return (
    <div className="p-3 md:p-10 dark:bg-[#0a0f0a]">
      <div className="bg-white dark:bg-[#1a2a20] p-4 md:p-10 rounded-3xl shadow-xl min-h-[400px] border border-gray-100 dark:border-white/10">
        <h2 className="text-3xl font-black text-[#1a4731] dark:text-emerald-100 mb-8">
          {editando ? `Modificar Datos` : "Panel de Clientes"}
        </h2>

        {success && <div className="mb-6 text-green-700 dark:text-emerald-300 font-bold bg-green-50 dark:bg-emerald-900/20 p-4 rounded-xl border border-green-200 dark:border-emerald-800/30 flex items-center gap-2"><span>✓</span> {success}</div>}
        
        {error && (
          <div className="mb-6 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-200 dark:border-red-800/30 text-sm">
             {typeof error === 'object' ? "Error: Revisa los datos ingresados." : error}
          </div>
        )}

        {/* VISTA 1: BUSCADOR */}
        {!editando ? (
          <div className="animate-in fade-in duration-500">
            <div className="relative mb-8">
                <Input 
                  placeholder="Buscar por cédula, nombre o apellido..." 
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="p-7 rounded-2xl border-gray-200 dark:border-gray-700 shadow-sm focus:ring-2 focus:ring-green-600 pl-12"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300 text-xl">🔍</span>
            </div>

            <div className="grid gap-4">
              {clientesFiltrados.map((c) => (
                <div key={c.id} className="p-5 border rounded-2xl flex-col md:flex-row flex justify-between items-start md:items-center gap-3 hover:bg-gray-50 dark:hover:bg-[#0f1a14] transition-all border-gray-100 dark:border-white/10 shadow-sm group">
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-[#1a4731] dark:text-emerald-100 text-lg">{c.nombre} {c.apellido}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                      <span className="bg-gray-100 dark:bg-[#0f1a14] px-2 py-0.5 rounded mr-2">{c.tipo_cliente}-{c.identificacion}</span>
                      {c.telefono}
                    </p>
                  </div>
                  <Button onClick={() => setEditando({ ...c })} className="bg-[#1a4731] hover:bg-[#123122] rounded-xl px-6 h-12 transition-transform active:scale-95 w-full md:w-auto shrink-0">Editar Perfil</Button>
                </div>
              ))}
              {clientesFiltrados.length === 0 && (
                <div className="text-center py-20 border-2 border-dashed border-gray-100 dark:border-white/10 rounded-3xl">
                    <p className="text-gray-400 dark:text-gray-300">No se encontraron clientes con esa búsqueda.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* VISTA 2: FORMULARIO DE EDICIÓN */
          <div className="animate-in slide-in-from-right-5 duration-300">
             <div className="bg-[#1a4731]/5 dark:bg-[#1a4731]/20 p-5 rounded-2xl mb-8 border border-[#1a4731]/10 dark:border-[#1a4731]/30">
                <p className="text-sm text-gray-600 dark:text-gray-300">ID de Cliente: <span className="font-mono font-bold text-[#1a4731] dark:text-emerald-100">{editando.identificacion}</span></p>
                <p className="text-lg font-black text-[#1a4731] dark:text-emerald-100 uppercase">{editando.nombre} {editando.apellido}</p>
             </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 dark:text-gray-300 uppercase tracking-wider ml-1">Nombre</label>
                <Input 
                  value={editando.nombre || ""} 
                  onChange={(e) => handleEditChange("nombre", e.target.value)}
                  maxLength={40}
                  className="h-12 rounded-xl capitalize"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 dark:text-gray-300 uppercase tracking-wider ml-1">Apellido</label>
                <Input 
                  value={editando.apellido || ""} 
                  onChange={(e) => handleEditChange("apellido", e.target.value)}
                  maxLength={40}
                  className="h-12 rounded-xl capitalize"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 dark:text-gray-300 uppercase tracking-wider ml-1">Teléfono Móvil</label>
                <Input 
                  value={editando.telefono || ""} 
                  onChange={(e) => handleEditChange("telefono", e.target.value)}
                  maxLength={15}
                  type="tel"
                  className="h-12 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 dark:text-gray-300 uppercase tracking-wider ml-1">Correo Electrónico</label>
                <Input 
                  value={editando.email || ""} 
                  onChange={(e) => handleEditChange("email", e.target.value)}
                  maxLength={60}
                  type="email"
                  className="h-12 rounded-xl"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mt-12">
              <Button onClick={handleUpdate} className="bg-[#1a4731] hover:bg-[#123122] flex-1 h-14 text-lg font-bold shadow-lg shadow-green-900/10">
                Guardar Cambios
              </Button>
              <Button variant="outline" onClick={() => setEditando(null)} className="flex-1 h-14 text-lg font-bold border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-[#0f1a14]">
                Cancelar Edición
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

