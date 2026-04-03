import type { Role } from "../types/roles";
import Sidebar from "./Sidebar";

interface LayoutProps {
  role: Role;
  onLogout: () => void;
  children: React.ReactNode;
}

const DashboardLayout = ({ role, onLogout, children }: LayoutProps) => {
  return (
    <div className="flex min-h-screen">

      {/* SIDEBAR */}
      <Sidebar
        role={role}
        onLogout={onLogout}
      />

      {/* CONTENIDO DERECHO */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;