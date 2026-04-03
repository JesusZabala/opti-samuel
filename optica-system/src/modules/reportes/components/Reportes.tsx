import { useState } from "react";
import { 
  FileText, Calendar, Users, ClipboardList, 
  Stethoscope, ShoppingBag, Download, AlertCircle,
  ChevronRight, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  descargarReportesClientesPDF, 
  generarReporteCitasPDF, 
  generarReportePedidosPDF, 
  generarReporteRecetasPDF
} from "@/services/reporteService"; 

export default function ModuloReportes() {
  const [modulo, setModulo] = useState<string>("clientes");
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [cargando, setCargando] = useState(false);

  const opcionesModulo = [
    { 
      id: "clientes", 
      nombre: "Clientes", 
      icon: Users, 
      color: "text-blue-600", 
      bg: "bg-blue-50" 
    },
    { 
      id: "citas", 
      nombre: "Citas Médicas", 
      icon: Stethoscope, 
      color: "text-purple-600", 
      bg: "bg-purple-50" 
    },
    { 
      id: "recetas", 
      nombre: "Recetas Médicas", 
      icon: ClipboardList, 
      color: "text-orange-600", 
      bg: "bg-orange-50" 
    },
    { 
      id: "pedidos", 
      nombre: "Pedidos", 
      icon: ShoppingBag, 
      color: "text-green-600", 
      bg: "bg-green-50" 
    },
  ];

  const handleDescargar = async () => {
    if (!desde || !hasta) return;
    
    if (new Date(hasta) < new Date(desde)) {
      alert("La fecha 'Hasta' no puede ser anterior a la fecha 'Desde'.");
      return; 
    }

    setCargando(true);
    try {
      switch (modulo){
        case "clientes":
          descargarReportesClientesPDF(desde, hasta);
          break;
        case "citas":
          await generarReporteCitasPDF(desde, hasta);
          break;
        case "recetas":
          await generarReporteRecetasPDF(desde, hasta);
          break;
        case "pedidos":
          await generarReportePedidosPDF(desde, hasta);
          break;  
        default:
          console.warn("Modulo no implementado:", modulo);
          alert("Este reporte aun no esta disponible.");

      }
    } catch (error) {
      console.error("Error en la descarga:", error);
      alert("Hubo un error al generar el reporte.");
    } finally {
      setTimeout(() => setCargando(false), 500);
    }
  };

  return (
    <div className="p-10 max-w-6xl mx-auto">
      <div className="bg-white rounded-[3rem] shadow-2xl border border-gray-100 overflow-hidden">
        
        {/* HEADER */}
        <div className="bg-[#1a4731] p-10 text-white flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
              <FileText className="w-10 h-10 text-green-400" /> Generador de Reportes
            </h2>
            <p className="text-green-100/60 font-bold uppercase text-[10px] tracking-widest mt-2">
              Auditoría y Estadísticas • Opti-Samuel
            </p>
          </div>
          <div className="hidden md:block bg-white/10 p-4 rounded-2xl border border-white/10 text-center">
            <p className="text-[10px] font-black uppercase opacity-60">Hoy es</p>
            <p className="font-bold text-sm">{new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <div className="p-12 space-y-12">
          
          {/* PASO 1: SELECCIÓN DE MÓDULO */}
          <section>
            <div className="flex items-center gap-2 mb-6">
               <span className="bg-[#1a4731] text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black">1</span>
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Selecciona el módulo</label>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {opcionesModulo.map((op) => (
                <button
                  key={op.id}
                  onClick={() => setModulo(op.id)}
                  disabled={cargando}
                  className={`p-6 rounded-[2.5rem] border-2 transition-all flex flex-col items-center gap-4 group relative ${
                    modulo === op.id 
                    ? "border-[#1a4731] bg-green-50/20 shadow-xl scale-105" 
                    : "border-gray-50 hover:border-gray-200 bg-white"
                  } ${cargando ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className={`p-5 rounded-2xl ${op.bg} ${op.color} group-hover:rotate-6 transition-transform`}>
                    <op.icon className="w-8 h-8" />
                  </div>
                  <span className={`text-[11px] font-black uppercase tracking-tighter text-center ${modulo === op.id ? 'text-[#1a4731]' : 'text-gray-400'}`}>
                    {op.nombre}
                  </span>
                  {modulo === op.id && (
                    <div className="absolute -top-2 -right-2 bg-[#1a4731] text-white p-1 rounded-full">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* PASO 2: RANGO DE FECHAS */}
          <section className="bg-gray-50/50 p-10 rounded-[3rem] border border-gray-100">
            <div className="flex items-center gap-2 mb-8">
               <span className="bg-[#1a4731] text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black">2</span>
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Define el periodo</label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <p className="text-[10px] font-black text-gray-500 ml-4 uppercase">Desde</p>
                <div className="relative">
                  <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input 
                    type="date" 
                    value={desde}
                    onChange={(e) => setDesde(e.target.value)}
                    className="w-full pl-16 pr-8 h-16 rounded-[1.5rem] border-2 border-white bg-white shadow-sm focus:border-[#1a4731] outline-none font-bold text-gray-700 transition-all text-lg"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-[10px] font-black text-gray-500 ml-4 uppercase">Hasta</p>
                <div className="relative">
                  <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input 
                    type="date" 
                    value={hasta}
                    onChange={(e) => setHasta(e.target.value)}
                    className="w-full pl-16 pr-8 h-16 rounded-[1.5rem] border-2 border-white bg-white shadow-sm focus:border-[#1a4731] outline-none font-bold text-gray-700 transition-all text-lg"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* BOTÓN DE ACCIÓN */}
          <div className="pt-4">
            <Button 
              onClick={handleDescargar}
              disabled={!desde || !hasta || cargando}
              className="w-full py-14 bg-[#1a4731] hover:bg-[#143625] text-white rounded-[2.5rem] shadow-2xl transition-all flex items-center justify-center gap-6 group disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {cargando ? (
                <Loader2 className="w-10 h-10 animate-spin text-green-400" />
              ) : (
                <div className="bg-green-400/20 p-4 rounded-2xl group-hover:bg-green-400/40 transition-colors">
                  <Download className="w-8 h-8 text-green-400 group-hover:translate-y-1 transition-transform" />
                </div>
              )}
              <div className="text-left">
                <p className="text-2xl font-black uppercase tracking-tighter">
                  {cargando ? "Generando Reporte..." : "Descargar Reporte PDF"}
                </p>
                <p className="text-[11px] font-bold opacity-60 uppercase tracking-[0.1em]">
                  {modulo} • {desde || "..."} al {hasta || "..."}
                </p>
              </div>
            </Button>
            
            {!desde || !hasta ? (
              <div className="mt-8 flex items-center justify-center gap-3 text-amber-600 animate-pulse bg-amber-50 py-3 rounded-2xl border border-amber-100">
                <AlertCircle className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Selecciona las fechas para continuar</span>
              </div>
            ) : (
              <p className="mt-8 text-center text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
                {cargando ? "Procesando datos del servidor..." : "El archivo se descargará automáticamente"}
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}