import CitaRegistrar from "@modules/citas/components/CitasRegistrar";
import CitaConsultar from "@modules/citas/components/CitasConsultar";

export default function GestionCitasPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-[#1a4731] mb-6">Gestión de Citas</h1>
      <div className="space-y-10">
        <CitaRegistrar />
        <hr />
        <CitaConsultar />
      </div>
    </div>
  );
}