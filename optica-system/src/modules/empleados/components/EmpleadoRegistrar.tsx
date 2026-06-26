
// import { useState } from "react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Eye, EyeOff } from "lucide-react"; // Importación de los íconos para la contraseña
// import { registrarEmpleados, type Empleado, type Rol } from "@/services/empleadoService"; 

// export default function EmpleadoRegistrar() {
//   const [empleado, setEmpleado] = useState<Empleado>({
//     username: "",
//     password: "",
//     first_name: "",
//     last_name: "",
//     email: "",
//     rol: "recepcionista",
//     is_active: true,
//   });

//   const [error, setError] = useState<any>("");
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false); // Estado para alternar visibilidad

//   // --- VALIDACIONES DE ENTRADA ---
//   const handleChange = (field: keyof Empleado, value: string) => {
//     let sanitizedValue = value;

//     // 1. Solo letras para Nombre y Apellido (máximo 30 como en el backend)
//     if (field === "first_name" || field === "last_name") {
//       sanitizedValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
//       if (sanitizedValue.length > 30) return;
//     }

//     // 2. Username: Sincronizado con el Serializer (máximo 20)
//     if (field === "username") {
//       sanitizedValue = value.replace(/[^a-zA-Z0-9@./+/-/_]/g, "").toLowerCase();
//       if (sanitizedValue.length > 20) return;
//     }

//     setEmpleado((prev) => ({ ...prev, [field]: sanitizedValue }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (empleado.username.length < 4) {
//       setError("El nombre de usuario debe tener al menos 4 caracteres.");
//       return;
//     }

//     if (!empleado.password || empleado.password.length < 4) {
//       setError("La contraseña es obligatoria y debe tener al menos 4 caracteres.");
//       return;
//     }

//     setLoading(true);
//     setError("");
//     setMessage("");

//     try {
//       await registrarEmpleados(empleado);
//       setMessage("¡Empleado registrado exitosamente en Opti-Samuel!");
      
//       setEmpleado({
//         username: "",
//         password: "",
//         first_name: "",
//         last_name: "",
//         email: "",
//         rol: "recepcionista",
//         is_active: true,
//       });
//       setShowPassword(false); // Resetear visibilidad al limpiar

//     } catch (err: any) {
//       setError(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-10 dark:bg-[#0a0f0a]">
//       <div className="bg-white dark:bg-[#1a2a20] rounded-3xl shadow-xl p-10 max-w-4xl mx-auto border border-gray-100 dark:border-white/10">
//         <h2 className="text-3xl font-black text-[#1a4731] dark:text-emerald-100 mb-8 flex items-center gap-3">
//            Registrar Personal
//         </h2>

//         <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
          
//           <Input
//             value={empleado.first_name}
//             onChange={(e) => handleChange("first_name", e.target.value)}
//             placeholder="Nombre"
//             required
//             className="capitalize"
//           />
//           <Input
//             value={empleado.last_name}
//             onChange={(e) => handleChange("last_name", e.target.value)}
//             placeholder="Apellido"
//             required
//             className="capitalize"
//           />

//           <Input
//             value={empleado.username}
//             onChange={(e) => handleChange("username", e.target.value)}
//             placeholder="Usuario (mín. 4 caracteres)"
//             required
//           />
          
//           {/* Campo Contraseña con botón de visibilidad integrado */}
//           <div className="relative flex items-center">
//             <Input
//               type={showPassword ? "text" : "password"}
//               value={empleado.password}
//               onChange={(e) => handleChange("password", e.target.value)}
//               placeholder="Contraseña"
//               required
//               className="pr-12" // Espacio a la derecha para que el texto no se monte en el ícono
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute right-4 text-gray-400 hover:text-gray-600 dark:hover:text-emerald-400 transition-colors focus:outline-none select-none"
//             >
//               {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//             </button>
//           </div>

//           <Input
//             type="email"
//             value={empleado.email}
//             onChange={(e) => handleChange("email", e.target.value.toLowerCase())}
//             placeholder="Correo Electrónico"
//             required
//           />

//           <select
//             value={empleado.rol}
//             onChange={(e) => setEmpleado({ ...empleado, rol: e.target.value as Rol })}
//             className="p-3 rounded-xl border bg-white dark:bg-[#1a2a20] dark:border-gray-700 outline-none focus:ring-2 focus:ring-green-500 w-full text-gray-700 dark:text-gray-300 font-medium transition-all cursor-pointer"
//           >
//             <option value="recepcionista">Recepcionista</option>
//             <option value="optometrista">Optometrista</option>
//           </select>

//           {/* Bloque de Errores Dinámicos */}
//           {error && (
//             <div className="text-red-600 dark:text-red-400 col-span-2 text-sm bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-200 dark:border-red-800/30 animate-in fade-in slide-in-from-top-1">
//                {typeof error === 'object' ? (
//                  Object.entries(error).map(([key, val]: any) => (
//                    <p key={key} className="flex gap-2">
//                      <span className="font-bold uppercase">{key}:</span> 
//                      <span>{Array.isArray(val) ? val[0] : val}</span>
//                    </p>
//                  ))
//                ) : (
//                  <p>{error}</p>
//                )}
//             </div>
//           )}

//           {message && (
//             <div className="text-green-700 dark:text-emerald-300 col-span-2 bg-green-50 dark:bg-emerald-900/20 p-4 rounded-xl border border-green-200 dark:border-emerald-800/30 font-medium flex items-center gap-2">
//               <span className="text-xl">✓</span> {message}
//             </div>
//           )}

//           <Button 
//             type="submit" 
//             disabled={loading}
//             className="mt-4 bg-[#1a4731] hover:bg-[#123122] col-span-2 h-14 text-lg font-bold shadow-lg transition-all active:scale-95"
//           >
//             {loading ? "Procesando registro..." : "Confirmar Registro"}
//           </Button>
//         </form>
//       </div>
//     </div>
//   );
// }


import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Check, XCircle, ShieldCheck } from "lucide-react";
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
  const [showPassword, setShowPassword] = useState(false);

  /* ---------------- ESTADOS DE VALIDACIÓN DE CONTRASEÑA ---------------- */
  const [validaciones, setValidaciones] = useState({
    longitud: false,
    numero: false,
    mayuscula: false,
    especial: false,
  });
  const [esPasswordSegura, setEsPasswordSegura] = useState(false);

  // Escuchar los cambios de empleado.password de forma segura
  useEffect(() => {
    const pass = empleado.password || ""; // Evita problemas si llega a ser undefined
    const tieneLongitud = pass.length >= 8;
    const tieneNumero = /\d/.test(pass);
    const tieneMayuscula = /[A-Z]/.test(pass);
    const tieneEspecial = /[!@#$%^&*(),.?":{}|<>_]/.test(pass);

    setValidaciones({
      longitud: tieneLongitud,
      numero: tieneNumero,
      mayuscula: tieneMayuscula,
      especial: tieneEspecial,
    });

    setEsPasswordSegura(tieneLongitud && tieneNumero && tieneMayuscula && tieneEspecial);
  }, [empleado.password]);

  // --- VALIDACIONES DE ENTRADA ---
  const handleChange = (field: keyof Empleado, value: string) => {
    let sanitizedValue = value;

    // 1. Solo letras para Nombre y Apellido
    if (field === "first_name" || field === "last_name") {
      sanitizedValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
      if (sanitizedValue.length > 30) return;
    }

    // 2. Username
    if (field === "username") {
      sanitizedValue = value.replace(/[^a-zA-Z0-9@./+/-/_]/g, "").toLowerCase();
      if (sanitizedValue.length > 20) return;
    }

    setEmpleado((prev) => ({ ...prev, [field]: sanitizedValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (empleado.username.length < 4) {
      setError("El nombre de usuario debe tener al menos 4 caracteres.");
      return;
    }

    if (!esPasswordSegura) {
      setError("La contraseña no cumple con los requisitos de seguridad.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      await registrarEmpleados(empleado);
      setMessage("¡Empleado registrado exitosamente en Opti-Samuel!");
      
      setEmpleado({
        username: "",
        password: "",
        first_name: "",
        last_name: "",
        email: "",
        rol: "recepcionista",
        is_active: true,
      });
      setShowPassword(false);

    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3 md:p-10 max-w-5xl mx-auto dark:bg-[#0a0f0a]">
      <div className="bg-white dark:bg-[#1a2a20] rounded-[2rem] md:rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden">

        {/* HEADER */}
        <div className="bg-[#1a4731] p-4 md:p-8 text-white flex flex-col md:flex-row md:justify-between md:items-center gap-3">
          <div>
            <h2 className="text-xl md:text-3xl font-black tracking-tight flex items-center gap-3">
              <ShieldCheck className="w-7 md:w-10 h-7 md:h-10 text-green-400" />
              Registrar Personal
            </h2>
            <p className="text-green-100/60 font-bold text-[10px] md:text-xs uppercase tracking-[0.3em] mt-1">Opti Samuel • 2026</p>
          </div>
        </div>

        <div className="p-4 md:p-10">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 dark:text-gray-300 uppercase tracking-widest ml-1">Nombre</label>
              <Input
                value={empleado.first_name}
                onChange={(e) => handleChange("first_name", e.target.value)}
                placeholder="Nombre"
                required
                className="capitalize h-12 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 dark:text-gray-300 uppercase tracking-widest ml-1">Apellido</label>
              <Input
                value={empleado.last_name}
                onChange={(e) => handleChange("last_name", e.target.value)}
                placeholder="Apellido"
                required
                className="capitalize h-12 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 dark:text-gray-300 uppercase tracking-widest ml-1">Usuario</label>
              <Input
                value={empleado.username}
                onChange={(e) => handleChange("username", e.target.value)}
                placeholder="Mín. 4 caracteres"
                required
                className="h-12 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 dark:text-gray-300 uppercase tracking-widest ml-1">Contraseña</label>
              <div className="relative w-full">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={empleado.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  placeholder="Contraseña segura"
                  required
                  className="pr-12 h-12 rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-emerald-400 transition-colors focus:outline-none select-none"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 dark:text-gray-300 uppercase tracking-widest ml-1">Correo Electrónico</label>
              <Input
                type="email"
                value={empleado.email}
                onChange={(e) => handleChange("email", e.target.value.toLowerCase())}
                placeholder="correo@ejemplo.com"
                required
                className="h-12 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 dark:text-gray-300 uppercase tracking-widest ml-1">Rol</label>
              <select
                value={empleado.rol}
                onChange={(e) => setEmpleado({ ...empleado, rol: e.target.value as Rol })}
                className="h-12 px-3 rounded-xl border bg-white dark:bg-[#0f1a14] dark:border-white/10 outline-none focus:ring-2 focus:ring-green-500 w-full text-gray-700 dark:text-gray-100 font-bold transition-all cursor-pointer"
              >
                <option value="recepcionista">Recepcionista</option>
                <option value="optometrista">Optometrista</option>
              </select>
            </div>

          {/* Panel de Requisitos */}
          {empleado.password && empleado.password.length > 0 && (
            <div className="bg-gray-50 dark:bg-black/20 p-4 rounded-xl space-y-2 border border-gray-100 dark:border-white/5 text-xs md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-2">
              <p className="text-gray-500 dark:text-green-200/60 font-bold uppercase tracking-wider text-[10px] col-span-2 mb-1">
                Requisitos de seguridad:
              </p>
              
              <div className="flex items-center gap-2">
                {validaciones.longitud ? <Check size={14} className="text-emerald-500" /> : <XCircle size={14} className="text-red-500" />}
                <span className={validaciones.longitud ? "text-emerald-600 dark:text-emerald-300" : "text-gray-500 dark:text-red-200/70"}>Mínimo 8 caracteres</span>
              </div>

              <div className="flex items-center gap-2">
                {validaciones.mayuscula ? <Check size={14} className="text-emerald-500" /> : <XCircle size={14} className="text-red-500" />}
                <span className={validaciones.mayuscula ? "text-emerald-600 dark:text-emerald-300" : "text-gray-500 dark:text-red-200/70"}>Al menos una mayúscula</span>
              </div>

              <div className="flex items-center gap-2">
                {validaciones.numero ? <Check size={14} className="text-emerald-500" /> : <XCircle size={14} className="text-red-500" />}
                <span className={validaciones.numero ? "text-emerald-600 dark:text-emerald-300" : "text-gray-500 dark:text-red-200/70"}>Al menos un número</span>
              </div>

              <div className="flex items-center gap-2">
                {validaciones.especial ? <Check size={14} className="text-emerald-500" /> : <XCircle size={14} className="text-red-500" />}
                <span className={validaciones.especial ? "text-emerald-600 dark:text-emerald-300" : "text-gray-500 dark:text-red-200/70"}>Un carácter especial (!@#$*)</span>
              </div>
            </div>
          )}

          {/* Bloque de Errores Dinámicos */}
          {error && (
            <div className="text-red-600 dark:text-red-400 md:col-span-2 text-sm bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-200 dark:border-red-800/30 animate-in fade-in slide-in-from-top-1">
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
            <div className="text-green-700 dark:text-emerald-300 md:col-span-2 bg-green-50 dark:bg-emerald-900/20 p-4 rounded-xl border border-green-200 dark:border-emerald-800/30 font-medium flex items-center gap-2">
              <span className="text-xl">✓</span> {message}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading || ((empleado.password || "").length > 0 && !esPasswordSegura)}
            className="mt-4 bg-[#1a4731] hover:bg-[#123122] md:col-span-2 h-14 text-lg font-black uppercase tracking-widest shadow-lg transition-all active:scale-95 disabled:opacity-50 rounded-2xl"
          >
            {loading ? "Procesando registro..." : "Confirmar Registro"}
          </Button>
          </form>
        </div>
      </div>
    </div>
  );
}