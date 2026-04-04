import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CalendarDays, Loader2, ClipboardList, Clock, FileText } from "lucide-react";
import { getDashboardStats } from "@/services/dashboardService";

const DashboardHome = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getDashboardStats();
        setData(res);
      } catch (error) {
        console.error("Error al cargar estadísticas:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-emerald-600">
        <Loader2 className="w-10 h-10 animate-spin mb-4" />
        <p className="font-medium">Cargando tablero de Opti-Samuel...</p>
      </div>
    );
  }

  const stats = data?.stats || { citas: 0, nuevos: 0, pedidos: 0, recetas: 0 };

  return (
    <div
      className="min-h-screen p-8 space-y-8"
      style={{
        background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
      }}
    >
      {/* ================= CARDS SUPERIORES (4 COLUMNAS) ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Citas de Hoy", val: stats.citas, sub: "Por atender", color: "from-emerald-600 to-emerald-400", icon: "📅" },
          { label: "Pacientes", val: stats.nuevos, sub: "Registrados", color: "from-teal-600 to-emerald-500", icon: "👥" },
          { label: "Recetas", val: stats.recetas, sub: "Exámenes realizados", color: "from-blue-600 to-cyan-500", icon: "👁️" },
          { label: "Pedidos", val: stats.pedidos, sub: "En espera", color: "from-green-700 to-emerald-600", icon: "📦" },
        ].map((item, idx) => (
          <Card key={idx} className={`rounded-3xl shadow-xl border-0 bg-gradient-to-r ${item.color} text-white transform hover:scale-[1.02] transition-transform duration-300`}>
            <CardContent className="flex justify-between items-center p-6">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-80">{item.label}</p>
                <p className="text-3xl font-black mt-1">{item.val}</p>
                <p className="text-[9px] opacity-70 mt-1 font-medium">{item.sub}</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-lg flex items-center justify-center border border-white/30 shadow-inner text-xl">
                 {item.icon}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* COLUMNA IZQUIERDA: CALENDARIO Y AGENDA */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-[2rem] shadow-sm border border-emerald-100/50 bg-white/80 backdrop-blur-md">
            <CardHeader className="flex flex-row items-center gap-3 border-b border-emerald-50 pb-4">
              <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                <CalendarDays size={20} />
              </div>
              <CardTitle className="text-xl font-bold text-gray-800 capitalize">
                {new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' }).format(new Date())}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-7 gap-4 text-center">
                {["Dom","Lun","Mar","Mie","Jue","Vie","Sab"].map((d)=>(
                  <div key={d} className="text-[10px] font-black text-emerald-800/40 uppercase tracking-tighter">{d}</div>
                ))}
                {Array.from({ length: 31 }).map((_, i) => {
                    const esHoy = i + 1 === new Date().getDate();
                    return (
                        <div key={i} className={`py-3 rounded-2xl text-sm transition-all duration-300 ${esHoy ? "bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-200 scale-110" : "text-gray-500 hover:bg-emerald-50"}`}>
                            {i + 1}
                        </div>
                    )
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] shadow-sm border border-emerald-100/50 bg-white">
            <CardHeader className="pb-2"><CardTitle className="text-gray-800 text-lg">Agenda del día</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {data.citasHoy?.length > 0 ? (
                data.citasHoy.map((cita: any, i: number) => (
                    <div key={i} className="group p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100/30 flex justify-between items-center hover:bg-white hover:shadow-md transition-all duration-300">
                      <div className="flex gap-4 items-center">
                        <div className="h-10 w-1 bg-emerald-400 rounded-full group-hover:h-6 transition-all" />
                        <div>
                          <p className="font-bold text-gray-800">{cita.name}</p>
                          <p className="text-xs text-gray-500 font-medium italic">{cita.type}</p>
                        </div>
                      </div>
                      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-0 px-4 py-1 rounded-full text-xs font-bold">
                        <Clock size={12} className="mr-2" /> {cita.time}
                      </Badge>
                    </div>
                ))
              ) : (
                <div className="text-center py-10">
                    <p className="text-sm text-gray-400 italic font-medium">No hay citas para mostrar hoy.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* COLUMNA DERECHA: ACTIVIDAD Y SEGUIMIENTO */}
        <div className="space-y-6">
          <Card className="rounded-[2rem] shadow-xl border-0 bg-white overflow-hidden">
            <div className="bg-emerald-600 p-6 text-white">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <ClipboardList size={20} /> Control de Óptica
                </CardTitle>
                <p className="text-[10px] opacity-80 mt-1 uppercase tracking-widest font-bold">Resumen de movimientos</p>
            </div>
            
            <CardContent className="p-6 space-y-8 mt-2">
              {/* ÚLTIMOS CLIENTES */}
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Nuevos Ingresos</p>
                <div className="flex -space-x-3">
                  {data.clientesRecientes?.map((cl: any, i: number) => (
                      <Avatar key={i} className="h-12 w-12 border-4 border-white shadow-sm hover:-translate-y-1 transition-transform cursor-pointer">
                        <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-teal-500 text-white font-bold text-sm">
                          {cl.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                  ))}
                  <div className="h-12 w-12 rounded-full border-4 border-white bg-gray-50 flex items-center justify-center text-xs text-gray-400 font-bold shadow-sm">
                    +{stats.nuevos > 3 ? stats.nuevos - 3 : 0}
                  </div>
                </div>
              </div>

              {/* SEGUIMIENTO DE PEDIDOS (LÍNEA DE TIEMPO) */}
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-5">Estado de Laboratorio</p>
                <div className="space-y-6">
                  {data.pedidosRecientes?.map((pedido: any) => {
                    const colorMap: any = {
                      'E': 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]', 
                      'P': 'bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]',  
                      'C': 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]' 
                    };
                    return (
                      <div key={pedido.id} className="relative pl-6 border-l border-dashed border-emerald-100">
                        {/* Indicador de Punto de Estado */}
                        <div className={`absolute -left-[5px] top-1 w-[10px] h-[10px] rounded-full ring-2 ring-white ${colorMap[pedido.codigo_estado] || 'bg-gray-300'}`} />
                        
                        <div className="group bg-gray-50/70 rounded-2xl p-4 border border-transparent hover:border-emerald-200 hover:bg-white hover:shadow-xl hover:shadow-emerald-50/50 transition-all duration-300">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-[9px] font-black text-emerald-700 bg-emerald-100/50 px-2 py-0.5 rounded-md">
                              FOLIO #{pedido.id}
                            </span>
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">
                              {pedido.estado}
                            </span>
                          </div>
                          
                          <p className="text-sm font-black text-gray-800 group-hover:text-emerald-700 transition-colors">
                            {pedido.paciente}
                          </p>
                          
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-[9px] py-0 px-2 text-gray-500 border-gray-200 font-medium">
                              {pedido.producto}
                            </Badge>
                            <FileText size={10} className="text-gray-300" />
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