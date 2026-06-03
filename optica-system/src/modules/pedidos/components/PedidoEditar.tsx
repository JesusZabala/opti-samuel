// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { obtenerPedido, actualizarEstadoPedido } from "@/services/pedidoService";

// type FiltroEstado = 'E' | 'L';

// export default function PedidoEntregar() {
//   const [pedidos, setPedidos] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [busqueda, setBusqueda] = useState("");
//   const [filtroTab, setFiltroTab] = useState<FiltroEstado>('E'); // 'E' = En Laboratorio, 'L' = En Tienda
//   const [seleccionado, setSeleccionado] = useState<any>(null);

//   // 1. CARGA DE DATOS (Traemos los pendientes de entrega: 'E' y 'L')
//   const cargarPedidosPendientes = async () => {
//     try {
//       setLoading(true);
//       const data = await obtenerPedido();
//       // Filtramos para ignorar los ya entregados ('EN')
//       const pendientes = data.filter((p: any) => p.estado_pedido !== "EN");
//       setPedidos(pendientes);
//     } catch (error) {
//       console.error(error);
//       alert("Error al cargar los pedidos");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     cargarPedidosPendientes();
//   }, []);

//   // 2. PROCESAR ACCIONES DINÁMICAS (Colocar en tienda o Entregar)
//   const ejecutarCambioEstado = async (id: number, estadoActual: string) => {
//     const esEnviado = estadoActual === "E";
//     const nuevoEstado = esEnviado ? "L" : "EN";
//     const mensajeConfirmacion = esEnviado 
//       ? "¿Confirmas que el pedido ha llegado del laboratorio y ya está en la tienda?"
//       : "¿Confirmas que el pedido ha sido entregado al cliente?";

//     const confirmar = window.confirm(mensajeConfirmacion);
//     if (!confirmar) return;

//     try {
//       await actualizarEstadoPedido(id, nuevoEstado);
//       alert(esEnviado ? "Pedido colocado en TIENDA correctamente" : "Pedido marcado como ENTREGADO correctamente");
//       setSeleccionado(null);
//       cargarPedidosPendientes(); // Refrescar lista general
//     } catch (error) {
//       alert("No se pudo procesar el cambio de estado");
//     }
//   };

//   /* -------- HELPERS -------- */
//   const getTipoLabel = (tipo: string) => {
//     const tipos: any = { 'C': "Completo", 'SL': "Solo Lente", 'SM': "Solo Montura" };
//     return tipos[tipo] || tipo;
//   };

//   // Contadores para los botones de las pestañas
//   const totalLaboratorio = pedidos.filter((p) => p.estado_pedido === "E").length;
//   const totalTienda = pedidos.filter((p) => p.estado_pedido === "L").length;

//   // Filtrado final: Cruza el estado de la pestaña activa con el buscador de clientes
//   const pedidosFiltrados = pedidos.filter((p) => {
//     const perteneceTab = p.estado_pedido === filtroTab;
//     const nombreCompleto = `${p.cliente_data?.nombre || ''} ${p.cliente_data?.apellido || ''}`.toLowerCase();
//     const coincideBusqueda = nombreCompleto.includes(busqueda.toLowerCase());
//     return perteneceTab && coincideBusqueda;
//   });

//   if (loading) return <div className="p-10 text-center font-bold text-[#1a4731] dark:text-emerald-100">Buscando pedidos...</div>;

//   return (
//     <div className="p-10 dark:bg-[#0a0f0a]">
//       <div className="bg-white dark:bg-[#1a2a20] p-10 rounded-3xl shadow-xl max-w-5xl border border-gray-100 dark:border-white/10 mx-auto">
        
//         {/* TITULO Y CONTADORES */}
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
//           <h2 className="text-3xl font-black text-[#1a4731] dark:text-emerald-100">Control de Pedidos</h2>
          
//           {/* PESTAÑAS DE FILTRADO (TABS) */}
//           <div className="flex bg-gray-100 dark:bg-black/20 p-1 rounded-xl w-full md:w-auto">
//             <button
//               onClick={() => { setFiltroTab('E'); setSeleccionado(null); }}
//               className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-bold transition-all ${
//                 filtroTab === 'E'
//                   ? "bg-[#1a4731] text-white shadow"
//                   : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
//               }`}
//             >
//               En Laboratorio ({totalLaboratorio})
//             </button>
//             <button
//               onClick={() => { setFiltroTab('L'); setSeleccionado(null); }}
//               className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-bold transition-all ${
//                 filtroTab === 'L'
//                   ? "bg-[#1a4731] text-white shadow"
//                   : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
//               }`}
//             >
//               En Tienda ({totalTienda})
//             </button>
//           </div>
//         </div>

//         {!seleccionado ? (
//           <div className="space-y-6">
//             <p className="text-gray-500 dark:text-gray-400">
//               {filtroTab === 'E' 
//                 ? "Órdenes enviadas al laboratorio óptico en espera de ser recibidas."
//                 : "Trabajos listos en óptica esperando el retiro por parte del cliente."}
//             </p>

//             {/* BUSCADOR */}
//             <Input
//               placeholder={filtroTab === 'E' ? "Buscar pedidos en laboratorio..." : "Buscar por cliente para entregar..."}
//               value={busqueda}
//               onChange={(e) => setBusqueda(e.target.value)}
//               className="rounded-xl border-gray-200 dark:border-gray-700 py-6 text-lg shadow-sm"
//             />

//             {/* LISTA DE PEDIDOS FILTRADOS */}
//             <div className="mt-8 space-y-4">
//               {pedidosFiltrados.length > 0 ? (
//                 pedidosFiltrados.map((p) => (
//                   <div 
//                     key={p.id} 
//                     className={`p-6 border rounded-2xl flex justify-between items-center bg-white dark:bg-[#1a2a20] transition-all shadow-sm border-l-8 ${
//                       filtroTab === 'E' ? "border-l-amber-500 hover:border-amber-300" : "border-l-green-500 hover:border-green-300"
//                     }`}
//                   >
//                     <div>
//                       <p className="font-bold text-gray-800 dark:text-gray-200 text-xl">
//                         {p.cliente_data?.nombre} {p.cliente_data?.apellido}
//                       </p>
//                       <p className="text-sm text-gray-500 dark:text-gray-400">
//                         {getTipoLabel(p.tipo_pedido)} | <span className={filtroTab === 'E' ? "text-amber-600 font-bold" : "text-green-600 font-bold"}>
//                           {filtroTab === 'E' ? "En Laboratorio" : "Listo en Óptica"}
//                         </span>
//                       </p>
//                     </div>
//                     <Button 
//                       onClick={() => setSeleccionado(p)} 
//                       className={`rounded-xl px-6 text-white font-bold ${
//                         filtroTab === 'E' ? "bg-amber-600 hover:bg-amber-700" : "bg-green-700 hover:bg-green-800"
//                       }`}
//                     >
//                       {filtroTab === 'E' ? "Recibir en Tienda" : "Procesar Entrega"}
//                     </Button>
//                   </div>
//                 ))
//               ) : (
//                 <div className="text-center py-20 text-gray-400 dark:text-gray-300 italic bg-gray-50 dark:bg-[#0f1a14] rounded-3xl">
//                   {busqueda ? "No hay resultados que coincidan con la búsqueda." : "No hay pedidos en este estado actualmente."}
//                 </div>
//               )}
//             </div>
//           </div>
//         ) : (
//           /* VISTA DE CONFIRMACIÓN DETALLADA */
//           <div className="space-y-8 animate-in fade-in duration-300">
//             <div className="border-b dark:border-white/10 pb-6">
//                <h3 className="text-2xl font-bold text-[#1a4731] dark:text-emerald-100">
//                  {seleccionado.estado_pedido === "E" ? "Recibir Trabajo de Laboratorio" : "Confirmar Entrega de Pedido"} #{seleccionado.id}
//                </h3>
//                <p className="text-gray-500 dark:text-gray-400">Verifica los datos antes de cambiar el estado en el sistema.</p>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//               <div className="bg-gray-50 dark:bg-[#0f1a14] p-6 rounded-3xl space-y-4">
//                 <h4 className="font-bold text-gray-400 dark:text-gray-300 uppercase text-xs tracking-widest">Información del Cliente</h4>
//                 <p className="text-xl font-bold">{seleccionado.cliente_data?.nombre} {seleccionado.cliente_data?.apellido}</p>
//                 <p><strong>Identificación:</strong> {seleccionado.cliente_data?.identificacion || 'No posee'}</p>
//                 <p><strong>Tipo de Orden:</strong> {getTipoLabel(seleccionado.tipo_pedido)}</p>
//                 <p><strong>Descripción:</strong> {seleccionado.descripcion}</p>
//                 {seleccionado.observacion && <p><strong>Observación:</strong> {seleccionado.observacion}</p>}
//               </div>

//               <div className="flex flex-col justify-center space-y-4">
//                 <Button 
//                   onClick={() => ejecutarCambioEstado(seleccionado.id, seleccionado.estado_pedido)}
//                   className={`py-8 text-xl font-black rounded-2xl shadow-lg text-white ${
//                     seleccionado.estado_pedido === "E" ? "bg-amber-600 hover:bg-amber-700" : "bg-green-700 hover:bg-green-800"
//                   }`}
//                 >
//                   {seleccionado.estado_pedido === "E" ? "COLOCAR EN TIENDA 🏪" : "COMPLETAR ENTREGA ✅"}
//                 </Button>
                
//                 <Button 
//                   variant="outline" 
//                   onClick={() => setSeleccionado(null)}
//                   className="py-4 rounded-xl border-2"
//                 >
//                   Cancelar / Volver
//                 </Button>
//               </div>
//             </div>

//             <div className="p-4 border border-dashed rounded-2xl text-sm text-gray-500 dark:text-gray-400">
//               <strong>Nota:</strong> Al presionar el botón de confirmación, la orden cambiará automáticamente su estado técnico y actualizará los contadores globales.
//             </div>
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

type FiltroEstado = 'E' | 'L';

export default function PedidoEntregar() {
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [filtroTab, setFiltroTab] = useState<FiltroEstado>('E'); // 'E' = En Laboratorio, 'L' = En Tienda
  const [seleccionado, setSeleccionado] = useState<any>(null);

  // 1. CARGA DE DATOS (Traemos los pendientes de entrega: 'E' y 'L')
  const cargarPedidosPendientes = async () => {
    try {
      setLoading(true);
      const data = await obtenerPedido();
      // Filtramos para ignorar los ya entregados ('EN')
      const pendientes = data.filter((p: any) => p.estado_pedido !== "EN");
      setPedidos(pendientes);
    } catch (error) {
      console.error(error);
      alert("Error al cargar los pedidos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPedidosPendientes();
  }, []);

  // 2. PROCESAR ACCIONES DINÁMICAS (Colocar en tienda o Entregar)
  const ejecutarCambioEstado = async (id: number, estadoActual: string) => {
    const esEnviado = estadoActual === "E";
    const nuevoEstado = esEnviado ? "L" : "EN";
    const mensajeConfirmacion = esEnviado 
      ? "¿Confirmas que el pedido ha llegado del laboratorio y ya está en la tienda?"
      : "¿Confirmas que el pedido ha sido entregado al cliente?";

    const confirmar = window.confirm(mensajeConfirmacion);
    if (!confirmar) return;

    try {
      await actualizarEstadoPedido(id, nuevoEstado);
      alert(esEnviado ? "Pedido colocado en TIENDA correctamente" : "Pedido marcado como ENTREGADO correctamente");
      setSeleccionado(null);
      cargarPedidosPendientes(); // Refrescar lista general
    } catch (error) {
      alert("No se pudo procesar el cambio de estado");
    }
  };

  /* -------- HELPERS -------- */
  const getTipoLabel = (tipo: string) => {
    const tipos: any = { 'C': "Completo", 'SL': "Solo Lente", 'SM': "Solo Montura" };
    return tipos[tipo] || tipo;
  };

  // Contadores para los botones de las pestañas
  const totalLaboratorio = pedidos.filter((p) => p.estado_pedido === "E").length;
  const totalTienda = pedidos.filter((p) => p.estado_pedido === "L").length;

  // Filtrado final: Cruza el estado de la pestaña activa con el buscador de clientes
  const pedidosFiltrados = pedidos.filter((p) => {
    const perteneceTab = p.estado_pedido === filtroTab;
    const nombreCompleto = `${p.cliente_data?.nombre || ''} ${p.cliente_data?.apellido || ''}`.toLowerCase();
    const coincideBusqueda = nombreCompleto.includes(busqueda.toLowerCase());
    return perteneceTab && coincideBusqueda;
  });

  // Helper para obtener el primer elemento del detalle de manera segura
  const primerDetalle = seleccionado?.info_detalle?.[0];

  if (loading) return <div className="p-10 text-center font-bold text-[#1a4731] dark:text-emerald-100">Buscando pedidos...</div>;

  return (
    <div className="p-10 dark:bg-[#0a0f0a]">
      <div className="bg-white dark:bg-[#1a2a20] p-10 rounded-3xl shadow-xl max-w-5xl border border-gray-100 dark:border-white/10 mx-auto">
        
        {/* TITULO Y CONTADORES */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h2 className="text-3xl font-black text-[#1a4731] dark:text-emerald-100">Control de Pedidos</h2>
          
          {/* PESTAÑAS DE FILTRADO (TABS) */}
          <div className="flex bg-gray-100 dark:bg-black/20 p-1 rounded-xl w-full md:w-auto">
            <button
              onClick={() => { setFiltroTab('E'); setSeleccionado(null); }}
              className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                filtroTab === 'E'
                  ? "bg-[#1a4731] text-white shadow"
                  : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              En Laboratorio ({totalLaboratorio})
            </button>
            <button
              onClick={() => { setFiltroTab('L'); setSeleccionado(null); }}
              className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                filtroTab === 'L'
                  ? "bg-[#1a4731] text-white shadow"
                  : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              En Tienda ({totalTienda})
            </button>
          </div>
        </div>

        {!seleccionado ? (
          <div className="space-y-6">
            <p className="text-gray-500 dark:text-gray-400">
              {filtroTab === 'E' 
                ? "Órdenes enviadas al laboratorio óptico en espera de ser recibidas."
                : "Trabajos listos en óptica esperando el retiro por parte del cliente."}
            </p>

            {/* BUSCADOR */}
            <Input
              placeholder={filtroTab === 'E' ? "Buscar pedidos en laboratorio..." : "Buscar por cliente para entregar..."}
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="rounded-xl border-gray-200 dark:border-gray-700 py-6 text-lg shadow-sm"
            />

            {/* LISTA DE PEDIDOS FILTRADOS */}
            <div className="mt-8 space-y-4">
              {pedidosFiltrados.length > 0 ? (
                pedidosFiltrados.map((p) => (
                  <div 
                    key={p.id} 
                    className={`p-6 border rounded-2xl flex justify-between items-center bg-white dark:bg-[#1a2a20] transition-all shadow-sm border-l-8 ${
                      filtroTab === 'E' ? "border-l-amber-500 hover:border-amber-300" : "border-l-green-500 hover:border-green-300"
                    }`}
                  >
                    <div>
                      <p className="font-bold text-gray-800 dark:text-gray-200 text-xl">
                        {p.cliente_data?.nombre} {p.cliente_data?.apellido}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {getTipoLabel(p.tipo_pedido)} | <span className={filtroTab === 'E' ? "text-amber-600 font-bold" : "text-green-600 font-bold"}>
                          {filtroTab === 'E' ? "En Laboratorio" : "Listo en Óptica"}
                        </span>
                      </p>
                    </div>
                    <Button 
                      onClick={() => setSeleccionado(p)} 
                      className={`rounded-xl px-6 text-white font-bold ${
                        filtroTab === 'E' ? "bg-amber-600 hover:bg-amber-700" : "bg-green-700 hover:bg-green-800"
                      }`}
                    >
                      {filtroTab === 'E' ? "Recibir en Tienda" : "Procesar Entrega"}
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 text-gray-400 dark:text-gray-300 italic bg-gray-50 dark:bg-[#0f1a14] rounded-3xl">
                  {busqueda ? "No hay resultados que coincidan con la búsqueda." : "No hay pedidos en este estado actualmente."}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* VISTA DE CONFIRMACIÓN DETALLADA */
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="border-b dark:border-white/10 pb-6">
               <h3 className="text-2xl font-bold text-[#1a4731] dark:text-emerald-100">
                 {seleccionado.estado_pedido === "E" ? "Recibir Trabajo de Laboratorio" : "Confirmar Entrega de Pedido"} #{seleccionado.id}
               </h3>
               <p className="text-gray-500 dark:text-gray-400">Verifica los datos antes de cambiar el estado en el sistema.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                {/* BLOQUE: INFORMACIÓN DEL CLIENTE */}
                <div className="bg-gray-50 dark:bg-[#0f1a14] p-6 rounded-3xl space-y-3">
                  <h4 className="font-bold text-gray-400 dark:text-gray-300 uppercase text-xs tracking-widest">Información del Cliente</h4>
                  <p className="text-xl font-bold">{seleccionado.cliente_data?.nombre} {seleccionado.cliente_data?.apellido}</p>
                  <p><strong>Identificación:</strong> {seleccionado.cliente_data?.identificacion || 'No posee'}</p>
                  <p><strong>Tipo de Orden:</strong> {getTipoLabel(seleccionado.tipo_pedido)}</p>
                  <p><strong>Descripción:</strong> {seleccionado.descripcion}</p>
                  {seleccionado.observacion && <p><strong>Observación:</strong> {seleccionado.observacion}</p>}
                </div>

                {/* BLOQUE DINÁMICO: DETALLES DE MATERIALES (MONTURA / LENTE) */}
                {primerDetalle && (
                  <div className="border border-gray-100 dark:border-white/10 p-6 rounded-3xl space-y-4 bg-white dark:bg-[#1a2a20] shadow-inner">
                    <h4 className="font-bold text-[#1a4731] dark:text-emerald-300 uppercase text-xs tracking-widest">Especificaciones del Trabajo</h4>
                    
                    {/* Renderizado de Montura */}
                    {primerDetalle.montura_data && (seleccionado.tipo_pedido === 'C' || seleccionado.tipo_pedido === 'SM') && (
                      <div className="p-3 bg-amber-500/5 rounded-xl border border-amber-500/10">
                        <p className="text-sm font-bold text-amber-600 dark:text-amber-400 mb-1">🕶️ Detalles de Montura</p>
                        <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-300">
                          <li><strong>Marca:</strong> {primerDetalle.montura_data.marca_data?.descripcion || "N/A"}</li>
                          <li><strong>Modelo:</strong> {primerDetalle.montura_data.modelo_data?.descripcion || "N/A"}</li>
                          <li><strong>Color:</strong> {primerDetalle.montura_data.color_data?.descripcion || "N/A"}</li>
                          <li><strong>Material:</strong> {primerDetalle.montura_data.material || "No especificado"}</li>
                        </ul>
                      </div>
                    )}

                    {/* Renderizado de Lente */}
                    {primerDetalle.lente_data && (seleccionado.tipo_pedido === 'C' || seleccionado.tipo_pedido === 'SL') && (
                      <div className="p-3 bg-blue-500/5 rounded-xl border border-blue-500/10">
                        <p className="text-sm font-bold text-blue-600 dark:text-blue-400 mb-1">👁️ Detalles de Cristales / Lente</p>
                        <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-300">
                          <li><strong>Tipo de Lente:</strong> {primerDetalle.lente_data.tipo_lente_data?.descripcion || "N/A"}</li>
                          <li><strong>Tratamiento:</strong> {primerDetalle.lente_data.tipo_tratamiento_data?.descripcion || "N/A"}</li>
                          {primerDetalle.medida && <li><strong>Medida de Montaje:</strong> {primerDetalle.medida}</li>}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* COLUMNA DE ACCIONES */}
              <div className="flex flex-col justify-center space-y-4">
                <Button 
                  onClick={() => ejecutarCambioEstado(seleccionado.id, seleccionado.estado_pedido)}
                  className={`py-8 text-xl font-black rounded-2xl shadow-lg text-white ${
                    seleccionado.estado_pedido === "E" ? "bg-amber-600 hover:bg-amber-700" : "bg-green-700 hover:bg-green-800"
                  }`}
                >
                  {seleccionado.estado_pedido === "E" ? "COLOCAR EN TIENDA 🏪" : "COMPLETAR ENTREGA ✅"}
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

            <div className="p-4 border border-dashed rounded-2xl text-sm text-gray-500 dark:text-gray-400">
              <strong>Nota:</strong> Al presionar el botón de confirmación, la orden cambiará automáticamente su estado técnico y actualizará los contadores globales.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}