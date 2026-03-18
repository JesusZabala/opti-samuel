import { NavBar } from "./NavBar";

export const AdminPanel = () => {
  return (
    <div className="p-10 bg-red-50 min-h-screen">
      <h1 className="text-3xl font-bold text-red-700">🛡️ Panel de Administración</h1>
      <p className="mt-4 text-gray-700 font-medium">Hola, Administrador de Opti-Samuel.</p>
      <div className="mt-6 p-4 bg-white shadow rounded border-red-200 border">
        <p>Aquí podrás gestionar usuarios y ver las finanzas de la óptica.</p>
      </div>
      <NavBar/>
    </div>
  );
};