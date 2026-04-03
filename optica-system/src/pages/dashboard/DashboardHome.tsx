import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CalendarDays } from "lucide-react";

// Este es el componente principal del dashboard de inicio.
// Se muestra cuando el usuario hace clic en "Inicio" en el sidebar.
// Es único para todos los roles (administrador, recepcionista, optometrista).
// No depende de roles específicos, muestra información general del sistema.

type Stats = {
  citas: number; // Número de citas programadas para hoy
  pedidos: number; // Número de pedidos pendientes
  nuevos: number; // Número de nuevos registros (clientes o pacientes)
  recetas: number; // Número de recetas emitidas
};

// Componente principal del dashboard
const DashboardHome = () => {

  /* ================= DATOS DE TABLERO GLOBAL ================= */

  // TODO: aquí iría una llamada a la base de datos o a la API
  // por ejemplo: `const { data, loading, error } = useDashboardStats(userId)`
  // Actualmente se usan valores de prueba para mantener funcionando la UI.
  // Estos datos son "hardcodeados" (escritos directamente en el código) para desarrollo.
  // En producción, se reemplazarán con consultas reales a la BD.
  const data: Stats = {
    citas: 8, // Número de citas para hoy (viene de tabla 'citas' filtrada por fecha)
    nuevos: 3, // Nuevos clientes registrados hoy (viene de tabla 'clientes' con fecha_registro)
    recetas: 12, // Recetas emitidas hoy (viene de tabla 'recetas' con fecha_emision)
    pedidos: 5, // Pedidos pendientes (viene de tabla 'pedidos' con estado 'pendiente')
  };

  // Calcula el valor más alto entre nuevos registros y recetas para mostrar en la segunda caja
  const secondaryValue = Math.max(data.nuevos, data.recetas);

  // Datos de prueba para pedidos recientes
  // TODO: reemplazar con consulta a BD: SELECT id, nombre, estado FROM pedidos ORDER BY fecha_creacion DESC LIMIT 3
  const pedidos = [
    { id: 1023, name: "Lentes de Contacto", status: "En Proceso" },
    { id: 1022, name: "Gafas Graduadas", status: "Pendiente" },
    { id: 1018, name: "Lentes de Sol", status: "Completado" },
  ];

  // Datos de prueba para clientes recientes
  // TODO: reemplazar con consulta a BD: SELECT nombre FROM clientes ORDER BY fecha_registro DESC LIMIT 3
  const clientesRecientes = [
    { name: "Ana Martínez" },
    { name: "Carlos López" },
    { name: "Laura Gómez" },
  ];

  // Datos de prueba para citas de hoy
  // TODO: reemplazar con consulta a BD: SELECT hora, cliente.nombre, tipo_cita FROM citas JOIN clientes ON citas.cliente_id = clientes.id WHERE fecha = CURDATE()
  const citasHoy = [
    { time: "10:00 AM", name: "Ana Martínez", type: "Consulta Visual" },
    { time: "11:30 AM", name: "Carlos López", type: "Examen de Vista" },
    { time: "03:00 PM", name: "Laura Gómez", type: "Control Lentes" },
  ];

  return (
    // Contenedor principal con fondo degradado verde
    <div
      className="min-h-screen p-8 space-y-8"
      style={{
          background:
            "linear-gradient(135deg, #a7f3d0 0%, #d1fae5 40%, #ecfdf5 100%)",
        }}
    >
      {/* ================= CAJAS SUPERIORES ================= */}
      {/* Tres tarjetas con estadísticas principales */}
      <div className="grid md:grid-cols-3 gap-6">

        {/* Primera caja: Citas de hoy */}
        <Card className="rounded-2xl shadow-lg border-0 bg-gradient-to-r from-emerald-600 to-emerald-400 text-white">
          <CardContent className="flex justify-between items-center p-6">
            <div>
              <p className="text-sm font-semibold opacity-90">
                Citas de Hoy
              </p>
              <p className="text-xs opacity-80 mt-1">
                Por atender
              </p>
            </div>

            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-lg font-bold">
              {data.citas}
            </div>
          </CardContent>
        </Card>

        {/* Segunda caja: Indicadores generales (nuevos registros o recetas) */}
        <Card className="rounded-2xl shadow-lg border-0 bg-gradient-to-r from-teal-600 to-emerald-500 text-white">
          <CardContent className="flex justify-between items-center p-6">
            <div>
              <p className="text-sm font-semibold opacity-90">
                Nuevos Registros
              </p>
              <p className="text-xs opacity-80 mt-1">
                Contenido reciente para todos los roles
              </p>
            </div>

            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-lg font-bold">
              {secondaryValue}
            </div>
          </CardContent>
        </Card>

        {/* Tercera caja: Pedidos pendientes */}
        <Card className="rounded-2xl shadow-lg border-0 bg-gradient-to-r from-green-700 to-emerald-600 text-white">
          <CardContent className="flex justify-between items-center p-6">
            <div>
              <p className="text-sm font-semibold opacity-90">
                Pedidos Pendientes
              </p>
              <p className="text-xs opacity-80 mt-1">
                En proceso
              </p>
            </div>

            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-lg font-bold">
              {data.pedidos}
            </div>
          </CardContent>
        </Card>

      </div>

      {/* ================= FILA CENTRAL ================= */}
      {/* Layout de dos columnas en desktop: izquierda (calendario + citas), derecha (actividad reciente) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        {/* CALENDARIO + CITAS PEGADAS */}
        {/* Contenedor que agrupa calendario y citas en la columna izquierda */}
        <div className="lg:col-span-2 space-y-4">
          {/* Calendario del mes actual */}
          <Card className="rounded-2xl shadow-md border border-emerald-100 bg-white h-fit">
            <CardHeader className="flex flex-row items-center gap-2">
              <CalendarDays className="text-emerald-600" size={18} />
              <CardTitle className="text-lg font-semibold text-gray-700">
                Marzo 2026
              </CardTitle>
            </CardHeader>

            <CardContent>
              {/* Grid de 7 columnas para los días de la semana */}
              <div className="grid grid-cols-7 gap-3 text-center text-sm text-gray-500">

                {/* Encabezados de días de la semana */}
                {["Dom","Lun","Mar","Mie","Jue","Vie","Sab"].map((day)=>(
                  <div key={day} className="font-semibold text-gray-400">
                    {day}
                  </div>
                ))}

                {/* Días del mes (31 días para marzo) */}
                {Array.from({ length: 31 }).map((_, i) => (
                  <div
                    key={i}
                    className={`p-2 rounded-xl cursor-pointer transition ${
                      i === 1
                        ? "bg-emerald-500 text-white font-semibold shadow-md" // Día actual resaltado
                        : "bg-emerald-50 hover:bg-emerald-100" // Días normales
                    }`}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Lista de citas para hoy */}
          <Card className="rounded-2xl shadow-md border border-emerald-100 bg-white">
            <CardHeader>
              <CardTitle>Hoy: Citas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* TODO: consultar la tabla de citas con fecha actual (por ejemplo API /citas/hoy) */}
              {citasHoy.map((cita, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium text-sm">
                      {cita.name} {/* Nombre del cliente */}
                    </p>
                    <p className="text-xs text-gray-500">
                      {cita.type} {/* Tipo de cita */}
                    </p>
                  </div>
                  <Badge className="bg-emerald-600 text-white border-0">
                    {cita.time} {/* Hora de la cita */}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* PANEL DERECHO */}
        {/* Actividad reciente: clientes y pedidos */}
        <Card className="rounded-2xl shadow-md border border-emerald-100 bg-white h-fit hover:shadow-lg transition">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-700">
              Actividad Reciente
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Últimos clientes registrados */}
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-2">Últimos clientes</p>
              {clientesRecientes.map((cliente, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 transition"
                >
                  <Avatar>
                    <AvatarFallback>
                      {cliente.name.charAt(0)} {/* Inicial del nombre */}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-sm font-medium text-gray-700">
                    {cliente.name} {/* Nombre completo del cliente */}
                  </p>
                </div>
              ))}
            </div>

            {/* Pedidos recientes */}
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-2">Pedidos recientes</p>
              {pedidos.map((pedido) => (
                <div
                  key={pedido.id}
                  className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 transition"
                >
                  <p className="font-medium text-gray-700">
                    Pedido #{pedido.id} {/* ID del pedido */}
                  </p>
                  <p className="text-xs text-gray-500">
                    {pedido.name} {/* Nombre del producto */}
                  </p>
                  <Badge className="mt-2 bg-emerald-600 text-white border-0">
                    {pedido.status} {/* Estado del pedido */}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default DashboardHome;