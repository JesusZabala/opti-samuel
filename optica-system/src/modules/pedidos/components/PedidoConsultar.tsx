

// import { useState, useEffect } from "react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { FileText } from "lucide-react"; // Importamos icono para el PDF
// import { obtenerPedido, descargarFacturaPDF } from "@/services/pedidoService";

// export default function PedidoConsultar() {
//   const [pedidos, setPedidos] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [busqueda, setBusqueda] = useState("");
//   const [filtroEstado, setFiltroEstado] = useState<"TODOS" | "E" | "L" | "EN">("TODOS");
//   const [detalle, setDetalle] = useState<any>(null);

//   const cargarPedidos = async () => {
//     try {
//       setLoading(true);
//       const data = await obtenerPedido();
//       setPedidos(data);
//     } catch (error) {
//       console.error("Error al obtener pedidos:", error);
//       alert("No se pudieron cargar los pedidos. Intenta de nuevo más tarde.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     cargarPedidos();
//   }, []);

//   const getEstadoLabel = (sigla: string) => {
//     const nombres: any = { 'E': "Enviado", 'L': "Listo", 'EN': "Entregado" };
//     return nombres[sigla] || sigla;
//   };

//   const getTipoLabel = (tipo: string) => {
//     const tipos: any = { 'C': "Completo", 'SL': "Solo Lente", 'SM': "Solo Montura" };
//     return tipos[tipo] || tipo;
//   };

//   const pedidosFiltrados = pedidos.filter((p) => {
//     const nombreCliente = `${p.cliente_data?.nombre || ''} ${p.cliente_data?.apellido || ''}`.toLowerCase();
//     const cumpleBusqueda = nombreCliente.includes(busqueda.toLowerCase());
//     const cumpleEstado = filtroEstado === "TODOS" || p.estado_pedido === filtroEstado;
//     return cumpleBusqueda && cumpleEstado;
//   });

//   if (loading) {
//     return <div className="p-10 text-center font-bold text-[#1a4731] text-xl animate-pulse">Cargando pedidos de Opti-Samuel...</div>;
//   }

//   return (
//     <div className="p-10">
//       <div className="bg-white p-10 rounded-3xl shadow-xl max-w-5xl border border-gray-100 mx-auto">
//         <h2 className="text-3xl font-black text-[#1a4731] mb-8">Consultar Pedidos</h2>

//         {!detalle ? (
//           <div className="space-y-6">
            
//             {/* FILTROS DE ESTADO */}
//             <div className="flex flex-wrap gap-4 mb-8">
//               {(["TODOS", "E", "L", "EN"] as const).map((estado) => (
//                 <Button
//                   key={estado}
//                   onClick={() => setFiltroEstado(estado)}
//                   className={
//                     filtroEstado === estado 
//                       ? "bg-green-700 text-white rounded-xl" 
//                       : "bg-gray-200 text-black hover:bg-gray-300 rounded-xl"
//                   }
//                 >
//                   {estado === "TODOS" ? "Todos" : 
//                    estado === "E" ? "Enviados" : 
//                    estado === "L" ? "Listos" : "Entregados"}
//                 </Button>
//               ))}
//             </div>

//             <Input
//               placeholder="Buscar por cliente..."
//               value={busqueda}
//               onChange={(e) => setBusqueda(e.target.value)}
//               className="rounded-xl border-gray-200 py-6 text-lg focus:ring-green-700 focus:border-green-700"
//             />

//             {/* LISTADO DE PEDIDOS */}
//             <div className="mt-8 space-y-4">
//               {pedidosFiltrados.length > 0 ? (
//                 pedidosFiltrados.map((p) => (
//                   <div 
//                     key={p.id} 
//                     className="p-6 border rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center bg-white hover:border-green-300 transition-all shadow-sm gap-4"
//                   >
//                     <div className="flex-1">
//                       <p className="font-black text-gray-800 text-xl uppercase tracking-tight">
//                         {p.cliente_data ? `${p.cliente_data.nombre} ${p.cliente_data.apellido}` : "Sin Cliente"}
//                       </p>
//                       <div className="flex gap-2 mt-2">
//                         <span className="text-[10px] font-black uppercase bg-gray-100 px-3 py-1 rounded-full text-gray-600 border border-gray-200">
//                           {getTipoLabel(p.tipo_pedido)}
//                         </span>
//                         <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full border ${
//                           p.estado_pedido === 'L' ? 'bg-green-50 text-green-700 border-green-200' : 
//                           p.estado_pedido === 'E' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-purple-50 text-purple-700 border-purple-200'
//                         }`}>
//                           {getEstadoLabel(p.estado_pedido)}
//                         </span>
//                       </div>
//                     </div>

//                     {/* ACCIONES */}
//                     <div className="flex gap-2 w-full md:w-auto">
//                       <Button 
//                         onClick={() => {
//                           void descargarFacturaPDF(p.id).catch(() =>
//                             notifyError("No se pudo descargar el PDF. Verifica tu sesión.")
//                           );
//                         }} 
//                         variant="outline"
//                         className="border-2 border-red-100 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl px-4 flex gap-2 font-bold"
//                       >
//                         <FileText className="w-4 h-4" />
//                         PDF
//                       </Button>
                      
//                       <Button 
//                         onClick={() => setDetalle(p)} 
//                         className="bg-[#1a4731] hover:bg-[#143625] rounded-xl px-6 font-bold flex-1 md:flex-none"
//                       >
//                         Detalles
//                       </Button>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <div className="text-center py-20 text-gray-400 font-bold uppercase text-xs tracking-widest">
//                    No hay pedidos registrados
//                 </div>
//               )}
//             </div>
//           </div>
//         ) : (
//           /* VISTA DETALLE COMPLETO */
//           <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-300">
//             <div className="flex justify-between items-center border-b pb-6">
//                <div>
//                   <h3 className="text-3xl font-black text-[#1a4731]">Pedido #{detalle.id}</h3>
//                   <p className="text-gray-500 font-bold uppercase text-xs mt-1">Estado actual: {getEstadoLabel(detalle.estado_pedido)}</p>
//                </div>
//                <div className="flex gap-3">
//                  <Button 
//                     onClick={() => {
//                       void descargarFacturaPDF(detalle.id).catch(() =>
//                         alert("No se pudo descargar el PDF. Verifica tu sesión.")
//                       );
//                     }} 
//                     variant="outline"
//                     className="rounded-xl border-2 border-red-500 text-red-500 font-bold hover:bg-red-50"
//                   >
//                     Descargar Factura
//                   </Button>
//                   <Button variant="outline" onClick={() => setDetalle(null)} className="rounded-xl border-2 hover:bg-gray-50 font-bold">
//                     ← Volver
//                   </Button>
//                </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
//               <div className="space-y-6">
//                 <div>
//                   <h4 className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-4">Información General</h4>
//                   <div className="bg-gray-50 p-6 rounded-3xl space-y-3 border border-gray-100">
//                     <p className="text-lg"><strong>Cliente:</strong> {detalle.cliente_data?.nombre} {detalle.cliente_data?.apellido}</p>
//                     <p><strong>Tipo:</strong> {getTipoLabel(detalle.tipo_pedido)}</p>
//                     <p><strong>Emisión:</strong> {new Date(detalle.fecha_emision).toLocaleDateString()}</p>
//                     <p><strong>Entrega:</strong> {new Date(detalle.fecha_entrega).toLocaleDateString()}</p>
//                     <div className="pt-4 mt-4 border-t border-gray-200">
//                       <p className="text-sm font-bold text-gray-400 uppercase mb-1">Descripción</p>
//                       <p className="text-gray-700 font-medium">{detalle.descripcion || "Sin descripción"}</p>
//                       <p className="text-sm font-bold text-gray-400 uppercase mt-4 mb-1">Observaciones</p>
//                       <p className="text-red-600 font-bold">{detalle.observacion || "Ninguna"}</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="space-y-6">
//                 <h4 className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-4">Especificaciones Técnicas</h4>
//                 {detalle.info_detalle?.map((item: any, idx: number) => (
//                   <div key={idx} className="space-y-4">
//                     {item.montura_data && (
//                       <div className="p-6 border-2 border-green-50 rounded-3xl bg-green-50/20">
//                         <p className="text-green-800 font-black text-[10px] uppercase mb-2 tracking-widest">Montura Seleccionada</p>
//                         <p className="text-xl font-black text-green-900">{item.montura_data.marca_data.descripcion}</p>
//                         <p className="text-green-700 font-bold uppercase text-sm">{item.montura_data.modelo_data.descripcion}</p>
//                         <p className="text-xs text-green-600/70 mt-2 font-bold uppercase">
//                           Color: {item.montura_data.color_data.descripcion} | Material: {item.montura_data.material}
//                         </p>
//                       </div>
//                     )}
                    
//                     {item.lente_data && (
//                       <div className="p-6 border-2 border-blue-50 rounded-3xl bg-blue-50/20">
//                         <p className="text-blue-800 font-black text-[10px] uppercase mb-2 tracking-widest">Tratamiento de Lentes</p>
//                         <p className="text-xl font-black text-blue-900">{item.lente_data.tipo_lente_data.descripcion}</p>
//                         <p className="text-blue-700 font-bold uppercase text-sm">{item.lente_data.tipo_tratamiento_data.descripcion}</p>
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
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
import { FileText } from "lucide-react"; // Importamos icono para el PDF
import { obtenerPedido, descargarFacturaPDF } from "@/services/pedidoService";
import { PageLoader } from "@/components/ui/loading-overlay";
import { notifyError } from "@/lib/notify";

export default function PedidoConsultar() {
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<"TODOS" | "E" | "L" | "EN">("TODOS");
  const [detalle, setDetalle] = useState<any>(null);

  const cargarPedidos = async () => {
    try {
      setLoading(true);
      const data = await obtenerPedido();
      // Validamos que data sea un array antes de guardarlo
      setPedidos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al obtener pedidos:", error);
      notifyError(error, "No se pudieron cargar los pedidos. Intenta de nuevo más tarde.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPedidos();
  }, []);

  const getEstadoLabel = (sigla: string) => {
    const nombres: any = { 'E': "Enviado", 'L': "Listo", 'EN': "Entregado" };
    return nombres[sigla] || sigla;
  };

  const getTipoLabel = (tipo: string) => {
    const tipos: any = { 'C': "Completo", 'SL': "Solo Lente", 'SM': "Solo Montura" };
    return tipos[tipo] || tipo;
  };

  const pedidosFiltrados = pedidos.filter((p) => {
    const nombreCliente = `${p.cliente_data?.nombre || ''} ${p.cliente_data?.apellido || ''}`.toLowerCase();
    const cumpleBusqueda = nombreCliente.includes(busqueda.toLowerCase());
    const cumpleEstado = filtroEstado === "TODOS" || p.estado_pedido === filtroEstado;
    return cumpleBusqueda && cumpleEstado;
  });

  if (loading) {
    return <PageLoader message="Cargando pedidos..." />;
  }

  return (
    <div className="p-4 md:p-10 dark:bg-[#0a0f0a]">
      <div className="bg-white dark:bg-[#1a2a20] p-4 md:p-10 rounded-3xl shadow-xl max-w-5xl border border-gray-100 dark:border-white/10 mx-auto">
        <h2 className="text-xl md:text-3xl font-black text-[#1a4731] dark:text-emerald-100 mb-8">Consultar Pedidos</h2>

        {!detalle ? (
          <div className="space-y-6">
            
            {/* FILTROS DE ESTADO */}
            <div className="flex flex-wrap gap-4 mb-8">
              {(["TODOS", "E", "L", "EN"] as const).map((estado) => (
                <Button
                  key={estado}
                  onClick={() => setFiltroEstado(estado)}
                  className={
                    filtroEstado === estado 
                      ? "bg-green-700 text-white rounded-xl" 
                      : "bg-gray-200 dark:bg-[#0f1a14] text-black dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-[#1a2a20] rounded-xl"
                  }
                >
                  {estado === "TODOS" ? "Todos" : 
                   estado === "E" ? "Enviados" : 
                   estado === "L" ? "Listos" : "Entregados"}
                </Button>
              ))}
            </div>

            <Input
              placeholder="Buscar por cliente..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="rounded-xl border-gray-200 dark:border-gray-700 py-6 text-lg focus:ring-green-700 focus:border-green-700"
            />

            {/* LISTADO DE PEDIDOS */}
            <div className="mt-8 space-y-4">
              {pedidosFiltrados.length > 0 ? (
                pedidosFiltrados.map((p) => (
                  <div 
                    key={p.id} 
                    className="p-6 border rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center bg-white dark:bg-[#1a2a20] hover:border-green-300 transition-all shadow-sm gap-4"
                  >
                    <div className="flex-1">
                      <p className="font-black text-gray-800 dark:text-gray-200 text-xl uppercase tracking-tight">
                        {p.cliente_data ? `${p.cliente_data.nombre} ${p.cliente_data.apellido} C.I:${p.cliente_data.identificacion}` : "Sin Cliente"}
                      </p>
                      <p className="font-black text-gray-800 dark:text-gray-200 text-xl uppercase tracking-tight ">
                        {`Fecha: ${p.fecha_emision ? new Date(p.fecha_emision).toLocaleDateString() : "N/A"}`}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <span className="text-[10px] font-black uppercase bg-gray-100 dark:bg-[#0f1a14] px-3 py-1 rounded-full text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                          {getTipoLabel(p.tipo_pedido)}
                        </span>
                        <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full border ${
                          p.estado_pedido === 'L' ? 'bg-green-50 dark:bg-emerald-900/20 text-green-700 dark:text-emerald-300 border-green-200 dark:border-emerald-800/30' : 
                          p.estado_pedido === 'E' ? 'bg-blue-50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/30' : 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/30'
                        }`}>
                          {getEstadoLabel(p.estado_pedido)}
                        </span>
                      </div>
                    </div>

                    {/* ACCIONES */}
                    <div className="flex gap-2 w-full md:w-auto">
                      <Button 
                        onClick={() => {
                          void descargarFacturaPDF(p.id).catch(() =>
                            notifyError("No se pudo descargar el PDF. Verifica tu sesión.")
                          );
                        }} 
                        variant="outline"
                        className="border-2 border-red-100 dark:border-red-800/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-700 rounded-xl px-4 flex gap-2 font-bold"
                      >
                        <FileText className="w-4 h-4" />
                        PDF
                      </Button>
                      
                      <Button 
                        onClick={() => setDetalle(p)} 
                        className="bg-[#1a4731] hover:bg-[#143625] rounded-xl px-6 font-bold flex-1 md:flex-none"
                      >
                        Detalles
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 text-gray-400 dark:text-gray-300 font-bold uppercase text-xs tracking-widest">
                   No hay pedidos registrados
                </div>
              )}
            </div>
          </div>
        ) : (
          /* VISTA DETALLE COMPLETO */
          <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-300">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 border-b dark:border-white/10 pb-6">
               <div>
                  <h3 className="text-xl md:text-3xl font-black text-[#1a4731] dark:text-emerald-100">Pedido #{detalle.id}</h3>
                  <p className="text-gray-500 dark:text-gray-400 font-bold uppercase text-xs mt-1">Estado actual: {getEstadoLabel(detalle.estado_pedido)}</p>
               </div>
               <div className="flex gap-3">
                 <Button 
                    onClick={() => {
                      void descargarFacturaPDF(detalle.id).catch(() =>
                        alert("No se pudo descargar el PDF. Verifica tu sesión.")
                      );
                    }} 
                    variant="outline"
                    className="rounded-xl border-2 border-red-500 text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-900/10"
                  >
                    Descargar Factura
                  </Button>
                  <Button variant="outline" onClick={() => setDetalle(null)} className="rounded-xl border-2 hover:bg-gray-50 dark:hover:bg-[#0f1a14] font-bold">
                    ← Volver
                  </Button>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div>
                  <h4 className="text-gray-400 dark:text-gray-300 text-[10px] font-black uppercase tracking-widest mb-4">Información General</h4>
                  <div className="bg-gray-50 dark:bg-[#0f1a14] p-6 rounded-3xl space-y-3 border border-gray-100 dark:border-white/10">
                    <p className="text-lg"><strong>Cliente:</strong> {detalle.cliente_data?.nombre} {detalle.cliente_data?.apellido}</p>
                    <p><strong>Tipo:</strong> {getTipoLabel(detalle.tipo_pedido)}</p>
                    {/* Fechas validadas de forma segura */}
                    <p><strong>Emisión:</strong> {detalle.fecha_emision ? new Date(detalle.fecha_emision).toLocaleDateString() : "N/A"}</p>
                    <p><strong>Entrega:</strong> {detalle.fecha_entrega ? new Date(detalle.fecha_entrega).toLocaleDateString() : "N/A"}</p>
                    <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-bold text-gray-400 dark:text-gray-300 uppercase mb-1">Descripción</p>
                      <p className="text-gray-700 dark:text-gray-300 font-medium">{detalle.descripcion || "Sin descripción"}</p>
                      <p className="text-sm font-bold text-gray-400 dark:text-gray-300 uppercase mt-4 mb-1">Observaciones</p>
                      <p className="text-red-600 dark:text-red-400 font-bold">{detalle.observacion || "Ninguna"}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="text-gray-400 dark:text-gray-300 text-[10px] font-black uppercase tracking-widest mb-4">Especificaciones Técnicas</h4>
                {/* Cortocircuito seguro para mapear info_detalle */}
                {(detalle.info_detalle || []).map((item: any, idx: number) => (
                  <div key={idx} className="space-y-4">
                    
                    {/* MONTURA DETALLE CON ENCADENAMIENTO OPCIONAL (?.) */}
                    {item.montura_data && (
                      <div className="p-6 border-2 border-green-50 dark:border-emerald-800/30 rounded-3xl bg-green-50/20 dark:bg-emerald-900/10">
                        <p className="text-green-800 dark:text-emerald-300 font-black text-[10px] uppercase mb-2 tracking-widest">Montura Seleccionada</p>
                        <p className="text-xl font-black text-green-900 dark:text-emerald-200">{item.montura_data.marca_data?.descripcion || "Sin Marca"}</p>
                        <p className="text-green-700 dark:text-emerald-300 font-bold uppercase text-sm">{item.montura_data.modelo_data?.descripcion || "Sin Modelo"}</p>
                        <p className="text-xs text-green-600/70 dark:text-emerald-400/70 mt-2 font-bold uppercase">
                          Color: {item.montura_data.color_data?.descripcion || "N/A"} | Material: {item.montura_data.material || "N/A"}
                        </p>
                      </div>
                    )}
                    
                    {/* LENTE DETALLE CON ENCADENAMIENTO OPCIONAL (?.) */}
                    {item.lente_data && (
                      <div className="p-6 border-2 border-blue-50 dark:border-blue-800/30 rounded-3xl bg-blue-50/20 dark:bg-blue-900/10">
                        <p className="text-blue-800 dark:text-blue-300 font-black text-[10px] uppercase mb-2 tracking-widest">Tratamiento de Lentes</p>
                        <p className="text-xl font-black text-blue-900 dark:text-blue-200">{item.lente_data.tipo_lente_data?.descripcion || "Sin Tipo"}</p>
                        <p className="text-blue-700 dark:text-blue-300 font-bold uppercase text-sm">{item.lente_data.tipo_treatment_data?.descripcion || item.lente_data.tipo_tratamiento_data?.descripcion || "Sin Filtro"}</p>
                      </div>
                    )}
                    
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}