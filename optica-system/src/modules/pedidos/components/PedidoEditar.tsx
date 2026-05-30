// import { useState } from "react";
// import { Button } from "@/components/ui/button";

// export default function PedidoEditar() {

//   /* -------- DATOS SIMULADOS -------- */

//   const [pedidos, setPedidos] = useState([
//     {
//       id: 1,
//       cliente: "Juan Pérez",
//       tipo: "C",
//       estado: "E",
//       descripcion: "Lentes completos"
//     },
//     {
//       id: 2,
//       cliente: "María González",
//       tipo: "SL",
//       estado: "L",
//       descripcion: "Solo lentes"
//     }
//   ]);

//   const [editando, setEditando] = useState<any>(null);
//   const [success, setSuccess] = useState("");

//   /* -------- HELPERS -------- */

//   const getEstado = (estado: string) => {
//     if (estado === "E") return "Enviado";
//     if (estado === "L") return "Listo";
//     if (estado === "EN") return "Entregado";
//   };

//   const getTipo = (tipo: string) => {
//     if (tipo === "C") return "Completo";
//     if (tipo === "SL") return "Solo Lente";
//     if (tipo === "SM") return "Solo Montura";
//   };

//   /* -------- CAMBIAR ESTADO -------- */

//   const cambiarEstado = (nuevoEstado: string) => {

//     const actualizados = pedidos.map((p) =>
//       p.id === editando.id ? { ...p, estado: nuevoEstado } : p
//     );

//     setPedidos(actualizados);
//     setEditando(null);

//     setSuccess("Estado actualizado correctamente");
//     setTimeout(() => setSuccess(""), 3000);
//   };

//   /* -------- VALIDAR FLUJO -------- */

//   const puedePasarAListo = editando?.estado === "E";
//   const puedePasarAEntregado = editando?.estado === "L";

//   /* -------- UI -------- */

//   return (
//     <div className="p-10">

//       <div className="bg-white p-10 rounded-3xl shadow-xl">

//         <h2 className="text-3xl font-black text-[#1a4731] mb-8">
//           Editar Estado de Pedido
//         </h2>

//         {/* MENSAJE */}
//         {success && (
//           <p className="text-green-600 font-semibold mb-4">
//             {success}
//           </p>
//         )}

//         {/* LISTA */}
//         {!editando && (
//           <div className="space-y-4">

//             {pedidos.map((p) => (
//               <div
//                 key={p.id}
//                 className="p-5 border rounded-xl flex justify-between items-center"
//               >
//                 <div>
//                   <p className="font-bold">{p.cliente || "Sin cliente"}</p>
//                   <p className="text-sm text-gray-500">
//                     {getTipo(p.tipo)} | {getEstado(p.estado)}
//                   </p>
//                 </div>

//                 <Button
//                   onClick={() => setEditando(p)}
//                   className="bg-green-600"
//                 >
//                   Cambiar Estado
//                 </Button>
//               </div>
//             ))}

//           </div>
//         )}

//         {/* EDITAR ESTADO */}
//         {editando && (

//           <div className="mt-6 border p-6 rounded-xl space-y-6">

//             <h3 className="text-xl font-bold text-[#1a4731]">
//               Actualizar Estado
//             </h3>

//             <p><strong>Cliente:</strong> {editando.cliente || "N/A"}</p>
//             <p><strong>Tipo:</strong> {getTipo(editando.tipo)}</p>
//             <p><strong>Estado actual:</strong> {getEstado(editando.estado)}</p>

//             {/* BOTONES SEGÚN FLUJO */}

//             <div className="flex gap-4">

//               {puedePasarAListo && (
//                 <Button
//                   onClick={() => cambiarEstado("L")}
//                   className="bg-yellow-500 hover:bg-yellow-400"
//                 >
//                   Marcar como Listo
//                 </Button>
//               )}

//               {puedePasarAEntregado && (
//                 <Button
//                   onClick={() => cambiarEstado("EN")}
//                   className="bg-blue-600 hover:bg-blue-500"
//                 >
//                   Marcar como Entregado
//                 </Button>
//               )}

//             </div>

//             {/* CANCELAR */}
//             <Button
//               variant="outline"
//               onClick={() => setEditando(null)}
//             >
//               Cancelar
//             </Button>

//           </div>
//         )}

//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { obtenerPedido, actualizarEstadoPedido } from "@/services/pedidoService";

export default function PedidoEntregar() {
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [seleccionado, setSeleccionado] = useState<any>(null);

  // 1. CARGA DE DATOS (Solo traeremos los que están listos)
  const cargarPedidosListos = async () => {
    try {
      setLoading(false);
      const data = await obtenerPedido();
      // Filtramos en el cliente para mostrar solo "Listos" (L)
      const listos = data.filter((p: any) => p.estado_pedido === "L");
      setPedidos(listos);
    } catch (error) {
      console.error(error);
      alert("Error al cargar pedidos listos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPedidosListos();
  }, []);

  // 2. PROCESAR ENTREGA
  const ejecutarEntrega = async (id: number) => {
    const confirmar = window.confirm("¿Confirmas que el pedido ha sido entregado al cliente?");
    if (!confirmar) return;

    try {
      await actualizarEstadoPedido(id, "EN"); // Pasa a Entregado
      alert("Pedido marcado como ENTREGADO correctamente");
      setSeleccionado(null);
      cargarPedidosListos(); // Refrescar lista
    } catch (error) {
      alert("No se pudo procesar la entrega");
    }
  };

  /* -------- HELPERS -------- */
  const getTipoLabel = (tipo: string) => {
    const tipos: any = { 'C': "Completo", 'SL': "Solo Lente", 'SM': "Solo Montura" };
    return tipos[tipo] || tipo;
  };

  const pedidosFiltrados = pedidos.filter((p) => {
    const nombreCompleto = `${p.cliente_data?.nombre || ''} ${p.cliente_data?.apellido || ''}`.toLowerCase();
    return nombreCompleto.includes(busqueda.toLowerCase());
  });

  if (loading) return <div className="p-10 text-center font-bold text-[#1a4731] dark:text-emerald-100">Buscando pedidos listos...</div>;

  return (
    <div className="p-10 dark:bg-[#0a0f0a]">
      <div className="bg-white dark:bg-[#1a2a20] p-10 rounded-3xl shadow-xl max-w-5xl border border-gray-100 dark:border-white/10 mx-auto">
        
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-black text-[#1a4731] dark:text-emerald-100">Entrega de Pedidos</h2>
          <div className="bg-green-100 dark:bg-emerald-900/20 text-green-800 dark:text-emerald-300 px-4 py-1 rounded-full text-sm font-bold">
            {pedidos.length} Pedidos por entregar
          </div>
        </div>

        {!seleccionado ? (
          <div className="space-y-6">
            <p className="text-gray-500 dark:text-gray-400">
              A continuación se muestran los pedidos que ya están en óptica y listos para ser retirados.
            </p>

            {/* BUSCADOR */}
            <Input
              placeholder="Buscar por cliente para entregar..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="rounded-xl border-gray-200 dark:border-gray-700 py-6 text-lg shadow-sm"
            />

            {/* LISTA DE LISTOS */}
            <div className="mt-8 space-y-4">
              {pedidosFiltrados.length > 0 ? (
                pedidosFiltrados.map((p) => (
                  <div 
                    key={p.id} 
                    className="p-6 border rounded-2xl flex justify-between items-center bg-white dark:bg-[#1a2a20] hover:border-blue-300 transition-all shadow-sm border-l-8 border-l-green-500"
                  >
                    <div>
                      <p className="font-bold text-gray-800 dark:text-gray-200 text-xl">
                        {p.cliente_data?.nombre} {p.cliente_data?.apellido}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {getTipoLabel(p.tipo_pedido)} | <span className="text-blue-600 dark:text-blue-400 font-bold">Listo en Óptica</span>
                      </p>
                    </div>
                    <Button 
                      onClick={() => setSeleccionado(p)} 
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6"
                    >
                      Procesar Entrega
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 text-gray-400 dark:text-gray-300 italic bg-gray-50 dark:bg-[#0f1a14] rounded-3xl">
                  {busqueda ? "No hay pedidos listos que coincidan con la búsqueda." : "No hay pedidos pendientes de entrega actualmente."}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* VISTA DE CONFIRMACIÓN DE ENTREGA */
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="border-b dark:border-white/10 pb-6">
               <h3 className="text-2xl font-bold text-[#1a4731] dark:text-emerald-100">Confirmar Entrega de Pedido #{seleccionado.id}</h3>
               <p className="text-gray-500 dark:text-gray-400">Verifica los datos antes de entregar al cliente.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-50 dark:bg-[#0f1a14] p-6 rounded-3xl space-y-4">
                <h4 className="font-bold text-gray-400 dark:text-gray-300 uppercase text-xs tracking-widest">Información del Cliente</h4>
                <p className="text-xl font-bold">{seleccionado.cliente_data?.nombre} {seleccionado.cliente_data?.apellido}</p>
                <p><strong>Identificación:</strong> {seleccionado.cliente_data?.identificacion}</p>
                <p><strong>Descripción:</strong> {seleccionado.descripcion}</p>
              </div>

              <div className="flex flex-col justify-center space-y-4">
                <Button 
                  onClick={() => ejecutarEntrega(seleccionado.id)}
                  className="bg-green-700 hover:bg-green-800 text-white py-8 text-xl font-black rounded-2xl shadow-lg"
                >
                  MARCAR COMO ENTREGADO ✅
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => setSeleccionado(null)}
                  className="py-4 rounded-xl border-2"
                >
                  Cancelar / Volver
                </Button>
              </div>
            </div>

            {/* PEQUEÑO RESUMEN TÉCNICO PARA ESTAR SEGUROS */}
            <div className="p-4 border border-dashed rounded-2xl text-sm text-gray-500 dark:text-gray-400">
              <strong>Nota:</strong> Al presionar "Marcar como entregado", el pedido saldrá de la lista de pendientes y se notificará el cierre del proceso en el sistema.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}