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
import logo from "@/assets/Logo.png";

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

  const moduloSeleccionado = opcionesModulo.find((m) => m.id === modulo);

  const handleDescargar = async () => {
    if (!desde || !hasta) return;

    if (new Date(hasta) < new Date(desde)) {
      alert("La fecha 'Hasta' no puede ser anterior a la fecha 'Desde'.");
      return;
    }

    setCargando(true);
    try {
      switch (modulo) {
        case "clientes":
          await descargarReportesClientesPDF(desde, hasta);
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
    <div className="p-3 md:p-10 max-w-6xl mx-auto dark:bg-[#0a0f0a]">
      {/* ═══════ TOOLBAR (fuera de la hoja) ═══════ */}
      <div className="bg-white dark:bg-[#1a2a20] rounded-3xl shadow-xl border border-gray-100 dark:border-white/10 p-4 md:p-8 mb-8 space-y-8">

        <div className="flex items-center gap-3">
          <FileText className="w-7 h-7 text-[#1a4731] dark:text-emerald-400" />
          <h1 className="text-2xl md:text-3xl font-black text-[#1a4731] dark:text-emerald-100 uppercase tracking-tight">
            Generador de Reportes
          </h1>
        </div>

        {/* PASO 1: SELECCIÓN DE MÓDULO */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-[#1a4731] dark:bg-emerald-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black">1</span>
            <label className="text-[10px] font-black text-gray-400 dark:text-gray-300 uppercase tracking-widest">Selecciona el módulo</label>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {opcionesModulo.map((op) => (
              <button
                key={op.id}
                onClick={() => setModulo(op.id)}
                disabled={cargando}
                className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 group relative ${
                  modulo === op.id
                    ? "border-[#1a4731] dark:border-emerald-500 bg-green-50/30 dark:bg-emerald-900/10 shadow-md"
                    : "border-gray-50 dark:border-white/10 hover:border-gray-200 dark:hover:border-gray-600 bg-white dark:bg-[#1a2a20]"
                } ${cargando ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className={`p-3 rounded-xl ${op.bg} ${op.color} group-hover:rotate-6 transition-transform`}>
                  <op.icon className="w-6 h-6" />
                </div>
                <span className={`text-[10px] font-black uppercase tracking-tighter text-center ${modulo === op.id ? 'text-[#1a4731] dark:text-emerald-100' : 'text-gray-400 dark:text-gray-300'}`}>
                  {op.nombre}
                </span>
                {modulo === op.id && (
                  <div className="absolute -top-2 -right-2 bg-[#1a4731] text-white p-1 rounded-full">
                    <ChevronRight className="w-3 h-3" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* PASO 2: RANGO DE FECHAS */}
        <section className="bg-gray-50/50 dark:bg-[#0f1a14]/50 p-6 rounded-2xl border border-gray-100 dark:border-white/10">
          <div className="flex items-center gap-2 mb-5">
            <span className="bg-[#1a4731] dark:bg-emerald-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black">2</span>
            <label className="text-[10px] font-black text-gray-400 dark:text-gray-300 uppercase tracking-widest">Define el periodo</label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <p className="text-[10px] font-black text-gray-500 dark:text-gray-400 ml-1 uppercase">Desde</p>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                <input
                  type="date"
                  value={desde}
                  onChange={(e) => setDesde(e.target.value)}
                  className="w-full pl-12 pr-4 h-12 rounded-xl border-2 border-white dark:border-white/10 bg-white dark:bg-[#1a2a20] dark:text-gray-100 shadow-sm focus:border-[#1a4731] dark:focus:border-emerald-500 outline-none font-bold text-gray-700 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] font-black text-gray-500 dark:text-gray-400 ml-1 uppercase">Hasta</p>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                <input
                  type="date"
                  value={hasta}
                  onChange={(e) => setHasta(e.target.value)}
                  className="w-full pl-12 pr-4 h-12 rounded-xl border-2 border-white dark:border-white/10 bg-white dark:bg-[#1a2a20] shadow-sm focus:border-[#1a4731] dark:focus:border-emerald-500 outline-none font-bold text-gray-700 dark:text-gray-100 transition-all"
                />
              </div>
            </div>
          </div>
        </section>

        {/* BOTÓN DE ACCIÓN */}
        <div>
          <Button
            onClick={handleDescargar}
            disabled={!desde || !hasta || cargando}
            className="w-full py-8 bg-[#1a4731] hover:bg-[#143625] text-white rounded-2xl shadow-xl transition-all flex items-center justify-center gap-4 group disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {cargando ? (
              <Loader2 className="w-7 h-7 animate-spin text-green-400" />
            ) : (
              <div className="bg-green-400/20 p-3 rounded-xl group-hover:bg-green-400/40 transition-colors">
                <Download className="w-6 h-6 text-green-400 group-hover:translate-y-1 transition-transform" />
              </div>
            )}
            <div className="text-left">
              <p className="text-lg font-black uppercase tracking-tighter">
                {cargando ? "Generando Reporte..." : "Descargar Reporte PDF"}
              </p>
              <p className="text-[10px] font-bold opacity-60 uppercase tracking-[0.1em]">
                {modulo} • {desde || "..."} al {hasta || "..."}
              </p>
            </div>
          </Button>

          {!desde || !hasta ? (
            <div className="mt-5 flex items-center justify-center gap-3 text-amber-600 dark:text-amber-400 animate-pulse bg-amber-50 dark:bg-amber-950/30 py-2 rounded-xl border border-amber-100 dark:border-amber-800/30">
              <AlertCircle className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Selecciona las fechas para continuar</span>
            </div>
          ) : null}
        </div>
      </div>

      {/* ═══════ HOJA PREVIEW (parece un PDF vertical) ═══════ */}
      <div className="text-center mb-4">
        <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em]">
          Vista previa del documento
        </p>
      </div>

      <div
        className="relative mx-auto bg-white shadow-2xl overflow-hidden"
        style={{
          width: "100%",
          maxWidth: "850px",
          aspectRatio: "1 / 1.414",
          minHeight: "500px",
          overflowY: "auto",
        }}
      >
        {/* MARCA DE AGUA (logo centrado y tenue) */}
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          style={{ zIndex: 1 }}
        >
          <img
            src={logo}
            alt=""
            className="w-[300px] md:w-[420px] h-auto"
            style={{ opacity: 0.06 }}
          />
        </div>

        {/* HEADER verde corporativo */}
        <div
          className="relative flex items-center px-8 md:px-10 text-white"
          style={{ backgroundColor: "#1a4731", height: "110px", zIndex: 2 }}
        >
          <img src={logo} alt="Opti-Samuel" className="w-[70px] h-auto mr-5" />
          <div>
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-widest leading-tight">
              Opti-Samuel
            </h1>
            <p className="text-[#a3d4b0] text-[11px] md:text-xs font-bold tracking-[0.2em] uppercase mt-1">
              Sistema de Gestión Óptica
            </p>
          </div>
        </div>

        {/* CUERPO del reporte (preview estática) */}
        <div
          className="relative px-10 md:px-14 py-10"
          style={{ zIndex: 2, minHeight: "calc(100% - 110px - 110px)" }}
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-black text-[#1a4731] uppercase tracking-widest">
              {moduloSeleccionado?.nombre || "Reporte"}
            </h2>
            <p className="text-xs md:text-sm text-gray-500 mt-2 font-bold">
              Período: {desde || "—"} al {hasta || "—"}
            </p>
          </div>

          {/* Métricas placeholder */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <div className="bg-[#f0f7f3] border border-[#d0e0d6] rounded-xl px-6 py-4 min-w-[140px] text-center">
              <p className="text-2xl font-black text-[#1a4731]">—</p>
              <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-1">Total</p>
            </div>
            <div className="bg-[#f0f7f3] border border-[#d0e0d6] rounded-xl px-6 py-4 min-w-[140px] text-center">
              <p className="text-base font-black text-[#1a4731]">{desde || "—"}</p>
              <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-1">Desde</p>
            </div>
            <div className="bg-[#f0f7f3] border border-[#d0e0d6] rounded-xl px-6 py-4 min-w-[140px] text-center">
              <p className="text-base font-black text-[#1a4731]">{hasta || "—"}</p>
              <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-1">Hasta</p>
            </div>
          </div>

          {/* Línea divisoria con texto */}
          <div className="border-t-2 border-dashed border-gray-200 pt-6 mt-4">
            <p className="text-center text-gray-400 text-xs italic">
              El documento PDF descargado contiene la tabla completa con los datos
              del período seleccionado en orientación vertical.
            </p>
          </div>
        </div>

        {/* FOOTER verde corporativo */}
        <div
          className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-8 md:px-10 text-white"
          style={{ backgroundColor: "#1a4731", height: "110px", zIndex: 2 }}
        >
          <div className="text-[10px] md:text-[11px] leading-tight">
            <p className="font-black uppercase">Opti-Samuel C.A.</p>
            <p>Rif: J-12345678-9</p>
          </div>
          <div className="text-[#a3d4b0] italic text-[10px] md:text-[11px] text-center">
            &ldquo;Tu visión es nuestra prioridad&rdquo;
          </div>
          <div className="text-[10px] md:text-[11px] text-right leading-tight">
            <p className="font-black text-[#a3d4b0] uppercase">Contacto</p>
            <p>0412-1234567</p>
            <p>optisamuel6@gmail.com</p>
          </div>
        </div>
      </div>

      <p className="text-center text-gray-400 dark:text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mt-6">
        El archivo se descargará automáticamente al presionar el botón
      </p>
    </div>
  );
}
