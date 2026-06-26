import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { registrarCliente, type Cliente } from "@/services/clienteService";

export default function ClienteRegistrar() {
  const [cliente, setCliente] = useState<Cliente>({
    nombre: "",
    apellido: "",
    identificacion: "", 
    telefono: "",
    email: "",          
    tipo_cliente: "V",   
    genero: "M",         
  });

  const [error, setError] = useState<any>("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // --- VALIDACIONES DE ENTRADA ---
  
  const handleChange = (field: keyof Cliente, value: string) => {
    let sanitizedValue = value;

    // 1. Solo letras para Nombre y Apellido
    if (field === "nombre" || field === "apellido") {
      sanitizedValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
      if(sanitizedValue.length > 20) return;
    }

    // 2. Solo números para Identificación
    if (field === "identificacion") {
      sanitizedValue = value.replace(/\D/g, "").slice(0,12); // Elimina todo lo que no sea número
    }

    // 3. Solo números y '+' para Teléfono
    if (field === "telefono") {
      sanitizedValue = value.replace(/[^0-9+]/g, "").slice(0, 15);
    }

    setCliente((prev) => ({ ...prev, [field]: sanitizedValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación extra antes de enviar: longitud mínima de cédula
    if (cliente.identificacion.length < 6) {
      setError("La identificación debe tener al menos 6 dígitos.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      await registrarCliente(cliente);
      setMessage("¡Cliente registrado exitosamente!");
      
      setCliente({ 
        nombre: "", 
        apellido: "", 
        identificacion: "", 
        telefono: "", 
        email: "", 
        tipo_cliente: "V", 
        genero: "M" 
      });

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
              <UserPlus className="w-7 md:w-10 h-7 md:h-10 text-green-400" />
              Registrar Cliente
            </h2>
            <p className="text-green-100/60 font-bold text-[10px] md:text-xs uppercase tracking-[0.3em] mt-1">Opti Samuel • 2026</p>
          </div>
        </div>

        <div className="p-4 md:p-10">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 dark:text-gray-300 uppercase tracking-widest ml-1">Nombre</label>
              <Input
                value={cliente.nombre}
                onChange={(e) => handleChange("nombre", e.target.value)}
                placeholder="Nombre"
                required
                className="capitalize h-12 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 dark:text-gray-300 uppercase tracking-widest ml-1">Apellido</label>
              <Input
                value={cliente.apellido}
                onChange={(e) => handleChange("apellido", e.target.value)}
                placeholder="Apellido"
                required
                className="capitalize h-12 rounded-xl"
              />
            </div>

            <div className="space-y-2 min-w-0">
              <label className="text-[10px] font-black text-gray-400 dark:text-gray-300 uppercase tracking-widest ml-1">Cédula / Identificación</label>
              <div className="flex gap-2 min-w-0">
                <select
                  value={cliente.tipo_cliente}
                  onChange={(e) => handleChange("tipo_cliente", e.target.value)}
                  className="h-12 px-3 rounded-xl border bg-white dark:bg-[#0f1a14] dark:border-white/10 outline-none focus:ring-2 focus:ring-green-500 font-bold text-gray-700 dark:text-gray-100 shrink-0"
                >
                  <option value="V">V</option>
                  <option value="E">E</option>
                  <option value="J">J</option>
                </select>
                <Input
                  value={cliente.identificacion}
                  onChange={(e) => handleChange("identificacion", e.target.value)}
                  placeholder="Número de identificación"
                  required
                  inputMode="numeric"
                  className="min-w-0 flex-1 h-12 rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 dark:text-gray-300 uppercase tracking-widest ml-1">Teléfono</label>
              <Input
                value={cliente.telefono}
                onChange={(e) => handleChange("telefono", e.target.value)}
                placeholder="04121234567"
                required
                type="tel"
                className="h-12 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 dark:text-gray-300 uppercase tracking-widest ml-1">Correo Electrónico</label>
              <Input
                type="email"
                value={cliente.email}
                onChange={(e) => handleChange("email", e.target.value.toLowerCase())}
                placeholder="correo@ejemplo.com"
                required
                maxLength={60}
                className="h-12 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 dark:text-gray-300 uppercase tracking-widest ml-1">Género</label>
              <select
                value={cliente.genero}
                onChange={(e) => handleChange("genero", e.target.value)}
                className="h-12 px-3 rounded-xl border bg-white dark:bg-[#0f1a14] dark:border-white/10 outline-none focus:ring-2 focus:ring-green-500 w-full text-gray-700 dark:text-gray-100 font-bold"
              >
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
              </select>
            </div>

            {/* Errores detallados */}
            {error && (
              <div className="text-red-600 dark:text-red-400 md:col-span-2 text-sm bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-200 dark:border-red-800/30 animate-pulse">
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
              disabled={loading}
              className="mt-4 bg-[#1a4731] hover:bg-[#123122] md:col-span-2 h-14 text-lg font-black uppercase tracking-widest shadow-lg transition-all active:scale-95 rounded-2xl"
            >
              {loading ? "Registrando en Opti-Samuel..." : "Guardar Cliente"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}