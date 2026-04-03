import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";
import Clientes from "../pages/recepcionista/Clientes";
import { Role } from "@/types/roles";

const role = Role.RECEPCIONISTA;

const AppRouter = () => {
  const handleLogout = () => {
    console.log("Sesión cerrada");
  };

  return (
    <BrowserRouter>
      <DashboardLayout role={role} onLogout={handleLogout}>
        <Routes>
          <Route path="/clientes" element={<Clientes />} />
        </Routes>
      </DashboardLayout>
    </BrowserRouter>
  );
};

export default AppRouter;
