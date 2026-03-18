import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Login } from './components/Login';
import { ProtectedRoute } from './components/ProtectedRoute.tsx';

import './App.css';

// Este componente será tu "Página de Inicio" real una vez logueado
const Dashboard = () => (
  <div className="p-10 text-center">
    <h1 className="text-3xl font-bold text-blue-600">Panel de Control Opti-Samuel</h1>
    <p className="mt-4 text-gray-600">Bienvenido al sistema de gestión de la óptica.</p>
    <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="p-6 bg-white shadow rounded-lg border">Citas de hoy</div>
      <div className="p-6 bg-white shadow rounded-lg border">Pedidos pendientes</div>
      <div className="p-6 bg-white shadow rounded-lg border">Inventario</div>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Si vas a /login, ves el componente de Login */}
          <Route path="/login" element={<Login />} />

          {/* Si vas a la raíz, el "guardia" revisa el token */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />

          {/* Si escribes cualquier otra cosa, te devuelve al inicio */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;