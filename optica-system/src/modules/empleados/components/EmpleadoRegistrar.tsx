import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { registrarEmpleados, type Empleado, type Rol } from "@/services/empleadoService"; 

export default function EmpleadoRegistrar() {
  const [empleado, setEmpleado] = useState<Empleado>({
    username: "",
    password: "",
    first_name: "",
    last_name: "",
    email: "",
    rol: "recepcionista",
    is_active: true,
  });

  const [error, setError] = useState<any>("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // --- VALIDACIONES DE ENTRADA ---
  const handleChange = (field: keyof Empleado, value: string) => {
    let sanitizedValue = value;

    // 1. Solo letras para Nombre y Apellido (máximo 30 como en el backend)
    if (field === "first_name" || field === "last_name") {
      sanitizedValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
      if (sanitizedValue.length > 30) return;
    }

    // 2. Username: Sincronizado con el Serializer (máximo 20)
    if (field === "username") {
      // Quitamos espacios y caracteres especiales no permitidos, pasamos a minúsculas
      sanitizedValue = value.replace(/[^a-zA-Z0-9@./+/-/_]/g, "").toLowerCase();
      if (sanitizedValue.length > 20) return;
    }

    setEmpleado((prev) => ({ ...prev, [field]: sanitizedValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones previas al envío (Sincronía con el Backend)
    if (empleado.username.length < 4) {
      setError("El nombre de usuario debe tener al menos 4 caracteres.");
      return;
    }

    if (!empleado.password || empleado.password.length < 4) {
      setError("La contraseña es obligatoria y debe tener al menos 4 caracteres.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      await registrarEmpleados(empleado);
      setMessage("¡Empleado registrado exitosamente en Opti-Samuel!");
      
      // Resetear formulario
      setEmpleado({
        username: "",
        password: "",
        first_name: "",
        last_name: "",
        email: "",
        rol: "recepcionista",
        is_active: true,
      });

    } catch (err: any) {
      // Aquí se capturan errores como "username ya existe" desde Django
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10">
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-4xl mx-auto border border-gray-100">
        <h2 className="text-3xl font-black text-[#1a4731] mb-8 flex items-center gap-3">
           Registrar Personal
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
          
          <Input
            value={empleado.first_name}
            onChange={(e) => handleChange("first_name", e.target.value)}
            placeholder="Nombre"
            required
            className="capitalize"
          />
          <Input
            value={empleado.last_name}
            onChange={(e) => handleChange("last_name", e.target.value)}
            placeholder="Apellido"
            required
            className="capitalize"
          />

          <Input
            value={empleado.username}
            onChange={(e) => handleChange("username", e.target.value)}
            placeholder="Usuario (mín. 4 caracteres)"
            required
          />
          <Input
            type="password"
            value={empleado.password}
            onChange={(e) => handleChange("password", e.target.value)}
            placeholder="Contraseña"
            required
          />

          <Input
            type="email"
            value={empleado.email}
            onChange={(e) => handleChange("email", e.target.value.toLowerCase())}
            placeholder="Correo Electrónico"
            required
          />

          <select
            value={empleado.rol}
            onChange={(e) => setEmpleado({ ...empleado, rol: e.target.value as Rol })}
            className="p-3 rounded-xl border bg-white outline-none focus:ring-2 focus:ring-green-500 w-full text-gray-700 font-medium transition-all cursor-pointer"
          >
            <option value="recepcionista">Recepcionista</option>
            <option value="optometrista">Optometrista</option>
          </select>

          {/* Bloque de Errores Dinámicos */}
          {error && (
            <div className="text-red-600 col-span-2 text-sm bg-red-50 p-4 rounded-xl border border-red-200 animate-in fade-in slide-in-from-top-1">
               {typeof error === 'object' ? (
                 Object.entries(error).map(([key, val]: any) => (
                   <p key={key} className="flex gap-2">
                     <span className="font-bold uppercase">{key}:</span> 
                     <span>{Array.isArray(val) ? val[0] : val}</span>
                   </p>
                 ))
               ) : (
                 <p>{error}</p>
               )}
            </div>
          )}

          {message && (
            <div className="text-green-700 col-span-2 bg-green-50 p-4 rounded-xl border border-green-200 font-medium flex items-center gap-2">
              <span className="text-xl">✓</span> {message}
            </div>
          )}

          <Button 
            type="submit" 
            disabled={loading}
            className="mt-4 bg-[#1a4731] hover:bg-[#123122] col-span-2 h-14 text-lg font-bold shadow-lg transition-all active:scale-95"
          >
            {loading ? "Procesando registro..." : "Confirmar Registro"}
          </Button>
        </form>
      </div>
    </div>
  );
}