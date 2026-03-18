import { NavBar } from "./NavBar";

export const ConsultorioPanel = () => {
  return (
    <div className="p-10 bg-green-50 min-h-screen">
      <h1 className="text-3xl font-bold text-green-700">👁️ Consultorio Técnico</h1>
      <p className="mt-4 text-gray-700 font-medium">Listo para realizar exámenes de la vista.</p>
      <div className="mt-6 p-4 bg-white shadow rounded border-green-200 border">
        <p>Aquí registrarás las fórmulas médicas y diagnósticos de los pacientes.</p>
      </div>
      <NavBar/>
    </div>
    
  );
};