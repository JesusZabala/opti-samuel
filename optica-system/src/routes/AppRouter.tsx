import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";
import Clientes from "../pages/recepcionista/Clientes";
import type { Role } from "@/types/roles";

const role: Role = "recepcionista"; // Usamos el tipo correcto

const AppRouter = () => {
  // Funciones temporales para que el Layout funcione
  const handleLogout = () => {
    console.log("Sesión cerrada");
  };

  const handleViewChange = (view: string) => {
    console.log("Cambiando a vista:", view);
  };

  return (
    <BrowserRouter>
      <DashboardLayout 
        role={role} 
        onLogout={handleLogout} 
        onViewChange={handleViewChange} 
        currentView="clientes"
      >
        <Routes>
          <Route path="/clientes" element={<Clientes />} />
        </Routes>
      </DashboardLayout>
    </BrowserRouter>
  );
};

export default AppRouter;