import { NavBar } from "./NavBar";

export const RecepcionPanel = () => {
  return (
    <div className="p-10 bg-blue-50 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-700">📅 Panel de Recepción</h1>
      <p className="mt-4 text-gray-700 font-medium">Bienvenido al área de atención al cliente.</p>
      <div className="mt-6 p-4 bg-white shadow rounded border-blue-200 border">
        <p>Desde aquí puedes agendar citas y cobrar los pedidos.</p>
      </div>
      <NavBar/>
    </div>
  );
};