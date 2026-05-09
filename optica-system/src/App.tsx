import { useState, useEffect, useCallback } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import Login from "@/modules/auth/components/login";
import WelcomeScreen from "@/modules/auth/components/WelcomeScreen";
import LandingWelcome from "@/modules/auth/components/LandingWelcome";
import Sidebar from "@/layout/Sidebar";
import type { Role } from "@/types/roles";
import DashboardHome from "@/pages/dashboard/DashboardHome";
// Módulos Organizados
import ClienteRegistrar from "@modules/clientes/components/ClienteRegistrar";
import ClienteConsultar from "@modules/clientes/components/ClienteConsultar";
import ClienteEditar from "@modules/clientes/components/ClienteEditar";
import CitaRegistrar from "@modules/citas/components/CitasRegistrar";
import CitaConsultar from "@modules/citas/components/CitasConsultar";
import CitaEditar from "@modules/citas/components/CitasEditar";
import RecetaRegistrar from "@modules/recetas/components/RecetaRegistrar";
import RecetaConsultar from "@modules/recetas/components/RecetaConsultar";
import RecetaEditar from "@modules/recetas/components/RecetaEditar";
import PedidoRegistrar from "@modules/pedidos/components/PedidoRegistrar";
import PedidoConsultar from "@modules/pedidos/components/PedidoConsultar";
import PedidoEditar from "@modules/pedidos/components/PedidoEditar";
import EmpleadoRegistrar from "@modules/empleados/components/EmpleadoRegistrar";
import EmpleadoConsultar from "@modules/empleados/components/EmpleadoConsultar";
import EmpleadoEditar from "@modules/empleados/components/EmpleadoEditar";
import ModuloReportes from "./modules/reportes/components/Reportes";
import Auditoria from "./modules/auditoria/components/Auditoria";
import { authService } from "@/services/authService";
import { setUnauthorizedHandler } from "@/auth/authEvents";
import { authStorage } from "@/auth/authStorage";
import { roleCanAccessPath } from "@/auth/routeAccess";


/** Evita mostrar la landing tras F5 si ya hay sesión o el usuario pasó a login. */
const SKIP_LANDING_KEY = "optisamuel_skip_landing";

function shouldShowLanding(): boolean {
  if (authStorage.getAccessToken()) return false;
  try {
    if (sessionStorage.getItem(SKIP_LANDING_KEY) === "1") return false;
  } catch {
    /* sessionStorage no disponible */
  }
  return true;
}

function AuthenticatedApp({
  userRole,
  onLogout,
  goHomeAfterLogin,
  onGoHomeConsumed,
}: {
  userRole: Role;
  onLogout: () => void;
  goHomeAfterLogin: boolean;
  onGoHomeConsumed: () => void;
}) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (goHomeAfterLogin) {
      navigate("/", { replace: true });
      onGoHomeConsumed();
    }
  }, [goHomeAfterLogin, navigate, onGoHomeConsumed]);

  const allowed = roleCanAccessPath(userRole, location.pathname);

  return (
    <div className="min-h-screen flex">
      <Sidebar
        role={userRole}
        onLogout={onLogout}
      />

      <main className="flex-1 overflow-y-auto">
        {!allowed ? (
          <Navigate to="/" replace />
        ) : (
          <Routes>
            <Route path="/" element={<DashboardHome />} />

            {/* CLIENTES */}
            <Route path="/clientes/registrar" element={<ClienteRegistrar />} />
            <Route path="/clientes/consultar" element={<ClienteConsultar />} />
            <Route path="/clientes/editar" element={<ClienteEditar />} />

            {/* CITAS */}
            <Route path="/citas/registrar" element={<CitaRegistrar />} />
            <Route path="/citas/consultar" element={<CitaConsultar />} />
            <Route path="/citas/editar" element={<CitaEditar />} />

            {/* RECETAS */}
            <Route path="/recetas/registrar" element={<RecetaRegistrar />} />
            <Route path="/recetas/consultar" element={<RecetaConsultar />} />
            <Route path="/recetas/editar" element={<RecetaEditar />} />

            {/* PEDIDOS */}
            <Route path="/pedidos/registrar" element={<PedidoRegistrar />} />
            <Route path="/pedidos/consultar" element={<PedidoConsultar />} />
            <Route path="/pedidos/editar" element={<PedidoEditar />} />

            {/* EMPLEADOS */}
            <Route path="/empleados/registrar" element={<EmpleadoRegistrar />} />
            <Route path="/empleados/consultar" element={<EmpleadoConsultar />} />
            <Route path="/empleados/editar" element={<EmpleadoEditar />} />

            {/* REPORTES */}
            <Route path="/reportes" element={<ModuloReportes/>} />

            {/* AUDITORÍA */}
            <Route path="/auditoria" element={<Auditoria />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
      </main>
    </div>
  );
}

function App() {

  const [userRole, setUserRole] = useState<Role | null>(() => authService.restoreRoleFromStorage());
  const [loading, setLoading] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLanding, setShowLanding] = useState(shouldShowLanding);
  const [goHomeAfterLogin, setGoHomeAfterLogin] = useState(false);

  const handleGoHomeConsumed = useCallback(() => {
    setGoHomeAfterLogin(false);
  }, []);

  const handleLogin = (role: Role) => {
    setUserRole(role);
    setLoading(true);
    setGoHomeAfterLogin(true);
  };

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      try {
        sessionStorage.removeItem(SKIP_LANDING_KEY);
      } catch {
        /* ignore */
      }
      authService.logout();
      setUserRole(null);
      setShowLanding(shouldShowLanding());
      setIsLoggingOut(false);
    }, 2000);

  };

  useEffect(() => {
    setUnauthorizedHandler(() => {
      authService.logout();
      setUserRole(null);
    });
    return () => setUnauthorizedHandler(null);
  }, []);



  if (loading && userRole) {
    return <WelcomeScreen role={userRole} onFinish={() => setLoading(false)} />;

  }



  if (isLoggingOut && userRole) {
    return (
      <div className="animate-pulse">
        <WelcomeScreen role={userRole} onFinish={() => {}} />
        <div className="fixed inset-0 bg-[#1a4731]/80 z-50 flex items-center justify-center">
          <h2 className="text-white text-4xl font-black uppercase tracking-widest">
            Cerrando Sesión...
          </h2>
        </div>
      </div>
    );
  }

  if (showLanding) {
    return (
      <LandingWelcome
        onEnterLogin={() => {
          try {
            sessionStorage.setItem(SKIP_LANDING_KEY, "1");
          } catch {
            /* ignore */
          }
          setShowLanding(false);
        }}
      />
    );
  }

  if (!userRole) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <BrowserRouter>
      <AuthenticatedApp
        userRole={userRole}
        onLogout={handleLogout}
        goHomeAfterLogin={goHomeAfterLogin}
        onGoHomeConsumed={handleGoHomeConsumed}
      />
    </BrowserRouter>
  );

}



export default App;