import ClienteRegistrar from "@modules/clientes/components/ClienteRegistrar";
import ClienteConsultar from "@modules/clientes/components/ClienteConsultar";

export default function GestionClientesPage() {
  return (
    <div className="p-4 md:p-8">
      {/* Encabezado con el estilo de Opti Samuel */}
      <div className="mb-8">
        <h1 className="text-xl md:text-3xl font-black text-[#1a4731] uppercase tracking-tight">
          Gestión de Clientes
        </h1>
        <p className="text-gray-500 mt-1">
          Registro y consulta de base de datos de pacientes.
        </p>
      </div>

      <div className="space-y-12">
        {/* Sección de Registro */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="w-2 h-8 bg-[#c5a47e] rounded-full"></span>
            Nuevo Registro
          </h2>
          <ClienteRegistrar />
        </section>

        {/* Sección de Consulta/Listado */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="w-2 h-8 bg-[#1a4731] rounded-full"></span>
            Listado de Clientes
          </h2>
          <ClienteConsultar />
        </section>
      </div>
    </div>
  );
}