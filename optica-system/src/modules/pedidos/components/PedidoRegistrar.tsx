// import { useEffect, useState } from "react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { descargarFacturaPDF, obtenerCatalogos, registrarPedido } from "@/services/pedidoService";
// import { obtenerClientes } from "@/services/clienteService";

// export default function PedidoRegistrar() {
//   // Estados para los datos de la BD
//   const [catalogos, setCatalogos] = useState<any>(null);
//   const [clientes, setClientes] = useState<any[]>([]);
  
//   const [tipoPedido, setTipoPedido] = useState<"C" | "SL" | "SM">("C");
//   const [loading, setLoading] = useState(true);

//   const [data, setData] = useState({
//     cliente: "",
//     receta: "", 
//     tipo_lente: "",
//     tipo_tratamiento: "",
//     modelo: "",
//     marca: "",
//     color: "",
//     medidas: "",
//     material: "",
//     descripcion: "",
//     observacion: ""
//   });

//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   // Carga inicial de catálogos y clientes
//   useEffect(() => {
//     const cargarDatosIniciales = async () => {
//       try {
//         const [resCats, resClis] = await Promise.all([
//           obtenerCatalogos(),
//           obtenerClientes()
//         ]);
//         setCatalogos(resCats);
//         setClientes(resClis);
//       } catch (err) {
//         console.error("Error al cargar datos iniciales:", err);
//         setError("Error al conectar con el servidor");
//       } finally {
//         setLoading(false);
//       }
//     };
//     cargarDatosIniciales();
//   }, []);

//   const resetData = () => {
//     setData({
//       cliente: "", receta: "", tipo_lente: "", tipo_tratamiento: "",
//       modelo: "", marca: "", color: "", medidas: "",
//       material: "", descripcion: "", observacion: ""
//     });
//   };

//   const handleSubmit = async () => {
//     try {
//       setError("");
//       setSuccess("Registrando...");

//       const detalleEnvio: any = {};

//       if (tipoPedido === "C" || tipoPedido === "SM") {
//         detalleEnvio.montura = {
//           modelo: Number(data.modelo),
//           marca: Number(data.marca),
//           color: Number(data.color),
//           medidas: Number(data.medidas),
//           material: data.material
//         };
//       }

//       if (tipoPedido === "C" || tipoPedido === "SL") {
//         detalleEnvio.lente = {
//           tipo_lente: Number(data.tipo_lente),
//           tipo_tratamiento: Number(data.tipo_tratamiento)
//         };
//       }

//       const payload = {
//         tipo_pedido: tipoPedido,
//         cliente: data.cliente ? Number(data.cliente) : null,
//         receta_visual: data.receta ? Number(data.receta) : null,
//         descripcion: data.descripcion,
//         observacion: data.observacion,
//         detalle: detalleEnvio 
//       };

//       const respuesta = await registrarPedido(payload);

//       if(respuesta && respuesta.id){
//         descargarFacturaPDF(respuesta.id);
//       }
      
//       setSuccess("¡Pedido registrado con éxito!");
//       setTimeout(() => {
//         resetData();
//         setSuccess("");
//       }, 1500);
      
//     } catch (err: any) {
//       setSuccess("");
//       const mensajeError = typeof err === 'object' 
//         ? "Error: Verifica que todos los campos técnicos estén seleccionados." 
//         : err;
//       setError(mensajeError);
//     }
//   };

//   if (loading) return <div className="p-10 text-center font-bold text-[#1a4731]">Conectando con el inventario...</div>;

//   return (
//     <div className="p-10">
//       <div className="bg-white p-10 rounded-3xl shadow-xl max-w-5xl border border-gray-100">
//         <h2 className="text-3xl font-black text-[#1a4731] mb-8">Registrar Pedido</h2>

//         {/* selectores de tipo de pedido */}
//         <div className="flex gap-4 mb-8">
//           {(["C", "SL", "SM"] as const).map((tipo) => (
//             <Button 
//               key={tipo}
//               onClick={() => { setTipoPedido(tipo); resetData(); }} 
//               className={tipoPedido === tipo ? "bg-green-700" : "bg-gray-200 text-black hover:bg-gray-300"}
//             >
//               {tipo === "C" ? "Completo" : tipo === "SL" ? "Solo Lente" : "Solo Montura"}
//             </Button>
//           ))}
//         </div>

//         {/* Cliente y Receta */}
//         <div className="grid grid-cols-2 gap-6 mb-6">
//           <div className="flex flex-col gap-2">
//             <label className="text-sm font-semibold text-gray-600">Cliente</label>
//             <select 
//               className="p-4 border rounded-xl bg-white w-full focus:ring-2 focus:ring-green-500 outline-none"
//               value={data.cliente}
//               onChange={(e) => setData({...data, cliente: e.target.value})}
//             >
//               <option value="">Seleccione Cliente</option>
//               {clientes.map((c: any) => (
//                 <option key={c.id} value={c.id}>
//                   {c.nombre} {c.apellido || ""}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div className="flex flex-col gap-2">
//             <label className="text-sm font-semibold text-gray-600">Receta (Opcional si es SM)</label>
//             <select 
//               className="p-4 border rounded-xl bg-white w-full focus:ring-2 focus:ring-green-500 outline-none"
//               value={data.receta}
//               onChange={(e) => setData({...data, receta: e.target.value})}
//             >
//               <option value="">Seleccione ID Receta</option>
//               {/* Aquí podrías filtrar recetas si las traes del backend asociadas al cliente */}
//             </select>
//           </div>
//         </div>

//         {/* SECCIÓN LENTES */}
//         {(tipoPedido === "C" || tipoPedido === "SL") && (
//           <div className="mb-8 border p-6 rounded-2xl bg-gray-50">
//             <h3 className="font-bold text-lg text-[#1a4731] mb-4">Especificaciones de Lentes</h3>
//             <div className="grid grid-cols-2 gap-6">
//               <select 
//                 className="p-4 border rounded-xl bg-white"
//                 value={data.tipo_lente}
//                 onChange={(e) => setData({...data, tipo_lente: e.target.value})}
//               >
//                 <option value="">Seleccione Tipo de Lente</option>
//                 {catalogos?.lentes?.tipos.map((t: any) => (
//                   <option key={t.id} value={t.id}>{t.descripcion}</option>
//                 ))}
//               </select>

//               <select 
//                 className="p-4 border rounded-xl bg-white"
//                 value={data.tipo_tratamiento}
//                 onChange={(e) => setData({...data, tipo_tratamiento: e.target.value})}
//               >
//                 <option value="">Seleccione Tratamiento</option>
//                 {catalogos?.lentes?.tratamientos.map((t: any) => (
//                   <option key={t.id} value={t.id}>{t.descripcion}</option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         )}

//         {/* SECCIÓN MONTURA */}
//         {(tipoPedido === "C" || tipoPedido === "SM") && (
//           <div className="mb-8 border p-6 rounded-2xl bg-gray-50 border-green-50">
//             <h3 className="font-bold text-lg text-[#1a4731] mb-4">Detalle de Montura</h3>
//             <div className="grid grid-cols-2 gap-6">
//               <select 
//                 className="p-4 border rounded-xl bg-white"
//                 value={data.marca}
//                 onChange={(e) => setData({...data, marca: e.target.value})}
//               >
//                 <option value="">Marca</option>
//                 {catalogos?.monturas?.marcas.map((m: any) => (
//                   <option key={m.id} value={m.id}>{m.descripcion}</option>
//                 ))}
//               </select>

//               <select 
//                 className="p-4 border rounded-xl bg-white"
//                 value={data.modelo}
//                 onChange={(e) => setData({...data, modelo: e.target.value})}
//               >
//                 <option value="">Modelo</option>
//                 {catalogos?.monturas?.modelos.map((m: any) => (
//                   <option key={m.id} value={m.id}>{m.descripcion}</option>
//                 ))}
//               </select>

//               <select 
//                 className="p-4 border rounded-xl bg-white"
//                 value={data.color}
//                 onChange={(e) => setData({...data, color: e.target.value})}
//               >
//                 <option value="">Color</option>
//                 {catalogos?.monturas?.colores.map((c: any) => (
//                   <option key={c.id} value={c.id}>{c.descripcion}</option>
//                 ))}
//               </select>

//               <select 
//                 className="p-4 border rounded-xl bg-white"
//                 value={data.medidas}
//                 onChange={(e) => setData({...data, medidas: e.target.value})}
//               >
//                 <option value="">Medida (SKU)</option>
//                 {catalogos?.monturas?.medidas.map((m: any) => (
//                   <option key={m.id} value={m.id}>{m.sku_monturas} ({m.ancho}x{m.largo})</option>
//                 ))}
//               </select>

//               <Input 
//                 placeholder="Material de montura" 
//                 value={data.material} 
//                 onChange={(e) => setData({...data, material: e.target.value})}
//                 className="h-14 bg-white"
//               />
//             </div>
//           </div>
//         )}

//         <div className="grid grid-cols-2 gap-6">
//           <Input 
//             placeholder="Descripción (ej: Lente para leer)" 
//             value={data.descripcion} 
//             onChange={(e) => setData({...data, descripcion: e.target.value})}
//             className="h-14"
//           />
//           <Input 
//             placeholder="Observaciones adicionales" 
//             value={data.observacion} 
//             onChange={(e) => setData({...data, observacion: e.target.value})}
//             className="h-14"
//           />
//         </div>

//         {error && <p className="text-red-500 mt-4 font-bold">{error}</p>}
//         {success && <p className="text-green-600 mt-4 font-bold">{success}</p>}
        
//         <Button onClick={handleSubmit} className="w-full mt-8 bg-[#1a4731] hover:bg-green-800 h-14 text-lg">
//           Confirmar y Registrar Pedido
//         </Button>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, User, FileText, Glasses, Layers, 
  CheckCircle2, ShoppingCart, X, AlertCircle 
} from "lucide-react";
import { descargarFacturaPDF, obtenerCatalogos, registrarPedido, type PedidoInput } from "@/services/pedidoService";
import { obtenerClientes, type Cliente } from "@/services/clienteService";
import { obtenerHistorialCliente, type RecetaVisual } from "@/services/recetaService";

export default function PedidoRegistrar() {
  const [catalogos, setCatalogos] = useState<any>(null);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [recetasCliente, setRecetasCliente] = useState<RecetaVisual[]>([]);
  
  const [tipoPedido, setTipoPedido] = useState<'C' | 'SL' | 'SM'>("C");
  const [loading, setLoading] = useState(true);
  const [loadingRecetas, setLoadingRecetas] = useState(false); // Para evitar el falso "No hay recetas"
  const [busqueda, setBusqueda] = useState("");
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    receta: "", 
    tipo_lente: "",
    tipo_tratamiento: "",
    modelo: "",
    marca: "",
    color: "",
    medidas: "",
    material: "",
    descripcion: "",
    observacion: ""
  });

  useEffect(() => {
    Promise.all([obtenerCatalogos(), obtenerClientes()])
      .then(([cats, clis]) => {
        setCatalogos(cats);
        setClientes(clis);
        setLoading(false);
      })
      .catch(() => setError("Error al cargar datos iniciales"));
  }, []);

  // FILTRADO DE RECETAS CON MANEJO DE CARGA
  useEffect(() => {
    const cargarRecetasFiltradas = async () => {
      if (clienteSeleccionado?.id && (tipoPedido === "C" || tipoPedido === "SL")) {
        setLoadingRecetas(true); // Iniciamos carga para bloquear el "No hay recetas"
        try {
          const res = await obtenerHistorialCliente(clienteSeleccionado.id);
          
          // Filtramos por ID del cliente y que el estado sea "SP" (Sin Procesar)
          const filtradas = res.filter(r => 
            r.cliente === clienteSeleccionado.id && 
            (r as any).estado_receta === "SP"
          );
          
          setRecetasCliente(filtradas);
        } catch (err) {
          setRecetasCliente([]);
        } finally {
          setLoadingRecetas(false); // Finalizamos carga
        }
      } else {
        setRecetasCliente([]);
        setLoadingRecetas(false);
      }
    };

    cargarRecetasFiltradas();
  }, [clienteSeleccionado, tipoPedido]);

  const handleSeleccionarCliente = (c: Cliente) => {
    setClienteSeleccionado(c);
    setBusqueda(`${c.nombre} ${c.apellido}`);
    setFormData(prev => ({ ...prev, receta: "" })); 
  };

  const limpiarCliente = () => {
    setClienteSeleccionado(null);
    setBusqueda("");
    setRecetasCliente([]);
    setFormData(prev => ({ ...prev, receta: "" }));
  };

  const clientesFiltrados = busqueda.length > 0 && !clienteSeleccionado
    ? clientes.filter(c => `${c.nombre} ${c.apellido} ${c.identificacion}`.toLowerCase().includes(busqueda.toLowerCase())).slice(0, 5)
    : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload: PedidoInput = {
        tipo_pedido: tipoPedido,
        cliente: clienteSeleccionado?.id || null,
        receta_visual: formData.receta ? Number(formData.receta) : null,
        descripcion: formData.descripcion,
        observacion: formData.observacion,
        detalle: {
          montura: (tipoPedido === 'C' || tipoPedido === 'SM') ? {
            modelo: Number(formData.modelo),
            marca: Number(formData.marca),
            color: Number(formData.color),
            medidas: Number(formData.medidas),
            material: formData.material
          } : null,
          lente: (tipoPedido === 'C' || tipoPedido === 'SL') ? {
            tipo_lente: Number(formData.tipo_lente),
            tipo_tratamiento: Number(formData.tipo_tratamiento)
          } : null
        }
      };

      const res = await registrarPedido(payload);
      setSuccess("¡Pedido registrado con éxito!");
      if (res?.id) descargarFacturaPDF(res.id);
      setTimeout(() => window.location.reload(), 2000);
    } catch (err: any) {
      setError(typeof err === 'string' ? err : "Error al registrar el pedido");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !catalogos) return <div className="p-20 text-center font-black animate-pulse text-[#1a4731]">CARGANDO SISTEMA...</div>;

  return (
    <div className="p-10 max-w-7xl mx-auto">
      <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden">
        
        <div className="bg-[#1a4731] p-8 text-white flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
              <ShoppingCart className="w-10 h-10 text-green-400" /> Nuevo Pedido
            </h2>
            <p className="text-green-100/60 font-bold uppercase text-[10px] tracking-widest mt-1">Panel de despacho Opti-Samuel</p>
          </div>
          <div className="bg-white/10 px-4 py-2 rounded-full text-xs font-bold border border-white/20">
            {tipoPedido === 'C' ? 'ORDEN COMPLETA' : tipoPedido === 'SL' ? 'SOLO CRISTALES' : 'SOLO MONTURA'}
          </div>
        </div>

        <div className="p-10">
          <div className="flex bg-gray-100 p-1.5 rounded-2xl w-fit mb-10 border border-gray-200">
            {([{id: 'C', n: 'Completo'}, {id: 'SL', n: 'Lentes'}, {id: 'SM', n: 'Montura'}] as const).map((t) => (
              <button key={t.id} type="button" onClick={() => { setTipoPedido(t.id); limpiarCliente(); }}
                className={`px-8 py-3 rounded-xl font-black text-xs uppercase transition-all ${tipoPedido === t.id ? "bg-white text-[#1a4731] shadow-md" : "text-gray-400 hover:text-gray-600"}`}>
                {t.n}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
              <div className="relative">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-1 mb-2 block text-xs">Buscador de Cliente</label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input 
                    placeholder="Nombre o Identificación..." 
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    disabled={!!clienteSeleccionado}
                    className={`pl-12 h-16 rounded-2xl border-2 transition-all font-bold text-lg ${clienteSeleccionado ? 'bg-green-50 border-green-200 text-[#1a4731]' : 'border-gray-100 focus:border-[#1a4731]'}`}
                  />
                  {clienteSeleccionado && (
                    <button type="button" onClick={limpiarCliente} className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 bg-green-200 rounded-lg hover:bg-red-100 text-green-700 hover:text-red-600 transition-all">
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {!clienteSeleccionado && clientesFiltrados.length > 0 && (
                  <div className="absolute z-50 w-full mt-2 bg-white border rounded-2xl shadow-2xl overflow-hidden border-gray-100">
                    {clientesFiltrados.map(c => (
                      <div key={c.id} onClick={() => handleSeleccionarCliente(c)} className="p-4 hover:bg-green-50 cursor-pointer border-b last:border-0 flex justify-between items-center group">
                        <div>
                          <p className="font-black text-gray-800 group-hover:text-[#1a4731]">{c.nombre} {c.apellido}</p>
                          <p className="text-xs text-gray-400 font-bold">{c.identificacion}</p>
                        </div>
                        <User className="w-5 h-5 text-gray-200 group-hover:text-green-500" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {tipoPedido !== 'SM' && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-1 block text-xs">Orden Médica (Referencias)</label>
                  <select 
                    required
                    className={`w-full h-16 px-5 rounded-2xl border-2 font-black outline-none transition-all appearance-none cursor-pointer ${
                      !clienteSeleccionado || loadingRecetas ? 'bg-gray-50 border-gray-100 text-gray-300' : 'bg-blue-50 border-blue-200 text-blue-900'
                    }`}
                    disabled={!clienteSeleccionado || loadingRecetas}
                    value={formData.receta}
                    onChange={(e) => setFormData({...formData, receta: e.target.value})}
                  >
                    {!clienteSeleccionado ? (
                      <option value="">Primero busque un cliente...</option>
                    ) : loadingRecetas ? (
                      <option value="">Consultando historial médico...</option>
                    ) : recetasCliente.length === 0 ? (
                      <option value="">No existen recetas SP para este cliente</option>
                    ) : (
                      <>
                        <option value="">-- Seleccionar Receta --</option>
                        {recetasCliente.map((r) => {
                          const od = r.rv_detalle_data?.find(d => d.oculus.alias === 'OD');
                          return (
                            <option key={r.id} value={r.id} className="py-2">
                              ORDEN #{r.id} | Esf: {od?.oculus.esfera || '0.00'} Cil: {od?.oculus.cilindro || '0.00'} | {new Date(r.fecha_creacion!).toLocaleDateString()}
                            </option>
                          );
                        })}
                      </>
                    )}
                  </select>
                </div>
              )}
            </div>

            <hr className="border-gray-100" />

            <div className="grid grid-cols-1 gap-12">
              {(tipoPedido === 'C' || tipoPedido === 'SL') && (
                <div className="relative p-8 pt-12 border-2 border-blue-50 rounded-[2.5rem] bg-blue-50/10 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="absolute -top-4 left-8 bg-blue-600 text-white px-6 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] shadow-lg flex items-center gap-2">
                    <Layers className="w-3 h-3" /> CRISTALES Y TRATAMIENTOS
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-blue-900/40 uppercase ml-1">Tipo de Lente</label>
                    <select required className="w-full p-4 rounded-xl border-2 border-blue-100 font-bold bg-white focus:border-blue-400 outline-none" 
                      value={formData.tipo_lente} onChange={(e) => setFormData({...formData, tipo_lente: e.target.value})}>
                      <option value="">Seleccionar...</option>
                      {catalogos?.lentes?.tipos.map((t: any) => <option key={t.id} value={t.id}>{t.descripcion}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-blue-900/40 uppercase ml-1">Filtro / Tratamiento</label>
                    <select required className="w-full p-4 rounded-xl border-2 border-blue-100 font-bold bg-white focus:border-blue-400 outline-none" 
                      value={formData.tipo_tratamiento} onChange={(e) => setFormData({...formData, tipo_tratamiento: e.target.value})}>
                      <option value="">Seleccionar...</option>
                      {catalogos?.lentes?.tratamientos.map((t: any) => <option key={t.id} value={t.id}>{t.descripcion}</option>)}
                    </select>
                  </div>
                </div>
              )}

              {(tipoPedido === 'C' || tipoPedido === 'SM') && (
                <div className="relative p-8 pt-12 border-2 border-green-50 rounded-[2.5rem] bg-green-50/10 grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="absolute -top-4 left-8 bg-green-600 text-white px-6 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] shadow-lg flex items-center gap-2">
                    <Glasses className="w-3 h-3" /> ESPECIFICACIONES DE MONTURA
                  </div>
                  {['marca', 'modelo', 'color'].map((f) => (
                    <div key={f} className="space-y-2">
                      <label className="text-[10px] font-black text-green-900/40 uppercase ml-1">{f}</label>
                      <select required className="w-full p-4 rounded-xl border-2 border-green-100 font-bold bg-white focus:border-green-400 outline-none uppercase text-xs" 
                        value={(formData as any)[f]} onChange={(e) => setFormData({...formData, [f]: e.target.value})}>
                        <option value="">{f}</option>
                        {catalogos?.monturas?.[f === 'marca' ? 'marcas' : f === 'modelo' ? 'modelos' : 'colores'].map((i: any) => <option key={i.id} value={i.id}>{i.descripcion}</option>)}
                      </select>
                    </div>
                  ))}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-green-900/40 uppercase ml-1">Talla</label>
                    <select required className="w-full p-4 rounded-xl border-2 border-green-100 font-bold bg-white focus:border-green-400 outline-none" 
                      value={formData.medidas} onChange={(e) => setFormData({...formData, medidas: e.target.value})}>
                      <option value="">Medida</option>
                      {catalogos?.monturas?.medidas.map((m: any) => <option key={m.id} value={m.id}>{m.sku_monturas}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-green-900/40 uppercase ml-1">Material</label>
                    <Input required placeholder="Pasta, Metal..." className="h-[52px] rounded-xl border-green-100 font-bold" 
                      value={formData.material} onChange={(e) => setFormData({...formData, material: e.target.value})} />
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Descripción</label>
                <Input placeholder="Ej: Lente para lectura" value={formData.descripcion} onChange={(e) => setFormData({...formData, descripcion: e.target.value})} className="h-14 rounded-xl border-gray-100 bg-gray-50/50" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Observaciones</label>
                <Input placeholder="Ej: Urgente para el viernes" value={formData.observacion} onChange={(e) => setFormData({...formData, observacion: e.target.value})} className="h-14 rounded-xl border-gray-100 bg-gray-50/50" />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-center gap-3 rounded-r-xl animate-in fade-in zoom-in">
                <AlertCircle className="w-5 h-5" />
                <p className="font-bold text-sm">{error}</p>
              </div>
            )}

            <Button 
              disabled={loading || !clienteSeleccionado || (tipoPedido !== 'SM' && !formData.receta)}
              type="submit" 
              className="w-full py-12 text-xl font-black bg-[#1a4731] hover:bg-[#143625] rounded-[2rem] shadow-2xl transition-all uppercase tracking-widest disabled:opacity-20 active:scale-95"
            >
              {loading ? "PROCESANDO..." : "GENERAR PEDIDO Y DESCARGAR FACTURA"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}