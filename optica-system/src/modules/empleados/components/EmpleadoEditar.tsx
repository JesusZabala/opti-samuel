import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { consultarEmpleados, editarEmpleados, type Empleado } from "@/services/empleadoService"; 

export default function EmpleadoEditar() {
  /* -------- ESTADOS -------- */
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [editando, setEditando] = useState<Empleado | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>("");
  const [success, setSuccess] = useState("");

  /* -------- CARGAR LISTA -------- */
  const cargarEmpleados = async () => {
    try {
      setLoading(true);
      const data = await consultarEmpleados();
      setEmpleados(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Error al conectar con el servidor de Opti-Samuel.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarEmpleados();
  }, []);

  /* -------- FILTRADO SEGURO (Buscador) -------- */
  const empleadosFiltrados = (empleados || []).filter((e) => {
    const term = busqueda.toLowerCase();
    return (
      (e.first_name?.toLowerCase() || "").includes(term) ||
      (e.last_name?.toLowerCase() || "").includes(term) ||
      (e.username?.toLowerCase() || "").includes(term)
    );
  });

  /* -------- VALIDACIONES EN TIEMPO REAL -------- */
  const handleEditChange = (field: keyof Empleado, value: string) => {
    if (!editando) return;

    let sanitizedValue = value;

    // 1. Solo letras para nombres y apellidos (Máx 40)
    if (field === "first_name" || field === "last_name") {
      sanitizedValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
      if (sanitizedValue.length > 40) return;
    }

    // 2. Email en minúsculas (Máx 60)
    if (field === "email") {
      sanitizedValue = value.toLowerCase().slice(0, 60);
    }

    setEditando({ ...editando, [field]: sanitizedValue });
  };

  /* -------- ACCIÓN DE ACTUALIZAR (Ajustada a tu Servicio) -------- */
const handleUpdate = async () => {
  if (!editando?.id) return;

  if (!editando.first_name || !editando.last_name || !editando.email) {
    setError("Nombre, Apellido y Email son obligatorios.");
    return;
  }

  try {
    setError("");
    setSuccess("Sincronizando cambios...");

    // Creamos un ÚNICO objeto que contenga el ID y los campos a editar
    // Esto es lo que tu servicio recibe como 'datos: Empleado'
    const empleadoActualizado: Empleado = {
      ...editando, // Mantiene el ID y el resto de campos
      first_name: editando.first_name,
      last_name: editando.last_name,
      email: editando.email,
      rol: editando.rol,
      is_active: editando.is_active
    };

    // LLAMADA AL SERVICIO: Pasamos un solo parámetro
    await editarEmpleados(empleadoActualizado);

    setSuccess("¡Datos del personal actualizados!");
    
    setTimeout(async () => {
      setEditando(null); 
      setSuccess("");
      await cargarEmpleados(); 
    }, 1500);

  } catch (err: any) {
    setSuccess("");
    // Manejo de errores flexible por si vienen de Django o son un string
    const errorMsg = typeof err === 'object' 
      ? Object.values(err).flat().join(" ") 
      : err;
    setError(errorMsg || "No se pudo actualizar el registro."); 
  }
};

  if (loading) return <div className="p-10 text-center font-black text-[#1a4731] animate-pulse">Consultando nómina...</div>;

  return (
    <div className="p-10">
      <div className="bg-white p-10 rounded-3xl shadow-xl min-h-[450px] border border-gray-100">
        <h2 className="text-3xl font-black text-[#1a4731] mb-8">
          {editando ? `Editar Perfil: @${editando.username}` : "Gestión de Personal"}
        </h2>

        {/* NOTIFICACIONES */}
        {success && <div className="mb-6 text-green-700 font-bold bg-green-50 p-4 rounded-xl border border-green-200 flex items-center gap-2 animate-bounce"><span>✓</span> {success}</div>}
        {error && <div className="mb-6 text-red-600 bg-red-50 p-4 rounded-xl border border-red-200 text-sm font-medium">{typeof error === 'object' ? "Error: Verifica los campos ingresados." : error}</div>}

        {/* VISTA 1: BUSCADOR Y LISTA */}
        {!editando ? (
          <div className="animate-in fade-in duration-500">
            <div className="relative mb-8">
                <Input 
                  placeholder="Buscar empleado por nombre o usuario..." 
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="p-7 rounded-2xl border-gray-200 shadow-sm focus:ring-2 focus:ring-green-600 pl-12 text-lg"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">🔍</span>
            </div>

            <div className="grid gap-4">
              {empleadosFiltrados.map((emp) => (
                <div key={emp.id} className="p-5 border rounded-2xl flex justify-between items-center hover:bg-gray-50 transition-all border-gray-100 shadow-sm group">
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${emp.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
                    <div>
                      <p className="font-bold text-[#1a4731] text-lg capitalize">{emp.first_name} {emp.last_name}</p>
                      <p className="text-sm text-gray-400 font-mono">@{emp.username} • {emp.rol}</p>
                    </div>
                  </div>
                  <Button onClick={() => setEditando({ ...emp })} className="bg-[#1a4731] hover:bg-[#123122] rounded-xl px-8 h-12 transition-transform active:scale-95">
                    Modificar
                  </Button>
                </div>
              ))}
              {empleadosFiltrados.length === 0 && (
                <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-3xl">
                    <p className="text-gray-400">No se encontraron empleados con ese criterio.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* VISTA 2: FORMULARIO DE EDICIÓN */
          <div className="animate-in slide-in-from-right-5 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* NOMBRES */}
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1">Nombre</label>
                <Input 
                  value={editando.first_name || ""} 
                  onChange={(e) => handleEditChange("first_name", e.target.value)}
                  className="h-12 rounded-xl capitalize"
                />
              </div>

              {/* APELLIDOS */}
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1">Apellido</label>
                <Input 
                  value={editando.last_name || ""} 
                  onChange={(e) => handleEditChange("last_name", e.target.value)}
                  className="h-12 rounded-xl capitalize"
                />
              </div>

              {/* EMAIL */}
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1">Correo Electrónico</label>
                <Input 
                  type="email"
                  value={editando.email || ""} 
                  onChange={(e) => handleEditChange("email", e.target.value)}
                  className="h-12 rounded-xl"
                />
              </div>

              {/* ROL / CARGO */}
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1">Cargo asignado</label>
                <select
                  value={editando.rol}
                  onChange={(e) => setEditando({...editando, rol: e.target.value as any})}
                  className="w-full h-12 rounded-xl border border-gray-200 px-4 text-sm focus:ring-2 focus:ring-green-600 outline-none"
                >
                  <option value="recepcionista">Recepcionista</option>
                  <option value="optometrista">Optometrista</option>
                </select>
              </div>

              {/* ESTADO DE CUENTA */}
              <div className="md:col-span-2 flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <input 
                  type="checkbox"
                  id="active"
                  checked={editando.is_active}
                  onChange={(e) => setEditando({...editando, is_active: e.target.checked})}
                  className="w-5 h-5 accent-green-600"
                />
                <label htmlFor="active" className="text-sm font-bold text-gray-700 cursor-pointer">
                  Cuenta activa (Permitir acceso al sistema)
                </label>
              </div>
            </div>

            {/* BOTONES DE ACCIÓN */}
            <div className="flex flex-col md:flex-row gap-4 mt-12">
              <Button onClick={handleUpdate} className="bg-[#1a4731] hover:bg-[#123122] flex-1 h-14 text-lg font-bold shadow-lg shadow-green-900/10">
                Guardar Cambios
              </Button>
              <Button variant="outline" onClick={() => setEditando(null)} className="flex-1 h-14 text-lg font-bold border-gray-300 hover:bg-gray-50">
                Volver al listado
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}