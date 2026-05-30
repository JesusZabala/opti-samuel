import { useState, useEffect, useCallback, useRef } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import {
  CalendarDays,
  Loader2,
  ClipboardList,
  Clock,
  FileText,
  Bell,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
} from "lucide-react";

import { useNotifications } from "@/context/NotificationContext";
import { useTheme } from "@/context/ThemeContext";

import { getDashboardStats } from "@/services/dashboardService";
import { obtenerCitas } from "@/services/citaService";

const DAYS = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];

const DashboardHome = () => {
  const [data, setData] = useState<any>(null);
  const [citas, setCitas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [calDate, setCalDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const [showDayPopup, setShowDayPopup] = useState(false);
  const [selectedMonthCitas, setSelectedMonthCitas] = useState<any[]>([]);
  const { theme, toggleTheme } = useTheme();

  const { notifications } = useNotifications();

  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".notification-panel")) {
        setShowNotifications(false);
      }
      if (popupRef.current && !popupRef.current.contains(target) && showDayPopup) {
        const btn = document.querySelector(`[data-day-btn="${selectedDay}"]`);
        if (btn && !btn.contains(target)) {
          setShowDayPopup(false);
        }
      }
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [showDayPopup, selectedDay]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, citasRes] = await Promise.all([
          getDashboardStats(),
          obtenerCitas(),
        ]);
        setData(statsRes);
        setCitas(Array.isArray(citasRes) ? citasRes : []);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const year = calDate.getFullYear();
    const month = calDate.getMonth();
    const filtered = citas.filter((c) => {
      const d = new Date(c.fecha);
      return d.getFullYear() === year && d.getMonth() === month;
    });
    setSelectedMonthCitas(filtered);
  }, [citas, calDate]);

  const year = calDate.getFullYear();
  const month = calDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = new Date(year, month, 1).getDay();
  const today = new Date();

  const citasByDay = useCallback(
    (day: number) => {
      return selectedMonthCitas.filter((c) => {
        const d = new Date(c.fecha);
        return d.getDate() === day;
      });
    },
    [selectedMonthCitas]
  );

  const navigateMonth = (delta: number) => {
    setCalDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
    setSelectedDay(0);
    setShowDayPopup(false);
  };

  const handleDayClick = (day: number) => {
    setSelectedDay(day);
    setShowDayPopup(true);
  };

  const popupCitas = selectedDay > 0 ? citasByDay(selectedDay) : [];

  const citasHoy = citas.filter((c) => {
    const d = new Date(c.fecha);
    return d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-emerald-700 dark:text-emerald-400">
        <Loader2 className="w-10 h-10 animate-spin mb-4" />
        <p className="font-medium">Cargando tablero de Opti-Samuel...</p>
      </div>
    );
  }

  const stats = data?.stats || { citas: 0, nuevos: 0, pedidos: 0, recetas: 0 };

  return (
    <div
      className="min-h-screen p-6 lg:p-8 transition-colors duration-300"
      style={{
        background:
          theme === "dark"
            ? "linear-gradient(135deg, #0a1a10 0%, #0f1a14 40%, #122418 100%)"
            : "linear-gradient(135deg, #f7faf8 0%, #eef8f1 40%, #f8fffb 100%)",
      }}
    >
      {/* HEADER */}
      <div className="mb-8">
        <div className="relative overflow-visible rounded-[2rem] bg-gradient-to-r from-[#163d2a] via-[#1a4731] to-emerald-700 p-6 shadow-[0_10px_40px_rgba(22,61,42,0.25)]">
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-52 h-52 bg-emerald-400/10 rounded-full blur-3xl" />

          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight">
                Opti Samuel C.A.
              </h1>
              <p className="text-sm text-emerald-100 mt-1 tracking-wide">
                Sistema de Gestión Óptica
              </p>
            </div>

            <div className="flex items-center gap-3 relative">
              {/* TEMA */}
              <button
                onClick={toggleTheme}
                className="h-12 w-12 rounded-2xl bg-white/15 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:scale-105 transition-all"
                title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
              >
                {theme === 'dark' ? (
                  <Sun size={18} className="text-white" />
                ) : (
                  <Moon size={18} className="text-white" />
                )}
              </button>

              {/* CAMPANA */}
              <div className="relative notification-panel">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative h-12 w-12 rounded-2xl bg-white/15 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:scale-105 transition-all"
                >
                  <Bell size={18} className="text-white" />
                  {notifications.length > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-300" />
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 top-16 w-96 bg-white dark:bg-[#1a2a20] rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-emerald-100 dark:border-emerald-800/50 overflow-hidden z-50 animate-in fade-in slide-in-from-top-3 duration-300">
                    <div className="bg-gradient-to-r from-[#163d2a] to-emerald-600 p-5 text-white">
                      <h3 className="font-black text-lg">Notificaciones</h3>
                      <p className="text-xs opacity-80 mt-1">Centro de actividad del sistema</p>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((n, i) => (
                          <div key={i} className="p-5 border-b border-emerald-50 dark:border-emerald-800/30 hover:bg-emerald-50/40 dark:hover:bg-emerald-800/20 transition-all cursor-pointer">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-800/50 flex items-center justify-center text-lg">🔔</div>
                              <div className="flex-1">
                                <h4 className="text-sm font-black text-[#163d2a] dark:text-emerald-100">{n.titulo}</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{n.mensaje}</p>
                                <span className="text-[10px] text-emerald-600 dark:text-emerald-300 font-bold mt-2 block">{n.fecha}</span>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-10 text-center">
                          <div className="text-4xl mb-3">🔕</div>
                          <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">No hay notificaciones nuevas</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[
          { label: "Citas", val: stats.citas, sub: "Por atender", icon: "📅" },
          { label: "Pacientes", val: stats.nuevos, sub: "Registrados", icon: "👥" },
          { label: "Recetas", val: stats.recetas, sub: "Exámenes", icon: "👁️" },
          { label: "Pedidos", val: stats.pedidos, sub: "Pendientes", icon: "📦" },
        ].map((item, idx) => (
          <Card
            key={idx}
            className="rounded-[2rem] border border-white/40 dark:border-white/10 bg-white/75 dark:bg-[#1a2a20]/80 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(16,185,129,0.10)] transition-all duration-300"
          >
            <CardContent className="p-5 flex justify-between items-center">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] font-black text-gray-400 dark:text-gray-500">{item.label}</p>
                <h2 className="text-3xl font-black text-[#163d2a] dark:text-emerald-100 mt-2">{item.val}</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.sub}</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1a4731] to-emerald-500 flex items-center justify-center text-2xl text-white shadow-lg">
                {item.icon}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* IZQUIERDA */}
        <div className="lg:col-span-2 space-y-6">
          {/* CALENDARIO */}
          <Card className="rounded-[2rem] border border-white/40 dark:border-white/10 bg-white/75 dark:bg-[#1a2a20]/80 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between gap-3 border-b border-emerald-50 dark:border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-800 text-[#1a4731] dark:text-emerald-200">
                  <CalendarDays size={18} />
                </div>
                <CardTitle className="text-lg font-black text-[#163d2a] dark:text-emerald-100 capitalize">
                  {new Intl.DateTimeFormat("es-ES", { month: "long", year: "numeric" }).format(calDate)}
                </CardTitle>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => navigateMonth(-1)}
                  className="p-2 rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-800 text-[#1a4731] dark:text-emerald-200 transition-all"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => { setCalDate(new Date()); setSelectedDay(0); setShowDayPopup(false); }}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-[#1a4731] dark:text-emerald-200 hover:bg-emerald-100 dark:hover:bg-emerald-800 transition-all"
                >
                  Hoy
                </button>
                <button
                  onClick={() => navigateMonth(1)}
                  className="p-2 rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-800 text-[#1a4731] dark:text-emerald-200 transition-all"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </CardHeader>

            <CardContent className="pt-6">
              <div className="grid grid-cols-7 gap-1.5 text-center">
                {DAYS.map((d) => (
                  <div key={d} className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase py-1">
                    {d}
                  </div>
                ))}

                {Array.from({ length: startDay }).map((_, i) => (
                  <div key={`blank-${i}`} />
                ))}

                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const esHoy = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
                  const esSeleccionado = day === selectedDay;
                  const tieneCitas = citasByDay(day).length > 0;

                  return (
                    <button
                      key={day}
                      data-day-btn={day}
                      onClick={() => handleDayClick(day)}
                      className={`relative py-2.5 rounded-2xl text-sm transition-all duration-200 ${
                        esSeleccionado
                          ? "bg-[#1a4731] dark:bg-emerald-600 text-white font-bold shadow-lg scale-105"
                          : esHoy
                          ? "border-2 border-[#1a4731] dark:border-emerald-500 text-[#1a4731] dark:text-emerald-200 font-bold"
                          : "text-gray-600 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-800/50"
                      }`}
                    >
                      {day}
                      {tieneCitas && (
                        <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${
                          esSeleccionado ? "bg-emerald-300" : "bg-emerald-500 dark:bg-emerald-400"
                        }`} />
                      )}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* AGENDA DEL DÍA (siempre hoy) */}
          <Card className="rounded-[2rem] border border-white/40 dark:border-white/10 bg-white/75 dark:bg-[#1a2a20]/80 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-[#1a4731] dark:text-emerald-300" />
                <CardTitle className="text-lg font-black text-[#163d2a] dark:text-emerald-100 capitalize">
                  Agenda de hoy
                </CardTitle>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              {citasHoy.length > 0 ? (
                citasHoy.map((cita: any, i: number) => {
                  const f = new Date(cita.fecha);
                  const hora = f.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
                  return (
                    <div
                      key={i}
                      className="group p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-900/20 border border-emerald-100/40 dark:border-emerald-800/30 flex justify-between items-center hover:bg-white dark:hover:bg-emerald-800/30 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex gap-4 items-center">
                        <div className="h-10 w-1 rounded-full bg-emerald-400 dark:bg-emerald-500" />
                        <div>
                          <p className="font-bold text-gray-800 dark:text-emerald-100">
                            {cita.cliente_data?.nombre} {cita.cliente_data?.apellido}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                            {cita.motivo || "Consulta"}
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-emerald-100 dark:bg-emerald-800 text-emerald-700 dark:text-emerald-200 border-0 px-4 py-1 rounded-full text-xs font-bold">
                        <Clock size={12} className="mr-2" />
                        {hora}
                      </Badge>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-10">
                  <p className="text-sm text-gray-400 dark:text-gray-500 italic">
                    No hay citas para mostrar hoy.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* POPUP FLOTANTE: CITAS DEL DÍA SELECCIONADO */}
        {showDayPopup && selectedDay > 0 && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-in fade-in duration-200">
            <div
              ref={popupRef}
              className="bg-white dark:bg-[#1a2a20] rounded-[2rem] shadow-2xl border border-emerald-100 dark:border-emerald-800/50 w-full max-w-md mx-4 overflow-hidden animate-in zoom-in-95 duration-200"
            >
              <div className="bg-gradient-to-r from-[#163d2a] to-emerald-600 p-5 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarDays size={18} />
                  <h3 className="font-black text-lg capitalize">
                    {selectedDay} de {new Intl.DateTimeFormat("es-ES", { month: "long" }).format(calDate)}
                  </h3>
                </div>
                <button
                  onClick={() => setShowDayPopup(false)}
                  className="h-8 w-8 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center transition-all"
                >
                  ✕
                </button>
              </div>

              <div className="p-5 max-h-80 overflow-y-auto space-y-3">
                {popupCitas.length > 0 ? (
                  popupCitas.map((cita: any, i: number) => {
                    const f = new Date(cita.fecha);
                    const hora = f.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
                    return (
                      <div
                        key={i}
                        className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-900/20 border border-emerald-100/40 dark:border-emerald-800/30 flex justify-between items-center hover:bg-white dark:hover:bg-emerald-800/30 transition-all"
                      >
                        <div className="flex gap-3 items-center">
                          <div className="h-8 w-1 rounded-full bg-emerald-400" />
                          <div>
                            <p className="font-bold text-gray-800 dark:text-emerald-100 text-sm">
                              {cita.cliente_data?.nombre} {cita.cliente_data?.apellido}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{cita.motivo || "Consulta"}</p>
                          </div>
                        </div>
                        <Badge className="bg-emerald-100 dark:bg-emerald-800 text-emerald-700 dark:text-emerald-200 border-0 px-3 py-1 rounded-full text-xs font-bold">
                          {hora}
                        </Badge>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8">
                    <p className="text-sm text-gray-400 dark:text-gray-500 italic">No hay citas para este día.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* DERECHA */}
        <div className="space-y-6">
          <Card className="rounded-[2rem] border border-white/40 dark:border-white/10 bg-white/75 dark:bg-[#1a2a20]/80 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden">
            <div className="bg-gradient-to-r from-[#1a4731] to-emerald-600 p-5 text-white">
              <CardTitle className="text-lg font-black flex items-center gap-2">
                <ClipboardList size={18} />
                Actividad reciente
              </CardTitle>
              <p className="text-[10px] uppercase tracking-[0.25em] mt-1 opacity-80">Control del sistema</p>
            </div>

            <CardContent className="p-6 space-y-8">
              {/* CLIENTES */}
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] font-black text-gray-400 dark:text-gray-500 mb-4">Nuevos ingresos</p>
                <div className="flex -space-x-3">
                  {data?.clientesRecientes?.map((cl: any, i: number) => (
                    <Avatar key={i} className="h-12 w-12 border-4 border-white dark:border-[#1a2a20] shadow-md">
                      <AvatarFallback className="bg-gradient-to-br from-[#1a4731] to-emerald-500 text-white font-bold">
                        {cl.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
              </div>

              {/* PEDIDOS */}
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] font-black text-gray-400 dark:text-gray-500 mb-5">Estado de laboratorio</p>
                <div className="space-y-5">
                  {data?.pedidosRecientes?.map((pedido: any) => {
                    const colorMap: any = { E: "bg-amber-400", P: "bg-blue-400", C: "bg-emerald-400" };
                    return (
                      <div key={pedido.id} className="relative pl-6 border-l border-dashed border-emerald-100 dark:border-emerald-800">
                        <div className={`absolute -left-[5px] top-1 w-[10px] h-[10px] rounded-full ${colorMap[pedido.codigo_estado]}`} />
                        <div className="group rounded-2xl p-4 bg-gray-50/60 dark:bg-emerald-900/10 hover:bg-white dark:hover:bg-emerald-800/20 border border-transparent hover:border-emerald-100 dark:hover:border-emerald-700 hover:shadow-lg transition-all duration-300">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-[9px] font-black text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-800 px-2 py-1 rounded-md">FOLIO #{pedido.id}</span>
                            <span className="text-[9px] uppercase font-bold text-gray-400 dark:text-gray-500">{pedido.estado}</span>
                          </div>
                          <p className="text-sm font-black text-gray-800 dark:text-emerald-100 group-hover:text-[#1a4731] dark:group-hover:text-emerald-300 transition-colors">{pedido.paciente}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-[9px] dark:text-gray-300 dark:border-gray-600">{pedido.producto}</Badge>
                            <FileText size={10} className="text-gray-300 dark:text-gray-600" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;