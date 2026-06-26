import ClienteRegistrar from "@modules/clientes/components/ClienteRegistrar";
import ClienteConsultar from "@modules/clientes/components/ClienteConsultar";

export default function GestionClientesPage() {
  return (
    <div className="p-4 md:p-8 dark:bg-[#0a0f0a]">
      {/* Encabezado con el estilo de Opti Samuel */}
      <div className="mb-8">
        <h1 className="text-xl md:text-3xl font-black text-[#1a4731] dark:text-emerald-100 uppercase tracking-tight">
          Gestión de Clientes
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Registro y consulta de base de datos de pacientes.
        </p>
      </div>

      <div className="space-y-12">
        {/* Sección de Registro */}
        <section className="bg-white dark:bg-[#1a2a20] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10">
          <h2 className="text-xl font-bold text-gray-800 dark:text-emerald-100 mb-6 flex items-center gap-2">
            <span className="w-2 h-8 bg-[#c5a47e] rounded-full"></span>
            Nuevo Registro
          </h2>
          <ClienteRegistrar />
        </section>

        {/* Sección de Consulta/Listado */}
        <section className="bg-white dark:bg-[#1a2a20] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10">
          <h2 className="text-xl font-bold text-gray-800 dark:text-emerald-100 mb-6 flex items-center gap-2">
            <span className="w-2 h-8 bg-[#1a4731] rounded-full"></span>
            Listado de Clientes
          </h2>
          <ClienteConsultar />
        </section>
      </div>
    </div>
  );
}