// import { useEffect, useState } from "react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { 
//   Search, User, Glasses, Layers, 
//   ShoppingCart, X, AlertCircle 
// } from "lucide-react";
// import { descargarFacturaPDF, obtenerCatalogos, registrarPedido, type PedidoInput } from "@/services/pedidoService";
// import { obtenerClientes, type Cliente } from "@/services/clienteService";
// import { obtenerHistorialCliente, type RecetaVisual } from "@/services/recetaService";

// export default function PedidoRegistrar() {
//   const [catalogos, setCatalogos] = useState<any>(null);
//   const [clientes, setClientes] = useState<Cliente[]>([]);
//   const [recetasCliente, setRecetasCliente] = useState<RecetaVisual[]>([]);
  
//   const [tipoPedido, setTipoPedido] = useState<'C' | 'SL' | 'SM'>("C");
//   const [loading, setLoading] = useState(true);
//   const [loadingRecetas, setLoadingRecetas] = useState(false); // Para evitar el falso "No hay recetas"
//   const [busqueda, setBusqueda] = useState("");
//   const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null);
//   const [error, setError] = useState("");
//   const [, setSuccess] = useState("");

//   const [formData, setFormData] = useState({
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

//   useEffect(() => {
//     Promise.all([obtenerCatalogos(), obtenerClientes()])
//       .then(([cats, clis]) => {
//         setCatalogos(cats);
//         setClientes(clis);
//         setLoading(false);
//       })
//       .catch(() => setError("Error al cargar datos iniciales"));
//   }, []);

//   // FILTRADO DE RECETAS CON MANEJO DE CARGA
//   useEffect(() => {
//     const cargarRecetasFiltradas = async () => {
//       if (clienteSeleccionado?.id && (tipoPedido === "C" || tipoPedido === "SL")) {
//         setLoadingRecetas(true); // Iniciamos carga para bloquear el "No hay recetas"
//         try {
//           const res = await obtenerHistorialCliente(clienteSeleccionado.id);
          
//           // Filtramos por ID del cliente y que el estado sea "SP" (Sin Procesar)
//           const filtradas = res.filter(r => 
//             r.cliente === clienteSeleccionado.id && 
//             (r as any).estado_receta === "SP"
//           );
          
//           setRecetasCliente(filtradas);
//         } catch (err) {
//           setRecetasCliente([]);
//         } finally {
//           setLoadingRecetas(false); // Finalizamos carga
//         }
//       } else {
//         setRecetasCliente([]);
//         setLoadingRecetas(false);
//       }
//     };

//     cargarRecetasFiltradas();
//   }, [clienteSeleccionado, tipoPedido]);

//   const handleSeleccionarCliente = (c: Cliente) => {
//     setClienteSeleccionado(c);
//     setBusqueda(`${c.nombre} ${c.apellido}`);
//     setFormData(prev => ({ ...prev, receta: "" })); 
//   };

//   const limpiarCliente = () => {
//     setClienteSeleccionado(null);
//     setBusqueda("");
//     setRecetasCliente([]);
//     setFormData(prev => ({ ...prev, receta: "" }));
//   };

//   const clientesFiltrados = busqueda.length > 0 && !clienteSeleccionado
//     ? clientes.filter(c => `${c.nombre} ${c.apellido} ${c.identificacion}`.toLowerCase().includes(busqueda.toLowerCase())).slice(0, 5)
//     : [];

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       const payload: PedidoInput = {
//         tipo_pedido: tipoPedido,
//         cliente: clienteSeleccionado?.id || null,
//         receta_visual: formData.receta ? Number(formData.receta) : null,
//         descripcion: formData.descripcion,
//         observacion: formData.observacion,
//         detalle: {
//           montura: (tipoPedido === 'C' || tipoPedido === 'SM') ? {
//             modelo: Number(formData.modelo),
//             marca: Number(formData.marca),
//             color: Number(formData.color),
//             medidas: Number(formData.medidas),
//             material: formData.material
//           } : null,
//           lente: (tipoPedido === 'C' || tipoPedido === 'SL') ? {
//             tipo_lente: Number(formData.tipo_lente),
//             tipo_tratamiento: Number(formData.tipo_tratamiento)
//           } : null
//         }
//       };

//       const res = await registrarPedido(payload);
//       setSuccess("¡Pedido registrado con éxito!");
//       if (res?.id) await descargarFacturaPDF(res.id);
//       limpiarCliente();
//       setFormData({
//         receta: "",
//         tipo_lente: "",
//         tipo_tratamiento: "",
//         modelo: "",
//         marca: "",
//         color: "",
//         medidas: "",
//         material: "",
//         descripcion: "",
//         observacion: "",
//       });
//       setTipoPedido("C");
//     } catch (err: any) {
//       setError(typeof err === 'string' ? err : "Error al registrar el pedido");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading && !catalogos) return <div className="p-20 text-center font-black animate-pulse text-[#1a4731]">CARGANDO SISTEMA...</div>;

//   return (
//     <div className="p-10 max-w-7xl mx-auto">
//       <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden">
        
//         <div className="bg-[#1a4731] p-8 text-white flex justify-between items-center">
//           <div>
//             <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
//               <ShoppingCart className="w-10 h-10 text-green-400" /> Nuevo Pedido
//             </h2>
//             <p className="text-green-100/60 font-bold uppercase text-[10px] tracking-widest mt-1">Panel de despacho Opti-Samuel</p>
//           </div>
//           <div className="bg-white/10 px-4 py-2 rounded-full text-xs font-bold border border-white/20">
//             {tipoPedido === 'C' ? 'ORDEN COMPLETA' : tipoPedido === 'SL' ? 'SOLO CRISTALES' : 'SOLO MONTURA'}
//           </div>
//         </div>

//         <div className="p-10">
//           <div className="flex bg-gray-100 p-1.5 rounded-2xl w-fit mb-10 border border-gray-200">
//             {([{id: 'C', n: 'Completo'}, {id: 'SL', n: 'Lentes'}, {id: 'SM', n: 'Montura'}] as const).map((t) => (
//               <button key={t.id} type="button" onClick={() => { setTipoPedido(t.id); limpiarCliente(); }}
//                 className={`px-8 py-3 rounded-xl font-black text-xs uppercase transition-all ${tipoPedido === t.id ? "bg-white text-[#1a4731] shadow-md" : "text-gray-400 hover:text-gray-600"}`}>
//                 {t.n}
//               </button>
//             ))}
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-10">
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
//               <div className="relative">
//                 <label className="text-[10px] font-black text-gray-400 uppercase ml-1 mb-2 block text-xs">Buscador de Cliente</label>
//                 <div className="relative">
//                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
//                   <Input 
//                     placeholder="Nombre o Identificación..." 
//                     value={busqueda}
//                     onChange={(e) => setBusqueda(e.target.value)}
//                     disabled={!!clienteSeleccionado}
//                     className={`pl-12 h-16 rounded-2xl border-2 transition-all font-bold text-lg ${clienteSeleccionado ? 'bg-green-50 border-green-200 text-[#1a4731]' : 'border-gray-100 focus:border-[#1a4731]'}`}
//                   />
//                   {clienteSeleccionado && (
//                     <button type="button" onClick={limpiarCliente} className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 bg-green-200 rounded-lg hover:bg-red-100 text-green-700 hover:text-red-600 transition-all">
//                       <X className="w-5 h-5" />
//                     </button>
//                   )}
//                 </div>

//                 {!clienteSeleccionado && clientesFiltrados.length > 0 && (
//                   <div className="absolute z-50 w-full mt-2 bg-white border rounded-2xl shadow-2xl overflow-hidden border-gray-100">
//                     {clientesFiltrados.map(c => (
//                       <div key={c.id} onClick={() => handleSeleccionarCliente(c)} className="p-4 hover:bg-green-50 cursor-pointer border-b last:border-0 flex justify-between items-center group">
//                         <div>
//                           <p className="font-black text-gray-800 group-hover:text-[#1a4731]">{c.nombre} {c.apellido}</p>
//                           <p className="text-xs text-gray-400 font-bold">{c.identificacion}</p>
//                         </div>
//                         <User className="w-5 h-5 text-gray-200 group-hover:text-green-500" />
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {tipoPedido !== 'SM' && (
//                 <div className="space-y-2">
//                   <label className="text-[10px] font-black text-gray-400 uppercase ml-1 block text-xs">Orden Médica (Referencias)</label>
//                   <select 
//                     required
//                     className={`w-full h-16 px-5 rounded-2xl border-2 font-black outline-none transition-all appearance-none cursor-pointer ${
//                       !clienteSeleccionado || loadingRecetas ? 'bg-gray-50 border-gray-100 text-gray-300' : 'bg-blue-50 border-blue-200 text-blue-900'
//                     }`}
//                     disabled={!clienteSeleccionado || loadingRecetas}
//                     value={formData.receta}
//                     onChange={(e) => setFormData({...formData, receta: e.target.value})}
//                   >
//                     {!clienteSeleccionado ? (
//                       <option value="">Primero busque un cliente...</option>
//                     ) : loadingRecetas ? (
//                       <option value="">Consultando historial médico...</option>
//                     ) : recetasCliente.length === 0 ? (
//                       <option value="">No existen recetas SP para este cliente</option>
//                     ) : (
//                       <>
//                         <option value="">-- Seleccionar Receta --</option>
//                         {recetasCliente.map((r) => {
//                           const od = r.rv_detalle_data?.find(d => d.oculus.alias === 'OD');
//                           return (
//                             <option key={r.id} value={r.id} className="py-2">
//                               ORDEN #{r.id} | Esf: {od?.oculus.esfera || '0.00'} Cil: {od?.oculus.cilindro || '0.00'} | {new Date(r.fecha_creacion!).toLocaleDateString()}
//                             </option>
//                           );
//                         })}
//                       </>
//                     )}
//                   </select>
//                 </div>
//               )}
//             </div>

//             <hr className="border-gray-100" />

//             <div className="grid grid-cols-1 gap-12">
//               {(tipoPedido === 'C' || tipoPedido === 'SL') && (
//                 <div className="relative p-8 pt-12 border-2 border-blue-50 rounded-[2.5rem] bg-blue-50/10 grid grid-cols-1 md:grid-cols-2 gap-8">
//                   <div className="absolute -top-4 left-8 bg-blue-600 text-white px-6 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] shadow-lg flex items-center gap-2">
//                     <Layers className="w-3 h-3" /> CRISTALES Y TRATAMIENTOS
//                   </div>
//                   <div className="space-y-2">
//                     <label className="text-[10px] font-black text-blue-900/40 uppercase ml-1">Tipo de Lente</label>
//                     <select required className="w-full p-4 rounded-xl border-2 border-blue-100 font-bold bg-white focus:border-blue-400 outline-none" 
//                       value={formData.tipo_lente} onChange={(e) => setFormData({...formData, tipo_lente: e.target.value})}>
//                       <option value="">Seleccionar...</option>
//                       {catalogos?.lentes?.tipos.map((t: any) => <option key={t.id} value={t.id}>{t.descripcion}</option>)}
//                     </select>
//                   </div>
//                   <div className="space-y-2">
//                     <label className="text-[10px] font-black text-blue-900/40 uppercase ml-1">Filtro / Tratamiento</label>
//                     <select required className="w-full p-4 rounded-xl border-2 border-blue-100 font-bold bg-white focus:border-blue-400 outline-none" 
//                       value={formData.tipo_tratamiento} onChange={(e) => setFormData({...formData, tipo_tratamiento: e.target.value})}>
//                       <option value="">Seleccionar...</option>
//                       {catalogos?.lentes?.tratamientos.map((t: any) => <option key={t.id} value={t.id}>{t.descripcion}</option>)}
//                     </select>
//                   </div>
//                 </div>
//               )}

//               {(tipoPedido === 'C' || tipoPedido === 'SM') && (
//                 <div className="relative p-8 pt-12 border-2 border-green-50 rounded-[2.5rem] bg-green-50/10 grid grid-cols-2 md:grid-cols-5 gap-4">
//                   <div className="absolute -top-4 left-8 bg-green-600 text-white px-6 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] shadow-lg flex items-center gap-2">
//                     <Glasses className="w-3 h-3" /> ESPECIFICACIONES DE MONTURA
//                   </div>
//                   {['marca', 'modelo', 'color'].map((f) => (
//                     <div key={f} className="space-y-2">
//                       <label className="text-[10px] font-black text-green-900/40 uppercase ml-1">{f}</label>
//                       <select required className="w-full p-4 rounded-xl border-2 border-green-100 font-bold bg-white focus:border-green-400 outline-none uppercase text-xs" 
//                         value={(formData as any)[f]} onChange={(e) => setFormData({...formData, [f]: e.target.value})}>
//                         <option value="">{f}</option>
//                         {catalogos?.monturas?.[f === 'marca' ? 'marcas' : f === 'modelo' ? 'modelos' : 'colores'].map((i: any) => <option key={i.id} value={i.id}>{i.descripcion}</option>)}
//                       </select>
//                     </div>
//                   ))}
//                   <div className="space-y-2">
//                     <label className="text-[10px] font-black text-green-900/40 uppercase ml-1">Talla</label>
//                     <select required className="w-full p-4 rounded-xl border-2 border-green-100 font-bold bg-white focus:border-green-400 outline-none" 
//                       value={formData.medidas} onChange={(e) => setFormData({...formData, medidas: e.target.value})}>
//                       <option value="">Medida</option>
//                       {catalogos?.monturas?.medidas.map((m: any) => <option key={m.id} value={m.id}>{m.sku_monturas}</option>)}
//                     </select>
//                   </div>
//                   <div className="space-y-2">
//                     <label className="text-[10px] font-black text-green-900/40 uppercase ml-1">Material</label>
//                     <Input required placeholder="Pasta, Metal..." className="h-[52px] rounded-xl border-green-100 font-bold" 
//                       value={formData.material} onChange={(e) => setFormData({...formData, material: e.target.value})} />
//                   </div>
//                 </div>
//               )}
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="space-y-2">
//                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Descripción</label>
//                 <Input placeholder="Ej: Lente para lectura" value={formData.descripcion} onChange={(e) => setFormData({...formData, descripcion: e.target.value})} className="h-14 rounded-xl border-gray-100 bg-gray-50/50" />
//               </div>
//               <div className="space-y-2">
//                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Observaciones</label>
//                 <Input placeholder="Ej: Urgente para el viernes" value={formData.observacion} onChange={(e) => setFormData({...formData, observacion: e.target.value})} className="h-14 rounded-xl border-gray-100 bg-gray-50/50" />
//               </div>
//             </div>

//             {error && (
//               <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-center gap-3 rounded-r-xl animate-in fade-in zoom-in">
//                 <AlertCircle className="w-5 h-5" />
//                 <p className="font-bold text-sm">{error}</p>
//               </div>
//             )}

//             <Button 
//               disabled={loading || !clienteSeleccionado || (tipoPedido !== 'SM' && !formData.receta)}
//               type="submit" 
//               className="w-full py-12 text-xl font-black bg-[#1a4731] hover:bg-[#143625] rounded-[2rem] shadow-2xl transition-all uppercase tracking-widest disabled:opacity-20 active:scale-95"
//             >
//               {loading ? "PROCESANDO..." : "GENERAR PEDIDO Y DESCARGAR FACTURA"}
//             </Button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, User, Glasses, Layers, 
  ShoppingCart, X, AlertCircle 
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
  const [loadingRecetas, setLoadingRecetas] = useState(false); 
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
    medida: "",
    material: "",
    descripcion: "",
    observacion: ""
  });

  const [adicionSeleccionada, setAdicionSeleccionada] = useState<number>(0);

  useEffect(() => {
    Promise.all([obtenerCatalogos(), obtenerClientes()])
      .then(([cats, clis]) => {
        setCatalogos(cats);
        setClientes(clis);
        setLoading(false);
      })
      .catch(() => {
        setError("Error al cargar los catálogos iniciales de la base de datos.");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const cargarRecetasFiltradas = async () => {
      if (clienteSeleccionado?.id && (tipoPedido === "C" || tipoPedido === "SL")) {
        setLoadingRecetas(true); 
        try {
          const res = await obtenerHistorialCliente(clienteSeleccionado.id);
          const filtradas = res.filter(r => 
            r.cliente === clienteSeleccionado.id && 
            String((r as any).estado_receta).toUpperCase() === "SP"
          );
          setRecetasCliente(filtradas);
        } catch (err) {
          setRecetasCliente([]);
        } finally {
          setLoadingRecetas(false); 
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
    setAdicionSeleccionada(0);
    setError("");
  };

  const limpiarCliente = () => {
    setClienteSeleccionado(null);
    setBusqueda("");
    setRecetasCliente([]);
    setAdicionSeleccionada(0);
    setError("");
    setFormData({
      receta: "", tipo_lente: "", tipo_tratamiento: "",
      modelo: "", marca: "", color: "", medida: "", material: "",
      descripcion: "", observacion: ""
    });
  };

  const handleRecetaChange = (idReceta: string) => {
    setFormData(prev => ({ ...prev, receta: idReceta, tipo_lente: "" }));
    setError("");
    
    if (!idReceta) {
      setAdicionSeleccionada(0);
      return;
    }

    const recetaEncontrada = recetasCliente.find(r => r.id === Number(idReceta));
    const detalleOD = recetaEncontrada?.rv_detalle_data?.find(d => d.oculus?.alias === 'OD');
    
    const adicion = Number(detalleOD?.adicion) || 0;
    setAdicionSeleccionada(adicion);
  };

  const clientesFiltrados = busqueda.length > 0 && !clienteSeleccionado
    ? clientes.filter(c => `${c.nombre} ${c.apellido} ${c.identificacion}`.toLowerCase().includes(busqueda.toLowerCase())).slice(0, 5)
    : [];

  const mapearErroresServidor = (err: any): string => {
    if (typeof err === 'string') return err;
    if (err && typeof err === 'object') {
      if (err.detalle) return mapearErroresServidor(err.detalle);
      if (err.montura) return `Error en Montura: ${mapearErroresServidor(err.montura)}`;
      if (err.lente) return `Error en Lente: ${mapearErroresServidor(err.lente)}`;
      
      return Object.entries(err)
        .map(([key, value]) => `${key.toUpperCase()}: ${Array.isArray(value) ? value.join(", ") : value}`)
        .join(" | ");
    }
    return "Error inesperado al intentar comunicar con el servidor.";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // --- 1. VALIDACIÓN DINÁMICA DE CRISTALES MONOFOCALES ---
    if (tipoPedido !== 'SM' && formData.tipo_lente) {
      const tipoLenteId = Number(formData.tipo_lente);
      const lenteSeleccionado = catalogos?.lentes?.tipos?.find((t: any) => t.id === tipoLenteId);

      if (lenteSeleccionado) {
        const aliasLente = String(lenteSeleccionado.alias || "").toUpperCase().trim();
        const descripcionLente = String(lenteSeleccionado.descripcion || "").toUpperCase().trim();
        
        const esMonofocal = aliasLente.includes("MONO") || 
                            aliasLente === "MN" || 
                            aliasLente === "M" ||
                            aliasLente.includes("SINGLE") || 
                            descripcionLente.includes("MONO");

        if (adicionSeleccionada === 0 && !esMonofocal) {
          setError(`Esta receta no cuenta con adición (Add: 0.00). Por lo tanto, no puede procesarse con lentes multifocales/bifocales. Seleccionado: ${lenteSeleccionado.descripcion}. Por favor, cambie el tipo de lente a Monofocal.`);
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return; 
        }
      }
    }

    setLoading(true);

    // --- 2. MONTAJE DEL PAYLOAD CORRECTO (SÓLO ESPAÑOL) ---
    const monturaPayload = (tipoPedido === 'C' || tipoPedido === 'SM') && formData.modelo ? {
      modelo: Number(formData.modelo),
      marca: Number(formData.marca),
      color: Number(formData.color),
      // medidas: Number(formData.medidas),
      material: formData.material.trim()
    } : null;

    const lentePayload = (tipoPedido === 'C' || tipoPedido === 'SL') && formData.tipo_lente ? {
      tipo_lente: Number(formData.tipo_lente),
      tipo_tratamiento: Number(formData.tipo_tratamiento) // 👈 100% en español
    } : null;

    try {
      const payload: PedidoInput = {
        tipo_pedido: tipoPedido,
        cliente: clienteSeleccionado?.id ? Number(clienteSeleccionado.id) : null,
        receta_visual: (tipoPedido !== 'SM' && formData.receta) ? Number(formData.receta) : null,
        descripcion: formData.descripcion.trim(),
        observacion: formData.observacion.trim(),
        detalle: {
          medida: (tipoPedido === 'C' || tipoPedido === 'SM') ? formData.medida.trim() : undefined,
          montura: monturaPayload,
          lente: lentePayload
        }
      };

      if (tipoPedido === 'SM') {
        payload.detalle.lente = null;
      }

      // --- 3. PETICIÓN AL BACKEND ---
      const res = await registrarPedido(payload);
      
      // --- 4. DESCARGA SÍNCRONA SEGURA (EVITA COMPORTAMIENTO VACÍO) ---
      if (res?.id) {
        setSuccess("¡Pedido registrado con éxito! Descargando comprobante...");
        // Forzamos la espera para que el DOM no se destruya antes del link invisible de descarga
        await descargarFacturaPDF(res.id); 
      } else {
        setSuccess("¡Pedido registrado con éxito!");
      }
      
      // --- 5. LIMPIEZA POST-DESCARGA DE LA INTERFAZ ---
      limpiarCliente();
      setTipoPedido("C");

    } catch (err: any) {
      console.error("Error capturado en el flujo de registro:", err);
      setError(mapearErroresServidor(err));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  // if (loading && !catalogos) return <div className="p-20 text-center font-black animate-pulse text-[#1a4731]">CARGANDO CONFIGURACIÓN DE OPTI-SAMUEL...</div>;
  // POR ESTO (Más seguro):
  if (loading || !catalogos) {
    return <div className="p-20 text-center font-black animate-pulse text-[#1a4731]">CARGANDO CONFIGURACIÓN DE OPTI-SAMUEL...</div>;
  }
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
            
            {error && (
              <div className="p-5 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-start gap-3 rounded-r-xl animate-in fade-in zoom-in">
                <AlertCircle className="w-6 h-6 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-black text-sm uppercase tracking-wide">Error en Validación de Datos</h5>
                  <p className="font-bold text-xs mt-1 leading-relaxed">{error}</p>
                </div>
              </div>
            )}

            {success && (
              <div className="p-5 bg-green-50 border-l-4 border-green-500 text-green-800 rounded-r-xl font-bold text-xs animate-in fade-in">
                {success}
              </div>
            )}

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
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-1 block text-xs">Orden Médica (References)</label>
                  <select 
                    required
                    className={`w-full h-16 px-5 rounded-2xl border-2 font-black outline-none transition-all appearance-none cursor-pointer ${
                      !clienteSeleccionado || loadingRecetas ? 'bg-gray-50 border-gray-100 text-gray-300' : 'bg-blue-50 border-blue-200 text-blue-900'
                    }`}
                    disabled={!clienteSeleccionado || loadingRecetas}
                    value={formData.receta}
                    onChange={(e) => handleRecetaChange(e.target.value)}
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
                          const od = r.rv_detalle_data?.find(d => d.oculus?.alias === 'OD');
                          const adi = Number(od?.adicion) || 0;
                          return (
                            <option key={r.id} value={r.id} className="py-2">
                              ORDEN #{r.id} | Esf: {od?.oculus?.esfera || '0.00'} Cil: {od?.oculus?.cilindro || '0.00'} Add: {adi > 0 ? `+${adi.toFixed(2)}` : '0.00'} | {new Date(r.fecha_creacion!).toLocaleDateString()}
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
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-black text-blue-900/40 uppercase ml-1">Tipo de Lente</label>
                      {formData.receta && (
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase transition-all ${adicionSeleccionada > 0 ? 'bg-purple-100 text-purple-700' : 'bg-amber-100 text-amber-700'}`}>
                          {adicionSeleccionada > 0 ? `Adición: +${adicionSeleccionada.toFixed(2)}` : 'Sin Adición (Solo Monofocal)'}
                        </span>
                      )}
                    </div>
                    <select 
                      required 
                      className="w-full p-4 rounded-xl border-2 border-blue-100 font-bold bg-white focus:border-blue-400 outline-none" 
                      value={formData.tipo_lente} 
                      onChange={(e) => {
                        setFormData({...formData, tipo_lente: e.target.value});
                        setError(""); // 👈 Limpieza reactiva inmediata del error al cambiar de lente
                      }}
                    >
                      <option value="">Seleccionar...</option>
                      {catalogos?.lentes?.tipos?.map((t: any) => <option key={t.id} value={t.id}>{t.descripcion} ({t.alias})</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-blue-900/40 uppercase ml-1">Filtro / Tratamiento</label>
                    <select required className="w-full p-4 rounded-xl border-2 border-blue-100 font-bold bg-white focus:border-blue-400 outline-none" 
                      value={formData.tipo_tratamiento} onChange={(e) => setFormData({...formData, tipo_tratamiento: e.target.value})}>
                      <option value="">Seleccionar...</option>
                      {catalogos?.lentes?.tratamientos?.map((t: any) => <option key={t.id} value={t.id}>{t.descripcion}</option>)}
                    </select>
                  </div>
                </div>
              )}

              {/* {(tipoPedido === 'C' || tipoPedido === 'SM') && (
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
                        {catalogos?.monturas?.[f === 'marca' ? 'marcas' : f === 'modelo' ? 'modelos' : 'colores']?.map((i: any) => <option key={i.id} value={i.id}>{i.descripcion}</option>)}
                      </select>
                    </div>
                  ))}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-green-900/40 uppercase ml-1">Medida / Talla</label>
                    <Input 
                      required 
                      placeholder="Ej: 54-18-140..." 
                      className="h-[52px] rounded-xl border-green-100 font-bold bg-white focus:border-green-400" 
                      value={formData.medida} 
                      onChange={(e) => setFormData({...formData, medida: e.target.value})} 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-green-900/40 uppercase ml-1">Material</label>
                    <Input required placeholder="Pasta, Metal..." className="h-[52px] rounded-xl border-green-100 font-bold" 
                      value={formData.material} onChange={(e) => setFormData({...formData, material: e.target.value})} />
                  </div>
                </div>
              )} */}
              {(tipoPedido === 'C' || tipoPedido === 'SM') && (
                <div className="relative p-8 pt-12 border-2 border-green-50 rounded-[2.5rem] bg-green-50/10 grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="absolute -top-4 left-8 bg-green-600 text-white px-6 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] shadow-lg flex items-center gap-2">
                    <Glasses className="w-3 h-3" /> ESPECIFICACIONES DE MONTURA
                  </div>
                  
                  {/* Forzamos el tipado de las llaves para eliminar el 'as any' de forma segura */}
                  {(['marca', 'modelo', 'color'] as Array<keyof typeof formData>).map((f) => (
                    <div key={f} className="space-y-2">
                      <label className="text-[10px] font-black text-green-900/40 uppercase ml-1">{f}</label>
                      <select 
                        required 
                        className="w-full p-4 rounded-xl border-2 border-green-100 font-bold bg-white focus:border-green-400 outline-none uppercase text-xs" 
                        value={formData[f]} // 👈 ¡Ya no necesita 'as any'! TypeScript ya sabe que es válido
                        onChange={(e) => setFormData({ ...formData, [f]: e.target.value })}
                      >
                        <option value="">{f}</option>
                        {/* 👇 Cortocircuito seguro: si la red falla, se mapea un array vacío y la app no se cae */}
                        {(catalogos?.monturas?.[f === 'marca' ? 'marcas' : f === 'modelo' ? 'modelos' : 'colores'] || []).map((i: any) => (
                          <option key={i.id} value={i.id}>
                            {i.descripcion}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-green-900/40 uppercase ml-1">Medida / Talla</label>
                    <Input 
                      required 
                      placeholder="Ej: 54-18-140..." 
                      className="h-[52px] rounded-xl border-green-100 font-bold bg-white focus:border-green-400" 
                      value={formData.medida} 
                      onChange={(e) => setFormData({ ...formData, medida: e.target.value })} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-green-900/40 uppercase ml-1">Material</label>
                    <Input 
                      required 
                      placeholder="Pasta, Metal..." 
                      className="h-[52px] rounded-xl border-green-100 font-bold" 
                      value={formData.material} 
                      onChange={(e) => setFormData({ ...formData, material: e.target.value })} 
                    />
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