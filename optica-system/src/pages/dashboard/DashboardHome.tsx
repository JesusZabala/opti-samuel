import { useState, useEffect } from "react";

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
  Search,
} from "lucide-react";

import { useNotifications } from "@/context/NotificationContext";

import { getDashboardStats } from "@/services/dashboardService";

const DashboardHome = () => {

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  useEffect(() => {

    const closeNotifications = (e: MouseEvent) => {

      const target = e.target as HTMLElement;

      if (!target.closest(".notification-panel")) {
        setShowNotifications(false);
      }

    };

    document.addEventListener("click", closeNotifications);

    return () =>
      document.removeEventListener("click", closeNotifications);

  }, []);
  const { notifications } = useNotifications();

  // NOTIFICACIONES REALES DEL BACKEND
  

  useEffect(() => {

    const fetchStats = async () => {

      try {

        const res = await getDashboardStats();

        setData(res);

      } catch (error) {

        console.error(
          "Error al cargar estadísticas:",
          error
        );

      } finally {

        setLoading(false);

      }
    };

    fetchStats();

  }, []);

  // FUTURAS NOTIFICACIONES DEL BACKEND
  useEffect(() => {

    // AQUÍ TU COMPAÑERO CONECTARÁ EL BACKEND
    // setNotifications(res.data)

  }, []);

  if (loading) {

    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-emerald-700">

        <Loader2 className="w-10 h-10 animate-spin mb-4" />

        <p className="font-medium">
          Cargando tablero de Opti-Samuel...
        </p>

      </div>
    );
  }

  const stats = data?.stats || {
    citas: 0,
    nuevos: 0,
    pedidos: 0,
    recetas: 0,
  };

  return (

    <div
      className="min-h-screen p-6 lg:p-8"
      style={{
        background:
          "linear-gradient(135deg, #f7faf8 0%, #eef8f1 40%, #f8fffb 100%)",
      }}
    >

      {/* HEADER */}
      <div className="mb-8">

        <div className="relative overflow-visible rounded-[2rem] bg-gradient-to-r from-[#163d2a] via-[#1a4731] to-emerald-700 p-6 shadow-[0_10px_40px_rgba(22,61,42,0.25)]">

          {/* EFECTOS */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-3xl" />

          <div className="absolute bottom-0 left-0 w-52 h-52 bg-emerald-400/10 rounded-full blur-3xl" />

          <div className="relative z-10 flex items-center justify-between">

            {/* TEXTO */}
            <div>

              <h1 className="text-3xl font-black text-white tracking-tight">
                Opti Samuel C.A.
              </h1>

              <p className="text-sm text-emerald-100 mt-1 tracking-wide">
                Sistema de Gestión Óptica
              </p>

            </div>

            {/* ACCIONES */}
            <div className="flex items-center gap-3 relative">

              {/* BUSCADOR */}
              <div
                className={`flex items-center bg-white border border-white/20 rounded-2xl overflow-hidden transition-all duration-300 shadow-lg ${
                  showSearch
                    ? "w-72 px-4"
                    : "w-12 justify-center"
                } h-12`}
              >

                <button
                  onClick={() =>
                    setShowSearch(!showSearch)
                  }
                  className="text-[#1a4731]"
                >
                  <Search size={18} />
                </button>

                {showSearch && (
                  <input
                    type="text"
                    placeholder="Buscar..."
                    className="ml-3 w-full outline-none bg-transparent text-sm text-gray-700 placeholder:text-gray-400"
                  />
                )}

              </div>

              {/* CAMPANA */}
              <div className="relative notification-panel">

                <button
                  onClick={() =>
                    setShowNotifications(!showNotifications)
                  }
                  className="relative h-12 w-12 rounded-2xl bg-white/15 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:scale-105 transition-all"
                >

                  <Bell
                    size={18}
                    className="text-white"
                  />

                  {notifications.length > 0 && (

                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-300" />

                  )}

                </button>

                {/* PANEL */}
                {showNotifications && (

                  <div className="absolute right-0 top-16 w-96 bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-emerald-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-3 duration-300">

                    {/* HEADER */}
                    <div className="bg-gradient-to-r from-[#163d2a] to-emerald-600 p-5 text-white">

                      <h3 className="font-black text-lg">
                        Notificaciones
                      </h3>

                      <p className="text-xs opacity-80 mt-1">
                        Centro de actividad del sistema
                      </p>

                    </div>

                    {/* CONTENIDO */}
                    <div className="max-h-96 overflow-y-auto">

                      {notifications.length > 0 ? (

                        notifications.map((n, i) => (

                          <div
                            key={i}
                            className="p-5 border-b border-emerald-50 hover:bg-emerald-50/40 transition-all cursor-pointer"
                          >

                            <div className="flex items-start gap-3">

                              <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-lg">
                                🔔
                              </div>

                              <div className="flex-1">

                                <h4 className="text-sm font-black text-[#163d2a]">
                                  {n.titulo}
                                </h4>

                                <p className="text-xs text-gray-500 mt-1">
                                  {n.mensaje}
                                </p>

                                <span className="text-[10px] text-emerald-600 font-bold mt-2 block">
                                  {n.fecha}
                                </span>

                              </div>

                            </div>

                          </div>

                        ))

                      ) : (

                        <div className="p-10 text-center">

                          <div className="text-4xl mb-3">
                            🔕
                          </div>

                          <p className="text-sm font-semibold text-gray-500">
                            No hay notificaciones nuevas
                          </p>

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

      {/* CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

        {[
          {
            label: "Citas",
            val: stats.citas,
            sub: "Por atender",
            icon: "📅",
          },
          {
            label: "Pacientes",
            val: stats.nuevos,
            sub: "Registrados",
            icon: "👥",
          },
          {
            label: "Recetas",
            val: stats.recetas,
            sub: "Exámenes",
            icon: "👁️",
          },
          {
            label: "Pedidos",
            val: stats.pedidos,
            sub: "Pendientes",
            icon: "📦",
          },
        ].map((item, idx) => (

          <Card
            key={idx}
            className="rounded-[2rem] border border-white/40 bg-white/75 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(16,185,129,0.10)] transition-all duration-300"
          >

            <CardContent className="p-5 flex justify-between items-center">

              <div>

                <p className="text-[10px] uppercase tracking-[0.25em] font-black text-gray-400">
                  {item.label}
                </p>

                <h2 className="text-3xl font-black text-[#163d2a] mt-2">
                  {item.val}
                </h2>

                <p className="text-xs text-gray-500 mt-1">
                  {item.sub}
                </p>

              </div>

              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1a4731] to-emerald-500 flex items-center justify-center text-2xl text-white shadow-lg">
                {item.icon}
              </div>

            </CardContent>

          </Card>

        ))}

      </div>

      {/* CONTENIDO */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        {/* IZQUIERDA */}
        <div className="lg:col-span-2 space-y-6">

          {/* CALENDARIO */}
          <Card className="rounded-[2rem] border border-white/40 bg-white/75 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden">

            <CardHeader className="flex flex-row items-center gap-3 border-b border-emerald-50 pb-4">

              <div className="p-2 rounded-xl bg-emerald-100 text-[#1a4731]">
                <CalendarDays size={18} />
              </div>

              <CardTitle className="text-lg font-black text-[#163d2a] capitalize">

                {new Intl.DateTimeFormat("es-ES", {
                  month: "long",
                  year: "numeric",
                }).format(new Date())}

              </CardTitle>

            </CardHeader>

            <CardContent className="pt-6">

              <div className="grid grid-cols-7 gap-3 text-center">

                {[
                  "Dom",
                  "Lun",
                  "Mar",
                  "Mie",
                  "Jue",
                  "Vie",
                  "Sab",
                ].map((d) => (

                  <div
                    key={d}
                    className="text-[10px] font-black text-gray-400 uppercase"
                  >
                    {d}
                  </div>

                ))}

                {Array.from({ length: 31 }).map((_, i) => {

                  const esHoy =
                    i + 1 === new Date().getDate();

                  return (

                    <div
                      key={i}
                      className={`py-3 rounded-2xl text-sm transition-all duration-300 cursor-pointer ${
                        esHoy
                          ? "bg-[#1a4731] text-white font-bold shadow-lg scale-105"
                          : "text-gray-600 hover:bg-emerald-50"
                      }`}
                    >
                      {i + 1}
                    </div>

                  );
                })}

              </div>

            </CardContent>

          </Card>

          {/* AGENDA */}
          <Card className="rounded-[2rem] border border-white/40 bg-white/75 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.04)]">

            <CardHeader>

              <CardTitle className="text-lg font-black text-[#163d2a]">
                Agenda del día
              </CardTitle>

            </CardHeader>

            <CardContent className="space-y-3">

              {data.citasHoy?.length > 0 ? (

                data.citasHoy.map((cita: any, i: number) => (

                  <div
                    key={i}
                    className="group p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100/40 flex justify-between items-center hover:bg-white hover:shadow-lg transition-all duration-300"
                  >

                    <div className="flex gap-4 items-center">

                      <div className="h-10 w-1 rounded-full bg-emerald-400" />

                      <div>

                        <p className="font-bold text-gray-800">
                          {cita.name}
                        </p>

                        <p className="text-xs text-gray-500 italic">
                          {cita.type}
                        </p>

                      </div>

                    </div>

                    <Badge className="bg-emerald-100 text-emerald-700 border-0 px-4 py-1 rounded-full text-xs font-bold">

                      <Clock size={12} className="mr-2" />

                      {cita.time}

                    </Badge>

                  </div>

                ))

              ) : (

                <div className="text-center py-10">

                  <p className="text-sm text-gray-400 italic">
                    No hay citas para mostrar hoy.
                  </p>

                </div>

              )}

            </CardContent>

          </Card>

        </div>

        {/* DERECHA */}
        <div className="space-y-6">

          <Card className="rounded-[2rem] border border-white/40 bg-white/75 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden">

            <div className="bg-gradient-to-r from-[#1a4731] to-emerald-600 p-5 text-white">

              <CardTitle className="text-lg font-black flex items-center gap-2">

                <ClipboardList size={18} />

                Actividad reciente

              </CardTitle>

              <p className="text-[10px] uppercase tracking-[0.25em] mt-1 opacity-80">
                Control del sistema
              </p>

            </div>

            <CardContent className="p-6 space-y-8">

              {/* CLIENTES */}
              <div>

                <p className="text-[10px] uppercase tracking-[0.25em] font-black text-gray-400 mb-4">
                  Nuevos ingresos
                </p>

                <div className="flex -space-x-3">

                  {data.clientesRecientes?.map(
                    (cl: any, i: number) => (

                      <Avatar
                        key={i}
                        className="h-12 w-12 border-4 border-white shadow-md"
                      >

                        <AvatarFallback className="bg-gradient-to-br from-[#1a4731] to-emerald-500 text-white font-bold">

                          {cl.name.charAt(0)}

                        </AvatarFallback>

                      </Avatar>

                    )
                  )}

                </div>

              </div>

              {/* PEDIDOS */}
              <div>

                <p className="text-[10px] uppercase tracking-[0.25em] font-black text-gray-400 mb-5">
                  Estado de laboratorio
                </p>

                <div className="space-y-5">

                  {data.pedidosRecientes?.map((pedido: any) => {

                    const colorMap: any = {
                      E: "bg-amber-400",
                      P: "bg-blue-400",
                      C: "bg-emerald-400",
                    };

                    return (

                      <div
                        key={pedido.id}
                        className="relative pl-6 border-l border-dashed border-emerald-100"
                      >

                        <div
                          className={`absolute -left-[5px] top-1 w-[10px] h-[10px] rounded-full ${colorMap[pedido.codigo_estado]}`}
                        />

                        <div className="group rounded-2xl p-4 bg-gray-50/60 hover:bg-white border border-transparent hover:border-emerald-100 hover:shadow-lg transition-all duration-300">

                          <div className="flex justify-between items-center mb-2">

                            <span className="text-[9px] font-black text-emerald-700 bg-emerald-100 px-2 py-1 rounded-md">
                              FOLIO #{pedido.id}
                            </span>

                            <span className="text-[9px] uppercase font-bold text-gray-400">
                              {pedido.estado}
                            </span>

                          </div>

                          <p className="text-sm font-black text-gray-800 group-hover:text-[#1a4731] transition-colors">
                            {pedido.paciente}
                          </p>

                          <div className="flex items-center gap-2 mt-2">

                            <Badge
                              variant="outline"
                              className="text-[9px]"
                            >
                              {pedido.producto}
                            </Badge>

                            <FileText
                              size={10}
                              className="text-gray-300"
                            />

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