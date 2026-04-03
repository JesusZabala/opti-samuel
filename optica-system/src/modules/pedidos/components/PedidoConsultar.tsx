// import { useState } from "react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";

// export default function PedidoConsultar() {

//   /* -------- DATOS SIMULADOS -------- */

//   const [pedidos] = useState([
//     {
//       id: 1,
//       tipo: "C",
//       estado: "E",
//       cliente: "Juan Pérez",
//       receta: "Receta #1",
//       descripcion: "Lentes completos",
//       observacion: "Urgente",
//       fecha_emision: "2026-03-17",
//       fecha_entregado: null,
//       lente: {
//         tipo: "Monofocal",
//         tratamiento: "Antirreflejo"
//       },
//       montura: {
//         modelo: "Clásico",
//         marca: "RayBan",
//         color: "Negro",
//         material: "Metal"
//       }
//     },
//     {
//       id: 2,
//       tipo: "SL",
//       estado: "L",
//       cliente: null,
//       receta: "Receta #2",
//       descripcion: "Solo lentes",
//       observacion: "Normal",
//       fecha_emision: "2026-03-16",
//       fecha_entregado: null,
//       lente: {
//         tipo: "Bifocal",
//         tratamiento: "Fotocromático"
//       },
//       montura: null
//     }
//   ]);

//   const [busqueda, setBusqueda] = useState("");
//   const [detalle, setDetalle] = useState<any>(null);

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

//   const pedidosFiltrados = pedidos.filter((p) =>
//     (p.cliente || "")
//       .toLowerCase()
//       .includes(busqueda.toLowerCase())
//   );

//   /* -------- UI -------- */

//   return (
//     <div className="p-10">

//       <div className="bg-white p-10 rounded-3xl shadow-xl">

//         <h2 className="text-3xl font-black text-[#1a4731] mb-6">
//           Consultar Pedidos
//         </h2>

//         {/* BUSCAR */}
//         {!detalle && (
//           <Input
//             placeholder="Buscar por cliente..."
//             value={busqueda}
//             onChange={(e) => setBusqueda(e.target.value)}
//           />
//         )}

//         {/* LISTA */}
//         {!detalle && (
//           <div className="mt-8 space-y-4">

//             {pedidosFiltrados.map((p) => (
//               <div
//                 key={p.id}
//                 className="p-5 border rounded-xl flex justify-between items-center"
//               >
//                 <div>
//                   <p className="font-bold">
//                     {p.cliente || "Sin cliente"}
//                   </p>

//                   <p className="text-sm text-gray-500">
//                     {getTipo(p.tipo)} | {getEstado(p.estado)}
//                   </p>
//                 </div>

//                 <Button
//                   onClick={() => setDetalle(p)}
//                   className="bg-green-600"
//                 >
//                   Ver Detalles
//                 </Button>
//               </div>
//             ))}

//           </div>
//         )}

//         {/* DETALLE */}
//         {detalle && (

//           <div className="mt-8 border p-6 rounded-xl space-y-6">

//             <h3 className="text-xl font-bold text-[#1a4731]">
//               Detalle del Pedido
//             </h3>

//             <p><strong>Tipo:</strong> {getTipo(detalle.tipo)}</p>
//             <p><strong>Estado:</strong> {getEstado(detalle.estado)}</p>
//             <p><strong>Cliente:</strong> {detalle.cliente || "N/A"}</p>
//             <p><strong>Receta:</strong> {detalle.receta || "N/A"}</p>

//             <p><strong>Descripción:</strong> {detalle.descripcion}</p>
//             <p><strong>Observación:</strong> {detalle.observacion}</p>

//             <p><strong>Fecha Emisión:</strong> {detalle.fecha_emision}</p>
//             <p><strong>Fecha Entregado:</strong> {detalle.fecha_entregado || "Pendiente"}</p>

//             {/* LENTES */}
//             {detalle.lente && (
//               <div className="border p-4 rounded-lg bg-gray-50">
//                 <h4 className="font-bold mb-2">Lentes</h4>
//                 <p>Tipo: {detalle.lente.tipo}</p>
//                 <p>Tratamiento: {detalle.lente.tratamiento}</p>
//               </div>
//             )}

//             {/* MONTURA */}
//             {detalle.montura && (
//               <div className="border p-4 rounded-lg bg-gray-50">
//                 <h4 className="font-bold mb-2">Montura</h4>
//                 <p>Modelo: {detalle.montura.modelo}</p>
//                 <p>Marca: {detalle.montura.marca}</p>
//                 <p>Color: {detalle.montura.color}</p>
//                 <p>Material: {detalle.montura.material}</p>
//               </div>
//             )}

//             {/* BOTÓN VOLVER */}
//             <Button
//               variant="outline"
//               onClick={() => setDetalle(null)}
//             >
//               Volver
//             </Button>

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
      setPedidos(data);
    } catch (error) {
      console.error("Error al obtener pedidos:", error);
      alert("No se pudieron cargar los pedidos. Intenta de nuevo más tarde.");
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
    return <div className="p-10 text-center font-bold text-[#1a4731] text-xl animate-pulse">Cargando pedidos de Opti-Samuel...</div>;
  }

  return (
    <div className="p-10">
      <div className="bg-white p-10 rounded-3xl shadow-xl max-w-5xl border border-gray-100 mx-auto">
        <h2 className="text-3xl font-black text-[#1a4731] mb-8">Consultar Pedidos</h2>

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
                      : "bg-gray-200 text-black hover:bg-gray-300 rounded-xl"
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
              className="rounded-xl border-gray-200 py-6 text-lg focus:ring-green-700 focus:border-green-700"
            />

            {/* LISTADO DE PEDIDOS */}
            <div className="mt-8 space-y-4">
              {pedidosFiltrados.length > 0 ? (
                pedidosFiltrados.map((p) => (
                  <div 
                    key={p.id} 
                    className="p-6 border rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center bg-white hover:border-green-300 transition-all shadow-sm gap-4"
                  >
                    <div className="flex-1">
                      <p className="font-black text-gray-800 text-xl uppercase tracking-tight">
                        {p.cliente_data ? `${p.cliente_data.nombre} ${p.cliente_data.apellido}` : "Sin Cliente"}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <span className="text-[10px] font-black uppercase bg-gray-100 px-3 py-1 rounded-full text-gray-600 border border-gray-200">
                          {getTipoLabel(p.tipo_pedido)}
                        </span>
                        <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full border ${
                          p.estado_pedido === 'L' ? 'bg-green-50 text-green-700 border-green-200' : 
                          p.estado_pedido === 'E' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-purple-50 text-purple-700 border-purple-200'
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
                            alert("No se pudo descargar el PDF. Verifica tu sesión.")
                          );
                        }} 
                        variant="outline"
                        className="border-2 border-red-100 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl px-4 flex gap-2 font-bold"
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
                <div className="text-center py-20 text-gray-400 font-bold uppercase text-xs tracking-widest">
                   No hay pedidos registrados
                </div>
              )}
            </div>
          </div>
        ) : (
          /* VISTA DETALLE COMPLETO */
          <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-300">
            <div className="flex justify-between items-center border-b pb-6">
               <div>
                  <h3 className="text-3xl font-black text-[#1a4731]">Pedido #{detalle.id}</h3>
                  <p className="text-gray-500 font-bold uppercase text-xs mt-1">Estado actual: {getEstadoLabel(detalle.estado_pedido)}</p>
               </div>
               <div className="flex gap-3">
                 <Button 
                    onClick={() => {
                      void descargarFacturaPDF(detalle.id).catch(() =>
                        alert("No se pudo descargar el PDF. Verifica tu sesión.")
                      );
                    }} 
                    variant="outline"
                    className="rounded-xl border-2 border-red-500 text-red-500 font-bold hover:bg-red-50"
                  >
                    Descargar Factura
                  </Button>
                  <Button variant="outline" onClick={() => setDetalle(null)} className="rounded-xl border-2 hover:bg-gray-50 font-bold">
                    ← Volver
                  </Button>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div>
                  <h4 className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-4">Información General</h4>
                  <div className="bg-gray-50 p-6 rounded-3xl space-y-3 border border-gray-100">
                    <p className="text-lg"><strong>Cliente:</strong> {detalle.cliente_data?.nombre} {detalle.cliente_data?.apellido}</p>
                    <p><strong>Tipo:</strong> {getTipoLabel(detalle.tipo_pedido)}</p>
                    <p><strong>Emisión:</strong> {new Date(detalle.fecha_emision).toLocaleDateString()}</p>
                    <p><strong>Entrega:</strong> {new Date(detalle.fecha_entrega).toLocaleDateString()}</p>
                    <div className="pt-4 mt-4 border-t border-gray-200">
                      <p className="text-sm font-bold text-gray-400 uppercase mb-1">Descripción</p>
                      <p className="text-gray-700 font-medium">{detalle.descripcion || "Sin descripción"}</p>
                      <p className="text-sm font-bold text-gray-400 uppercase mt-4 mb-1">Observaciones</p>
                      <p className="text-red-600 font-bold">{detalle.observacion || "Ninguna"}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-4">Especificaciones Técnicas</h4>
                {detalle.info_detalle?.map((item: any, idx: number) => (
                  <div key={idx} className="space-y-4">
                    {item.montura_data && (
                      <div className="p-6 border-2 border-green-50 rounded-3xl bg-green-50/20">
                        <p className="text-green-800 font-black text-[10px] uppercase mb-2 tracking-widest">Montura Seleccionada</p>
                        <p className="text-xl font-black text-green-900">{item.montura_data.marca_data.descripcion}</p>
                        <p className="text-green-700 font-bold uppercase text-sm">{item.montura_data.modelo_data.descripcion}</p>
                        <p className="text-xs text-green-600/70 mt-2 font-bold uppercase">
                          Color: {item.montura_data.color_data.descripcion} | Material: {item.montura_data.material}
                        </p>
                      </div>
                    )}
                    
                    {item.lente_data && (
                      <div className="p-6 border-2 border-blue-50 rounded-3xl bg-blue-50/20">
                        <p className="text-blue-800 font-black text-[10px] uppercase mb-2 tracking-widest">Tratamiento de Lentes</p>
                        <p className="text-xl font-black text-blue-900">{item.lente_data.tipo_lente_data.descripcion}</p>
                        <p className="text-blue-700 font-bold uppercase text-sm">{item.lente_data.tipo_tratamiento_data.descripcion}</p>
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