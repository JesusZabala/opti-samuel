import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
    <div className="p-10">
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-4xl mx-auto border border-gray-100">
        <h2 className="text-3xl font-black text-[#1a4731] mb-8 flex items-center gap-3">
           Registrar Cliente
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
          <Input
            value={cliente.nombre}
            onChange={(e) => handleChange("nombre", e.target.value)}
            placeholder="Nombre"
            required
            className="capitalize" // Estética: se ve mejor la primera en mayúscula
          />
          <Input
            value={cliente.apellido}
            onChange={(e) => handleChange("apellido", e.target.value)}
            placeholder="Apellido"
            required
            className="capitalize"
          />

          <div className="flex gap-2">
            <select
              value={cliente.tipo_cliente}
              onChange={(e) => handleChange("tipo_cliente", e.target.value)}
              className="p-3 rounded-xl border bg-white outline-none focus:ring-2 focus:ring-green-500 font-bold text-gray-700"
            >
              <option value="V">V</option>
              <option value="E">E</option>
              <option value="J">J</option>
            </select>
            <Input
              value={cliente.identificacion}
              onChange={(e) => handleChange("identificacion", e.target.value)}
              placeholder="Cédula / Identificación"
              required
              inputMode="numeric" // Muestra teclado numérico en móviles
            />
          </div>

          <Input
            value={cliente.telefono}
            onChange={(e) => handleChange("telefono", e.target.value)}
            placeholder="Teléfono (ej: 04121234567)"
            required
            type="tel"
          />

          <Input
            type="email"
            value={cliente.email}
            onChange={(e) => handleChange("email", e.target.value.toLowerCase())} // El correo siempre en minúsculas
            placeholder="Correo Electrónico"
            required
            maxLength={60}
          />

          <select
            value={cliente.genero}
            onChange={(e) => handleChange("genero", e.target.value)}
            className="p-3 rounded-xl border bg-white outline-none focus:ring-2 focus:ring-green-500 w-full text-gray-600"
          >
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
          </select>

          {/* Errores detallados */}
          {error && (
            <div className="text-red-600 col-span-2 text-sm bg-red-50 p-4 rounded-xl border border-red-200 animate-pulse">
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
            {loading ? "Registrando en Opti-Samuel..." : "Guardar Cliente"}
          </Button>
        </form>
      </div>
    </div>
  );
}